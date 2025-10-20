export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing ORS_API_KEY environment variable' });
  }

  try {
    const profile = req.query.profile || 'foot-walking';
    const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.text();
    
    res.status(response.status)
      .setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
      .send(data);
      
  } catch (error) {
    console.error('Directions API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
