// Upgrade sweep: every room starts with nothing, then QA presses the room window's first Buy button, again and again, in
// the order the window offers them, until nothing is left. After each purchase: a picture of the room (no people), how
// much of it changed, and the gaps, depth and stations audits for that tier.
//   OUT=<folder> node upgrades.js [room,room]
// Writes <OUT>/<room>/t<NN>.png, <OUT>/<room>/sheet.png (every tier side by side, labelled) and <OUT>/upgrades.json,
// and prints what looks wrong: pieces stacked on each other, overlaps or draw-order or spot problems that appear at a
// middle tier but not when fully upgraded, upgrades that change almost nothing on screen, buys that failed, page errors.
const fs = require('fs');
const path = require('path');
const { open, openRoom, audit, buy, diff, ORDER } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out';
const ONLY = (process.argv[2] || '').split(',').filter(Boolean);
const W = 900, H = 700;
const FAINT = 2500; // changed pixels (of 630,000) below which an upgrade counts as barely visible

(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 1400, owned: 'none' });
  const host = () => p.$('#qahost');
  const all = {};
  // rooms in building order; a room opened by another room's upgrade is swept once it exists
  let todo = ORDER.filter((r) => !ONLY.length || ONLY.includes(r)), stuck = 0;
  while (todo.length) {
    const room = todo.shift();
    // a room nothing in this run will open (a run of only that room): add it bare
    const i = await p.evaluate(({ t, add }) => { const S = window.__qb.x().S; let k = S.base.slots.findIndex((s) => s.t === t); if (k < 0 && add) { S.base.slots.push({ t, a: {}, st: 0, pend: 0 }); k = S.base.slots.length - 1; } return k; }, { t: room, add: stuck >= todo.length + 1 });
    if (i < 0) { todo.push(room); stuck++; continue; }
    stuck = 0;
    const dir = path.join(OUT, room); fs.mkdirSync(dir, { recursive: true });
    const tiers = [];
    let prev = null, guard = 0;
    while (guard++ < 80) {
      const e0 = errs.length;
      const st = await openRoom(p, i, W, H);
      if (st.err) { tiers.push({ err: st.err }); break; }
      const a = await audit(p, i);
      const png = await (await host()).screenshot();
      const k = tiers.length;
      fs.writeFileSync(path.join(dir, 't' + String(k).padStart(2, '0') + '.png'), png);
      const t = { k, slot: i, bought: k ? tiers[k - 1].next : null, ...a, blocked: st.blocked, summary: st.summary, cards: st.cards, left: st.left };
      if (prev) t.change = await diff(p, prev.toString('base64'), png.toString('base64'));
      prev = png;
      t.next = st.next;
      if (st.next) {
        const r = await buy(p, i, st.next);
        t.nextName = r.name; t.nextCost = r.cost;
        if (!r.ok) t.buyFail = r.why;
      }
      t.errs = errs.slice(e0);
      tiers.push(t);
      if (!st.next || t.buyFail) break;
    }
    all[room] = tiers;
    fs.writeFileSync(path.join(dir, 'tiers.json'), JSON.stringify(tiers));
    // labelled sheet: every tier in order
    const cells = tiers.filter((t) => !t.err).map((t) => {
      const src = 'data:image/png;base64,' + fs.readFileSync(path.join(dir, 't' + String(t.k).padStart(2, '0') + '.png')).toString('base64');
      const lab = t.k === 0 ? 'Tier 0: nothing bought' : 'Tier ' + t.k + ': + ' + tiers[t.k - 1].nextName + ' (' + tiers[t.k - 1].nextCost + ')';
      const px = t.change ? t.change.px : null;
      const warn = px !== null && px < FAINT ? ' style="color:#ff6b6b"' : '';
      return `<figure><img src="${src}"><figcaption${warn}>${lab}${px !== null ? ' · ' + px + ' px changed' : ''}</figcaption></figure>`;
    }).join('');
    const sp = await b.newPage({ viewport: { width: 1500, height: 800 } });
    await sp.setContent(`<style>body{margin:0;background:#120e20;font:14px system-ui;color:#eee}h1{font-size:20px;margin:10px 14px}div{display:grid;grid-template-columns:repeat(4,360px);gap:10px;padding:10px}figure{margin:0}img{width:360px;height:280px;display:block;background:#1b1530}figcaption{padding:3px 2px;font-size:12px}</style><h1>${room}: every upgrade bought one at a time, in the order the room window offers them</h1><div>${cells}</div>`);
    await sp.screenshot({ path: path.join(dir, 'sheet.png'), fullPage: true });
    await sp.close();
    console.log(room, tiers.length - 1, 'upgrades bought');
  }
  fs.writeFileSync(path.join(OUT, 'upgrades.json'), JSON.stringify(all, null, 1));

  // report
  const key = (x) => x.slice(0, 2).sort().join(' + ');
  for (const [room, tiers] of Object.entries(all)) {
    const last = tiers[tiers.length - 1], lines = [];
    if (last.err) lines.push('ERROR ' + last.err);
    if (last.next && last.buyFail) lines.push('BUY FAILED ' + last.next + ': ' + last.buyFail);
    if (last.blocked && last.blocked.length) lines.push('left unbought, blocked: ' + last.blocked.join(' | '));
    const finalOv = new Set((last.overlap || []).map(key)), finalDepth = new Set(last.depth || []), finalSt = new Set(last.stations || []);
    const seen = new Set();
    tiers.forEach((t) => {
      if (t.err) return;
      const lab = 'T' + t.k + (t.k ? ' (' + tiers[t.k - 1].nextName + ')' : '');
      (t.stack || []).forEach((s) => { const m = 'STACKED ' + s[0] + ' + ' + s[1] + ' iou ' + s[2]; if (!seen.has(m)) { seen.add(m); lines.push(lab + ' ' + m); } });
      (t.overlap || []).forEach((s) => { const m = 'overlap only mid-tier ' + key(s); if (!finalOv.has(key(s)) && !seen.has(m)) { seen.add(m); lines.push(lab + ' ' + m + ' (' + s[2] + ' tiles²)'); } });
      (t.depth || []).forEach((s) => { const m = 'depth ' + s; if (!seen.has(m)) { seen.add(m); lines.push(lab + ' ' + m + (finalDepth.has(s) ? ' (also fully upgraded)' : ' (mid-tier only)')); } });
      (t.stations || []).forEach((s) => { const m = 'spot ' + s; if (!seen.has(m)) { seen.add(m); lines.push(lab + ' ' + m + (finalSt.has(s) ? ' (also fully upgraded)' : ' (mid-tier only)')); } });
      (t.outside || []).forEach((s) => { const m = 'OUTSIDE ' + s; if (!seen.has(m)) { seen.add(m); lines.push(lab + ' ' + m); } });
      if (/All upgrades installed/.test(t.summary || '') && t.left && t.left.length) lines.push(lab + ' MENU says "All upgrades installed" with ' + t.left.length + ' unbought: ' + t.left.join(','));
      if (t.cards > 5) lines.push(lab + ' MENU shows ' + t.cards + ' cards (should be at most 5)');
      if (!t.next && t.left && t.left.length && !(t.blocked || []).length) lines.push(lab + ' MENU offers nothing to buy but ' + t.left.length + ' unbought: ' + t.left.join(','));
      if (t.change && t.change.px < FAINT) lines.push(lab + ' barely visible: ' + t.change.px + ' px changed');
      (t.errs || []).forEach((e) => lines.push(lab + ' ' + e));
    });
    console.log('\n## ' + room + ' (' + (tiers.length - 1) + ' upgrades, ' + (last.size || '?') + ')');
    lines.forEach((l) => console.log('  ' + l));
  }
  console.log('\npage errors in all:', errs.length);
  await b.close();
})();
