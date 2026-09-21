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
    const { action, email, password } = await req.json()
    if (!email) throw new Error('email é obrigatório')

    const db = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: list, error: listErr } = await db.auth.admin.listUsers({ page: 1, perPage: 1, email })
    if (listErr) throw new Error(listErr.message)
    const userId = list?.users?.[0]?.id

    if (action === 'confirm') {
      if (!userId) throw new Error('Usuário não encontrado no Auth. Use "Recriar acesso" para criar do zero.')
      const { error } = await db.auth.admin.updateUserById(userId, { email_confirm: true })
      if (error) throw new Error(error.message)
      return new Response(JSON.stringify({ success: true }), { headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    if (action === 'reset') {
      if (!password || password.length < 6) throw new Error('Senha deve ter pelo menos 6 caracteres.')
      if (userId) {
        const { error } = await db.auth.admin.updateUserById(userId, { password, email_confirm: true })
        if (error) throw new Error(error.message)
        return new Response(JSON.stringify({ success: true, created: false }), { headers: { ...cors, 'Content-Type': 'application/json' } })
      }
      const { error: createErr } = await db.auth.admin.createUser({ email, password, email_confirm: true })
      if (createErr) throw new Error(createErr.message)
      return new Response(JSON.stringify({ success: true, created: true }), { headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    throw new Error('action inválida (use "confirm" ou "reset")')
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
