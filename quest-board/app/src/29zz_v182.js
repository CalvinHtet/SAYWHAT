/* ---------- Cal 2026-11-26: before and after photos for cleaning tasks ----------
   Cal: "i would like the option to do a before and after picture for cleaning tasks such as clean my desk, or clean my room. When selecting
   this task, it will prompt you to post a before picture, and then when completing it, post the after picture. Then we can have the option
   to post to the town hall and the picture should be side by side instead of a full 2 pictures that take up a lot of space in the town hall."
   - A cleaning task (V82RX) tapped while open asks first: "Take a before photo" (the camera) or "Skip, just do it" (the usual tap).
   - The before photo stays on this phone only (localStorage, scaled to 900 px, never in the synced save); the task shows "Before ✓".
   - Tapping it again opens the photo proof as usual (even for a task that would not normally ask): that photo is the after.
   - When the after passes its check, the photo offered for the town board is one picture, before and after side by side, labelled;
     posting is still the player's choice (private until posted). The before is cleared once the task is done or after two days. */
var V82RX=/\b(clean|cleans|cleaning|tidy|tidying|declutter|decluttering|organi[sz]e|organi[sz]ing|vacuum|vacuuming|hoover|mop|mopping|sweep|sweeping|dust|dusting|scrub|scrubbing|wipe down|wash (the |my )?(dishes|car|windows)|do (the |my )?(dishes|laundry)|laundry|make (the |my )?bed|clear (out )?(the |my )?(desk|table|closet|garage))\b/i;
var V82KEY="qb-ba-",V82ASK={},V82CUR=null;
function v82Is(q){return !!q&&!q.bty&&q.rep!=="weekly4"&&V82RX.test(q.name||"")}
function v82Get(id){try{var o=JSON.parse(localStorage.getItem(V82KEY+id)||"null");if(o&&o.d&&Date.now()-o.t<2*864e5)return o;if(o)localStorage.removeItem(V82KEY+id)}catch(e){}return null}
function v82Set(id,d){try{localStorage.setItem(V82KEY+id,JSON.stringify({d:d,t:Date.now()}));return true}catch(e){return false}}
function v82Del(id){try{localStorage.removeItem(V82KEY+id)}catch(e){}}
function v82Img(src){return new Promise(function(ok,no){var im=new Image();im.onload=function(){ok(im)};im.onerror=function(){no(new Error("image"))};im.src=src})}
/* the before, scaled down on the phone */
function v82Read(file){return new Promise(function(ok,no){var u=URL.createObjectURL(file);v82Img(u).then(function(im){var w=im.naturalWidth,h=im.naturalHeight,k=Math.min(1,900/Math.max(w,h)),c=document.createElement("canvas");
    c.width=Math.round(w*k);c.height=Math.round(h*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c.toDataURL("image/jpeg",.78))},function(e){URL.revokeObjectURL(u);no(e)})})}
/* before | after, the same height, a thin gap, each labelled */
function v82Compose(beforeUrl,afterBlob){var au=URL.createObjectURL(afterBlob);
  return Promise.all([v82Img(beforeUrl),v82Img(au)]).then(function(L){URL.revokeObjectURL(au);var H=900,gap=10,ws=L.map(function(im){return Math.round(im.naturalWidth*H/im.naturalHeight)}),c=document.createElement("canvas");
    c.width=ws[0]+gap+ws[1];c.height=H;var x=c.getContext("2d");x.fillStyle="#0b0e1a";x.fillRect(0,0,c.width,H);x.drawImage(L[0],0,0,ws[0],H);x.drawImage(L[1],ws[0]+gap,0,ws[1],H);
    [["BEFORE",0],["AFTER",ws[0]+gap]].forEach(function(t){x.font="700 34px system-ui,sans-serif";var tw=x.measureText(t[0]).width;x.fillStyle="rgba(10,12,20,.72)";x.beginPath();if(x.roundRect)x.roundRect(t[1]+18,18,tw+32,52,26);else x.rect(t[1]+18,18,tw+32,52);x.fill();x.fillStyle="#fff";x.fillText(t[0],t[1]+34,56)});
    return new Promise(function(ok){c.toBlob(function(b){ok(b)},"image/jpeg",.84)})})}
function v82Ask(id){var q=S.quests.filter(function(x){return x.id===id})[0];if(!q)return;try{closeModals()}catch(e){}
  modal('<div class="card box2 v82m"><span class="label">Before and after</span><h2 style="font-size:24px">'+esc(q.name)+'</h2>'
    +'<p class="note">Snap it as it is now. When you are done, the after photo goes next to it.</p>'
    +'<div class="btns"><label class="btn" for="v82in">Take a before photo</label><button class="btn ghost" data-v82="skip" data-id="'+esc(id)+'">Skip, just do it</button></div>'
    +'<input class="vh" type="file" id="v82in" data-id="'+esc(id)+'" accept="image/jpeg" capture="environment" aria-label="Take a before photo"></div>')}
document.addEventListener("change",function(e){var t=e.target;if(!t||t.id!=="v82in")return;var f=t.files&&t.files[0],id=t.getAttribute("data-id");if(!f||!id)return;
  if(f.type&&!/jpe?g/i.test(f.type)){pop("Use the camera for the before photo");return}
  v82Read(f).then(function(d){if(!v82Set(id,d)){pop("Could not keep the photo on this phone");return}try{closeModals()}catch(x){}pop("Before photo saved. Tap the task again when it is done.");render()},function(){pop("That photo could not be read. Try again.")})});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-v82]");if(!b)return;e.preventDefault();e.stopPropagation();var id=b.getAttribute("data-id");
  if(b.getAttribute("data-v82")==="skip"){V82ASK[id]=1;try{closeModals()}catch(x){}v82Tap(id)}},true);
var v82Tap=onTap;onTap=function(id,ev){var q=S.quests.filter(function(x){return x.id===id})[0];
  try{if(q&&!S.done[id]&&!proofPend[id]&&v82Is(q)){var B=v82Get(id);if(B){V82CUR={id:id,d:B.d};askProof(id);return}if(!V82ASK[id]){v82Ask(id);return}}}catch(x){}
  return v82Tap.apply(this,arguments)};
/* the after passed: what is offered for the town board is the pair, side by side */
var v82Rem=phRemember;phRemember=function(o){var r=v82Rem.apply(this,arguments);
  try{var C=V82CUR;if(r&&C&&o&&o.kind==="quest"){var q=S.quests.filter(function(x){return x.id===C.id})[0];if(q&&o.what===q.name){V82CUR=null;r.ba=1;
        r.ready=v82Compose(C.d,o.file).then(function(b){if(b){r.file=b;if(r.url){try{URL.revokeObjectURL(r.url)}catch(x){}r.url=""}}return r},function(){return r});
        r.ready.then(function(){try{var im=document.querySelector('#layer .ph-share[data-k="'+r.k+'"] img');if(im)im.src=phRecUrl(r)}catch(x){}})}}}catch(e){}
  return r};
var v82Pub=phPublish;phPublish=function(src,cap){var self=this,a=arguments;if(src&&src.ready)return src.ready.then(function(){return v82Pub.apply(self,a)});return v82Pub.apply(this,arguments)};
/* tidy up: a finished or removed task drops its before; the rows that have one say so */
var v82Render=render;render=function(){var r=v82Render.apply(this,arguments);
  try{Object.keys(localStorage).forEach(function(k){if(k.indexOf(V82KEY)!==0)return;var id=k.slice(V82KEY.length),q=S.quests.filter(function(x){return x.id===id})[0];if(!q||(S.done&&S.done[id]&&!(V82CUR&&V82CUR.id===id)))v82Del(id)});
    [].forEach.call(document.querySelectorAll(".qmain[data-id]"),function(b){var id=b.getAttribute("data-id"),has=!!v82Get(id),c=b.querySelector(".v82chip");if(has&&!c)b.insertAdjacentHTML("beforeend",'<i class="v82chip">Before &#10003;</i>');if(!has&&c)c.remove()})}catch(e){}
  return r};
htabCss("qb-v182-css",".v82chip{display:inline-block;margin-left:8px;padding:2px 8px;border-radius:999px;font-style:normal;font-size:11px;font-weight:700;letter-spacing:.04em;background:rgba(77,232,176,.14);color:#4de8b0;border:1px solid rgba(77,232,176,.45);vertical-align:middle}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV182={rem:function(o){return phRemember(o)},is:v82Is,get:v82Get,set:v82Set,compose:v82Compose,cur:function(){return V82CUR}};
