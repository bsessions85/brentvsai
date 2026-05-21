// /api/claude — Proxy for Anthropic API calls
// Keeps the API key server-side and avoids CORS issues.
//
// Required Vercel environment variable:
//   ANTHROPIC_API_KEY — from console.anthropic.com

export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Return method + env check for any request so we can diagnose
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: true, method: req.method, hasKey: !!apiKey }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'body parse failed', detail: e.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Anthropic fetch failed', detail: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
