import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { DashShell, Arrow } from '../components/Shell.jsx';
import { useAuth } from '../auth.jsx';
import {
  MATERIALS, FORMS, FINISHES, RUNS, ORDER_STATUSES, COMPANY, TIPS
} from '../data.js';

function lookup(list, id){
  return list.find(x => x.id === id);
}

function formatDate(iso){
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', {
    day:'numeric', month:'short', year:'numeric'
  });
}

export function DashLayout(){
  return (
    <DashShell>
      <Outlet />
    </DashShell>
  );
}

export function Overview(){
  const { user, orders } = useAuth();
  const list = orders();
  const shipped = list.filter(o => o.status === 'shipped').length;
  const open    = list.filter(o => o.status !== 'shipped').length;
  const units   = list.reduce((n, o) => n + o.quantity, 0);
  const recent  = [...list].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const byMaterial = MATERIALS.map(m => ({
    name: m.short,
    accent: m.accent,
    count: list.filter(o => o.material === m.id).length,
    units: list.filter(o => o.material === m.id).reduce((n, o) => n + o.quantity, 0)
  })).filter(m => m.count > 0);

  const gradeA = list.filter(o => lookup(MATERIALS, o.material)?.grade === 'A').length;
  const gradeShare = list.length ? Math.round((gradeA / list.length) * 100) : 0;

  return (
    <div className="p-panel">
      <div className="p-stats">
        <MiniStat
          label="Total orders" value={String(list.length)}
          delta="+2 this month" icon="orders" tone="teal" />
        <MiniStat
          label="Units ordered" value={units.toLocaleString('en-GB')}
          delta="Across all SKUs" icon="units" tone="blue" />
        <MiniStat
          label="Open orders" value={String(open)}
          delta="Pending / in production" icon="open" tone="orange" />
        <MiniStat
          label="Shipped" value={String(shipped)}
          delta={`${gradeShare}% grade A packs`} icon="ship" tone="green" />
      </div>

      <div className="p-row">
        <section className="p-card p-card-wide">
          <div className="p-card-head">
            <div>
              <h2>Orders overview</h2>
              <p>Welcome back, {user.name.split(' ')[0]}. Here is what is moving for {user.company}.</p>
            </div>
            <Link className="p-btn" to="/builder">New pack <Arrow /></Link>
          </div>

          <div className="p-table-wrap">
            <table className="p-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Product</th>
                  <th>Material</th>
                  <th>Qty</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(o => {
                  const material = lookup(MATERIALS, o.material);
                  const form = FORMS[o.form];
                  const status = ORDER_STATUSES[o.status];
                  return (
                    <tr key={o.id}>
                      <td><b>{o.id}</b></td>
                      <td>
                        <div className="p-cell-stack">
                          <b>{o.title}</b>
                          <span>{form?.name}</span>
                        </div>
                      </td>
                      <td>{material?.short}</td>
                      <td className="num">{o.quantity.toLocaleString('en-GB')}</td>
                      <td>{formatDate(o.date)}</td>
                      <td>
                        <span className="p-badge" style={{ '--badge': status.tone }}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-card-foot">
            <Link to="/dashboard/orders">See all orders →</Link>
          </div>
        </section>

        <section className="p-card">
          <div className="p-card-head">
            <div>
              <h2>By material</h2>
              <p>Units ordered this period</p>
            </div>
          </div>
          <ul className="p-mat">
            {byMaterial.map(m => (
              <li key={m.name}>
                <div className="p-mat-row">
                  <span><i style={{ background:m.accent }} />{m.name}</span>
                  <b className="num">{m.units.toLocaleString('en-GB')}</b>
                </div>
                <div className="p-bar">
                  <i style={{
                    width:`${Math.max(10, (m.units / units) * 100)}%`,
                    background:m.accent
                  }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="p-row">
        <section className="p-card">
          <div className="p-card-head">
            <div>
              <h2>Period highlights</h2>
              <p>{COMPANY.period} · mock disclosure</p>
            </div>
          </div>
          <div className="p-deltas">
            {COMPANY.deltas.slice(0, 4).map(d => (
              <div className="p-delta" key={d.k}>
                <b>{d.v}</b>
                <span>{d.k}</span>
                <em>{d.s}</em>
              </div>
            ))}
          </div>
        </section>

        <section className="p-card p-welcome">
          <div>
            <div className="eyebrow">Quick start</div>
            <h2>Specify your next pack in minutes.</h2>
            <p>
              Material, form, finish and run — illegal combinations are refused
              before they reach audit.
            </p>
            <Link className="p-btn" to="/builder">Open product builder <Arrow /></Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function MiniStat({ label, value, delta, tone }){
  return (
    <div className="p-mini">
      <div>
        <div className="p-mini-label">{label}</div>
        <div className="p-mini-value num">{value}</div>
        <div className="p-mini-delta">{delta}</div>
      </div>
      <span className={'p-mini-ico tone-' + tone} aria-hidden="true" />
    </div>
  );
}

export function Orders(){
  const { orders } = useAuth();
  const list = [...orders()].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="p-panel">
      <section className="p-card">
        <div className="p-card-head">
          <div>
            <h2>All orders</h2>
            <p>Every pack specified on this account</p>
          </div>
            <Link className="p-btn" to="/builder">New specification <Arrow /></Link>
        </div>

        <div className="p-table-wrap">
          <table className="p-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Material</th>
                <th>Form</th>
                <th>Finish</th>
                <th>Qty</th>
                <th>Run</th>
                <th>Size</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map(order => {
                const material = lookup(MATERIALS, order.material);
                const form     = FORMS[order.form];
                const finish   = lookup(FINISHES, order.finish);
                const run      = lookup(RUNS, order.run);
                const status   = ORDER_STATUSES[order.status];
                return (
                  <tr key={order.id}>
                    <td>
                      <div className="p-cell-stack">
                        <b>{order.id}</b>
                        <span>{formatDate(order.date)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="p-cell-stack">
                        <b>{order.title}</b>
                        <span>{order.subtitle}</span>
                      </div>
                    </td>
                    <td>{material?.name}</td>
                    <td>{form?.name}</td>
                    <td>
                      <span className="p-finish">
                        <i style={{ background:finish?.hex }} />
                        {finish?.name}
                      </span>
                    </td>
                    <td className="num">{order.quantity.toLocaleString('en-GB')}</td>
                    <td>{run?.name}</td>
                    <td className="num">{order.dims.L}×{order.dims.W}×{order.dims.H}</td>
                    <td>
                      <span className="p-badge" style={{ '--badge': status.tone }}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="p-fine">Mock orders only. Live fulfilment is not connected yet.</p>
      </section>
    </div>
  );
}

export function Info(){
  return (
    <div className="p-panel">
      <div className="p-row">
        <section className="p-card p-card-wide">
          <div className="p-card-head">
            <div>
              <h2>Recovery streams · {COMPANY.period}</h2>
              <p>{COMPANY.verified}</p>
            </div>
          </div>
          {COMPANY.streams.map(s => {
            const pct = Math.min(100, (s.achieved / Math.max(s.target, 1)) * 100);
            return (
              <div className="p-stream" key={s.material}>
                <div className="p-stream-row">
                  <b>{s.material}</b>
                  <span>{s.achieved} t · target {s.target}%</span>
                </div>
                <div className="p-bar">
                  <i style={{ width:`${pct}%` }} />
                </div>
                <div className="p-stream-foot">Declared {s.declared} t placed on market</div>
              </div>
            );
          })}
        </section>

        <section className="p-card">
          <div className="p-card-head">
            <div>
              <h2>Period deltas</h2>
              <p>Against the prior year</p>
            </div>
          </div>
          <div className="p-deltas">
            {COMPANY.deltas.map(d => (
              <div className="p-delta" key={d.k}>
                <b>{d.v}</b>
                <span>{d.k}</span>
                <em>{d.s}</em>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="p-card">
        <div className="p-card-head">
          <div>
            <h2>Worth knowing</h2>
            <p>Short reminders from the learn guide</p>
          </div>
        </div>
        <div className="p-tips">
          {TIPS.slice(0, 3).map(t => (
            <div className="p-tip" key={t.q}>
              <span className="p-tip-tag">{t.tag}</span>
              <b>{t.q}</b>
              <p>{t.a}</p>
            </div>
          ))}
        </div>
        <div className="p-tools">
          <Link to="/take-back">Take-back tool →</Link>
          <Link to="/learn">Learn guide →</Link>
          <Link to="/report">Full report →</Link>
        </div>
      </section>
    </div>
  );
}

export function Settings(){
  const { user, updateProfile } = useAuth();
  const [name, setName]         = useState(user.name);
  const [company, setCompany]   = useState(user.company);
  const [email, setEmail]       = useState(user.email);
  const [notify, setNotify]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('tara.notify') || 'true'); }
    catch { return true; }
  });
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');

  function onSave(e){
    e.preventDefault();
    const result = updateProfile({ name, company, email });
    if (!result.ok) { setError(result.error); setSaved(false); return; }
    localStorage.setItem('tara.notify', JSON.stringify(notify));
    setError('');
    setSaved(true);
  }

  return (
    <div className="p-panel">
      <div className="p-row">
        <section className="p-card p-profile">
          <div className="p-profile-banner" />
          <div className="p-profile-body">
            <span className="purity-avatar lg" aria-hidden="true">
              {user.name.split(' ').map(p => p[0]).slice(0, 2).join('')}
            </span>
            <div>
              <h2>{user.name}</h2>
              <p>{user.company}</p>
              <span>{user.email}</span>
            </div>
          </div>
        </section>

        <section className="p-card p-card-wide">
          <div className="p-card-head">
            <div>
              <h2>Account settings</h2>
              <p>Stored in this browser only — no backend yet</p>
            </div>
          </div>

          <form className="p-form" onSubmit={onSave}>
            <label className="p-field">
              <span>Full name</span>
              <input type="text" value={name}
                onChange={e => { setName(e.target.value); setSaved(false); }} required />
            </label>
            <label className="p-field">
              <span>Company</span>
              <input type="text" value={company}
                onChange={e => { setCompany(e.target.value); setSaved(false); }} required />
            </label>
            <label className="p-field">
              <span>Work email</span>
              <input type="email" value={email}
                onChange={e => { setEmail(e.target.value); setSaved(false); }} required />
            </label>

            <label className="p-check">
              <input type="checkbox" checked={notify}
                onChange={e => { setNotify(e.target.checked); setSaved(false); }} />
              <span>Email me when an order moves to production or ships</span>
            </label>

            {error ? <p className="auth-error" role="alert">{error}</p> : null}
            {saved ? <p className="auth-ok" role="status">Saved.</p> : null}

            <button type="submit" className="p-btn">Save changes <Arrow /></button>
          </form>
        </section>
      </div>
    </div>
  );
}
