/* Every form is drawn live in SVG, so colour is a variable and not a
   photograph. One 3/4 axonometric projection, 600 × 460, for all eight.

   Each drawing is made at its form's reference size. The configurator hands
   in a scale for the dimensions the buyer picked and the print that goes on
   the face, so one drawing covers the whole range of each format. */

const T = { fill:'var(--top)' }, F = { fill:'var(--front)' }, S = { fill:'var(--side)' };
const K = { stroke:'var(--line)', strokeOpacity:.28, strokeWidth:1.2, strokeLinejoin:'round' };

/* base — the ground line of the form, so resizing never lifts it into the air.
   face — the centre of the printable panel and how wide it runs.
   Every silhouette is composed around x = 300, so width scales about that. */
const GEO = {
  shipper:  { base:405, face:{ cx:255, cy:312, w:214 } },
  mailer:   { base:378, face:{ cx:265, cy:339, w:238 } },
  tray:     { base:355, face:{ cx:255, cy:298, w:152 } },
  clamshell:{ base:360, face:{ cx:257, cy:322, w:152 } },
  pot:      { base:394, face:{ cx:300, cy:298, w:150 } },
  pouch:    { base:390, face:{ cx:300, cy:270, w:156 } },
  hotbox:   { base:400, face:{ cx:260, cy:334, w:210 } },
  flowwrap: { base:376, face:{ cx:300, cy:282, w:150 } }
};

const SHAPES = {
  shipper: (
    <>
      <path d="M130,230 L225,172 L475,172 L380,230 Z" {...T} {...K} />
      <path d="M380,230 L475,172 L475,347 L380,405 Z" {...S} {...K} />
      <path d="M130,230 L380,230 L380,405 L130,405 Z" {...F} {...K} />
      <path d="M255,230 L350,172" stroke="var(--line)" strokeOpacity=".30" strokeWidth="1.4" fill="none" />
      <rect x="244" y="230" width="23" height="175" fill="var(--line)" opacity=".13" />
      <path d="M244,230 L339,172 L362,172 L267,230 Z" fill="var(--line)" opacity=".13" />
    </>
  ),
  mailer: (
    <>
      <path d="M208,246 L498,246 L470,140 L180,140 Z" {...T} {...K} opacity=".92" />
      <path d="M120,300 L208,246 L498,246 L410,300 Z" {...T} {...K} />
      <path d="M410,300 L498,246 L498,324 L410,378 Z" {...S} {...K} />
      <path d="M120,300 L410,300 L410,378 L120,378 Z" {...F} {...K} />
    </>
  ),
  tray: (
    <>
      <path d="M140,240 L240,196 L470,196 L370,240 Z" {...T} {...K} />
      <path d="M370,240 L470,196 L438,311 L338,355 Z" {...S} {...K} />
      <path d="M140,240 L370,240 L338,355 L172,355 Z" {...F} {...K} />
      <path d="M158,238 L250,197 L452,197 L360,238 Z" fill="var(--line)" opacity=".16" />
      <path d="M140,240 L240,196 L470,196 L370,240 Z" fill="#FFFFFF" opacity=".30" />
      <path d="M176,224 L268,199 L300,199 L208,224 Z" fill="#FFFFFF" opacity=".42" />
    </>
  ),
  clamshell: (
    <>
      <path d="M245,248 L460,248 L488,156 L273,156 Z" {...T} {...K} opacity=".55" />
      <path d="M273,156 L488,156 L488,176 L273,176 Z" {...S} {...K} opacity=".55" />
      <path d="M150,290 L245,248 L460,248 L365,290 Z" {...T} {...K} />
      <path d="M365,290 L460,248 L435,318 L340,360 Z" {...S} {...K} />
      <path d="M150,290 L365,290 L340,360 L175,360 Z" {...F} {...K} />
      <path d="M166,288 L252,250 L444,250 L358,288 Z" fill="var(--line)" opacity=".15" />
      <path d="M292,162 L392,162 L368,172 L268,172 Z" fill="#FFFFFF" opacity=".34" />
    </>
  ),
  pot: (
    <>
      <path d="M192,214 L222,368 A78,26 0 0 0 378,368 L408,214 Z" {...F} {...K} />
      <path d="M300,214 L408,214 L378,368 A78,26 0 0 1 300,394 Z" {...S} opacity=".55" />
      <ellipse cx="300" cy="214" rx="108" ry="36" {...T} {...K} />
      <ellipse cx="300" cy="212" rx="114" ry="38" {...T} {...K} />
      <ellipse cx="300" cy="212" rx="96" ry="30" fill="var(--line)" opacity=".13" />
      <path d="M214,206 A108,36 0 0 1 300,180" stroke="#FFFFFF" strokeOpacity=".45" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M226,246 L248,362" stroke="#FFFFFF" strokeOpacity=".22" strokeWidth="9" fill="none" strokeLinecap="round" />
    </>
  ),
  pouch: (
    <>
      <path d="M200,176 C186,232 184,302 196,356 L200,380 L400,380 L404,356 C416,302 414,232 400,176 Z" {...F} {...K} />
      <path d="M300,176 L400,176 C414,232 416,302 404,356 L400,380 L300,380 Z" {...S} opacity=".45" />
      <path d="M200,374 Q300,398 400,374 L400,390 Q300,414 200,390 Z" {...S} {...K} />
      <rect x="194" y="148" width="212" height="28" rx="3" {...T} {...K} />
      <rect x="194" y="154" width="212" height="4" fill="var(--line)" opacity=".22" />
      <path d="M330,148 L346,162 L330,176" fill="none" stroke="var(--line)" strokeOpacity=".34" strokeWidth="2" />
      <path d="M216,190 C206,244 205,304 214,350" stroke="#FFFFFF" strokeOpacity=".34" strokeWidth="11" fill="none" strokeLinecap="round" />
    </>
  ),
  hotbox: (
    <>
      <path d="M135,265 L230,207 L480,207 L385,265 Z" {...T} {...K} />
      <path d="M385,265 L480,207 L480,342 L385,400 Z" {...S} {...K} />
      <path d="M135,265 L385,265 L385,400 L135,400 Z" {...F} {...K} />
      <g stroke="var(--line)" strokeOpacity=".40" strokeWidth="7" strokeLinecap="round">
        <path d="M243,245 L343,245" /><path d="M262,233 L362,233" /><path d="M281,221 L381,221" />
      </g>
    </>
  ),
  flowwrap: (
    <>
      <path d="M180,230 C180,196 212,186 300,186 C388,186 420,196 420,230 L420,332 C420,366 388,376 300,376 C212,376 180,366 180,332 Z" {...F} {...K} />
      <path d="M300,186 C388,186 420,196 420,230 L420,332 C420,366 388,376 300,376 Z" {...S} opacity=".38" />
      <path d="M180,238 L142,214 L142,348 L180,324 Z" {...T} {...K} />
      <path d="M420,238 L458,214 L458,348 L420,324 Z" {...S} {...K} />
      <g stroke="var(--line)" strokeOpacity=".26" strokeWidth="1.6">
        <path d="M152,222 L152,340" /><path d="M164,228 L164,334" />
        <path d="M436,222 L436,340" /><path d="M448,228 L448,334" />
      </g>
      <path d="M208,214 C202,252 202,310 208,348" stroke="#FFFFFF" strokeOpacity=".32" strokeWidth="13" fill="none" strokeLinecap="round" />
    </>
  )
};

/* The three printed lines, biggest first. `lead` is the line box, not the
   glyph — it is what keeps the block centred on the panel. */
const LINES = [
  { key:'title',    size:21,   lead:25, weight:800, ls:.06, soft:false },
  { key:'subtitle', size:12.5, lead:17, weight:600, ls:.01, soft:false },
  { key:'note',     size:10,   lead:14, weight:600, ls:.09, soft:true  }
];

/* No text metrics in a bare SVG, so estimate the set width from the glyph
   count and pull the size back if a line would run off the panel. */
const widthOf = (str, size, ls) => str.length * size * (0.55 + ls);

export default function Product({ shape, swapping, sx = 1, sy = 1, art }){
  const key  = GEO[shape] ? shape : 'tray';
  const { base, face } = GEO[key];

  /* Map the panel through the same transform as the pack, by hand, so the
     print itself never comes out stretched along with the box. */
  const px = 300  + (face.cx - 300)  * sx;
  const py = base + (face.cy - base) * sy;
  const pw = face.w * sx;
  const k  = Math.min(1.18, Math.max(.8, Math.min(sx, sy)));

  const set = (art ? LINES : []).map(l => {
    const text = (art[l.key] || '').trim();
    if (!text) return null;
    const want = l.size * k;
    const fit  = Math.min(1, pw / widthOf(text, want, l.ls));
    return { ...l, text, size:want * Math.max(.62, fit), lead:l.lead * k };
  }).filter(Boolean);

  const block = set.reduce((h, l) => h + l.lead, 0);
  let cursor  = py - block / 2;

  return (
    <div className={'product' + (swapping ? ' swap' : '')}>
      <svg viewBox="0 0 600 460" role="img"
        aria-label={`${shape} shown in the chosen finish${set.length ? `, printed “${set[0].text}”` : ''}`}>
        <ellipse cx="300" cy="428" rx={172 * sx} ry="17" fill="var(--line)" opacity=".10" />

        <g transform={`translate(300 ${base}) scale(${sx} ${sy}) translate(-300 ${-base})`}>
          {SHAPES[key]}
        </g>

        {/* Printed panel and type ride on top of the pack, never inside the
            scale, so they stay legible at every size. */}
        {(art ? art.panel : true) && (
          <rect
            x={px - pw / 2 - 9} y={py - (block || 44 * k) / 2 - 9}
            width={pw + 18} height={(block || 44 * k) + 18} rx="3"
            fill="var(--print)" opacity={art ? .13 : .11}
            stroke="var(--print)" strokeOpacity={art ? .26 : 0} strokeWidth="1" />
        )}

        {set.map(l => {
          const y = cursor + l.lead / 2;
          cursor += l.lead;
          return (
            <text key={l.key} x={px} y={y}
              textAnchor="middle" dominantBaseline="central"
              fontSize={l.size} fontWeight={l.weight}
              letterSpacing={`${l.ls}em`}
              fill={l.soft ? 'var(--print-soft)' : 'var(--print)'}
              style={{ fontFamily:'var(--font)' }}>
              {l.text}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* Derive three tones from one hex so a swatch really recolours the pack, and
   pick the ink the print has to be set in to stay readable on top of it. */
export function applyTones(baseHex, accent){
  const shade = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16);
    const f = c => Math.max(0, Math.min(255, Math.round(c + (amt > 0 ? (255 - c) * amt : c * amt))));
    const r = f(n >> 16 & 255), g = f(n >> 8 & 255), b = f(n & 255);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  const n = parseInt(baseHex.slice(1), 16);
  const light = ((n >> 16 & 255) * .299 + (n >> 8 & 255) * .587 + (n & 255) * .114) / 255 > .56;

  const root = document.documentElement.style;
  root.setProperty('--top',    shade(baseHex,  .17));
  root.setProperty('--front',  baseHex);
  root.setProperty('--side',   shade(baseHex, -.20));
  root.setProperty('--line',   shade(baseHex, -.46));
  root.setProperty('--print',      light ? '#161817' : '#FBFAF7');
  root.setProperty('--print-soft', light ? 'rgba(22,24,23,.60)' : 'rgba(251,250,247,.64)');
  if (accent) root.setProperty('--accent', accent);
}
