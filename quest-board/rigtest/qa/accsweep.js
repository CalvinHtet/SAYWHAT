// QA, Cal 11-25: "Some accessories clip through the shoulders and through the hair or clothes. QA check all the items and make sure they
// sit right" (his case: Neon Headphones gx_sm_phones round the neck + the Ø Beanie + the Frock-Coat Hoodie, male body).
// Every Shop row that is an accessory (a_acc) or sits in the neck, mask, glasses, hat or arms slot (cut and gone left out), on each body it
// fits, drawn by the game's rig, upper body only:
//   9 idle frames: 3 hairstyles (short, long, tall/bun) x 3 tops (a hooded top, a high collar/coat, a bare/sleeveless one)
//   5 more with the long hair and the hooded top: stretch (yawn), wave1, cheer1, dance1, rearStand (back)
// One sheet per slot and body, 10 pieces a sheet, a row per piece, a column per frame (labelled). Plus Cal's own combination in every pose.
//   BASE=<server of quest-board/> OUT=<folder> [SLOTS=neck,hat] [HI=1.5] node rigtest/qa/accsweep.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8824', OUT = process.env.OUT || 'shots/qa_acc', HI = +process.env.HI || 1.5; fs.mkdirSync(OUT, { recursive: true });
const SLOTS = (process.env.SLOTS || 'acc,neck,mask,glasses,hat,arms').split(',');
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160))); p.on('console', (m) => { if (/^PROG/.test(m.text())) console.log(m.text()); });
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async ([HI, SLOTS]) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S, I = QBLoft.data.items; const { clips, ...poses } = Q.poses;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const slotOf = (it) => (it[1] === 'a_acc' ? 'acc:' : '') + ((it[6] && it[6].gar && I[it[6].gar] && I[it[6].gar].slot) || it[1]);
    const rows = x.SHOP.filter((it) => /^a_/.test(it[1]) && it[6] && it[6].gar && !(it[6].cut || it[6].gone)).filter((it) => { const s = slotOf(it); return (SLOTS.includes('acc') && /^acc:/.test(s)) || SLOTS.includes(s.replace(/^acc:/, '')); });
    const fits = (it, sex) => { const M = I[it[6].gar] || {}; return !(sex === 'm' && (it[6].fo || M.femaleOnly)) && !(sex === 'f' && (it[6].mo || M.maleOnly)); };
    const pick = (re, sex) => (x.SHOP.find((it) => it[1] === 'a_top' && re.test(it[0]) && fits(it, sex)) || [])[0];
    const TOPS = { m: [['hood', pick(/gx_gd_frock/, 'm')], ['collar', pick(/gx_smk_jacket/, 'm')], ['bare', pick(/gx_cr_mesh/, 'm')]], f: [['hood', pick(/gx_gd_frock/, 'f')], ['collar', pick(/gx_smk_jacket/, 'f')], ['bare', pick(/gx_oc_halter/, 'f') || pick(/gx_cr_mesh/, 'f')]] };
    const HAIR = { m: [['short', 'h1'], ['long', 'fr_victor_hair'], ['bun', 'h5']], f: [['short', 'h2'], ['long', 'h1'], ['tall', 'h3']] };
    const look = (sex, hair, ov) => { S.created = true; S.char = window.__qb.fixChar({ name: 'Acc', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: hair, hairColor: 'brown' }); S.owned = S.owned || {}; Object.values(ov).forEach((id) => { if (id) S.owned[id] = true; }); return QBLook.build(Q.creator, window.__qb.lookOf(ov).rig); };
    const fw = Q.loft.frame[0] * HI, fh = Q.loft.frame[1] * HI, cy0 = Math.round(fh * 0.12), ch = Math.round(fh * 0.5), K = 0.55, cw = Math.round(fw * K), chh = Math.round(ch * K);
    const sheets = {}, listing = [];
    const frames = (sex) => { const F = []; for (const [hn, h] of HAIR[sex]) for (const [tn, t] of TOPS[sex]) F.push({ lab: hn + '/' + tn, hair: h, top: t, pose: 'idle' }); for (const ps of ['stretch', 'wave1', 'cheer1', 'dance1', 'rearStand']) F.push({ lab: 'long/hood ' + ps, hair: HAIR[sex][1][1], top: TOPS[sex][0][1], pose: ps }); return F; };
    const draw = async (g, X, Y, sex, F, ov) => { const o = Object.assign({}, ov); if (F.top) o.a_top = F.top; try { const c = await rig.render(look(sex, F.hair, o), F.pose); g.drawImage(c, 0, cy0, fw, ch, X, Y, cw, chh); return 1; } catch (e) { g.fillStyle = '#c00'; g.fillText('NOT DRAWN', X + 4, Y + 30); return 0; } };
    for (const sex of ['m', 'f']) { const F = frames(sex); const mine = rows.filter((it) => fits(it, sex));
      for (let s0 = 0; s0 < mine.length; s0 += 10) { const part = mine.slice(s0, s0 + 10); const cv = document.createElement('canvas'); cv.width = 170 + cw * F.length; cv.height = 18 + (chh + 4) * part.length; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.font = 'bold 11px sans-serif'; g.fillStyle = '#000';
        F.forEach((f, i) => g.fillText(f.lab, 170 + i * cw + 3, 13));
        for (let ri = 0; ri < part.length; ri++) { const it = part[ri], Y = 18 + ri * (chh + 4); g.fillStyle = '#000'; g.font = 'bold 12px sans-serif'; g.fillText(it[0].replace(/^gx_/, ''), 4, Y + 16); g.font = '11px sans-serif'; g.fillText(slotOf(it), 4, Y + 32); g.fillText(it[2].slice(0, 26), 4, Y + 48);
          const ov = {}; ov[it[1]] = it[0]; for (let i = 0; i < F.length; i++) await draw(g, 170 + i * cw, Y, sex, F[i], ov); listing.push(sex + ' ' + it[0] + ' ' + slotOf(it)); }
        sheets[sex + '_' + String(Math.floor(s0 / 10)).padStart(2, '0')] = cv.toDataURL('image/png'); console.log('PROG ' + sex + ' ' + (s0 + part.length) + '/' + mine.length); } }
    /* Cal's own case, every pose that moves the head or arms */
    { const sex = 'm', ov = { a_acc: 'gx_sm_phones', a_hat: 'gx_sm_beanie', a_top: 'gx_gd_frock' }; const PS = ['idle', 'stretch', 'stretchUp', 'wave1', 'wave2', 'cheer1', 'cheer2', 'dance1', 'dance2', 'laugh1', 'clap1', 'thinkA', 'chat1', 'rearStand', 'sideL', 'sideR']; const HS = ['h1', 'fr_victor_hair', 'h5', 'h4'];
      const cv = document.createElement('canvas'); cv.width = 60 + cw * PS.length; cv.height = 18 + (chh + 4) * HS.length; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.font = 'bold 11px sans-serif'; g.fillStyle = '#000'; PS.forEach((ps, i) => g.fillText(ps, 60 + i * cw + 3, 13));
      for (let hi = 0; hi < HS.length; hi++) { g.fillStyle = '#000'; g.fillText(HS[hi], 4, 18 + hi * (chh + 4) + 16); for (let i = 0; i < PS.length; i++) await draw(g, 60 + i * cw, 18 + hi * (chh + 4), sex, { hair: HS[hi], pose: PS[i] }, ov); }
      sheets['cal_case_m'] = cv.toDataURL('image/png'); }
    return { sheets, listing, n: rows.length, tops: TOPS }; }, [HI, SLOTS]);
  for (const [k, u] of Object.entries(r.sheets)) fs.writeFileSync(`${OUT}/acc_${k}.png`, Buffer.from(u.split(',')[1], 'base64'));
  fs.writeFileSync(`${OUT}/acc_list.txt`, r.listing.join('\n'));
  console.log('pieces ' + r.n + ', sheets ' + Object.keys(r.sheets).length + ', tops ' + JSON.stringify(r.tops) + ', page errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 2))); await b.close(); })();
