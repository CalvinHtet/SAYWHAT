// QA: the web build's sign-in screen per browser (web/web.js, 9b2c2206): app browsers (Instagram, Facebook, Messenger, TikTok, Snapchat,
// the Google app on iPhone) get "Open this in Safari or Chrome" + Copy link instead of the Google button; Safari, Chrome and Android Chrome
// keep the Google button. Phone viewport, only local requests (Google itself is blocked: the button is not pressed).
const pw = require('playwright'); const base = process.env.BASE, OUT = process.env.OUT;
const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22B83';
const UAS = { safari: IOS.replace('Mobile/22B83', 'Version/18.1 Mobile/15E148 Safari/604.1'), chrome_ios: IOS + ' CriOS/131.0.6778.73 Mobile/15E148 Safari/604.1',
  android_chrome: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
  instagram: IOS + ' Instagram 357.0.0.25.101 (iPhone15,2; iOS 18_1; en_US; en; scale=3.00; 1179x2556; 646862345)', facebook: IOS + ' [FBAN/FBIOS;FBAV/489.0.0.47.104;FBBV/123;FBDV/iPhone15,2;FBMD/iPhone;FBSN/iOS;FBSV/18.1;FBSS/3;FBID/phone;FBLC/en_US;FBOP/5]',
  messenger: IOS + ' [FBAN/MessengerForiOS;FBAV/489.0.0.47.104;FBDV/iPhone15,2]', tiktok: IOS + ' musical_ly_37.5.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US', snapchat: IOS + ' Snapchat/13.20.0.40 (like Safari/8618.2.12.10.4, panda)',
  google_app: IOS + ' GSA/343.0.698524546 Mobile/15E148 Safari/604.1', imessage_safari_view: IOS.replace('Mobile/22B83', 'Version/18.1 Mobile/15E148 Safari/604.1') };
(async () => { const b = await pw.chromium.launch();
  for (const [k, ua] of Object.entries(UAS)) { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, userAgent: ua, deviceScaleFactor: 2, permissions: ['clipboard-read', 'clipboard-write'] }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 120)));
    await p.goto(base + '/'); await p.waitForTimeout(9000);
    const r = await p.evaluate(() => ({ google: !!document.querySelector('#qbsigninbtn'), copy: !!document.querySelector('#qbcopylink'), text: ((document.querySelector('#qbcopylink') || {}).parentElement || document.body).innerText.replace(/\s+/g, ' ').slice(0, 170) }));
    let copied = ''; if (r.copy) { await p.click('#qbcopylink'); await p.waitForTimeout(600); copied = await p.evaluate(async () => { const m = document.querySelector('#qbsigninmsg'); let c = ''; try { c = await navigator.clipboard.readText(); } catch (e) { c = 'n/a'; } return (m ? m.textContent : '') + ' | clipboard ' + c; }); }
    console.log(k.padEnd(20), 'google button', r.google, 'copy link', r.copy, copied ? '| ' + copied : '', '| errors', errs.length); if (k === 'instagram' || k === 'safari') { console.log('   ', r.text); await p.screenshot({ path: `${OUT}_${k}.png` }); }
    await ctx.close(); }
  await b.close(); })();
