import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy Cal.com's v2 public slots endpoint so our custom calendar can query
 * real availability for a public event type without exposing the upstream
 * URL shape to the client. Cal.com returns slots grouped by date in the
 * viewer's timezone; we pass that through unchanged.
 *
 * Query params accepted from the client:
 *   username        — Cal.com username, e.g. "flywheelautomation"
 *   eventTypeSlug   — event slug, e.g. "15min"
 *   start           — ISO datetime lower bound (inclusive)
 *   end             — ISO datetime upper bound (inclusive)
 *   timeZone        — IANA TZ, e.g. "America/Mexico_City"
 *
 * Response:
 *   { ok: true, slots: { "YYYY-MM-DD": [{ start: ISO }, ...] } }
 *   or { ok: false, error: string } with appropriate status.
 */
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const username = sp.get('username');
  const eventTypeSlug = sp.get('eventTypeSlug');
  const start = sp.get('start');
  const end = sp.get('end');
  const timeZone = sp.get('timeZone') ?? 'UTC';

  if (!username || !eventTypeSlug || !start || !end) {
    return NextResponse.json(
      { ok: false, error: 'Missing required query params: username, eventTypeSlug, start, end' },
      { status: 400 },
    );
  }

  // Cal.com v2 slots endpoint. The endpoint is public for public event types
  // and only requires the cal-api-version header to pin the response shape.
  // https://cal.com/docs/api-reference/v2/slots/find-available-slots
  const upstream = new URL('https://api.cal.com/v2/slots');
  upstream.searchParams.set('start', start);
  upstream.searchParams.set('end', end);
  upstream.searchParams.set('eventTypeSlug', eventTypeSlug);
  upstream.searchParams.append('usernameList[]', username);
  upstream.searchParams.set('timeZone', timeZone);
  upstream.searchParams.set('format', 'range');

  try {
    const res = await fetch(upstream.toString(), {
      headers: {
        'cal-api-version': '2024-09-04',
        Accept: 'application/json',
      },
      // Cal changes availability frequently; never serve from the edge cache.
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[api/cal/slots] upstream error', res.status, text);
      return NextResponse.json(
        { ok: false, error: `Cal.com returned ${res.status}` },
        { status: 502 },
      );
    }

    const json = (await res.json()) as {
      status?: string;
      data?: Record<string, Array<{ start: string; end?: string }>>;
    };

    // Normalize to { slots: { date: [{start}] } } regardless of whether Cal
    // returned range-format (start/end) or default (just start).
    const raw = json.data ?? {};
    const slots: Record<string, Array<{ start: string }>> = {};
    for (const [date, arr] of Object.entries(raw)) {
      slots[date] = (arr ?? []).map((s) => ({ start: s.start }));
    }

    return NextResponse.json({ ok: true, slots });
  } catch (err) {
    console.error('[api/cal/slots] fetch failed:', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to reach Cal.com' },
      { status: 502 },
    );
  }
}
