/* A stand-in for the three Firebase compat scripts, for headless tests of the web build (dist-web) without a Firebase project
   or the emulator (which needs Java). Pages of one browser context share one "server": localStorage keys "__mfb:<path>".
   window.__mockUid names the player; window.__mockSignedIn starts signed in. It keeps Firestore's rules of shape that matter
   to web/web.js: a doc path has an even number of parts, a collection an odd number, and set() refuses undefined and nested
   arrays, the way Firestore does. */
(function () {
  var P = "__mfb:", uid = window.__mockUid || "u1";
  var all = function () { var o = {}; for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k.indexOf(P) === 0) o[k.slice(P.length)] = JSON.parse(localStorage.getItem(k)); } return o; };
  var parts = function (p) { return String(p).split("/").filter(Boolean); };
  var bad = function (v, inArr) { if (v === undefined) return "undefined"; if (Array.isArray(v)) { if (inArr) return "nested array"; for (var i = 0; i < v.length; i++) { var b = bad(v[i], true); if (b) return b; } } else if (v && typeof v === "object") { for (var k in v) { var b2 = bad(v[k], false); if (b2) return b2; } } return null; };
  window.__mfbWrites = 0; window.__mfbReads = 0; window.__mfbColGets = [];
  var dsnap = function (p, d) { return { id: parts(p).pop(), exists: d !== undefined, data: function () { return d === undefined ? undefined : JSON.parse(JSON.stringify(d)); } }; };
  var watchers = [];
  setInterval(function () { watchers.forEach(function (w) { var j = JSON.stringify(w.read()); if (j !== w.last) { w.last = j; w.fire(); } }); }, 300);
  function docRef(p) {
    if (parts(p).length % 2) throw new Error("doc path needs an even number of parts: " + p);
    var read = function () { var v = localStorage.getItem(P + p); return v == null ? undefined : JSON.parse(v); };
    return {
      get: function () { window.__mfbReads++; return Promise.resolve(dsnap(p, read())); },
      set: function (d) { var b = bad(d); if (b) return Promise.reject({ code: "invalid-argument", message: b }); window.__mfbWrites++; localStorage.setItem(P + p, JSON.stringify(d)); return Promise.resolve(); },
      delete: function () { localStorage.removeItem(P + p); return Promise.resolve(); },
      onSnapshot: function (next) { var w = { read: read, last: JSON.stringify(read()), fire: function () { window.__mfbReads++; next(dsnap(p, read())); } }; watchers.push(w); setTimeout(w.fire, 0); return function () { watchers.splice(watchers.indexOf(w), 1); }; }
    };
  }
  function colRef(c, n) {
    var read = function () { var o = all(), out = []; Object.keys(o).forEach(function (k) { var s = parts(k); if (s.length === 2 && s[0] === c) out.push([k, o[k]]); }); return n ? out.slice(0, n) : out; };
    var q = function () { var d = read().map(function (x) { return dsnap(x[0], x[1]); }); return { docs: d, size: d.length, empty: !d.length }; };
    return {
      limit: function (k) { return colRef(c, k); },
      get: function () { var r = q(); window.__mfbReads += Math.max(1, r.size); window.__mfbColGets.push(c); return Promise.resolve(r); },
      onSnapshot: function (next) { var w = { read: read, last: JSON.stringify(read()), fire: function () { var r = q(); window.__mfbReads += Math.max(1, r.size); next(r); } }; watchers.push(w); setTimeout(w.fire, 0); return function () { watchers.splice(watchers.indexOf(w), 1); }; }
    };
  }
  var authCbs = [], user = null;
  var mkUser = function () { return { uid: uid, getIdToken: function () { return Promise.resolve("tok-" + uid); } }; };
  if (window.__mockSignedIn || localStorage.getItem("__mfbAuth:" + uid)) user = mkUser();
  var auth = {
    onAuthStateChanged: function (cb) { authCbs.push(cb); setTimeout(function () { cb(user); }, 0); },
    getRedirectResult: function () { return Promise.resolve(null); },
    signInWithPopup: function () { user = mkUser(); localStorage.setItem("__mfbAuth:" + uid, "1"); authCbs.forEach(function (cb) { cb(user); }); return Promise.resolve({ user: user }); },
    signInWithRedirect: function () { return auth.signInWithPopup(); },
    useEmulator: function () {}
  };
  var fs = { doc: docRef, collection: colRef, useEmulator: function () {} };
  window.firebase = { initializeApp: function (c) { window.__mfbConfig = c; return {}; }, auth: Object.assign(function () { return auth; }, { GoogleAuthProvider: function () {} }), firestore: function () { return fs; } };
})();
