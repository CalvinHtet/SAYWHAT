/* ---------- Cal 2026-11-26: photos are made ready in the background ----------
   Cal (idea 4, yes): background photo processing. The photo check already runs in the background (30_app_b.js proofPend); what still
   held the screen was decoding a full camera photo (12 MP and more) and shrinking it on the page itself: when a photo is posted to the
   town board (29ph_photos.js phImages), when a before photo is kept, and when a before and after pair is put together (29zz_v182.js).
   - That work now runs in a worker (createImageBitmap + OffscreenCanvas), off the page, so taps and scrolling never wait on it.
   - A photo that passed its check is made ready right away, while nothing else is happening, so "Post" sends at once.
   - A phone without worker canvases (older Safari) does it the old way on the page, exactly as before. */
var V89SRC='self.onmessage=async function(e){var m=e.data;try{var bmp=await createImageBitmap(m.file);var w=bmp.width,h=bmp.height,k=Math.min(1,m.max/Math.max(w,h)),W=Math.max(1,Math.round(w*k)),H=Math.max(1,Math.round(h*k));'
  +'var c=new OffscreenCanvas(W,H),x=c.getContext("2d");x.imageSmoothingQuality="high";x.drawImage(bmp,0,0,W,H);bmp.close&&bmp.close();'
  +'var full=await c.convertToBlob({type:"image/jpeg",quality:m.q});if(m.cap&&full.size>m.cap)full=await c.convertToBlob({type:"image/jpeg",quality:m.q2||.6});var thumb=null;'
  +'if(m.thumb){var t=Math.min(1,m.thumb/Math.max(W,H)),tw=Math.max(1,Math.round(W*t)),th=Math.max(1,Math.round(H*t)),c2=new OffscreenCanvas(tw,th),y=c2.getContext("2d");y.imageSmoothingQuality="high";y.drawImage(c,0,0,tw,th);thumb=await c2.convertToBlob({type:"image/jpeg",quality:m.tq||.72})}'
  +'self.postMessage({id:m.id,ok:1,full:full,thumb:thumb,w:W,h:H})}catch(er){self.postMessage({id:m.id,ok:0,err:String(er&&er.message||er)})}};';
var V89W=null,V89N=0,V89CB={},V89OFF=0;
function v89Can(){return !V89OFF&&typeof Worker!=="undefined"&&typeof OffscreenCanvas!=="undefined"&&typeof createImageBitmap!=="undefined"&&typeof Blob!=="undefined"}
function v89Worker(){if(V89W)return V89W;var u=URL.createObjectURL(new Blob([V89SRC],{type:"text/javascript"}));V89W=new Worker(u);
  V89W.onmessage=function(e){var d=e.data,cb=V89CB[d.id];if(!cb)return;delete V89CB[d.id];if(d.ok)cb.ok(d);else cb.no(new Error(d.err||"worker"))};
  V89W.onerror=function(){V89OFF=1;Object.keys(V89CB).forEach(function(k){V89CB[k].no(new Error("worker"));delete V89CB[k]})};return V89W}
/* scale a photo in the worker: {full, thumb, w, h} */
function v89Scale(file,o){return new Promise(function(ok,no){if(!v89Can()||!file)return no(new Error("noworker"));try{var id=++V89N;V89CB[id]={ok:ok,no:no};
    v89Worker().postMessage({id:id,file:file,max:o.max,q:o.q||.82,q2:o.q2,cap:o.cap,thumb:o.thumb,tq:o.tq})}catch(e){no(e)}})}
/* the town board's pictures: worker first, the old way if it can't; a photo made ready earlier is used as is */
var V89READY=typeof WeakMap!=="undefined"?new WeakMap():null;
var v89Imgs=phImages;phImages=function(file,stamp,small){var self=this,a=arguments,key=small?"s":"f";
  try{var c=V89READY&&V89READY.get(file);if(c&&c[key])return c[key]}catch(e){}
  var p=v89Scale(file,{max:small?720:PHFULL,q:small?.7:.82,q2:.6,cap:small?0:900*1024,thumb:PHTHUMB,tq:.72}).then(function(d){return {full:d.full,thumb:d.thumb,w:d.w,h:d.h}},function(){return v89Imgs.apply(self,a)});
  try{if(V89READY&&file&&typeof file==="object"){var o=V89READY.get(file)||{};o[key]=p;V89READY.set(file,o);p.catch(function(){try{var z=V89READY.get(file);if(z)delete z[key]}catch(e){}})}}catch(e){}
  return p};
/* a photo that passed its check is made ready while nothing else is going on */
function v89Pre(r){try{var go=function(){if(!r||!r.file||r.posted)return;var small=!!(PH.host&&PH.host.local);phImages(r.file,"",small).catch(function(){})};
    if(window.requestIdleCallback)requestIdleCallback(go,{timeout:2500});else setTimeout(go,1200)}catch(e){}}
var v89Rem=phRemember;phRemember=function(o){var r=v89Rem.apply(this,arguments);
  try{if(r){if(r.ready&&r.ready.then)r.ready.then(function(){v89Pre(r)});else v89Pre(r)}}catch(e){}return r};
/* before and after (29zz_v182.js): the before is shrunk in the worker, and the after is shrunk before the pair is drawn */
var v89Read=v82Read;v82Read=function(file){var self=this,a=arguments;
  return v89Scale(file,{max:900,q:.78}).then(function(d){return new Promise(function(ok,no){var fr=new FileReader();fr.onload=function(){ok(fr.result)};fr.onerror=function(){no(new Error("read"))};fr.readAsDataURL(d.full)})}).catch(function(){return v89Read.apply(self,a)})};
var v89Comp=v82Compose;v82Compose=function(beforeUrl,afterBlob){var self=this;
  return v89Scale(afterBlob,{max:1400,q:.9}).then(function(d){return v89Comp.call(self,beforeUrl,d.full)},function(){return v89Comp.call(self,beforeUrl,afterBlob)})};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV189={can:v89Can,scale:v89Scale,imgs:function(f,s){return phImages(f,"",s)},ready:function(f){return !!(V89READY&&V89READY.get(f))},off:function(v){V89OFF=v?1:0}};
