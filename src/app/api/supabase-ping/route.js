import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TIMEOUT_MS = 10000;

function getConfig() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    .trim()
    .replace(/\/+$/, '');
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''
  ).trim();
  return { url, key };
}

async function timedFetch(url, options) {
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      cache: 'no-store',
      redirect: 'follow',
    });
    return { response, latencyMs: Date.now() - start };
  } finally {
    clearTimeout(timer);
  }
}

function parseBody(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text.slice(0, 200);
  }
}

function failureMessage(error) {
  if (error?.name === 'AbortError') return `timeout después de ${TIMEOUT_MS}ms`;
  const base = error?.message || 'error de red desconocido';
  const cause = error?.cause?.code || error?.cause?.message;
  return cause && !base.includes(cause) ? `${base} (${cause})` : base;
}

function isAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;

  const header = request.headers.get('authorization') || '';
  const querySecret = new URL(request.url).searchParams.get('secret') || '';
  return header === `Bearer ${secret}` || querySecret === secret;
}

async function checkAuth(url, key) {
  try {
    const { response, latencyMs } = await timedFetch(`${url}/auth/v1/health`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      latency_ms: latencyMs,
      body: parseBody(text),
    };
  } catch (error) {
    return { ok: false, status: 0, latency_ms: null, error: failureMessage(error) };
  }
}

async function checkRest(url, key) {
  try {
    const { response, latencyMs } = await timedFetch(`${url}/rest/v1/`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: 'application/openapi+json',
      },
    });
    const text = await response.text();
    const result = {
      ok: response.ok,
      status: response.status,
      latency_ms: latencyMs,
      body: parseBody(text),
    };
    if (!response.ok) result.error = result.body;
    return result;
  } catch (error) {
    return { ok: false, status: 0, latency_ms: null, error: failureMessage(error) };
  }
}

async function checkTable(url, key, table) {
  try {
    const { response, latencyMs } = await timedFetch(
      `${url}/rest/v1/${encodeURIComponent(table)}?select=id&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: 'application/json',
          Prefer: 'count=exact',
        },
      }
    );
    const text = await response.text();
    const result = {
      ok: response.ok,
      status: response.status,
      latency_ms: latencyMs,
      table,
      count: response.headers.get('content-range')?.split('/')?.[1] ?? null,
    };
    if (!response.ok) result.error = parseBody(text);
    return result;
  } catch (error) {
    return {
      ok: false,
      status: 0,
      latency_ms: null,
      table,
      error: failureMessage(error),
    };
  }
}

async function runChecks(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: 'No autorizado. Envía Authorization: Bearer <CRON_SECRET>.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const { url, key } = getConfig();
  if (!url || !key) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error:
          'Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL (o SUPABASE_URL) y NEXT_PUBLIC_SUPABASE_ANON_KEY (o SUPABASE_SERVICE_ROLE_KEY).',
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json(
      { ok: false, configured: false, error: `URL de Supabase inválida: ${url}` },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol) || /placeholder/i.test(parsedUrl.hostname)) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error: `La URL de Supabase no es válida o sigue siendo el placeholder: ${url}`,
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const table = process.env.SUPABASE_PING_TABLE?.trim();

  const [auth, rest, database] = await Promise.all([
    checkAuth(url, key),
    checkRest(url, key),
    table ? checkTable(url, key, table) : Promise.resolve(null),
  ]);

  const ok = auth.ok && rest.ok && (!database || database.ok);
  const status = ok ? 200 : 503;

  return NextResponse.json(
    {
      ok,
      configured: true,
      project: url.replace('https://', '').split('.')[0],
      checks: {
        auth,
        rest: { ...rest, body: rest.ok ? undefined : rest.body },
        ...(database ? { database } : {}),
      },
      checked_at: new Date().toISOString(),
    },
    { status, headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function GET(request) {
  return runChecks(request);
}

export async function HEAD(request) {
  const result = await runChecks(request);
  return new Response(null, { status: result.status, headers: result.headers });
}
