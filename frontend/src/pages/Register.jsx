import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Compass,
  LoaderCircle,
} from 'lucide-react';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.password.length < 8 || form.password.length > 72) {
      setError('Password must contain between 8 and 72 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/register', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || null,
      });

      navigate('/login', {
        state: {
          message: response.data.message || 'Account created successfully. Please log in.',
        },
      });
    } catch (err) {
      const responseData = err.response?.data;

      let errorMessage =
        responseData?.message ||
        responseData?.error ||
        'Registration failed. Please try again.';

      // Handle Spring validation errors if returned as field errors.
      if (responseData?.errors) {
        errorMessage = Object.values(responseData.errors).join(', ');
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-5 pb-20 pt-8 md:px-12 lg:px-20">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-xl md:grid-cols-2">

        {/* LEFT VISUAL */}
        <section className="relative hidden min-h-[720px] overflow-hidden bg-charcoal md:block">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1100&q=85"
            alt="Mountain landscape"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <div className="flex items-center gap-2">
              <Compass className="text-lime" size={28} />
              <span className="font-display text-xl font-bold">
                namma<span className="text-lime">yatra.</span>
              </span>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold tracking-[0.2em] text-lime">
                GOOD THINGS START HERE
              </p>

              <h1 className="font-display text-5xl font-bold leading-tight">
                New account.
                <br />
                New places.
                <br />
                <span className="text-lime">New stories.</span>
              </h1>

              <p className="mt-5 max-w-sm leading-7 text-white/75">
                Create your account and make your next journey
                just a few clicks away.
              </p>
            </div>

            <p className="text-sm text-white/60">
              Your next adventure is closer than you think.
            </p>
          </div>
        </section>

        {/* REGISTRATION FORM */}
        <section className="flex items-center justify-center px-6 py-12 md:px-12">
          <div className="w-full max-w-md">

            <div className="mb-8 md:hidden">
              <div className="flex items-center gap-2">
                <Compass className="text-tangerine" size={27} />
                <span className="font-display text-2xl font-bold">
                  namma<span className="text-tangerine">yatra.</span>
                </span>
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-tangerine">
              Join the journey
            </p>

            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">
              Let's create
              <br />
              <span className="text-tangerine">your account.</span>
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              A few details and you're ready to explore.
            </p>

            {error && (
              <div role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">

              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-bold">
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={80}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-cream px-4 py-3.5 outline-none transition focus:border-charcoal focus:ring-2 focus:ring-lime"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-cream px-4 py-3.5 outline-none transition focus:border-charcoal focus:ring-2 focus:ring-lime"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-bold">
                  Phone number <span className="font-normal text-muted">(Optional)</span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-cream px-4 py-3.5 outline-none transition focus:border-charcoal focus:ring-2 focus:ring-lime"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold">
                  Create password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    minLength={8}
                    maxLength={72}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-cream px-4 py-3.5 pr-12 outline-none transition focus:border-charcoal focus:ring-2 focus:ring-lime"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-charcoal px-6 py-4 font-bold text-white transition hover:bg-tangerine disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" size={19} />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

            </form>

            <p className="mt-7 text-center text-sm text-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-charcoal underline decoration-lime decoration-2 underline-offset-4">
                Login
              </Link>
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
