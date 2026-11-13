// LEAD's five tabs (ae3ba38): the bar, the Board's tiles at 390 and 360 (all three open, and a new player with Training only), "< Board" and the
// lit Board tab on each moved screen, Relics from the profile, and the news: when the Wheel, Crawls or Relics newly open, is a "!" shown anywhere?
//   BASE=<sandbox> OUT=<folder> CHROME_PORT=9375 node tabs5qa.js
const fs = require('fs'); const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || 'qa-out/tabs/'; fs.mkdirSync(OUT, { recursive: true });
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 420) : '')); };
(async () => { const br = await browser();
  for (const [w, h] of [[390, 844], [360, 740]]) for (const who of ['mid', 'new']) {
    const pg = await br.page({ fresh: true }); await pg.s('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 3, mobile: true });
    const E = (js) => pg.ev(`(function(){try{${js}}catch(e){return 'ERR '+e.message}})()`);
    await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
    await E(`var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Qa',sex:'m'});S.xp=x.cum(${who === 'mid' ? 14 : 1});S.gates=${who === 'mid' ? 'Array.from({length:200},function(_,i){return i})' : '[]'};S.cls=${who === 'mid' ? '"vanguard"' : '""'};
      ${who === 'mid' ? "if(!S.base.slots.some(function(r){return r&&r.t==='lair'}))S.base.slots.push({t:'lair',a:{},st:0,pend:0});S.relics={streak1:1};" : ''}S.areaOn=null;x.persist();x.render();return 1`); await sleep(1200);
    // the news test (mid only): Wheel, Crawls and Relics open but never visited
    if (who === 'mid') await E(`var o=window.__qbUnlock.on();['hideout','hall','players','shop','train','trophy','wheel','away'].forEach(function(k){o[k]=1});var s=window.__qbAlerts.seen();s.init=1;s.tab=s.tab||{};['board','hideout','hall','players','shop','train'].forEach(function(k){s.tab[k]=1});delete s.tab.wheel;delete s.tab.away;delete s.tab.trophy;window.__qb.x().persist();window.__qb.x().render();return 1`);
    await E('document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(e){e.remove()});var b=document.querySelector(".nav button[data-v=board]");b&&b.click();window.scrollTo(0,0);return 1'); await sleep(1000);
    const r = await E(`var nav=[].map.call(document.querySelectorAll('.nav button'),function(b){return (b.getAttribute('aria-label')||b.dataset.v)+(b.querySelector('.nbang')?'!':'')});
      var tiles=[].map.call(document.querySelectorAll('.zx-tile'),function(t){var q=t.getBoundingClientRect(),b=t.querySelector('b'),s=t.querySelector('small');return {v:t.dataset.v,w:Math.round(q.width),h:Math.round(q.height),clipped:!!s&&s.scrollWidth>s.clientWidth+1,bang:!!t.querySelector('.nbang,.zx-bang')}});
      var news=window.__qbAlerts?Object.keys(window.__qbAlerts.tabs()):null;return {nav:nav,tiles:tiles,news:news,sw:document.documentElement.scrollWidth,bangs:document.querySelectorAll('.nbang').length}`);
    const hub = await E('var e=document.querySelector(".zx-hub");if(!e)return null;e.scrollIntoView({block:"center"});return 1'); await sleep(400);
    await pg.shot(OUT + `board_${who}_${w}.png`);
    console.log(`${w} ${who}: bar ${r.nav.join(' | ')}; tiles ${r.tiles.map((t) => t.v + ' ' + t.w + 'x' + t.h + (t.clipped ? ' CLIPPED' : '')).join(', ') || 'none'}; news (alTabs) ${JSON.stringify(r.news)}; "!" on screen ${r.bangs}`);
    ok(`${w} ${who}: the bar is Board, The Loft, Shop, Town, Players (open ones), no sideways scroll`, r.nav.every((n) => /Board|Loft|Shop|Town|Players|Locked/.test(n)) && r.sw <= w, r.nav);
    if (who === 'mid') {
      const newsHidden = (r.news || []).filter((k) => ['wheel', 'away', 'trophy', 'train'].includes(k));
      ok(`${w}: news for a screen that left the bar is shown somewhere`, !newsHidden.length || r.tiles.some((t) => t.bang), { news: newsHidden, tileBang: r.tiles.filter((t) => t.bang).map((t) => t.v) });
      for (const v of ['train', 'away', 'wheel']) { await E(`document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});var b=document.querySelector('.nav button[data-v=board]');b&&b.click();return 1`); await sleep(500);
        await E(`document.querySelector('.zx-tile[data-v="${v}"]').click();return 1`); await sleep(900);
        const s = await E('var b=document.querySelector(".zx-back"),on=document.querySelector(".nav button.on");return {back:!!b,lit:on&&on.dataset.v}');
        await E('var b=document.querySelector(".zx-back");b&&b.click();return 1'); await sleep(600); const s2 = await E('var on=document.querySelector(".nav button.on");return on&&on.dataset.v');
        ok(`${w}: ${v} from its tile has "< Board", Board lit, and goes back`, s.back && s.lit === 'board' && s2 === 'board', { s, back: s2 }); }
      await E('document.querySelector("[data-act=char]").click();return 1'); await sleep(1200); const rel = await E('var b=[].slice.call(document.querySelectorAll("#layer .modal button")).find(function(b){return /Relics/.test(b.innerText)});if(!b)return null;b.click();return 1'); await sleep(900);
      const rv = await E('var on=document.querySelector(".nav button.on");return {modal:document.querySelectorAll("#layer .modal").length,lit:on&&on.dataset.v,txt:document.querySelector("#app").innerText.slice(0,120).replace(/\\s+/g," ")}');
      ok(`${w}: Relics opens from the profile (window closes, Board lit)`, rel && rv.modal === 0 && rv.lit === 'board' && /Relic/i.test(rv.txt), rv);
    }
    await pg.close(); }
  console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
