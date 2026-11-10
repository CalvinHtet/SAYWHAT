// rc089 QA, Inbox W7/W19 part 1: the old adv2 save (v0.88, already welcomed, no S.letters). Does the welcome letter open by itself
// once, pay 3,000 once (real taps, a second claim, a forged claim button, reloads), leave S.inbox alone, read without "Coming soon",
// and keep the roadmap hidden? CLOSE=1: close the letter unclaimed first, reload, then claim it from the inbox.
const L = require('./rc089_train_lib.js');
const { sleep } = L;
const TAG = process.env.CLOSE ? 'adv2_closefirst' : 'adv2';
const D = L.OUT + '/inbox/' + TAG + '_';
const log = (...a) => console.log(...a);
const st = (pg) => L.S(pg, `JSON.stringify({coins:S.coins,earnedC:S.earnedC,welcomed:S.welcomed,letters:S.letters,inbox:S.inbox})`).then(JSON.parse);
const env = (pg) => pg.ev(`(function(){var b=document.querySelector('.strip .ibbtn');if(!b)return null;return {aria:b.getAttribute('aria-label'),count:(b.querySelector('i')||{}).textContent||'',prev:(b.previousElementSibling||{}).className}})()`);
// watch for windows for up to ms: close any that is not the welcome letter; return when the letter shows (or not)
async function watch(pg, ms) {
  const t0 = Date.now(), seen = []; let letter = null, letters = 0;
  while (Date.now() - t0 < ms) {
    await sleep(1500);
    const m = await L.modalInfo(pg);
    for (const x of m) {
      if (/ibox/.test(x.card)) { letter = letter || { atMs: Date.now() - t0, text: x.text }; letters++; }
      else seen.push(x.card.replace('card box2 ', '') + ': ' + x.text.slice(0, 50));
    }
    if (m.some((x) => /ibox/.test(x.card))) return { letter, seen, letters };
    if (m.length) await L.closeAll(pg);
  }
  return { letter, seen, letters };
}
const fake = (pg) => pg.ev(`(function(){var b=document.createElement('button');b.dataset.ib='claim';b.dataset.id='welcome';document.body.appendChild(b);b.click();b.remove();return 1})()`);
(async () => {
  const { br, pg } = await L.openGame(L.seed('seed_adv2'));
  // CLOSE run: the owner's quest inbox (S.inbox, 30_app_b.js checkInbox) holds two items, to see that the letters never touch it
  if (process.env.CLOSE) await L.S(pg, `(function(){S.inbox={qa_item1:1,qa_item2:1};x.persist();return 1})()`);
  const s0 = await st(pg); log('LOADED', JSON.stringify(s0));
  let w = await watch(pg, 90000);
  log('FIRST LOAD: letter', JSON.stringify(w.letter && { atMs: w.letter.atMs }), 'other windows before it', JSON.stringify(w.seen));
  if (!w.letter) { log('NO WELCOME LETTER on first load'); }
  await pg.shot(D + '01_letter_popped.png');
  const body = await pg.ev(`(function(){var m=document.querySelector('#layer .modal .ibox');return m?{text:m.innerText,claim:(m.querySelector('[data-ib=claim]')||{}).textContent||null}:null})()`);
  log('letter claim button', body && body.claim, '| "coming soon" in letter:', body && /coming soon/i.test(body.text), '| challenge line:', body && (body.text.match(/Challenge a friend[^\n]*/) || [''])[0]);
  const s1 = await st(pg); log('after the letter opened', JSON.stringify({ coins: s1.coins - s0.coins, letters: s1.letters, welcomed: s1.welcomed }), 'envelope', JSON.stringify(await env(pg)));
  if (process.env.CLOSE) {
    await L.tapEl(pg, '#layer .modal .mx'); await sleep(800);
    log('closed unclaimed; coins delta', (await st(pg)).coins - s0.coins);
    await pg.go(L.BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x && document.querySelector(".nav"))', 120000);
    w = await watch(pg, 40000); log('RELOAD after closing unclaimed: letter popped again?', !!w.letter, JSON.stringify(w.seen));
    await L.closeAll(pg);
    log('envelope', JSON.stringify(await env(pg)));
    await L.tapEl(pg, '.strip .ibbtn'); await sleep(800);
    log('inbox list', JSON.stringify(await pg.ev(`[].map.call(document.querySelectorAll('#layer .modal .ibrow'),function(r){return r.dataset.id+': '+r.innerText.replace(/\\s+/g,' ')+(r.classList.contains('un')?' (unread)':'')})`)));
    await pg.shot(D + '02_list.png');
    await L.tapEl(pg, '#layer .modal .ibrow[data-id="welcome"]'); await sleep(800);
  }
  // claim with a real tap, then tap the same spot again at once
  const cb = await L.tapEl(pg, '#layer .modal [data-ib=claim]'); await pg.tap(cb.x, cb.y); await sleep(1200);
  const s2 = await st(pg); log('CLAIM tapped twice: coins delta', s2.coins - s0.coins, 'paid', JSON.stringify(s2.letters.paid), 'earnedC delta', s2.earnedC - s0.earnedC);
  await pg.shot(D + '03_claimed.png');
  log('letter now shows', JSON.stringify(await pg.ev(`(function(){var m=document.querySelector('#layer .modal .ibox');return m?m.innerText.replace(/\\s+/g,' ').slice(-120):null})()`)));
  await fake(pg); await sleep(600);
  log('forged claim click: coins delta', (await st(pg)).coins - s0.coins);
  // back to the list and into the letter again
  await L.tapEl(pg, '#layer .modal .ibback'); await sleep(600);
  const rows = await pg.ev(`[].map.call(document.querySelectorAll('#layer .modal .ibrow'),function(r){return r.dataset.id+': '+r.innerText.replace(/\\s+/g,' ')})`);
  log('INBOX LIST', JSON.stringify(rows), '| roadmap shown:', rows.some((r) => /roadmap/i.test(r)));
  await pg.shot(D + '04_list_after.png');
  await L.tapEl(pg, '#layer .modal .ibrow[data-id="welcome"]'); await sleep(600);
  log('reopened letter has a Claim button:', await pg.ev(`!!document.querySelector('#layer .modal [data-ib=claim]')`));
  await L.closeAll(pg);
  await sleep(1000);
  // two reloads: no second opening, no second payment
  for (let r = 1; r <= 2; r++) {
    await pg.go(L.BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x && document.querySelector(".nav"))', 120000);
    w = await watch(pg, 35000);
    await fake(pg); await sleep(600);
    const s = await st(pg);
    log('RELOAD ' + r + ': letter popped again?', !!w.letter, '| coins delta', s.coins - s0.coins, '| letters', JSON.stringify(s.letters), '| envelope', JSON.stringify(await env(pg)), '| other windows', w.seen.length);
    await L.closeAll(pg);
  }
  const s9 = await st(pg);
  log('S.inbox before', JSON.stringify(s0.inbox), 'after', JSON.stringify(s9.inbox), 'unchanged:', JSON.stringify(s0.inbox) === JSON.stringify(s9.inbox));
  log('cloud copy (sandbox db) letters', await pg.ev(`(function(){try{return JSON.stringify(JSON.parse(localStorage.getItem('qbsbx:data/users/sandbox/state')).letters)}catch(e){return 'n/a'}})()`));
  log('page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 6)));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
