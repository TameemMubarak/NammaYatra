import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Plus,
  RefreshCw,
  X,
  AlertCircle,
  Bus,
  MapPin,
  Clock,
} from 'lucide-react';
import api from '../services/api';

const emptyForm = {
  busId: '',
  source: '',
  destination: '',
  departureDateTime: '',
  arrivalDateTime: '',
  fare: '',
};

function getJourneyStatus(journey) {
  const now = new Date();
  const departure = new Date(journey.departureDateTime);
  const arrival = new Date(journey.arrivalDateTime);

  if (arrival <= now) {
    return {
      label: 'Completed',
      style: 'bg-gray-100 text-gray-600',
    };
  }

  if (departure <= now) {
    return {
      label: 'Departed',
      style: 'bg-orange-100 text-orange-700',
    };
  }

  if (!journey.active) {
    return {
      label: 'Inactive',
      style: 'bg-red-100 text-red-700',
    };
  }

  return {
    label: 'Scheduled',
    style: 'bg-green-100 text-green-700',
  };
}

function formatDateTime(value) {
  if (!value) return '—';

  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function AdminJourneys() {
  const [journeys, setJourneys] = useState([]);
  const [buses, setBuses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const [journeyResponse, busResponse] = await Promise.all([
        api.get('/api/admin/journeys'),
        api.get('/api/admin/buses/active'),
      ]);

      setJourneys(journeyResponse.data);
      setBuses(busResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load journey information.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleBusChange(event) {
    const busId = event.target.value;
    const selectedBus = buses.find(
      (bus) => String(bus.id) === busId
    );

    setForm((previous) => ({
      ...previous,
      busId,
      source: selectedBus?.source || '',
      destination: selectedBus?.destination || '',
    }));
  }

  function openForm() {
    setForm(emptyForm);
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payload = {
        busId: Number(form.busId),
        source: form.source.trim(),
        destination: form.destination.trim(),
        departureDateTime: form.departureDateTime,
        arrivalDateTime: form.arrivalDateTime,
        fare: Number(form.fare),
      };

      await api.post('/api/admin/journeys', payload);

      setShowForm(false);
      setForm(emptyForm);
      setSuccess('Journey scheduled successfully.');

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to schedule this journey.'
      );
    } finally {
      setSaving(false);
    }
  }

  const upcomingCount = journeys.filter((journey) => {
    return (
      journey.active &&
      new Date(journey.departureDateTime) > new Date()
    );
  }).length;

  const completedCount = journeys.filter((journey) => {
    return new Date(journey.arrivalDateTime) <= new Date();
  }).length;

  return (
    <main className="min-h-screen bg-cream px-5 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-orange-600">
              Administration
            </p>

            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Journey management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Schedule trips and monitor your journey timetable.
            </p>
          </div>

          <button
            onClick={openForm}
            disabled={buses.length === 0}
            className="flex items-center justify-center gap-2 rounded-xl bg-charcoal px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={18} />
            Schedule journey
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <p className="text-sm text-gray-500">Total journeys</p>
            <h2 className="mt-2 text-3xl font-black">
              {journeys.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <p className="text-sm text-gray-500">Upcoming journeys</p>
            <h2 className="mt-2 text-3xl font-black text-green-600">
              {upcomingCount}
            </h2>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <p className="text-sm text-gray-500">Completed journeys</p>
            <h2 className="mt-2 text-3xl font-black text-gray-500">
              {completedCount}
            </h2>
          </div>
        </div>

        {/* Journey table */}
        <section className="overflow-hidden rounded-2xl border border-black/5 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h2 className="font-bold">Journey timetable</h2>
              <p className="mt-1 text-xs text-gray-500">
                All scheduled trips across your fleet.
              </p>
            </div>

            <button
              onClick={loadData}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading journeys...
            </div>
          ) : journeys.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarDays
                className="mx-auto mb-3 text-gray-300"
                size={40}
              />

              <p className="font-semibold">No journeys scheduled yet.</p>

              <p className="mt-1 text-sm text-gray-500">
                Register a bus and schedule its first journey.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Journey</th>
                    <th className="px-5 py-4">Bus</th>
                    <th className="px-5 py-4">Departure</th>
                    <th className="px-5 py-4">Arrival</th>
                    <th className="px-5 py-4">Fare</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {[...journeys]
                    .sort(
                      (a, b) =>
                        new Date(a.departureDateTime) -
                        new Date(b.departureDateTime)
                    )
                    .map((journey) => {
                      const status = getJourneyStatus(journey);

                      return (
                        <tr
                          key={journey.id}
                          className="border-t border-gray-100"
                        >
                          <td className="px-5 py-4">
                            <p className="font-bold">
                              #{journey.id}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {journey.source} → {journey.destination}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-semibold">
                              {journey.bus?.busNumber || '—'}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {journey.bus?.operatorName || ''}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            {formatDateTime(journey.departureDateTime)}
                          </td>

                          <td className="px-5 py-4">
                            {formatDateTime(journey.arrivalDateTime)}
                          </td>

                          <td className="px-5 py-4 font-semibold">
                            ₹{Number(journey.fare).toLocaleString('en-IN')}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${status.style}`}
                            >
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {buses.length === 0 && !loading && (
          <p className="mt-4 text-sm text-orange-700">
            You need at least one active bus before scheduling a journey.
            Go to Bus Management and register or restore a bus.
          </p>
        )}

        {/* Create journey modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">
                    Schedule a journey
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Choose a bus and enter the trip details.
                  </p>
                </div>

                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg p-2 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">

                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold">
                      Select active bus
                    </span>

                    <select
                      required
                      name="busId"
                      value={form.busId}
                      onChange={handleBusChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
                    >
                      <option value="">Choose a bus</option>

                      {buses.map((bus) => (
                        <option key={bus.id} value={bus.id}>
                          {bus.busNumber} — {bus.operatorName}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      Source
                    </span>

                    <input
                      required
                      name="source"
                      value={form.source}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      Destination
                    </span>

                    <input
                      required
                      name="destination"
                      value={form.destination}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      Departure date and time
                    </span>

                    <input
                      required
                      type="datetime-local"
                      name="departureDateTime"
                      value={form.departureDateTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      Arrival date and time
                    </span>

                    <input
                      required
                      type="datetime-local"
                      name="arrivalDateTime"
                      value={form.arrivalDateTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold">
                      Journey fare (₹)
                    </span>

                    <input
                      required
                      type="number"
                      name="fare"
                      min="0.01"
                      step="0.01"
                      value={form.fare}
                      onChange={handleChange}
                      placeholder="Enter fare per passenger"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </label>

                </div>

                <div className="mt-7 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl border border-gray-200 px-5 py-3 font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || buses.length === 0}
                    className="rounded-xl bg-charcoal px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                  >
                    {saving ? 'Scheduling...' : 'Create journey'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminJourneys;

