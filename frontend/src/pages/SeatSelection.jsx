import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Armchair,
  BusFront,
  CheckCircle2,
  Info,
  LoaderCircle,
  ShieldCheck,
  Ticket,
  Users,
} from 'lucide-react';

import api from '../services/api';

function SeatSelection() {
  const { journeyId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const source = searchParams.get('source') || 'Your source';
  const destination = searchParams.get('destination') || 'Your destination';
  const date = searchParams.get('date') || '';
  const fare = Number(searchParams.get('fare') || 0);
  const operator = searchParams.get('operator') || 'Your bus operator';
  const busNumber = searchParams.get('busNumber') || '';

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadSeats() {
      try {
        setLoading(true);
        setError('');

        const response = await api.get(
          `/api/passenger/journeys/${journeyId}/seats`
        );

        if (!cancelled) {
          setSeats(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              'Unable to load seats. Please try again.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSeats();

    return () => {
      cancelled = true;
    };
  }, [journeyId]);

  const availableSeats = useMemo(
    () => seats.filter((seat) => seat.status === 'AVAILABLE'),
    [seats]
  );

  const totalAmount = selectedSeats.length * fare;

  function toggleSeat(seat) {
    if (seat.status !== 'AVAILABLE' || booking) return;

    setSelectedSeats((current) => {
      const alreadySelected = current.some(
        (item) => item.seatId === seat.seatId
      );

      if (alreadySelected) {
        return current.filter((item) => item.seatId !== seat.seatId);
      }

      return [...current, seat];
    });
  }

  async function handleBooking() {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }

    try {
      setBooking(true);
      setError('');
      setSuccess('');

      const response = await api.post('/api/passenger/bookings', {
        journeyId: Number(journeyId),
        seatIds: selectedSeats.map((seat) => seat.seatId),
      });

      navigate('/booking-confirmation', {
  replace: true,
  state: {
    booking: response.data,
  },
});
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Booking failed. The selected seats may no longer be available.'
      );

      // Refresh inventory after a failed booking attempt.
      try {
        const refreshed = await api.get(
          `/api/passenger/journeys/${journeyId}/seats`
        );
        setSeats(refreshed.data);
        setSelectedSeats([]);
      } catch {
        // Keep the original booking error visible.
      }
    } finally {
      setBooking(false);
    }
  }

  function formatDate(value) {
    if (!value) return 'Date not provided';

    return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  // Keep seats in their numeric order.
  const orderedSeats = [...seats].sort(
    (a, b) => Number(a.seatNumber) - Number(b.seatNumber)
  );

  return (
    <main className="min-h-screen bg-cream px-4 py-8 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">

        <button
          onClick={() => navigate(-1)}
          className="mb-7 flex items-center gap-2 text-sm font-bold text-charcoal/60 transition hover:text-tangerine"
        >
          <ArrowLeft size={17} />
          Back to journeys
        </button>

        <div className="mb-9">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-tangerine">
            YOUR SEAT. YOUR JOURNEY.
          </p>

          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Pick your seat<span className="text-tangerine">.</span>
          </h1>

          <p className="mt-3 text-sm text-charcoal/55">
            Choose your preferred seats and confirm your booking.
          </p>
        </div>

        {/* Journey summary */}
        <section className="mb-8 rounded-[1.8rem] bg-charcoal p-6 text-white md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime text-charcoal">
                  <BusFront size={21} />
                </div>
                <div>
                  <p className="font-bold">{operator}</p>
                  <p className="text-xs text-white/50">
                    {busNumber || `Journey #${journeyId}`}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-5">
                <h2 className="font-display text-2xl font-bold md:text-3xl">
                  {source}
                </h2>
                <ArrowRight className="text-lime" size={21} />
                <h2 className="font-display text-2xl font-bold md:text-3xl">
                  {destination}
                </h2>
              </div>

              <p className="mt-3 text-sm text-white/55">
                {formatDate(date)}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 md:min-w-40">
              <p className="text-xs font-semibold text-white/50">
                PRICE PER SEAT
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-lime">
                ₹{fare.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </section>

        {loading && (
          <div className="rounded-[1.8rem] bg-white p-16 text-center">
            <LoaderCircle className="mx-auto animate-spin" size={35} />
            <p className="mt-4 font-bold">Loading seat layout...</p>
          </div>
        )}

        {!loading && error && seats.length === 0 && (
          <div className="rounded-[1.8rem] bg-white p-10 text-center">
            <p className="font-bold text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-charcoal px-5 py-3 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && seats.length > 0 && (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_350px]">

            {/* Seat layout */}
            <section className="rounded-[1.8rem] bg-white p-5 shadow-sm md:p-8">

              <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-bold">
                    Choose your seats
                  </h2>
                  <p className="mt-1 text-sm text-charcoal/50">
                    {availableSeats.length} seats available
                  </p>
                </div>

                <span className="rounded-full bg-cream px-4 py-2 text-xs font-bold">
                  {seats.length} SEATS
                </span>
              </div>

              {/* Legend */}
              <div className="mb-8 flex flex-wrap gap-5 border-b border-black/5 pb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-charcoal/60">
                  <span className="h-4 w-4 rounded-md border border-gray-300 bg-white" />
                  Available
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-charcoal/60">
                  <span className="h-4 w-4 rounded-md bg-lime" />
                  Selected
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-charcoal/60">
                  <span className="h-4 w-4 rounded-md bg-gray-300" />
                  Booked
                </div>
              </div>

              {/* Bus front */}
              <div className="mx-auto mb-7 flex max-w-md items-center justify-between rounded-t-[2rem] border border-black/10 bg-cream px-6 py-4">
                <span className="text-xs font-bold uppercase tracking-widest text-charcoal/40">
                  Front
                </span>
                <BusFront size={25} className="text-charcoal/50" />
                <span className="text-xs font-bold uppercase tracking-widest text-charcoal/40">
                  Driver
                </span>
              </div>

              {/* 2 + aisle + 2 seat arrangement */}
              <div className="mx-auto grid max-w-md grid-cols-[1fr_1fr_30px_1fr_1fr] gap-x-2 gap-y-3 sm:gap-x-4">
                {orderedSeats.map((seat, index) => {
                  const isSelected = selectedSeats.some(
                    (item) => item.seatId === seat.seatId
                  );

                  const isBooked = seat.status !== 'AVAILABLE';

                  // Two seats on each side of the aisle.
                  const position = index % 4;
                  const gridColumn = position < 2
                    ? position + 1
                    : position + 2;

                  return (
                    <button
                      key={seat.seatId}
                      onClick={() => toggleSeat(seat)}
                      disabled={isBooked || booking}
                      style={{ gridColumn }}
                      title={`Seat ${seat.seatNumber} — ${seat.status}`}
                      className={`flex min-h-[65px] flex-col items-center justify-center gap-1 rounded-xl border-2 transition duration-200 ${
                        isBooked
                          ? 'cursor-not-allowed border-gray-200 bg-gray-200 text-gray-400'
                          : isSelected
                            ? 'border-lime bg-lime text-charcoal shadow-md shadow-lime/30'
                            : 'border-gray-200 bg-white text-charcoal hover:-translate-y-1 hover:border-tangerine hover:bg-[#FFF3EE]'
                      }`}
                    >
                      <Armchair size={20} />
                      <span className="text-xs font-bold">
                        {seat.seatNumber}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mx-auto mt-8 max-w-md rounded-xl bg-cream p-4 text-center text-xs text-charcoal/50">
                <Info className="mr-1 inline" size={14} />
                Select one or more available seats. Booked seats cannot be selected.
              </div>
            </section>

            {/* Booking summary */}
            <aside className="rounded-[1.8rem] bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-tangerine">
                YOUR BOOKING
              </p>

              <h2 className="mt-2 font-display text-2xl font-bold">
                Booking summary
              </h2>

              <div className="mt-7 space-y-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal/50">Selected seats</span>
                  <span className="font-bold">
                    {selectedSeats.length}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-charcoal/50">Seat numbers</span>
                  <span className="text-right font-bold">
                    {selectedSeats.length
                      ? selectedSeats
                          .map((seat) => seat.seatNumber)
                          .sort((a, b) => Number(a) - Number(b))
                          .join(', ')
                      : 'None selected'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal/50">Price per seat</span>
                  <span className="font-bold">
                    ₹{fare.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="border-t border-dashed border-black/15 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Total amount</span>
                    <span className="font-display text-3xl font-bold">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {error && seats.length > 0 && (
                <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {success && (
                <p className="mt-5 flex items-start gap-2 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
                  <CheckCircle2 size={18} className="shrink-0" />
                  {success}
                </p>
              )}

              <button
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || booking || !!success}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal px-5 py-4 font-bold text-white transition hover:bg-tangerine disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {booking ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <Ticket size={18} />
                    Confirm booking
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-charcoal/45">
                <ShieldCheck size={15} />
                Secure booking with your account
              </div>

              <div className="mt-5 rounded-xl bg-cream p-4 text-xs leading-5 text-charcoal/55">
                <Users size={15} className="mb-1 inline" />
                Your seats are confirmed only after the booking request
                succeeds.
              </div>
            </aside>

          </div>
        )}
      </div>
    </main>
  );
}

export default SeatSelection;
