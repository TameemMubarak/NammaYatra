import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import { AuthProvider } from './context/AuthContext';

// Temporary page until the actual feature is implemented.
function FeaturePlaceholder({ title, description }) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <div className="rounded-3xl border border-black/5 bg-white p-10 shadow-sm">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-tangerine">
          NammaYatra
        </p>

        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="mt-4 max-w-2xl text-gray-600">
          {description}
        </p>

        <p className="mt-8 text-sm font-semibold text-gray-400">
          Frontend implementation coming next.
        </p>
      </div>
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-cream">
          <Navbar />

          <Routes>

            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Passenger and Admin */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={['PASSENGER', 'ADMIN']}
                />
              }
            >
              <Route
                path="/profile"
                element={
                  <FeaturePlaceholder
                    title="My Profile"
                    description="View your NammaYatra account information."
                  />
                }
              />
            </Route>

            {/* Passenger only */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['PASSENGER']} />
              }
            >
              <Route
                path="/bookings"
                element={
                  <FeaturePlaceholder
                    title="My Bookings"
                    description="View your bookings, booking references, journey details and cancellation options."
                  />
                }
              />
            </Route>

            {/* Admin only */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['ADMIN']} />
              }
            >
              <Route
                path="/admin"
                element={
                  <FeaturePlaceholder
                    title="Admin Dashboard"
                    description="Manage the buses and journeys supported by the NammaYatra backend."
                  />
                }
              />

              <Route
                path="/admin/buses"
                element={
                  <FeaturePlaceholder
                    title="Bus Management"
                    description="Add, view, update and deactivate buses."
                  />
                }
              />

              <Route
                path="/admin/journeys"
                element={
                  <FeaturePlaceholder
                    title="Journey Management"
                    description="Schedule and manage journeys using the existing backend functionality."
                  />
                }
              />
            </Route>

            {/* Unknown routes */}
            <Route
              path="*"
              element={
                <FeaturePlaceholder
                  title="Page Not Found"
                  description="The page you're looking for doesn't exist."
                />
              }
            />

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

