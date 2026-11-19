import { Link } from 'react-router-dom';
import { Compass, Menu } from 'lucide-react';

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-5 md:px-12 lg:px-20">

      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime">
          <Compass size={23} strokeWidth={2.5} />
        </div>

        <span className="font-display text-2xl font-bold tracking-tight">
          namma<span className="text-tangerine">yatra.</span>
        </span>
      </Link>

      <div className="hidden items-center gap-9 text-sm font-semibold md:flex">
        <Link to="/" className="hover:text-tangerine">Explore</Link>
        <Link to="/bookings" className="hover:text-tangerine">My Bookings</Link>
        <a href="#about" className="hover:text-tangerine">About Us</a>
      </div>

      <div className="hidden items-center gap-4 md:flex">
        <Link to="/login" className="font-semibold">
          Login
        </Link>

        <Link
          to="/register"
          className="rounded-full bg-charcoal px-6 py-3 text-sm font-bold text-white transition hover:bg-tangerine"
        >
          Get Started
        </Link>
      </div>

      <button className="md:hidden" aria-label="Open menu">
        <Menu size={26} />
      </button>

    </nav>
  );
}

export default Navbar;
