export async function GET(request) {
  const url = new URL(request.url);
  const backend = 'https://cardforge-backend-3.onrender.com';
  const backendUrl = backend + url.pathname + url.search;
  const resp = await fetch(backendUrl, { method: 'GET', headers: {'Access-Control-Allow-Origin': '*' } });
  const data = await resp.json();
  return NextResponse.json(data);
}
