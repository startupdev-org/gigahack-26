import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Configure from './pages/Configure.jsx';
import TakeBack from './pages/TakeBack.jsx';
import Learn from './pages/Learn.jsx';
import Report from './pages/Report.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import {
  DashLayout, Overview, Orders, Info, Settings
} from './pages/Dashboard.jsx';
import Protected from './components/Protected.jsx';

export default function App(){
  return (
    <Routes>
      <Route path="/"          element={<Home />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/register"  element={<Register />} />
      <Route path="/take-back" element={<TakeBack />} />
      <Route path="/learn"     element={<Learn />} />
      <Route path="/report"    element={<Report />} />
      <Route path="/configure" element={<Protected><Configure /></Protected>} />
      <Route path="/dashboard" element={<Protected><DashLayout /></Protected>}>
        <Route index element={<Overview />} />
        <Route path="orders"   element={<Orders />} />
        <Route path="info"     element={<Info />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
