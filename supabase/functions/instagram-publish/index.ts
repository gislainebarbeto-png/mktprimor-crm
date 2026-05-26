import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { client_email, image_url, video_url, caption, media_urls } = await req.json()

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

    // ── Carrossel (múltiplas imagens) ───────────────────────────────────
    if (isCarousel) {
      const childIds: string[] = []
      for (const url of media_urls) {
        const r = await fetch(`${BASE}/${ig_user_id}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ image_url: url, is_carousel_item: 'true', access_token }),
        })
        const child = await r.json()
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

      const r3 = await fetch(`${BASE}/${ig_user_id}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ creation_id: carousel.id, access_token }),
      })
      const pub = await r3.json()
      if (pub.error) throw new Error('Erro ao publicar carrossel: ' + pub.error.message)

      return new Response(JSON.stringify({ success: true, media_id: pub.id, ig_username: tok.ig_username }), {
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // ── Imagem única ─────────────────────────────────────────────────────
    if (!isVideo) {
      const r1 = await fetch(`${BASE}/${ig_user_id}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          image_url: image_url || '',
          caption:   caption || '',
          access_token,
        }),
      })
      const container = await r1.json()
      if (container.error) throw new Error('Erro ao criar container de imagem: ' + container.error.message)

      const r2 = await fetch(`${BASE}/${ig_user_id}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ creation_id: container.id, access_token }),
      })
      const pub = await r2.json()
      if (pub.error) throw new Error('Erro ao publicar imagem: ' + pub.error.message)

      return new Response(JSON.stringify({ success: true, media_id: pub.id, ig_username: tok.ig_username }), {
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // ── Vídeo / Reels ────────────────────────────────────────────────────
    const r1 = await fetch(`${BASE}/${ig_user_id}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        media_type:    'REELS',
        video_url:     video_url,
        caption:       caption || '',
        share_to_feed: 'true',
        access_token,
      }),
    })
    const container = await r1.json()
    if (container.error) throw new Error('Erro ao criar container de vídeo: ' + container.error.message)

    // Aguarda processamento (obrigatório para vídeos)
    await pollVideoStatus(container.id, access_token)

    const r2 = await fetch(`${BASE}/${ig_user_id}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ creation_id: container.id, access_token }),
    })
    const pub = await r2.json()
    if (pub.error) throw new Error('Erro ao publicar vídeo: ' + pub.error.message)

    return new Response(JSON.stringify({ success: true, media_id: pub.id, ig_username: tok.ig_username }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
