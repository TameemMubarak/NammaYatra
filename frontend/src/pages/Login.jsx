import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Compass, LoaderCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const successMessage = location.state?.message;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email: email.trim(),
        password,
      });

      const data = response.data;

      login(data.accessToken, {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });

      navigate('/');
    } catch (err) {
      const responseData = err.response?.data;

      setError(
        responseData?.message ||
        responseData?.error ||
        'Unable to log in. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-5 pb-20 pt-8 md:px-12 lg:px-20">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-xl md:grid-cols-2">

        {/* LEFT VISUAL */}
        <section className="relative hidden min-h-[650px] overflow-hidden bg-charcoal md:block">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1100&q=85"
            alt="Beautiful mountain lake travel destination"
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
                YOUR NEXT CHAPTER
              </p>

              <h1 className="font-display text-5xl font-bold leading-tight">
                The world is
                <br />
                waiting.
                <br />
                <span className="text-lime">Let's go.</span>
              </h1>

              <p className="mt-5 max-w-sm leading-7 text-white/75">
                Sign in, find your next ride and turn ordinary days
                into extraordinary journeys.
              </p>
            </div>

            <p className="text-sm text-white/60">
              Every journey has a story.
            </p>
          </div>
        </section>

        {/* LOGIN FORM */}
        <section className="flex items-center justify-center px-6 py-14 md:px-12">
          <div className="w-full max-w-md">

            <div className="mb-10 md:hidden">
              <div className="flex items-center gap-2">
                <Compass className="text-tangerine" size={27} />
                <span className="font-display text-2xl font-bold">
                  namma<span className="text-tangerine">yatra.</span>
                </span>
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-tangerine">
              Welcome back
            </p>

            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">
              Let's get you
              <br />
              <span className="text-tangerine">moving.</span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-muted">
              Log in to continue your travel journey with us.
            </p>

            {successMessage && (
              <div className="mt-6 rounded-xl bg-lime/40 p-4 text-sm font-medium text-charcoal">
                {successMessage}
              </div>
            )}

            {error && (
              <div role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-9 space-y-5">

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-cream px-4 py-4 outline-none transition focus:border-charcoal focus:ring-2 focus:ring-lime"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold">
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-cream px-4 py-4 pr-12 outline-none transition focus:border-charcoal focus:ring-2 focus:ring-lime"
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
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to your account
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

            </form>

            <p className="mt-8 text-center text-sm text-muted">
              New to NammaYatra?{' '}
              <Link to="/register" className="font-bold text-charcoal underline decoration-lime decoration-2 underline-offset-4">
                Create an account
              </Link>
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
