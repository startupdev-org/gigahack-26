import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, MailCheck } from 'lucide-react';
import { useAuth } from '../auth.jsx';

export default function Register(){
  const { register, isAuthed, loading, supabaseConfigured } = useAuth();
  const navigate = useNavigate();

  const [name, setName]         = useState('');
  const [company, setCompany]   = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');

  if (!loading && isAuthed) return <Navigate to="/dashboard" replace />;

  async function onSubmit(e){
    e.preventDefault();
    setBusy(true);
    setError('');
    const result = await register({ name, company, email, password });
    setBusy(false);
    if (!result.ok) { setError(result.error); return; }
    if (result.requiresEmailConfirmation) {
      setConfirmationEmail(email.trim());
      return;
    }
    navigate('/dashboard', { replace:true });
  }

  return (
    <main className="login-screen">
      <section className="login-card register-card" aria-labelledby="register-title">
        <Link to="/" className="purity-logo login-brand" aria-label="TARA home">
          <span className="purity-logo-mark">T</span>
          <span>TARA</span>
        </Link>

        {confirmationEmail ? (
          <div className="register-confirmation" role="status">
            <span className="register-confirmation-icon"><MailCheck size={27} aria-hidden="true" /></span>
            <h1 id="register-title">Check your inbox</h1>
            <p>If an account can be created for <strong>{confirmationEmail}</strong>, you’ll receive a confirmation link. Open it, then sign in.</p>
            <Link className="login-submit register-signin" to="/login">
              <span>Go to sign in</span><ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <>
            <div className="login-intro register-intro">
              <span className="login-kicker">Buyer workspace</span>
              <h1 id="register-title">Create your account</h1>
              <p>Set up your company workspace to specify packs and track orders.</p>
            </div>

            {!supabaseConfigured ? (
              <p className="login-error" role="alert">
                Supabase is not configured. Copy <code>.env.example</code> to <code>.env</code>,
                add your project URL and anon key, then restart the dev server.
              </p>
            ) : null}

            <form className="login-form" onSubmit={onSubmit}>
              <label className="login-field">
                <span>Your name</span>
                <input type="text" autoComplete="name" placeholder="Your full name" value={name}
                  onChange={e => setName(e.target.value)} required />
              </label>
              <label className="login-field">
                <span>Company</span>
                <input type="text" autoComplete="organization" placeholder="Company name" value={company}
                  onChange={e => setCompany(e.target.value)} required />
              </label>
              <label className="login-field">
                <span>Work email</span>
                <input type="email" autoComplete="email" placeholder="you@company.com" value={email}
                  onChange={e => setEmail(e.target.value)} required />
              </label>
              <label className="login-field">
                <span>Password</span>
                <input type="password" autoComplete="new-password" placeholder="At least 6 characters" value={password}
                  onChange={e => setPassword(e.target.value)} required minLength={6} />
              </label>

              {error ? <p className="login-error" role="alert">{error}</p> : null}

              <button type="submit" className="login-submit" disabled={busy || !supabaseConfigured}>
                <span>{busy ? 'Creating account…' : 'Create account'}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>

            <p className="login-register">Already have an account? <Link to="/login">Sign in</Link></p>
          </>
        )}
      </section>
    </main>
  );
}
