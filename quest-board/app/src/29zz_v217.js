/* ---------- Cal 2026-11-26 (late): small fixes ----------
   Cal: "Remove the plated collar item from the smokebomb shop. It looks weird when paired with a shirt or hoodie. replace with something
   else"; "zoom out on the little circular player icon just a little bit so we can see a bit more of their head"; "The exclamation point
   for The Vault is not going away after clicking on it once"; "When a team member comes back from the dungeon crawl, i WANT their little
   walking animation to be them waving. I also want a notification exclamation point on the dungeon tab once they return"; "Is it intended
   for mossy cellar to have 6 treasure chests? If so, place them all on one line"; "Instead of "Return" on the dungeon tab, change the name
   to "Claim" And put the text for "you made it back" to "Sable has returned!" and place it on the same line as the name of the dungeon".
   - The Plated Collar is off sale (owners keep it); ROOMS paints a Smoke Bomb neck piece in its place.
   - The round head icons (nbAv: Town posts, the Players board, chat) draw the figure a little smaller, so more of the head shows.
   - The Vault door's "!" shows until the Vault is opened once that week.
   - Crawls: a teammate who is back waves beside the crawl (29zz_v210.js); the Crawls tab gets a "!" while someone waits to be claimed;
     the row reads "<Name> has returned!" next to the dungeon's name, and the button says Claim (10_app_a.js).
   - The chests always sit on one line (a dungeon has 3 today: Mossy Cellar's two Goblin King pieces and Pip). */
try{SHOP.forEach(function(it){if(it&&it[0]==="gx_smk_platecollar"&&it[6])it[6].cut=1})}catch(e){}
/* ---- round head icons: zoomed out a little ---- */
nbAv=function(L,sz){return L&&L.rig?'<span class="calav nbav" style="width:'+sz+'px;height:'+sz+'px">'+calImg(L,"still",Math.round(sz*2.1),"")+'</span>':figSvg(L||lookOf(),"30 6 40 40",sz,sz)};
/* ---- the Vault's "!" ---- */
function v217VaultWk(){try{return v201Vault().wk}catch(e){return ""}}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-shub="vault"]');if(!b)return;try{var w=v217VaultWk();if(w&&S.v217vault!==w){S.v217vault=w;persist()}}catch(x){}},true);
var v217Shop=shopHtml;shopHtml=function(){var h=v217Shop.apply(this,arguments);
  try{if(S.v217vault&&S.v217vault===v217VaultWk())h=h.replace(/(data-shub="vault"(?:(?!<\/button>)[\s\S])*?)<i class="qs-flnew" aria-label="New">!<\/i>/,"$1")}catch(e){}return h};
/* ---- Crawls: a "!" on the tab while someone is back and waiting ---- */
function v217Back(){try{var n=Date.now();return dngInit().runs.some(function(r){return r&&n>=r.end})}catch(e){return false}}
var v217Tabs=alTabs;alTabs=function(){var t=v217Tabs.apply(this,arguments);try{if(S&&S.created&&v217Back())t.away=1}catch(e){}return t};
var V217WAS=null;setInterval(function(){try{var b=v217Back();if(b!==V217WAS){V217WAS=b;alPaint();if(b&&typeof view!=="undefined"&&view==="away")render()}}catch(e){}},5000);
htabCss("qb-v217-css",".v214ch{flex-wrap:nowrap!important;overflow:hidden}.dng.run:has(.v217back){flex-direction:row;flex-wrap:wrap;align-items:center;column-gap:8px}.dng.run:has(.v217back)>:not(b):not(.v217back):not(.v210rn){flex-basis:100%}.dng.run .v217back{color:var(--good,#7be39b);font-weight:600}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV217={back:v217Back,vaultWk:v217VaultWk};
