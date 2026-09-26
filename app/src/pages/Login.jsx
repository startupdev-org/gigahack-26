import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
    <main className="login-screen">
      <section className="login-card" aria-labelledby="login-title">
        <Link to="/" className="purity-logo login-brand" aria-label="TARA home">
          <span className="purity-logo-mark">T</span>
          <span>TARA</span>
        </Link>

        <div className="login-intro">
          <span className="login-kicker">Buyer workspace</span>
          <h1 id="login-title">Welcome back</h1>
          <p>Sign in to manage your packaging and keep every order in view.</p>
        </div>

        {!supabaseConfigured ? (
          <p className="login-error" role="alert">
            Supabase is not configured. Copy <code>.env.example</code> to <code>.env</code>,
            add your project URL and anon key, then restart the dev server.
          </p>
        ) : null}

        <form className="login-form" onSubmit={onSubmit}>
          <label className="login-field">
            <span>Email address</span>
            <input type="email" autoComplete="email" placeholder="you@company.com" value={email}
              onChange={e => setEmail(e.target.value)} required />
          </label>
          <label className="login-field">
            <span>Password</span>
            <input type="password" autoComplete="current-password" placeholder="Enter your password" value={password}
              onChange={e => setPassword(e.target.value)} required />
          </label>

          {error ? <p className="login-error" role="alert">{error}</p> : null}

          <button type="submit" className="login-submit" disabled={busy || !supabaseConfigured}>
            <span>{busy ? 'Signing in…' : 'Sign in'}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>

        <p className="login-register">New to TARA? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  );
}
