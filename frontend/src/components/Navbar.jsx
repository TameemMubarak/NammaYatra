import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

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
  Sparkles,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'ADMIN';
  const isPassenger = user?.role === 'PASSENGER';

  // Detect scrolling for the glass navbar effect.
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menus whenever the user navigates.
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  function closeMenus() {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenus();
    navigate('/');
  }

  const navLinkClass = ({ isActive }) =>
    `relative py-2 text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? 'text-orange-600'
        : 'text-charcoal/75 hover:text-orange-600'
    }`;

  const buttonClass =
    'rounded-full bg-charcoal px-6 py-3 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-tangerine hover:shadow-lg';

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'border-white/60 bg-white/90 py-2 shadow-lg shadow-black/5 backdrop-blur-2xl'
          : 'border-white/50 bg-white/75 py-3 shadow-sm backdrop-blur-xl'
      }`}
    >
      {/* Decorative gradient line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-lime via-tangerine to-orange-400" />

      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-16">

        {/* LOGO */}
        <Link
          to="/"
          onClick={closeMenus}
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-lime to-[#FFB18F] shadow-sm transition duration-300 group-hover:rotate-6 group-hover:scale-105">
            <Compass size={25} strokeWidth={2.5} />
          </div>

          <div>
            <span className="text-2xl font-black tracking-tight text-charcoal">
              namma<span className="text-tangerine">yatra.</span>
            </span>

            <p className="-mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-gray-400">
              Find your way
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-8 lg:flex">

          <NavLink to="/" end className={navLinkClass}>
            Explore
          </NavLink>

          {isPassenger && (
            <NavLink to="/bookings" className={navLinkClass}>
              My Bookings
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin Dashboard
            </NavLink>
          )}

          <a
            href="/#about"
            className="py-2 text-sm font-semibold text-charcoal/75 transition hover:text-orange-600"
          >
            About Us
          </a>

        </div>

        {/* DESKTOP AUTHENTICATION */}
        <div className="hidden items-center gap-5 md:flex">

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-sm font-bold text-charcoal transition hover:text-orange-600"
              >
                Login
              </Link>

              <Link to="/register" className={buttonClass}>
                Get Started
                <span className="ml-2">↗</span>
              </Link>
            </>
          ) : (
            <div className="relative">

              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-3 rounded-full border px-3 py-2 transition duration-200 ${
                  dropdownOpen
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-black/5 bg-white/80 hover:border-orange-200 hover:shadow-md'
                }`}
                aria-expanded={dropdownOpen}
                aria-label="Account menu"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-lime to-[#FFB18F]">
                  <UserRound size={19} />
                </div>

                <div className="text-left">
                  <p className="max-w-32 truncate text-sm font-bold">
                    {user?.name || 'My Account'}
                  </p>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {user?.role || 'User'}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />

              </button>

              {/* ACCOUNT DROPDOWN */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-black/5 bg-white/95 py-2 shadow-2xl shadow-black/10 backdrop-blur-xl">

                  <div className="border-b border-gray-100 bg-gradient-to-br from-orange-50 to-white px-5 py-4">

                    <p className="font-bold text-charcoal">
                      {user?.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user?.email}
                    </p>

                    <span className="mt-3 inline-block rounded-full bg-lime px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                      {user?.role}
                    </span>

                  </div>

                  <Link
                    to="/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    <User size={17} />
                    My Profile
                  </Link>

                  {isPassenger && (
                    <Link
                      to="/bookings"
                      onClick={closeMenus}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium transition hover:bg-orange-50 hover:text-orange-600"
                    >
                      <Ticket size={17} />
                      My Bookings
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMenus}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium transition hover:bg-orange-50 hover:text-orange-600"
                    >
                      <LayoutDashboard size={17} />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 border-t border-gray-100 px-5 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-xl border border-black/5 bg-white/80 p-2.5 transition hover:bg-orange-50 md:hidden"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

      </div>

      {/* MOBILE NAVIGATION */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-white/70 bg-white/95 px-5 py-6 shadow-xl shadow-black/10 backdrop-blur-2xl md:hidden">

          <div className="mx-auto flex max-w-xl flex-col gap-1">

            <NavLink
              to="/"
              end
              onClick={closeMenus}
              className={navLinkClass}
            >
              Explore
            </NavLink>

            {isPassenger && (
              <NavLink
                to="/bookings"
                onClick={closeMenus}
                className={navLinkClass}
              >
                My Bookings
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={closeMenus}
                className={navLinkClass}
              >
                Admin Dashboard
              </NavLink>
            )}

            <a
              href="/#about"
              onClick={closeMenus}
              className="py-2 text-sm font-semibold text-charcoal/75 transition hover:text-orange-600"
            >
              About Us
            </a>

            {isAuthenticated ? (
              <>

                <div className="my-3 rounded-2xl bg-gradient-to-br from-orange-50 to-lime/30 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                      <UserRound size={21} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-bold">
                        {user?.name}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>

                  </div>

                  <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-orange-600">
                    {user?.role}
                  </p>

                </div>

                <Link
                  to="/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 py-3 text-sm font-semibold"
                >
                  <User size={18} />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="mt-2 flex items-center gap-2 border-t border-black/10 py-4 text-sm font-bold text-red-600"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </>
            ) : (
              <div className="mt-4 flex items-center gap-4 border-t border-black/10 pt-5">

                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="font-bold"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenus}
                  className={buttonClass}
                >
                  Get Started ↗
                </Link>

              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-400">
              <Sparkles size={14} className="text-orange-400" />
              Your next journey starts here.
            </div>

          </div>
        </div>
      )}

    </nav>
  );
}

export default Navbar;
