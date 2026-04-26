import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🎓 Overseas Success Partners
      </Link>
      <div className="navbar-links">
        <NavLink to="/countries">Countries</NavLink>
        <NavLink to="/universities">Universities</NavLink>
        {user ? (
          <>
            <NavLink to="/eligibility">Eligibility</NavLink>
            <NavLink to="/recommendations">Recommendations</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
            <div className="navbar-user">
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{user.name}</span>
              <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
