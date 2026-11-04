"""One-time edits moving the flattened loft onto the rig. Safe to run only once."""
import re
import sys

APP = sys.argv[1]


def edit(name, pairs):
    p = f"{APP}/src/{name}"
    s = open(p, encoding="utf-8").read()
    for a, b in pairs:
        if a not in s:
            raise SystemExit("NOT FOUND in %s: %s" % (name, a[:90]))
        s = s.replace(a, b, 1)
    open(p, "w", encoding="utf-8").write(s)


def cut(s, start, end):
    """Text from `start` up to (not including) `end`."""
    i = s.index(start)
    return s[i: s.index(end, i)]


loft = open(f"{APP}/src/20_loft.js", encoding="utf-8").read()

# --- standing, walking and stretching -------------------------------------------------
old_img = cut(loft, "function lfCalImg(a,f,img){", "/* ---- gaming chair")
new_img = r'''/* The player's character comes from the rig. Seated and sleeping poses are drawn by
   the chair and bed, so the character sits between that furniture's layers. */
function lfRigState(a){var ch=a.look&&a.look.rig;if(!ch)return null;
  if(a.mode==="do"&&a.st&&(a.st.tag==="pc"||a.st.tag==="lairpc")&&/^(sit|type|work|work2)$/.test(a.act||""))return {hide:1,ch:ch};
  if(a.mode==="do"&&a.act==="lie")return {hide:1,ch:ch};
  var now=performance.now();
  if(a.mode==="walk"){var cl=a.back?"walkBack":"walk";return {ch:ch,clip:cl,f:QBLoft.walkFrame(a.ph||0,cl)}}
  if(a.mode==="do"&&(a.act==="up"||a.act==="stretch")){if(!a._st0)a._st0=now;var c=QBLoft.clips.stretch;return {ch:ch,clip:"stretch",f:Math.min(c.frames-1,Math.floor((now-a._st0)/1000*c.fps))}}
  a._st0=0;return {ch:ch,clip:"idle",f:QBLoft.clipFrame("idle",now)}}
function lfRigKey(a){var r=lfRigState(a);return r?(r.hide?"h":r.clip+r.f):""}
function lfCalImg(a,f,img){var r=lfRigState(a);if(!r)return false;QBLoft.warm(r.ch);img.style.imageRendering="auto";
  if(r.hide){img.setAttribute("href","data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");return true}
  var u=QBLoft.frameOrNear(r.ch,r.clip,r.f);if(!u){a._k="";return true}
  var G=QBLoft.geometry(LFCALH);img.setAttribute("href",u);img.setAttribute("width",G.w.toFixed(1));img.setAttribute("height",G.h.toFixed(1));img.setAttribute("x",G.x.toFixed(1));img.setAttribute("y",G.y.toFixed(1));
  var L=lfLS();img.style.filter=L.dark>.05?"brightness("+(1-L.dark*.38).toFixed(2)+")":"";return true}

'''
loft = loft.replace(old_img, new_img, 1)

# Redraw whenever the rig frame changes, not only when the old walk step did.
a = 'var k=a.role+"|"+f.p+"|"+f.act+"|"+cpi+(CHB.ready?"c":"");'
b = 'var k=a.role+"|"+f.p+"|"+f.act+"|"+cpi+(CHB.ready?"c":"")+(a.role==="me"?lfRigKey(a):"");'
assert a in loft
loft = loft.replace(a, b, 1)

# --- the chair: rig goes under the chair when facing away, over it when facing out ----
a = """var im=function(i){return '<image id="lfbch'+i+'_'+u+'" x="-40" y="-80" width="80" height="80" preserveAspectRatio="none" opacity="0"/>'};"""
b = a + """var rg=function(i){return '<image id="lfbrg'+i+'_'+u+'" preserveAspectRatio="none" opacity="0" style="image-rendering:auto"/>'};"""
assert a in loft
loft = loft.replace(a, b, 1)
a = """<g id="lfbchb_'+u+'">'+im("0d")+im("0n")+im("1d")+im("1n")+'</g>"""
b = """<g id="lfbchb_'+u+'">'+rg(0)+im("0d")+im("0n")+im("1d")+im("1n")+rg(1)+'</g>"""
assert a in loft
loft = loft.replace(a, b, 1)

old_layer = cut(loft, "function lfChairLayer(C,i,key,op,nt){", "function lfChairShow(C,A,B){")
new_layer = r'''function lfChairLayer(C,i,key,op,nt){var S=window.LFSP4&&LFSP4[key],pp=C.chd.pp;
  ["d","n"].forEach(function(t){var e=document.getElementById("lfbch"+i+t+"_"+C.chu);if(!e)return;
    if(!S||op<=.01){e.setAttribute("opacity","0");return}
    var w=S.w*pp,h=S.h*pp,ax=w/2,hu=lfSp4Url(key,t);
    e.setAttribute("href",hu);e.setAttribute("width",w.toFixed(1));e.setAttribute("height",h.toFixed(1));e.setAttribute("x",(-ax).toFixed(1));e.setAttribute("y",(-h).toFixed(1));
    e.setAttribute("opacity",(t==="d"?op*(1-nt):op*nt).toFixed(3))})}
/* Put the rig on a chair layer: 0 sits under the chair art, 1 over it. */
function lfChairRig(C,layer,ch,clip,f,seat){[0,1].forEach(function(i){var e=document.getElementById("lfbrg"+i+"_"+C.chu);if(!e)return;
    if(i!==layer||!ch){e.setAttribute("opacity","0");return}
    var u=QBLoft.frameOrNear(ch,clip,f);if(!u){e.setAttribute("opacity","0");return}
    var G=QBLoft.geometry(LFCALH*seat.scale),L=lfLS();e.setAttribute("href",u);e.setAttribute("width",G.w.toFixed(1));e.setAttribute("height",G.h.toFixed(1));e.setAttribute("x",(G.x+seat.x).toFixed(1));e.setAttribute("y",(G.y+seat.y).toFixed(1));
    e.setAttribute("transform",seat.flip?"scale(-1,1)":"");e.setAttribute("opacity","1");e.style.filter=L.dark>.05?"brightness("+(1-L.dark*.38).toFixed(2)+")":""})}
'''
loft = loft.replace(old_layer, new_layer, 1)

# --- the bed --------------------------------------------------------------------------
old_bed = cut(loft, "function lfBedTick(a,C){", "function lfChairTick(a){")
new_bed = r'''function lfBedTick(a,C){var b=document.getElementById("lfbed"+C.chu),sl=document.getElementById("lfslp"+C.chu);if(!b||!sl)return;var z=a.mode==="do"&&a.act==="lie"&&a.st&&a.st.tag==="bed";
  var ch=a.look&&a.look.rig;if(ch)QBLoft.warm(ch);var u=z&&ch?QBLoft.sleeper(ch,"bed"+(C.chd.slk||"0")):null;
  sl.style.display=u?"":"none";b.style.display="";C.chd.sl=z;
  if(u){var ims=sl.querySelectorAll("image");for(var i=1;i<ims.length;i++)ims[i].style.display="none";if(ims[0]&&ims[0].getAttribute("href")!==u){ims[0].setAttribute("href",u);ims[0].style.imageRendering="auto"}var Lq=lfLS();if(ims[0])ims[0].style.filter=Lq.dark>.05?"brightness("+(1-Lq.dark*.38).toFixed(2)+")":""}}
'''
loft = loft.replace(old_bed, new_bed, 1)

# --- chair states: forward when sitting down, away at the desk ------------------------
old_tick = cut(loft, "function lfChairTick(a){", "window.lfChairTick=lfChairTick;")
new_tick = r'''function lfChairTick(a){var C=lfC(a);if(!C||!C.chd)return;var H=C.chd;lfBedTick(a,C);if(!document.getElementById("lfbch_"+C.chu))return;var now=performance.now();
  var seated=a.mode==="do"&&a.st&&a.st.tag==="pc"&&/^(sit|type|work|work2)$/.test(a.act||""),ch=a.look&&a.look.rig,SD=QBLoft.data.loft.seats;
  if(H.fresh){H.fresh=0;if(seated){H.ph="type";H.t0=now;H.k=""}}
  if(seated&&(H.ph==="empty"||H.ph==="out")){H.ph="sit";H.t0=now}
  if(!seated&&(H.ph==="sit"||H.ph==="type")){H.ph="out";H.t0=now}
  var t=now-H.t0;
  if(H.ph==="sit"){if(t>SD.turnMs){H.ph="type";H.t0=now;H.k=""}else{lfChairShow(C,["bd4_gch_0"],null);lfChairRig(C,1,ch,"sit",QBLoft.clipFrame("sit",now),SD.sit);return}}
  if(H.ph==="type"){lfChairShow(C,["bd4_gch_4"],null);lfChairRig(C,0,ch,"type",QBLoft.clipFrame("type",now),SD.type);return}
  lfChairRig(C,-1);
  if(H.ph==="out"&&t>SD.turnMs)H.ph="empty";
  lfChairShow(C,["bd4_gch_0"],null)}
'''
loft = loft.replace(old_tick, new_tick, 1)
open(f"{APP}/src/20_loft.js", "w", encoding="utf-8").write(loft)

# --- the app: looks carry their rig choice, and the creator is QBCreator ---------------
app = open(f"{APP}/src/10_app_a.js", encoding="utf-8").read()

a = 'var L={sex:c.sex,beard:!!c.beard,'
b = 'var L={rig:rigChoice(c),sex:c.sex,beard:!!c.beard,'
assert a in app
app = app.replace(a, b, 1)

a = "function lookOf(ovr,base){"
b = r'''/* What the rig draws for a character. Saves from before the rig map onto the nearest options. */
function rigChoice(c){if(c.rig)return c.rig;var D=QBLoft.data.creator,has=function(list,id){return list.some(function(o){return o.id===id})};
  var shoe=c.shoes==="flips"?"flipflops":c.shoes;
  return {body:c.sex==="f"?"f":"m",top:has(D.tops,c.top)?c.top:D.defaults.top,bottom:has(D.bottoms,c.pants)?c.pants:D.defaults.bottom,shoe:has(D.shoes,shoe)?shoe:D.defaults.shoe}}
function lookOf(ovr,base){'''
assert a in app
app = app.replace(a, b, 1)

# Avatars and the character card.
old_hyd = cut(app, "function calHyd(img){", "function calHydAll(){")
new_hyd = r'''function calHyd(img){if(img.dataset.hy||!window.QBLoft)return;img.dataset.hy=1;
  var L=JSON.parse(img.dataset.look),ch=L.rig,H=+img.dataset.h,clip=img.dataset.pose==="walk"?"walk":img.dataset.pose==="stretch"?"stretch":"idle",D=QBLoft.data.loft;
  if(!ch)return;QBLoft.warm(ch);img.style.width=(H*D.frame[0]/D.standPx).toFixed(1)+"px";img.style.height=(H*D.frame[1]/D.standPx).toFixed(1)+"px";
  var f=0,t=setInterval(function(){if(!img.isConnected){clearInterval(t);return}var c=QBLoft.clips[clip],u=QBLoft.frameOrNear(ch,clip,f);if(u&&img.src!==u)img.src=u;f=(f+1)%c.frames},1000/QBLoft.clips[clip].fps)}
'''
app = app.replace(old_hyd, new_hyd, 1)

# The creator screen: the shell stays, its options come from QBCreator.
old_look = cut(app, "  var pz=[\"idle\",\"walk\",\"stretch\"],pn=pz[ccPose%3];", "function ccAct(a,b,e){")
new_look = r'''  setTimeout(ccMount,0);
  return '<section class="card creator qbcc"><div class="ccinfo"><span class="label">'+(ccEdit?"Edit look":"Create your character")+'</span><h2>'+esc(cc.name||"Hunter")+'</h2>'
   +(ccEdit?'<input id="ccname" class="tin" maxlength="16" autocomplete="off" value="'+esc(cc.name||"")+'" aria-label="Character name">':'')+'</div>'
   +'<div id="qbcc"></div><div class="ccbtns"><button class="btn ghost" data-act="'+(ccEdit?"cccancel":"ccback")+'">'+(ccEdit?"Cancel":"Back")+'</button><button class="btn" data-act="ccdone">'+(ccEdit?"Save":"Begin")+'</button></div></section>';
}
function ccMount(){var el=document.getElementById("qbcc");if(!el||el.dataset.on||!window.QBCreator||!cc)return;el.dataset.on=1;
  cc.rig=cc.rig||rigChoice(cc);QBLoft.warm(cc.rig);
  var rig=QBCreatorRig();rig.then(function(r){if(!el.isConnected||!cc)return;QBCreator.mount(el,{rig:r,data:QBLoft.data.creator,clips:QBLoft.clips,initial:cc.rig,showDone:false,onChange:function(c){if(cc){cc.rig=c;cc.sex=c.body}}})})}
var _ccRig=null;
function QBCreatorRig(){if(!_ccRig){var D=QBLoft.data,{clips:clips,...poses}=D.poses;_ccRig=QBRig.create({rig:D.rig,bodies:D.bodies,poses:poses,clips:clips,assetUrl:function(p){return D.loft.artBase+p}})}return _ccRig}
'''
app = app.replace(old_look, new_look, 1)

# Randomize belonged to the old creator's options.
app = re.sub(r'  if\(a==="ccrand"\)\{.*?render\(\);return\}\n', "", app, count=1, flags=re.S)
open(f"{APP}/src/10_app_a.js", "w", encoding="utf-8").write(app)
print("integrated")
