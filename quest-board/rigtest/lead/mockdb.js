module.exports = ({ uid, owner, rules }) => {
  let P = '__mdb:', load = () => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(P)) o[k.slice(P.length)] = JSON.parse(localStorage.getItem(k)); } return o; }, put = (p, d) => (d === undefined ? localStorage.removeItem(P + p) : localStorage.setItem(P + p, JSON.stringify(d)));
  const LV = { view: 1, interact: 2, admin: 3, owner: 4, self: 9 }, me = owner ? 4 : 2;
  window.__denied = [];
  // the most specific rule whose path is a prefix of the doc path ({self} only matching this player's id)
  const rule = (p) => { const s = p.split('/'); let best = null, bl = -1;
    rules.forEach((r) => { const rs = r.path.split('/'); if (rs.length > s.length) return;
      for (let i = 0; i < rs.length; i++) { if (rs[i] === '{self}') { if (s[i] !== uid) return; } else if (rs[i] !== s[i]) return; }
      if (rs.length > bl) { best = r; bl = rs.length; } });
    return best; };
  const can = (p, op) => { const s = p.split('/');
    if (s[0] === 'data' && s[1] === 'users') return s[2] === uid;
    const r = rule(p); if (!r) return me >= (op === 'read' ? LV.view : LV.interact);
    return me >= LV[r[op] || (op === 'read' ? 'view' : 'interact')]; };
  window.__can = can;
  const guard = (p, op) => { if (!can(p, op)) { window.__denied.push(op + ' ' + p); throw { code: 'permission-denied' }; } };
  const snap = (p, d) => ({ id: p.split('/').pop(), exists: d !== undefined, data: () => (d === undefined ? undefined : JSON.parse(JSON.stringify(d))) });
  const doc = (p) => ({ id: p.split('/').pop(), get: async () => { guard(p, 'read'); return snap(p, load()[p]); },
    set: async (d) => { guard(p, 'write'); put(p, JSON.parse(JSON.stringify(d))); },
    delete: async () => { guard(p, 'write'); put(p, undefined); } });
  const coll = (p, lim) => ({ doc: (k) => doc(p + '/' + k), limit: (n) => coll(p, n), orderBy: () => coll(p, lim),
    where: () => { throw new Error('where() is not used any more'); },
    get: async () => { const o = load(), n = p.split('/').length + 1;
      const docs = Object.keys(o).filter((k) => k.startsWith(p + '/') && k.split('/').length === n && can(k, 'read')).map((k) => snap(k, o[k]));
      return { docs: docs.slice(0, lim || 1e9) }; } });
  const subs = []; const fire = (key) => subs.forEach((s) => { if (key.startsWith(s.pre)) setTimeout(() => s.cb({ docs: [] }), 0); });
  window.addEventListener('storage', (e) => { if (e.key && e.key.startsWith(P)) fire(e.key.slice(P.length)); });
  const put0 = put; put = (p, d) => { put0(p, d); fire(p); };
  const collS = (p, lim) => Object.assign(coll(p, lim), { onSnapshot: (cb, err) => { if (window.__noPush) return undefined; const s = { pre: p + '/', cb }; subs.push(s); setTimeout(() => cb({ docs: [] }), 0); return () => { const k = subs.indexOf(s); if (k >= 0) subs.splice(k, 1); }; } });
  const db = { doc, collection: (p) => collS(p) };
  window.claude = { use: async (n) => (n === 'db' ? db : n === 'user' ? { id: async () => uid, isOwner: async () => owner } : null) };
};
