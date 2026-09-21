import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { requireAdmin } from '../_shared/auth.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    await requireAdmin(req)
    const { client_id, client_email, ig_user_id, access_token, ig_username } = await req.json()
    if (!client_id || !client_email || !ig_user_id || !access_token) {
      throw new Error('client_id, client_email, ig_user_id e access_token são obrigatórios')
    }

    const db = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    await db.from('clients').update({ instagram_token: access_token, instagram_account_id: ig_user_id }).eq('id', client_id)
    const { error } = await db.from('instagram_tokens').upsert({
      client_email, ig_user_id, ig_username: ig_username || '',
      access_token, updated_at: new Date().toISOString(),
    }, { onConflict: 'client_email' })
    if (error) throw new Error(error.message)

    return new Response(JSON.stringify({ success: true }), { headers: { ...cors, 'Content-Type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
