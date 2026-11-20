import { useEffect, useState } from 'react';
import {
  Bus,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  X,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';

const emptyForm = {
  busNumber: '',
  operatorName: '',
  source: '',
  destination: '',
  departureTime: '',
  arrivalTime: '',
  totalSeats: 40,
  fare: '',
};

function AdminBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadBuses() {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/admin/buses');
      setBuses(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load buses.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBuses();
  }, []);

  function openAddForm() {
    setEditingBus(null);
    setForm(emptyForm);
    setShowForm(true);
    setError('');
    setSuccess('');
  }

  function openEditForm(bus) {
    setEditingBus(bus);

    setForm({
      busNumber: bus.busNumber,
      operatorName: bus.operatorName,
      source: bus.source,
      destination: bus.destination,
      departureTime: bus.departureTime?.slice(0, 5) || '',
      arrivalTime: bus.arrivalTime?.slice(0, 5) || '',
      totalSeats: bus.totalSeats,
      fare: bus.fare,
    });

    setShowForm(true);
    setError('');
    setSuccess('');
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payload = {
        ...form,
        departureTime: `${form.departureTime}:00`,
        arrivalTime: `${form.arrivalTime}:00`,
        totalSeats: Number(form.totalSeats),
        fare: Number(form.fare),
      };

      if (editingBus) {
        await api.put(
          `/api/admin/buses/${editingBus.id}`,
          payload
        );

        setSuccess('Bus details updated successfully.');
      } else {
        await api.post('/api/admin/buses', payload);

        setSuccess('Bus added successfully.');
      }

      setShowForm(false);
      setEditingBus(null);
      setForm(emptyForm);

      await loadBuses();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to save bus details.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function retireBus(bus) {
    const confirmed = window.confirm(
      `Retire bus ${bus.busNumber}? It will no longer be available for new journeys.`
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      await api.delete(`/api/admin/buses/${bus.id}`);

      setSuccess(`${bus.busNumber} has been retired.`);
      await loadBuses();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to retire this bus.'
      );
    }
  }

  async function restoreBus(bus) {
    const confirmed = window.confirm(
      `Restore bus ${bus.busNumber} to the active fleet?`
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      await api.patch(
        `/api/admin/buses/${bus.id}/activate`
      );

      setSuccess(`${bus.busNumber} has been restored.`);
      await loadBuses();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to restore this bus.'
      );
    }
  }

  return (
    <main className="min-h-screen bg-cream px-5 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-orange-600">
              Administration
            </p>

            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Bus management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your fleet and maintain bus information.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-charcoal px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus size={18} />
            Add bus
          </button>
        </div>

        {/* Messages */}
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

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <p className="text-sm text-gray-500">Total buses</p>
            <h2 className="mt-2 text-3xl font-black">
              {buses.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <p className="text-sm text-gray-500">Active fleet</p>
            <h2 className="mt-2 text-3xl font-black text-green-600">
              {buses.filter((bus) => bus.active).length}
            </h2>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <p className="text-sm text-gray-500">Retired buses</p>
            <h2 className="mt-2 text-3xl font-black text-gray-400">
              {buses.filter((bus) => !bus.active).length}
            </h2>
          </div>
        </div>

        {/* Bus list */}
        <section className="overflow-hidden rounded-2xl border border-black/5 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h2 className="font-bold">Fleet inventory</h2>
              <p className="mt-1 text-xs text-gray-500">
                All registered buses, including retired buses.
              </p>
            </div>

            <button
              onClick={loadBuses}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading buses...
            </div>
          ) : buses.length === 0 ? (
            <div className="p-12 text-center">
              <Bus className="mx-auto mb-3 text-gray-300" size={40} />
              <p className="font-semibold">No buses registered yet.</p>
              <p className="mt-1 text-sm text-gray-500">
                Add your first bus to begin scheduling journeys.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Bus</th>
                    <th className="px-5 py-4">Operator</th>
                    <th className="px-5 py-4">Route</th>
                    <th className="px-5 py-4">Seats</th>
                    <th className="px-5 py-4">Fare</th>
                    <th className="px-5 py-4">Fleet status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {buses.map((bus) => (
                    <tr
                      key={bus.id}
                      className="border-t border-gray-100"
                    >
                      <td className="px-5 py-4 font-bold">
                        {bus.busNumber}
                      </td>

                      <td className="px-5 py-4">
                        {bus.operatorName}
                      </td>

                      <td className="px-5 py-4">
                        {bus.source} → {bus.destination}
                      </td>

                      <td className="px-5 py-4">
                        {bus.totalSeats}
                      </td>

                      <td className="px-5 py-4">
                        ₹{Number(bus.fare).toLocaleString('en-IN')}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            bus.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {bus.active ? 'Active' : 'Retired'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditForm(bus)}
                            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                            title="Edit bus"
                          >
                            <Pencil size={17} />
                          </button>

                          {bus.active ? (
                            <button
                              onClick={() => retireBus(bus)}
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                              title="Retire bus"
                            >
                              <Trash2 size={17} />
                            </button>
                          ) : (
                            <button
                              onClick={() => restoreBus(bus)}
                              className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                              title="Restore bus"
                            >
                              <RotateCcw size={17} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Add / Edit form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">
                    {editingBus ? 'Edit bus' : 'Register a bus'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter the vehicle and route information.
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

                  {[
                    ['busNumber', 'Bus registration number', 'text'],
                    ['operatorName', 'Operator name', 'text'],
                    ['source', 'Source', 'text'],
                    ['destination', 'Destination', 'text'],
                    ['departureTime', 'Departure time', 'time'],
                    ['arrivalTime', 'Arrival time', 'time'],
                    ['totalSeats', 'Total seats', 'number'],
                    ['fare', 'Fare (₹)', 'number'],
                  ].map(([name, label, type]) => (
                    <label key={name} className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        {label}
                      </span>

                      <input
                        required
                        type={type}
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        min={
                          name === 'totalSeats' || name === 'fare'
                            ? '1'
                            : undefined
                        }
                        step={name === 'fare' ? '0.01' : undefined}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                      />
                    </label>
                  ))}

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
                    disabled={saving}
                    className="rounded-xl bg-charcoal px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                  >
                    {saving
                      ? 'Saving...'
                      : editingBus
                        ? 'Update bus'
                        : 'Register bus'}
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

export default AdminBuses;
