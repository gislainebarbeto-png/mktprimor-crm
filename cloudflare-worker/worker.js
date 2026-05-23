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
          max_tokens: 4096,
          stream: true,
          system,
          messages,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        let errData
        try { errData = JSON.parse(errText) } catch { errData = { error: { message: errText } } }
        return new Response(JSON.stringify(errData), {
          headers: { ...CORS, 'Content-Type': 'application/json' },
          status: res.status,
        })
      }

      // Passa o stream SSE da Anthropic direto para o browser
      return new Response(res.body, {
        headers: { ...CORS, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
        status: 200,
      })
    } catch (e) {
      return new Response(JSON.stringify({ error: { message: e.message } }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
        status: 500,
      })
    }
  },
}
