// v0.91 STRICTER spoiler playthrough (Cal: "If there is any text about any future rooms before the event triggers, that is a spoiler";
// LEAD 16:31). A fresh save stepped through Cal's unlock table (ECON.unlock, w-unlock) stage by stage: fresh, each Loft room, the Garden
// before the Restaurant, each Kode Plaza room, every Plaza room before the Mall, the Mall's first rooms. At each stage every tab, room
// window, help, splash, story scene, letter, pop and level-up window the player can see is read and searched for later rooms, people,
// features (nospoil_lib.js) and the hint words (menu, dish, dinner, soup, salad, tart, chef, kitchen...) of rooms not yet owned. Read only.
//   BASE=<build> SRC=<its app/src> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/nospoil3_play.js   (FROM=<letter> STOP=<letter>)
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const { srcNames, spoilerHits, PAGE } = require('./nospoil_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/nospoil3';
fs.mkdirSync(OUT, { recursive: true });
const NAMES = srcNames();
const LOG = OUT + '/play.log', JL = OUT + '/stages.jsonl'; fs.writeFileSync(LOG, ''); fs.writeFileSync(OUT + '/hits.jsonl', ''); fs.writeFileSync(JL, '');
const log = (s) => { console.log(s); fs.appendFileSync(LOG, s + '\n'); };
const TABS = ['board', 'train', 'hideout', 'shop', 'hall', 'trophy', 'wheel', 'away'];
// hint words: what a room serves or who runs it, flagged while the room is neither owned nor offered (Cal's stricter rule)
const HINTW = {
  restaurant: [/\bmenus?\b/i, /\bdish(es)?\b/i, /\bdinners?\b/i, /\bsoups?\b/i, /\bsalads?\b/i, /\btarts?\b/i, /\bpies?\b/i, /\bchefs?\b/i, /\bkitchens?\b/i, /\bdiners?\b/i, /\bMara\b/],
  boba: [/\bmilk tea\b/i, /\btapioca\b/i, /\bpearls\b/i], dessert: [/\bpastr(y|ies)\b/i, /\bcakes?\b/i, /\bsweets\b/i],
  skybar: [/\bcocktails?\b/i, /\binvestor\b/i], mall: [/\bstorefronts?\b/i, /\bshoppers\b/i], theater: [/\bmovies?\b/i, /\bpopcorn\b/i, /\bfilms?\b/i],
};
const hintHits = (text, st, where) => { const out = [];
  for (const [room, res] of Object.entries(HINTW)) { if (st.rooms.includes(room) || st.allows[room]) continue;
    res.forEach((re) => { const g = new RegExp(re.source, re.flags + 'g'); let m; while ((m = g.exec(text))) out.push({ where, kind: 'hint', key: room, word: m[0], ctx: text.slice(Math.max(0, m.index - 70), m.index + m[0].length + 70).replace(/\s+/g, ' ') }); }); }
  return out; };

(async () => {
  const br = await browser();
  const pg = await br.page({ fresh: true });
  const E = (f) => pg.ev(`(function(){var N=window.__ns;return (${f})})()`, 60000);
  await pg.go(BASE + '/');
  await pg.wait('!!(window.__qb && window.__qbStory && window.__qbEcon && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  await pg.ev(PAGE);
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Pat',sex:'f'});x.persist();x.render();return 1})()`);
  await sleep(2500);
  // shares as the table counts them (29b_story.js roomFill / roomsShare)
  await pg.ev(`window.__ns3={need:function(t,pct){var A=window.__qb.x().ADDONS[t]||[];var L=A.filter(function(a){var e=a[3]||{};return !e.retired&&!e.opens&&!e.trophy});return Math.ceil(L.length*pct)},
    fill:function(t,n){var x=window.__qb.x(),S=x.S,r=S.base.slots.filter(function(q){return q&&q.t===t})[0];if(!r)return -1;var A=x.ADDONS[t]||[],k=0;r.a=r.a||{};
      A.forEach(function(a){var e=a[3]||{};if(e.retired||e.opens||e.trophy)return;if(k<n){r.a[a[0]]=1}k++});x.persist();x.render();return Object.keys(r.a).length},
    open:function(t){window.__qbRooms.open(t,1);var x=window.__qb.x();x.persist();x.render();return window.__qb.x().S.base.slots.filter(Boolean).map(function(r){return r.t}).join(',')}};1`);
  const U = (t) => pg.ev(`JSON.stringify(window.__qbEcon.ECON.unlock["${t}"]||null)`).then(JSON.parse);
  const fillTo = async (src, pct) => { const n = await pg.ev(`window.__ns3.need("${src}",${pct})`); await pg.ev(`window.__ns3.fill("${src}",${n})`); return n; };

  const allHits = [];
  async function scan(stage, where, text) {
    if (!text) return 0;
    const st = await E('N.state()');
    const h = spoilerHits(text, st, NAMES, stage + ' / ' + where).concat(hintHits(text, st, stage + ' / ' + where));
    h.forEach((x) => { allHits.push(x); fs.appendFileSync(OUT + '/hits.jsonl', JSON.stringify(x) + String.fromCharCode(10)); });
    return h.length;
  }
  async function autoModals(stage, why) {
    const m = await E('N.modals()'); const c = await E('N.closeAll()');
    const all = [].concat(c, m).filter(Boolean);
    for (const t of all) { log(`  [${stage}] window (${why}): ${t.replace(/\s+/g, ' ').slice(0, 400)}`); await scan(stage, 'window ' + why, t); }
    return all;
  }
  async function pops(stage) { const p = await E('N.pops.splice(0)'); for (const t of p) { log(`  [${stage}] pop: ${t}`); await scan(stage, 'pop', t); } }
  let lastLv = 1;
  async function levelTo(stage, L) { // the real level-up window for every level passed
    const to = await E(`N.lvl(${L})`);
    for (let l = lastLv + 1; l <= to; l++) {
      const t = await pg.ev(`(function(l){document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});try{window.qbDbg.levelUp(l,null,l-1)}catch(e){return 'ERR '+e.message}
        var m=[].map.call(document.querySelectorAll('#layer .modal'),function(e){return e.innerText}).join('\\n');document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return m})(${l})`);
      await scan(stage, 'level-up ' + l, t);
    }
    lastLv = Math.max(lastLv, to); return to;
  }
  async function capture(stage) {
    log(`== ${stage}: ` + JSON.stringify(await E('(function(){var s=N.state();return {lvl:s.lvl,rooms:s.rooms,team:s.team,offer:s.offer}})()')));
    const rec = { stage, tabs: {}, rooms: {}, helps: {} };
    await autoModals(stage, 'before capture'); await pops(stage);
    await E('N.nav("board")'); await sleep(1000); await autoModals(stage, 'board nav');
    const nav = await E('N.navInfo()'); await scan(stage, 'nav', nav.join('\n'));
    for (const t of TABS) {
      const r = await E(`N.nav("${t}")`); await sleep(t === 'hideout' ? 2500 : 1200);
      await autoModals(stage, 'after ' + t + ' tab'); await pops(stage);
      if (r === 'absent' || /^locked/.test(r)) { rec.tabs[t] = r; continue; }
      let text = await E('N.txt(document.getElementById("app"),1)');
      if (t === 'shop') { text += '\n' + await E(`(function(){var o=[];[].forEach.call(document.querySelectorAll(".qs-tab"),function(b){b.click();o.push("[shop tab "+b.innerText+"] "+N.txt(document.getElementById("app"),1).slice(0,3000))});return o.join("\\n")})()`); await autoModals(stage, 'shop tabs'); }
      if (t === 'hall') { text += '\n' + await E(`(function(){var o=[];[].forEach.call(document.querySelectorAll(".htab button"),function(b){b.click();o.push("[hall tab "+b.innerText+"] "+N.txt(document.getElementById("app"),1).slice(0,4000))});return o.join("\\n")})()`); await autoModals(stage, 'hall tabs'); }
      if (t === 'trophy') { text += '\n' + await E(`(function(){var o=[];[].forEach.call(document.querySelectorAll(".dg-tab"),function(b){b.click();o.push("[relics tab "+b.innerText+"] "+N.txt(document.getElementById("app"),1))});return o.join("\\n")})()`); }
      if (t === 'hideout') { // each owned building's view, its Goals window
        const bl = await E(`(function(){var o=[];[].forEach.call(document.querySelectorAll('[data-act=bldgo]'),function(b){o.push(b.dataset.v)});return o})()`);
        for (const v of bl) { await E(`(function(){var b=document.querySelector('[data-act=bldgo][data-v="${v}"]');if(b)b.dispatchEvent(new MouseEvent('click',{bubbles:true}));return 1})()`); await sleep(2200); await autoModals(stage, 'building ' + v);
          text += `\n[building ${v}] ` + await E('N.txt(document.getElementById("app"),1)');
          const g = await E('(function(){var b=document.querySelector(".glbtn");if(!b)return "";b.click();var m=document.querySelectorAll("#layer .modal");return m.length?N.txt(m[m.length-1]):""})()'); if (g) { text += `\n[goals ${v}] ` + g; await E('N.closeAll()'); }
          await E(`(function(){var b=document.querySelector('[data-act=bldout]');if(b)b.dispatchEvent(new MouseEvent('click',{bubbles:true}));return 1})()`); await sleep(1200); } }
      rec.tabs[t] = text; await scan(stage, 'tab ' + t, text);
    }
    const ib = await E('(function(){var b=document.querySelector(".ibbtn");if(!b)return null;b.click();return 1})()');
    if (ib) { await sleep(800); let txt = (await E('N.modals()')).join('\n');
      const ids = await E('[].map.call(document.querySelectorAll("#layer .ibrow"),function(r){return r.dataset.id})');
      for (const id of ids) { await E(`(function(){var r=document.querySelector('#layer .ibrow[data-id="${id}"]');if(r)r.click();return 1})()`); await sleep(500); txt += `\n[letter ${id}] ` + (await E('N.modals()')).join('\n');
        await E('(function(){var b=document.querySelector("#layer [data-ib=list]");if(b)b.click();return 1})()'); await sleep(300); }
      rec.tabs.inbox = txt; await scan(stage, 'inbox', txt); await E('N.closeAll()'); }
    await E('N.nav("board")'); await sleep(500); await autoModals(stage, 'back to board');
    const rooms = (await E('N.state()')).rooms;
    for (const t of rooms) {
      await E(`N.room("${t}")`); await sleep(1100);
      rec.rooms[t] = (await E('N.modals()')).join('\n'); await scan(stage, 'room ' + t, rec.rooms[t]);
      const hp = await E('N.help()'); await sleep(300); if (hp) { rec.helps[t] = hp; await scan(stage, 'help ' + t, hp); }
      await E('N.closeAll()'); await pops(stage);
    }
    fs.appendFileSync(JL, JSON.stringify(rec) + '\n');
    log(`  (${stage}) hits so far: ${allHits.length}; page errors: ${pg.errs.length}`);
  }
  async function story(stage, label) { // one story step through the game's own check: the scene it opens, then yes
    await E('N.nav("board")'); await sleep(400); await E('N.nextDay()');
    const m = await E('N.check()'); await sleep(900);
    const uniq = [...new Set([].concat(m, await E('N.modals()')))];
    uniq.forEach((t) => log(`  [${stage}] ${label} window: ${t.replace(/\s+/g, ' ').slice(0, 500)}`));
    for (const t of uniq) await scan(stage, label + ' scene', t);
    const y = await E('N.yes()'); log(`  [${stage}] ${label}: yes -> ${y}`); await sleep(1300);
    await autoModals(stage, label + ' after yes'); await pops(stage); return uniq;
  }
  async function opener(stage, src, id, t) { // buy a room's opener upgrade through its card, else open it by hook
    await E('N.earn(60000)'); const got = await E(`N.buy("${src}","${id}")`); log(`  [${stage}] buy ${id}: ${got}`); await sleep(1300);
    await autoModals(stage, id + ' bought'); await pops(stage);
    if (!/^bought/.test(got)) log(`  [${stage}] opened ${t} by hook: ` + await pg.ev(`window.__ns3.open("${t}")`));
  }
  const ST = [
    ['a', 'a_fresh', async () => {}],
    ['b', 'b_lv2_bedroom', async () => { await levelTo('b_lv2_bedroom', 2); await E('N.earn(3000)'); await E('N.buyFirst("bedroom")'); await sleep(600); }],
    ['c', 'c_closet', async () => { await levelTo('c_closet', 4); await fillTo('bedroom', (await U('closet')).pct); await opener('c_closet', 'bedroom', 'bd_ward2', 'closet'); }],
    ['d', 'd_patio', async () => { await levelTo('d_patio', 5); await fillTo('bedroom', (await U('patio')).pct); await opener('d_patio', 'bedroom', 'bd_patio', 'patio'); }],
    ['e', 'e_gameroom', async () => { await levelTo('e_gameroom', 6); await fillTo('bedroom', (await U('gameroom')).pct); await opener('e_gameroom', 'bedroom', 'bd_game', 'gameroom'); }],
    ['f', 'f_lair', async () => { await levelTo('f_lair', 8); await fillTo('closet', 0.5); await opener('f_lair', 'closet', 'cl_lair', 'lair'); }],
    ['g', 'g_garden_no_restaurant', async () => { await levelTo('g_garden_no_restaurant', 10); for (const t of ['bedroom', 'closet', 'patio', 'gameroom']) await fillTo(t, 0.75);
      await story('g_garden_no_restaurant', 'garden step'); await E('N.earn(20000)'); log('  garden: ' + await pg.ev('window.__ns3.open("garden")')); await sleep(800);
      await pg.ev('(function(){var r=window.__qb.x().S.base.slots.filter(function(q){return q&&q.t==="garden"})[0];if(r)r.earn=200;return 1})()');
      await fillTo('garden', 0.6); /* the Garden's own upgrades bought before the Restaurant: their lines must not name the menu */ }],
    ['h', 'h_restaurant', async () => { await levelTo('h_restaurant', 12); const u = await U('restaurant');
      await pg.ev(`(function(){var r=window.__qb.x().S.base.slots.filter(function(q){return q&&q.t==="garden"})[0];if(r)r.earn=${u.coins};window.__qbStory.state().sold=999;return 1})()`);
      await fillTo('garden', 0.5); await story('h_restaurant', 'chef step'); await opener('h_restaurant', 'garden', 'gd_rest', 'restaurant'); }],
    ['i', 'i_lockkey', async () => { await levelTo('i_lockkey', 14); await fillTo('restaurant', 0.3); await E('N.setUps("restaurant",0,["r_noir"])');
      await story('i_lockkey', 'lockkey step'); if ((await E('N.state()')).rooms.indexOf('skybar') < 0) log('  skybar: ' + await pg.ev('window.__ns3.open("skybar")')); }],
    ['j', 'j_rafe_rooftop', async () => { await levelTo('j_rafe_rooftop', 16); await fillTo('skybar', (await U('rooftop')).pct); await story('j_rafe_rooftop', 'rafe/rooftop step');
      await story('j_rafe_rooftop', 'rooftop step'); await opener('j_rafe_rooftop', 'skybar', 'sb_roof', 'rooftop'); }],
    ['k', 'k_boba', async () => { await levelTo('k_boba', 18); await fillTo('skybar', (await U('boba')).pct); await story('k_boba', 'boba step');
      if ((await E('N.state()')).rooms.indexOf('boba') < 0) log('  boba: ' + await pg.ev('window.__ns3.open("boba")')); }],
    ['l', 'l_dessert_plaza_full', async () => { await levelTo('l_dessert_plaza_full', 19); await fillTo('boba', (await U('dessert')).pct); await story('l_dessert_plaza_full', 'dessert step');
      await opener('l_dessert_plaza_full', 'boba', 'bo_dess', 'dessert'); }],
    ['m', 'm_mall', async () => { await levelTo('m_mall', 21); for (const t of ['garden', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert']) await fillTo(t, 0.65);
      await story('m_mall', 'mall step'); if ((await E('N.state()')).rooms.indexOf('mall') < 0) log('  mall: ' + await pg.ev('window.__ns3.open("mall")')); }],
    ['n', 'n_nova_theater', async () => { await levelTo('n_nova_theater', 23); await E('N.setUps("mall",0,["ml_shop1"])'); await fillTo('mall', (await U('theater')).pct);
      await story('n_nova_theater', 'nova step'); await story('n_nova_theater', 'theater step'); if ((await E('N.state()')).rooms.indexOf('theater') < 0) log('  theater: ' + await pg.ev('window.__ns3.open("theater")')); }],
    ['o', 'o_auditorium_arcade', async () => { await levelTo('o_auditorium_arcade', 26); await fillTo('theater', (await U('auditorium')).pct); await story('o_auditorium_arcade', 'auditorium step');
      if ((await E('N.state()')).rooms.indexOf('auditorium') < 0) log('  auditorium: ' + await pg.ev('window.__ns3.open("auditorium")'));
      await fillTo('auditorium', (await U('arcade')).pct); await story('o_auditorium_arcade', 'arcade step'); await opener('o_auditorium_arcade', 'mall', 'ml_arc', 'arcade'); }],
  ];
  const FROM = process.env.FROM || 'a'; let go = false;
  for (const [k, stage, fn] of ST) {
    if (k === FROM) go = true; if (!go) continue; if (process.env.STOP && k > process.env.STOP) break;
    log(`-- stage ${stage}`);
    try { await fn(); } catch (e) { log(`  STEP ERROR ${stage}: ${e.message}`); }
    await sleep(600); await pops(stage);
    try { await capture(stage); } catch (e) { log(`  CAPTURE ERROR ${stage}: ${e.message}`); }
  }
  fs.writeFileSync(OUT + '/hits.json', JSON.stringify(allHits, null, 1));
  // one line per distinct hit (where it first shows, the word, its context)
  const seen = new Map(); allHits.forEach((h) => { const key = h.kind + '|' + h.key + '|' + h.ctx.replace(/\d+/g, '#'); if (!seen.has(key)) seen.set(key, h); });
  log(`DONE: ${allHits.length} hits, ${seen.size} distinct; page errors ${pg.errs.length}: ${pg.errs.slice(0, 4).join(' | ')}`);
  [...seen.values()].forEach((h) => log(`  ${h.where} | ${h.kind}:${h.key} | "${h.word}" | ${h.ctx.slice(0, 200)}`));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); try { fs.appendFileSync(LOG, 'FAIL ' + e.stack + '\n'); } catch (x) {} process.exit(1); });
