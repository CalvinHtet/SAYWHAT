// The six visitor animations (Cal via ROOMS, 2026-11-14) worn by every friend (29k_friends.js) and every team member (their room look
// with the signature top, as 26_world.js builds it), drawn by the game's own rig at HI x the room frame: idle, then both keys of wave,
// laugh, dance, chat, cheer and clap. A row per person; a red NOT DRAWN cell if a frame fails.
//   ONLY=Kenan,Vega limits it to names starting with these.   BASE=<server of quest-board/> OUT=<png> NODE_PATH=<playwright's parent> node rigtest/lead/emotesheet.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8766', OUT = process.env.OUT || 'emotesheet.png', HI = +process.env.HI || 1.5;
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qbFriends && window.QBLoft && QBLoft.data && window.QBDATA && window.QBRig && window.__qbTeam, null, { timeout: 120000 }); await p.waitForTimeout(1200); if (process.env.ONLY) await p.evaluate((o) => { window.__ONLY = o; }, process.env.ONLY);
  const r = await p.evaluate(async (HI) => { const Q = window.QBDATA, { clips, ...poses } = Q.poses, D = QBLoft.data;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips,
      assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const who = [], FR = window.__qbFriends.friends; Object.keys(FR).forEach((id) => who.push({ name: FR[id].name, ch: window.__qbFriends.look(FR[id].spec).rig }));
    const TMTOP = { rafe: 'tm_rafe_jacket', theo: 'tm_theo_tee', nova: 'tm_nova_knit', sable: 'tm_sable_jacket' }, T = window.__qbTeam.TEAM;
    Object.keys(T).forEach((id) => { const L = T[id].look || {}, eq = [], sig = TMTOP[id] && D.items[TMTOP[id]] ? TMTOP[id] : null; Object.keys(L.equipped || {}).forEach((s) => { const e = L.equipped[s]; if (e && e.art && !(sig && s === 'top')) eq.push(e.art); }); if (sig) eq.push(sig);
      try { const npc = window.__qb.x().rsNpc ? window.__qb.x().rsNpc({ body: L.body || 'm', hairStyle: L.hairStyle || 'h1', hairColor: L.hairColor || 'brown', eq }) : null; if (npc && npc.rig) who.push({ name: T[id].name + ' (team)', ch: npc.rig }); else who.push({ name: T[id].name + ' (team)', ch: window.__qbFriends.look({ body: L.body || 'm', skin: L.skin || 's2', hairStyle: L.hairStyle || 'h1', hairColor: L.hairColor || 'brown', eq }).rig }); } catch (e) { who.push({ name: T[id].name + ' (team) ERR ' + e.message, ch: null }); } });
    const ONLY = (window.__ONLY || '').split(',').filter(Boolean); if (ONLY.length) { const keep = who.filter((x) => ONLY.some((o) => x.name.indexOf(o) === 0)); who.length = 0; keep.forEach((x) => who.push(x)); }
    const cols = [['idle', 'idle', 0]]; ['wave', 'laugh', 'dance', 'chat', 'cheer', 'clap'].forEach((c) => { cols.push([c + ' 1', c, 0]); cols.push([c + ' 2', c, 4]); });
    const cw = Math.round(100 * HI), chh = Math.round(128 * HI), top = 30, left = 150;
    const cv = document.createElement('canvas'); cv.width = left + cols.length * cw; cv.height = top + who.length * chh; const g = cv.getContext('2d');
    g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = '#fff'; g.font = 'bold 13px sans-serif'; cols.forEach((c, i) => g.fillText(c[0], left + i * cw + 6, 20));
    let bad = 0;
    for (let w = 0; w < who.length; w++) { g.fillStyle = '#fff'; g.font = 'bold 14px sans-serif'; g.fillText(who[w].name.slice(0, 18), 6, top + w * chh + chh / 2);
      for (let i = 0; i < cols.length; i++) { const x = left + i * cw, y = top + w * chh;
        try { if (!who[w].ch) throw new Error('no look'); const c = await rig.render(QBLook.build(Q.creator, who[w].ch), rig.clipPose(cols[i][1], cols[i][2])); g.drawImage(c, x, y, cw, chh); }
        catch (e) { bad++; g.fillStyle = '#c00'; g.fillText('NOT DRAWN', x + 4, y + chh / 2); } } }
    return { png: cv.toDataURL('image/png'), who: who.length, cols: cols.length, bad }; }, HI);
  fs.writeFileSync(OUT, Buffer.from(r.png.split(',')[1], 'base64')); console.log('people', r.who, 'columns', r.cols, 'not drawn', r.bad, 'errors', JSON.stringify(errs.slice(0, 3))); await b.close(); })();
