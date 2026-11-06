// Packs cut into pieces (LEAD's fb7ca53): the game must end up with exactly the same art as an uncut build. Loads each server's
// page and reports window.QBART (entries and a SHA-256 of every key and value in order of key) and window.__B (count, SHA-256
// in order). Usage: node packsame.js <server> [<server> ...]
const { chromium } = require('playwright');
(async () => {
  for (const base of process.argv.slice(2)) {
    const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBART && window.__B, null, { timeout: 120000 });
    const r = await p.evaluate(async () => { const h = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((x) => x.toString(16).padStart(2, '0')).join('').slice(0, 16);
      const k = Object.keys(window.QBART).sort(); let a = ''; k.forEach((x) => { a += x + '\n' + window.QBART[x] + '\n'; });
      return { art: k.length, artHash: await h(a), yawn: k.filter((x) => /_yawn\.webp$/.test(x)).length, blobs: window.__B.length, blobHash: await h(window.__B.join('\n')) }; });
    console.log(base, JSON.stringify(r), 'page errors', errs.length);
    await b.close();
  }
})();
