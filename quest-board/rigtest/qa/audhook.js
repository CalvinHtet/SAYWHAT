// QA (v0.92 w-sound): records every sound the page makes, for headless Chromes that run --mute-audio. Inject before the page's own
// scripts: await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: AUDHOOK }). Then window.__aud holds:
//   ctx (AudioContexts made), starts ([{t ms since load, kind, hz, wave, user (a gesture had happened), at/end (context seconds)}] for
//   every oscillator / buffer source started; end is its stop time), plays (HTMLMediaElement.play calls: src), errs.
// A "burst" is a run of starts less than 150 ms apart: one sound effect; its span is the last stop minus the first start (seconds).
const AUDHOOK = String.raw`(function(){
  var A=window.__aud={ctx:0,starts:[],plays:[],errs:[],t0:performance.now()};
  var now=function(){return Math.round(performance.now()-A.t0)};
  var act=function(){try{return !!(navigator.userActivation&&navigator.userActivation.hasBeenActive)}catch(e){return null}};
  ['AudioContext','webkitAudioContext'].forEach(function(n){var C=window[n];if(!C||C.__qa)return;
    var W=function(){A.ctx++;return Reflect.construct(C,arguments,new.target||W)};W.prototype=C.prototype;W.__qa=1;try{window[n]=W}catch(e){}});
  /* AudioBufferSourceNode has its own start(), so both prototypes are wrapped */
  [window.AudioScheduledSourceNode,window.AudioBufferSourceNode].forEach(function(K){var S=K&&K.prototype;if(!S||!Object.prototype.hasOwnProperty.call(S,'start'))return;
  if(S&&S.start){var st=S.start,sp=S.stop;
    S.start=function(w){try{var r={t:now(),kind:this.constructor&&this.constructor.name,hz:this.frequency?Math.round(this.frequency.value):null,wave:this.type||null,user:act(),at:+(w||this.context.currentTime).toFixed(3),end:null};this.__qa=r;A.starts.push(r)}catch(e){A.errs.push(String(e))}return st.apply(this,arguments)};
    if(Object.prototype.hasOwnProperty.call(S,'stop'))S.stop=function(w){try{if(this.__qa)this.__qa.end=+(w||this.context.currentTime).toFixed(3)}catch(e){}return sp.apply(this,arguments)}}});
  var P=window.HTMLMediaElement&&HTMLMediaElement.prototype;
  if(P&&P.play){var pl=P.play;P.play=function(){try{A.plays.push({t:now(),src:String(this.currentSrc||this.src||'').slice(-60)})}catch(e){}return pl.apply(this,arguments)}}
})();`;
// the bursts since a mark (ms): [{t, n starts, span s, kinds, waves, hz}]
const bursts = (aud, since = 0) => {
  const out = [];
  aud.starts.filter((x) => x.t >= since).forEach((x) => {
    const b = out[out.length - 1];
    if (b && x.t - b.last < 150) { b.n++; b.last = x.t; b.s.push(x); } else out.push({ t: x.t, last: x.t, n: 1, s: [x] });
  });
  return out.map((b) => ({ t: b.t, n: b.n, span: +(Math.max(...b.s.map((x) => x.end || x.at)) - Math.min(...b.s.map((x) => x.at))).toFixed(2),
    kinds: [...new Set(b.s.map((x) => x.kind))].join('+'), waves: [...new Set(b.s.map((x) => x.wave).filter(Boolean))].join('+'),
    hz: [...new Set(b.s.map((x) => x.hz).filter(Boolean))].slice(0, 6) }));
};
module.exports = { AUDHOOK, bursts };
