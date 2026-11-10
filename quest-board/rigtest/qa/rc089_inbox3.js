// rc089 QA, Inbox W7 part 3: is the envelope really visible and tappable on every screen? For each screen: a screenshot of the top of
// the viewport, the envelope's box, what element sits on top at its centre (elementFromPoint), and which ancestor hides it if any.
// Then a real tap on it where it is reachable.
const L = require('./rc089_train_lib.js');
const { sleep } = L;
const D = L.OUT + '/inbox/top_';
const log = (...a) => console.log(...a);
const VIEWS = [['board', 'Board'], ['train', 'Training'], ['hideout', 'Loft'], ['shop', 'Shop'], ['hall', 'Hall'], ['trophy', 'Relics'], ['wheel', 'Wheel'], ['away', 'Crawls']];
(async () => {
  const sd = L.seed('seed_adv2'), s = JSON.parse(sd['quest-board']);
  s.letters = { read: {}, paid: {}, at: {}, popped: 1 }; sd['quest-board'] = sd['qbsbx:data/users/sandbox/state'] = JSON.stringify(s);
  const { br, pg } = await L.openGame(sd);
  await L.settle(pg, null, 12);
  for (const [v, name] of VIEWS) {
    await L.closeAll(pg); await L.nav(pg, v); await sleep(2000); await L.closeAll(pg);
    await pg.ev('window.scrollTo(0,0)'); await sleep(400);
    const r = await pg.ev(`(function(){var b=document.querySelector('.ibbtn');if(!b)return {present:false};var r=b.getBoundingClientRect();var hid=null;for(var e=b;e&&e!==document.body;e=e.parentElement){var cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity===0){hid=(e.className||e.tagName)+' display='+cs.display+' vis='+cs.visibility+' op='+cs.opacity;break}}
      var top=r.width?document.elementFromPoint(r.left+r.width/2,r.top+r.height/2):null;var onTop=!!(top&&(top===b||b.contains(top)));
      var strip=document.querySelector('.strip'),sr=strip&&strip.getBoundingClientRect();
      return {present:true,count:(b.querySelector('i')||{}).textContent||'',rect:Math.round(r.left)+','+Math.round(r.top)+' '+Math.round(r.width)+'x'+Math.round(r.height),hiddenBy:hid,onTopAtCentre:onTop,topElement:top?(top.tagName+'.'+String(top.className).slice(0,40)):null,strip:sr?Math.round(sr.top)+' h'+Math.round(sr.height):null,
        plus:!!document.querySelector('.strip .kdbtn'),viewClass:document.body.className.slice(0,80)}})()`);
    log(name.padEnd(8), JSON.stringify(r));
    await pg.shot(D + v + '.png', { x: 0, y: 0, width: 390, height: 260 });
  }
  // a real tap on the envelope on each screen where it is on top
  for (const [v, name] of VIEWS) {
    await L.closeAll(pg); await L.nav(pg, v); await sleep(1500); await L.closeAll(pg); await pg.ev('window.scrollTo(0,0)'); await sleep(300);
    const c = await pg.ev(`(function(){var b=document.querySelector('.ibbtn');if(!b)return null;var r=b.getBoundingClientRect();return r.width?{x:r.left+r.width/2,y:r.top+r.height/2}:null})()`);
    if (!c) { log('tap', name, ': no box to tap'); continue; }
    await pg.tap(c.x, c.y); await sleep(900);
    const m = await L.modalInfo(pg);
    log('tap', name.padEnd(8), 'opened:', JSON.stringify(m.map((x) => x.card + ': ' + x.text.slice(0, 50))));
    await L.closeAll(pg);
  }
  log('page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 6)));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
