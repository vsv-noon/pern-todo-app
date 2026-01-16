import { Outlet, NavLink } from 'react-router-dom';

export function RootLayout() {
  return (
    <>
      <header style={{ padding: 16, borderBottom: '1px solid #ddd' }}>
        <NavLink to="/">🏠 Home</NavLink>
        <NavLink to="/about">ℹ️ About</NavLink>
        <NavLink to="/trash">🗑 Trash</NavLink>
      </header>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </>
  );
}
