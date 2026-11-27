/* ---------- Cal 2026-11-26: no Accessories tab; each kind has its own ----------
   Cal: "The accessories also show all the masks, gloves, and necklaces in one location. These need to be split up into their own
   categories. Get rid of the accessories tab and create individual tabs for all the categories. And also ONLY 3 per drop."
   Every Shop rack (a brand, the Vault) splits Accessories into Glasses & Masks, Necklaces and Gloves, in that order after Hats, each
   with its own tab (29zz_v181.js makes a tab per section). The 3-a-drop rule already counts these three as their own categories
   (29zz_v201.js), so each shows at most 3, and the brand's next visit shows the next 3. A piece that is none of these (none today) would
   stay under Accessories. */
var V207NAMES={head:"Glasses & Masks",neck:"Necklaces",gloves:"Gloves",acc:"Accessories"},V207ORDER=["head","neck","gloves","acc"];
function v207Split(h){try{if(h.indexOf("<h3>Accessories</h3>")<0)return h;var d=document.createElement("div");d.innerHTML=h;
    var sec=[].filter.call(d.querySelectorAll("section.qs-sec"),function(s){var t=s.querySelector("h3");return t&&t.textContent==="Accessories"})[0];if(!sec)return h;
    var grid=sec.querySelector(".qs-grid,.shopgrid");if(!grid)return h;var by={};
    [].slice.call(grid.children).forEach(function(c){var id=c.getAttribute("data-card")||"",it=SHOP.filter(function(x){return x[0]===id})[0],k=it?v201Cat(it):"acc";if(!V207NAMES[k])k="acc";(by[k]=by[k]||[]).push(c)});
    var frag=document.createDocumentFragment();V207ORDER.forEach(function(k){if(!by[k]||!by[k].length)return;var s=document.createElement("section");s.className="qs-sec";
      s.innerHTML='<h3>'+V207NAMES[k]+'</h3><div class="'+grid.className+'"></div>';var g=s.querySelector("div");by[k].forEach(function(c){g.appendChild(c)});frag.appendChild(s)});
    sec.parentNode.replaceChild(frag,sec);return d.innerHTML}catch(e){return h}}
var v207Groups=qsGroups;qsGroups=function(){return v207Split(v207Groups.apply(this,arguments))};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV207={split:v207Split};
