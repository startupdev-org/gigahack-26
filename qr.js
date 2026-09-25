/* ═══════════════════════════════════════════════════════════════════════
   Minimal QR encoder — byte mode, error-correction level M, versions 1–10.
   Self-contained and offline: a hackathon demo must not depend on a CDN.
   Produces a real, scannable symbol, not a decorative pattern.
   ═══════════════════════════════════════════════════════════════════════*/
const QR = (() => {
  "use strict";

  /* ── GF(256), primitive polynomial 0x11D ───────────────────────────*/
  const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (() => {
    let x = 1;
    for (let i = 0; i < 255; i++){ EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11D; }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();
  const mul = (a, b) => (a && b) ? EXP[LOG[a] + LOG[b]] : 0;

  function genPoly(n){
    let p = [1];
    for (let i = 0; i < n; i++){
      const q = new Array(p.length + 1).fill(0);
      for (let j = 0; j < p.length; j++){ q[j] ^= p[j]; q[j + 1] ^= mul(p[j], EXP[i]); }
      p = q;
    }
    return p;
  }

  function ecc(data, n){
    const g = genPoly(n), r = new Array(n).fill(0);
    for (const d of data){
      const f = d ^ r[0];
      r.shift(); r.push(0);
      for (let i = 0; i < n; i++) r[i] ^= mul(g[i + 1], f);
    }
    return r;
  }

  /* ── Version table, EC level M ──────────────────────────────────────
     [ data codewords, ec codewords per block, g1 blocks, g1 data, g2 blocks, g2 data ] */
  const V = {
     1:[ 16,10,1, 16,0, 0],  2:[ 28,16,1, 28,0, 0],  3:[ 44,26,1, 44,0, 0],
     4:[ 64,18,2, 32,0, 0],  5:[ 86,24,2, 43,0, 0],  6:[108,16,4, 27,0, 0],
     7:[124,18,4, 31,0, 0],  8:[154,22,2, 38,2,39],  9:[182,22,3, 36,2,37],
    10:[216,26,4, 43,1,44]
  };
  const ALIGN = {
    1:[], 2:[6,18], 3:[6,22], 4:[6,26], 5:[6,30],
    6:[6,34], 7:[6,22,38], 8:[6,24,42], 9:[6,26,46], 10:[6,28,50]
  };

  const fmtBits = (ecLevel, mask) => {
    const d = (ecLevel << 3) | mask;
    let r = d << 10;
    for (let i = 14; i >= 10; i--) if ((r >> i) & 1) r ^= 0x537 << (i - 10);
    return ((d << 10) | r) ^ 0x5412;
  };
  const verBits = v => {
    let r = v << 12;
    for (let i = 17; i >= 12; i--) if ((r >> i) & 1) r ^= 0x1F25 << (i - 12);
    return (v << 12) | r;
  };

  /* ── Bit stream ────────────────────────────────────────────────────*/
  function encodeData(bytes, version){
    const [dataCw] = V[version];
    const bits = [];
    const push = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); };

    push(0b0100, 4);                                   // byte mode
    push(bytes.length, version <= 9 ? 8 : 16);         // character count
    for (const b of bytes) push(b, 8);

    const cap = dataCw * 8;
    for (let i = 0; i < 4 && bits.length < cap; i++) bits.push(0);   // terminator
    while (bits.length % 8) bits.push(0);                            // byte align

    const out = [];
    for (let i = 0; i < bits.length; i += 8){
      let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
      out.push(b);
    }
    const PAD = [0xEC, 0x11];
    for (let i = 0; out.length < dataCw; i++) out.push(PAD[i % 2]);
    return out;
  }

  /* ── Block split + interleave ──────────────────────────────────────*/
  function interleave(data, version){
    const [, ecCw, g1n, g1d, g2n, g2d] = V[version];
    const blocks = [], eccs = [];
    let p = 0;
    for (let i = 0; i < g1n; i++){ const b = data.slice(p, p + g1d); p += g1d; blocks.push(b); eccs.push(ecc(b, ecCw)); }
    for (let i = 0; i < g2n; i++){ const b = data.slice(p, p + g2d); p += g2d; blocks.push(b); eccs.push(ecc(b, ecCw)); }

    const out = [];
    const maxD = Math.max(g1d, g2d || 0);
    for (let i = 0; i < maxD; i++) for (const b of blocks) if (i < b.length) out.push(b[i]);
    for (let i = 0; i < ecCw; i++) for (const e of eccs) out.push(e[i]);
    return out;
  }

  /* ── Matrix ────────────────────────────────────────────────────────*/
  function build(version, codewords, mask){
    const n = 17 + 4 * version;
    const m = Array.from({length:n}, () => new Int8Array(n).fill(-1));
    const fn = Array.from({length:n}, () => new Uint8Array(n));   // function-module map
    const set = (r, c, v) => { if (r>=0 && r<n && c>=0 && c<n){ m[r][c] = v; fn[r][c] = 1; } };

    const finder = (r, c) => {
      for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++){
        const on = (i>=0&&i<=6&&(j===0||j===6)) || (j>=0&&j<=6&&(i===0||i===6)) || (i>=2&&i<=4&&j>=2&&j<=4);
        set(r + i, c + j, on ? 1 : 0);
      }
    };
    finder(0, 0); finder(0, n - 7); finder(n - 7, 0);

    for (let i = 8; i < n - 8; i++){                              // timing
      const v = i % 2 === 0 ? 1 : 0;
      set(6, i, v); set(i, 6, v);
    }

    const ac = ALIGN[version];                                    // alignment
    for (const r of ac) for (const c of ac){
      if ((r <= 8 && c <= 8) || (r <= 8 && c >= n - 9) || (r >= n - 9 && c <= 8)) continue;
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++)
        set(r + i, c + j, (Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0)) ? 1 : 0);
    }

    set(n - 8, 8, 1);                                             // dark module

    const f = fmtBits(0b00, mask);                                // format info (M)
    for (let i = 0; i < 15; i++){
      const b = (f >> i) & 1;
      if (i < 6) set(i, 8, b); else if (i < 8) set(i + 1, 8, b); else if (i < 9) set(8, 7, b);
      else set(8, 14 - i, b);
      if (i < 8) set(8, n - 1 - i, b); else set(n - 15 + i, 8, b);
    }

    if (version >= 7){                                            // version info
      const vb = verBits(version);
      for (let i = 0; i < 18; i++){
        const b = (vb >> i) & 1, r = Math.floor(i / 3), c = i % 3;
        set(n - 11 + c, r, b); set(r, n - 11 + c, b);
      }
    }

    const maskFn = [
      (i,j)=>(i+j)%2===0, (i,j)=>i%2===0, (i,j)=>j%3===0, (i,j)=>(i+j)%3===0,
      (i,j)=>(Math.floor(i/2)+Math.floor(j/3))%2===0,
      (i,j)=>((i*j)%2)+((i*j)%3)===0,
      (i,j)=>((((i*j)%2)+((i*j)%3))%2)===0,
      (i,j)=>((((i+j)%2)+((i*j)%3))%2)===0
    ][mask];

    let bit = 0;
    const total = codewords.length * 8;
    for (let col = n - 1; col > 0; col -= 2){
      if (col === 6) col--;                                       // skip timing column
      for (let k = 0; k < n; k++){
        const up = ((n - 1 - col) >> 1) % 2 === 0;
        const row = up ? n - 1 - k : k;
        for (let z = 0; z < 2; z++){
          const c = col - z;
          if (fn[row][c]) continue;
          let v = 0;
          if (bit < total) v = (codewords[bit >> 3] >> (7 - (bit & 7))) & 1;
          bit++;
          m[row][c] = maskFn(row, c) ? v ^ 1 : v;
        }
      }
    }
    return { m, n, fn };
  }

  /* ── Mask penalty (rules 1–4) ──────────────────────────────────────*/
  function penalty(m, n){
    let p = 0;
    const run = line => {
      let s = 0, prev = -1;
      for (let i = 0; i < n; i++){
        if (line[i] === prev){ s++; if (s === 5) p += 3; else if (s > 5) p += 1; }
        else { prev = line[i]; s = 1; }
      }
    };
    for (let i = 0; i < n; i++){
      run(m[i]);
      run(Array.from({length:n}, (_, j) => m[j][i]));
    }
    for (let i = 0; i < n - 1; i++) for (let j = 0; j < n - 1; j++)
      if (m[i][j] === m[i][j+1] && m[i][j] === m[i+1][j] && m[i][j] === m[i+1][j+1]) p += 3;

    const PAT = [1,0,1,1,1,0,1,0,0,0,0], PAT2 = [0,0,0,0,1,0,1,1,1,0,1];
    const scan = line => {
      for (let i = 0; i <= n - 11; i++){
        let a = true, b = true;
        for (let k = 0; k < 11; k++){ if (line[i+k] !== PAT[k]) a = false; if (line[i+k] !== PAT2[k]) b = false; }
        if (a) p += 40; if (b) p += 40;
      }
    };
    for (let i = 0; i < n; i++){
      scan(m[i]);
      scan(Array.from({length:n}, (_, j) => m[j][i]));
    }
    let dark = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (m[i][j]) dark++;
    p += Math.floor(Math.abs(dark * 100 / (n * n) - 50) / 5) * 10;
    return p;
  }

  /* ── Public ────────────────────────────────────────────────────────*/
  function encode(text){
    const bytes = [...new TextEncoder().encode(text)];
    let version = 0;
    for (let v = 1; v <= 10; v++){
      const header = 4 + (v <= 9 ? 8 : 16);
      if (bytes.length * 8 + header <= V[v][0] * 8){ version = v; break; }
    }
    if (!version) throw new Error('QR: payload too long for version 10 at EC level M');

    const data = encodeData(bytes, version);
    const cw   = interleave(data, version);

    let best = null, bestP = Infinity;
    for (let mask = 0; mask < 8; mask++){
      const r = build(version, cw, mask);
      const p = penalty(r.m, r.n);
      if (p < bestP){ bestP = p; best = r; best.mask = mask; }
    }
    best.version = version;
    return best;
  }

  /* Render to an SVG string. `quiet` is the mandatory 4-module margin. */
  function svg(text, { size = 220, quiet = 4, dark = '#101211', light = 'transparent' } = {}){
    const { m, n, version, mask } = encode(text);
    const t = n + quiet * 2;
    let d = '';
    for (let i = 0; i < n; i++){
      let j = 0;
      while (j < n){
        if (m[i][j]){
          let w = 1;
          while (j + w < n && m[i][j + w]) w++;                    // merge runs
          d += `M${j + quiet},${i + quiet}h${w}v1h-${w}z`;
          j += w;
        } else j++;
      }
    }
    return `<svg viewBox="0 0 ${t} ${t}" width="${size}" height="${size}" shape-rendering="crispEdges"
      role="img" aria-label="QR code, version ${version}">
      <rect width="${t}" height="${t}" fill="${light}"/>
      <path d="${d}" fill="${dark}"/></svg>`;
  }

  return { encode, svg };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = QR;
