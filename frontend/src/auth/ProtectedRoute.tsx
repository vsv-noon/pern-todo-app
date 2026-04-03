import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';
import Loader from '../components/Loader/Loader';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isActivated === false) return <Navigate to="/verify-your-email" replace />;
  return <Outlet />;
}
