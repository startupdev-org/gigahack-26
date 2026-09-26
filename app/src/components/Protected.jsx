import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Protected({ children }){
  const { isAuthed, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="purity" style={{ placeItems:'center', minHeight:'100dvh', display:'grid' }}>
        <p style={{ color:'#718096', fontWeight:600 }}>Loading…</p>
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
