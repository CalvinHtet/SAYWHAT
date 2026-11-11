/* ---------- w-sound (v0.92, W56): purchase sounds for everyone ----------
   Cal, 2026-11-10: "Can we add these sounds to the game for things you buy and upgrade? Such as buying a shop item or upgrade will
   have a cash or coin sound?" Before this only a bought Shop sound pack made sounds (IF_SND, ifSound, 16_interface.js). Every player
   now hears a small default set, synthesized in WebAudio (no audio files, nothing to license):
     buy    a coin "ka-ching": a Shop item (buy, 10_app_a.js), a checkout (qsconfirm, 15_shop.js), a hire, a paint job, a decor piece
     build  a clunk, then a coin: a room upgrade (raddon, 30_app_b.js)
     big    a heavier clunk and three coins: a room on a new lot (rdo), an upgrade that opens a room or has its own splash
     coins  a short shower of coins: collecting business coins (rcollect, rall)
     chest  a longer shower: each Daily Quest chest (dqCheck, 29e_economy.js)
   A bought sound pack replaces these with its own notes (QBSND_PACK). The profile's Sound switch (S.sndOff; absent means on, so old
   saves need nothing) silences every sound in the game, packs included. Nothing plays while the page is hidden or before the
   player's first tap or key (browsers block it anyway), so never on load. Each sound is under 0.6 s and quiet, and the audio
   context is suspended while the page is hidden. */
var QBSND_PACK={buy:"buy",build:"buy",big:"crit",coins:"done",chest:"crit",on:"done"},QBSND_T={},QBSND_NZ=null;
function sndOn(){return !(S&&S.sndOff)&&!document.hidden&&!(navigator.userActivation&&!navigator.userActivation.hasBeenActive)}
/* one ringing coin: a sine and its bell partial, a fast attack and an exponential fall */
function sndDing(ac,out,t,hz,vol,dec){[[hz,1],[hz*2.76,.3]].forEach(function(p){var o=ac.createOscillator(),g=ac.createGain();o.type="sine";o.frequency.value=p[0];
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol*p[1],t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+dec);o.connect(g);g.connect(out);o.start(t);o.stop(t+dec+.02)})}
/* a thud whose pitch falls: a fitting going in */
function sndThud(ac,out,t,hz,vol,dec){var o=ac.createOscillator(),g=ac.createGain();o.type="sine";o.frequency.setValueAtTime(hz,t);o.frequency.exponentialRampToValueAtTime(hz*.35,t+dec);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+dec);o.connect(g);g.connect(out);o.start(t);o.stop(t+dec+.02)}
/* a short burst of filtered noise: the "ka" of a till (high) or a knock on wood (low) */
function sndNoise(ac,out,t,dur,vol,type,hz){
  if(!QBSND_NZ){var n=Math.floor(ac.sampleRate*.25),d;QBSND_NZ=ac.createBuffer(1,n,ac.sampleRate);d=QBSND_NZ.getChannelData(0);for(var i=0;i<n;i++)d[i]=Math.random()*2-1}
  var s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=QBSND_NZ;f.type=type;f.frequency.value=hz;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(out);s.start(t);s.stop(t+dur+.02)}
function qbSnd(kind){
  if(!sndOn())return;var now=Date.now();if(now-(QBSND_T[kind]||0)<120)return;QBSND_T[kind]=now;
  var pk=eqItem("sound");if(pk&&IF_SND[pk[0]]){ifSound(QBSND_PACK[kind]||"buy");return}
  try{
    IF_AC=IF_AC||new (window.AudioContext||window.webkitAudioContext)();if(IF_AC.state==="suspended")IF_AC.resume();
    var ac=IF_AC,t=ac.currentTime+.01,out=ac.createGain(),i;out.gain.value=.5;out.connect(ac.destination);
    if(kind==="buy"){sndNoise(ac,out,t,.03,.1,"highpass",3500);sndDing(ac,out,t+.02,1568,.14,.22);sndDing(ac,out,t+.09,2093,.14,.38)}
    else if(kind==="build"){sndThud(ac,out,t,150,.35,.14);sndNoise(ac,out,t,.05,.12,"lowpass",500);sndDing(ac,out,t+.12,1760,.12,.34)}
    else if(kind==="big"){sndThud(ac,out,t,120,.42,.2);sndNoise(ac,out,t,.08,.16,"lowpass",420);[1319,1568,2093].forEach(function(hz,k){sndDing(ac,out,t+.14+k*.08,hz,.12,.28)})}
    else if(kind==="coins"){for(i=0;i<6;i++)sndDing(ac,out,t+i*.045+Math.random()*.015,2200+Math.random()*1300,.07,.1)}
    else if(kind==="chest"){sndNoise(ac,out,t,.06,.12,"lowpass",900);for(i=0;i<9;i++)sndDing(ac,out,t+.05+i*.042+Math.random()*.015,2000+Math.random()*1600,.07,.11)}
    else sndDing(ac,out,t,1568,.1,.25);
    setTimeout(function(){try{out.disconnect()}catch(x){}},1200);
  }catch(e){}
}
document.addEventListener("visibilitychange",function(){try{if(document.hidden&&IF_AC&&IF_AC.state==="running")IF_AC.suspend()}catch(e){}});

/* the switch, beside Wardrobe at the top of the profile (charModal, 10_app_a.js). iOS plays WebAudio through the silent switch, so
   it has to be easy to find. */
function sndBtn(){var on=!(S&&S.sndOff);return '<button class="btn ghost sndtog" data-act="sndtog" aria-pressed="'+on+'">Sound: '+(on?'on':'off')+'</button>'}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=sndtog]");if(!b||!S)return;e.stopPropagation();
  S.sndOff=S.sndOff?0:1;persist();b.outerHTML=sndBtn();pop(S.sndOff?"Sound off":"Sound on");if(!S.sndOff)qbSnd("on")},true);
