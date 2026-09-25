import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Configure from './pages/Configure.jsx';
import TakeBack from './pages/TakeBack.jsx';
import Learn from './pages/Learn.jsx';
import Report from './pages/Report.jsx';

export default function App(){
  return (
    <Routes>
      <Route path="/"          element={<Home />} />
      <Route path="/configure" element={<Configure />} />
      <Route path="/take-back" element={<TakeBack />} />
      <Route path="/learn"     element={<Learn />} />
      <Route path="/report"    element={<Report />} />
      <Route path="*"          element={<Home />} />
    </Routes>
  );
}
