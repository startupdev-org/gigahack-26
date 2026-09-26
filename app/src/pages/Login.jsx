import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Shell, { Arrow } from '../components/Shell.jsx';
import { useAuth } from '../auth.jsx';

export default function Login(){
  const { login, isAuthed, loading, supabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);

  if (!loading && isAuthed) return <Navigate to={from} replace />;

  async function onSubmit(e){
    e.preventDefault();
    setBusy(true);
    setError('');
    const result = await login(email, password);
    setBusy(false);
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
          Accounts are stored in Supabase Auth.
        </p>

        {!supabaseConfigured ? (
          <p className="auth-error" role="alert">
            Supabase is not configured. Copy <code>.env.example</code> to <code>.env</code> and
            add your project URL and anon key, then restart the dev server.
          </p>
        ) : null}

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
            <button type="submit" className="cta" disabled={busy || !supabaseConfigured}>
              {busy ? 'Signing in…' : 'Sign in'} <Arrow />
            </button>
            <Link className="back" to="/register">Create an account</Link>
          </div>
        </form>
      </main>
    </Shell>
  );
}
