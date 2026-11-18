// Preview new player emotes on ONE outfit, drawn by the game's own rig from bone poses (no new art). New poses/clips come from
// rigtest/lead/emotes_draft.json (merged over data/poses.json in the page only; nothing in data/ changes). Writes each clip's frames
// as PNG to OUT/<clip>/NNN.png and a labelled contact strip OUT/<clip>.png.
//   BASE=<plain build> OUT=<dir> CLIPS=idle,wave,think,stretch,stretchSide NODE_PATH=<playwright's parent> node rigtest/lead/emoteprev.js
const pw = require('playwright'), fs = require('fs'), path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8838', OUT = process.env.OUT || 'qa-out/emotes', CLIPS = (process.env.CLIPS || 'idle,wave,think,stretch,stretchSide').split(',');
const RIGPATCH = process.env.RIGPATCH ? JSON.parse(process.env.RIGPATCH) : null; /* e.g. {"faN":{"blend":140},"faF":{"blend":140}}: merged into rig.bones in the page only */
const RIGTOP = process.env.RIGTOP ? JSON.parse(process.env.RIGTOP) : null; /* e.g. {"meshStep":12}: rig.json top-level fields, page only */
const DRAFT = JSON.parse(fs.readFileSync(path.join(__dirname, 'emotes_draft.json'), 'utf8')), HI = +process.env.HI || 1.6;
const OUTFIT = { a_top: 'gx_h_varsity', a_pants: 'gx_h_denim', a_shoes: 'gx_h_sneak' };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 90000 }); await p.waitForTimeout(1500);
  for (const clip of CLIPS) {
    const r = await p.evaluate(async ([clip, DRAFT, OUTFIT, HI, RIGPATCH, RIGTOP]) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S;
      const { clips: c0, ...p0 } = Q.poses, poses = Object.assign({}, p0, DRAFT.poses), clips = Object.assign({}, c0, DRAFT.clips);
      const RB = JSON.parse(JSON.stringify(Q.rig.bones)); if (RIGPATCH) Object.keys(RIGPATCH).forEach((k) => { RB[k] = Object.assign({}, RB[k], RIGPATCH[k]); });
      const rig = window.__emoRig || (window.__emoRig = await QBRig.create({ rig: Object.assign({}, Q.rig, RIGTOP || {}, { bones: RB, frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips,
        assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') }));
      S.created = true; S.char = window.__qb.fixChar({ name: 'Sam', sex: 'f' }); S.char.rig = Object.assign({}, Q.creator.defaults, { body: 'f', hairStyle: 'h1', hairColor: 'brown', skin: 's2' });
      S.owned = S.owned || {}; Object.values(OUTFIT).forEach((id) => { S.owned[id] = true; }); const look = QBLook.build(Q.creator, window.__qb.lookOf(OUTFIT).rig);
      const LABEL = { stretch: 'now: stretch', stretchSide: 'new: side stretch', think: 'new: thinking', waveP: 'new: wave', idle: 'idle' };
      const C = clips[clip], frames = []; for (let f = 0; f < C.frames; f++) { const pose = rig.clipPose(clip, f); const cv = await rig.render(look, pose);
        const o = document.createElement('canvas'); o.width = cv.width; o.height = cv.height + 40; const g = o.getContext('2d'); g.fillStyle = '#e9e3da'; g.fillRect(0, 0, o.width, o.height); g.drawImage(cv, 0, 0);
        g.fillStyle = '#222'; g.font = 'bold 22px sans-serif'; g.fillText(LABEL[clip] || clip, 12, o.height - 12);
        /* the thinking bubble the game would draw over the head (not rig art), while the arms are crossed */
        if (clip === 'think' && f > 5 && f < C.frames - 6) { const bx = o.width * 0.72, by = o.height * 0.12; g.fillStyle = '#fff'; g.strokeStyle = '#333'; g.lineWidth = 3;
          g.beginPath(); g.ellipse(bx, by, 46, 30, 0, 0, Math.PI * 2); g.fill(); g.stroke(); [[bx - 40, by + 34, 9], [bx - 56, by + 52, 5]].forEach(([cx, cy, rr]) => { g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.fill(); g.stroke(); });
          g.fillStyle = '#333'; const n = 1 + Math.floor(f / 4) % 3; for (let k = 0; k < n; k++) { g.beginPath(); g.arc(bx - 18 + k * 18, by, 5, 0, Math.PI * 2); g.fill(); } } frames.push(o.toDataURL('image/png')); }
      return { frames, fps: C.fps }; }, [clip, DRAFT, OUTFIT, HI, RIGPATCH, RIGTOP]);
    const dir = path.join(OUT, clip); fs.mkdirSync(dir, { recursive: true }); r.frames.forEach((d, i) => fs.writeFileSync(path.join(dir, String(i).padStart(3, '0') + '.png'), Buffer.from(d.split(',')[1], 'base64')));
    fs.writeFileSync(path.join(OUT, clip + '.fps'), String(r.fps)); console.log(clip, r.frames.length, 'frames @', r.fps); }
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 3))); await b.close(); })();
