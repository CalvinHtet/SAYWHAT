// rc-0.89 QA: a contact sheet of screenshots (one Read instead of many). Writes an HTML page next to the shots and screenshots it.
//   FILES=a.png,b.png MODE=full|top|crop CROP=x,y,w,h (png px) CELL=300 COLS=4 OUT=sheet.png node.sh rigtest/qa/rc089_wheel_sheet.js
const L = require('./rc089_wheel_lib.js');
const files = process.env.FILES.split(','), MODE = process.env.MODE || 'full', COLS = +(process.env.COLS || 4), CELL = +(process.env.CELL || 300);
const OUT = process.env.OUT;
(async () => {
  const dir = L.path.dirname(OUT), html = L.path.join(dir, '_sheet.html');
  let cells = '';
  for (const f of files) {
    const u = 'file:///' + f.replace(/\\/g, '/'), lab = L.path.basename(f).replace('.png', '');
    let img;
    if (MODE === 'full') img = `<img src="${u}" style="width:${CELL}px;display:block">`;
    else { // a crop in png pixels, shown 1:1
      const [x, y, w, h] = (process.env.CROP || '342,0,240,200').split(',').map(Number);
      img = `<div style="width:${w}px;height:${h}px;background:url('${u}') -${x}px -${y}px no-repeat"></div>`;
    }
    cells += `<div style="display:inline-block;margin:3px;vertical-align:top;font:12px monospace;color:#fff">${img}<div>${lab}</div></div>`;
  }
  L.fs.writeFileSync(html, `<html><body style="margin:0;background:#333;width:${process.env.W || 1240}px">${cells}</body></html>`);
  const br = await L.browser(); const pg = await br.page({ fresh: true, phone: false, width: +(process.env.W || 1240), height: 600 });
  await pg.go('file:///' + html.replace(/\\/g, '/')); await L.sleep(800);
  const h = await pg.ev('document.body.scrollHeight');
  await pg.s('Emulation.setDeviceMetricsOverride', { width: +(process.env.W || 1240), height: h, deviceScaleFactor: 1, mobile: false }); await L.sleep(400);
  await pg.shot(OUT); console.log('wrote', OUT, h);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
