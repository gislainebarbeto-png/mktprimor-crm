import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { email, password, nome, cargo, foto_url, telefone } = await req.json()
    if (!email || !password || !nome) throw new Error('email, password e nome são obrigatórios')

    const db = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Cria o usuário no Supabase Auth (auto-confirmado, sem email de confirmação)
    const { data: authData, error: authErr } = await db.auth.admin.createUser({
      email,
      password,
      user_metadata: { nome },
      email_confirm: true,
    })
    if (authErr) {
      if (authErr.message.includes('already registered') || authErr.message.includes('already been registered')) {
        throw new Error('Este e-mail já está cadastrado no sistema.')
      }
      throw new Error(authErr.message)
    }

    // Insere na tabela equipe
    const { error: eqErr } = await db.from('equipe').insert([{
      email,
      nome,
      cargo: cargo || 'operacional',
      permissoes: {},
      ativo: true,
      foto_url: foto_url || null,
      telefone: telefone || null,
    }])
    if (eqErr) {
      // Se falhou ao inserir na equipe, tenta deletar o usuário Auth criado
      await db.auth.admin.deleteUser(authData.user.id)
      throw new Error('Erro ao salvar na equipe: ' + eqErr.message)
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
