import { createContext, useContext, useMemo, useState } from 'react';
import { DEMO_USER, MOCK_ORDERS } from './data.js';

const SESSION_KEY = 'tara.session';
const USERS_KEY   = 'tara.users';

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
        // Demo account: session only — do not rewrite the shared demo password record.
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

    orders(){
      if (!user) return [];
      return MOCK_ORDERS.map(o => ({ ...o, userId:user.id }));
    }
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
