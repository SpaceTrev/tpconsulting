import { NextRequest, NextResponse } from 'next/server';

/**
 * Complete a booking against Cal.com. If CAL_API_KEY is set, we POST to
 * Cal.com's v2 /bookings endpoint and return the confirmed booking. If no
 * key is configured, we fall back to a prefilled Cal.com booking URL the
 * client can redirect to so the user finishes the flow on Cal's hosted page.
 *
 * Expected POST body:
 *   {
 *     username: string,           // e.g. "flywheelautomation"
 *     eventTypeSlug: string,      // e.g. "15min"
 *     start: string,              // ISO datetime
 *     timeZone: string,           // IANA TZ
 *     attendee: {
 *       name: string,
 *       email: string,
 *       phoneNumber?: string,
 *     },
 *     notes?: string,
 *   }
 *
 * Response on success:
 *   { ok: true, mode: "api" | "redirect", booking?: {...}, redirectUrl?: string }
 */
export const dynamic = 'force-dynamic';

type BookBody = {
  username: string;
  eventTypeSlug: string;
  start: string;
  timeZone: string;
  attendee: { name: string; email: string; phoneNumber?: string };
  notes?: string;
};

export async function POST(req: NextRequest) {
  let body: BookBody;
  try {
    body = (await req.json()) as BookBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (
    !body.username ||
    !body.eventTypeSlug ||
    !body.start ||
    !body.timeZone ||
    !body.attendee?.name ||
    !body.attendee?.email
  ) {
    return NextResponse.json(
      { ok: false, error: 'Missing required fields' },
      { status: 400 },
    );
  }

  const apiKey = process.env.CAL_API_KEY;

  if (apiKey) {
    // Direct booking via Cal.com v2. The attendee is booked immediately and
    // Cal handles the confirmation emails + calendar invites. We don't need
    // the WhatsApp Cal webhook to double-insert the lead because the webhook
    // guards on triggerEvent.
    try {
      const res = await fetch('https://api.cal.com/v2/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'cal-api-version': '2024-08-13',
        },
        body: JSON.stringify({
          start: body.start,
          eventTypeSlug: body.eventTypeSlug,
          username: body.username,
          attendee: {
            name: body.attendee.name,
            email: body.attendee.email,
            timeZone: body.timeZone,
            language: 'es',
            ...(body.attendee.phoneNumber
              ? { phoneNumber: body.attendee.phoneNumber }
              : {}),
          },
          ...(body.notes ? { metadata: { notes: body.notes } } : {}),
        }),
        cache: 'no-store',
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('[api/cal/book] upstream error', res.status, text);
        // Fall through to redirect mode so the user still has a way to book.
      } else {
        const json = await res.json();
        return NextResponse.json({ ok: true, mode: 'api', booking: json.data ?? json });
      }
    } catch (err) {
      console.error('[api/cal/book] fetch failed:', err);
      // fall through to redirect
    }
  }

  // Redirect fallback: build a Cal.com booking URL with the slot + attendee
  // prefilled. Cal.com's /book route accepts these query params and takes
  // the user straight to the confirmation screen.
  const u = new URL(`https://cal.com/${body.username}/${body.eventTypeSlug}/book`);
  u.searchParams.set('date', body.start.slice(0, 10));
  u.searchParams.set('slot', body.start);
  u.searchParams.set('month', body.start.slice(0, 7));
  u.searchParams.set('name', body.attendee.name);
  u.searchParams.set('email', body.attendee.email);
  if (body.attendee.phoneNumber) {
    u.searchParams.set('phone', body.attendee.phoneNumber);
  }
  if (body.notes) u.searchParams.set('notes', body.notes);

  return NextResponse.json({ ok: true, mode: 'redirect', redirectUrl: u.toString() });
}
