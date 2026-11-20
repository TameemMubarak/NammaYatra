import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bus,
  CalendarDays,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  Settings2,
} from 'lucide-react';

import api from '../services/api';

function AdminDashboard() {
  const [busCount, setBusCount] = useState(0);
  const [journeyCount, setJourneyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadDashboard() {
    try {
      setLoading(true);
      setError('');

      const [busesResponse, journeysResponse] = await Promise.all([
        api.get('/api/admin/buses'),
        api.get('/api/admin/journeys'),
      ]);

      setBusCount(busesResponse.data.length);
      setJourneyCount(journeysResponse.data.length);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load dashboard information.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <main className="min-h-screen bg-cream px-6 py-12 md:px-12 lg:px-20">

      <section className="mx-auto max-w-6xl">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-tangerine">
              Administration
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Admin <span className="text-tangerine">Dashboard.</span>
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Manage your buses and scheduled journeys.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold transition hover:shadow-sm sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} />
            {error}
          </div>
        )}

        {/* Dashboard statistics */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">

          <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-lime p-3">
                <Bus size={25} />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Fleet
              </span>
            </div>

            <p className="mt-7 text-sm font-medium text-gray-500">
              Total Buses
            </p>

            <h2 className="mt-1 text-4xl font-bold">
              {loading ? '—' : busCount}
            </h2>

            <Link
              to="/admin/buses"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold transition hover:text-tangerine"
            >
              Manage buses
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-orange-100 p-3">
                <CalendarDays size={25} />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Scheduling
              </span>
            </div>

            <p className="mt-7 text-sm font-medium text-gray-500">
              Total Journeys
            </p>

            <h2 className="mt-1 text-4xl font-bold">
              {loading ? '—' : journeyCount}
            </h2>

            <Link
              to="/admin/journeys"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold transition hover:text-tangerine"
            >
              Manage journeys
              <ArrowUpRight size={17} />
            </Link>
          </div>

        </div>

        {/* Management section */}
        <div className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <Settings2 size={21} />
            <h2 className="text-xl font-bold">Management</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <Link
              to="/admin/buses"
              className="group flex items-center justify-between rounded-3xl border border-black/5 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="mb-4 inline-flex rounded-xl bg-lime p-3">
                  <Bus size={23} />
                </div>

                <h3 className="text-lg font-bold">Bus Management</h3>

                <p className="mt-2 text-sm text-gray-500">
                  Add, update, view and deactivate buses.
                </p>
              </div>

              <ArrowUpRight
                size={22}
                className="transition group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/admin/journeys"
              className="group flex items-center justify-between rounded-3xl border border-black/5 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="mb-4 inline-flex rounded-xl bg-orange-100 p-3">
                  <CalendarDays size={23} />
                </div>

                <h3 className="text-lg font-bold">Journey Management</h3>

                <p className="mt-2 text-sm text-gray-500">
                  View and schedule bus journeys.
                </p>
              </div>

              <ArrowUpRight
                size={22}
                className="transition group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>

          </div>
        </div>

      </section>
    </main>
  );
}

export default AdminDashboard;
