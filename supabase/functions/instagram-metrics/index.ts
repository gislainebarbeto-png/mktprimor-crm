import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { client_email } = await req.json()
    if (!client_email) throw new Error('client_email é obrigatório')

    const db = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Busca token salvo pelo fluxo OAuth
    const { data: tok, error: tokErr } = await db
      .from('instagram_tokens')
      .select('ig_user_id, access_token, ig_username')
      .eq('client_email', client_email)
      .single()

    if (tokErr || !tok) {
      throw new Error('Instagram não conectado para este cliente. Faça o OAuth primeiro via Clientes → Conectar Instagram.')
    }

    const { ig_user_id, access_token, ig_username } = tok
    const BASE = 'https://graph.facebook.com/v19.0'

    // 1. Seguidores e total de posts
    const profile = await fetch(
      `${BASE}/${ig_user_id}?fields=followers_count,media_count&access_token=${access_token}`
    ).then(r => r.json())

    if (profile.error) throw new Error('Meta API (perfil): ' + profile.error.message)
    const seguidores: number = profile.followers_count || 0

    // 2. Insights mensais — alcance, impressões, visitas ao perfil
    const now = new Date()
    const since = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000)
    const until = Math.floor(now.getTime() / 1000)

    const insights = await fetch(
      `${BASE}/${ig_user_id}/insights?metric=impressions,reach,profile_views&period=day&since=${since}&until=${until}&access_token=${access_token}`
    ).then(r => r.json())

    let impressoes = 0, alcance = 0, visitasPerfil = 0
    if (!insights.error && insights.data) {
      for (const metric of insights.data) {
        const total = (metric.values || []).reduce((sum: number, v: any) => sum + (v.value || 0), 0)
        if (metric.name === 'impressions') impressoes = total
        else if (metric.name === 'reach') alcance = total
        else if (metric.name === 'profile_views') visitasPerfil = total
      }
    }

    // 3. Engajamento médio dos últimos 20 posts
    const media = await fetch(
      `${BASE}/${ig_user_id}/media?fields=id,like_count,comments_count&limit=20&access_token=${access_token}`
    ).then(r => r.json())

    let engajamento = 0
    if (!media.error && media.data?.length) {
      const totalInteracoes = media.data.reduce(
        (sum: number, p: any) => sum + (p.like_count || 0) + (p.comments_count || 0), 0
      )
      const mediaInteracoes = totalInteracoes / media.data.length
      engajamento = seguidores > 0
        ? parseFloat(((mediaInteracoes / seguidores) * 100).toFixed(2))
        : 0
    }

    const mes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const hoje = now.toISOString().substring(0, 10)

    // 4. Upsert na tabela metricas (resumo mensal usado pelo admin)
    const metPayload = { client_email, mes, seguidores, alcance, impressoes, engajamento }
    const { data: existing } = await db
      .from('metricas').select('id').eq('client_email', client_email).eq('mes', mes)
    if (existing?.length) {
      await db.from('metricas').update(metPayload).eq('id', existing[0].id)
    } else {
      await db.from('metricas').insert([metPayload])
    }

    // 5. Upsert na tabela metricas_instagram (granularidade diária, exibida no portal)
    await db.from('metricas_instagram').upsert({
      client_email,
      data: hoje,
      seguidores,
      alcance,
      impressoes,
      engajamento,
      visitas_perfil: visitasPerfil,
    }, { onConflict: 'client_email,data' })

    return new Response(JSON.stringify({
      success: true,
      ig_username,
      seguidores,
      alcance,
      impressoes,
      engajamento,
      visitas_perfil: visitasPerfil,
      mes,
    }), { headers: { ...cors, 'Content-Type': 'application/json' } })

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
