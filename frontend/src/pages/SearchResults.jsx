import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BusFront,
  CalendarDays,
  Clock3,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  Users,
} from 'lucide-react';

import api from '../services/api';

function formatTime(value) {
  return new Date(value).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDuration(departure, arrival) {
  const minutes = Math.max(
    0,
    Math.round((new Date(arrival) - new Date(departure)) / 60000)
  );

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';

  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('departure');

  useEffect(() => {
    let cancelled = false;

    async function loadJourneys() {
      if (!source || !destination || !date) {
        setError('Search details are incomplete. Please search again.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await api.get('/api/passenger/journeys/search', {
          params: { source, destination, date },
        });

        const results = response.data;

        // Fetch seat inventory for each journey so availability is accurate.
        const journeysWithSeats = await Promise.all(
          results.map(async (journey) => {
            try {
              const seatResponse = await api.get(
                `/api/passenger/journeys/${journey.journeyId}/seats`
              );

              const seats = seatResponse.data;
              const availableSeats = seats.filter(
                (seat) => seat.status === 'AVAILABLE'
              ).length;

              return {
                ...journey,
                availableSeats,
                seatDataLoaded: true,
              };
            } catch {
              return {
                ...journey,
                availableSeats: null,
                seatDataLoaded: false,
              };
            }
          })
        );

        if (!cancelled) {
          setJourneys(journeysWithSeats);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              'We could not load journeys right now. Please try again.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadJourneys();

    return () => {
      cancelled = true;
    };
  }, [source, destination, date]);

  const sortedJourneys = useMemo(() => {
    const copy = [...journeys];

    if (sortBy === 'price') {
      copy.sort((a, b) => Number(a.fare) - Number(b.fare));
    } else if (sortBy === 'duration') {
      copy.sort(
        (a, b) =>
          new Date(a.arrivalDateTime) -
          new Date(a.departureDateTime) -
          (new Date(b.arrivalDateTime) - new Date(b.departureDateTime))
      );
    } else {
      copy.sort(
        (a, b) =>
          new Date(a.departureDateTime) -
          new Date(b.departureDateTime)
      );
    }

    return copy;
  }, [journeys, sortBy]);

  return (
    <main className="min-h-screen bg-cream px-4 pb-20 pt-8 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">

        <button
          onClick={() => navigate('/')}
          className="mb-7 flex items-center gap-2 text-sm font-bold text-charcoal/60 transition hover:text-tangerine"
        >
          <ArrowLeft size={17} />
          Back to search
        </button>

        {/* Search summary */}
        <section className="overflow-hidden rounded-[2rem] bg-charcoal p-6 text-white md:p-9">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-lime">
                YOUR NEXT JOURNEY
              </p>

              <div className="flex flex-wrap items-center gap-3 md:gap-5">
                <h1 className="font-display text-3xl font-bold md:text-5xl">
                  {source}
                </h1>

                <ArrowRight className="text-lime" size={25} />

                <h1 className="font-display text-3xl font-bold md:text-5xl">
                  {destination}
                </h1>
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-white/60">
                <CalendarDays size={16} />
                {date ? formatDate(date) : 'Travel date not selected'}
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-fit rounded-xl bg-lime px-5 py-3 text-sm font-bold text-charcoal transition hover:bg-white"
            >
              Change search
            </button>
          </div>
        </section>

        {/* Results heading and sorting */}
        <section className="mb-6 mt-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-tangerine">
              THE ROAD IS CALLING
            </p>

            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Available journeys<span className="text-tangerine">.</span>
            </h2>

            <p className="mt-2 text-sm text-charcoal/55">
              {loading
                ? 'Finding journeys for you...'
                : `${journeys.length} ${journeys.length === 1 ? 'journey' : 'journeys'} found`}
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3">
            <SlidersHorizontal size={17} className="text-tangerine" />
            <span className="text-sm font-semibold">Sort by</span>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="bg-transparent text-sm font-bold outline-none"
            >
              <option value="departure">Departure time</option>
              <option value="price">Lowest price</option>
              <option value="duration">Duration</option>
            </select>
          </label>
        </section>

        {/* Loading */}
        {loading && (
          <div className="rounded-[1.8rem] bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-lime border-t-charcoal" />
            <h3 className="text-xl font-bold">Finding your ride...</h3>
            <p className="mt-2 text-sm text-charcoal/50">
              Checking journeys and seat availability.
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-[1.8rem] border border-red-200 bg-white p-8 text-center">
            <h3 className="text-xl font-bold text-charcoal">
              Something went wrong
            </h3>
            <p className="mt-2 text-sm text-red-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-charcoal px-5 py-3 text-sm font-bold text-white transition hover:bg-tangerine"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && journeys.length === 0 && (
          <div className="rounded-[1.8rem] bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime">
              <BusFront size={30} />
            </div>

            <h3 className="mt-6 font-display text-2xl font-bold">
              No journeys found.
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-charcoal/55">
              We couldn't find a journey for this route and date. Try another
              date or check the city names.
            </p>

            <button
              onClick={() => navigate('/')}
              className="mt-7 rounded-xl bg-charcoal px-6 py-3 text-sm font-bold text-white transition hover:bg-tangerine"
            >
              Search another route
            </button>
          </div>
        )}

        {/* Journey cards */}
        {!loading && !error && sortedJourneys.length > 0 && (
          <div className="space-y-5">
            {sortedJourneys.map((journey) => {
              const isFull =
                journey.seatDataLoaded && journey.availableSeats === 0;

              return (
                <article
                  key={journey.journeyId}
                  className="group overflow-hidden rounded-[1.8rem] border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">

                    <div>
                      <div className="mb-6 flex flex-wrap items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime">
                          <BusFront size={22} />
                        </div>

                        <div>
                          <h3 className="font-bold">
                            {journey.operatorName || 'Bus operator'}
                          </h3>
                          <p className="text-xs text-charcoal/50">
                            {journey.busNumber}
                          </p>
                        </div>

                        <span className="ml-auto rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-charcoal/60">
                          Journey #{journey.journeyId}
                        </span>
                      </div>

                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:max-w-2xl md:gap-7">
                        <div>
                          <p className="font-display text-2xl font-bold md:text-3xl">
                            {formatTime(journey.departureDateTime)}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-charcoal/60">
                            {journey.source}
                          </p>
                        </div>

                        <div className="flex min-w-20 flex-col items-center gap-2">
                          <span className="text-xs font-semibold text-charcoal/45">
                            {getDuration(
                              journey.departureDateTime,
                              journey.arrivalDateTime
                            )}
                          </span>
                          <div className="relative flex w-full items-center">
                            <div className="h-px w-full border-t border-dashed border-charcoal/30" />
                            <BusFront
                              className="absolute left-1/2 -translate-x-1/2 bg-white px-1 text-tangerine"
                              size={24}
                            />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40">
                            Direct
                          </span>
                        </div>

                        <div className="text-right">
                          <p className="font-display text-2xl font-bold md:text-3xl">
                            {formatTime(journey.arrivalDateTime)}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-charcoal/60">
                            {journey.destination}
                          </p>
                        </div>
                      </div>

                      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-black/5 pt-5 text-xs font-semibold text-charcoal/55">
                        <span className="flex items-center gap-2">
                          <Clock3 size={15} />
                          {formatDate(date)}
                        </span>

                        <span className="flex items-center gap-2">
                          <Users size={15} />
                          {journey.seatDataLoaded
                            ? `${journey.availableSeats} of ${journey.totalSeats} seats available`
                            : `${journey.totalSeats} total seats`}
                        </span>

                        <span className="flex items-center gap-2">
                          <MapPin size={15} />
                          {journey.source} → {journey.destination}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-5 border-t border-black/5 pt-5 md:min-w-48 md:flex-col md:items-end md:border-l md:border-t-0 md:pl-7 md:pt-0">
                      <div>
                        <p className="text-xs font-semibold text-charcoal/45">
                          Starting from
                        </p>
                        <p className="mt-1 font-display text-3xl font-bold">
                          ₹{Number(journey.fare).toLocaleString('en-IN')}
                        </p>
                        <p className="mt-1 text-xs text-charcoal/45">
                          per seat
                        </p>
                      </div>

                      <button
                        disabled={isFull}
                        onClick={() => {
  const params = new URLSearchParams({
    source: journey.source,
    destination: journey.destination,
    date,
    fare: String(journey.fare),
    operator: journey.operatorName || 'Bus operator',
    busNumber: journey.busNumber || '',
  });

  navigate(
    `/journeys/${journey.journeyId}/seats?${params.toString()}`
  );
}}
                        className="flex items-center gap-2 rounded-xl bg-charcoal px-5 py-3 text-sm font-bold text-white transition hover:bg-tangerine disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        {isFull ? 'Fully booked' : 'Choose seats'}
                        {!isFull && <ArrowRight size={17} />}
                      </button>
                    </div>

                  </div>

                  {isFull && (
                    <div className="bg-red-50 px-6 py-2 text-xs font-bold text-red-600">
                      This journey is fully booked.
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}

export default SearchResults;
