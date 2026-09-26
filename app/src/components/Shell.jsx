import { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { Settings, PackagePlus } from 'lucide-react';

export function Arrow() {
  return <span className="o"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>;
}

export function BigWord({ text, swapping }) {
  const size = Math.max(6.2, Math.min(15, 108 / Math.max(text.length, 1)));
  return (
    <div className={'bigword' + (swapping ? ' swap' : '')} aria-hidden="true">
      <span style={{ '--word-size': `clamp(2rem, ${size.toFixed(2)}vw, 12rem)` }}>{text}</span>
    </div>
  );
}

/** Public / tool shell — home + auth (or back to dashboard when signed in). */
export default function Shell({ tagline, meta, children }) {
  const { isAuthed } = useAuth();

  return (
    <div className="shell">
      <header>
        <nav aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'on' : undefined}>
            Home
          </NavLink>
          {isAuthed ? (
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'on' : undefined}>
              Dashboard
            </NavLink>
          ) : null}
        </nav>
        <div className="brand">
          <div className="wordmark">TARA</div>
          <div className="tagline">{tagline}</div>
        </div>
        <div className="hmeta">
          {meta ? (
            <>
              <div className="k">{meta.k}</div>
              <div className="v num">{meta.v}<small>{meta.u}</small></div>
            </>
          ) : (
            <div className="account">
              <div className="k">Buyer account</div>
              <div className="account-actions">
                {isAuthed ? (
                  <Link to="/dashboard">Open dashboard</Link>
                ) : (
                  <>
                    <Link to="/login">Sign in</Link>
                    <Link to="/register">Register</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}

const NAV = [
  { to: '/dashboard', label: 'Overview', end: true, icon: 'home' },
  { to: '/dashboard/orders', label: 'Orders', icon: 'box' },
  { to: '/builder', label: 'Product builder', icon: 'package' },
  { to: '/dashboard/info', label: 'Information', icon: 'info' },
  { to: '/dashboard/settings', label: 'Settings', icon: 'settings' }
];

const TITLES = {
  '/dashboard': 'Overview',
  '/dashboard/orders': 'Orders',
  '/dashboard/info': 'Information',
  '/dashboard/settings': 'Settings',
  '/builder': 'Product builder'
};

function Icon({ name }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':
      return <svg {...common}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" /></svg>;
    case 'box':
      return <svg {...common}><path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5z" /><path d="M3 8.5 12 14l9-5.5M12 14v7" /></svg>;
    case 'package':
      return <PackagePlus />
    // return <svg {...common}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4" /></svg>;
    case 'info':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>;
    case 'settings':
      return <Settings />;
    default:
      return null;
  }
}

/** Purity-style admin shell: sidebar + top bar + content. */
export function DashShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const page = TITLES[location.pathname] || 'Dashboard';

  async function onLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="purity">
      <aside className={'purity-sidebar' + (open ? ' open' : '')} aria-label="Dashboard">
        <div className="purity-brand">
          <Link to="/dashboard" className="purity-logo" onClick={() => setOpen(false)}>
            <span className="purity-logo-mark">T</span>
            <span>TARA</span>
          </Link>
        </div>

        <div className="purity-sep" />

        <nav className="purity-nav">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'purity-link' + (isActive ? ' on' : '')}
              onClick={() => setOpen(false)}
            >
              <span className="purity-ico"><Icon name={item.icon} /></span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="purity-help">
          <b>Need a new pack?</b>
          <p>Open the product builder to specify material, form and other details.</p>
          <Link to="/builder" className="purity-help-btn" onClick={() => setOpen(false)}>
            Build a new pack
          </Link>
        </div>
      </aside>

      {open ? <button type="button" className="purity-scrim" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}

      <div className="purity-main">
        <header className="purity-top">
          <div className="purity-crumb">
            <button type="button" className="purity-menu-btn" aria-label="Open menu" onClick={() => setOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
            <div>
              <div className="purity-path">Pages / {page}</div>
              <h1>{page}</h1>
            </div>
          </div>

          <div className="purity-top-actions">
            <div className="purity-user">
              <span className="purity-avatar" aria-hidden="true">
                {user.name.split(' ').map(p => p[0]).slice(0, 2).join('')}
              </span>
              <div>
                <b>{user.name}</b>
                <span>{user.company}</span>
              </div>
            </div>
            <button type="button" className="purity-ghost" onClick={onLogout}>Sign out</button>
          </div>
        </header>

        <div className="purity-content">
          {children}
        </div>
      </div>
    </div>
  );
}
