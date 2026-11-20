import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BusFront,
  CalendarDays,
  Clock3,
  Copy,
  MapPin,
  RefreshCw,
  Ticket,
  XCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import api from '../services/api';

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState('');
  const [message, setMessage] = useState('');
  const [copiedReference, setCopiedReference] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/passenger/bookings');

      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load your bookings. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingReference) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking?'
    );

    if (!confirmed) return;

    try {
      setCancelling(bookingReference);
      setMessage('');
      setError('');

      await api.delete(
        `/api/passenger/bookings/${bookingReference}`
      );

      setMessage('Your booking has been cancelled successfully.');

      await fetchBookings();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to cancel this booking.'
      );
    } finally {
      setCancelling('');
    }
  };

  const copyReference = async (reference) => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopiedReference(reference);

      setTimeout(() => {
        setCopiedReference('');
      }, 2000);
    } catch {
      setError('Unable to copy booking reference.');
    }
  };

  const formatDate = (value) => {
    if (!value) return 'Date unavailable';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (value) => {
    if (!value) return 'Time unavailable';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === 'CONFIRMED'
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === 'CANCELLED'
  ).length;

  const getStatusStyle = (status) => {
    if (status === 'CONFIRMED') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'CANCELLED') {
      return 'bg-red-100 text-red-700';
    }

    return 'bg-yellow-100 text-yellow-700';
  };

  const isCancellationAllowed = (booking) => {
    if (booking.status !== 'CONFIRMED') return false;

    if (!booking.departureDateTime) return true;

    return new Date(booking.departureDateTime) > new Date();
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-10 sm:px-8">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Your Travel History
            </p>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              My Bookings<span className="text-orange-500">.</span>
            </h1>

            <p className="mt-3 text-gray-500">
              Every journey starts with a booking.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 font-semibold transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>

        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl bg-charcoal p-6 text-white">
            <Ticket className="mb-4 text-lime" size={25} />

            <p className="text-sm text-white/60">
              Total Bookings
            </p>

            <h2 className="mt-1 text-3xl font-black">
              {bookings.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <CheckCircle2 className="mb-4 text-green-600" size={25} />

            <p className="text-sm text-gray-500">
              Confirmed
            </p>

            <h2 className="mt-1 text-3xl font-black">
              {confirmedBookings}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <XCircle className="mb-4 text-red-500" size={25} />

            <p className="text-sm text-gray-500">
              Cancelled
            </p>

            <h2 className="mt-1 text-3xl font-black">
              {cancelledBookings}
            </h2>
          </div>

        </div>

        {/* Feedback */}
        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-700">
            <CheckCircle2 size={20} />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl bg-white p-12 text-center">
            <RefreshCw className="mx-auto mb-4 animate-spin text-orange-500" size={30} />
            <p className="font-semibold text-gray-500">
              Loading your journeys...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && bookings.length === 0 && !error && (
          <div className="rounded-3xl border border-black/5 bg-white px-6 py-16 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime">
              <BusFront size={30} />
            </div>

            <h2 className="text-2xl font-black">
              No journeys booked yet.
            </h2>

            <p className="mt-3 text-gray-500">
              Your next adventure is waiting.
            </p>

            <button
              onClick={() => navigate('/')}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-charcoal px-6 py-3 font-semibold text-white transition hover:bg-black"
            >
              Explore Journeys
              <ArrowRight size={18} />
            </button>

          </div>
        )}

        {/* Booking Cards */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-6">

            {bookings.map((booking) => (

              <article
                key={booking.bookingReference}
                className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:shadow-md"
              >

                {/* Ticket Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-dashed border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:px-8">

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime">
                      <Ticket size={22} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Booking Reference
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <p className="break-all text-sm font-bold">
                          {booking.bookingReference}
                        </p>

                        <button
                          onClick={() => copyReference(booking.bookingReference)}
                          title="Copy booking reference"
                          className="text-gray-400 transition hover:text-black"
                        >
                          <Copy size={15} />
                        </button>

                        {copiedReference === booking.bookingReference && (
                          <span className="text-xs font-semibold text-green-600">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(booking.status)}`}
                  >
                    {booking.status}
                  </span>

                </div>

                {/* Route */}
                <div className="px-6 py-7 sm:px-8">

                  <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">

                    <div>
                      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <MapPin size={14} />
                        From
                      </p>

                      <h2 className="text-2xl font-black">
                        {booking.source}
                      </h2>
                    </div>

                    <div className="hidden items-center text-orange-500 sm:flex">
                      <div className="h-px w-12 bg-gray-300" />
                      <BusFront size={25} className="mx-2" />
                      <div className="h-px w-12 bg-gray-300" />
                    </div>

                    <div className="sm:text-right">
                      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:justify-end">
                        <MapPin size={14} />
                        To
                      </p>

                      <h2 className="text-2xl font-black">
                        {booking.destination}
                      </h2>
                    </div>

                  </div>

                  {/* Details */}
                  <div className="mt-8 grid gap-4 rounded-2xl bg-cream p-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div>
                      <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-400">
                        <CalendarDays size={15} />
                        Booked On
                      </p>

                      <p className="text-sm font-bold">
                        {formatDate(booking.bookedAt)}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-400">
                        <Clock3 size={15} />
                        Departure
                      </p>

                      <p className="text-sm font-bold">
                        {booking.departureDateTime
                          ? `${formatDate(booking.departureDateTime)} · ${formatTime(booking.departureDateTime)}`
                          : 'See journey details'}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold text-gray-400">
                        SEATS
                      </p>

                      <p className="text-sm font-bold">
                        {booking.seatNumbers?.join(', ') || 'Not available'}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold text-gray-400">
                        JOURNEY ID
                      </p>

                      <p className="text-sm font-bold">
                        #{booking.journeyId}
                      </p>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Total Fare
                      </p>

                      <p className="mt-1 text-3xl font-black">
                        ₹{Number(booking.totalAmount || 0).toLocaleString('en-IN')}
                      </p>
                    </div>

                    {isCancellationAllowed(booking) && (
                      <button
                        onClick={() => handleCancel(booking.bookingReference)}
                        disabled={cancelling === booking.bookingReference}
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <XCircle size={18} />

                        {cancelling === booking.bookingReference
                          ? 'Cancelling...'
                          : 'Cancel Booking'}
                      </button>
                    )}

                  </div>

                </div>

              </article>

            ))}

          </div>
        )}

      </div>
    </main>
  );
}

export default MyBookings;
