/* ---------- watering the Garden (Cal, 2026-11-05: "I want an option that requires us to water our plants. And then a
   sprinkler system upgrade gets added later on to automate it.") ----------
   The beds grow only while watered. A watering keeps them damp for ECON.waterH hours (a day); rain counts; the Sprinklers
   upgrade (g_spr) keeps them watered for good. A Garden starts with its first day watered. ROOMS draws the look (dry and
   damp beds, the watering can, the gardener, the mist) from window.gdWatered(); data-act="gdwater" waters from anywhere. */
function gdHasSpr(){return S.base.slots.some(function(r){return r&&r.t==="garden"&&r.a&&r.a.g_spr})}
function gdWateredAt(t){if(!hasRoom("garden"))return false;if(S.base.gwater==null)S.base.gwater=Date.now()+ECON.waterH*36e5;
  return gdHasSpr()||(typeof LFW!=="undefined"&&LFW.wx==="rain")||S.base.gwater>t}
function gdWatered(){return gdWateredAt(Date.now())}
function gdWater(){simulate();S.base.gwater=Date.now()+ECON.waterH*36e5;persist();render();
  var om=document.querySelector(".rmodal .rm-scroll");if(om)roomModal(+om.dataset.i);pop("Watered. The beds stay damp for "+ECON.waterH+" hours.")}
function gdWaterHtml(){var left=Math.max(0,(S.base.gwater||0)-Date.now()),hrs=Math.ceil(left/36e5);
  if(gdHasSpr())return '<p class="note gd-water"><b>Sprinklers</b> keep the beds watered.</p>';
  var rain=typeof LFW!=="undefined"&&LFW.wx==="rain";
  return '<div class="gd-water'+(gdWatered()?'':' dry')+'"><p class="note">'+(rain?'Rain is watering the beds today.':gdWatered()?'Watered. The beds stay damp for about '+hrs+' more hour'+(hrs>1?'s':'')+'.':'<b>The beds are dry.</b> Nothing grows until you water them.')+'</p>'
    +'<button class="btn'+(gdWatered()?' ghost':'')+'" data-act="gdwater">'+(gdWatered()?'Water again':'Water the plants')+'</button></div>'}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=gdwater]");if(!b)return;gdWater()});
/* the growth figure in the Garden window says 0 while the beds are dry (gdRate is ROOMS's, wrapped, not edited) */
var gdRateBase=gdRate;gdRate=function(){return gdWatered()?gdRateBase():0};
window.gdWatered=gdWatered;window.gdWater=gdWater;
/* the Garden's words (LEAD's part of the Garden split; ROOMS's 22_garden.js is not edited): the story calls it the empty lot
   next to your building, and the Restaurant opens from it by Knock Through (QA) */
ROOMT.garden.desc="The empty lot next to your building. It grows ingredients while the beds are watered; the Restaurant cooks with them and earns more, and spare produce sells at the stand.";
var gdNoteBase=gdNote;gdNote=function(r){return gdNoteBase(r).replace("Build the Restaurant to put these to use.","Knock through to a restaurant to put these to use.")};
