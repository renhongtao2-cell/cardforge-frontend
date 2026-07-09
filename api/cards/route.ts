export async function GET(request) {
  const url = new URL(request.url);
  const backend = 'https://cardforge-backend-3.onrender.com';
  const backendUrl = backend + url.pathname + url.search;
  const resp = await fetch(backendUrl, { method: request.method, headers: request.headers, body: request.body });
  const data = await resp.json();
  return new Response(JSON.stringify(data), { status: 200, headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
}
