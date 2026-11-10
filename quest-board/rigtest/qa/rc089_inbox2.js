// rc089 QA, Inbox W7/W19 part 2.
// A: the envelope on every screen (Board, Training, Loft, Shop, Hall, Relics, Wheel, Crawls) with its unread count: the adv2 save
//    with the welcome letter unread and its opening already used (S.letters.popped), so the count shows.
// B: a brand-new player through the character creator (name, Continue, Begin): the welcome letter opens once, pays once, reloads.
const L = require('./rc089_train_lib.js');
const { sleep } = L;
const D = L.OUT + '/inbox/';
const log = (...a) => console.log(...a);
const VIEWS = [['board', 'Board'], ['train', 'Training'], ['hideout', 'Loft'], ['shop', 'Shop'], ['hall', 'Hall'], ['trophy', 'Relics'], ['wheel', 'Wheel'], ['away', 'Crawls']];
const env = (pg) => pg.ev(`(function(){var b=document.querySelector('.strip .ibbtn');if(!b)return {present:false};var r=b.getBoundingClientRect(),cs=getComputedStyle(b);var p=b.previousElementSibling,pr=p&&p.getBoundingClientRect(),c=document.querySelector('.strip .coinpill'),cr=c&&c.getBoundingClientRect();
  return {present:true,visible:r.width>0&&cs.visibility!=='hidden'&&cs.display!=='none',count:(b.querySelector('i')||{}).textContent||'',aria:b.getAttribute('aria-label'),prev:p&&p.className+'('+p.textContent.trim()+')',gapToPrev:pr?Math.round(r.left-pr.right):null,sameRowAsCoins:cr?Math.abs(Math.round(r.top-cr.top))<20:null,rect:Math.round(r.left)+','+Math.round(r.top)+' '+Math.round(r.width)+'x'+Math.round(r.height)}})()`);
const watch = async (pg, ms) => { const t0 = Date.now(), seen = []; let n = 0, at = null;
  while (Date.now() - t0 < ms) { await sleep(1500); const m = await L.modalInfo(pg);
    if (m.some((x) => /ibox/.test(x.card))) { n++; at = Date.now() - t0; return { n, at, seen }; }
    m.forEach((x) => seen.push(x.card.replace('card box2 ', '') + ': ' + x.text.slice(0, 40))); if (m.length) await L.closeAll(pg); }
  return { n, at, seen }; };
const st = (pg) => L.S(pg, `JSON.stringify({coins:S.coins,created:S.created,welcomed:S.welcomed,letters:S.letters,inbox:S.inbox})`).then(JSON.parse);
(async () => {
  const br0 = await require('./cdp.js').browser();
  if (!process.env.ONLY || process.env.ONLY === 'A') {
    const sd = L.seed('seed_adv2'), s = JSON.parse(sd['quest-board']);
    s.letters = { read: {}, paid: {}, at: {}, popped: 1 }; sd['quest-board'] = sd['qbsbx:data/users/sandbox/state'] = JSON.stringify(s);
    const { br, pg } = await L.openGame(sd);
    await L.settle(pg, null, 12);
    for (const [v, name] of VIEWS) {
      await L.closeAll(pg); await L.nav(pg, v); await sleep(1800); await L.closeAll(pg);
      await pg.ev('window.scrollTo(0,0)'); await sleep(300);
      const e = await env(pg); log('A', name.padEnd(8), JSON.stringify(e));
      await pg.ev(`(function(){var s=document.querySelector('.strip');if(s)s.id='qa_strip';return 1})()`);
      await L.shotEl(pg, '#qa_strip', D + 'envelope_' + v + '.png', 0, 4);
    }
    // open from the Loft screen with a real tap: the list, the unread dot, the letter; the count clears everywhere
    await L.nav(pg, 'hideout'); await sleep(1500); await L.closeAll(pg); await pg.ev('window.scrollTo(0,0)');
    await L.tapEl(pg, '.strip .ibbtn'); await sleep(900);
    log('A list from the Loft', JSON.stringify(await pg.ev(`[].map.call(document.querySelectorAll('#layer .modal .ibrow'),function(r){return r.dataset.id+(r.classList.contains('un')?' (unread dot)':'')+': '+r.innerText.replace(/\\s+/g,' ')})`)));
    await pg.shot(D + 'A_list_unread.png');
    await L.tapEl(pg, '#layer .modal .ibrow[data-id="welcome"]'); await sleep(900);
    log('A letter opened; envelope now', JSON.stringify(await env(pg)));
    await L.closeAll(pg);
    for (const [v, name] of [['board', 'Board'], ['wheel', 'Wheel']]) { await L.nav(pg, v); await sleep(1200); await L.closeAll(pg); log('A after reading,', name, JSON.stringify(await env(pg))); }
    log('A page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 6)));
    await pg.close();
  }
  if (!process.env.ONLY || process.env.ONLY === 'B') {
    const { br, pg } = await L.openGame(null, { waitFor: '!!document.getElementById("ccname")' });
    log('B fresh profile, creator shown; S.created =', await L.S(pg, 'S.created'), 'envelope before creating:', JSON.stringify(await env(pg)));
    await L.tapEl(pg, '#ccname'); await pg.s('Input.insertText', { text: 'Quinn' }); await sleep(300);
    await L.tapEl(pg, 'button[data-act=ccnext]'); await sleep(2500);
    await pg.wait('!!document.querySelector("button[data-act=ccdone]")', 30000);
    await pg.shot(D + 'B_creator.png');
    await L.tapEl(pg, 'button[data-act=ccdone]');
    const c0 = await st(pg); log('B after Begin', JSON.stringify({ created: c0.created, coins: c0.coins, letters: c0.letters, welcomed: c0.welcomed }));
    const w = await watch(pg, 60000);
    log('B welcome letter opened by itself:', w.n === 1, 'after ms', w.at, 'other windows first', JSON.stringify(w.seen));
    await pg.shot(D + 'B_letter.png');
    const c1 = await st(pg);
    const cb = await L.tapEl(pg, '#layer .modal [data-ib=claim]'); await pg.tap(cb.x, cb.y); await sleep(1200);
    const c2 = await st(pg); log('B claim tapped twice: coins', c1.coins, '->', c2.coins, '(delta', c2.coins - c1.coins + ')', 'paid', JSON.stringify(c2.letters.paid));
    await L.closeAll(pg);
    log('B envelope', JSON.stringify(await env(pg)));
    for (let r = 1; r <= 2; r++) {
      await sleep(800);
      await pg.go(L.BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x && document.querySelector(".nav"))', 120000);
      const w2 = await watch(pg, 30000); const c = await st(pg);
      log('B reload ' + r + ': letter opened again?', w2.n > 0, '| coins delta since claim', c.coins - c2.coins, '| letters', JSON.stringify(c.letters), '| other windows', JSON.stringify(w2.seen));
      await L.closeAll(pg);
    }
    log('B S.inbox', JSON.stringify((await st(pg)).inbox));
    log('B page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 6)));
  }
  await br0.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
