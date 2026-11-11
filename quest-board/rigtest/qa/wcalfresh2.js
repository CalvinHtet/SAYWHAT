// Cal's fresh start: what is saved right after the wipe and what a reload brings back (the stand-in for his uid set before the app starts).
// A. right after the wipe: the device AND the online save should both be the new player (created=false is fine)
// R. a reload BEFORE the creator is finished: still the new player (not his old profile)
// B/C. the creator finished, then a reload: "Cal", level 1, kept
// E. his old save comes back on top (another device's old copy wins) while the backup exists: it is wiped again, not just flagged
// F. offline at the wipe (the online write lost): a reload back online wipes the old save again, the first backup kept
// G. a second device holding the old save (older): the new online save loads. H. that device played the old save after the wipe
//    (newer, and its own device has no backup): it is wiped again; the online backup is the first one (never overwritten)
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/';
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8816';
const ST = `(function(){var f=function(k){var v=JSON.parse(localStorage.getItem(k)||'null');return v?{created:!!v.created,name:v.char&&v.char.name,coins:Math.floor(v.coins||0),rooms:((v.base&&v.base.slots)||[]).filter(Boolean).length,calfresh91:!!v.calfresh91,joinedAt:!!v.joinedAt,savedAt:v.savedAt}:null};
  var S=window.__qb&&window.__qb.x&&window.__qb.x().S;return {S:S?{created:!!S.created,name:S.char&&S.char.name,coins:Math.floor(S.coins||0),rooms:S.base.slots.filter(Boolean).length,calfresh91:S.calfresh91||null,joinedAt:!!S.joinedAt,reset91:S.reset91&&(S.reset91.refund+'/'+(S.reset91.fresh?'fresh':'')+(S.reset91.cal?'+cal':''))}:null,device:f('quest-board'),online:f('qbsbx:data/users/sandbox/state'),backup:(localStorage.getItem('quest-board-backup-calfresh91')||'').length}})()`;
(async () => {
  const br = await browser();
  const seed = JSON.parse(fs.readFileSync(SEEDS + 'v90_mid.json', 'utf8'));
  const pg = await br.page({ fresh: true });
  await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: 'window.__qbCfUid="sandbox";' });
  await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
  await pg.go(BASE + '/'); await sleep(9000);
  console.log('A. right after the wipe (creator on screen):', JSON.stringify(await pg.ev(ST)));
  await pg.go(BASE + '/'); await sleep(8000);
  console.log('R. a reload before the creator is finished:', JSON.stringify(await pg.ev(ST)));
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Cal',sex:'m'});x.persist();x.render();return 1})()`); await sleep(2500);
  console.log('B. creator finished:', JSON.stringify(await pg.ev(ST)));
  await pg.go(BASE + '/'); await sleep(8000);
  console.log('C. after a reload:', JSON.stringify(await pg.ev(ST)));
  // E: his old save back on both copies (another device's older copy saved over it), the device backup still there
  await pg.ev(`(function(d){var old=d['quest-board'];var o=JSON.parse(old);o.savedAt=Date.now()+5000;var s=JSON.stringify(o);localStorage.setItem('quest-board',s);localStorage.setItem('qbsbx:data/users/sandbox/state',s);return 1})(${JSON.stringify(seed)})`);
  await pg.go(BASE + '/'); await sleep(9000);
  console.log('E. the old save back on top, backup present:', JSON.stringify(await pg.ev(ST)));
  const firstBackup = await pg.ev('localStorage.getItem("quest-board-backup-calfresh91")');
  console.log('page errors', pg.errs.length, pg.errs.slice(0, 2)); await pg.close();
  // F. offline at the wipe: the online write never landed, so online is still the old save and the device has the new (not made) one
  const old = JSON.parse(seed['quest-board']);
  const runCase = async (label, setup) => {
    const p = await br.page({ fresh: true });
    await p.s('Page.addScriptToEvaluateOnNewDocument', { source: 'window.__qbCfUid="sandbox";' });
    await p.go(BASE + '/version.json'); await p.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
    await p.go(BASE + '/'); await sleep(9000);
    const wiped = await p.ev('localStorage.getItem("quest-board")');
    await p.ev(setup(wiped));
    await p.go(BASE + '/'); await sleep(9000);
    const r = await p.ev(ST), bk = await p.ev('localStorage.getItem("quest-board-backup-calfresh91")');
    const on = await p.ev('(function(){var b=JSON.parse(localStorage.getItem("qbsbx:data/users/sandbox/backup_calfresh91")||"null");return b?{coins:Math.floor(b.coins),rooms:(b.base.slots||[]).filter(Boolean).length,joinedAt:!!b.joinedAt}:null})()');
    const keptTraining = await p.ev('(function(){var S=window.__qb.x().S;return {gym:Object.keys(S.gymlog||{}).length,sessions:(S.sessions||[]).length}})()');
    console.log(`${label}: now ${r.S.created ? 'MADE ' + r.S.name : 'the creator'}, ${r.S.coins} coins, ${r.S.rooms} room(s), device ${r.device && r.device.coins}/${r.device && r.device.rooms}, online ${r.online && r.online.coins}/${r.online && r.online.rooms}`,
      '| device backup = the first old save:', bk === firstBackup, '| online backup:', JSON.stringify(on), '| errors', p.errs.length);
    await p.close(); };
  await runCase('F. offline at the wipe (online still old, device new), back online and reload', (w) => `(function(){localStorage.setItem('qbsbx:data/users/sandbox/state',${JSON.stringify(seed['qbsbx:data/users/sandbox/state'])});return 1})()`);
  // G. a second device that still holds the old save (older than the wipe): the new online save wins
  await runCase('G. second device with the old save (older than the wipe)', (w) => `(function(){var o=JSON.parse(${JSON.stringify(seed['quest-board'])});o.savedAt=1;localStorage.setItem('quest-board',JSON.stringify(o));return 1})()`);
  // H. a second device that played its old save offline after the wipe (newer): that old save loads and is wiped again
  await runCase('H. second device played the old save after the wipe (newer)', (w) => `(function(){var o=JSON.parse(${JSON.stringify(seed['quest-board'])});o.savedAt=Date.now()+60000;o.coins+=111;localStorage.setItem('quest-board',JSON.stringify(o));localStorage.removeItem('quest-board-backup-calfresh91');return 1})()`);
  await br.close(); process.exit(0);
})();
