import { NavLink } from 'react-router-dom';

const LINKS = [
  { to:'/',          label:'Overview',  end:true },
  { to:'/configure', label:'Configure' },
  { to:'/take-back', label:'Take-back' },
  { to:'/learn',     label:'Learn' },
  { to:'/report',    label:'Company report' }
];

export function Arrow(){
  return <span className="o"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg></span>;
}

export function BigWord({ text, swapping }){
  const size = Math.max(6.2, Math.min(15, 108 / Math.max(text.length, 1)));
  return (
    <div className={'bigword' + (swapping ? ' swap' : '')} aria-hidden="true">
      <span style={{ '--word-size': `clamp(2rem, ${size.toFixed(2)}vw, 12rem)` }}>{text}</span>
    </div>
  );
}

export default function Shell({ tagline, meta, children }){
  return (
    <div className="shell">
      <header>
        <nav aria-label="Primary">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => isActive ? 'on' : undefined}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="brand">
          <div className="wordmark">TARA</div>
          <div className="tagline">{tagline}</div>
        </div>
        <div className="hmeta">
          {meta ? <><div className="k">{meta.k}</div><div className="v num">{meta.v}<small>{meta.u}</small></div></> : null}
        </div>
      </header>
      {children}
    </div>
  );
}
