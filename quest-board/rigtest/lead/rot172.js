// Cal 11-25 (29zz_v172.js): "There should only be 3 [brands] at all times. One on Monday, the vault on Wednesday, and another drop on
// Thursday. The pet shop cycles through on Tuesday and Friday." Walks the clock 8 am-ish every day from today for 16 weeks:
// - always exactly 3 brands in the rotation (the Wednesday vault brand on top, that day only), no Boutique floor of its own
// - the 3 change only on Mondays and Thursdays, one brand a drop, from 11-30; every third drop a pricier brand, never two at once
// - no held brand drops; a brand never comes back within 3 drops of leaving; every pricier brand that is not held gets a turn
// - pet clothes move on only on Tuesdays and Fridays from 11-28
//   PORT=<build server> NODE_PATH=<playwright's parent> node rigtest/lead/rot172.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV172 && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const D = window.__qbDrops, out = [], real = Date.now() - (window.__qbShift || 0); const prem = (id) => { const b = (window.__qb.x && 0) || null; return false; };
    const day0 = new Date(); day0.setHours(12, 0, 0, 0);
    for (let i = 0; i < 112; i++) { const t = new Date(day0); t.setDate(t.getDate() + i); window.__qbShift = t.getTime() - real; const st = D.state(), ymd = D.ymd();
      const vb = st.back ? st.back.id : null; out.push({ ymd, wd: new Date(ymd + 'T12:00:00Z').getUTCDay(), ids: st.live.map((q) => q.id).filter((id) => id !== vb), vb, floors: Object.keys(st.floors).map((k) => k + ':' + (st.floors[k].live || []).filter((q) => q.id !== vb).length).join(','), pet: window.__qbV172.pet() }); }
    window.__qbShift = 0; return out; });
  const fl = await p.evaluate(() => { const o = {}; (window.__qbDrops.floors() || []); return null; });
  const premIds = await p.evaluate(() => { const B = []; try { const s = document.createElement('script'); } catch (e) {} return null; });
  const info = await p.evaluate(() => ({ prem: (window.__qbV167 ? ['rose', 'sm', 'cr', 'gd', 'oc', 'rg', 'hanga', 'y2k', 'over', 'nc', 'alt', 'kp', 'smk', 'gp', 'sp', 'bb', 'km', 'oak', 'sv'].filter((id) => window.__qbV167.prem(id)) : []),
    held: (window.__qbDrops.cfg.hold || []).filter((h) => !h.until).reduce((a, h) => a.concat(h.ids), []) }));
  ok(r.every((d) => d.ids.length === 3 && new Set(d.ids).size === 3), 'every day for 16 weeks has exactly 3 brands (plus the vault on a Wednesday): ' + r.filter((d) => d.ids.length !== 3).slice(0, 4).map((d) => d.ymd + ' ' + d.ids.join('/') + ' [' + d.floors + ']').join('; '));
  let wrongDay = [], twoAtOnce = [], drops = [];
  for (let i = 1; i < r.length; i++) { const a = r[i - 1], c = r[i], gone = a.ids.filter((x) => c.ids.indexOf(x) < 0), came = c.ids.filter((x) => a.ids.indexOf(x) < 0);
    if (came.length) { drops.push({ ymd: c.ymd, id: came[0], left: gone[0] }); if (!(c.wd === 1 || c.wd === 4) || came.length !== 1 || gone.length !== 1) wrongDay.push(c.ymd + ' +' + came.join('/') + ' -' + gone.join('/')); } }
  r.forEach((d) => { if (d.ids.filter((id) => info.prem.indexOf(id) >= 0).length > 1) twoAtOnce.push(d.ymd); });
  ok(!wrongDay.length && drops.length >= 30, drops.length + ' drops, each on a Monday or Thursday, one brand in and one out ' + wrongDay.slice(0, 4).join('; '));
  const after = drops.filter((d) => d.ymd >= '2026-11-30'), pc = after.filter((d) => info.prem.indexOf(d.id) >= 0);
  ok(Math.abs(pc.length - after.length / 3) <= 1.01 && !twoAtOnce.length, 'from 11-30 every third drop is a pricier brand (' + pc.length + ' of ' + after.length + '), never two in the Shop at once ' + twoAtOnce.slice(0, 3).join(','));
  const heldIn = drops.filter((d) => info.held.indexOf(d.id) >= 0); ok(!heldIn.length, 'no held brand drops ' + JSON.stringify(heldIn.slice(0, 3)));
  const back = []; after.forEach((d, i) => { const j = after.slice(0, i).map((q) => q.left).lastIndexOf(d.id); if (j >= 0 && i - j < 3) back.push(d.ymd + ' ' + d.id); }); ok(!back.length, 'no brand comes back within 3 drops of leaving ' + back.join(', '));
  const pturn = info.prem.filter((id) => info.held.indexOf(id) < 0 && !pc.some((d) => d.id === id)); ok(!pturn.length, 'every pricier brand not held gets a turn in 16 weeks (' + info.prem.filter((id) => info.held.indexOf(id) < 0).join(', ') + ') ' + pturn.join(','));
  const today = r[0]; ok(today.ids.every((id) => info.prem.indexOf(id) < 0) || today.ymd >= '2026-11-30', 'today: the Street\'s 3 only (' + today.ids.join(', ') + ')' + (today.vb ? ', vault ' + today.vb : ''));
  const wed = r.filter((d) => d.wd === 3 && d.vb); ok(wed.length >= 8 && r.every((d) => !d.vb || d.wd === 3), 'the vault brand comes on Wednesdays only, on top of the 3 (' + wed.length + ' Wednesdays)');
  const pm = []; for (let i = 1; i < r.length; i++) if (r[i].pet !== r[i - 1].pet) pm.push(r[i].ymd + ':' + r[i].wd);
  ok(pm.filter((x) => x.split(':')[0] >= '2026-11-28').every((x) => /:(2|5)$/.test(x)) && pm.length >= 25, 'pet clothes move on on Tuesdays and Fridays (' + pm.slice(0, 6).join(' ') + ' ...)');
  console.log('     first drops: ' + drops.slice(0, 10).map((d) => d.ymd.slice(5) + ' ' + d.id).join(', '));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
