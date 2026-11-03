/* CORS proxy for Info zaslon SCKR + knjižnica novosti.
   Usage: https://sckr-proxy.luka-colaric.workers.dev/?url=<encoded target URL>
   Only the hosts below are allowed, so this is not an open proxy. */
const ALLOWED_HOSTS = ['sckr.si', 'img.rtvslo.si', 'urniki.easistent.com', 'plus.cobiss.net', 'iskrice.si'];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (request.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: CORS });

    let target;
    try { target = new URL(new URL(request.url).searchParams.get('url')); }
    catch { return new Response('Missing or bad ?url=', { status: 400, headers: CORS }); }

    const hostOk = ALLOWED_HOSTS.some(h => target.hostname === h || target.hostname.endsWith('.' + h));
    if (target.protocol !== 'https:' || !hostOk) return new Response('Host not allowed', { status: 403, headers: CORS });

    const isCobiss = target.hostname === 'plus.cobiss.net';
    const isApi = isCobiss && target.pathname.includes('/api/');
    const ttl = isCobiss ? 3600 : 60;

    // our own cache: only good responses are stored (never an HTML error page for a JSON call)
    const cache = caches.default;
    const key = new Request('https://proxy-cache.local/' + encodeURIComponent(target.href));
    const hit = await cache.match(key);
    if (hit) return withCors(hit, 'HIT');

    let upstream;
    try {
      upstream = await fetch(target.href, {
        headers: {
          'User-Agent': 'SCKR-knjiznica-novosti/1.0 (school library screen; luka.colaric@sckr.si)',
          'Accept': isApi ? 'application/json, text/plain, */*' : 'text/html,application/xhtml+xml,*/*;q=0.8',
          'Accept-Language': 'sl,en;q=0.8',
          ...(isCobiss ? { 'Referer': 'https://plus.cobiss.net/cobiss/si/sl' } : {}),
        },
        cf: { cacheTtl: 0 },       // no Cloudflare edge caching; we decide below what to keep
      });
    } catch (e) {
      return new Response('Upstream error', { status: 502, headers: CORS });
    }

    const type = upstream.headers.get('Content-Type') || 'text/plain; charset=utf-8';
    const body = await upstream.arrayBuffer();
    const res = new Response(body, {
      status: upstream.status,
      headers: { 'Content-Type': type, 'Cache-Control': `public, max-age=${ttl}` },
    });

    const good = upstream.ok && (!isApi || type.includes('json'));
    if (good) ctx.waitUntil(cache.put(key, res.clone()));
    return withCors(res, good ? 'MISS' : 'BAD');
  },
};

function withCors(res, state) {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  headers.set('Cache-Control', 'no-store');   // the browser always asks the Worker
  headers.set('X-Proxy-Cache', state);
  return new Response(res.body, { status: res.status, headers });
}
