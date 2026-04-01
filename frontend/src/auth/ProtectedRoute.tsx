import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';
import Loader from '../components/Loader/Loader';
// import type { AuthContextType } from './types';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  console.log(user);
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isActivated === false) return <Navigate to="/please-verify-email" />;
  return <Outlet />;
}
