export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing ORS_API_KEY environment variable' });
  }

  try {
    const { type, lon, lat, text } = req.query;
    
    let url;
    if (type === 'reverse') {
      url = `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lon=${lon}&point.lat=${lat}`;
    } else {
      url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(text || '')}`;
    }

    const response = await fetch(url);
    const data = await response.text();
    
    res.status(response.status)
      .setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
      .send(data);
      
  } catch (error) {
    console.error('Geocode API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
