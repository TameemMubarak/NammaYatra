import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Not logged in: redirect to login.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Logged in, but does not have the required role.
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  // Authorized user: render the requested page.
  return <Outlet />;
}

export default ProtectedRoute;
