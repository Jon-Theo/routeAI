module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing ORS_API_KEY' });

  try {
    const { type } = req.query;
    const base = 'https://api.openrouteservice.org/geocode';
    let url;
    if (type === 'reverse') {
      const { lon, lat } = req.query;
      url = `${base}/reverse?api_key=${apiKey}&point.lon=${lon}&point.lat=${lat}`;
    } else {
      const { text } = req.query;
      url = `${base}/search?api_key=${apiKey}&text=${encodeURIComponent(text || '')}`;
    }

    const upstream = await fetch(url);
    const data = await upstream.text();
    res.status(upstream.status)
      .setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
      .send(data);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Proxy error' });
  }
}

module.exports.config = { runtime: 'nodejs20.x' };

