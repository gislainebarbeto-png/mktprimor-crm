import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ADMIN_EMAIL = 'gislainebarbeto@gmail.com'

// Valida o JWT do chamador e confirma que é o email admin.
// Lança erro se não houver sessão válida ou se não for o admin.
export async function requireAdmin(req: Request) {
  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) throw new Error('Não autenticado.')

  const anon = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  )
  const { data, error } = await anon.auth.getUser(token)
  if (error || !data?.user?.email) throw new Error('Sessão inválida.')
  if (data.user.email.toLowerCase() !== ADMIN_EMAIL) throw new Error('Acesso restrito ao admin.')

  return data.user
}
