import { useNavigate } from 'react-router-dom';
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  ArrowLeft,
  Ticket,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">

        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-black"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
            Account Settings
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Your Profile<span className="text-orange-500">.</span>
          </h1>

          <p className="mt-3 text-gray-500">
            Manage your account and view your NammaYatra account details.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">

          <div className="bg-charcoal px-6 py-10 text-white sm:px-10">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-lime text-charcoal">
                <UserRound size={38} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {user?.name || 'NammaYatra User'}
                </h2>

                <p className="mt-1 text-sm text-white/60">
                  {user?.email}
                </p>

                <span className="mt-3 inline-flex rounded-full bg-lime px-4 py-1 text-xs font-bold text-charcoal">
                  {user?.role || 'USER'}
                </span>
              </div>

            </div>
          </div>

          <div className="p-6 sm:p-10">

            <h3 className="mb-6 text-lg font-bold">
              Account Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">

              <div className="rounded-2xl bg-cream p-5">
                <div className="mb-3 flex items-center gap-2 text-gray-500">
                  <UserRound size={18} />
                  <span className="text-sm font-medium">Full Name</span>
                </div>

                <p className="font-bold">
                  {user?.name || 'Not available'}
                </p>
              </div>

              <div className="rounded-2xl bg-cream p-5">
                <div className="mb-3 flex items-center gap-2 text-gray-500">
                  <Mail size={18} />
                  <span className="text-sm font-medium">Email Address</span>
                </div>

                <p className="break-all font-bold">
                  {user?.email || 'Not available'}
                </p>
              </div>

              <div className="rounded-2xl bg-cream p-5">
                <div className="mb-3 flex items-center gap-2 text-gray-500">
                  <ShieldCheck size={18} />
                  <span className="text-sm font-medium">Account Role</span>
                </div>

                <p className="font-bold">
                  {isAdmin ? 'Administrator' : 'Passenger'}
                </p>
              </div>

              <div className="rounded-2xl bg-cream p-5">
                <div className="mb-3 flex items-center gap-2 text-gray-500">
                  <CalendarDays size={18} />
                  <span className="text-sm font-medium">Account ID</span>
                </div>

                <p className="font-bold">
                  {user?.id ?? 'Not available'}
                </p>
              </div>

            </div>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <h3 className="mb-5 text-lg font-bold">
                Quick Actions
              </h3>

              <div className="flex flex-col gap-3 sm:flex-row">

                {isAdmin ? (
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center justify-center gap-2 rounded-xl bg-charcoal px-5 py-3 font-semibold text-white transition hover:bg-black"
                  >
                    <LayoutDashboard size={18} />
                    Admin Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/bookings')}
                    className="flex items-center justify-center gap-2 rounded-xl bg-charcoal px-5 py-3 font-semibold text-white transition hover:bg-black"
                  >
                    <Ticket size={18} />
                    My Bookings
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>
            </div>

          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          NammaYatra · Your journeys, your account.
        </p>

      </div>
    </div>
  );
}

export default Profile;
