import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Shell, { Arrow } from '../components/Shell.jsx';
import { useAuth } from '../auth.jsx';

export default function Login(){
  const { login, isAuthed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [email, setEmail]       = useState('demo@tara.md');
  const [password, setPassword] = useState('demo123');
  const [error, setError]       = useState('');

  if (isAuthed) return <Navigate to={from} replace />;

  function onSubmit(e){
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) { setError(result.error); return; }
    navigate(from, { replace:true });
  }

  return (
    <Shell tagline="Sign in">
      <main className="page auth-page">
        <div>
          <div className="eyebrow">Account</div>
          <h1 style={{ marginTop:10 }}>Sign in to specify packs and track orders.</h1>
        </div>
        <p className="lede">
          B2B buyers configure packaging here and see every order that followed.
          Use the demo account, or register a company of your own — both are mock data only.
        </p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-field">
            <span className="label">Email</span>
            <input type="email" autoComplete="email" value={email}
              onChange={e => setEmail(e.target.value)} required />
          </label>
          <label className="auth-field">
            <span className="label">Password</span>
            <input type="password" autoComplete="current-password" value={password}
              onChange={e => setPassword(e.target.value)} required />
          </label>

          {error ? <p className="auth-error" role="alert">{error}</p> : null}

          <div className="cta-row">
            <button type="submit" className="cta">
              Sign in <Arrow />
            </button>
            <Link className="back" to="/register">Create an account</Link>
          </div>

          <p className="fine">
            Demo: <code>demo@tara.md</code> / <code>demo123</code>
          </p>
        </form>
      </main>
    </Shell>
  );
}
