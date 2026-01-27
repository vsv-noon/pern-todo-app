import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
// import { useAuth } from '../context/AuthContext';

export function RootLayout() {
  const { user, logout } = useAuth();
  // console.log(user.email);
  return (
    <>
      <header style={{ padding: 16, borderBottom: '1px solid #ddd' }}>
        <NavLink to="/">🏠 Home</NavLink>
        <NavLink to="/about">ℹ️ About</NavLink>
        <NavLink to="/trash">🗑 Trash</NavLink>
        <NavLink to="/login">Sign in</NavLink>
        <p>{user?.email}</p>
        <p>{user?.id}</p>
        <button onClick={() => logout()}>sign out</button>
      </header>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </>
  );
}
