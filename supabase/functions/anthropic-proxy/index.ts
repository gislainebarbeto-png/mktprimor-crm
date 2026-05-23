import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }

  try {
    const { system, messages } = await req.json()

    const geminiKey = Deno.env.get('GEMINI_KEY') ?? ''

    if (!geminiKey) {
      return new Response(
        JSON.stringify({ error: { message: 'GEMINI_KEY não configurado nos secrets do Supabase' } }),
        { headers: { ...cors, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const body: Record<string, unknown> = { contents }
    if (system) {
      body.system_instruction = { parts: [{ text: system }] }
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: { message: `Gemini erro ${res.status}: ${JSON.stringify(data)}` } }),
        { headers: { ...cors, 'Content-Type': 'application/json' }, status: res.status }
      )
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    return new Response(
      JSON.stringify({ content: [{ type: 'text', text }] }),
      { headers: { ...cors, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: e.message } }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
