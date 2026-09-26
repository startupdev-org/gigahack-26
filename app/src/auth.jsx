import {
  createContext, useContext, useMemo, useState, useCallback, useEffect
} from 'react';
import { supabase, supabaseConfigured } from './lib/supabase.js';

const AuthContext = createContext(null);

function mapProfile(sessionUser, profile){
  return {
    id: sessionUser.id,
    email: profile?.email || sessionUser.email || '',
    name: profile?.name || sessionUser.user_metadata?.name || '',
    company: profile?.company || sessionUser.user_metadata?.company || '',
    notifyOrders: profile?.notify_orders ?? true
  };
}

function mapOrder(row){
  return {
    id: row.order_code,
    dbId: row.id,
    userId: row.user_id,
    date: row.ordered_on,
    status: row.status,
    material: row.material,
    form: row.form,
    finish: row.finish,
    run: row.run,
    quantity: row.quantity,
    title: row.title,
    subtitle: row.subtitle,
    dims: row.dims || { L:0, W:0, H:0 },
    weight: row.weight,
    coverage: row.coverage,
    volume: row.volume
  };
}

function authError(err){
  const msg = err?.message || 'Something went wrong.';
  if (/invalid login/i.test(msg)) return 'Email or password is wrong.';
  if (/already registered/i.test(msg)) return 'That email is already registered.';
  if (/email not confirmed/i.test(msg)) {
    return 'Confirm your email first (check inbox), or disable email confirmations in Supabase Auth settings.';
  }
  return msg;
}

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (sessionUser) => {
    if (!supabase || !sessionUser) {
      setUser(null);
      return null;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionUser.id)
      .maybeSingle();

    if (error) console.error('Profile load:', error);
    const next = mapProfile(sessionUser, data);
    setUser(next);
    return next;
  }, []);

  const refreshOrders = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setOrders([]);
      return [];
    }
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending:false });

    if (error) {
      console.error('Orders load:', error);
      setOrders([]);
      return [];
    }
    const mapped = (data || []).map(mapOrder);
    setOrders(mapped);
    return mapped;
  }, []);

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let alive = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!alive) return;
      const sessionUser = data.session?.user ?? null;
      if (sessionUser) {
        await loadProfile(sessionUser);
        await refreshOrders(sessionUser.id);
      } else {
        setUser(null);
        setOrders([]);
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null;
      if (sessionUser) {
        await loadProfile(sessionUser);
        await refreshOrders(sessionUser.id);
      } else {
        setUser(null);
        setOrders([]);
      }
      setLoading(false);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile, refreshOrders]);

  const login = useCallback(async (email, password) => {
    if (!supabase) {
      return { ok:false, error:'Supabase is not configured. Add keys to app/.env' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });
    if (error) return { ok:false, error:authError(error) };
    await loadProfile(data.user);
    await refreshOrders(data.user.id);
    return { ok:true };
  }, [loadProfile, refreshOrders]);

  const register = useCallback(async ({ name, company, email, password }) => {
    if (!supabase) {
      return { ok:false, error:'Supabase is not configured. Add keys to app/.env' };
    }
    const clean = email.trim().toLowerCase();
    if (!name.trim() || !company.trim() || !clean || !password) {
      return { ok:false, error:'Fill in every field.' };
    }
    if (password.length < 6) {
      return { ok:false, error:'Password needs at least 6 characters.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email: clean,
      password,
      options: {
        data: { name: name.trim(), company: company.trim() }
      }
    });
    if (error) return { ok:false, error:authError(error) };

    // If email confirmation is required, session may be null.
    if (!data.session) {
      return {
        ok:false,
        error:'Account created. Confirm your email, then sign in. (Or turn off email confirmation in Supabase → Authentication → Providers → Email.)'
      };
    }

    // Ensure profile row exists even if trigger is slow
    await supabase.from('profiles').upsert({
      id: data.user.id,
      name: name.trim(),
      company: company.trim(),
      email: clean
    });

    await loadProfile(data.user);
    await refreshOrders(data.user.id);
    return { ok:true };
  }, [loadProfile, refreshOrders]);

  const updateProfile = useCallback(async ({ name, company, email, notifyOrders }) => {
    if (!supabase || !user) return { ok:false, error:'Not signed in.' };
    const clean = email.trim().toLowerCase();
    if (!name.trim() || !company.trim() || !clean) {
      return { ok:false, error:'Fill in every field.' };
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        name: name.trim(),
        company: company.trim(),
        email: clean,
        notify_orders: notifyOrders ?? user.notifyOrders,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) return { ok:false, error:authError(error) };

    if (clean !== user.email) {
      const { error: emailErr } = await supabase.auth.updateUser({ email: clean });
      if (emailErr) return { ok:false, error:authError(emailErr) };
    }

    setUser(u => ({
      ...u,
      name: name.trim(),
      company: company.trim(),
      email: clean,
      notifyOrders: notifyOrders ?? u.notifyOrders
    }));
    return { ok:true };
  }, [user]);

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setOrders([]);
  }, []);

  const placeOrder = useCallback(async (packet) => {
    if (!supabase || !user) return { ok:false, error:'Not signed in.' };

    console.log('Chosen packet:', packet);

    const orderCode = 'ORD-' + Date.now().toString().slice(-6);

    const row = {
      user_id: user.id,
      order_code: orderCode,
      ordered_on: new Date().toISOString().slice(0, 10),
      status: 'pending',
      material: packet.material,
      form: packet.form,
      finish: packet.finish,
      run: packet.run,
      quantity: packet.quantity ?? 1000,
      title: packet.title || 'Custom pack',
      subtitle: packet.subtitle || '',
      dims: packet.dims,
      weight: packet.weight != null ? String(packet.weight) : null,
      coverage: packet.coverage ?? null,
      volume: packet.volume ?? null
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(row)
      .select('*')
      .single();

    if (error) {
      console.error('Order failed:', error);
      return { ok:false, error:authError(error) };
    }

    const mapped = mapOrder(data);
    setOrders(prev => [mapped, ...prev]);
    return { ok:true, order: mapped };
  }, [user]);

  const value = useMemo(() => ({
    user,
    orders,
    loading,
    isAuthed: !!user,
    supabaseConfigured,
    login,
    register,
    updateProfile,
    logout,
    placeOrder,
    refreshOrders: () => user ? refreshOrders(user.id) : Promise.resolve([])
  }), [
    user, orders, loading,
    login, register, updateProfile, logout, placeOrder, refreshOrders
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
