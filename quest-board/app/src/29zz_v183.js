/* ---------- Cal 2026-11-26: photos stay untouched ----------
   Cal: "For before and after photos, no need to time stamp. Also no need to time stamp any picture actually. The post itself should have a
   date and time and the picture should be untouched in order to keep it clean."
   - No time stamp is burnt into any photo any more (web.js qbStamp is a no-op from here), and the photo checker is no longer asked to
     read one (stampText empty). The proof still has to be a fresh camera photo: the JPEG-only camera input, the photo's own time
     (EXIF, under 30 minutes) and the once-only image check stay.
   - A town board post shows its date and time ("Nov 26, 3:15 PM") beside how long ago it was. */
window.qbStamp=function(){};
stampText=function(){return ""};
function v83When(t){try{return new Date(t).toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch(e){return ""}}
var v83View=phViewHtml;phViewHtml=function(p){var h=v83View.apply(this,arguments);try{var ago=socAgo(p.t),w=v83When(p.t);if(w)h=h.replace("<small>"+ago+"</small>",'<small>'+esc(w)+' &middot; '+ago+'</small>')}catch(e){}return h};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV183={when:v83When,stamp:function(){return stampText()},view:function(p){return phViewHtml(p)}};
/* QA 5cdb0ddd LOW: the side-quest verdict no longer lays a time over the photo either (the message says when it was taken) */
htabCss("qb-v183-css",".sdq-shot .sdq-stamp{display:none!important}");
