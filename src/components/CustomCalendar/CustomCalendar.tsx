'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './CustomCalendar.module.css';

/* ─────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────── */

interface Slot {
  start: string; // ISO
}

export interface CustomCalendarProps {
  /** Cal.com username, e.g. "flywheelautomation". */
  username: string;
  /** Cal.com event type slug, e.g. "15min". */
  eventTypeSlug: string;
  /** Duration label shown in the header. */
  eventLabel?: string;
  /** Prefill for the booking step. */
  prefillName?: string;
  prefillEmail?: string;
  prefillPhone?: string;
  prefillNotes?: string;
  /** Override timezone. Defaults to the visitor's browser timezone. */
  timeZone?: string;
}

/* ─────────────────────────────────────────────────────────────
   Date helpers — dependency-free. The file never mutates the
   Date objects it receives; every helper returns a new instance.
   ───────────────────────────────────────────────────────────── */

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}
function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
/** YYYY-MM-DD in the *local* timezone — matches the keys Cal.com returns. */
function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Build a 6x7 grid of days covering the month view. */
function buildMonthGrid(viewMonth: Date): Date[] {
  const first = startOfMonth(viewMonth);
  // Week starts on Sunday — matches Spanish / Mexican calendar convention and
  // Cal.com's own default. Change to 1 (Monday) if you prefer ISO weeks.
  const weekStartsOn = 0;
  const firstDow = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -firstDow);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

/* ─────────────────────────────────────────────────────────────
   Formatters — all locale-aware, Spanish by default.
   ───────────────────────────────────────────────────────────── */

const LOCALE = 'es-MX';

function formatMonth(d: Date): string {
  return new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' }).format(d);
}
function formatWeekday(d: Date): string {
  return new Intl.DateTimeFormat(LOCALE, { weekday: 'short' }).format(d);
}
function formatFullDate(d: Date): string {
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(d);
}
function formatTime(iso: string, format: '12h' | '24h', tz: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: format === '12h',
    timeZone: tz,
  }).format(new Date(iso));
}

/* ─────────────────────────────────────────────────────────────
   Component
   ───────────────────────────────────────────────────────────── */

type BookingState =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'confirmed'; bookingUid?: string; when: string }
  | { phase: 'redirect'; redirectUrl: string }
  | { phase: 'error'; message: string };

export default function CustomCalendar({
  username,
  eventTypeSlug,
  eventLabel = '15 min · sin costo',
  prefillName = '',
  prefillEmail = '',
  prefillPhone = '',
  prefillNotes = '',
  timeZone,
}: CustomCalendarProps) {
  // Resolve timezone on the client so SSR doesn't leak the server's TZ.
  const [tz, setTz] = useState<string>(timeZone ?? 'America/Mexico_City');
  useEffect(() => {
    if (timeZone) return;
    try {
      const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (resolved) setTz(resolved);
    } catch {
      /* keep default */
    }
  }, [timeZone]);

  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');
  const [slotsByDate, setSlotsByDate] = useState<Record<string, Slot[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Contact form state (prefilled from the diagnostic wizard) ── */
  const [name, setName] = useState(prefillName);
  const [email, setEmail] = useState(prefillEmail);
  const [phone, setPhone] = useState(prefillPhone);
  const [notes, setNotes] = useState(prefillNotes);
  useEffect(() => setName(prefillName), [prefillName]);
  useEffect(() => setEmail(prefillEmail), [prefillEmail]);
  useEffect(() => setPhone(prefillPhone), [prefillPhone]);
  useEffect(() => setNotes(prefillNotes), [prefillNotes]);

  const [booking, setBooking] = useState<BookingState>({ phase: 'idle' });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  /* ── Fetch slots whenever the visible month changes ── */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const start = startOfMonth(viewMonth).toISOString();
        const end = endOfMonth(viewMonth).toISOString();
        const q = new URLSearchParams({
          username,
          eventTypeSlug,
          start,
          end,
          timeZone: tz,
        });
        const res = await fetch(`/api/cal/slots?${q.toString()}`);
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || !json.ok) {
          setError(json.error ?? 'No pudimos cargar los horarios.');
          setSlotsByDate({});
        } else {
          setSlotsByDate(json.slots ?? {});
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[CustomCalendar] slots error', err);
          setError('No pudimos conectar con el calendario.');
          setSlotsByDate({});
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [viewMonth, username, eventTypeSlug, tz]);

  /* ── Auto-pick the first available day once slots arrive ── */
  useEffect(() => {
    if (selectedDate) return;
    const firstKey = Object.keys(slotsByDate)
      .filter((k) => (slotsByDate[k]?.length ?? 0) > 0)
      .sort()[0];
    if (firstKey) {
      const [y, m, d] = firstKey.split('-').map((n) => parseInt(n, 10));
      setSelectedDate(new Date(y, m - 1, d));
    }
  }, [slotsByDate, selectedDate]);

  /* ── Derived grid ── */
  const daysGrid = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const slotsForSelected = selectedDate ? slotsByDate[toDateKey(selectedDate)] ?? [] : [];

  const canGoPrev = startOfMonth(viewMonth) > startOfMonth(today);

  /* ── Slot click handler ── */
  const onSlotClick = useCallback(
    async (slotISO: string) => {
      setSelectedSlot(slotISO);
      if (!name.trim() || !email.trim()) {
        // Scroll to the contact form — we require these fields before booking.
        document
          .getElementById('custom-cal-contact')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      setBooking({ phase: 'submitting' });
      try {
        const res = await fetch('/api/cal/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            eventTypeSlug,
            start: slotISO,
            timeZone: tz,
            attendee: {
              name: name.trim(),
              email: email.trim(),
              ...(phone.trim() ? { phoneNumber: phone.trim() } : {}),
            },
            ...(notes.trim() ? { notes: notes.trim() } : {}),
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setBooking({ phase: 'error', message: json.error ?? 'Error al reservar.' });
          return;
        }
        if (json.mode === 'redirect' && json.redirectUrl) {
          // Open Cal.com in a new tab so the user can finalize, and reflect
          // that in our UI without losing the diagnostic context.
          window.open(json.redirectUrl, '_blank', 'noopener,noreferrer');
          setBooking({ phase: 'redirect', redirectUrl: json.redirectUrl });
          return;
        }
        setBooking({
          phase: 'confirmed',
          bookingUid: json.booking?.uid,
          when: slotISO,
        });
      } catch (err) {
        console.error('[CustomCalendar] book error', err);
        setBooking({ phase: 'error', message: 'No pudimos completar la reserva.' });
      }
    },
    [email, eventTypeSlug, name, notes, phone, tz, username],
  );

  /* ──────────────────────────────────────────────────────────
     Render states
     ────────────────────────────────────────────────────────── */

  if (booking.phase === 'confirmed') {
    return (
      <div className={styles.confirmCard}>
        <div className={styles.confirmIcon} aria-hidden="true">✓</div>
        <h3 className={styles.confirmTitle}>¡Cita confirmada!</h3>
        <p className={styles.confirmBody}>
          Te enviamos la invitación a <strong>{email}</strong> con el enlace de la videollamada.
        </p>
        <p className={styles.confirmWhen}>
          {new Intl.DateTimeFormat(LOCALE, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: 'numeric',
            minute: '2-digit',
            hour12: timeFormat === '12h',
            timeZone: tz,
          }).format(new Date(booking.when))}
        </p>
      </div>
    );
  }

  if (booking.phase === 'redirect') {
    return (
      <div className={styles.confirmCard}>
        <div className={styles.confirmIcon} aria-hidden="true">→</div>
        <h3 className={styles.confirmTitle}>Finaliza en Cal.com</h3>
        <p className={styles.confirmBody}>
          Abrimos una pestaña nueva con tu cita pre-seleccionada para que la confirmes en un clic.
        </p>
        <a className={styles.confirmLink} href={booking.redirectUrl} target="_blank" rel="noopener noreferrer">
          Abrir de nuevo
        </a>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* ── Calendar card ── */}
      <section className={styles.calendarCard} aria-label="Calendario de disponibilidad">
        <header className={styles.calHeader}>
          <div className={styles.calEvent}>
            <span className={styles.calEventBadge} aria-hidden="true">⏱</span>
            <span className={styles.calEventLabel}>{eventLabel}</span>
          </div>
          <nav className={styles.monthNav} aria-label="Navegación de mes">
            <button
              type="button"
              className={styles.monthBtn}
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              disabled={!canGoPrev}
              aria-label="Mes anterior"
            >
              ‹
            </button>
            <span className={styles.monthLabel}>{formatMonth(viewMonth)}</span>
            <button
              type="button"
              className={styles.monthBtn}
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              aria-label="Mes siguiente"
            >
              ›
            </button>
          </nav>
        </header>

        <div className={styles.weekdays} aria-hidden="true">
          {/* Render 7 weekday labels from a known Sunday for consistent locale output */}
          {Array.from({ length: 7 }, (_, i) => {
            const sunday = new Date(2024, 0, 7 + i); // 2024-01-07 is a Sunday
            return (
              <span key={i} className={styles.weekdayCell}>
                {formatWeekday(sunday).replace('.', '').slice(0, 3)}
              </span>
            );
          })}
        </div>

        <div className={styles.dayGrid} role="grid">
          {daysGrid.map((day) => {
            const key = toDateKey(day);
            const inMonth = day.getMonth() === viewMonth.getMonth();
            const hasSlots = (slotsByDate[key]?.length ?? 0) > 0;
            const isPast = day < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isToday = isSameDay(day, today);
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            const disabled = !inMonth || isPast || !hasSlots;

            return (
              <button
                key={key + inMonth}
                type="button"
                role="gridcell"
                className={[
                  styles.dayCell,
                  !inMonth && styles.dayOutside,
                  hasSlots && inMonth && !isPast && styles.dayAvailable,
                  isToday && styles.dayToday,
                  isSelected && styles.daySelected,
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={disabled}
                onClick={() => setSelectedDate(day)}
                aria-pressed={isSelected}
                aria-label={formatFullDate(day) + (hasSlots ? ' — disponible' : ' — no disponible')}
              >
                <span className={styles.dayNum}>{day.getDate()}</span>
                {hasSlots && inMonth && !isPast && <span className={styles.dayDot} aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        {loading && <div className={styles.calStatus}>Cargando horarios…</div>}
        {error && !loading && <div className={styles.calStatusError}>{error}</div>}
      </section>

      {/* ── Slot panel ── */}
      <section className={styles.slotPanel} aria-label="Horarios disponibles">
        <header className={styles.slotHeader}>
          <div className={styles.slotDay}>
            {selectedDate ? formatFullDate(selectedDate) : 'Selecciona un día'}
          </div>
          <div className={styles.timeToggle} role="tablist" aria-label="Formato de hora">
            <button
              type="button"
              role="tab"
              aria-selected={timeFormat === '12h'}
              className={`${styles.timeToggleBtn} ${timeFormat === '12h' ? styles.timeToggleActive : ''}`}
              onClick={() => setTimeFormat('12h')}
            >
              12h
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={timeFormat === '24h'}
              className={`${styles.timeToggleBtn} ${timeFormat === '24h' ? styles.timeToggleActive : ''}`}
              onClick={() => setTimeFormat('24h')}
            >
              24h
            </button>
          </div>
        </header>

        <div className={styles.slotList}>
          {selectedDate == null ? (
            <div className={styles.slotEmpty}>Elige un día con un punto para ver horarios.</div>
          ) : slotsForSelected.length === 0 ? (
            <div className={styles.slotEmpty}>No hay horarios disponibles en este día.</div>
          ) : (
            slotsForSelected.map((slot) => {
              const isSel = selectedSlot === slot.start;
              return (
                <button
                  key={slot.start}
                  type="button"
                  className={`${styles.slot} ${isSel ? styles.slotSelected : ''}`}
                  onClick={() => onSlotClick(slot.start)}
                  disabled={booking.phase === 'submitting'}
                >
                  {formatTime(slot.start, timeFormat, tz)}
                </button>
              );
            })
          )}
        </div>

        <div className={styles.tzHint}>
          Horario en <strong>{tz.replace('_', ' ')}</strong>
        </div>
      </section>

      {/* ── Contact form (prefilled from wizard) ── */}
      <section id="custom-cal-contact" className={styles.contactCard} aria-label="Tus datos">
        <header className={styles.contactHeader}>
          <h4 className={styles.contactTitle}>Tus datos para la invitación</h4>
          <p className={styles.contactSub}>Te enviamos el enlace a tu correo para la videollamada.</p>
        </header>
        <div className={styles.contactRow}>
          <label className={styles.contactField}>
            <span className={styles.contactLabel}>Nombre completo</span>
            <input
              className={styles.contactInput}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ana García"
              required
            />
          </label>
          <label className={styles.contactField}>
            <span className={styles.contactLabel}>Correo electrónico</span>
            <input
              className={styles.contactInput}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ana@miempresa.com"
              required
            />
          </label>
        </div>
        <div className={styles.contactRow}>
          <label className={styles.contactField}>
            <span className={styles.contactLabel}>WhatsApp (opcional)</span>
            <input
              className={styles.contactInput}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+52 33 1234 5678"
            />
          </label>
          <label className={styles.contactField}>
            <span className={styles.contactLabel}>Notas para la llamada (opcional)</span>
            <input
              className={styles.contactInput}
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="¿Qué te gustaría revisar?"
            />
          </label>
        </div>
        {booking.phase === 'error' && (
          <div className={styles.contactError}>{booking.message}</div>
        )}
        {booking.phase === 'submitting' && (
          <div className={styles.contactStatus}>Reservando tu cita…</div>
        )}
      </section>

      {/* ── Trust strip ── */}
      <footer className={styles.trust}>
        <span className={styles.trustItem}><span aria-hidden="true">⏱</span> 15 min, sin costo</span>
        <span className={styles.trustItem}><span aria-hidden="true">💬</span> Confirmación al instante</span>
        <span className={styles.trustItem}><span aria-hidden="true">🔒</span> Sin presión de venta</span>
      </footer>
    </div>
  );
}
