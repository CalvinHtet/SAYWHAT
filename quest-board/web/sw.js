/* SAYWHAT's service worker (web build only).
   - Files asked for with ?h=<fingerprint> never change, so once fetched they come from the phone's own copy: the app opens
     offline, and a place seen once opens instantly after. That copy lives across versions, so an update downloads only the
     files that changed; the page tells the worker which files the current version uses and the rest are dropped.
   - The page itself always asks the network first, so a new version arrives the next time the app opens. */
var FILES = "qb-files", PAGE = "qb-page";
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || u.pathname.indexOf("/__/") === 0 || u.pathname.indexOf("/api/") === 0) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(function (res) { var c = res.clone(); caches.open(PAGE).then(function (k) { k.put("./index.html", c); }); return res; })
      .catch(function () { return caches.open(PAGE).then(function (k) { return k.match("./index.html"); }); }));
    return;
  }
  /* video (banner loops) goes to the network and the browser's own cache: Safari asks for byte ranges (206), which a cached whole file cannot answer (QA v213 MED) */
  if (/\.mp4$/i.test(u.pathname) || r.headers.has("range")) return;
  if (u.searchParams.has("h")) {
    e.respondWith(caches.open(FILES).then(function (k) {
      return k.match(r).then(function (hit) { return hit || fetch(r).then(function (res) { if (res.ok) k.put(r, res.clone()); return res; }); });
    }));
  }
});
/* {keep: [path?h=..., ...]}: everything else in the file copy belongs to an older version */
self.addEventListener("message", function (e) {
  var keep = e.data && e.data.keep; if (!Array.isArray(keep)) return;
  var set = {}; keep.forEach(function (p) { set[p] = 1; });
  e.waitUntil(caches.open(FILES).then(function (k) {
    return k.keys().then(function (rs) { return Promise.all(rs.map(function (q) { var u = new URL(q.url); return set[u.pathname.replace(/^.*\//, "") + u.search] ? null : k.delete(q); })); });
  }));
});
/* a tap on one of the game's notifications (app/src/29zz_v193.js) brings the game forward, or opens it */
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if ("focus" in cs[i]) return cs[i].focus(); }
    return self.clients.openWindow ? self.clients.openWindow("./") : null;
  }));
});
