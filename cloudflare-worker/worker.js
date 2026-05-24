const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Lê stream SSE da Anthropic e retorna o texto completo
async function readAnthropicStream(body) {
  const reader = body.getReader()
  const dec = new TextDecoder()
  let text = '', buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop()
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const d = line.slice(6).trim()
      if (d === '[DONE]') return text
      try {
        const p = JSON.parse(d)
        if (p.type === 'content_block_delta' && p.delta?.type === 'text_delta') text += p.delta.text
        if (p.type === 'error') throw new Error(p.error?.message || 'Anthropic stream error')
      } catch (e) {
        if (e.message.includes('stream error')) throw e
      }
    }
  }
  return text
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

      // Lê o stream internamente — evita timeout sem precisar de streaming externo
      const text = await readAnthropicStream(res.body)

      // Retorna JSON no formato Anthropic — compatível com todo o frontend
      return new Response(
        JSON.stringify({ content: [{ type: 'text', text }] }),
        { headers: { ...CORS, 'Content-Type': 'application/json' }, status: 200 }
      )
    } catch (e) {
      return new Response(JSON.stringify({ error: { message: e.message } }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
        status: 500,
      })
    }
  },
}
