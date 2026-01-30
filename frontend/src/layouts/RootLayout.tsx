import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
// import { useAuth } from '../context/AuthContext';

export function RootLayout() {
  const { user, logout } = useAuth();
  // console.log(user.email);
  return (
    <div className="container">
      <header className="header">
        <nav className="header-nav">
          <NavLink to="/">🏠 Home</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/about">ℹ️ About</NavLink>
          {user && <NavLink to="/trash">🗑 Trash</NavLink>}
        </nav>
        {user && (
          <div className="header-user-info">
            <p>email: {user?.email}</p>
            <p>id: {user?.id}</p>
          </div>
        )}
        {user ? (
          <button onClick={() => logout()}>sign out</button>
        ) : (
          <div>
            <NavLink to="/login">Sign in</NavLink>
          </div>
        )}
      </header>

      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
