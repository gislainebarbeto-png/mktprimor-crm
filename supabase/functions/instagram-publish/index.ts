import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { requireAdmin } from '../_shared/auth.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BASE = 'https://graph.facebook.com/v21.0'

// Aguarda processamento de vídeo no Meta (máximo ~90s)
async function pollVideoStatus(containerId: string, token: string): Promise<void> {
  const MAX_TRIES = 18
  const DELAY_MS  = 5000
  for (let i = 0; i < MAX_TRIES; i++) {
    await new Promise(r => setTimeout(r, DELAY_MS))
    const r = await fetch(`${BASE}/${containerId}?fields=status_code,status&access_token=${token}`)
    const data = await r.json()
    if (data.status_code === 'FINISHED') return
    if (data.status_code === 'ERROR' || data.status_code === 'EXPIRED') {
      throw new Error(`Erro no processamento do vídeo: ${data.status || data.status_code}`)
    }
  }
  throw new Error('Tempo esgotado aguardando processamento do vídeo. Tente novamente.')
}

// Aguarda o container ficar pronto. Fotos (principalmente de Stories) também levam alguns segundos;
// publicar antes disso dá "Media ID is not available".
async function esperarContainer(containerId: string, token: string, maxMs = 25000): Promise<void> {
  const ini = Date.now()
  let espera = 1500
  while (Date.now() - ini < maxMs) {
    await new Promise(r => setTimeout(r, espera))
    const r = await fetch(`${BASE}/${containerId}?fields=status_code,status&access_token=${token}`)
    const d = await r.json()
    if (d.status_code === 'FINISHED' || d.status_code === 'PUBLISHED') return
    if (d.status_code === 'ERROR' || d.status_code === 'EXPIRED') {
      throw new Error(`O Instagram não conseguiu processar a mídia: ${d.status || d.status_code}`)
    }
    if (d.error || !d.status_code) return   // campo indisponível: deixa o media_publish tentar
    espera = Math.min(espera + 1000, 4000)
  }
}

// Publica o container; se o Instagram ainda disser que a mídia não está pronta, espera e tenta de novo
async function publicarContainer(igUserId: string, creationId: string, token: string): Promise<any> {
  for (let i = 0; i < 5; i++) {
    const r = await fetch(`${BASE}/${igUserId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ creation_id: creationId, access_token: token }),
    })
    const pub = await r.json()
    const e = pub.error
    const naoPronto = e && (e.code === 9007 || e.error_subcode === 2207027 || /not available|not ready/i.test(String(e.message || '')))
    if (!naoPronto) return pub
    await new Promise(r => setTimeout(r, 3000))
  }
  // conta o que o Instagram diz da mídia, para saber o motivo
  let st = ''
  try {
    const r = await fetch(`${BASE}/${creationId}?fields=status_code,status&access_token=${token}`)
    const d = await r.json(); st = [d.status_code, d.status].filter(Boolean).join(' · ')
  } catch (_) { /* sem detalhe */ }
  return { error: { message: 'O Instagram não terminou de processar a mídia' + (st ? ` (${st})` : '') + '. Confira se a imagem é JPG e tem menos de 8 MB, e tente de novo.' } }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    await requireAdmin(req)
    const { client_email, image_url, video_url, caption, media_urls, alt_text, story_url, cover_url } = await req.json()
    const alt = typeof alt_text === 'string' ? alt_text.trim().slice(0, 1000) : ''
    let altIgnorado = false

    // Cria um container de imagem com texto alternativo; se o Instagram recusar o alt_text, tenta sem ele
    async function criarImagem(igUserId: string, token: string, campos: Record<string, string>) {
      const enviar = async (comAlt: boolean) => {
        const body = new URLSearchParams({ ...campos, access_token: token })
        if (comAlt) body.set('alt_text', alt)
        const r = await fetch(`${BASE}/${igUserId}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body,
        })
        return await r.json()
      }
      let res = await enviar(Boolean(alt))
      if (res.error && alt) {
        const sem = await enviar(false)
        if (!sem.error) altIgnorado = true
        res = sem
      }
      return res
    }

    const db = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Busca token do cliente
    const { data: tok, error: tokErr } = await db
      .from('instagram_tokens')
      .select('ig_user_id, access_token, ig_username')
      .eq('client_email', client_email)
      .single()

    if (tokErr || !tok) {
      throw new Error('Instagram não conectado para este cliente. Conecte primeiro na ficha do cliente.')
    }

    const { ig_user_id, access_token } = tok
    const isVideo = Boolean(video_url)
    const isCarousel = Array.isArray(media_urls) && media_urls.length > 1

    // ── Stories (uma foto ou um vídeo por vez; Stories não tem legenda) ──
    if (story_url) {
      const storyVideo = /\.(mp4|mov|webm|m4v)(\?|$)/i.test(String(story_url))
      const campos: Record<string, string> = { media_type: 'STORIES', access_token }
      if (storyVideo) campos.video_url = story_url
      else campos.image_url = story_url
      const r1 = await fetch(`${BASE}/${ig_user_id}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(campos),
      })
      const container = await r1.json()
      if (container.error) throw new Error('Erro ao criar o Stories: ' + container.error.message)
      if (storyVideo) await pollVideoStatus(container.id, access_token)
      else await esperarContainer(container.id, access_token)

      const pub = await publicarContainer(ig_user_id, container.id, access_token)
      if (pub.error) throw new Error('Erro ao publicar o Stories: ' + pub.error.message)

      return new Response(JSON.stringify({ success: true, story: true, media_id: pub.id, ig_username: tok.ig_username }), {
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // ── Carrossel (múltiplas imagens) ───────────────────────────────────
    if (isCarousel) {
      const childIds: string[] = []
      for (const url of media_urls) {
        const child = await criarImagem(ig_user_id, access_token, { image_url: url, is_carousel_item: 'true' })
        if (child.error) throw new Error('Erro no item do carrossel: ' + child.error.message)
        childIds.push(child.id)
      }
      const r2 = await fetch(`${BASE}/${ig_user_id}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          media_type:    'CAROUSEL',
          children:      childIds.join(','),
          caption:       caption || '',
          access_token,
        }),
      })
      const carousel = await r2.json()
      if (carousel.error) throw new Error('Erro ao criar carrossel: ' + carousel.error.message)

      await esperarContainer(carousel.id, access_token)
      const pub = await publicarContainer(ig_user_id, carousel.id, access_token)
      if (pub.error) throw new Error('Erro ao publicar carrossel: ' + pub.error.message)

      return new Response(JSON.stringify({ success: true, media_id: pub.id, ig_username: tok.ig_username, alt_ignorado: altIgnorado }), {
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // ── Imagem única ─────────────────────────────────────────────────────
    if (!isVideo) {
      const container = await criarImagem(ig_user_id, access_token, {
        image_url: image_url || '',
        caption:   caption || '',
      })
      if (container.error) throw new Error('Erro ao criar container de imagem: ' + container.error.message)

      await esperarContainer(container.id, access_token)
      const pub = await publicarContainer(ig_user_id, container.id, access_token)
      if (pub.error) throw new Error('Erro ao publicar imagem: ' + pub.error.message)

      return new Response(JSON.stringify({ success: true, media_id: pub.id, ig_username: tok.ig_username, alt_ignorado: altIgnorado }), {
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // ── Vídeo / Reels ────────────────────────────────────────────────────
    const r1 = await fetch(`${BASE}/${ig_user_id}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: (() => {
        const b = new URLSearchParams({
          media_type:    'REELS',
          video_url:     video_url,
          caption:       caption || '',
          share_to_feed: 'true',
          access_token,
        })
        // Capa escolhida no CRM (imagem). Sem ela, o Instagram usa um quadro do vídeo.
        if (cover_url) b.set('cover_url', String(cover_url))
        return b
      })(),
    })
    const container = await r1.json()
    if (container.error) throw new Error('Erro ao criar container de vídeo: ' + container.error.message)

    // Aguarda processamento (obrigatório para vídeos)
    await pollVideoStatus(container.id, access_token)

    const pub = await publicarContainer(ig_user_id, container.id, access_token)
    if (pub.error) throw new Error('Erro ao publicar vídeo: ' + pub.error.message)

    return new Response(JSON.stringify({ success: true, media_id: pub.id, ig_username: tok.ig_username, alt_ignorado: altIgnorado, capa_usada: Boolean(cover_url) }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
