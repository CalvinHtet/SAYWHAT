// LEAD's 6ade4bd (Cal: "I accidentally zoomed in and can't zoom back out"): the page itself no longer zooms on iPhone (viewport
// maximum-scale=1, user-scalable=no; Safari's gesturestart/change/end stopped), while a room window still zooms its own picture.
// In WebKit (Safari's engine) as an iPhone (isMobile, touch): the viewport tag and page scale; the gesture events are cancelled;
// the character creator by taps and typing to the Board; typing in the Training weight box; every room window's + and - and a
// two-finger pinch (pointer events, as the window listens to); long windows still scroll (wheel, in a desktop WebKit page:
// Playwright cannot drag a finger in WebKit).   BASE=<server> OUT=<folder> node zoomblock.js
const fs = require('fs'); const pw = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out/zoomblock'; fs.mkdirSync(OUT, { recursive: true });
let fails = 0; const ok = (n, c, g) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 400) : '')); };
(async () => {
  const b = await pw.webkit.launch(); const errs = [];
  const ctx = await b.newContext({ ...pw.devices['iPhone 13'] }); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 120000 });
  const meta = await p.evaluate(() => ({ vp: document.querySelector('meta[name=viewport]').content, scale: window.visualViewport ? visualViewport.scale : null, inner: innerWidth, GestureEvent: typeof window.GestureEvent }));
  ok('viewport caps the page at 1x', /maximum-scale=1/.test(meta.vp) && /user-scalable=no/.test(meta.vp) && meta.scale === 1, meta);
  const gest = await p.evaluate(() => ['gesturestart', 'gesturechange', 'gestureend'].map((t) => { const e = new Event(t, { bubbles: true, cancelable: true }); document.body.dispatchEvent(e); return t + ':' + e.defaultPrevented; }));
  ok('Safari page-zoom gestures are cancelled', gest.every((s) => /true$/.test(s)), gest);
  // the creator, by taps and typing (the Training weight box below: start a plan, past the coach's first screen)
  await p.tap('#ccname'); await p.keyboard.type('Cal'); const nm = await p.inputValue('#ccname');
  await p.tap('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(800);
  const opts = await p.evaluate(() => { const o = [...document.querySelectorAll('.cc-menu button, .cc-menu [data-act]')].filter((e) => e.offsetParent); return o.length; });
  // a few choices in the menu, then Begin
  const picks = await p.evaluate(() => [...document.querySelectorAll('.cc-menu [data-act]')].filter((e) => e.offsetParent && e.dataset.act !== 'ccdone').slice(0, 6).map((e, i) => { e.setAttribute('data-qa', 'pk' + i); return e.dataset.act; }));
  for (let i = 0; i < Math.min(4, picks.length); i++) { try { await p.tap(`[data-qa="pk${i}"]`, { timeout: 3000 }); await p.waitForTimeout(250); } catch (e) {} }
  await p.screenshot({ path: OUT + '/creator.png' });
  await p.tap('[data-act="ccdone"]'); await p.waitForTimeout(2500);
  const st = await p.evaluate(() => ({ created: window.__qb && window.__qb.x().S.created, name: window.__qb && window.__qb.x().S.char && window.__qb.x().S.char.name, board: !!document.querySelector('.nav button[data-v="board"]'), scale: visualViewport.scale }));
  ok('the creator works by taps and typing, to the Board', nm === 'Cal' && st.created && st.name === 'Cal' && st.board && st.scale === 1, { typed: nm, menuButtons: opts, tappedPicks: picks.slice(0, 4), ...st });
  // typing a weight in Training
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = Math.max(S.xp, x.cum(10)); x.render(); document.querySelectorAll('#layer .modal,.dropsplash,.overlay').forEach((e) => e.remove()); const t = document.querySelector('.nav button[data-v="train"]'); t && t.click(); }); await p.waitForTimeout(1200);
  if (await p.$('[data-act="wkplan"]')) { await p.tap('[data-act="wkplan"]'); await p.waitForTimeout(1500); }
  await p.evaluate(() => document.querySelectorAll('#layer .modal,#layer .coachscr,.dropsplash,.overlay').forEach((e) => e.remove())); await p.waitForTimeout(400);
  const hasKg = await p.evaluate(() => { const i = [...document.querySelectorAll('input.kg')].find((e) => e.offsetParent); if (!i) return false; i.scrollIntoView({ block: 'center' }); i.setAttribute('data-qa', 'kg'); return true; });
  if (hasKg) { await p.evaluate(() => { document.querySelector('[data-qa="kg"]').value = ''; }); await p.tap('[data-qa="kg"]'); await p.keyboard.type('135'); const v = await p.inputValue('[data-qa="kg"]'); const sc = await p.evaluate(() => visualViewport.scale);
    ok('typing in the Training weight box (no page zoom on focus)', v === '135' && sc === 1, { value: v, scale: sc }); await p.screenshot({ path: OUT + '/training_kg.png' }); }
  else console.log('  --   no Training weight box on screen for a new player (not checked)');
  // every room window: + / - and a pinch
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(60); S.coins = 999999; S.base.served = 1e6;
    const order = ['bedroom', 'closet', 'lair', 'patio', 'gameroom', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert', 'speakeasy', 'garden', 'theater', 'auditorium', 'mall', 'bowling', 'karaoke', 'arcade', 'rhythm', 'vr', 'club'];
    S.base.slots = order.map((t) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).filter((u) => !(u[3] && (u[3].retired || u[3].opens))).map((u) => [u[0], 1])), st: 0, pend: 0 })); x.render(); document.querySelector('.nav button[data-v="board"]').click(); });
  await p.waitForTimeout(800);
  const types = await p.evaluate(() => window.__qb.x().S.base.slots.map((r) => r.t)); const bad = []; let n = 0;
  for (let k = 0; k < types.length; k++) {
    await p.evaluate((k) => { document.querySelectorAll('#layer .modal,.dropsplash,.overlay').forEach((e) => e.remove()); window.__qb.roomModal(k); }, k); await p.waitForTimeout(1300);
    const vb = () => p.evaluate(() => { const s = document.querySelector('.rmodal #rbigw svg') || document.querySelector('.rmodal .rbig svg'); return s && s.getAttribute('viewBox'); });
    const v0 = await vb(); const hasBtn = await p.evaluate(() => !!document.querySelector('.rmodal .lfzin') && !!document.querySelector('.rmodal .lfzout'));
    if (!hasBtn) { bad.push({ t: types[k], why: 'no + / -' }); continue; }
    await p.tap('.rmodal .lfzin'); await p.waitForTimeout(400); const v1 = await vb(); await p.tap('.rmodal .lfzout'); await p.waitForTimeout(400); const v2 = await vb();
    const v3 = await p.evaluate(async () => { const s = document.querySelector('.rmodal #rbigw svg') || document.querySelector('.rmodal .rbig svg'); const r = s.getBoundingClientRect(), cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      const ev = (type, id, x) => s.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: 'touch', isPrimary: id === 11, clientX: x, clientY: cy, bubbles: true, cancelable: true }));
      ev('pointerdown', 11, cx - 20); ev('pointerdown', 12, cx + 20); for (let i = 1; i <= 8; i++) { ev('pointermove', 11, cx - 20 - i * 12); ev('pointermove', 12, cx + 20 + i * 12); await new Promise((ok) => setTimeout(ok, 30)); }
      ev('pointerup', 11, cx - 116); ev('pointerup', 12, cx + 116); await new Promise((ok) => setTimeout(ok, 400)); return s.getAttribute('viewBox'); });
    n++; if (!(v1 !== v0 && v2 === v0 && v3 !== v0)) bad.push({ t: types[k], v0, v1, v2, v3 });
    if (types[k] === 'restaurant') await p.screenshot({ path: OUT + '/restaurant_pinched.png' });
  }
  ok(`every room window zooms its picture: + in, - back, a pinch in (${n} rooms)`, bad.length === 0, bad);
  // long windows still scroll: the Restaurant window's list, the Shop
  await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); const k = window.__qb.x().S.base.slots.findIndex((r) => r.t === 'restaurant'); window.__qb.roomModal(k); }); await p.waitForTimeout(1200);
  const scl = await p.evaluate(() => { const els = [...document.querySelectorAll('#layer .modal *, #layer .modal')].filter((e) => e.scrollHeight > e.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(e).overflowY)); return els.map((e) => (e.className || e.tagName) + ' ' + e.clientHeight + '/' + e.scrollHeight); });
  let wheelMobile = 'n/a'; try { const bx = await p.evaluate(() => { const r = document.querySelector('#layer .modal').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height * 0.8]; }); await p.mouse.move(bx[0], bx[1]); await p.mouse.wheel(0, 400); wheelMobile = 'sent'; } catch (e) { wheelMobile = 'not supported: ' + e.message.split('\n')[0].slice(0, 80); }
  ok('the Restaurant window has a scrolling box (overflow auto, taller content)', scl.length > 0, { boxes: scl.slice(0, 3), wheelInMobileWebKit: wheelMobile });
  await ctx.close();
  const c2 = await b.newContext({ viewport: { width: 390, height: 844 } }); const q = await c2.newPage(); q.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await q.goto(BASE + '/dist/index.html'); await q.waitForFunction(() => window.__qb && window.QBLoft, null, { timeout: 120000 }); await q.waitForTimeout(600);
  await q.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(60); S.coins = 999999;
    S.base.slots = ['bedroom', 'restaurant'].map((t) => ({ t, a: {}, st: 0, pend: 0 })); x.render(); window.__qb.roomModal(1); }); await q.waitForTimeout(1500);
  const sc0 = await q.evaluate(() => { const e = [...document.querySelectorAll('#layer .modal *, #layer .modal')].find((e) => e.scrollHeight > e.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(e).overflowY)); if (!e) return null; e.setAttribute('data-qa', 'sc'); return e.scrollTop; });
  if (sc0 !== null) { const bx = await q.evaluate(() => { const r = document.querySelector('[data-qa=sc]').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }); await q.mouse.move(bx[0], bx[1]); await q.mouse.wheel(0, 500); await q.waitForTimeout(500); const sc1 = await q.evaluate(() => document.querySelector('[data-qa=sc]').scrollTop);
    ok('a long window scrolls (wheel, desktop WebKit)', sc1 > sc0, { before: sc0, after: sc1 }); }
  await q.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="shop"]').click(); }); await q.waitForTimeout(1500);
  const y0 = await q.evaluate(() => { const e = document.scrollingElement; return [e.scrollTop, e.scrollHeight, innerHeight]; }); await q.mouse.move(195, 500); await q.mouse.wheel(0, 800); await q.waitForTimeout(500); const y1 = await q.evaluate(() => document.scrollingElement.scrollTop);
  const inner = await q.evaluate(() => [...document.querySelectorAll('main, .view, #app, body *')].filter((e) => e.scrollTop > 0).slice(0, 3).map((e) => (e.id || e.className || e.tagName) + ':' + e.scrollTop));
  ok('the Shop page scrolls (wheel, desktop WebKit)', y1 > y0[0] || inner.length > 0, { page: y0, after: y1, innerScrolled: inner });
  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fails ? `FAIL ${fails}` : 'PASS'); await b.close();
})();
