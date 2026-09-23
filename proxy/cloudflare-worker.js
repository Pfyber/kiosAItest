/* CORS proxy for Info zaslon SCKR – Cloudflare Worker (free plan is enough).
   Usage from the screen:  https://<your-worker>.workers.dev/?url=<encoded target URL>
   Only the hosts below are allowed, so this is not an open proxy. */
const ALLOWED_HOSTS = ['sckr.si', 'img.rtvslo.si', 'urniki.easistent.com'];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (request.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: CORS });

    let target;
    try { target = new URL(new URL(request.url).searchParams.get('url')); }
    catch { return new Response('Missing or bad ?url=', { status: 400, headers: CORS }); }

    const hostOk = ALLOWED_HOSTS.some(h => target.hostname === h || target.hostname.endsWith('.' + h));
    if (target.protocol !== 'https:' || !hostOk) return new Response('Host not allowed', { status: 403, headers: CORS });

    let upstream;
    try {
      upstream = await fetch(target.href, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Info zaslon SCKR)' },
        cf: { cacheTtl: 60, cacheEverything: true }, // at most 1 upstream request per minute per URL
      });
    } catch (e) {
      return new Response('Upstream error', { status: 502, headers: CORS });
    }

    const headers = new Headers(CORS);
    headers.set('Content-Type', upstream.headers.get('Content-Type') || 'text/plain; charset=utf-8');
    headers.set('Cache-Control', 'no-store');
    return new Response(upstream.body, { status: upstream.status, headers });
  },
};
