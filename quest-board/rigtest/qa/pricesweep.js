// FULL PRICE SWEEP (LEAD 13:25, after w-prices' second ECON.tier key made Auditorium upgrades cost NaN). Every price a player can pay:
// every room upgrade (ADDONS, all rooms), every room's lot or opener (ROOMT cost), every Shop entry (clothes, hair, interface items,
// permanent upgrades). Flags NaN, undefined, 0 where it should not be, negatives and fractions; compares every price with a reference
// build (REF) and lists each change; checks the ECONOMY.md anchors and the clothing bands from docs/qa-2026-11-10/CLOTHING_TIERS.md.
//   BASE=<build to check> REF=<reference build> bash tools/windows/node.sh rigtest/qa/pricesweep.js     (about a minute; exit 1 on a problem)
const fs = require('fs'), path = require('path');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8821', REF = process.env.REF || '';
const BANDS = { thrift: [100, 250], standard: [250, 500], premium: [600, 1200], luxury: [1300, 2200] };
const tiers = {}; try { fs.readFileSync(path.join(__dirname, '../../docs/qa-2026-11-10/CLOTHING_TIERS.md'), 'utf8').split('\n').forEach((l) => {
  const c = l.split('|').map((s) => s.trim()); if (c.length > 7 && /^[a-z0-9_]+$/.test(c[1]) && BANDS[c[6]]) tiers[c[1]] = c[6]; }); } catch (e) {}
const GRAB = `(function(){var x=window.__qb.x(),A=x.ADDONS||{},T=x.ROOMT||{},o={up:{},lot:{},shop:{},meta:{}};
  Object.keys(A).forEach(function(k){(A[k]||[]).forEach(function(a){var m=a[3]||{};o.up[k+'.'+a[0]]=a[2];o.meta[k+'.'+a[0]]={retired:!!m.retired,fixed:!!m.fixed,opens:m.opens||'',name:a[1]}})});
  Object.keys(T).forEach(function(k){var r=T[k]||{};['cost','price','lot'].forEach(function(f){if(f in r)o.lot[k+'.'+f]=r[f]})});
  (x.SHOP||[]).forEach(function(s){o.shop[s[0]]=[s[3],s[1],(s[6]||{}).b||'',!!((s[6]||{}).dungeon)]});
  return o})()`;
const bad = (v) => typeof v !== 'number' || !isFinite(v) || v < 0 || Math.round(v) !== v;
async function grab(br, base) {
  const pg = await br.page({ fresh: true, phone: false, width: 800, height: 600 });
  await pg.go(base + '/'); await pg.wait('!!(window.__qb && window.__qb.x && window.__qb.x().ADDONS)', 120000); await sleep(1200);
  const r = await pg.ev(GRAB); r.errs = pg.errs.slice(); await pg.close(); return r;
}
(async () => {
  const t0 = Date.now(); const br = await browser();
  const N = await grab(br, BASE), R = REF ? await grab(br, REF) : null;
  const P = []; // problems
  // room upgrades
  let nUp = 0, sumOpenable = 0;
  for (const [k, v] of Object.entries(N.up)) { nUp++; const m = N.meta[k];
    if (bad(v)) P.push(`upgrade ${k} (${m.name}) price ${JSON.stringify(v)}`);
    else if (v === 0 && !m.retired) P.push(`upgrade ${k} (${m.name}) costs 0`); }
  // lots and openers
  // a room with no lot (the Bedroom you start in, a room an upgrade opens) costs 0 there by design
  const opened = new Set(Object.values(N.meta).map((m) => m.opens).filter(Boolean)); opened.add("bedroom");
  for (const [k, v] of Object.entries(N.lot)) if (bad(v) || (v === 0 && !opened.has(k.split(".")[0]))) P.push(`lot ${k} ${JSON.stringify(v)}`);
  // the Shop
  const shopBad = []; const outBand = [];
  for (const [id, [p, type, b, dg]] of Object.entries(N.shop)) {
    if (bad(p) || (p === 0 && !dg)) shopBad.push(`${id} (${type}${b ? ', ' + b : ''}) ${JSON.stringify(p)}`);
    if (tiers[id] && typeof p === 'number') { const [lo, hi] = BANDS[tiers[id]]; if (p < lo || p > hi) outBand.push(`${id} ${tiers[id]} ${p}`); } }
  shopBad.forEach((s) => P.push('shop ' + s));
  // against the reference
  const diffs = { up: [], lot: [], shopCloth: [], shopOther: [] };
  if (R) {
    for (const k of new Set([...Object.keys(N.up), ...Object.keys(R.up)])) if (N.up[k] !== R.up[k]) diffs.up.push(`${k} ${R.up[k]}->${N.up[k]}`);
    for (const k of new Set([...Object.keys(N.lot), ...Object.keys(R.lot)])) if (N.lot[k] !== R.lot[k]) diffs.lot.push(`${k} ${R.lot[k]}->${N.lot[k]}`);
    for (const k of new Set([...Object.keys(N.shop), ...Object.keys(R.shop)])) { const a = R.shop[k], b = N.shop[k]; if (!a || !b || a[0] !== b[0]) { if (tiers[k]) diffs.shopCloth.push(`${k} ${a && a[0]}->${b && b[0]}`); else diffs.shopOther.push(`${k} ${a && a[0]}->${b && b[0]}`); } }
  }
  // ECONOMY.md anchors (2026-11-10)
  const g = (k) => N.up[k];
  const anchors = { 'auditorium.au_proj2 (IMAX Laser Projector)': [g('auditorium.au_proj2'), +(process.env.PROJ || 9250)], 'auditorium.au_imax (IMAX Screen)': [g('auditorium.au_imax'), +(process.env.IMAX || 14250)] }; // ECONOMY.md v0.91 (c133657); v0.90: PROJ=10500 IMAX=21000
  const lotsSum = ['garden', 'boba', 'theater', 'mall', 'club'].reduce((s, k) => s + (N.lot[k + '.cost'] || 0), 0); anchors['lots garden+boba+theater+mall+club'] = [lotsSum, +(process.env.LOTS || 57050)]; // ECONOMY.md v0.91: 57,050; v0.90 chain 86,500 (85,400 before SPEC8)
  for (const [k, [v, want]] of Object.entries(anchors)) if (v !== want) P.push(`ECONOMY.md anchor ${k}: ${v}, doc says ${want}`);
  console.log(`checked ${nUp} room upgrades, ${Object.keys(N.lot).length} lot/opener prices, ${Object.keys(N.shop).length} Shop entries (${Object.keys(tiers).length} graded clothes) on ${BASE}${R ? ' against ' + REF : ''} in ${Math.round((Date.now() - t0) / 1000)} s`);
  console.log(`anchors: ${Object.entries(anchors).map(([k, [v, w]]) => `${k} ${v}${v === w ? ' ok' : ' (doc ' + w + ')'}`).join('; ')}`);
  if (R) console.log(`changed against the reference: upgrades ${diffs.up.length}${diffs.up.length ? ' [' + diffs.up.slice(0, 10).join('; ') + (diffs.up.length > 10 ? ' ...' : '') + ']' : ''}; lots ${diffs.lot.length}${diffs.lot.length ? ' [' + diffs.lot.slice(0, 8).join('; ') + ']' : ''}; graded clothes ${diffs.shopCloth.length}${diffs.shopCloth.length && diffs.shopCloth.length <= 12 ? ' [' + diffs.shopCloth.join('; ') + ']' : ''}; other Shop entries ${diffs.shopOther.length}${diffs.shopOther.length ? ' [' + diffs.shopOther.slice(0, 10).join('; ') + ']' : ''}`);
  console.log(`clothes outside their tier's band (CLOTHING_TIERS.md): ${outBand.length}${outBand.length ? ' [' + outBand.slice(0, 8).join('; ') + ']' : ''}`);
  console.log(`page errors: ${N.errs.length}${R ? ', reference ' + R.errs.length : ''}`);
  console.log(P.length ? `PROBLEMS ${P.length}:\n  ` + P.slice(0, 40).join('\n  ') + (P.length > 40 ? '\n  ...' : '') : 'no NaN, no undefined, no unexpected 0, no fractions: PASS');
  await br.close(); process.exit(P.length || N.errs.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
