import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { DEMO_USER, MOCK_ORDERS } from './data.js';

const SESSION_KEY = 'tara.session';
const USERS_KEY   = 'tara.users';
const ORDERS_KEY  = 'tara.orders';

const AuthContext = createContext(null);

function readJson(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

function allUsers(){
  const extra = readJson(USERS_KEY, []);
  return [DEMO_USER, ...extra.filter(u => u.email !== DEMO_USER.email)];
}

function toSession(u){
  return { id:u.id, email:u.email, name:u.name, company:u.company };
}

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => readJson(SESSION_KEY, null));
  const [extraOrders, setExtraOrders] = useState(() => readJson(ORDERS_KEY, []));

  const placeOrder = useCallback((packet) => {
    if (!user) return { ok:false, error:'Not signed in.' };

    // Log the chosen pack before the order is committed.
    console.log('Chosen packet:', packet);

    const order = {
      id:'ORD-' + String(2400 + extraOrders.length + MOCK_ORDERS.length + 1),
      userId:user.id,
      date:new Date().toISOString().slice(0, 10),
      status:'pending',
      material:packet.material,
      form:packet.form,
      finish:packet.finish,
      run:packet.run,
      quantity:packet.quantity ?? 1000,
      title:packet.title || 'Custom pack',
      subtitle:packet.subtitle || '',
      dims:packet.dims,
      weight:packet.weight,
      coverage:packet.coverage,
      volume:packet.volume
    };

    const next = [order, ...extraOrders];
    writeJson(ORDERS_KEY, next);
    setExtraOrders(next);
    return { ok:true, order };
  }, [user, extraOrders]);

  const value = useMemo(() => ({
    user,
    isAuthed: !!user,

    login(email, password){
      const found = allUsers().find(
        u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      if (!found) return { ok:false, error:'Email or password is wrong.' };
      const session = toSession(found);
      writeJson(SESSION_KEY, session);
      setUser(session);
      return { ok:true };
    },

    register({ name, company, email, password }){
      const clean = email.trim().toLowerCase();
      if (!name.trim() || !company.trim() || !clean || !password) {
        return { ok:false, error:'Fill in every field.' };
      }
      if (password.length < 6) {
        return { ok:false, error:'Password needs at least 6 characters.' };
      }
      if (allUsers().some(u => u.email.toLowerCase() === clean)) {
        return { ok:false, error:'That email is already registered.' };
      }
      const next = {
        id:'u' + Date.now(),
        email:clean,
        password,
        name:name.trim(),
        company:company.trim()
      };
      const extra = readJson(USERS_KEY, []);
      writeJson(USERS_KEY, [...extra, next]);
      const session = toSession(next);
      writeJson(SESSION_KEY, session);
      setUser(session);
      return { ok:true };
    },

    updateProfile({ name, company, email }){
      if (!user) return { ok:false, error:'Not signed in.' };
      const clean = email.trim().toLowerCase();
      if (!name.trim() || !company.trim() || !clean) {
        return { ok:false, error:'Fill in every field.' };
      }
      const taken = allUsers().some(
        u => u.id !== user.id && u.email.toLowerCase() === clean
      );
      if (taken) return { ok:false, error:'That email is already registered.' };

      const session = {
        ...user,
        name:name.trim(),
        company:company.trim(),
        email:clean
      };

      if (user.id === DEMO_USER.id) {
        writeJson(SESSION_KEY, session);
        setUser(session);
        return { ok:true };
      }

      const extra = readJson(USERS_KEY, []).map(u =>
        u.id === user.id
          ? { ...u, name:session.name, company:session.company, email:session.email }
          : u
      );
      writeJson(USERS_KEY, extra);
      writeJson(SESSION_KEY, session);
      setUser(session);
      return { ok:true };
    },

    logout(){
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
    },

    placeOrder,

    orders(){
      if (!user) return [];
      const mine = extraOrders.filter(o => o.userId === user.id);
      const demo = MOCK_ORDERS.map(o => ({ ...o, userId:user.id }));
      return [...mine, ...demo];
    }
  }), [user, extraOrders, placeOrder]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
