import { Link, Navigate } from 'react-router-dom';
import Shell, { Arrow } from '../components/Shell.jsx';
import { useAuth } from '../auth.jsx';

export default function Home(){
  const { isAuthed } = useAuth();
  if (isAuthed) return <Navigate to="/dashboard" replace />;

  return (
    <Shell tagline="Packaging, specified">
      <main className="page hero home-simple">
        <div className="home-hero">
          <div className="wordmark home-mark">TARA</div>
          <h1>Specify packaging. Track every order.</h1>
          <p className="lede">
            A B2B platform for Moldovan producers — configure packs once, follow
            production status, and keep packaging data ready for disclosure.
          </p>
          <div className="cta-row">
            <Link className="cta" to="/login">Sign in <Arrow /></Link>
            <Link className="back" to="/register">Register your company</Link>
          </div>
        </div>
      </main>
    </Shell>
  );
}
