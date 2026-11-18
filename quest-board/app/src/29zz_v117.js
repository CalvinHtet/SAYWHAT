/* ---------- v1.17: pieces gone for good (Cal, 2026-11-17, via ROOMS) ----------
   Cal: "Get rid of all durags and anything that could be misinterpreted as cultural appropriation. We are all asian who play this so
   stuff like a durag, or african clothing, or stuff that makes you look like a ghetto mexican, or very asian cultural clothing is
   offensive." ROOMS's list (every Shop row checked by name, line and icon): OVERPASS's durag and paisley bandana, and SMOKE BOMB's
   ninja-costume pieces. Unlike the audit's cut (ZXCUT, 29zx_simple.js: off sale, owners keep wearing), these are gone for everyone:
   off sale everywhere (the cut flag), not drawn and not in any Wardrobe even for an owner, and an owner gets the piece's price back
   once (S.goneRef). SMOKE BOMB, left with one piece until its new techwear arrives, is held out of the drops and loses "ninja anime". */
var V17GONE=["gx_o_durag","gx_o_bandana","gx_smk_band","gx_smk_wrap","gx_smk_cowl","gx_smk_tape","gx_smk_pouch","gx_smk_mesh",
  "gx_smk_cargo","gx_smk_hakama","gx_smk_shorts","gx_smk_sandal","gx_smk_tabi","gx_smk_runner"];
SHOP.forEach(function(it){if(it&&it[6]&&V17GONE.indexOf(it[0])>=0){it[6].cut=1;it[6].gone=1}});
var v17Fits=itemFits;itemFits=function(it){if(it&&it[6]&&it[6].gone)return false;return v17Fits.apply(this,arguments)};
var v17Groups=qsGroups;qsGroups=function(pick){return v17Groups.call(this,function(x){if(x&&x[6]&&x[6].gone)return false;return pick(x)})};
/* the refund: once per piece, at its price today; it comes off the character too */
function v17Refund(){try{if(!loaded||!S||!S.created||!S.owned)return;var got=0,n=0;S.goneRef=S.goneRef||{};
    V17GONE.forEach(function(id){if(!S.owned[id]||S.goneRef[id])return;var it=shopItem(id);var c=it?(+it[3]||0):0;S.goneRef[id]=c||1;delete S.owned[id];
      if(S.eq)Object.keys(S.eq).forEach(function(sl){if(S.eq[sl]===id)delete S.eq[sl]});S.coins+=c;got+=c;n++});
    if(n){persist();render();pop("Retired "+n+" piece"+(n>1?"s":"")+" from the Shop: +"+got.toLocaleString()+" coins back")}}catch(e){}}
setInterval(v17Refund,5000);
/* SMOKE BOMB: held until its new pieces are in; no "ninja anime" under its name */
DROPS.hold.push({from:"2026-11-17",until:"",ids:["smk"]});
BRANDS.forEach(function(b){if(b.id==="smk"){b.sub="techwear";b.tag="Vanish in style"}});
