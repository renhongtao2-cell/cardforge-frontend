export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const backend = 'https://cardforge-backend-3.onrender.com';
  const backendUrl = backend + url.pathname + url.search;
  const resp = await fetch(backendUrl, { method: request.method, headers: request.headers, body: request.body });
  return new Response(resp.body, { status: resp.status, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': '*' } });
}
export async function onRequestOptions(context) {
  return new Response(null, { status: 204, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': '*' } });
}
