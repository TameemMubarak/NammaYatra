import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Home,
  Ticket,
  CalendarDays,
  MapPin,
  Armchair,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';

function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state?.booking;
  const [copied, setCopied] = useState(false);

  if (!booking) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-cream px-5">
        <div className="max-w-md rounded-[2rem] bg-white p-9 text-center shadow-sm">
          <Ticket size={38} className="mx-auto text-tangerine" />
          <h1 className="mt-5 font-display text-2xl font-bold">
            Booking details unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-charcoal/55">
            Your confirmation details are not available on this page. You can
            still find your booking in your booking history.
          </p>
          <button
            onClick={() => navigate('/bookings')}
            className="mt-7 rounded-xl bg-charcoal px-6 py-3 font-bold text-white hover:bg-tangerine"
          >
            Go to My Bookings
          </button>
        </div>
      </main>
    );
  }

  const reference = booking.bookingReference || 'Not available';
  const seats = Array.isArray(booking.seatNumbers)
    ? booking.seatNumbers
    : [];

  const bookingDate = booking.bookedAt
    ? new Date(booking.bookedAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Not available';

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-12 md:px-8">
      <div className="mx-auto max-w-3xl">

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5">

          <div className="relative overflow-hidden bg-charcoal px-6 py-12 text-center text-white md:px-12">
            <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-lime/10" />
            <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-tangerine/10" />

            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lime text-charcoal shadow-lg shadow-lime/20">
              <Check size={42} strokeWidth={3} />
            </div>

            <p className="relative mt-7 text-xs font-bold uppercase tracking-[0.25em] text-lime">
              YOU'RE ALL SET
            </p>

            <h1 className="relative mt-3 font-display text-3xl font-bold md:text-5xl">
              Booking confirmed!
            </h1>

            <p className="relative mx-auto mt-4 max-w-md text-sm leading-6 text-white/65">
              Your seats are reserved. Get ready for the journey ahead.
            </p>
          </div>

          <div className="p-6 md:p-10">

            {/* Booking reference */}
            <div className="rounded-2xl border border-dashed border-charcoal/20 bg-cream p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-charcoal/45">
                Booking reference
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="break-all font-mono text-xl font-bold tracking-wide md:text-2xl">
                  {reference}
                </p>

                <button
                  onClick={copyReference}
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold transition hover:bg-lime"
                >
                  {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Journey */}
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-tangerine">
                JOURNEY DETAILS
              </p>

              <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div>
                  <p className="font-display text-2xl font-bold">
                    {booking.source || 'Source'}
                  </p>
                  <p className="mt-1 text-xs text-charcoal/45">FROM</p>
                </div>

                <ArrowRight className="text-tangerine" size={22} />

                <div className="text-right">
                  <p className="font-display text-2xl font-bold">
                    {booking.destination || 'Destination'}
                  </p>
                  <p className="mt-1 text-xs text-charcoal/45">TO</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-cream p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-charcoal/45">
                  <Ticket size={15} /> JOURNEY ID
                </p>
                <p className="mt-2 font-bold">
                  {booking.journeyId ?? '—'}
                </p>
              </div>

              <div className="rounded-xl bg-cream p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-charcoal/45">
                  <CalendarDays size={15} /> BOOKED ON
                </p>
                <p className="mt-2 font-bold">{bookingDate}</p>
              </div>

              <div className="rounded-xl bg-cream p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-charcoal/45">
                  <Armchair size={15} /> SEATS
                </p>
                <p className="mt-2 font-bold">
                  {seats.length ? seats.join(', ') : 'See My Bookings'}
                </p>
              </div>

              <div className="rounded-xl bg-cream p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-charcoal/45">
                  <MapPin size={15} /> BOOKING STATUS
                </p>
                <p className="mt-2 font-bold text-green-700">
                  {booking.status || 'CONFIRMED'}
                </p>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between rounded-2xl bg-lime p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-charcoal/55">
                  Total amount
                </p>
                <p className="mt-1 font-display text-3xl font-bold">
                  ₹{Number(booking.totalAmount || 0).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-charcoal text-lime">
                <Ticket size={24} />
              </div>
            </div>

            <div className="mt-7 flex items-start gap-3 rounded-xl bg-[#EAF5E8] p-4 text-sm leading-6 text-green-800">
              <ShieldCheck size={20} className="mt-0.5 shrink-0" />
              Your booking has been recorded. Keep your booking reference
              handy so you can find it in your booking history.
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => navigate('/bookings')}
                className="flex items-center justify-center gap-2 rounded-xl bg-charcoal px-5 py-4 font-bold text-white transition hover:bg-tangerine"
              >
                View my bookings
                <ArrowRight size={17} />
              </button>

              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-5 py-4 font-bold transition hover:bg-cream"
              >
                <Home size={17} />
                Back to home
              </button>
            </div>

          </div>
        </section>

        <p className="mt-6 text-center text-xs text-charcoal/40">
          NammaYatra · Every journey has a story.
        </p>
      </div>
    </main>
  );
}

export default BookingConfirmation;

