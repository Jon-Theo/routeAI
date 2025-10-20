export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
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
    const profile = url.searchParams.get('profile') || 'foot-walking';
    const orsUrl = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
    
    const body = await request.text();
    
    const response = await fetch(orsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: body
    });

    const data = await response.text();
    
    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('content-type') || 'application/json'
      }
    });
      
  } catch (error) {
    console.error('Directions API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}