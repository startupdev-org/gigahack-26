import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Shell, { Arrow } from '../components/Shell.jsx';
import { useAuth } from '../auth.jsx';

export default function Register(){
  const { register, isAuthed } = useAuth();
  const navigate = useNavigate();

  const [name, setName]         = useState('');
  const [company, setCompany]   = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (isAuthed) return <Navigate to="/dashboard" replace />;

  function onSubmit(e){
    e.preventDefault();
    const result = register({ name, company, email, password });
    if (!result.ok) { setError(result.error); return; }
    navigate('/dashboard', { replace:true });
  }

  return (
    <Shell tagline="Register">
      <main className="page auth-page">
        <div>
          <div className="eyebrow">Account</div>
          <h1 style={{ marginTop:10 }}>Open a buyer account for your company.</h1>
        </div>
        <p className="lede">
          Registration is mocked and stored in this browser only. Nothing is sent to a server.
        </p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-field">
            <span className="label">Your name</span>
            <input type="text" autoComplete="name" value={name}
              onChange={e => setName(e.target.value)} required />
          </label>
          <label className="auth-field">
            <span className="label">Company</span>
            <input type="text" autoComplete="organization" value={company}
              onChange={e => setCompany(e.target.value)} required />
          </label>
          <label className="auth-field">
            <span className="label">Work email</span>
            <input type="email" autoComplete="email" value={email}
              onChange={e => setEmail(e.target.value)} required />
          </label>
          <label className="auth-field">
            <span className="label">Password</span>
            <input type="password" autoComplete="new-password" value={password}
              onChange={e => setPassword(e.target.value)} required minLength={6} />
          </label>

          {error ? <p className="auth-error" role="alert">{error}</p> : null}

          <div className="cta-row">
            <button type="submit" className="cta">
              Create account <Arrow />
            </button>
            <Link className="back" to="/login">Already registered</Link>
          </div>
        </form>
      </main>
    </Shell>
  );
}
