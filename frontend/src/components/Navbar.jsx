import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { siteConfig, theme, themes, switchTheme, getLogoUrl } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const appName = siteConfig?.branding?.appName || 'Overseas Success Partners';
  const logoUrl = getLogoUrl();

  const currentMode = theme?.mode || 'light';
  const darkTheme = themes.find(t => t.mode === 'dark');
  const lightTheme = themes.find(t => t.mode === 'light' && t.isDefault);

  const handleThemeToggle = () => {
    if (currentMode === 'light' && darkTheme) {
      switchTheme(darkTheme._id);
    } else if (lightTheme) {
      switchTheme(lightTheme._id);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          {logoUrl ? <img src={logoUrl} alt={appName} /> : <span>🎓</span>}
          {appName}
        </Link>

        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation">
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/countries" className={isActive('/countries')} onClick={() => setMenuOpen(false)}>Countries</Link>
          <Link to="/universities" className={isActive('/universities')} onClick={() => setMenuOpen(false)}>Universities</Link>
          {user && (
            <>
              <Link to="/eligibility" className={isActive('/eligibility')} onClick={() => setMenuOpen(false)}>Eligibility</Link>
              <Link to="/recommendations" className={isActive('/recommendations')} onClick={() => setMenuOpen(false)}>Recommendations</Link>
              <Link to="/profile" className={isActive('/profile')} onClick={() => setMenuOpen(false)}>Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={isActive('/admin')} onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
            </>
          )}

          {darkTheme && (
            <button className="theme-toggle-btn" onClick={handleThemeToggle}
              title={currentMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
              {currentMode === 'light' ? '🌙' : '☀️'}
            </button>
          )}

          {user ? (
            <div className="navbar-user">
              <span className="navbar-user-name">{user.name}</span>
              <button className="btn btn-outline btn-sm" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <span className="btn btn-primary btn-sm">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
