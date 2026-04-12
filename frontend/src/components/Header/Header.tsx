import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/useAuth';
// import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { HeaderModal } from '../HeaderModal/HeaderModal';

import './style.css';

export function Header() {
  const { user, logout } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <header className="header">
      <nav className="header-nav">
        <NavLink
          style={({ isActive, isPending }) => ({
            color: isActive ? 'grey' : isPending ? 'blue' : 'black',
          })}
          to="/"
        >
          🏠 Home
        </NavLink>
        {user && (
          <>
            <NavLink
              style={({ isActive, isPending }) => ({
                color: isActive ? 'grey' : isPending ? 'blue' : 'black',
              })}
              to="/dashboard"
            >
              Dashboard
            </NavLink>
            <NavLink
              style={({ isActive, isPending }) => ({
                color: isActive ? 'grey' : isPending ? 'blue' : 'black',
              })}
              to="/goals"
            >
              Goals
            </NavLink>
            <NavLink
              style={({ isActive, isPending }) => ({
                color: isActive ? 'grey' : isPending ? 'blue' : 'black',
              })}
              to="/tasks"
            >
              Tasks
            </NavLink>
            <NavLink
              style={({ isActive, isPending }) => ({
                color: isActive ? 'grey' : isPending ? 'blue' : 'black',
              })}
              to="/measurements"
            >
              Measurements
            </NavLink>
            <NavLink
              style={({ isActive, isPending }) => ({
                color: isActive ? 'grey' : isPending ? 'blue' : 'black',
              })}
              to="/trash"
            >
              🗑 Trash
            </NavLink>
          </>
        )}
        <NavLink
          style={({ isActive, isPending }) => ({
            color: isActive ? 'grey' : isPending ? 'blue' : 'black',
          })}
          to="/about"
        >
          ℹ️ About
        </NavLink>
      </nav>
      {!user && (
        <div>
          <NavLink to="/login">Sign in</NavLink>
        </div>
      )}
      {user && <button onClick={() => setModalOpen(true)}>{user?.email}</button>}
      <HeaderModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onConfirm={logout} />
    </header>
  );
}
