/* ---------- Cal 2026-11-25: the Board starts at the tasks ----------
   Cal: "The C icon on the tier 2 advancement trial is covering the font. I think we can also consolidate this whole first page into
   the profile page. The main board you can't even see the tasks until you scroll down a bit. Too cluttered"
   - The Board keeps the header, then the add-task box and the tasks (and First steps for a new player, the bounties, Completed).
     The level bar, the NEXT line, the Daily Quest card and the level trial move into the profile, under the level card.
   - While a level trial waits, one slim row on the Board says so and opens the profile at the trial (it blocks levelling, so it
     must not be missed). "Show me the trial" in the gate window does the same.
   - The trial's title no longer runs under its emblem. */
var V65GO="";
function v65Parts(){var o={gate:"",next:"",dq:""};try{var d=document.createElement("div");d.innerHTML=V65BASE();var g=d.querySelector("section.card.gate"),n=d.querySelector(".zx-next"),q=d.querySelector("section.card.dq");
    o.gate=g?g.outerHTML:"";o.next=n?n.outerHTML.replace(/waiting below/g,"waiting above"):"";o.dq=q?q.outerHTML:""}catch(e){}return o}
var V65BASE=boardHtml;boardHtml=function(){var h=V65BASE.apply(this,arguments);
  try{var d=document.createElement("div");d.innerHTML=h;var g=d.querySelector("section.card.gate");
    [".bline",".zx-next","section.card.dq","section.card.gate"].forEach(function(s){var e=d.querySelector(s);if(e)e.remove()});
    if(g){var at=d.querySelector(".strip");var row='<button type="button" class="v65gate" data-act="char" data-v65="gate"><span class="label">Level trial</span><span>Waiting for you. Pass it to keep levelling.</span><b>Open &rsaquo;</b></button>';
      if(at)at.insertAdjacentHTML("afterend",row);else d.insertAdjacentHTML("afterbegin",row)}
    h=d.innerHTML}catch(e){}
  return h};
/* the profile: under the level card, the trial (when one waits), the NEXT line and the Daily Quest */
var v65Prof=profileHtml;profileHtml=function(){var h=v65Prof.apply(this,arguments);
  try{var P=v65Parts(),add=P.gate+P.next+P.dq;if(!add)return h;var d=document.createElement("div");d.innerHTML=h;var hero=d.querySelector("section.hero");
    if(hero)hero.insertAdjacentHTML("afterend",add);else d.insertAdjacentHTML("afterbegin",add);h=d.innerHTML}catch(e){}
  return h};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-v65=gate]");if(b)V65GO="gate"},true);
var v65Char=charModal;charModal=function(){var m=v65Char.apply(this,arguments);
  try{if(V65GO==="gate"){V65GO="";setTimeout(function(){var g=document.querySelector("#layer .prof section.card.gate");if(g)g.scrollIntoView({block:"start",behavior:"smooth"})},60)}}catch(e){}return m};
var v65Gate=gateOpened;gateOpened=function(){var r=v65Gate.apply(this,arguments);
  try{var b=document.querySelector("#layer #gok");if(b)b.onclick=function(){var m=b.closest(".modal");if(m)m.remove();V65GO="gate";charModal()}}catch(e){}return r};
/* QA: the welcome tour's "Your level" step pointed at the level bar; it points at the header's card, which opens the profile */
try{TOURS.forEach(function(t){t.steps.forEach(function(st){if(st.sel===".bline"&&st.t==="Your level"){st.sel=".strip .avbtn";st.x="Your card. Tap it for your profile: your level, XP, the Daily Quest and your class. Each new level pays coins, and now and then opens something new."}})})}catch(e){}
/* tours that pointed at the Board's level bar or Daily Quest card */
try{TOURS.forEach(function(t){if(t.id==="trophy"||t.id==="freeze"){var st=t.steps[0];t.ready=function(){return view==="board"&&(t.id!=="freeze"||(S.freezes||0)>0)&&(t.id!=="trophy"||tourAreaOpen("trophy"))&&!!tourVis(".strip .avbtn")};
      t.steps=[{sel:".strip .avbtn",t:st.t,get x(){return String(typeof st.x==="string"?st.x:st.x).replace(/Tap your level bar/g,"Tap your card")}}]}})}catch(e){}
htabCss("qb-v165-css",".card.gate h2{padding-right:78px}.card.gate .label.lbi{padding-right:78px}"
  /* in the profile (a narrower, centred window) the trial reads left-aligned at a size that fits its longest word */
  +".prof .card.gate{text-align:left;scroll-margin-top:64px}.prof .card.gate h2{font-size:clamp(18px,6vw,30px);line-height:1.08;overflow-wrap:break-word;padding-right:0}.prof .card.gate .label.lbi{display:block;padding-right:72px;min-height:62px;box-sizing:border-box}/* the label sits beside the emblem and is as tall as it, so the title below has the card's full width */"
  /* QA: in a class theme's wide display font the title broke mid-word at 320; the opening scroll left the close button on the emblem; the class title ran past the card */
  +".prof.v61 .v61cls h3{font-size:clamp(15px,4.9vw,28px);line-height:1.1;overflow-wrap:break-word;min-width:0}.prof.v61 .v61clshead>div{min-width:0}@media (max-width:370px){.prof.v61 .v61clshead{grid-template-columns:64px 1fr;gap:10px}.prof.v61 .v61clshead svg{width:64px;height:64px}}"
  +".v65gate{display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto;gap:2px 12px;align-items:center;width:100%;margin:10px 0 4px;padding:12px 14px;border-radius:14px;border:1px solid var(--gold,#ffc857);background:color-mix(in srgb,var(--gold,#ffc857) 10%,transparent);color:var(--fg,inherit);text-align:left;font:inherit;cursor:pointer}"
  +".v65gate .label{grid-column:1;color:var(--gold,#ffc857)}.v65gate>span:not(.label){grid-column:1}.v65gate b{grid-column:2;grid-row:1/span 2;color:var(--gold,#ffc857);white-space:nowrap}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV165={parts:v65Parts};
