// W1 stress save, evaluated in the page by mkseed.js KIND=heavy (after the advanced player is set up). Fills the save and the
// sandbox's stand-in database (localStorage "qbsbx:<collection>/<id>", web.js) far past a normal player:
//   240 quests over every cluster (a third done today), 40 custom workouts, every exercise with 12 logged sessions, 60 sessions,
//   60 neighbours' worlds, 60 town board docs of 30 posts (1,800 posts; the game shows the newest 30), 300 chat docs with
//   10 lines in each of the 3 rooms (9,000 lines; the game draws the newest 60 a room), 300 likes, 200 pings, 20 kind words.
(async () => {
  const x = window.__qb.x(), S = x.S, now = Date.now();
  // the app lives in one closure: today(), dstr(), EX and pacWeek are not reachable, so they are rebuilt here (EX ids from mkseed)
  const dstr = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const T = S.runDate || dstr(new Date(now - 5 * 36e5));
  const pacIso = (mon) => { const y = new Date((mon + 3) * 864e5).getUTCFullYear(), w = Math.floor((mon + 3 - Math.floor(Date.UTC(y, 0, 1) / 864e5)) / 7) + 1; return y + '-W' + (w < 10 ? '0' : '') + w; };
  const pd = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })), pday = Math.floor(Date.UTC(pd.getFullYear(), pd.getMonth(), pd.getDate()) / 864e5), wkKey = pacIso(pday - (pd.getDay() + 6) % 7);
  const STATS = ['creativity', 'discipline', 'fitness', 'productivity', 'social'], CL = ['out', 'reset', 'home', 'body', 'admin', 'create', 'social'];
  const words = ['Clean the kitchen', 'Run 3 miles', 'Email the landlord', 'Sketch a page', 'Call mom', 'Laundry', 'Meal prep', 'Read 20 pages',
    'Pay the phone bill', 'Stretch 10 min', 'Practice guitar', 'Water the plants', 'Tidy the desk', 'Write 500 words', 'Grocery run', 'Walk the dog'];
  S.quests = S.quests || []; S.done = S.done || {};
  let n = S.next || 1;
  for (let i = 0; i < 240; i++) {
    const q = { id: 'q' + n++, name: words[i % words.length] + ' #' + (i + 1), xp: 5 * (1 + (i % 20)), stat: STATS[i % 5], cl: CL[i % CL.length], why: '', rep: ['once', 'daily', 'weekly4'][i % 3] };
    S.quests.push(q); if (i % 3 === 0) S.done[q.id] = q.xp;
  }
  S.next = n; S.runDate = T;
  // Training: custom workouts, then every exercise logged 12 times, and 60 sessions
  S.cex = S.cex || {}; S.cexN = S.cexN || 0;
  const units = ['mi', 'km', 'min', 'reps', 'laps', 'floors', 'steps', 'lb'];
  for (let i = 0; i < 40; i++) { const id = 'cx_' + (++S.cexN); S.cex[id] = { n: 'Activity ' + (i + 1), p: ['Cardio', 'Outdoors', 'Sport', 'Mobility'][i % 4], u: units[i % units.length], sets: 1 + (i % 5), t: (1 + i % 9) + ' ' + units[i % units.length], step: 1, ic: '🏃', st: ['str', 'agi', 'vit'][i % 3] }; }
  S.gymlog = S.gymlog || {}; const exs = window.__EXK || [];
  const day = (k) => dstr(new Date(now - k * 864e5));
  exs.forEach((k, j) => { S.gymlog[k] = Array.from({ length: 12 }, (_, i) => ({ d: day(2 * i + 1), w: 20 + 5 * ((i + j) % 9), ws: [20, 25, 30], n: 3, hit: i % 2 === 0, u: 'lb' })); });
  S.sessions = Array.from({ length: 60 }, (_, i) => ({ d: day(i + 1), plan: 'push', n: 6, load: 4000 + 37 * i, u: 'lb', top: {} }));
  x.persist();
  // the Hall: copy the sandbox's own neighbours (29p_square.js writes worlds/sb_*) for their looks
  const P = 'qbsbx:', put = (k, v) => localStorage.setItem(P + k, JSON.stringify(v));
  const sbw = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.indexOf(P + 'worlds/') === 0) sbw.push(JSON.parse(localStorage.getItem(k))); }
  const names = ['Ari', 'Bo', 'Cy', 'Dee', 'Eli', 'Fin', 'Gus', 'Hana', 'Ivy', 'Jo', 'Kai', 'Lux', 'Mo', 'Nia', 'Oz'];
  const nm = (i) => names[i % names.length] + (i >= names.length ? ' ' + Math.floor(i / names.length) : '');
  for (let i = 0; i < 60; i++) {
    const FR = window.__qbFriends ? Object.values(window.__qbFriends.friends) : [], fr = FR[i % Math.max(1, FR.length)];
    const b = sbw[i % Math.max(1, sbw.length)] || { look: fr ? fr.look : null, rooms: [], cls: '', crew: i % 5, served: i * 7, appv: 88 };
    put('worlds/u' + i, Object.assign({}, b, { name: nm(i), lv: 5 + (i % 50), streak: i % 30, t: now - i * 6e4 }));
    put('board/u' + i, { name: nm(i), posts: Array.from({ length: 30 }, (_, j) => ({ text: 'Post ' + j + ' from ' + nm(i) + ': finished my quests early today, who wants to grab food?', t: now - (i * 30 + j) * 9e4, look: b.look || null })), rx: {} });
  }
  for (let i = 0; i < 300; i++) put('chat/u' + i, { name: nm(i), msgs: { 1: Array.from({ length: 10 }, (_, j) => ({ x: 'line ' + j + ' from ' + nm(i), t: now - (i * 10 + j) * 3e4 })), 2: Array.from({ length: 10 }, (_, j) => ({ x: 'room two ' + j, t: now - (i * 10 + j) * 3e4 })), 3: Array.from({ length: 10 }, (_, j) => ({ x: 'room three ' + j, t: now - (i * 10 + j) * 3e4 })) }, t: now - i * 3e4 });
  const wk = wkKey;
  for (let i = 0; i < 300; i++) put('likes/u' + i, { wk, to: Array.from({ length: 1 + (i % 20) }, (_, j) => 'u' + ((i + j + 1) % 60)), prev: { wk: '', to: [] }, t: now - i * 1e4 });
  for (let i = 0; i < 200; i++) put('pings/u' + i, { fromName: nm(i), sent: { sandbox: { d: T, t: now - i * 1e4, msg: 'hey!', look: null, toName: 'Cal' } }, emo: { sandbox: { k: 'wave', t: now - i * 1e4 } } });
  put('kudosok/sandbox', { name: 'Cal', items: Object.fromEntries(Array.from({ length: 20 }, (_, i) => ['k' + i, { ok: true, c: 500, text: 'You are the best, thank you for this game ' + i, name: nm(i), d: T, t: now - i * 1e5 }])) });
  x.render();
  return { wk, T, exs: exs.length, quests: S.quests.length, done: Object.keys(S.done).length, cex: Object.keys(S.cex).length, gymlogKeys: Object.keys(S.gymlog).length, sessions: S.sessions.length, sbWorlds: sbw.length, lsKeys: localStorage.length };
})()
