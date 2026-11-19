import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Menu,
  UserRound,
  LogOut,
  ChevronDown,
  User,
  LayoutDashboard,
  Ticket,
  X,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';
  const isPassenger = user?.role === 'PASSENGER';

  function closeMenus() {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenus();
    navigate('/');
  }

  const navLinkClass =
    'transition hover:text-tangerine';

  return (
    <nav className="relative z-50 flex items-center justify-between border-b border-black/5 bg-cream px-6 py-5 md:px-12 lg:px-20">

      {/* Logo */}
      <Link to="/" onClick={closeMenus} className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime">
          <Compass size={23} strokeWidth={2.5} />
        </div>

        <span className="text-2xl font-bold tracking-tight">
          namma<span className="text-tangerine">yatra.</span>
        </span>
      </Link>

      {/* Desktop navigation */}
      <div className="hidden items-center gap-9 text-sm font-semibold md:flex">

        <Link to="/" className={navLinkClass}>
          Explore
        </Link>

        {isPassenger && (
          <Link to="/bookings" className={navLinkClass}>
            My Bookings
          </Link>
        )}

        {isAdmin && (
          <Link to="/admin" className={navLinkClass}>
            Admin Dashboard
          </Link>
        )}

        <a href="/#about" className={navLinkClass}>
          About Us
        </a>
      </div>

      {/* Desktop authentication */}
      <div className="hidden items-center gap-4 md:flex">

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="font-semibold">
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-full bg-charcoal px-6 py-3 text-sm font-bold text-white transition hover:bg-tangerine"
            >
              Get Started
            </Link>
          </>
        ) : (
          <div className="relative">

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 transition hover:shadow-md"
              aria-expanded={dropdownOpen}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime">
                <UserRound size={19} />
              </div>

              <div className="text-left">
                <p className="max-w-32 truncate text-sm font-semibold">
                  {user?.name || 'My Account'}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {user?.role || 'User'}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-xl">

                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="truncate text-xs text-gray-500">
                    {user?.email}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-lime/50 px-2 py-1 text-[10px] font-bold uppercase">
                    {user?.role}
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50"
                >
                  <User size={17} />
                  My Profile
                </Link>

                {isPassenger && (
                  <Link
                    to="/bookings"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50"
                  >
                    <Ticket size={17} />
                    My Bookings
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50"
                  >
                    <LayoutDashboard size={17} />
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>

              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="rounded-lg p-2 transition hover:bg-black/5 md:hidden"
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-black/5 bg-cream px-6 py-5 shadow-xl md:hidden">

          <div className="flex flex-col gap-4 text-sm font-semibold">

            <Link to="/" onClick={closeMenus} className={navLinkClass}>
              Explore
            </Link>

            {isPassenger && (
              <Link to="/bookings" onClick={closeMenus} className={navLinkClass}>
                My Bookings
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" onClick={closeMenus} className={navLinkClass}>
                Admin Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={closeMenus} className={navLinkClass}>
                  My Profile
                </Link>

                <div className="border-t border-black/10 pt-4">
                  <p className="text-xs text-gray-500">
                    {user?.name} · {user?.role}
                  </p>

                  <button
                    onClick={handleLogout}
                    className="mt-3 flex items-center gap-2 text-red-600"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-5 border-t border-black/10 pt-4">
                <Link to="/login" onClick={closeMenus}>
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenus}
                  className="rounded-full bg-charcoal px-5 py-3 text-white"
                >
                  Get Started
                </Link>
              </div>
            )}

          </div>
        </div>
      )}

    </nav>
  );
}

export default Navbar;
