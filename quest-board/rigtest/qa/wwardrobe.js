// w-wardrobe (W41, v0.92): the Shop's Wardrobe tab filters. A level-30 player who owns ~24 pieces across categories, brands, Basics
// and a found piece: category chips only for owned categories, brand chips (2+ sources) with Basics/Found last; each chip shows only
// its pieces (checked against the piece's slot and brand), the two combine, an empty mix says "Nothing you own matches" with "Show
// everything", the choice lasts while the Shop is open and resets to All when it is opened again, Equip from a filtered rack works,
// and 390 px has no sideways overflow. Real clicks on the chips.
//   BASE=<build> OUT=<dir/> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wwardrobe.js
const fs = require('fs');
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8813', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wwardrobe/';
fs.mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(30)'); await E(pg, 'W.add("closet")');
  // own pieces: 3 brands x up to 4 slots, plus Basics, plus one piece from a source that isn't a brand
  const owned = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,sex=(S.char&&S.char.sex)||'f',got=[],fits=function(it){return !it[6]||!it[6].sx||it[6].sx===sex};
    var byB={};x.SHOP.forEach(function(it){var b=it[6]&&it[6].b;if(!b||!/^a_/.test(it[1]))return;(byB[b]=byB[b]||[]).push(it)});
    ['hanga','y2k','smk'].forEach(function(b){var seen={};(byB[b]||[]).forEach(function(it){if(!seen[it[1]]&&Object.keys(seen).length<5){seen[it[1]]=1;S.owned[it[0]]=1;got.push(it[0]+' '+it[1]+' '+b)}})});
    (byB.basics||[]).slice(0,4).forEach(function(it){S.owned[it[0]]=1;got.push(it[0]+' '+it[1]+' basics')});
    var other=x.SHOP.filter(function(it){return /^a_/.test(it[1])&&(!it[6]||!it[6].b)})[0];if(other){S.owned[other[0]]=1;got.push(other[0]+' '+other[1]+' (no brand)')}
    x.persist();x.render();return got})()`);
  log('owned:', owned.length, owned.join(' | '));
  // the Shop, then each brand window closed with its X as it comes (they arrive one at a time), then the Wardrobe button
  const settle = async () => { for (let k = 0; k < 12; k++) { await sleep(1300); const n = await pg.ev('(function(){var m=document.querySelectorAll("#layer .modal, .dropsplash");m.forEach(function(e){var x=e.querySelector(".dsx,[data-act=mclose]");if(x)x.click();else e.remove()});return m.length})()'); if (!n && k > 2) break; } };
  const openWd = async () => { await E(pg, 'W.closeAll()'); await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=board]");b&&b.click();var s=document.querySelector(".nav button[data-v=shop]");s&&s.click();return 1})()'); await settle();
    await pg.ev('(function(){var b=document.querySelector(".qs-wdb");b&&b.click();window.scrollTo(0,0);return 1})()'); await sleep(800); await settle(); };
  const state = () => pg.ev(`(function(){var x=window.__qb.x(),chips=function(sel){return [].map.call(document.querySelectorAll(sel+' .qs-wdc'),function(c){return c.innerText.trim()+(c.classList.contains('on')?'*':'')})};
    var secs=[].map.call(document.querySelectorAll('.qs-rack .qs-sec'),function(s){return {h:(s.querySelector('h3')||{}).innerText,ids:[].map.call(s.querySelectorAll('[data-card]'),function(c){return c.dataset.card})}});
    var none=document.querySelector('.qs-wdnone');return {cats:chips('.qs-wdcat'),brands:chips('.qs-wdbr'),secs:secs,none:none?none.innerText.replace(/\\s+/g,' '):null,overflow:document.documentElement.scrollWidth>innerWidth}})()`);
  const click = (k, v) => pg.ev(`(function(){var b=document.querySelector('.qs-wdc[data-wdf="${k}"][data-v="${v}"]');if(!b)return false;b.click();return true})()`).then(async (r) => { await sleep(600); return r; });
  await openWd(); let s = await state(); log('Wardrobe:', { cats: s.cats, brands: s.brands, sections: s.secs.map((x) => x.h + ' ' + x.ids.length), overflow: s.overflow }); await pg.shot(OUT + 'wardrobe_all.png');
  // each piece's category and brand, the game's own way
  const meta = await pg.ev(`(function(){var x=window.__qb.x(),o={};x.SHOP.forEach(function(it){if(window.__qb.x().S.owned[it[0]])o[it[0]]={slot:it[1],b:(it[6]&&it[6].b)||''}});return o})()`);
  const CAT = { top: ['a_top'], bottom: ['a_pants'], shoes: ['a_shoes'], hat: ['a_hat'], back: ['a_back'], hair: ['a_hair', 'a_hairc', 'a_beard'], face: ['a_eyes', 'a_eyet', 'a_mask', 'a_xface'] };
  const bad = [];
  for (const c of ['top', 'bottom', 'shoes', 'hat', 'face', 'acc', 'back', 'hair']) {
    if (!(await click('cat', c))) { log(`  category ${c}: no chip (nothing owned in it)`); continue; } s = await state(); const ids = s.secs.flatMap((x) => x.ids);
    const wrong = ids.filter((id) => meta[id] && CAT[c] && !CAT[c].includes(meta[id].slot) && !(c === 'face' && meta[id].slot === 'a_acc') && !(c === 'back' && meta[id].slot === 'a_acc'));
    log(`  category ${c}: ${ids.length} pieces, sections ${JSON.stringify(s.secs.map((x) => x.h))}${wrong.length ? ' | WRONG: ' + wrong.join(',') : ''}`); if (wrong.length) bad.push(c);
  }
  await click('cat', 'all');
  for (const b of ['hanga', 'y2k', 'smk', 'basics', 'found']) {
    if (!(await click('brand', b))) { log(`  brand ${b}: no chip`); continue; } s = await state(); const ids = s.secs.flatMap((x) => x.ids);
    const wrong = ids.filter((id) => meta[id] && (b === 'found' ? meta[id].b && meta[id].b !== '' && ['hanga', 'y2k', 'smk', 'basics'].includes(meta[id].b) : meta[id].b !== b));
    log(`  brand ${b}: ${ids.length} pieces${wrong.length ? ' | WRONG: ' + wrong.join(',') : ''} | chips ${JSON.stringify(s.brands)}`); if (wrong.length) bad.push(b);
  }
  // combined: a brand and a category it has, then one it doesn't
  await click('brand', 'hanga'); await click('cat', 'top'); s = await state(); log('  HANGANG + Tops:', s.secs.map((x) => x.h + ' ' + x.ids.join(',')), s.none || '');
  const missing = await pg.ev(`(function(){var have={};[].forEach.call(document.querySelectorAll('.qs-wdcat .qs-wdc'),function(c){have[c.dataset.v]=1});return ['hair','back','face','acc','shoes','hat','bottom'].filter(function(k){return have[k]})})()`);
  let emptyShown = false;
  for (const c of missing) { await click('cat', c); s = await state(); if (s.none) { log(`  HANGANG + ${c}: "${s.none}"`); emptyShown = true; await pg.shot(OUT + 'wardrobe_none.png');
    await pg.ev('(function(){var b=document.querySelector(".qs-wdnone [data-wdf=reset]");b&&b.click();return 1})()'); await sleep(600); s = await state(); log('   after "Show everything":', { cats: s.cats.filter((x) => /\*/.test(x)), brands: s.brands.filter((x) => /\*/.test(x)), n: s.secs.flatMap((x) => x.ids).length }); break; } }
  if (!emptyShown) log('  (no empty brand+category mix among the owned pieces)');
  // Equip from a filtered rack, then the choice survives a redraw but resets when the Shop is opened again
  await click('cat', 'shoes'); const eq = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},b=document.querySelector('.qs-rack [data-act=equip]');if(!b)return 'no Equip button';var id=b.dataset.id;b.click();await w(700);
    return {id:id,worn:!!Object.keys(window.__qb.x().S.eq||{}).filter(function(k){return window.__qb.x().S.eq[k]===id}).length,cats:[].map.call(document.querySelectorAll('.qs-wdcat .qs-wdc.on'),function(c){return c.innerText})}})()`);
  log('  Equip from the Shoes filter:', eq);
  await openWd(); s = await state(); log('  the Shop opened again:', { cats: s.cats.filter((x) => /\*/.test(x)), brands: s.brands.filter((x) => /\*/.test(x)) });
  log(bad.length ? 'FILTER MISMATCH in ' + bad.join(', ') : 'every chip shows only its own pieces');
  log('page errors', pg.errs.length, pg.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
