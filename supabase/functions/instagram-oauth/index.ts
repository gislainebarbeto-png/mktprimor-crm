import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const body = await req.json()
    const { code, client_email, fb_page_id, user_token: passedUserToken, list_only } = body

    const APP_ID     = Deno.env.get('META_APP_ID')!
    const APP_SECRET = Deno.env.get('META_APP_SECRET')!
    const REDIRECT   = Deno.env.get('META_REDIRECT_URI')!

    let userToken = passedUserToken || ''

    // Troca code por long-lived user token (apenas se não vier token direto)
    if (!userToken && code) {
      const t1 = await fetch('https://graph.facebook.com/v19.0/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: APP_ID, client_secret: APP_SECRET,
          grant_type: 'authorization_code', redirect_uri: REDIRECT, code,
        }),
      })
      const short = await t1.json()
      if (short.error) throw new Error(short.error.message || 'Erro na troca de código Facebook')

      const t2 = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${short.access_token}`
      )
      const longUser = await t2.json()
      if (longUser.error) throw new Error(longUser.error.message || 'Erro no token de longa duração')
      userToken = longUser.access_token
    }

    if (!userToken) throw new Error('Token de acesso não encontrado.')

    // Lista todas as páginas com Instagram Business conectado
    const accts = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${userToken}`
    ).then(r => r.json())

    const pages = (accts.data || []).filter((p: any) => p.instagram_business_account?.id)

    // Modo lista: retorna páginas + user_token para segunda chamada usar sem re-trocar o code
    if (list_only) {
      return new Response(
        JSON.stringify({
          user_token: userToken,
          pages: pages.map((p: any) => ({
            fb_page_id: p.id,
            fb_page_name: p.name,
            ig_id: p.instagram_business_account.id,
            ig_username: p.instagram_business_account.username,
          }))
        }),
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      )
    }

    // Seleciona a página correta
    const page = fb_page_id
      ? pages.find((p: any) => p.id === String(fb_page_id))
      : pages[0]

    if (!page) {
      const allPages = (accts.data || []).map((p: any) => p.name).join(', ')
      throw new Error(
        `Nenhuma página com Instagram Business encontrada.\n` +
        `Páginas encontradas: ${allPages || 'nenhuma'}.\n` +
        `Certifique-se que o Instagram está configurado como conta Profissional e vinculado à Página do Facebook.`
      )
    }

    const pageToken  = page.access_token
    const igId       = page.instagram_business_account.id
    const igUsername = page.instagram_business_account.username

    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { error: tokErr } = await db.from('instagram_tokens').upsert({
      client_email, ig_user_id: igId, ig_username: igUsername,
      access_token: pageToken, expires_at: null, updated_at: new Date().toISOString(),
    }, { onConflict: 'client_email' })
    if (tokErr) throw new Error('Erro ao salvar token: ' + tokErr.message)

    await db.from('clients').update({
      instagram_token: pageToken,
      instagram_account_id: igId,
    }).eq('email', client_email)

    return new Response(
      JSON.stringify({ success: true, ig_username: igUsername, ig_id: igId }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { headers: { ...cors, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
