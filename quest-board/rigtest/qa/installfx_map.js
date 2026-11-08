// Every upgrade of every room, sorted by what the purchase effect (LEAD's fa5ff03, 30_app_b.js lfInstallFx) will do with it, using
// the game's own way of finding the new pieces (its room window picture and copies of lfKids and lfSig), no animation timing: the room fully bought but for the
// upgrade (and what needs it), against the same room with it.
//   ok          : new pieces found, hidden while the box drops, then outlined
//   no outline  : new pieces found, but every one carries its own filter or clip, so they fade in without an outline
//   light layer : the room's light layer (g.lflt: the room-sized multiply shade and the lamp glows) counts as new, so it is hidden
//                 during the drop (the room loses its lighting) and then wrapped in the outline filter (the room paints flat cream)
//   room-sized  : another new piece covers over 40% of the picture and would be outlined
//   at once     : over half the picture is new, so the effect skips hiding: it shows before the box drops
//   unchanged   : the picture does not change at all
//   not judged  : nothing new found here but the picture differs (a swap whose art is still loading): check live
//   BASE=<server> OUT=<folder> [ROOMS=a,b] node installfx_map.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out/installfx_map'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 1000, height: 800 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft , null, { timeout: 120000 }); await p.waitForTimeout(800);
  const res = await p.evaluate((only) => {
    const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(60); S.base.served = 1e6;
    // what each upgrade needs first (ADDREQ and "also" are not reachable from the page): with no coins, the window's buy button
    // answers "Install <name> first" when something is missing, else "Need N more coins", and never buys
    const REQ = {}; const coins = S.coins; S.coins = 0;
    Object.keys(x.ADDONS).filter((t) => x.ROOMT[t] && (x.ADDONS[t] || []).length && (!only || only.includes(t))).forEach((t) => {
      let k = S.base.slots.findIndex((z) => z && z.t === t); if (k < 0) { S.base.slots.push({ t, a: {}, st: 0, pend: 0 }); k = S.base.slots.length - 1; }
      const L = x.ADDONS[t]; S.base.slots[k] = { t, a: {}, st: 0, pend: 0 }; document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(k);
      L.forEach((u) => { document.querySelectorAll('#layer .pop').forEach((e) => e.remove()); const b = document.createElement('button'); b.dataset.act = 'raddon'; b.dataset.i = k; b.dataset.id = u[0]; (document.querySelector('.rmodal') || document.body).appendChild(b); b.click(); b.remove();
        const said = [...document.querySelectorAll('#layer .pop')].map((e) => e.textContent).join(' '); const m = said.match(/Install (.+?) first/); if (m) { const q = L.find((z) => z[1] === m[1]) || L.find((z) => m[1].includes(z[1]) || z[1].includes(m[1])); if (q) REQ[u[0]] = q[0]; else REQ[u[0]] = '?' + m[1]; } });
    });
    S.coins = coins; document.querySelectorAll('#layer .pop,#layer .modal').forEach((e) => e.remove());
    // copies of 30_app_b.js lfSig and lfKids
    const lfSig = (el) => el.outerHTML.replace(/(data-i|id|data-k)="[^"]*"/g, '').replace(/url\(#[^)]*\)/g, 'u');
    const lfKids = (svg) => { const o = [].slice.call(svg.children).filter((e) => e.tagName !== 'defs' && !e.classList.contains('lfitems')); const it = svg.querySelector('.lfitems'); if (it) [].forEach.call(it.children, (e) => { if (!/^lfa-/.test(e.id || '')) o.push(e); }); return o; };
    // the room window's own picture, with the window's fixed seed (as lfInstallFx draws both)
    const draw = (r, k) => { S.base.slots[k] = r; document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); let sd = 48271; const o = Math.random; Math.random = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; }; try { window.__qb.roomModal(k); } finally { Math.random = o; } const sv = document.querySelector('#rbigw svg'); return sv ? sv.cloneNode(true) : null; };
    const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:0;top:0;width:390px;height:360px;opacity:0;pointer-events:none'; document.body.appendChild(host);
    const out = [];
    const rooms = Object.keys(x.ADDONS).filter((t) => x.ROOMT[t] && (x.ADDONS[t] || []).length && (!only || only.includes(t)));
    rooms.forEach((t) => {
      const L = x.ADDONS[t], live = L.filter((q) => !(q[3] && (q[3].retired || q[3].opens)));
      live.forEach((u) => {
        const drop = new Set([u[0]]); let grew = true;
        while (grew) { grew = false; L.forEach((q) => { const need = (q[3] && q[3].also) || REQ[q[0]]; if (need && drop.has(need) && !drop.has(q[0])) { drop.add(q[0]); grew = true; } }); }
        const a0 = {}; live.forEach((q) => { if (!drop.has(q[0])) a0[q[0]] = 1; });
        let k = S.base.slots.findIndex((z) => z && z.t === t); if (k < 0) { S.base.slots.push({ t, a: {}, st: 0, pend: 0 }); k = S.base.slots.length - 1; }
        const r0 = { t, a: a0, st: 0, pend: 0 }, r1 = { t, a: Object.assign({}, a0, { [u[0]]: 1 }), st: 0, pend: 0 };
        const s0 = draw(r0, k); const base = {}; let html0 = s0 ? s0.outerHTML : '';
        if (s0) lfKids(s0).forEach((e) => { const s = lfSig(e); base[s] = (base[s] || 0) + 1; });
        const s1c = draw(r1, k); if (!s1c) { out.push([t, u[0], u[1], 'no picture']); return; }
        host.innerHTML = ''; host.appendChild(s1c); const s1 = s1c;
        const all = lfKids(s1), fresh = all.filter((e) => { const s = lfSig(e); if (base[s] > 0) { base[s]--; return false; } return true; });
        const sb = s1.getBoundingClientRect(), area = sb.width * sb.height;
        let kind;
        // a swap of one piece for another can look identical here while its art loads (live, the game does find it): not judged
        if (!fresh.length) kind = s1.outerHTML === html0 ? 'unchanged' : 'not judged (swap)';
        else if (fresh.length > all.length * 0.5) kind = 'at once (' + fresh.length + ' of ' + all.length + ' new)';
        else {
          const wrap = fresh.filter((e) => !e.hasAttribute('filter') && !e.hasAttribute('clip-path'));
          const light = wrap.filter((e) => e.classList.contains('lflt'));
          const big = wrap.filter((e) => !e.classList.contains('lflt')).filter((e) => { const q = e.getBoundingClientRect(); return q.width * q.height > area * 0.4; });
          kind = light.length ? 'light layer' : big.length ? 'room-sized (' + big.map((e) => e.tagName + '.' + (e.getAttribute('class') || '')).join(' ') + ')' : wrap.length ? 'ok' : 'no outline';
        }
        out.push([t, u[0], u[1], kind, fresh.length]);
      });
    });
    host.remove(); document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); out.push(['_req', JSON.stringify(REQ)]); return out;
  }, process.env.ROOMS ? process.env.ROOMS.split(',') : null);
  const req = res.find((r) => r[0] === '_req'); console.log('requirements found: ' + Object.keys(JSON.parse(req[1])).length); res.splice(res.indexOf(req), 1);
  const by = {}; res.forEach((r) => { const k = r[3].replace(/ \(.*$/, ''); (by[k] = by[k] || []).push(r); });
  Object.keys(by).forEach((k) => console.log(`${k}: ${by[k].length}`));
  ['light layer', 'room-sized', 'at once', 'no outline'].forEach((k) => { if (by[k]) console.log(`\n${k}:\n` + by[k].map((r) => `  ${r[0]} ${r[1]} "${r[2]}" ${r[3]}`).join('\n')); });
  fs.writeFileSync(path.join(OUT, 'installfx_map.json'), JSON.stringify(res, null, 0));
  console.log('\npage errors', errs.length, errs.slice(0, 3)); await b.close();
})();
