const https = require('https');

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing ORS_API_KEY' });
  }

  const profile = req.query.profile || 'foot-walking';
  const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
  
  const postData = JSON.stringify(req.body);
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
      'Content-Length': Buffer.byteLength(postData)
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

  proxyReq.write(postData);
  proxyReq.end();
};
