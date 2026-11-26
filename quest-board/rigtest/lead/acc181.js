// Cal 11-25 (QA's accessory sweep): data/rig.json slotMap draws headphones over the arms (neckOver, group 6), wings behind the body
// (backAcc, group 0), wide sunglasses under the hair (glassesUnder); a full-face helmet still hides them; the sleep pose still hides glasses.
//   PORT=<build server> NODE_PATH=<playwright's parent> node rigtest/lead/acc181.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.QBLook && window.QBLoft && QBDATA.rig, null, { timeout: 90000 });
  const r = await p.evaluate(() => { const B = (eq) => Object.keys(window.QBLook.build(QBLoft.data.creator, { body: 'm', equipped: eq }).layers);
    const R = QBDATA.rig, ids = R.slots.map((s) => s.id), sl = (id) => R.slots.find((s) => s.id === id);
    return { ph: B({ neck: { art: 'sm_phones' } }), wg: B({ neck: { art: 'gp_wings' } }), sh: B({ glasses: { art: 'h_shades', frontOnly: true } }), ch: B({ neck: { art: 'h_chain' } }),
      order: { neckOver: ids.indexOf('neckOver') > ids.indexOf('arms') && sl('neckOver').group === 6, backAcc: ids.indexOf('backAcc') < ids.indexOf('body') && sl('backAcc').group === 0, glassesUnder: ids.indexOf('glassesUnder') < ids.indexOf('hair') },
      sleep: (JSON.stringify(QBDATA.poses || {}).match(/"glassesUnder":null/g) || []).length }; });
  ok(r.ph.indexOf('neckOver') >= 0 && r.ph.indexOf('neck') < 0, 'headphones draw in neckOver (after the near arm) ' + JSON.stringify(r.order));
  ok(r.wg.indexOf('backAcc') >= 0 && r.wg.indexOf('neck') < 0, 'wings draw in backAcc (behind the body)');
  ok(r.sh.indexOf('glassesUnder') >= 0 && r.sh.indexOf('glasses') < 0, 'wide sunglasses draw in glassesUnder (under the hair)');
  ok(r.ch.indexOf('neck') >= 0, 'every other neck piece stays in neck');
  ok(r.order.neckOver && r.order.backAcc && r.order.glassesUnder, 'the new slots sit where they should in the rig');
  ok(!errs.length, 'no page errors'); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
