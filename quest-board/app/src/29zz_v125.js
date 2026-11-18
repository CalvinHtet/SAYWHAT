/* ---------- v1.25: your character's emotes, and a side stretch (Cal, 2026-11-18) ----------
   Cal: "Can you add more player animations such as emotes that they do randomly? They can have a waving animation, or a thinking one as
   they tap their feet, I would also like a better stretching animation that makes them stretch from side to side instead of this current
   animation that looks like they are spreading their wings." After a preview on one outfit and the sleeve-tear fix (rig.json fineSlots,
   meshStepFine: a finer mesh for the body, tops and arm pieces), Cal: "yes to all".
   - data/poses.json: thinking (arms crossed, head tilt, the foot tapping), a side stretch (hands on hips, bend to one side, the other),
     and a wave eased in and out of standing (bone poses, no new art; a hand to the chin or arms overhead would cross the big chibi head).
     The Loft's short stretch (gym spots, wandering) is the side stretch now, not the painted "yawn" with the arms out.
   - Here: your character, standing still in a room, plays one of the three every 25-45 s, in turn. Its frames are drawn a few seconds
     ahead (every other frame, as visitors' emotes are), and it starts only once they are ready, so it never stutters on a new outfit.
     The thinking one shows a "..." bubble (the Loft's own emote bubble, lfEmoG). Walking off cancels it. */
var V25EMO=["waveP","think","stretchSide"];
function v25Gap(){return 25000+Math.random()*20000}
/* every other frame of a clip: asks for the missing ones (the bridge queues each once) and says whether all are ready */
function v25Ready(ch,clip){var c=QBLoft.clips&&QBLoft.clips[clip];if(!c)return false;var ok=true;
  for(var f=0;f<c.frames;f+=2)if(!QBLoft.frame(ch,clip,f))ok=false;return ok}
var v25RS0=lfRigState0;lfRigState0=function(a){var r=v25RS0.apply(this,arguments);
  try{if(!r||!r.ch||a.role!=="me"||!QBLoft.clips||!QBLoft.clips.think)return r;
    var now=performance.now(),st=a._pe||(a._pe={next:now+v25Gap(),n:Math.floor(Math.random()*V25EMO.length),em:null,warm:null,t0:0});
    if(st.em){var c=QBLoft.clips[st.em],f=Math.floor((now-st.t0)/1000*c.fps);
      if(r.clip!=="idle"||f>=c.frames){if(st.em==="think"&&a.emo==="...")a.emo=null;st.em=null;st.next=now+v25Gap();return r}
      return {ch:r.ch,clip:st.em,f:f-f%2}}
    if(r.clip!=="idle"||a.leaving||(a.alpha!=null&&a.alpha<1))return r;
    if(!st.warm&&now>=st.next-4000){st.warm=V25EMO[st.n%V25EMO.length];st.n++}
    if(st.warm){var ready=v25Ready(r.ch,st.warm);
      if(now>=st.next){if(!ready){st.next=now+1500;return r}
        var cw=QBLoft.clips[st.warm],dur=cw.frames/cw.fps;st.em=st.warm;st.warm=null;st.t0=now;
        /* stay put long enough to finish it */
        if(a.mode==="do")a.t=Math.max(a.t||0,dur+.3);
        if(st.em==="think"){a.emo="...";a.emot=dur-.4}
        return {ch:r.ch,clip:st.em,f:0}}}}catch(e){}
  return r};
