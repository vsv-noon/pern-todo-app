import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';
// import { useAuth } from '../context/AuthContext';
export function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}
