export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing ORS_API_KEY environment variable' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const url = new URL(request.url);
    const { type, lon, lat, text } = Object.fromEntries(url.searchParams);
    
    let orsUrl;
    if (type === 'reverse') {
      orsUrl = `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lon=${lon}&point.lat=${lat}`;
    } else {
      orsUrl = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(text || '')}`;
    }

    const response = await fetch(orsUrl);
    const data = await response.text();
    
    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('content-type') || 'application/json'
      }
    });
      
  } catch (error) {
    console.error('Geocode API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}