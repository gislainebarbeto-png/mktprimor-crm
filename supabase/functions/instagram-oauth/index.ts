import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { code, client_email, fb_page_id } = await req.json()

    const APP_ID     = Deno.env.get('META_APP_ID')!
    const APP_SECRET = Deno.env.get('META_APP_SECRET')!
    const REDIRECT   = Deno.env.get('META_REDIRECT_URI')!

    // 1. Troca code por short-lived user token
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

    // 2. Troca por long-lived user token
    const t2 = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${short.access_token}`
    )
    const longUser = await t2.json()
    if (longUser.error) throw new Error(longUser.error.message || 'Erro no token de longa duração')

    const userToken = longUser.access_token

    // 3. Tenta acessar a página diretamente com o token do usuário
    let pageToken: string | null = null
    let pageName = ''
    let igId: string | null = null

    if (fb_page_id) {
      const directPage = await fetch(
        `https://graph.facebook.com/v19.0/${fb_page_id}?fields=id,name,access_token,instagram_business_account&access_token=${userToken}`
      ).then(r => r.json())

      if (!directPage.error && directPage.access_token) {
        pageToken = directPage.access_token
        pageName = directPage.name
        igId = directPage.instagram_business_account?.id || null
      }
    }

    // 4. Se não conseguiu acesso direto, tenta /me/accounts
    if (!pageToken) {
      const accts = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${userToken}`
      ).then(r => r.json())

      const pages = accts.data || []
      const page = fb_page_id
        ? pages.find((p: any) => p.id === String(fb_page_id))
        : pages[0]

      if (page) {
        pageToken = page.access_token
        pageName = page.name
        igId = page.instagram_business_account?.id || null
      } else {
        const ids = pages.map((p: any) => `${p.name} (${p.id})`).join(', ')
        throw new Error(
          `Conta do Facebook usada não tem acesso à página da clínica.\n` +
          `Páginas encontradas: ${ids || 'nenhuma'}.\n\n` +
          `Solução: a própria cliente deve clicar em "Conectar com Facebook" no portal dela, ` +
          `usando o login do Facebook da clínica.`
        )
      }
    }

    // 5. Busca IG Account se ainda não tiver
    if (!igId) {
      const igLookup = await fetch(
        `https://graph.facebook.com/v19.0/${fb_page_id || ''}?fields=instagram_business_account&access_token=${pageToken}`
      ).then(r => r.json())
      igId = igLookup.instagram_business_account?.id || null
    }

    if (!igId) throw new Error(
      `Nenhuma conta Instagram Business vinculada à página "${pageName}". ` +
      `No Instagram da clínica: Configurações → Conta → Mudar para conta profissional, ` +
      `depois vincule ao Facebook em Configurações → Conta → Conta vinculada ao Facebook.`
    )

    // 6. Busca username do Instagram
    const igUser = await fetch(
      `https://graph.facebook.com/v19.0/${igId}?fields=id,username&access_token=${pageToken}`
    ).then(r => r.json())
    if (igUser.error) throw new Error(igUser.error.message)

    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // 7. Salva em instagram_tokens e em clients
    const { error: tokErr } = await db.from('instagram_tokens').upsert({
      client_email, ig_user_id: igId, ig_username: igUser.username,
      access_token: pageToken, expires_at: null, updated_at: new Date().toISOString(),
    }, { onConflict: 'client_email' })
    if (tokErr) throw new Error('Erro ao salvar token: ' + tokErr.message)

    await db.from('clients').update({
      instagram_token: pageToken,
      instagram_account_id: igId,
    }).eq('email', client_email)

    return new Response(
      JSON.stringify({ success: true, ig_username: igUser.username, ig_id: igId }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { headers: { ...cors, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
