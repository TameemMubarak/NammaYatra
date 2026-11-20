import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  CalendarDays,
  BusFront,
  ShieldCheck,
  Ticket,
  Sparkles,
} from 'lucide-react';

const destinations = [
  {
    city: 'Bangalore',
    subtitle: 'The garden city',
    image:
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=700&q=85',
  },
  {
    city: 'Hyderabad',
    subtitle: 'City of pearls',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5oRsVAKxr5lctrnGy1tdC7eoN00KE4WZ5vOzB6fIx1eNUvFXPV2EJGSs&s=10',
  },
  {
    city: 'Goa',
    subtitle: 'Find your sunshine',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&q=85',
  },
];

function Home() {
  const navigate = useNavigate();

  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const today = new Date().toLocaleDateString('en-CA');

  function handleSearch(event) {
    event.preventDefault();

    if (!source.trim() || !destination.trim() || !date) {
      alert('Please enter your source, destination and travel date.');
      return;
    }

    if (
      source.trim().toLowerCase() ===
      destination.trim().toLowerCase()
    ) {
      alert('Source and destination cannot be the same.');
      return;
    }

    navigate(
      `/search?source=${encodeURIComponent(source.trim())}&destination=${encodeURIComponent(destination.trim())}&date=${date}`
    );
  }

  return (
    <main className="min-h-screen bg-cream">

      {/* ================= HERO ================= */}

      <section className="px-4 pb-16 pt-6 sm:px-6 md:px-12 lg:px-20">

        <div className="relative min-h-[540px] overflow-hidden rounded-[2rem] bg-charcoal shadow-xl shadow-black/10 md:min-h-[620px]">

          {/* Real scenic photograph */}
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/053/041/838/small/aerial-view-of-airplane-flying-over-clear-turquoise-water-and-sandy-beach-during-sunny-day-free-photo.jpeg"
            alt="Passenger aircraft flying low over Mai Khao Beach in Phuket"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Image overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/5" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Hero content */}
          <div className="relative z-10 flex min-h-[540px] flex-col justify-center px-6 py-16 text-white sm:px-10 md:min-h-[620px] md:px-16">

            <div className="mb-7 flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-bold tracking-wider backdrop-blur-md">
              <Sparkles size={15} className="text-lime" />
              YOUR NEXT ADVENTURE STARTS HERE
            </div>

            <h1 className="max-w-3xl font-display text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Don't just travel.
              <br />
              <span className="text-lime">
                Feel the journey.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/85 md:text-lg">
              New places, new stories and unforgettable memories.
              Find your next bus journey with NammaYatra.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3 text-sm font-semibold">

              <span className="rounded-full bg-lime px-5 py-3 text-charcoal shadow-lg">
                Explore more. Worry less.
              </span>

              <span className="text-white/80">
                Your journey, your way.
              </span>

            </div>

          </div>

          {/* Hero destination label */}
          <div className="absolute bottom-7 right-8 z-10 hidden text-right text-white/90 md:block">
            <p className="font-display text-3xl font-bold">
              01 / 03
            </p>

            <p className="text-xs font-semibold tracking-[0.2em]">
              EXPLORE INDIA
            </p>
          </div>

          {/* Decorative bottom accent */}
          <div className="absolute bottom-0 left-0 h-1.5 w-1/3 bg-gradient-to-r from-lime via-tangerine to-transparent" />

        </div>
      </section>


      {/* ================= SEARCH ================= */}

      <section className="relative z-20 -mt-5 px-4 sm:px-6 md:px-12 lg:px-20">

        <div className="rounded-[2rem] bg-lime p-6 shadow-xl shadow-black/10 md:p-9">

          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal/60">
                Where are we going?
              </p>

              <h2 className="mt-1 font-display text-3xl font-bold">
                Find your ride.
              </h2>
            </div>

            <div className="rounded-full bg-charcoal px-4 py-2 text-xs font-semibold text-lime">
              <BusFront size={15} className="mr-2 inline" />
              Bus journeys made easy
            </div>

          </div>

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_0.9fr_auto]"
          >

            {/* Source */}
            <label className="rounded-2xl bg-white p-4 transition focus-within:ring-2 focus-within:ring-tangerine">

              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
                <MapPin size={15} />
                From
              </span>

              <input
                type="text"
                placeholder="Leaving from"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-transparent text-base font-bold outline-none placeholder:font-medium placeholder:text-gray-400"
                required
              />

            </label>

            {/* Destination */}
            <label className="rounded-2xl bg-white p-4 transition focus-within:ring-2 focus-within:ring-tangerine">

              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
                <MapPin size={15} />
                To
              </span>

              <input
                type="text"
                placeholder="Going to"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent text-base font-bold outline-none placeholder:font-medium placeholder:text-gray-400"
                required
              />

            </label>

            {/* Travel date */}
            <label className="rounded-2xl bg-white p-4 transition focus-within:ring-2 focus-within:ring-tangerine">

              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
                <CalendarDays size={15} />
                Travel date
              </span>

              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-base font-bold outline-none"
                required
              />

            </label>

            {/* Search button */}
            <button
              type="submit"
              className="flex min-h-[78px] items-center justify-center gap-3 rounded-2xl bg-charcoal px-8 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-tangerine"
            >
              Search Buses
              <ArrowRight size={19} />
            </button>

          </form>
        </div>
      </section>


      {/* ================= DESTINATIONS ================= */}

      <section className="px-5 py-24 md:px-12 lg:px-20">

        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-tangerine">
              THE PLACES YOU LOVE
            </p>

            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Popular destinations
              <span className="text-tangerine">.</span>
            </h2>

            <p className="mt-3 text-muted">
              A little inspiration for your next escape.
            </p>
          </div>

          <span className="flex items-center gap-2 text-sm font-bold">
            Explore India
            <ArrowUpRight size={18} />
          </span>

        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {destinations.map((place, index) => (

            <article
              key={place.city}
              className="group relative h-[360px] overflow-hidden rounded-[1.8rem] bg-charcoal shadow-sm"
            >

              <img
                src={place.image}
                alt={`${place.city} travel destination`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-7 text-white">

                <p className="mb-2 text-sm text-white/75">
                  0{index + 1} — DESTINATION
                </p>

                <h3 className="font-display text-3xl font-bold">
                  {place.city}
                </h3>

                <p className="mt-1 text-sm text-white/75">
                  {place.subtitle}
                </p>

              </div>

              <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-lime text-charcoal transition duration-300 group-hover:rotate-45">
                <ArrowUpRight size={21} />
              </div>

            </article>

          ))}

        </div>
      </section>


      {/* ================= WHY NAMMAYATRA ================= */}

      <section
        id="about"
        className="bg-white px-5 py-24 md:px-12 lg:px-20"
      >

        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-tangerine">
            THE NAMMAYATRA PROMISE
          </p>

          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Less planning stress.
            <br />
            <span className="text-tangerine">
              More travelling stories.
            </span>
          </h2>

          <p className="mt-5 leading-7 text-muted">
            We make finding and booking your bus journey simple,
            so you can spend more time looking forward to the destination.
          </p>

        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime">
              <Ticket size={28} />
            </div>

            <h3 className="mt-5 font-display text-xl font-bold">
              Easy booking
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              Find journeys and reserve your seats without unnecessary steps.
            </p>

          </div>

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFE4DB]">
              <ShieldCheck size={28} />
            </div>

            <h3 className="mt-5 font-display text-xl font-bold">
              Secure experience
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              Your account and booking experience are protected with authentication.
            </p>

          </div>

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8E8E8]">
              <BusFront size={28} />
            </div>

            <h3 className="mt-5 font-display text-xl font-bold">
              Your journey, simplified
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              View available seats, manage bookings and plan your next trip.
            </p>

          </div>

        </div>
      </section>


      {/* ================= FOOTER ================= */}

      <footer className="bg-charcoal px-5 py-12 text-white md:px-12 lg:px-20">

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

          <div>
            <h2 className="font-display text-3xl font-bold">
              namma<span className="text-lime">yatra.</span>
            </h2>

            <p className="mt-2 text-sm text-white/60">
              Every journey has a story. Start yours here.
            </p>
          </div>

          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} NammaYatra. Made for travellers.
          </p>

        </div>
      </footer>

    </main>
  );
}

export default Home;
