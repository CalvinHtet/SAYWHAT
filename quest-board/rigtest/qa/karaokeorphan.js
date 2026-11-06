// A save that owns Karaoke but not Bowling (ROOMS's 0eb00c2 moved Karaoke upstairs from Bowling): which arrows lead into Karaoke,
// whether the building view shows it and opens it on a tap, and what Karaoke's own arrows offer.
//   node karaokeorphan.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const r = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S, w = (ms) => new Promise((o) => setTimeout(o, ms)), out = {};
    S.base.slots = S.base.slots.filter((s) => !['bowling', 'karaoke', 'mall'].includes(s.t)); S.base.slots.push({ t: 'mall', a: {}, st: 0, pend: 0 }, { t: 'karaoke', a: {}, st: 0, pend: 0 });
    S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(45)); x.render();
    const arrows = async (k) => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.findIndex((s) => s.t === k)); await w(350); return [...document.querySelectorAll('.rmodal .prtb-b')].map((e) => e.textContent.trim()); };
    out.mall = await arrows('mall'); out.karaoke = await arrows('karaoke');
    document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove());
    document.querySelector('.nav button[data-v="hideout"]').click(); await w(1800);
    out.buildings = [];
    for (let bi = 0; bi < document.querySelectorAll('[data-act="bldgo"]').length; bi++) {
      document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove());
      document.querySelector('.nav button[data-v="board"]').click(); await w(300); document.querySelector('.nav button[data-v="hideout"]').click(); await w(1500);
      const bt = document.querySelectorAll('[data-act="bldgo"]')[bi]; const attrs = [...bt.attributes].map((a) => a.name + '=' + a.value).join(' ');
      bt.dispatchEvent(new MouseEvent('click', { bubbles: true })); await w(2000);
      const rooms = [...document.querySelectorAll('#lfwrap [data-room]')].map((e) => e.getAttribute('data-room'));
      out.buildings.push(attrs.slice(0, 60) + ' -> ' + rooms.join(','));
      window.__shot = bi;
      const kr = document.querySelector('#lfwrap [data-room="karaoke"]');
      if (kr) { kr.dispatchEvent(new MouseEvent('click', { bubbles: true })); await w(900); out.tapOpens = (document.querySelector('.rmodal .rm-title') || {}).textContent || 'nothing opened'; out.karaokeArrowsThere = [...document.querySelectorAll('.rmodal .prtb-b')].map((e) => e.textContent.trim()); }
    }
    return out; });
  await p.screenshot({ path: (process.env.OUT || 'qa-out') + '/karaoke_orphan_view.png' });
  const tabs = await p.evaluate(() => [...document.querySelectorAll('.nav button')].map((b) => b.dataset.v + (b.className.includes('soon') || b.disabled ? '(locked)' : '')).join(' ') + ' | view: ' + ((document.querySelector('main h1,main h2') || {}).textContent || ''));
  console.log(tabs);
  console.log(JSON.stringify(r, null, 1)); console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
