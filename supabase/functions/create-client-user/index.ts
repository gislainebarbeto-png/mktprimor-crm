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
    const { nome, empresa, instagram, email, senha, foto_url } = await req.json()
    if (!nome || !email || !senha) throw new Error('nome, email e senha são obrigatórios')

    const db = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Cria o usuário no Supabase Auth (auto-confirmado, sem email de confirmação)
    const { data: authData, error: authErr } = await db.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { nome, empresa, instagram },
    })
    if (authErr) {
      if (authErr.message.includes('already registered') || authErr.message.includes('already been registered')) {
        throw new Error('Este e-mail já está cadastrado.')
      }
      throw new Error(authErr.message)
    }

    // Insere na tabela clients
    const { error: clErr } = await db.from('clients').insert([{
      nome, empresa, instagram, email, access_code: senha, foto_url: foto_url || null,
    }])
    if (clErr) {
      // Se falhou ao inserir o cliente, tenta desfazer o usuário Auth criado
      await db.auth.admin.deleteUser(authData.user.id)
      throw new Error('Erro ao salvar cliente: ' + clErr.message)
    }

    return new Response(JSON.stringify({ success: true, user_id: authData.user.id }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
