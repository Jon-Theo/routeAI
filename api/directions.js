module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing ORS_API_KEY' });

  try {
    const profile = (req.query.profile || 'foot-walking').toString();
    const endpoint = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;

    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': apiKey },
      body: JSON.stringify(req.body || {})
    });

    const data = await upstream.text();
    res.status(upstream.status)
      .setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
      .send(data);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Proxy error' });
  }
}

module.exports.config = { runtime: 'nodejs20.x' };

