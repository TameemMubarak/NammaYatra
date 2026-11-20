import { useEffect, useState } from 'react';
import {
  Ticket,
  MapPin,
  CalendarDays,
  Armchair,
  IndianRupee,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Clock3,
  ArrowRight,
} from 'lucide-react';

import { Link } from 'react-router-dom';
import api from '../services/api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingReference, setCancellingReference] = useState(null);
  const [notice, setNotice] = useState('');

  async function fetchBookings() {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/passenger/bookings');
      setBookings(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Unable to load your bookings. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleCancellation(bookingReference) {
    const confirmed = window.confirm(
      `Are you sure you want to cancel booking ${bookingReference}?`
    );

    if (!confirmed) return;

    try {
      setCancellingReference(bookingReference);
      setError('');
      setNotice('');

      const response = await api.delete(
        `/api/passenger/bookings/${encodeURIComponent(bookingReference)}`
      );

      setNotice(
        response.data?.message || 'Booking cancelled successfully.'
      );

      // Refresh from the backend to get the latest booking status.
      await fetchBookings();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Unable to cancel this booking.'
      );
    } finally {
      setCancellingReference(null);
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) return 'Not available';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return 'Not available';

    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatAmount(amount) {
    return Number(amount || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    });
  }

  function StatusBadge({ status }) {
    const confirmed = status === 'CONFIRMED';

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
          confirmed
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {confirmed ? (
          <CheckCircle2 size={14} />
        ) : (
          <XCircle size={14} />
        )}

        {status}
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-5 py-12 md:px-12 lg:px-20">

      {/* Page heading */}
      <section className="mx-auto max-w-6xl">

        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-tangerine">
              Your travel history
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              My <span className="text-tangerine">Bookings.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
              All your journeys, booking references and seat details in one place.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold transition hover:border-charcoal disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        {/* Success notice */}
        {notice && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            <CheckCircle2 size={19} />
            {notice}
          </div>
        )}

        {/* Error notice */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <XCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-3xl border border-black/5 bg-white p-16 text-center">
            <RefreshCw size={30} className="mx-auto animate-spin text-tangerine" />
            <p className="mt-4 font-semibold">Loading your journeys...</p>
            <p className="mt-2 text-sm text-gray-500">
              Fetching your latest booking information.
            </p>
          </div>
        ) : bookings.length === 0 ? (

          /* Empty state */
          <div className="rounded-3xl border border-black/5 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-lime/50">
              <Ticket size={35} />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              No bookings yet.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Your next adventure is waiting. Explore available journeys and book your first seat.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-bold text-white transition hover:bg-tangerine"
            >
              Explore journeys
              <ArrowRight size={17} />
            </Link>
          </div>

        ) : (

          /* Booking list */
          <div className="space-y-5">

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-600">
                {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
              </p>
            </div>

            {bookings.map((booking) => (
              <article
                key={booking.bookingReference}
                className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
              >

                {/* Booking header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-gray-200 px-6 py-5 md:px-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                      Booking reference
                    </p>

                    <p className="mt-1 font-mono text-sm font-bold tracking-wider">
                      {booking.bookingReference}
                    </p>
                  </div>

                  <StatusBadge status={booking.status} />
                </div>

                {/* Journey details */}
                <div className="grid gap-8 px-6 py-7 md:grid-cols-[1fr_auto] md:px-8">

                  <div>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                          <MapPin size={14} />
                          FROM
                        </div>

                        <h2 className="mt-2 break-words text-2xl font-bold">
                          {booking.source}
                        </h2>
                      </div>

                      <div className="hidden items-center text-tangerine sm:flex">
                        <div className="h-px w-10 bg-gray-300" />
                        <ArrowRight size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                          <MapPin size={14} />
                          TO
                        </div>

                        <h2 className="mt-2 break-words text-2xl font-bold">
                          {booking.destination}
                        </h2>
                      </div>

                    </div>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-lime/40 p-2.5">
                          <Ticket size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Journey ID</p>
                          <p className="mt-1 text-sm font-bold">
                            #{booking.journeyId}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-lime/40 p-2.5">
                          <Armchair size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Seats</p>
                          <p className="mt-1 text-sm font-bold">
                            {booking.seatNumbers?.length
                              ? booking.seatNumbers.join(', ')
                              : 'Not available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-lime/40 p-2.5">
                          <CalendarDays size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Booked on</p>
                          <p className="mt-1 text-sm font-bold">
                            {formatDate(booking.bookedAt)}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Amount and actions */}
                  <div className="flex min-w-44 flex-row items-center justify-between gap-5 border-t border-gray-100 pt-5 md:flex-col md:items-end md:justify-center md:border-l md:border-t-0 md:pl-8 md:pt-0">

                    <div>
                      <p className="text-xs font-semibold text-gray-400">
                        Total amount
                      </p>

                      <p className="mt-1 flex items-center text-2xl font-bold">
                        <IndianRupee size={19} />
                        {formatAmount(booking.totalAmount)}
                      </p>
                    </div>

                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() =>
                          handleCancellation(booking.bookingReference)
                        }
                        disabled={
                          cancellingReference === booking.bookingReference
                        }
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancellingReference === booking.bookingReference ? (
                          <>
                            <Clock3 size={15} className="animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircle size={15} />
                            Cancel booking
                          </>
                        )}
                      </button>
                    )}

                  </div>
                </div>

              </article>
            ))}

          </div>
        )}

      </section>
    </main>
  );
}

export default MyBookings;
