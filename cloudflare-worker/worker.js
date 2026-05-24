const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Converte ArrayBuffer em base64 em chunks (evita stack overflow em imagens grandes)
function bufToBase64(buf) {
  const bytes = new Uint8Array(buf)
  let bin = ''
  const chunk = 8192
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(bin)
}

// Baixa uma URL de imagem e retorna bloco base64 para a Anthropic
// Retorna null se falhar (imagem ignorada silenciosamente)
async function urlToBase64Block(url) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!r.ok) return null
    const buf = await r.arrayBuffer()
    const mime = r.headers.get('content-type') || 'image/jpeg'
    return { type: 'image', source: { type: 'base64', media_type: mime.split(';')[0], data: bufToBase64(buf) } }
  } catch {
    return null
  }
}

// Percorre as mensagens e converte imagens URL→base64 (resolve erro robots.txt da Anthropic)
async function resolveImages(messages) {
  const out = []
  for (const msg of messages) {
    if (!Array.isArray(msg.content)) { out.push(msg); continue }
    const blocks = []
    for (const blk of msg.content) {
      if (blk.type === 'image' && blk.source?.type === 'url') {
        const b64 = await urlToBase64Block(blk.source.url)
        if (b64) blocks.push(b64)
        // se falhou, ignora o bloco (não quebra a requisição)
      } else {
        blocks.push(blk)
      }
    }
    out.push({ ...msg, content: blocks })
  }
  return out
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

      // Converte imagens URL→base64 antes de enviar à Anthropic
      const resolvedMessages = await resolveImages(messages)

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
          messages: resolvedMessages,
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

      const text = await readAnthropicStream(res.body)

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
