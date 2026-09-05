export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')

  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Allow', 'GET')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const required = [
    'ARTIFICIAL_ANALYSIS_API_KEY',
    'OPENROUTER_API_KEY',
    'MODEL_SELECTOR_ACCESS_TOKEN',
  ]
  const configured = Object.fromEntries(
    required.map((key) => [key, Boolean(process.env[key])]),
  )

  res.statusCode = Object.values(configured).every(Boolean) ? 200 : 503
  res.end(JSON.stringify({
    ok: res.statusCode === 200,
    configured,
    service: 'model-selector',
  }))
}
