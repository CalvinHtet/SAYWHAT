/* ---------- Cal 2026-11-26: a private photo gallery in the profile ----------
   Cal (idea 8, yes): "private photo gallery inside the profile card, not a new tab".
   - Every photo that passes its check (a quest, a workout, a side-quest, a level trial, a before and after pair) is kept in the
     player's own gallery, made small in the background (29zz_v189.js). Only that player can see it: it lives under their own save
     (data/users/<uid>/..., which the database rules let only them read). Posting to the town board stays their choice.
   - The profile has "Your photos": the newest first, a tap opens the photo with its date and time (under it, never on it), what it
     was for, Post to the town board (when the board is on) and Delete. The last 60 are kept; an older one makes room for a new one.
   - Nothing is kept without a signed-in save (no database): the section says so. */
var V91N=60,V91IX=null,V91Q=Promise.resolve(),V91LOAD=null;
function v91Can(){return !!(typeof db!=="undefined"&&db&&typeof MYUID!=="undefined"&&MYUID)}
function v91Path(k){return "data/users/"+MYUID+"/"+k}
function v91Index(){if(V91IX)return Promise.resolve(V91IX);if(!v91Can())return Promise.resolve({items:[]});if(V91LOAD)return V91LOAD;
  V91LOAD=db.doc(v91Path("gallery")).get().then(function(s){var d=s&&s.exists?s.data():null;V91IX={items:(d&&Array.isArray(d.items)?d.items:[]).slice(0,V91N)};V91LOAD=null;return V91IX},function(){V91LOAD=null;return {items:[]}});return V91LOAD}
function v91Data(b){return new Promise(function(ok,no){var fr=new FileReader();fr.onload=function(){ok(fr.result)};fr.onerror=function(){no(new Error("read"))};fr.readAsDataURL(b)})}
/* made small: the photo at most 900 px (kept under 700 KB as text), its square-ish thumbnail at 200 px */
function v91Make(file){var one=function(max,q){return (typeof v89Scale==="function"?v89Scale(file,{max:max,q:q}).then(function(d){return d.full}):Promise.reject()).catch(function(){
      return new Promise(function(ok,no){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var k=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement("canvas");c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);
          c.getContext("2d").drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(function(b){b?ok(b):no(new Error("image"))},"image/jpeg",q)};im.onerror=function(){URL.revokeObjectURL(u);no(new Error("image"))};im.src=u})})};
  return one(900,.78).then(function(b){return b.size>520*1024?one(760,.66):b}).then(function(full){return one(200,.62).then(function(th){return Promise.all([v91Data(full),v91Data(th)])})})}
function v91Keep(r){if(!r||!r.file||!v91Can())return;var file=r.file,meta={t:Date.now(),what:String(r.what||"").slice(0,60),kind:r.kind||"quest",ba:r.ba?1:0};
  V91Q=V91Q.then(function(){return Promise.all([v91Make(file),v91Index()])}).then(function(L){var full=L[0][0],th=L[0][1],ix=L[1];if(full.length>900000)return;
      var id="g"+meta.t+Math.floor(Math.random()*1000);meta.id=id;meta.th=th;
      return db.doc(v91Path(id)).set({d:full,t:meta.t}).then(function(){ix.items.unshift(meta);var gone=ix.items.slice(V91N);ix.items=ix.items.slice(0,V91N);
        gone.forEach(function(g){try{db.doc(v91Path(g.id)).delete().catch(function(){})}catch(e){}});r.v91=id;
        return db.doc(v91Path("gallery")).set({items:ix.items})}).then(function(){v91Paint()})}).catch(function(){});}
var v91Rem=phRemember;phRemember=function(o){var r=v91Rem.apply(this,arguments);
  try{if(r){if(r.ready&&r.ready.then)r.ready.then(function(){v91Keep(r)});else v91Keep(r)}}catch(e){}return r};
/* ---- the profile's section ---- */
function v91When(t){try{return new Date(t).toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch(e){return ""}}
function v91Kind(g){return g.ba?"Before and after":g.kind==="trial"?"Level trial":g.kind==="workout"?"Workout":"Quest"}
function v91Grid(ix){if(!v91Can())return '<p class="note">Photos are kept here when you play signed in.</p>';
  if(!ix)return '<p class="note v91wait">Loading your photos…</p>';
  if(!ix.items.length)return '<p class="note">Photos that pass a check land here. Only you can see them.</p>';
  return '<div class="v91grid">'+ix.items.map(function(g){return '<button type="button" class="v91th" data-v91="'+esc(g.id)+'" aria-label="'+esc((g.what||v91Kind(g))+", "+v91When(g.t))+'"><img src="'+esc(g.th)+'" alt="">'+(g.ba?'<i>B/A</i>':'')+'</button>'}).join("")+'</div>'}
function v91Section(){return '<section class="card v91" id="v91sec"><span class="label">Your photos</span><p class="note v91sub">Private. Only you can see these.</p><div class="v91body">'+v91Grid(V91IX)+'</div></section>'}
function v91Paint(){var el=document.querySelector("#layer #v91sec .v91body");if(el)el.innerHTML=v91Grid(V91IX)}
var v91Char=charModal;charModal=function(){var m=v91Char.apply(this,arguments);
  try{var body=m&&m.querySelector?m.querySelector(".prof-body"):document.querySelector("#layer .prof .prof-body");if(body&&!body.querySelector("#v91sec")){/* above Replay tutorial and Start over, which stay last */var tr=body.querySelector('[data-act="tourreplay"]'),at=tr;while(at&&at.parentNode!==body)at=at.parentNode;
      if(at)at.insertAdjacentHTML("beforebegin",v91Section());else body.insertAdjacentHTML("beforeend",v91Section());if(!V91IX)v91Index().then(v91Paint)}}catch(e){}return m};
/* ---- one photo ---- */
function v91Open(id){var g=V91IX&&V91IX.items.filter(function(x){return x.id===id})[0];if(!g)return;
  var m=modal('<div class="card box2 v91view" data-id="'+esc(id)+'"><span class="label">'+esc(v91Kind(g))+'</span>'+(g.what?'<h3>'+esc(g.what)+'</h3>':'')+'<div class="v91big"><img src="'+esc(g.th)+'" alt=""></div><p class="note">'+esc(v91When(g.t))+' &middot; private</p>'
    +'<div class="btns">'+(typeof phOn==="function"&&phOn()?'<button class="btn" data-v91a="post">Post to the town board</button>':'')+'<button class="btn ghost" data-v91a="del">Delete</button><button class="btn ghost" data-act="mclose">Close</button></div></div>');
  db.doc(v91Path(id)).get().then(function(s){var d=s&&s.exists?s.data():null;var im=document.querySelector('#layer .v91view[data-id="'+id+'"] .v91big img');if(d&&d.d&&im)im.src=d.d}).catch(function(){});return m}
function v91Blob(u){var b=atob(u.split(",")[1]),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new Blob([a],{type:"image/jpeg"})}
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-v91],[data-v91a]");if(!t)return;e.preventDefault();e.stopPropagation();
  if(t.hasAttribute("data-v91")){v91Open(t.getAttribute("data-v91"));return}
  var v=t.closest(".v91view"),id=v&&v.getAttribute("data-id"),g=V91IX&&V91IX.items.filter(function(x){return x.id===id})[0];if(!g)return;var a=t.getAttribute("data-v91a");
  if(a==="del"){if(t.dataset.sure!=="1"){t.dataset.sure="1";t.textContent="Delete for good?";return}
    V91IX.items=V91IX.items.filter(function(x){return x.id!==id});db.doc(v91Path(id)).delete().catch(function(){});db.doc(v91Path("gallery")).set({items:V91IX.items}).catch(function(){});
    var mm=v.closest(".modal");if(mm)mm.remove();v91Paint();pop("Photo deleted");return}
  if(a==="post"){t.disabled=true;t.textContent="Posting…";db.doc(v91Path(id)).get().then(function(s){var d=s&&s.exists?s.data():null;if(!d||!d.d)throw new Error("gone");
      return phPublish({file:v91Blob(d.d),kind:g.kind==="trial"?"trial":"quest",what:g.what,ba:g.ba,stamp:""},"")}).then(function(ok){var mm=v.closest(".modal");if(ok&&mm)mm.remove();else{t.disabled=false;t.textContent="Post to the town board"}},function(){t.disabled=false;t.textContent="Post to the town board";pop("That photo could not be read.")})}},true);
htabCss("qb-v191-css",".v91 .v91sub{margin:2px 0 10px}.v91grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.v91th{position:relative;padding:0;border:1px solid var(--line,#2a2f45);border-radius:10px;overflow:hidden;aspect-ratio:1;background:#0b0e1a;cursor:pointer}"
  +".v91th img{width:100%;height:100%;object-fit:cover;display:block}.v91th i{position:absolute;left:4px;bottom:4px;font-style:normal;font-size:10px;font-weight:800;padding:1px 5px;border-radius:6px;background:rgba(10,12,20,.75);color:#4de8b0}"
  +".v91big{border-radius:12px;overflow:hidden;background:#0b0e1a;margin:8px 0}.v91big img{display:block;width:100%;max-height:62vh;object-fit:contain}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV191={keep:function(r){v91Keep(r);return V91Q},index:function(){return v91Index()},reset:function(){V91IX=null},open:v91Open};
