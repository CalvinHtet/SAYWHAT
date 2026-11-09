/* Quest Board off Claude (docs/WEBAPP.md). Loaded only by the web build, after the Firebase scripts and qbdata.js and before
   rig.js and app.js. The game asks its host for three things through window.claude.use(): "db", "user" and "sample". On
   Claude those are the platform's; here the same calls are answered by Firestore, Google sign-in and one Cloud Function, so the
   game's own code does not change. */
(function () {
  "use strict";
  var W = window.QB_WEB || {}, D = window.QBDATA || {}, HASH = D.arthash || {}, BASE = (D.loft && D.loft.artBase) || "art/";

  /* ---- art on demand: any picture name answers with its file URL, so nothing has to be packed into the page up front ---- */
  var packed = window.QBART || {};
  var urlOf = function (n) { return HASH[n] ? BASE + n + "?h=" + HASH[n] : undefined; };
  window.QBART = new Proxy(packed, {
    get: function (t, n) { if (typeof n !== "string" || n in t) return t[n]; return urlOf(n); },
    has: function (t, n) { return n in t || !!HASH[n]; },
    ownKeys: function (t) { var k = Object.keys(t); Object.keys(HASH).forEach(function (n) { if (k.indexOf(n) < 0) k.push(n); }); return k; },
    getOwnPropertyDescriptor: function (t, n) {
      if (n in t) return Object.getOwnPropertyDescriptor(t, n);
      return HASH[n] ? { value: urlOf(n), enumerable: true, configurable: true, writable: true } : undefined;
    }
  });

  /* the Test tools show only once the game knows this player is the owner (30_app_b.js adds .qb-own): without this, a friend could
     see the Test button for a moment between signing in and the save loading */
  var css = document.createElement("style"); css.textContent = "body.qbweb:not(.qb-own) #qbt{display:none!important}"; (document.head || document.documentElement).appendChild(css);
  if (document.body) document.body.classList.add("qbweb"); else document.addEventListener("DOMContentLoaded", function () { document.body.classList.add("qbweb"); });
  /* a build for real players (config.js noTest): no Test button and no "Testing:" rows in the Shop or room windows, for anyone */
  if (W.noTest) { var nt = document.createElement("style"); nt.textContent = "#qbt,.qs-dev{display:none!important}"; (document.head || document.documentElement).appendChild(nt); }
  /* the sandbox link (tools/build.py with QB_SANDBOX=1; Cal, 2026-11-08: "test all the upgrades without it overwriting my personal
     save"): the game gets a stand-in database that lives in this browser only. It returns before Firebase starts, so this build
     has no way to sign in or to reach anyone's real save. */
  if (W.sandbox) { sandboxHost(); return; }
  if (!window.firebase) return; /* the page then runs on this device only, as it does when Claude is not there */

  /* ---- the sandbox's database: the same calls as makeDb below, kept in localStorage under qbsbx: ---- */
  function sandboxHost() {
    var PRE = "qbsbx:", subs = [];
    var read = function (p) { try { var r = localStorage.getItem(PRE + p); return r === null ? undefined : JSON.parse(r); } catch (e) { return undefined; } };
    var snapD = function (p) {
      var v = read(p);
      return { id: p.split("/").pop(), exists: v !== undefined, data: function () { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); } };
    };
    var paths = function (name) {
      var at = PRE + name + "/", out = [];
      for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k.indexOf(at) === 0 && k.slice(at.length).indexOf("/") < 0) out.push(k.slice(PRE.length)); }
      return out;
    };
    var snapC = function (name, n) { var ps = paths(name); if (n) ps = ps.slice(0, n); var docs = ps.map(snapD); return { docs: docs, size: docs.length, empty: !docs.length }; };
    var told = function (p) { subs.slice().forEach(function (s) { if (s.path === p || s.col + "/" === p.slice(0, p.lastIndexOf("/") + 1)) setTimeout(s.tell, 0); }); };
    var listen = function (s) { subs.push(s); setTimeout(s.tell, 0); return function () { subs.splice(subs.indexOf(s), 1); }; };
    var db = {
      doc: function (p) {
        return {
          get: function () { return Promise.resolve(snapD(p)); },
          set: function (d) { localStorage.setItem(PRE + p, JSON.stringify(d === undefined ? null : d)); told(p); return Promise.resolve(); },
          delete: function () { localStorage.removeItem(PRE + p); told(p); return Promise.resolve(); },
          onSnapshot: function (next) { return listen({ path: p, tell: function () { next(snapD(p)); } }); }
        };
      },
      collection: function (name) {
        return {
          limit: function (n) { return { get: function () { return Promise.resolve(snapC(name, n)); } }; },
          get: function () { return Promise.resolve(snapC(name, 0)); },
          onSnapshot: function (next) { return listen({ col: name, tell: function () { next(snapC(name, 0)); } }); }
        };
      }
    };
    var me = { id: function () { return Promise.resolve("sandbox"); }, isOwner: function () { return Promise.resolve(true); } };
    window.claude = { use: function (what) { return Promise.resolve(what === "db" ? db : what === "user" ? me : null); } };
    var badge = function () {
      var b = document.createElement("div"); b.id = "qbsandbox"; b.textContent = "SANDBOX";
      b.setAttribute("style", "position:fixed;top:calc(env(safe-area-inset-top,0px) + 2px);left:50%;transform:translateX(-50%);z-index:99998;font:800 10px/1 Inter,system-ui,sans-serif;letter-spacing:.14em;padding:4px 10px;border-radius:999px;background:#ff5a7a;color:#14121c;pointer-events:none");
      document.body.appendChild(b); document.title = "SAYWHAT Sandbox";
    };
    if (document.body) badge(); else document.addEventListener("DOMContentLoaded", badge);
  }

  /* ---- Firebase: the hosting page's own config when served by Firebase Hosting, else the copy in web/config.js ---- */
  var started = fetch("/__/firebase/init.json").then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
    .then(function (c) {
      var cfg = Object.assign({}, W.firebase || {}, c || {});
      /* sign-in runs on this page's own domain when it is a Firebase one (iPhone Safari and home-screen apps block it otherwise) */
      if (/\.(web\.app|firebaseapp\.com)$/.test(location.hostname)) cfg.authDomain = location.hostname;
      firebase.initializeApp(cfg);
      if (W.emulator) { firebase.auth().useEmulator("http://" + W.emulator + ":9099"); firebase.firestore().useEmulator(W.emulator, 8080); }
      return firebase;
    });

  /* ---- sign-in: a plain screen before the game, once per device; the game waits behind it ---- */
  var standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone;
  function signInScreen(msg) {
    var el = document.getElementById("qbsignin");
    if (!el) {
      el = document.createElement("div"); el.id = "qbsignin";
      el.setAttribute("style", "position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:#14121c;color:#fff;font-family:Inter,system-ui,sans-serif;text-align:center;padding:24px");
      el.innerHTML = '<div style="font-size:44px;font-weight:800;letter-spacing:.04em">SAYWHAT</div>'
        + '<div style="opacity:.8;max-width:300px;line-height:1.4">Real chores, real XP. Sign in once so your progress follows you and your friends can see your Loft.</div>'
        + '<button id="qbsigninbtn" style="font:inherit;font-weight:700;padding:14px 22px;border-radius:999px;border:0;background:#ffc857;color:#14121c;cursor:pointer">Sign in with Google</button>'
        + '<div id="qbsigninmsg" style="min-height:1.4em;color:#ff9b9b;max-width:300px"></div>';
      document.body.appendChild(el);
      el.querySelector("#qbsigninbtn").addEventListener("click", function () {
        var p = new firebase.auth.GoogleAuthProvider(), a = firebase.auth();
        el.querySelector("#qbsigninmsg").textContent = "";
        /* a home-screen app has no popups: it signs in by leaving and coming back */
        (standalone ? a.signInWithRedirect(p) : a.signInWithPopup(p)).catch(function (e) {
          if (e && /popup/.test(e.code || "")) return a.signInWithRedirect(p);
          el.querySelector("#qbsigninmsg").textContent = "Sign-in did not finish (" + ((e && e.code) || "error") + "). Try again.";
        });
      });
    }
    el.style.display = "flex"; if (msg) el.querySelector("#qbsigninmsg").textContent = msg;
  }
  var signedIn = started.then(function () {
    return new Promise(function (done) {
      var a = firebase.auth();
      a.getRedirectResult().catch(function (e) { signInScreen("Sign-in did not finish (" + ((e && e.code) || "error") + "). Try again."); });
      a.onAuthStateChanged(function (u) {
        if (u) { var el = document.getElementById("qbsignin"); if (el) el.style.display = "none"; done(u); }
        else signInScreen();
      });
    });
  });

  /* ---- the database: Firestore, holding each doc as one JSON string ----
     The game's docs are plain JSON, but Firestore refuses some JSON (undefined values, arrays inside arrays, very deep nesting),
     so each doc is stored as {j: "<json>", t: <ms>} and handed back as the object it was. Rules only look at paths and who is
     signed in (firestore.rules), never at fields, so nothing is lost. */
  var enc = function (d) { return { j: JSON.stringify(d === undefined ? null : d), t: Date.now() }; };
  var dec = function (raw) { if (!raw) return raw; if (typeof raw.j === "string") { try { return JSON.parse(raw.j); } catch (e) { return null; } } return raw; };
  var snapDoc = function (s) { return { id: s.id, exists: s.exists, data: function () { return s.exists ? dec(s.data()) : undefined; } }; };
  var snapQuery = function (q) { return { docs: q.docs.map(snapDoc), size: q.size, empty: q.empty }; };
  /* the latest snapshot of each collection a live listener holds: re-reading a collection then costs no reads (with ~30 players
     the town hall's re-read after every push would otherwise run past Firestore's free daily reads) */
  var live = {};
  function makeDb(fs) {
    return {
      doc: function (path) {
        var ref = fs.doc(path);
        return {
          get: function () { return ref.get().then(snapDoc); },
          set: function (d) { return ref.set(enc(d)); },
          delete: function () { return ref.delete(); },
          onSnapshot: function (next, err) { return ref.onSnapshot(function (s) { next(snapDoc(s)); }, err); }
        };
      },
      collection: function (name) {
        var ref = fs.collection(name);
        var getN = function (n) { return live[name] ? Promise.resolve(snapQuery(live[name])) : (n ? ref.limit(n) : ref).get().then(snapQuery); };
        return {
          limit: function (n) { return { get: function () { return getN(n); } }; },
          get: function () { return getN(0); },
          onSnapshot: function (next, err) {
            return ref.onSnapshot(function (q) { live[name] = q; next(snapQuery(q)); },
              function (e) { delete live[name]; if (err) err(e); });
          }
        };
      }
    };
  }

  /* ---- AI: one Cloud Function (functions/index.js) calls Claude with the owner's key; photos are shrunk on the phone first ---- */
  /* Cal, 2026-11-09: checks run in the background now, so the shrink must not freeze the game: img.decode() decodes off the main
     thread, and toBlob encodes without blocking. Quality 0.75 keeps the upload small; 1024 px still reads a clock in the photo. */
  function shrink(file) {
    return new Promise(function (ok, no) {
      var img = new Image(), url = URL.createObjectURL(file);
      var draw = function () {
        if (!img.naturalWidth || !img.naturalHeight) { URL.revokeObjectURL(url); return no(new Error("image")); }
        var k = Math.min(1, 1024 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        /* never send an empty picture: Claude would then judge the quest from the words alone */
        var give = function (s) { if (s) ok(s); else no(new Error("image")); };
        var viaUrl = function () { give(c.toDataURL("image/jpeg", 0.75).split(",")[1]); };
        if (!c.toBlob) return viaUrl();
        c.toBlob(function (b) {
          if (!b) return viaUrl();
          var r = new FileReader(); r.onload = function () { give(String(r.result).split(",")[1]); }; r.onerror = viaUrl; r.readAsDataURL(b);
        }, "image/jpeg", 0.75);
      };
      img.onload = function () { if (img.decode) img.decode().then(draw, draw); else draw(); };
      img.onerror = function () { URL.revokeObjectURL(url); no(new Error("image")); };
      img.src = url;
    });
  }
  var warmT = 0;
  var post = function (body) {
    return signedIn.then(function (u) { return u.getIdToken(); }).then(function (tok) {
      return fetch(W.api || "/api/sample", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + tok }, body: JSON.stringify(body) });
    });
  };
  var sample = {
    limits: function () { return Promise.resolve({ images: true }); },
    /* wakes the server while the player is still taking the photo (the proof window calls this); at most once every 2 minutes */
    warm: function () {
      if (Date.now() - warmT < 120000) return; warmT = Date.now();
      post({ warm: true }).catch(function () {});
    },
    json: async function (prompt, opt) {
      opt = opt || {};
      var body = { prompt: String(prompt), tier: opt.modelTier || "" }, f = opt.images, t0 = performance.now();
      if (Array.isArray(f)) f = f[0];
      if (f) body.image = await shrink(f);
      var t1 = performance.now();
      var r = await post(body);
      var j = await r.json().catch(function () { return null; });
      /* how long the phone and the server took, for the owner's diag/perf log (29_prices.js) */
      if (f) window.__qbPhotoT = { shrink: Math.round(t1 - t0), server: Math.round(performance.now() - t1), kb: Math.round(body.image.length * 0.75 / 1024), status: r.status, t: Date.now() };
      if (!r.ok || !j) { var e = new Error((j && j.error) || "sample " + r.status); e.code = (j && j.code) || "unavailable"; throw e; }
      return j.result;
    }
  };

  var owners = W.owners || [];
  window.claude = {
    use: function (what) {
      if (what === "db") return signedIn.then(function () { return makeDb(firebase.firestore()); });
      if (what === "user") return signedIn.then(function (u) {
        return { id: function () { return Promise.resolve(u.uid); }, isOwner: function () { return Promise.resolve(owners.indexOf(u.uid) >= 0); } };
      });
      if (what === "sample") return signedIn.then(function () { return sample; });
      return Promise.resolve(null);
    }
  };
  /* ---- the installed app: offline copy, a quiet update when it comes back, and art fetched ahead ---- */
  var mine = function (src) { var u = new URL(src, location.href); return u.pathname.replace(/^.*\//, "") + u.search; };
  /* the version is every fingerprinted file the page loads, not app.js alone: a change to config.js (Cal made owner, 5b45abb) left
     app.js the same, so an app kept open in the background never picked it up */
  var appHash = function (html) { var m = String(html).match(/[\w.-]+\.js\?h=[0-9a-f]+/g); return m ? m.sort().join("|") : ""; };
  var running = appHash([].map.call(document.scripts, function (s) { return s.src; }).join(" "));
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "127.0.0.1" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
  /* tell the worker which files this version uses, so copies of older art are dropped */
  function keepList() {
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) return;
    var keep = Object.keys(HASH).map(function (n) { return n + "?h=" + HASH[n]; });
    [].forEach.call(document.scripts, function (s) { if (s.src && /\?h=/.test(s.src)) keep.push(mine(s.src)); });
    navigator.serviceWorker.controller.postMessage({ keep: keep });
  }
  /* back from the background after a while: if a new version went out meanwhile (the 4 am publish), load it now, unless a
     window is open (a photo check, a story scene); the save is already in the database, so nothing is lost */
  var hiddenAt = 0;
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { hiddenAt = Date.now(); return; }
    if (!running || Date.now() - hiddenAt < 10 * 60000) return;
    fetch("index.html", { cache: "no-store" }).then(function (r) { return r.text(); }).then(function (html) {
      var h = appHash(html);
      if (h && h !== running && !document.querySelector("#layer .modal") && !document.body.classList.contains("qbpend")) location.reload();
    }).catch(function () {});
  });
  /* fetch ahead, a few at a time and only while the app is on screen: the buildings and rooms first, then this player's own
     body (the other body's layers load only if someone wearing them is drawn), then icons. Each picture is downloaded once. */
  function fetchAhead() {
    var sex = (window.QBGAME && QBGAME.sex()) || "m", other = sex === "f" ? "m_" : "f_", rank = function (n) {
      return /^(bld_|ui_|logo_)/.test(n) ? 0 : /^[mf]_/.test(n) ? 2 : /^icon_/.test(n) ? 3 : 1; };
    var q = Object.keys(HASH).filter(function (n) { return n.indexOf(other) !== 0; }).sort(function (a, b) { return rank(a) - rank(b); });
    var busy = 0, next = function () {
      while (busy < 3 && q.length) {
        if (document.hidden) { setTimeout(next, 5000); return; }
        var n = q.shift(); busy++;
        fetch(urlOf(n), { priority: "low" }).catch(function () {}).then(function () { busy--; next(); });
      }
    };
    window.__qbWeb.ahead = q; next();
  }
  (function afterBoot() {
    if (!(window.QBGAME && QBGAME.ready())) { setTimeout(afterBoot, 2000); return; }
    setTimeout(keepList, 5000);
    if (!(navigator.connection && navigator.connection.saveData)) setTimeout(fetchAhead, 15000);
  })();

  window.__qbWeb = { live: live, signedIn: signedIn, running: running };
})();
