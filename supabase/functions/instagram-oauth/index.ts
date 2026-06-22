import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BASE = 'https://graph.facebook.com/v21.0'

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const body = await req.json()
    const { code, client_email, fb_page_id, user_token: passedToken, list_only } = body

    const APP_ID     = Deno.env.get('META_APP_ID')
    const APP_SECRET = Deno.env.get('META_APP_SECRET')
    const REDIRECT   = Deno.env.get('META_REDIRECT_URI') || 'https://crm.marketingprimor.com.br/'

    if (!APP_ID || !APP_SECRET) {
      throw new Error('Secrets META_APP_ID / META_APP_SECRET não estão configurados no Supabase. Adicione em Settings → Edge Functions → Secrets.')
    }

    // ── 1. Obter user token ──────────────────────────────────────────────
    let userToken = passedToken || ''

    if (!userToken && code) {
      // Troca code (curta duração) por short-lived user token
      const r1 = await fetch(`${BASE}/oauth/access_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id:    APP_ID,
          client_secret: APP_SECRET,
          grant_type:   'authorization_code',
          redirect_uri: REDIRECT,
          code,
        }),
      })
      const short = await r1.json()
      if (short.error) {
        throw new Error('Erro na troca de código: ' + (short.error.message || JSON.stringify(short.error)))
      }

      // Converte para long-lived token (~60 dias)
      const r2 = await fetch(
        `${BASE}/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${short.access_token}`
      )
      const long = await r2.json()
      if (long.error) {
        throw new Error('Erro no token long-lived: ' + (long.error.message || JSON.stringify(long.error)))
      }
      userToken = long.access_token
    }

    if (!userToken) throw new Error('Nenhum token disponível. Refaça o processo de autorização.')

    // ── 2. Listar páginas com Instagram Business ─────────────────────────
    const accsRes = await fetch(
      `${BASE}/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${userToken}&limit=20`
    )
    const accs = await accsRes.json()
    if (accs.error) {
      throw new Error('Erro ao listar páginas do Facebook: ' + (accs.error.message || JSON.stringify(accs.error)))
    }

    const pages = (accs.data || []).filter((p: any) => p.instagram_business_account?.id)

    if (pages.length === 0) {
      const allNames = (accs.data || []).map((p: any) => p.name).join(', ')
      throw new Error(
        `Nenhuma página com Instagram Business encontrada. ` +
        `Páginas do Facebook: ${allNames || 'nenhuma'}. ` +
        `O Instagram precisa ser uma Conta Profissional e estar vinculado a uma Página do Facebook.`
      )
    }

    // Modo lista — retorna páginas + token reutilizável
    if (list_only) {
      return new Response(JSON.stringify({
        user_token: userToken,
        pages: pages.map((p: any) => ({
          fb_page_id:   p.id,
          fb_page_name: p.name,
          ig_id:        p.instagram_business_account.id,
          ig_username:  p.instagram_business_account.username,
        })),
      }), { headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    // ── 3. Selecionar página e salvar token ──────────────────────────────
    const page = fb_page_id
      ? pages.find((p: any) => p.id === String(fb_page_id))
      : pages[0]

    if (!page) {
      throw new Error(`Página "${fb_page_id}" não encontrada. Escolha uma das páginas disponíveis.`)
    }

    const pageToken  = page.access_token
    const igId       = page.instagram_business_account.id
    const igUsername = page.instagram_business_account.username

    // Expiração estimada (long-lived = 60 dias)
    const expiresAt = new Date(Date.now() + 58 * 24 * 60 * 60 * 1000).toISOString()

    const db = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error: tokErr } = await db.from('instagram_tokens').upsert({
      client_email,
      ig_user_id:   igId,
      ig_username:  igUsername,
      access_token: pageToken,
      expires_at:   expiresAt,
      updated_at:   new Date().toISOString(),
    }, { onConflict: 'client_email' })

    if (tokErr) throw new Error('Erro ao salvar token: ' + tokErr.message)

    await db.from('clients').update({
      instagram_token:      pageToken,
      instagram_account_id: igId,
    }).eq('email', client_email)

    return new Response(JSON.stringify({
      success:     true,
      ig_username: igUsername,
      ig_id:       igId,
    }), { headers: { ...cors, 'Content-Type': 'application/json' } })

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
