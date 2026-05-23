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

      // Timeout de 25s para não estourar o limite de 30s do Cloudflare Workers
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 25000)

      let res
      try {
        res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            system,
            messages,
          }),
        })
      } finally {
        clearTimeout(timer)
      }

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        return new Response(
          JSON.stringify({ error: { message: `Resposta inválida da Anthropic (status ${res.status})` } }),
          { headers: { ...CORS, 'Content-Type': 'application/json' }, status: 502 }
        )
      }

      return new Response(JSON.stringify(data), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
        status: res.status,
      })
    } catch (e) {
      const msg = e.name === 'AbortError'
        ? 'Timeout: Anthropic demorou mais de 25s. Tente uma pergunta mais curta.'
        : e.message
      return new Response(JSON.stringify({ error: { message: msg } }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
        status: 504,
      })
    }
  },
}
