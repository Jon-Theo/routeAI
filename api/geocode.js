const https = require('https');

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing ORS_API_KEY' });
  }

  const { type, lon, lat, text } = req.query;
  
  let url;
  if (type === 'reverse') {
    url = `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lon=${lon}&point.lat=${lat}`;
  } else {
    url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(text || '')}`;
  }

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const proxyReq = https.request(url, options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => {
      data += chunk;
    });
    proxyRes.on('end', () => {
      res.status(proxyRes.statusCode)
        .setHeader('Content-Type', proxyRes.headers['content-type'] || 'application/json')
        .send(data);
    });
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error' });
  });

  proxyReq.end();
};
