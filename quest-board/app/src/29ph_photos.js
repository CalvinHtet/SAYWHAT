/* ---------- W8 + W9: the photo feed on the town board (SPEC5 part 3) ----------
   Cal, 2026-11-10: "I want the option to be able to post my workout proof or any proof to the town board for everyone to view and
   react on. The board could be like an instagram feed where you can click on the board and itll open up the post, with how many likes,
   and you can also comment on it. Only the person who posted it can delete their own comments. or the person who created the post can
   delete any comments." W9: "After a photo proof is verified and paid: option to post it to the town board with a short message or none".
   - Posting is never automatic. A quest photo that passes its check offers "Post to the town board" with an optional caption in the
     check's own result window. Any photo proof that passed this session (quests, Workout quests, level trials) can also be posted later
     from the board's "Post a photo", which also takes any other photo (W8). The time stamp burnt into a proof photo stays on it.
   - The picture is made small on the phone first: at most 1080 px (JPEG 0.82, under 900 KB) and a 360 px thumbnail for the feed. The
     host keeps the files (web.js "photos": Firebase Storage; in the sandbox a data URL in the post itself). No host (a build with no
     storage bucket, or the Claude build): the feed and the offer are simply not there.
   - Data (firestore.rules): photos/<poster>~<ms> is the post {u, name, cap, what, kind, full, thumb, sp, w, h, t}; its comments are
     photos/<post>/cm/<author>~<ms> {x, name, t}; each player's likes are photolk/<uid> {p: {<post id>: ms}} (one like per player and post).
     The ids carry the uids, so the rules decide who may delete what: a post by its poster or the owner; a comment by its author, the
     post's author or the owner. Other players' docs are hostile: strings capped, picture URLs checked.
   - The feed: the 30 newest posts as cards (photo, poster's face and name, caption, time, likes and comments). Tap a card: the photo
     full size, like or unlike, who liked, the comments, a comment box, and Delete for whoever may. It re-reads every 30 s while the
     Posts tab is on screen and every 8 s while a post is open, so a second phone sees new posts, likes and comments within that.
   - No coins or XP for posting, likes or comments (SPEC5: no farming). No save fields: nothing here is in S. */
var PH={host:null,hostT:0,posts:[],likes:{},cm:{},loaded:0,busy:0,err:"",recent:[],rn:0,pend:{},gate:null,open:null,sel:null,posting:0,lastPost:0,lastCm:0,q:null,notOwner:0};
var PHN=30,PHFULL=1080,PHTHUMB=360,PHCAP=140,PHCM=200;
function phHostGet(){if(PH.host)return Promise.resolve(PH.host);if(Date.now()-PH.hostT<20000)return Promise.resolve(null);PH.hostT=Date.now();
  try{return Promise.resolve(window.claude&&window.claude.use("photos")).then(function(h){PH.host=h&&typeof h.put==="function"&&typeof h.del==="function"?h:null;return PH.host},function(){PH.host=null;return null})}catch(e){return Promise.resolve(null)}}
function phOn(){return !!PH.host&&typeof socOn==="function"&&socOn()}
function phHallOpen(){try{return typeof htabHallOpen==="function"&&htabHallOpen()}catch(e){return false}}
/* the game's owner (Cal) may delete any post or comment (the rules check it too); in the sandbox the one local player is the owner */
function phOwner(){var W=window.QB_WEB||{};if(!MYUID||PH.notOwner)return false;return (W.owners||[]).indexOf(MYUID)>=0||!!W.sandbox}
function phMyName(){return String((S.char&&S.char.name)||"Player").slice(0,24)}
/* ---- other players' docs are hostile ---- */
/* a picture address may only be this project's Storage (QA, LEAD 2026-11-11: no tracking pixels), the sandbox's JPEG data URLs, or
   the Storage emulator when web.js runs on one; anything else draws nothing. firestore.rules (picsOk) refuses the same on write. */
function phBucket(){var b="";try{b=(window.firebase&&firebase.apps&&firebase.apps.length&&firebase.app().options.storageBucket)||""}catch(e){}
  return b||((window.QB_WEB&&QB_WEB.firebase)||{}).storageBucket||"saywhat-b7ae8.firebasestorage.app"}
function phUrl(u){u=typeof u==="string"?u:"";if(u.length<4e6&&/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(u))return u;
  if(u.length>=2000||/[\s"'<>()\\]/.test(u))return "";var b=phBucket(),em=window.QB_WEB&&QB_WEB.emulator,pre=["https://firebasestorage.googleapis.com/v0/b/"+b+"/o/"];
  if(em)pre.push("http://"+em+":9199/v0/b/"+b+"/o/");return pre.some(function(p){return u.indexOf(p)===0&&u.length>p.length})?u:""}
function phSafe(id,d){if(typeof id!=="string"||!d||typeof d!=="object")return null;var p=id.split("~");if(p.length!==2||!p[0]||!(+p[1]>0))return null;
  var th=phUrl(d.thumb),fu=phUrl(d.full)||th;if(!fu)return null;
  return {id:id,u:p[0],t:+p[1],name:fshStr(d.name,24).trim()||"Player",cap:fshStr(d.cap,PHCAP).trim(),what:fshStr(d.what,60).trim(),kind:d.kind==="photo"||d.kind==="trial"?d.kind:"quest",
    thumb:th||fu,full:fu,sp:typeof d.sp==="string"&&d.sp.indexOf("photos/"+p[0]+"/")===0&&/^[\w\/~.-]+$/.test(d.sp)?d.sp.slice(0,200):"",w:fshNum(d.w,0,4096),h:fshNum(d.h,0,4096),ba:d.ba===1?1:0}}
function phCmSafe(id,d){var p=String(id).split("~");if(p.length!==2||!p[0]||!(+p[1]>0)||!d||typeof d!=="object")return null;var x=fshStr(d.x,PHCM).trim();if(!x)return null;
  return {id:String(id),u:p[0],t:+p[1],x:x,name:fshStr(d.name,24).trim()||"Player"}}
function phPost(pid){return PH.posts.filter(function(p){return p.id===pid})[0]||null}
function phLikers(pid){return (PH.likes[pid]||[]).slice()}
function phLiked(pid){return phLikers(pid).indexOf(MYUID)>=0}
function phCanDelPost(p){return !!p&&(p.u===MYUID||phOwner())}
function phCanDelCm(p,c){return !!p&&!!c&&(c.u===MYUID||p.u===MYUID||phOwner())}
/* one write at a time to this player's own likes doc */
function phQueue(fn){var p=(PH.q||Promise.resolve()).then(fn);PH.q=p.catch(function(){});return p}
/* ---- reading ---- */
async function phLoadCm(pid){try{var q=await db.collection("photos/"+pid+"/cm").get(),o=[];(q.docs||[]).forEach(function(d){var c=phCmSafe(d.id,d.data());if(c)o.push(c)});
  o.sort(function(a,b){return a.t-b.t});PH.cm[pid]=o.slice(-200)}catch(e){}}
async function phLoadLikes(){var lk=await db.collection("photolk").get(),likes={};
  (lk.docs||[]).forEach(function(d){var x=d.data(),m=x&&x.p;if(!m||typeof m!=="object"||Array.isArray(m)||typeof d.id!=="string")return;
    Object.keys(m).slice(0,400).forEach(function(pid){if(!(+m[pid]>0))return;(likes[pid]=likes[pid]||[]).push(d.id)})});
  PH.likes=likes}
async function phLoad(force){if(PH.busy||!socOn())return;var h=await phHostGet();if(!h)return;if(!force&&Date.now()-PH.loaded<15000){phPaint();return}PH.busy=1;
  try{var col=db.collection("photos"),q=typeof col.latest==="function"?await col.latest(PHN).get():await col.get(),L=[];
    (q.docs||[]).forEach(function(d){var p=phSafe(d.id,d.data());if(p)L.push(p)});L.sort(function(a,b){return b.t-a.t});PH.posts=L.slice(0,PHN);
    await phLoadLikes();await Promise.all(PH.posts.map(function(p){return phLoadCm(p.id)}));
    PH.loaded=Date.now();PH.err=""}catch(e){PH.err=(e&&e.code)||"error"}
  PH.busy=0;phPaint()}
/* ---- the pictures: made small on the phone ---- */
function phCanvas(img,max){var w=img.naturalWidth||img.width,h=img.naturalHeight||img.height,k=Math.min(1,max/Math.max(w,h)),c=document.createElement("canvas");
  c.width=Math.max(1,Math.round(w*k));c.height=Math.max(1,Math.round(h*k));c.getContext("2d").drawImage(img,0,0,c.width,c.height);return c}
function phDataBlob(c,q){var d=c.toDataURL("image/jpeg",q),b=atob(d.split(",")[1]),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new Blob([a],{type:"image/jpeg"})}
function phBlob(c,q){return new Promise(function(ok){if(c.toBlob)c.toBlob(function(b){ok(b||phDataBlob(c,q))},"image/jpeg",q);else ok(phDataBlob(c,q))})}
function phImages(file,stamp,small){return new Promise(function(ok,no){var img=new Image(),url=URL.createObjectURL(file);
  img.onload=async function(){try{if(img.decode)await img.decode().catch(function(){});var full=phCanvas(img,small?720:PHFULL);URL.revokeObjectURL(url);
      if(stamp&&typeof window.qbStamp==="function")window.qbStamp(full,stamp);
      var fb=await phBlob(full,small?.7:.82);if(fb.size>900*1024)fb=await phBlob(full,.6);
      var tb=await phBlob(phCanvas(full,PHTHUMB),.72);ok({full:fb,thumb:tb,w:full.width,h:full.height})}catch(e){no(e)}};
  img.onerror=function(){URL.revokeObjectURL(url);no(new Error("image"))};img.src=url})}
/* ---- the photos that passed a check this session (in memory only; a reload forgets them) ---- */
function phRemember(o){if(!o||!o.file)return null;var r={k:"r"+(++PH.rn),file:o.file,stamp:o.stamp||"",kind:o.kind||"quest",what:String(o.what||"").slice(0,60),t:Date.now(),posted:0,url:""};
  PH.recent.unshift(r);PH.recent.slice(5).forEach(function(x){if(x.url)try{URL.revokeObjectURL(x.url)}catch(e){}});PH.recent=PH.recent.slice(0,5);return r}
function phRec(k){return PH.recent.filter(function(r){return r.k===k})[0]||null}
function phRecUrl(r){if(!r.url)try{r.url=URL.createObjectURL(r.file)}catch(e){}return r.url}
/* ---- writing ---- */
async function phPublish(src,cap){if(!phOn()||!src||!src.file)return false;if(PH.posting)return false;
  if(Date.now()-PH.lastPost<15000){pop("Slow down a little");return false}
  cap=String(cap||"").replace(/\s+/g," ").trim().slice(0,PHCAP);PH.posting=1;var h=PH.host,t=Date.now(),sp="photos/"+MYUID+"/"+t,up=[];
  try{var im=await phImages(src.file,src.stamp,!!h.local);
    var fu=await h.put(sp+".jpg",im.full);up.push(sp+".jpg");var th=await h.put(sp+"_t.jpg",im.thumb);up.push(sp+"_t.jpg");
    var d={u:MYUID,name:phMyName(),cap:cap,what:src.kind==="photo"?"":src.what||"",kind:src.kind||"photo",full:fu,thumb:th,sp:sp,w:im.w,h:im.h,t:t};if(src.ba)d.ba=1;/* a before and after pair (29zz_v182.js): the grid shows it whole */
    await db.doc("photos/"+MYUID+"~"+t).set(d);
    PH.lastPost=Date.now();src.posted=1;var p=phSafe(MYUID+"~"+t,d);if(p){PH.posts.unshift(p);PH.posts=PH.posts.slice(0,PHN);PH.cm[p.id]=[]}
    PH.posting=0;phPaint();pop("Posted to the town board");return true}
  catch(e){PH.posting=0;up.forEach(function(f){try{h.del(f).catch(function(){})}catch(e2){}});
    pop(e&&e.message==="image"?"That photo could not be read. Try another one.":"Could not post: "+((e&&(e.code||e.name))||"error"));return false}}
function phLike(pid){if(!phOn()||!phPost(pid))return;var on=!phLiked(pid),L=PH.likes[pid]=phLikers(pid).filter(function(u){return u!==MYUID});if(on)L.push(MYUID);phPaint();
  return phQueue(async function(){var ref=db.doc("photolk/"+MYUID),s=await ref.get(),d=s.exists?(s.data()||{}):{},m=d.p&&typeof d.p==="object"&&!Array.isArray(d.p)?d.p:{};
      if(on)m[pid]=Date.now();else delete m[pid];var ks=Object.keys(m).sort(function(a,b){return (+m[b]||0)-(+m[a]||0)}).slice(0,200),o={};ks.forEach(function(k){o[k]=+m[k]||Date.now()});
      await ref.set({p:o,t:Date.now()})}).catch(function(er){pop("Could not save the like: "+((er&&er.code)||"error"))})}
async function phComment(pid){var el=document.getElementById("phcmin"),x=el?String(el.value||"").replace(/\s+/g," ").trim().slice(0,PHCM):"";if(!x||!phOn()||!phPost(pid))return;
  if(Date.now()-PH.lastCm<3000){pop("Slow down a little");return}PH.lastCm=Date.now();var t=Date.now(),cid=MYUID+"~"+t;
  try{await db.doc("photos/"+pid+"/cm/"+cid).set({x:x,name:phMyName(),t:t});(PH.cm[pid]=PH.cm[pid]||[]).push({id:cid,u:MYUID,t:t,x:x,name:phMyName()});if(el)el.value="";phPaint()}
  catch(e){pop("Could not post the comment: "+((e&&e.code)||"error"))}}
async function phCmDel(pid,cid){var p=phPost(pid),c=(PH.cm[pid]||[]).filter(function(x){return x.id===cid})[0];if(!phCanDelCm(p,c))return;
  try{await db.doc("photos/"+pid+"/cm/"+cid).delete();PH.cm[pid]=(PH.cm[pid]||[]).filter(function(x){return x.id!==cid});phPaint()}catch(e){pop("Could not delete it: "+((e&&e.code)||"error"))}}
/* the post goes first (it leaves every feed), then its comments and its two files */
async function phDelete(pid){var p=phPost(pid);if(!phCanDelPost(p))return;
  try{await db.doc("photos/"+pid).delete()}catch(e){pop("Could not delete it: "+((e&&e.code)||"error"));return}
  PH.posts=PH.posts.filter(function(x){return x.id!==pid});closeModals();phPaint();pop("Post deleted");
  try{var q=await db.collection("photos/"+pid+"/cm").get();await Promise.all((q.docs||[]).map(function(d){return db.doc("photos/"+pid+"/cm/"+d.id).delete().catch(function(){})}))}catch(e){}
  delete PH.cm[pid];if(p.sp&&PH.host)[p.sp+".jpg",p.sp+"_t.jpg"].forEach(function(f){try{PH.host.del(f).catch(function(){})}catch(e){}})}
/* ---- drawing ---- */
function phAv(uid,name,sz){var w=null;try{w=typeof tchWho1==="function"?tchWho1(uid):null}catch(e){}
  return '<span class="ph-av" style="width:'+sz+'px;height:'+sz+'px" aria-hidden="true">'+(w&&w.look?nbAv(w.look,sz):'<span class="ph-ini">'+esc((Array.from(name||"?")[0]||"?").toUpperCase())+'</span>')+'</span>'}
var PHBUB='<svg class="ph-bub" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v6A1.5 1.5 0 0 1 12.5 11H7l-3.2 2.6c-.3.2-.8 0-.8-.4V11h0A1.5 1.5 0 0 1 2 9.5z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';
function phCounts(p){var n=phLikers(p.id).length,c=(PH.cm[p.id]||[]).length;return '<span class="ph-n"><span class="ph-heart'+(phLiked(p.id)?' on':'')+'">&#9829;</span> '+n+'<span class="ph-gap"></span>'+PHBUB+' '+c+'</span>'}
function phCard(p){return '<button type="button" class="ph-card'+(p.ba?' ph-ba':'')+'" data-act="phopen" data-p="'+esc(p.id)+'" aria-label="Photo by '+esc(p.name)+(p.cap?': '+esc(p.cap):'')+'">'
  +'<span class="ph-img"><img src="'+esc(p.thumb)+'" alt="" loading="lazy" decoding="async"></span>'
  +'<span class="ph-meta">'+phAv(p.u,p.name,20)+'<b>'+esc(p.u===MYUID?"You":p.name)+'</b><small>'+socAgo(p.t)+'</small></span>'
  +(p.cap?'<span class="ph-cap">'+esc(p.cap)+'</span>':'')+phCounts(p)+'</button>'}
function phInner(){var h='<div class="row ph-top"><h3 class="label">Photos</h3><button class="btn sm" data-act="phnew">Post a photo</button></div>';
  if(PH.err)h+='<p class="note">Could not load the photos ('+esc(PH.err)+').</p>';
  if(PH.posts.length)h+='<div class="ph-grid">'+PH.posts.map(phCard).join("")+'</div>';
  else h+='<p class="note">'+(PH.loaded?'No photos yet. Post one after a photo check, or any photo you take.':'Loading photos…')+'</p>';
  return h}
/* the Hall's Posts tab (29s_hall.js contract): the feed on top, the Town board under it */
function hallPostsHtml(){if(!PH.host){phHostGet().then(function(h){if(h&&typeof htabShown==="function"&&htabShown("posts"))render()});return ""}
  if(!socOn())return "";return '<section class="card panel ph-feed" id="phfeed">'+phInner()+'</section>'}
function hallPostsMount(){if(phOn()&&Date.now()-PH.loaded>20000)phLoad(true)}
function phLikersLine(p){var L=phLikers(p.id);if(!L.length)return "";var nm=L.map(function(u){return u===MYUID?"you":typeof sqName==="function"?sqName(u,"Someone"):"Someone"}),more=nm.length>3?nm.length-3:0;
  nm=nm.slice(0,3);return 'Liked by '+esc(nm.length>1&&!more?nm.slice(0,-1).join(", ")+" and "+nm[nm.length-1]:nm.join(", "))+(more?' and '+more+' more':'')}
function phCmHtml(p){var L=PH.cm[p.id]||[];if(!L.length)return '<p class="note ph-nocm">No comments yet.</p>';
  return L.map(function(c){return '<div class="ph-cm">'+phAv(c.u,c.name,24)+'<div><b>'+esc(c.u===MYUID?"You":c.name)+'</b> <small>'+socAgo(c.t)+'</small><p>'+esc(c.x)+'</p></div>'
    +(phCanDelCm(p,c)?'<button type="button" class="ph-x" data-act="phcmdel" data-p="'+esc(p.id)+'" data-c="'+esc(c.id)+'" aria-label="Delete this comment">&times;</button>':'')+'</div>'}).join("")}
function phLikeHtml(p){var n=phLikers(p.id).length,on=phLiked(p.id);
  return '<button type="button" class="btn sm'+(on?'':' ghost')+' ph-likeb" data-act="phlike" data-p="'+esc(p.id)+'" aria-pressed="'+on+'"><span class="ph-heart'+(on?' on':'')+'">&#9829;</span> '+(on?'Liked':'Like')+'</button><span class="note">'+n+(n===1?' like':' likes')+'</span>'
    +(n?'<p class="note ph-likers">'+phLikersLine(p)+'</p>':'')}
function phViewHtml(p){var what=p.kind==="trial"?"Level trial":p.kind==="quest"&&p.what?"Proof: "+p.what:"";
  return '<div class="card box2 ph-view" data-p="'+esc(p.id)+'"><div class="ph-vhead">'+phAv(p.u,p.name,34)+'<div><b>'+esc(p.u===MYUID?"You":p.name)+'</b><small>'+socAgo(p.t)+'</small></div></div>'
    +'<div class="ph-vimg" style="background-image:url(\''+esc(p.thumb)+'\')"><img src="'+esc(p.full)+'" alt="Photo by '+esc(p.name)+'"></div>'
    +(p.cap?'<p class="ph-vcap">'+esc(p.cap)+'</p>':'')+(what?'<p class="note ph-what">'+esc(what)+'</p>':'')
    +'<div class="ph-like" id="phlike">'+phLikeHtml(p)+'</div>'
    +'<h3 class="label ph-cmh">Comments</h3><div class="ph-cms" id="phcms">'+phCmHtml(p)+'</div>'
    +'<div class="ph-cmadd"><input id="phcmin" type="text" maxlength="'+PHCM+'" placeholder="Add a comment" aria-label="Add a comment"><button class="btn" data-act="phcm" data-p="'+esc(p.id)+'">Post</button></div>'
    +(phCanDelPost(p)?'<div class="ph-delrow" id="phdelrow"><button type="button" class="btn ghost ph-del" data-act="phdelask" data-p="'+esc(p.id)+'">Delete post</button></div>':'')
    +'</div>'}
function phOpen(pid){var p=phPost(pid);if(!p)return;closeModals();PH.open=pid;var m=modal(phViewHtml(p));m.classList.add("ph-modal");phLoadCm(pid).then(phPaint)}
/* redraws what is on screen, leaving the comment box and its text alone */
function phPaint(){var el=document.getElementById("phfeed");if(el)el.innerHTML=phInner();
  var v=document.querySelector("#layer .ph-view");if(!v){PH.open=null;return}var p=phPost(v.dataset.p);
  if(!p){var mm=v.closest(".modal");if(mm)mm.remove();PH.open=null;return}
  var lk=document.getElementById("phlike"),cm=document.getElementById("phcms");if(lk)lk.innerHTML=phLikeHtml(p);if(cm)cm.innerHTML=phCmHtml(p)}
/* ---- posting: from a check's result window, or from the board ---- */
function phShareHtml(r){return '<div class="ph-share" data-k="'+r.k+'"><input class="ph-capin" type="text" maxlength="'+PHCAP+'" placeholder="Add a caption (optional)" aria-label="Caption">'
  +(r.what&&r.kind==="quest"?'<p class="note">Everyone in town sees the photo with "'+esc(r.what)+'".</p>':'<p class="note">Everyone in town sees the photo.</p>')
  +'<button type="button" class="btn ghost" data-act="phshare" data-k="'+r.k+'">Post to the town board</button></div>'}
function phOffer(r){if(!r||!phOn()||!phHallOpen())return;var ms=document.querySelectorAll("#layer .modal"),m=ms[ms.length-1];if(!m||!/Verification succeeded/.test(m.textContent)||m.querySelector(".ph-share"))return;
  var b=m.querySelector(".btns"),d=document.createElement("div");d.innerHTML=phShareHtml(r);if(b)b.parentNode.insertBefore(d.firstChild,b);else (m.firstElementChild||m).appendChild(d.firstChild)}
function phNewHtml(){var sel=PH.sel,rec=PH.recent.filter(function(r){return !r.posted});
  return '<div class="card box2 ph-new"><span class="label">Town board</span><h2>Post a photo</h2>'
    +(rec.length?'<p class="note">Photos that passed a check today:</p><div class="ph-recent">'+rec.map(function(r){return '<button type="button" class="ph-rc'+(sel===r?' on':'')+'" data-act="phpick" data-k="'+r.k+'" aria-label="'+esc(r.what||"Proof photo")+'"><img src="'+esc(phRecUrl(r))+'" alt=""></button>'}).join("")+'</div>':'')
    +'<div class="btns"><label class="btn ghost" for="phfile">'+(rec.length?'Or choose another photo':'Choose a photo')+'</label></div><input class="vh" type="file" id="phfile" accept="image/*" aria-label="Choose a photo">'
    +(sel?'<div class="ph-prev"><img src="'+esc(sel.k?phRecUrl(sel):sel.url)+'" alt="The photo you picked"></div>':'')
    +'<input class="ph-capin" id="phcap" type="text" maxlength="'+PHCAP+'" placeholder="Add a caption (optional)" aria-label="Caption">'
    +(sel&&sel.kind==="quest"&&sel.what?'<p class="note">Everyone in town sees the photo with "'+esc(sel.what)+'".</p>':'<p class="note">Everyone in town sees the photo.</p>')
    +'<div class="btns"><button class="btn ghost" data-act="mclose">Cancel</button><button class="btn" data-act="phsend"'+(sel?'':' disabled')+'>Post</button></div></div>'}
/* Cal, 2026-11-13: pressing Post did nothing and there was no way out. A post that has not finished in 25 s gives the button back */
function phTimed(p){return Promise.race([Promise.resolve(p),new Promise(function(r){setTimeout(function(){r("slow")},25000)})]).then(function(v){if(v==="slow"){pop("Posting photos is not working right now. Try again later.");return false}return v},function(){return false})}
function phNew(){if(!phOn())return;closeModals();if(PH.sel&&!PH.sel.k&&PH.sel.url){try{URL.revokeObjectURL(PH.sel.url)}catch(e){}}PH.sel=PH.recent.filter(function(r){return !r.posted})[0]||null;var m=modal(phNewHtml());m.classList.add("ph-modal")}
function phNewPaint(){var v=document.querySelector("#layer .ph-new");if(!v)return;var c=document.getElementById("phcap"),cap=c?c.value:"";v.outerHTML=phNewHtml();var c2=document.getElementById("phcap");if(c2)c2.value=cap}
/* ---- the checks: a passed photo is remembered, and the quest's result window offers it ---- */
var phProofCheckBase=proofCheck;
proofCheck=function(id,file,hh){var now=Date.now();Object.keys(PH.pend).forEach(function(k){if(now-PH.pend[k].t>15*60000)delete PH.pend[k]});
  if(file)PH.pend[id]={file:file,stamp:stampText(),t:now};return phProofCheckBase.apply(this,arguments)};
var phVerdictBase=proofVerdict;
proofVerdict=function(q,ok){var r=phVerdictBase.apply(this,arguments);try{var P=q&&PH.pend[q.id];if(q)delete PH.pend[q.id];if(ok&&P){var rec=phRemember({file:P.file,stamp:P.stamp,kind:"quest",what:q.name});phOffer(rec)}}catch(e){}return r};
var phGateBase=handlePhoto;
handlePhoto=function(file){PH.gate=file?{file:file,stamp:stampText(),t:Date.now()}:null;var p=phGateBase.apply(this,arguments);Promise.resolve(p).then(function(){PH.gate=null},function(){PH.gate=null});return p};
var phClearBase=clearGate;
clearGate=function(){var g=PH.gate;PH.gate=null;var r=phClearBase.apply(this,arguments);try{if(g&&Date.now()-g.t<10*60000)phRemember({file:g.file,stamp:g.stamp,kind:"trial",what:"Level trial"})}catch(e){}return r};
/* ---- taps ---- */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act^=ph]");if(!b)return;var a=b.dataset.act,pid=b.dataset.p;
  if(a==="phopen"){phOpen(pid);return}
  if(a==="phnew"){phNew();return}
  if(a==="phlike"){phLike(pid);return}
  if(a==="phcm"){phComment(pid);return}
  if(a==="phcmdel"){phCmDel(pid,b.dataset.c);return}
  if(a==="phdelask"){var row=document.getElementById("phdelrow");if(row)row.innerHTML='<p class="note">Delete this post and its photo? The comments go with it.</p><div class="btns"><button type="button" class="btn" data-act="phdel" data-p="'+esc(pid)+'">Delete</button><button type="button" class="btn ghost" data-act="phdelno" data-p="'+esc(pid)+'">Keep it</button></div>';return}
  if(a==="phdelno"){var row2=document.getElementById("phdelrow");if(row2)row2.innerHTML='<button type="button" class="btn ghost ph-del" data-act="phdelask" data-p="'+esc(pid)+'">Delete post</button>';return}
  if(a==="phdel"){b.disabled=true;phDelete(pid);return}
  if(a==="phpick"){var r=phRec(b.dataset.k);if(r){if(PH.sel&&!PH.sel.k&&PH.sel.url){try{URL.revokeObjectURL(PH.sel.url)}catch(e2){}}PH.sel=r;phNewPaint()}return}
  if(a==="phsend"){var c=document.getElementById("phcap"),src=PH.sel;if(!src)return;b.disabled=true;b.textContent="Posting…";
    phTimed(phPublish(src,c?c.value:"")).then(function(ok){if(ok){if(!src.k&&src.url){try{URL.revokeObjectURL(src.url)}catch(e3){}}PH.sel=null;closeModals();phLoad(true)}else{b.disabled=false;b.textContent="Post"}});return}
  if(a==="phshare"){var r2=phRec(b.dataset.k),box=b.closest(".ph-share"),ci=box&&box.querySelector(".ph-capin");if(!r2||r2.posted)return;b.disabled=true;b.textContent="Posting…";
    phTimed(phPublish(r2,ci?ci.value:"")).then(function(ok){if(!box||!box.isConnected)return;if(ok)box.innerHTML='<p class="note ph-done">Posted to the town board.</p>';else{b.disabled=false;b.textContent="Post to the town board"}});return}});
document.addEventListener("change",function(e){var t=e.target;if(!t||t.id!=="phfile")return;var f=t.files&&t.files[0];t.value="";if(!f)return;
  if(f.type&&!/^image\//.test(f.type)){pop("That is not a photo");return}
  if(PH.sel&&!PH.sel.k&&PH.sel.url){try{URL.revokeObjectURL(PH.sel.url)}catch(e){}}PH.sel={file:f,kind:"photo",what:"",url:URL.createObjectURL(f)};phNewPaint()});
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target&&e.target.id==="phcmin"){e.preventDefault();var b=document.querySelector("[data-act=phcm]");if(b)b.click()}});
/* fresh while on screen: the feed every 30 s, an open post every 8 s */
setInterval(function(){if(document.hidden||!phOn())return;try{if(typeof htabShown==="function"&&htabShown("posts")&&!document.querySelector("#layer .modal"))phLoad(true)}catch(e){}},30000);
setInterval(function(){if(document.hidden||!phOn())return;var v=document.querySelector("#layer .ph-view");if(!v)return;var pid=v.dataset.p;
  Promise.all([phLoadCm(pid),phLoadLikes().catch(function(){})]).then(phPaint)},8000);
setTimeout(function boot(){if(typeof socOn==="function"&&socOn())phHostGet();else setTimeout(boot,5000)},4000);
/* test hook, removed at release with window.__qb (31_release.js) */
window.__qbPhotos={state:function(){return PH},load:phLoad,open:phOpen,neu:phNew,remember:phRemember,publish:phPublish,like:phLike,del:phDelete,cmdel:phCmDel,
  host:phHostGet,safe:phSafe,url:phUrl,owner:function(on){PH.notOwner=on?0:1;return phOwner()},images:phImages,
  /* a picture drawn in code, as a File, for tests: a coloured card with a label */
  file:function(label,col,w,h){var c=document.createElement("canvas");c.width=w||1600;c.height=h||1200;var x=c.getContext("2d");x.fillStyle=col||"#2d6cdf";x.fillRect(0,0,c.width,c.height);
    x.fillStyle="rgba(255,255,255,.85)";x.font="bold "+Math.round(c.height/8)+"px sans-serif";x.textAlign="center";x.fillText(label||"Test",c.width/2,c.height/2);
    return new Promise(function(ok){c.toBlob(function(b){ok(new File([b],"t.jpg",{type:"image/jpeg"}))},"image/jpeg",.9)})},
  /* sandbox: a post by another player (one of the Town Square stand-ins) with comments [[uid, name, text]] and likers [uid],
     written straight into the stand-in database */
  fake:async function(uid,name,cap,col,cms,likers){var h=await phHostGet();if(!h)return null;var f=await window.__qbPhotos.file(name,col),im=await phImages(f,"",true),t=Date.now()-Math.floor(Math.random()*36e5),pid=uid+"~"+t;
    var sp="photos/"+uid+"/"+t,d={u:uid,name:name,cap:cap||"",what:"",kind:"photo",full:await h.put(sp+".jpg",im.full),thumb:await h.put(sp+"_t.jpg",im.thumb),sp:sp,w:im.w,h:im.h,t:t};
    await db.doc("photos/"+pid).set(d);for(var i=0;i<(cms||[]).length;i++){var c=cms[i],ct=t+60000*(i+1);await db.doc("photos/"+pid+"/cm/"+c[0]+"~"+ct).set({x:c[2],name:c[1],t:ct})}
    for(var j=0;j<(likers||[]).length;j++){var ref=db.doc("photolk/"+likers[j]),s=await ref.get(),o=(s.exists&&s.data()&&s.data().p)||{};o[pid]=Date.now();await ref.set({p:o,t:Date.now()})}
    return pid}};
