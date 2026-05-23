const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: CORS })
    }

    try {
      const { system, messages } = await req.json()

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 8192,
          system,
          messages,
        }),
      })

      const data = await res.json()

      return new Response(JSON.stringify(data), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
        status: res.status,
      })
    } catch (e) {
      return new Response(JSON.stringify({ error: { message: e.message } }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
        status: 500,
      })
    }
  },
}
