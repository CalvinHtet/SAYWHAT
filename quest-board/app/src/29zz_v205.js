/* ---------- Cal 2026-11-26: the profile, tighter; Effects lives here ----------
   Cal: "Move the effects tab in the interface shop into the profile page as an effects button below the notifications on off button.
   Also group those 4 buttons closer together. There is too much space in between. Move the x in the profile page on the same height as
   the profile banner picture. Too much dead space".
   - The profile's buttons: Closet, Change banner, Notifications, Effects, close together (6 px apart, a little shorter).
   - Effects opens your interface effects (on/off, all on, all off) in a window of its own; the Interface shop has no Effects tab.
   - The top of the profile moves up so the banner starts level with the close button. */
function v205Fx(){try{var m=modal('<div class="card box2 v205fx"><span class="label">Effects</span><h2 style="font-size:24px">Your interface effects</h2><div class="v205body">'+v61FxHtml()+'</div><div class="btns"><button class="btn ghost" data-act="mclose">Close</button></div></div>');return m}catch(e){}}
var v205Char=charModal;charModal=function(){var m=v205Char.apply(this,arguments);
  try{var box=document.querySelector("#layer .prof .v61btns");if(box&&!box.querySelector(".v205fxb")){var n=box.querySelector(".v93tog");var h='<button class="btn ghost v205fxb" data-v205="fx">Effects</button>';if(n)n.insertAdjacentHTML("afterend",h);else box.insertAdjacentHTML("beforeend",h)}}catch(e){}
  return m};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-v205="fx"]');if(b){e.preventDefault();e.stopPropagation();v205Fx();return}
  /* a switch in the Effects window redraws the window (29zz_v161.js only redraws the screen) */
  var t=e.target.closest&&e.target.closest("[data-act=fxtog],[data-act=fxall]"),w=t&&t.closest(".v205fx");if(w)setTimeout(function(){var bd=w.querySelector(".v205body");if(bd)bd.innerHTML=v61FxHtml()},0)},true);
/* the Interface shop: no Effects tab */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-act="iftab"][data-v="fx"]');if(b){e.preventDefault();e.stopImmediatePropagation();v205Fx()}},true);
var v205R=render;render=function(){try{if(typeof V59TAB!=="undefined"&&V59TAB==="fx")V59TAB="ban"}catch(e){}var r=v205R.apply(this,arguments);
  /* the Interface door no longer lists effects */
  try{var d=document.querySelector('[data-shub="iface"] small'),M={"Banners and effects":"Banners","Banners, effects, upgrades and interface":"Banners, upgrades and interface"};if(d&&M[d.textContent.trim()])d.textContent=M[d.textContent.trim()]}catch(e){}return r};
htabCss("qb-v205-css",'.qshop [data-act="iftab"][data-v="fx"]{display:none!important}'
  +".prof.v61 .v61btns{display:flex;flex-direction:column;gap:6px!important;margin-top:8px}.prof.v61 .v61btns .btn{margin:0!important;min-height:38px;padding-top:7px;padding-bottom:7px}"
  +".prof.v61 .v61top{margin-top:-53px}.prof.v61 .v61id>h2{padding-right:44px}.prof.v61 .v61btns .btn{white-space:nowrap;padding-left:10px;padding-right:10px}"
  +".v205fx .v205body{max-height:62vh;overflow:auto}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV205={fx:v205Fx};
