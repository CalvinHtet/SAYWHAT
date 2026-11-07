/*LOFT-BEGIN*/
window.LFNOCHAR=true;
/* ---------- the loft: isometric world ---------- */
var LF={N:8,W:8,D:8,sx:26,sy:13,H:136,U:29.07};
var LFSZ={bedroom:[8,8],lounge:[10,8],restaurant:[21,12],garden:[16,13],gameroom:[15,12],theater:[12,9],auditorium:[12,10],club:[10,8],dojo:[10,9],spa:[14,11],sky:[14,11],gym:[13,10],bar:[9,9],library:[10,8]};
function lfDimOf(t){return LFSZ[t]||[8,8]}
window.LFWH={auditorium:190,spa:170,bar:166,sky:166,dojo:166,club:164,library:150};
function lfSetDim(t){var d=lfDimOf(t);LF.W=d[0];LF.D=d[1];LF.N=d[0];LF.H=LFWH[t]||136}
function lfH(c){var n=parseInt(c.slice(1),16);return [n>>16,(n>>8)&255,n&255]}
function lfMix(a,b,t){var A=lfH(a),B=lfH(b);return "#"+[0,1,2].map(function(i){var v=Math.round(A[i]+(B[i]-A[i])*t);return (v<16?"0":"")+v.toString(16)}).join("")}
function lfSh(c,f){return f<0?lfMix(c,"#121a30",-f):lfMix(c,"#ffffff",f)}
function lfP(x,y,z){return [(x-y)*LF.sx,(x+y)*LF.sy-(z||0)]}
function lfPt(a){return a[0].toFixed(1)+","+a[1].toFixed(1)}
function lfPoly(pts,fill,stroke,sw,extra){return '<polygon points="'+pts.map(lfPt).join(" ")+'" fill="'+fill+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+(sw||.8)+'" stroke-linejoin="round"':'')+(extra||'')+'/>'}
var LFOL="rgba(24,30,58,.62)";
function lfBox(x,y,z,w,d,h,c,o){o=o||{};if(LFREC)lfRecBox(x,y,z,w,d,h);
  var T=o.top||lfSh(c,.2),Lc=o.l||c,R=o.r||lfSh(c,-.24),ol=o.ol||LFOL;
  return lfPoly([lfP(x,y+d,z),lfP(x+w,y+d,z),lfP(x+w,y+d,z+h),lfP(x,y+d,z+h)],Lc,ol)
   +lfPoly([lfP(x+w,y,z),lfP(x+w,y+d,z),lfP(x+w,y+d,z+h),lfP(x+w,y,z+h)],R,ol)
   +lfPoly([lfP(x,y,z+h),lfP(x+w,y,z+h),lfP(x+w,y+d,z+h),lfP(x,y+d,z+h)],T,ol);
}
/* flat decoration groups in plane space (px) */
function lfFloorG(x,y,content,rot){var o=lfP(x,y,0);return '<g transform="matrix(.894,.447,-.894,.447,'+o[0].toFixed(1)+','+o[1].toFixed(1)+')">'+content+'</g>'}
function lfFaceY(x,y,z,content){var o=lfP(x,y,z);return '<g transform="matrix(.894,.447,0,1,'+o[0].toFixed(1)+','+o[1].toFixed(1)+')">'+content+'</g>'}   /* plane y=const, x increases to the right, origin = top-left */
function lfFaceX(x,y,z,content){var o=lfP(x,y,z);return '<g transform="matrix(.894,-.447,0,1,'+o[0].toFixed(1)+','+o[1].toFixed(1)+')">'+content+'</g>'} /* plane x=const, origin at its larger-y (view-left) end */
function lfR(x,y,w,h,f,s){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+f+'"'+(s?' stroke="'+s+'" stroke-width=".8"':'')+'/>'}
function lfRr(x,y,w,h,r,f,s){return '<rect x="'+x+'" y="'+y+'" rx="'+r+'" width="'+w+'" height="'+h+'" fill="'+f+'"'+(s?' stroke="'+s+'" stroke-width=".8"':'')+'/>'}
function lfE(cx,cy,rx,ry,f,o){return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'"'+(o?' opacity="'+o+'"':'')+'/>'}
function lfSeed(n){var s=n*9301+49297;return function(){s=(s*9301+49297)%233280;return s/233280}}
/* themes */
var LFTH={
 lounge:{wall:"#86a6cc",wain:"#5d7eab",acc:"#ff9d5c",fl:"w"},
 bedroom:{wall:"#8c86b8",wain:"#605a90",acc:"#ff8ab8",fl:"w"},
 bar:{wall:"#6a5e9c",wain:"#463d74",acc:"#ff5c9a",fl:"d"},
 restaurant:{wall:"#7db3ae",wain:"#4c8a86",acc:"#ffb066",fl:"w"},
 gameroom:{wall:"#7f74c8",wain:"#5547a0",acc:"#4dd2ff",fl:"d"},
 studio:{wall:"#51628f",wain:"#323f66",acc:"#ff3d81",fl:"d"},
 gym:{wall:"#7391ad",wain:"#4a647c",acc:"#ff6a4d",fl:"g"},
 library:{wall:"#6f947f",wain:"#456a57",acc:"#ffc76a",fl:"w"},
 dojo:{wall:"#b59c74",wain:"#7a5a34",acc:"#ff5c4d",fl:"t"},
 theater:{wall:"#5a3244",wain:"#3a1c2c",acc:"#ff4d6d",fl:"d"},
 auditorium:{wall:"#3a2434",wain:"#22121e",acc:"#ff4d6d",fl:"d"},
 club:{wall:"#2a1f45",wain:"#160f2a",acc:"#ff3df0",fl:"d"},
 spa:{wall:"#cfe0d6",wain:"#8fb3a2",acc:"#7fe0c0",fl:"w"},
 garden:{out:1,acc:"#9cff8a",fl:"grass"},farm:{out:1,acc:"#ffd27a",fl:"dirt"},pond:{out:1,acc:"#5ce1ff",fl:"grass2"},sky:{out:1,acc:"#ffb36b",fl:"deck"}
};
var LFTINT=["#8aa9cf","#d68ab0","#8ad6b0","#d6c48a"];
function lfWallC(t,st){var T=LFTH[t]||LFTH.lounge,w=T.wall||"#86a6cc",wn=T.wain||"#5d7eab";if(st){w=lfMix(w,LFTINT[st%4],.4);wn=lfMix(wn,LFTINT[st%4],.3)}return [w,wn]}

/* ---------- light: real sun/moon for LA, sky colors, per-room lighting ---------- */
var LFWINS=[];
function lfCl(v,a,b){return v<a?a:v>b?b:v}
function lfSunPos(){
  var lat=34.05*Math.PI/180,d=new Date(),ho=(typeof window.LFHOUR==="number")?window.LFHOUR:null;
  var N=Math.floor((d.getTime()-Date.UTC(d.getUTCFullYear(),0,0))/864e5);
  var g=2*Math.PI/365*(N-1+(d.getUTCHours()-12)/24);
  var eq=229.18*(.000075+.001868*Math.cos(g)-.032077*Math.sin(g)-.014615*Math.cos(2*g)-.040849*Math.sin(2*g));
  var dec=.006918-.399912*Math.cos(g)+.070257*Math.sin(g)-.006758*Math.cos(2*g)+.000907*Math.sin(2*g)-.002697*Math.cos(3*g)+.00148*Math.sin(3*g);
  var utcMin=d.getUTCHours()*60+d.getUTCMinutes()+d.getUTCSeconds()/60;
  var tst=ho!=null?ho*60:(utcMin+eq-118.24*4);tst=((tst%1440)+1440)%1440;
  var ha=(tst/4-180)*Math.PI/180;
  var sz=Math.sin(lat)*Math.sin(dec)+Math.cos(lat)*Math.cos(dec)*Math.cos(ha);
  var el=Math.asin(lfCl(sz,-1,1)),zen=Math.PI/2-el;
  var ca=(Math.sin(dec)-Math.sin(lat)*Math.cos(zen))/((Math.cos(lat)*Math.sin(zen))||1e-6);
  var th=Math.acos(lfCl(ca,-1,1))*180/Math.PI;
  return {el:el*180/Math.PI,az:ha<0?th:360-th,morning:ha<0,hr:tst/60};
}
function lfMoon(){var ph=(((Date.now()-Date.UTC(2000,0,6,18,14))/864e5)%29.530589+29.530589)%29.530589/29.530589;return {ph:ph,ill:(1-Math.cos(2*Math.PI*ph))/2}}
var LFSKY=[[-12,"#04061a","#0f1636"],[-7,"#0a0f2e","#232a5e"],[-3,"#242a66","#8a4d8a"],[0,"#4a5fb0","#ff7a52"],[4,"#5f86cc","#ffb26a"],[10,"#66a6e6","#fbe3b0"],[22,"#5aa9e8","#e4f1f6"],[60,"#4a98e0","#cfeaf8"]];
function lfSkyBase(el){var A=LFSKY;if(el<=A[0][0])return [A[0][1],A[0][2]];for(var i=1;i<A.length;i++)if(el<=A[i][0]){var k=(el-A[i-1][0])/(A[i][0]-A[i-1][0]);return [lfMix(A[i-1][1],A[i][1],k),lfMix(A[i-1][2],A[i][2],k)]}return [A[A.length-1][1],A[A.length-1][2]]}
function lfLS(){
  var S=lfSunPos(),wx=LFW.wx,cl=LFW.cloud!=null?LFW.cloud:({sun:.08,cloud:.7,fog:.8,rain:.92})[wx]||.1,el=S.el,mo=lfMoon();
  var wet=(wx==="rain"||wx==="fog");
  var direct=lfCl((el+.4)/6,0,1)*(1-lfCl(cl,0,1)*.96)*(wet?.1:1);
  var dark=lfCl((3-el)/13,0,1),golden=lfCl(1-Math.abs(el-3.5)/10,0,1)*(1-cl*.65)*(wet?.5:1);
  var moonK=dark>.5&&!wet?dark*mo.ill*(1-cl)*.9:0;
  var phase=dark>.92?"Night":el<=-.5?(S.morning?"Dawn":"Dusk"):el<7&&!S.morning?"Golden hour":el<10&&S.morning?"Sunrise":S.hr<11?"Morning":S.hr<14?"Midday":"Afternoon";
  var mul="#ffffff";mul=lfMix(mul,"#ffd4a0",golden*.8);mul=lfMix(mul,wx==="rain"?"#b4c0d4":"#d5dce8",lfCl(cl,0,1)*(1-dark)*(wx==="rain"?.4:.22));
  mul=lfMix(mul,S.morning||el<-1?"#2a3470":"#2b2f68",dark*.8);
  var ex=Math.tan(Math.max(el,2)*Math.PI/180);
  return {S:S,el:el,cl:cl,wx:wx,direct:direct,dark:dark,golden:golden,mul:mul,mo:mo,moonK:moonK,phase:phase,
    key:Math.round(el*.7)+"|"+wx+"|"+(Math.round(cl*5))+"|"+(window.LFHOUR||0)};
}
/* Each room has its own light. It changes how that room is lit and leaves the sky outside alone. */
function lfLightUseful(){return lfLS().dark>.12}
/* Cal (playtest): "The light on option should not matter for the other rooms. Only the bedroom where you can't see anything at night".
   Every room but the Bedroom is lit whenever it is dark; the Bedroom keeps its lamp toggle (rm.lit). */
/* QA: an open-air room (C.noshell 2: the Rooftop, the Sky Patio) has no ceiling light, so it keeps the night (it read like noon at 22:00) */
function lfLit(C){return !!(C&&C.room&&C.noshell!==2&&(C.room.t!=="bedroom"||C.room.lit)&&lfLightUseful())}
function lfInLS(C){var L=lfLS();if(!lfLit(C))return L;return Object.assign({},L,{dark:.13,golden:0,direct:0,moonK:0,mul:"#fff3e4"})}
function lfSkyCols(L){
  L=L||lfLS();var b=lfSkyBase(L.el),wxW=({sun:0,cloud:.5,fog:.85,rain:.72})[L.wx]||0;wxW=Math.max(wxW,L.cl*.55);
  var g=[lfMix("#8c9db2","#10152e",L.dark*.88),lfMix("#c5d0dc","#222a52",L.dark*.8)];
  if(L.wx==="rain"){g=[lfMix("#6d7f99","#0d1228",L.dark*.9),lfMix("#a9b8c8","#1c2348",L.dark*.85)]}
  return [lfMix(b[0],g[0],wxW),lfMix(b[1],g[1],wxW)];
}
/* window pane art: plane px 5..47 x 6..56 */
function lfSkyArt(L,x0,id){
  var s="",sk=lfSkyCols(L),el=L.el,S=L.S,wxClear=L.cl<.55&&L.wx!=="fog"&&L.wx!=="rain";
  s+='<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+sk[0]+'"/><stop offset="1" stop-color="'+sk[1]+'"/></linearGradient></defs>';
  s+='<path d="M5 56 L5 25 Q5 6 26 6 Q47 6 47 25 L47 56Z" fill="url(#'+id+')"/>';
  var R=lfSeed(Math.floor(x0*13)+7);
  if(L.dark>.35){var sa=Math.min(1,(L.dark-.35)*1.6)*(L.cl>.6?.2:1);for(var i=0;i<16;i++){var sx=7+R()*38,sy=8+R()*26;s+='<circle cx="'+sx.toFixed(1)+'" cy="'+sy.toFixed(1)+'" r="'+(R()<.2?1:.55)+'" fill="#fff" opacity="'+(sa*(.5+R()*.5)).toFixed(2)+'"/>'}}
  if(el>-3&&wxClear){var hz=lfCl((el+3)/60,0,1),sx2=lfCl(8+((S.az-190)/150)*36,8,44),sy2=50-hz*34,rr=el<8?9:6.5,sc=lfMix("#ff8a3a","#fff6c8",lfCl(el/25,0,1));
    s+='<circle cx="'+sx2+'" cy="'+sy2+'" r="'+(rr*2.8)+'" fill="'+sc+'" opacity="'+(el<8?.32:.2)+'"/><circle cx="'+sx2+'" cy="'+sy2+'" r="'+rr+'" fill="'+sc+'"/>'}
  if(L.dark>.4&&L.moonK>.02||L.dark>.7&&L.wx!=="rain"&&L.cl<.7){var mx=lfCl(36-((S.az+180)%360<180?0:0)+(L.mo.ph*14-7),12,40),my=16+(L.mo.ph%.5)*8;
    s+='<circle cx="'+mx+'" cy="'+my+'" r="11" fill="rgba(190,210,255,.22)"/><circle cx="'+mx+'" cy="'+my+'" r="5.6" fill="#f2f0dc"/>';
    var off=(1-2*Math.abs(L.mo.ph-.5)*2)*0;if(L.mo.ill<.9)s+='<circle cx="'+(mx+(L.mo.ph<.5?-1:1)*(1+(1-L.mo.ill)*6))+'" cy="'+(my-.6)+'" r="5.2" fill="'+sk[0]+'"/>'}
  var cc=lfMix("#ffffff","#ffc9a0",L.golden*.9);cc=lfMix(cc,"#262f5a",L.dark*.85);if(L.wx==="rain")cc=lfMix(cc,"#6f7f95",.6);
  var co=L.wx==="fog"?.9:L.wx==="rain"?.85:lfCl(.25+L.cl*.7,0,.9);
  s+='<g opacity="'+co.toFixed(2)+'" fill="'+cc+'"><ellipse cx="'+(14+R()*6)+'" cy="30" rx="11" ry="4"/><ellipse cx="'+(22+R()*4)+'" cy="27.5" rx="7" ry="3.6"/><ellipse cx="'+(36+R()*4)+'" cy="21" rx="9" ry="3.2"/></g>';
  var hill=lfMix("#7cc66f","#142230",L.dark*.92);hill=lfMix(hill,"#d19a5a",L.golden*.4*(1-L.dark));
  s+='<path d="M5 50 Q16 42 26 48 T47 46 L47 56 L5 56Z" fill="'+hill+'"/>';
  if(L.dark>.4){var cb=lfCl((L.dark-.4)*1.7,0,1);for(var j=0;j<9;j++){s+='<circle cx="'+(8+R()*38).toFixed(1)+'" cy="'+(50+R()*4).toFixed(1)+'" r="'+(.6+R()*.6).toFixed(1)+'" fill="'+(R()<.5?"#ffd88a":"#fff3c8")+'" opacity="'+(cb*.9).toFixed(2)+'"/>'}}
  if(L.wx==="rain"){for(var k=0;k<9;k++)s+='<path d="M'+(8+k*4.6)+' '+(10+(k*7)%18)+' l-3 9" stroke="rgba(255,255,255,.65)" stroke-width="1"/>';if(LFW.storm)s+='<path d="M30 8 l-5 12 h5 l-4 14" stroke="#fff6b0" stroke-width="1.6" fill="none" class="lfblink"/>'}
  if(L.wx==="fog")s+='<rect x="5" y="6" width="42" height="50" fill="rgba(235,240,245,.35)"/>';
  return s;
}
/* hull */
function lfHull(P){P=P.slice().sort(function(a,b){return a[0]-b[0]||a[1]-b[1]});if(P.length<3)return P;function cr(o,a,b){return (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])}
  var lo=[],up=[],i;for(i=0;i<P.length;i++){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],P[i])<=0)lo.pop();lo.push(P[i])}
  for(i=P.length-1;i>=0;i--){while(up.length>=2&&cr(up[up.length-2],up[up.length-1],P[i])<=0)up.pop();up.push(P[i])}
  up.pop();lo.pop();return lo.concat(up)}
function lfPolyS(pts,fill,extra){return '<polygon points="'+pts.map(lfPt).join(" ")+'" fill="'+fill+'"'+(extra||"")+'/>'}
/* per-room light model. returns {pre,mid,post} svg strings */
function lfRoomLight(C,uid,t,out){
  /* an open-air room (C.noshell 2: the Rooftop, the Sky Patio) has no walls, so its light stops just above the rail
     instead of tinting a wall-high box of sky */
  var L=out?lfLS():lfInLS(C),N=LF.W,M=LF.D,H=C.noshell===2?(t==="rooftop"&&window.LFSPR&&LFSPR.rfw_t1?60:40):LF.H,U=29.07,res={pre:"",mid:"",post:""},defs="",R=(window.LFRID=(window.LFRID||0)+1),id=function(n){return "lf"+n+uid+"_"+R}/* Cal: shadows vanished for a moment after a buy; ids unique per render, so a repaint never points at filters being swapped out */;
  var floor=[lfP(0,0,0),lfP(N,0,0),lfP(N,M,0),lfP(0,M,0)];
  var hexIn=out?[lfP(-.2,-.2,-8),lfP(N+.2,-.2,-8),lfP(N+.2,-.2,H+16),lfP(-.2,-.2,H+16),lfP(-.2,M+.2,H+16),lfP(-.2,M+.2,-8)]:C.rsW?[lfP(0,M,H),lfP(0,0,H),lfP(C.rsW,0,H),lfP(C.rsW,0,36),lfP(N,0,36),lfP(N,0,-15),lfP(N,M,-15),lfP(0,M,-15)]:[lfP(0,M,H),lfP(0,0,H),lfP(N,0,H),lfP(N,0,-15),lfP(N,M,-15),lfP(0,M,-15)];
  var hs=lfHull(floor.concat([lfP(0,0,64),lfP(N,0,64),lfP(N,M,64),lfP(0,M,64)]));
  defs+='<clipPath id="'+id("cf")+'"><polygon points="'+floor.map(lfPt).join(" ")+'"/></clipPath><clipPath id="'+id("ci")+'"><polygon points="'+hs.map(lfPt).join(" ")+'"/></clipPath><clipPath id="'+id("hx")+'"><polygon points="'+hexIn.map(lfPt).join(" ")+'"/></clipPath>';
  /* source: sun or moon */
  var src=null;
  if(L.direct>.04&&L.el>0)src={el:L.el,az:L.S.az,k:L.direct,col:lfMix("#ffa24a","#fff7dc",lfCl((L.el-1)/32,0,1)),sun:1};
  else if(L.moonK>.05)src={el:lfCl(60-L.el*1.6,22,62),az:(L.S.az+180)%360,k:L.moonK*.5,col:"#aebfff",sun:0};
  var phi=src?src.az*Math.PI/180:0,ux=src?-Math.cos(phi):0,uy=src?-Math.sin(phi):0,hl=Math.hypot(ux,uy)||1;ux/=hl;uy/=hl;
  var yk=src?lfCl((uy-.08)/.3,0,1):0,tanE=src?Math.max(Math.tan(src.el*Math.PI/180),.06):1;
  var kk=src?src.k*yk:0,blur=L.cl>.35?2.6:1.1;
  function Pf(x,z){var Lz=Math.min(30,(z/U)/tanE);return [x+Lz*ux,Lz*uy]}
  var wins=C.wins||[],patchSvg="",beamSvg="",shadowSvg="",moteSvg="";
  var U2=function(p){return lfP(p[0],p[1],0)};
  if(!out&&src&&kk>.02){
    wins.forEach(function(x0){
      var xs=[[x0+.17,x0+.86],[x0+.93,x0+1.62]],zs=[[30,54],[58,80]];
      xs.forEach(function(xr){zs.forEach(function(zr){
        var q=[Pf(xr[0],zr[0]),Pf(xr[1],zr[0]),Pf(xr[1],zr[1]),Pf(xr[0],zr[1])].map(U2);patchSvg+=lfPolyS(q,"#fff")})});
      var wq=[lfP(x0+.17,0,80),lfP(x0+1.62,0,80),lfP(x0+1.62,0,30),lfP(x0+.17,0,30)],fq=[Pf(x0+.17,30),Pf(x0+1.62,30),Pf(x0+1.62,80),Pf(x0+.17,80)].map(U2);
      var fc=[(fq[0][0]+fq[2][0])/2,(fq[0][1]+fq[2][1])/2],wc=[(wq[0][0]+wq[2][0])/2,(wq[0][1]+wq[2][1])/2],gid=id("bm"+Math.floor(x0*10));
      defs+='<linearGradient id="'+gid+'" gradientUnits="userSpaceOnUse" x1="'+wc[0].toFixed(1)+'" y1="'+wc[1].toFixed(1)+'" x2="'+fc[0].toFixed(1)+'" y2="'+fc[1].toFixed(1)+'"><stop offset="0" stop-color="'+src.col+'" stop-opacity=".55"/><stop offset="1" stop-color="'+src.col+'" stop-opacity=".04"/></linearGradient>';
      beamSvg+=lfPolyS(lfHull(wq.concat(fq)),"url(#"+gid+")");
      if(src.sun&&kk>.3)for(var m=0;m<5;m++){var f=.15+((m*37)%80)/100,mx=wc[0]+(fc[0]-wc[0])*f+((m*13)%11-5)*2.2,my=wc[1]+(fc[1]-wc[1])*f+((m*7)%9-4)*2;moteSvg+='<circle class="lfmote" cx="'+mx.toFixed(1)+'" cy="'+my.toFixed(1)+'" r="'+(.9+(m%3)*.4)+'" fill="#fff6d0" style="animation-delay:-'+(m*1.3)+'s"/>'}
    });
    /* shadows of furniture on lit floor */
    (C.obsRaw||[]).forEach(function(b){
      var w=b[2]-b[0],d=b[3]-b[1];if(w*d>16||w*d<.04)return;
      var h=b.h||26,Ls=Math.min(3.6,(h/U)/tanE),sx=ux*Ls,sy=uy*Ls,pts=[[b[0],b[1]],[b[2],b[1]],[b[2],b[3]],[b[0],b[3]]];
      var all=pts.concat(pts.map(function(p){return [p[0]+sx,p[1]+sy]})).map(U2);shadowSvg+=lfPolyS(lfHull(all),"#000")});
    var wg=0;
    defs+='<filter id="'+id("bf")+'" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="'+blur+'"/></filter><filter id="'+id("bg")+'" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>'
      +'<mask id="'+id("sm")+'" maskUnits="userSpaceOnUse" x="-500" y="-400" width="1400" height="1000"><g fill="#fff">'+patchSvg+'</g><g fill="#000">'+shadowSvg+'</g></mask>';
    var a1=Math.min(.62,kk*(src.sun?.46:.5))*(src.el<7?1.1:1);
    res.pre+='<g clip-path="url(#'+id("cf")+')" pointer-events="none" style="mix-blend-mode:screen"><g filter="url(#'+id("bg")+')" opacity="'+(a1*.42).toFixed(2)+'"><g fill="'+src.col+'">'+patchSvg+'</g></g><g filter="url(#'+id("bf")+')"><g mask="url(#'+id("sm")+')"><rect x="-500" y="-400" width="1400" height="1000" fill="'+src.col+'" opacity="'+a1.toFixed(2)+'"/></g></g></g>';
    res.mid+='<g clip-path="url(#'+id("ci")+')" pointer-events="none" style="mix-blend-mode:soft-light" opacity="'+Math.min(.85,kk*.9).toFixed(2)+'"><g filter="url(#'+id("bf")+')"><g mask="url(#'+id("sm")+')"><rect x="-500" y="-400" width="1400" height="1000" fill="'+src.col+'"/></g></g></g>';
    res.mid+='<g clip-path="url(#'+id("hx")+')" pointer-events="none" style="mix-blend-mode:screen" opacity="'+Math.min(.5,kk*(src.sun?.5:.4)).toFixed(2)+'"><g filter="url(#'+id("bf")+')">'+beamSvg+'</g></g><g clip-path="url(#'+id("hx")+')" pointer-events="none" opacity="'+Math.min(.9,kk).toFixed(2)+'">'+moteSvg+'</g>';
  }else if(out&&L.direct>.04&&L.el>0){
    /* outdoors: long sun shadows only */
    var uxo=-Math.cos(L.S.az*Math.PI/180),uyo=-Math.sin(L.S.az*Math.PI/180),ho=Math.hypot(uxo,uyo)||1,tn=Math.max(Math.tan(L.el*Math.PI/180),.18),sh="";uxo/=ho;uyo/=ho;
    (C.obsRaw||[]).forEach(function(b){var w=b[2]-b[0],d=b[3]-b[1];if(w*d>16||w*d<.04)return;var h=b.h||26,Ls=Math.min(2.2,(h/U)/tn),pts=[[b[0],b[1]],[b[2],b[1]],[b[2],b[3]],[b[0],b[3]]];
      sh+=lfPolyS(lfHull(pts.concat(pts.map(function(p){return [p[0]+uxo*Ls,p[1]+uyo*Ls]})).map(U2)),"#2b2116")});
    defs+='<filter id="'+id("bf")+'" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.4"/></filter>';
    res.pre+='<g clip-path="url(#'+id("cf")+')" pointer-events="none" filter="url(#'+id("bf")+')" opacity="'+(L.direct*.17).toFixed(2)+'">'+sh+'</g>';/* Cal: "too harsh and look unnatural": warm brown, feathered, lighter (was hard navy) */
  }
  /* always: contact shadows */
  /* one soft shadow per floor piece (lfSpr records them in C.shd; drawn pieces with no sprite still come from the
     walk boxes), the same blur and strength everywhere, a little wider at the front so it shows past solid bases */
  var cs="",cb=(C.shd||[]).concat((C.obsRaw||[]).filter(function(b){return !b.spr}));cb.forEach(function(b){var w=b[2]-b[0],d=b[3]-b[1];if(w*d>16||w*d<.04)return;/* QA: on the near-black floors (Lock and Key, Speakeasy, Arcade, Rhythm, Karaoke, Club, Lair, Trophy Room) the shadow
     vanished; there it is pure black, stronger and a little wider */
  /* Cal (playtest): "The shadows are too big for the chairs". The margin past the base grows with the piece, so a chair's
     shadow hugs its own legs while beds and sofas keep the full margin. */
  var dkF={skybar:1,speakeasy:1,arcade:1,rhythm:1,karaoke:1,club:1,lair:1,trophy:1,auditorium:1}[t],sz=Math.min(1,Math.sqrt(w*d)/1.4),p=(dkF?.12:.16)*sz,q=(dkF?.44:.4)*sz;
  cs+=lfPolyS([lfP(b[0]-p,b[1]-p,0),lfP(b[2]+q,b[1]-p,0),lfP(b[2]+q,b[3]+q,0),lfP(b[0]-p,b[3]+q,0)],dkF?"#000":"#1c1410")});
  if(cs){var dkO={skybar:1,speakeasy:1,arcade:1,rhythm:1,karaoke:1,club:1,lair:1,trophy:1,auditorium:1}[t];defs+='<filter id="'+id("cb")+'" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="'+(dkO?3.8:4.6)+'"/></filter>';res.pre='<g clip-path="url(#'+id("cf")+')" pointer-events="none" filter="url(#'+id("cb")+')" opacity="'+(dkO?.92:.42+L.dark*.1).toFixed(2)+'">'+cs+'</g>'+res.pre}
  /* emitters */
  var lights=(C.lights||[]).slice();
  if(!out&&lfLit(C))lights.push([N*.5,M*.5,100,"#ffe6bd",4.6,.55]);
  if(!out&&t!=="empty"&&t!=="bedroom"){var ac=(C.T&&C.T.acc)||"#ffd9a0",warm=({club:1,theater:1,auditorium:1,bar:1,gameroom:1,studio:1})[t]?ac:"#ffdca0";lights.push([N*.3,M*.5,100,warm,3.2,.55],[N*.72,M*.5,100,warm,3.2,.55])}
  if(out)lights.push([N*.5,M*.5,60,"#ffe8b0",4.2,.3]);
  /* wall + window glow */
  var gl="",wl="";
  if(!out){wins.forEach(function(x0){
    var gk=(src&&src.sun?kk*.5:0)+L.dark*.18*(L.wx==="rain"?.5:1)+(1-L.dark)*(1-L.direct)*.08,gc=src&&src.sun?src.col:(L.dark>.5?"#7f93ff":"#e8f0ff");
    var gid=id("wg"+Math.floor(x0*10));defs+='<radialGradient id="'+gid+'"><stop offset="0" stop-color="'+gc+'" stop-opacity=".9"/><stop offset="1" stop-color="'+gc+'" stop-opacity="0"/></radialGradient>';
    wl+=lfFaceY(x0-.5,0,100,'<ellipse cx="'+(.5*U+26)+'" cy="40" rx="64" ry="66" fill="url(#'+gid+')" opacity="'+lfCl(gk,0,.7).toFixed(2)+'"/>')})}
  /* ambient multiply with lamp holes */
  var amb="";
  var hole=function(Ls){return Ls.map(function(q,i){var p=lfP(q[0],q[1],0),pz=lfP(q[0],q[1],q[2]||60),r=q[4]||3,k=lfCl((q[5]||.6)*(.35+L.dark*1.1),0,1);
    var gid=id("lh"+i);defs+='<radialGradient id="'+gid+'"><stop offset="0" stop-color="#000" stop-opacity="1"/><stop offset=".55" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>';
    return '<ellipse cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" rx="'+(r*U*.95).toFixed(1)+'" ry="'+(r*U*.5).toFixed(1)+'" fill="url(#'+gid+')" opacity="'+k.toFixed(2)+'"/><circle cx="'+pz[0].toFixed(1)+'" cy="'+pz[1].toFixed(1)+'" r="'+(r*U*.45).toFixed(1)+'" fill="url(#'+gid+')" opacity="'+(k*.8).toFixed(2)+'"/>'}).join("")};
  if(L.mul!=="#ffffff"){
    defs+='<mask id="'+id("am")+'" maskUnits="userSpaceOnUse" x="-500" y="-400" width="1400" height="1000"><rect x="-500" y="-400" width="1400" height="1000" fill="#fff"/>'+(L.dark>.12?hole(lights):"")+'</mask>';
    amb='<g clip-path="url(#'+id("hx")+')" pointer-events="none" style="mix-blend-mode:multiply"><rect x="-500" y="-400" width="1400" height="1000" fill="'+(out?L.mul:lfMix(L.mul,"#a69fc4",L.dark*.62))+'" mask="url(#'+id("am")+')"/></g>';
  }
  /* lamp glows (screen) */
  if(L.dark>.1||L.golden>.2){lights.forEach(function(q,i){var p=lfP(q[0],q[1],q[2]||60),pf=lfP(q[0],q[1],0),r=q[4]||3,k=lfCl((q[5]||.6)*(.25+L.dark*1.05),0,1)*(q[3]==="none"?0:1);
    var gid=id("lg"+i);defs+='<radialGradient id="'+gid+'"><stop offset="0" stop-color="'+q[3]+'" stop-opacity=".85"/><stop offset=".5" stop-color="'+q[3]+'" stop-opacity=".25"/><stop offset="1" stop-color="'+q[3]+'" stop-opacity="0"/></radialGradient>';
    gl+='<ellipse cx="'+pf[0].toFixed(1)+'" cy="'+pf[1].toFixed(1)+'" rx="'+(r*U*.9).toFixed(1)+'" ry="'+(r*U*.45).toFixed(1)+'" fill="url(#'+gid+')" opacity="'+(k*.55).toFixed(2)+'"/><circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="'+(r*U*.4).toFixed(1)+'" fill="url(#'+gid+')" opacity="'+(k*.5).toFixed(2)+'"/>'})}
  var flash=(LFW.storm&&L.wx==="rain")?'<g clip-path="url(#'+id("hx")+')" pointer-events="none"><rect x="-500" y="-400" width="1400" height="1000" fill="#dfe8ff" class="lfflash" style="mix-blend-mode:screen"/></g>':"";
  res.post='<g class="lflt" pointer-events="none">'+amb+'<g clip-path="url(#'+id("hx")+')" style="mix-blend-mode:screen">'+gl+wl+'</g>'+flash+'</g>';
  res.defs='<defs>'+defs+'</defs>';
  return res;
}
function lfLight(C,x,y,z,col,r,k){(C.lights=C.lights||[]).push([x,y,z,col,r,k])}
function lfLightLabel(){var L=lfLS(),w={sun:"Clear",cloud:L.cl>.6?"Overcast":"Partly cloudy",fog:"Marine layer",rain:LFW.storm?"Storm":"Rain"}[L.wx];return (LFW.temp!=null?Math.round(LFW.temp)+"°F · ":"")+w+" · "+L.phase+" in LA"+(LFW.src==="live"?"":"")+(L.wx==="rain"?" · Garden +30%":"")}
/* ---------- LA skyline backdrop (replaces the brick facade) ---------- */
function lfSkyline(rows){
  var L=lfLS(),sk=lfSkyCols(L),y0=LFROOF+rows*LFFP-20+26,top=-700,X0=-320,X1=LFWW+320,s='',R=lfSeed(41),uid="lfsk";
  var span=Math.min(1300,rows*LFFP*.8+300);
  s+='<defs><linearGradient id="'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+sk[0]+'"/><stop offset="1" stop-color="'+sk[1]+'"/></linearGradient></defs>';
  s+='<rect x="'+X0+'" y="'+top+'" width="'+(X1-X0)+'" height="'+(y0-top+40)+'" fill="url(#'+uid+')"/>';
  // stars
  if(L.dark>.3){var sa=Math.min(1,(L.dark-.3)*1.5)*(L.cl>.6?.15:1),r2=lfSeed(9);for(var i=0;i<90;i++){var sx=X0+r2()*(X1-X0),sy=top+r2()*(y0-top-160);s+='<circle cx="'+sx.toFixed(0)+'" cy="'+sy.toFixed(0)+'" r="'+(r2()<.15?1.8:1)+'" fill="#fff" opacity="'+(sa*(.35+r2()*.65)).toFixed(2)+'"/>'}}
  var wxClear=L.cl<.6&&L.wx!=="fog"&&L.wx!=="rain",S=L.S;
  // sun
  if(L.el>-4&&wxClear){var sx2=lfCl(200+((S.az-70)/230)*(LFWW-400),120,LFWW-120),sy2=y0-110-lfCl(L.el/70,0,1)*span,rr=L.el<9?46:30,sc=lfMix("#ff7a30","#fff4c4",lfCl(L.el/28,0,1));
    s+='<circle cx="'+sx2.toFixed(0)+'" cy="'+sy2.toFixed(0)+'" r="'+rr*4+'" fill="'+sc+'" opacity="'+(L.el<9?.28:.14)+'"/><circle cx="'+sx2.toFixed(0)+'" cy="'+sy2.toFixed(0)+'" r="'+rr*2+'" fill="'+sc+'" opacity=".25"/><circle cx="'+sx2.toFixed(0)+'" cy="'+sy2.toFixed(0)+'" r="'+rr+'" fill="'+sc+'"/>'}
  // moon
  if(L.dark>.45&&L.wx!=="rain"){var mx=300+L.mo.ph*(LFWW-600),my=y0-300-span*.55;s+='<circle cx="'+mx.toFixed(0)+'" cy="'+my.toFixed(0)+'" r="70" fill="rgba(190,210,255,.14)"/><circle cx="'+mx.toFixed(0)+'" cy="'+my.toFixed(0)+'" r="30" fill="#f4f1dc"/><circle cx="'+(mx-9).toFixed(0)+'" cy="'+(my+6).toFixed(0)+'" r="5" fill="#d9d5bd"/><circle cx="'+(mx+8).toFixed(0)+'" cy="'+(my-9).toFixed(0)+'" r="3.4" fill="#d9d5bd"/>';
    if(L.mo.ill<.92){s+='<circle cx="'+(mx+(L.mo.ph<.5?-1:1)*(8+(1-L.mo.ill)*30)).toFixed(0)+'" cy="'+(my-3)+'" r="29" fill="'+sk[0]+'"/>'}}
  // clouds (drifting)
  var cc=lfMix("#ffffff","#ffc9a0",L.golden*.9);cc=lfMix(cc,"#2a3262",L.dark*.85);if(L.wx==="rain")cc=lfMix(cc,"#6f7f95",.6);
  var co=L.wx==="fog"?.8:L.wx==="rain"?.85:lfCl(.2+L.cl*.7,0,.92),nC=L.wx==="sun"?5:11,rc=lfSeed(77);
  s+='<g fill="'+cc+'" opacity="'+co.toFixed(2)+'">';
  for(var c=0;c<nC;c++){var cx=X0+rc()*(X1-X0),cy=y0-260-rc()*span*.9,w=90+rc()*130;s+='<g class="lfdrift" style="animation-duration:'+(90+c*17)+'s;animation-delay:-'+(c*13)+'s"><ellipse cx="'+cx.toFixed(0)+'" cy="'+cy.toFixed(0)+'" rx="'+w+'" ry="'+(w*.2)+'"/><ellipse cx="'+(cx+w*.35).toFixed(0)+'" cy="'+(cy-w*.14).toFixed(0)+'" rx="'+(w*.55)+'" ry="'+(w*.18)+'"/><ellipse cx="'+(cx-w*.4).toFixed(0)+'" cy="'+(cy-w*.07).toFixed(0)+'" rx="'+(w*.45)+'" ry="'+(w*.14)+'"/></g>'}
  s+='</g>';
  s+='<g class="lfcity">';
  // haze + ground colors
  var haze=lfMix(sk[1],"#ffffff",.12),warm=L.golden*(1-L.dark);
  var far=lfMix(lfMix("#6f86ad",haze,.35),"#10152e",L.dark*.85);far=lfMix(far,"#c98a6a",warm*.5);
  var mid=lfMix(lfMix("#4d6288",haze,.2),"#0b0f26",L.dark*.88);mid=lfMix(mid,"#a8644c",warm*.45);
  var near=lfMix("#2d3552","#070a1c",L.dark*.9);near=lfMix(near,"#6a4048",warm*.4);
  if(L.wx==="rain"||L.wx==="fog"){far=lfMix(far,sk[1],.5);mid=lfMix(mid,sk[1],.35)}
  // hills (Hollywood hills + sign)
  var hl=lfMix(lfMix("#5f7a57",haze,.3),"#0d1a1c",L.dark*.9);hl=lfMix(hl,"#b07a4a",warm*.4);
  s+='<path d="M'+X0+' '+(y0-60)+' Q'+(X0+220)+' '+(y0-250)+' '+(X0+520)+' '+(y0-170)+' T'+(X0+980)+' '+(y0-200)+' T'+X1+' '+(y0-150)+' L'+X1+' '+y0+' L'+X0+' '+y0+'Z" fill="'+hl+'"/>';
  var sg=lfMix("#f2f2f2","#6a7090",L.dark*.8);s+='<g fill="'+sg+'" opacity=".9" transform="translate('+(LFWW-330)+','+(y0-212)+') rotate(-3)"><text font-family="Arial Black,Arial" font-size="15" letter-spacing="3" font-weight="900">HOLLYWOOD</text></g>';
  // downtown skyline: pixel-art buildings, three depth layers, windows driven by live sky + night lighting
  var BL=[
   [["bld_e",-150],["bld_c",20],["bld_b",190],["bld_a",330],["bld_d",430],["bld_k",560],["bld_i",690],["bld_f",830],["bld_h",950],["bld_j",1090],["bld_e",1240],["bld_c",1380]],
   [["bld_k",-40],["bld_h",150],["bld_b",300],["bld_c",430],["bld_a",540],["bld_e",640],["bld_j",760],["bld_g",900],["bld_f",1030],["bld_i",1170]],
   [["bld_g",-250],["bld_h",-80],["bld_j",1260],["bld_d",1390]]
  ],BS=[.42,.62,.86],BY=[-70,-34,12],BW=[.62,.8,1];
  function bwin(L,sk,lay,key,x,yb,wd,hg,id,R){
    var dayC=lfMix(lfMix(sk[0],"#ffffff",.18),sk[1],.4),dark=L.dark,o="";
    var base=lfMix(lfMix(dayC,"#2b3f5c",.35),"#0b1226",dark*.85);
    o+='<mask id="'+id+'m" maskUnits="userSpaceOnUse" x="'+x+'" y="'+yb+'" width="'+wd+'" height="'+hg+'"><image href="'+lfSprUrl(key+"_m")+'" x="'+x+'" y="'+yb+'" width="'+wd+'" height="'+hg+'" preserveAspectRatio="none"/></mask>';
    o+='<g mask="url(#'+id+'m)"><rect x="'+x+'" y="'+yb+'" width="'+wd+'" height="'+hg+'" fill="'+base+'"/>';
    if(dark<.55){var sh=(1-dark/.55)*(L.wx==="sun"||L.cl<.5?1:.55);o+='<rect x="'+x+'" y="'+yb+'" width="'+wd+'" height="'+hg+'" fill="url(#'+id+'g)" opacity="'+(sh*.7).toFixed(2)+'"/>'}
    if(L.dark>.2){var a=Math.min(1,(L.dark-.2)*1.5)*[.6,.85,1][lay],cw=Math.max(5,wd/26),ch=cw*1.5,nx=Math.ceil(wd/cw),ny=Math.ceil(hg/ch),lit="";
      for(var cx=0;cx<nx;cx++)for(var cy=0;cy<ny;cy++){if(R()<.5)lit+='<rect x="'+(x+cx*cw+.6).toFixed(1)+'" y="'+(yb+cy*ch+.6).toFixed(1)+'" width="'+(cw-1.2).toFixed(1)+'" height="'+(ch-1.2).toFixed(1)+'" fill="'+(R()<.78?"#ffd98a":R()<.5?"#fff1c8":"#bfe6ff")+'" opacity="'+(.55+R()*.45).toFixed(2)+'"/>'}
      o+='<g opacity="'+a.toFixed(2)+'">'+lit+'</g>'}
    return o+'</g>'}
  var BF=lfMix("#ffffff",haze,.5),defs="",bod="";
  BL.forEach(function(arr,lay){
    var tint=lay===0?lfMix(haze,"#7e93b8",.35):lay===1?lfMix(haze,"#6d7f9e",.2):"#4a5878",ta=[.46,.22,.08][lay]*(L.wx==="fog"?1.5:1),da=L.dark*[.78,.74,.7][lay];
    var nt=lfMix("#0a0f26","#1a2246",.4),wm=lfMix(tint,"#c98a6a",warm*.6);
    var fid="lfbf"+lay;defs+='<filter id="'+fid+'" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feFlood flood-color="'+lfMix(wm,nt,Math.min(1,L.dark*1.2))+'" flood-opacity="'+Math.min(.88,ta+da).toFixed(2)+'" result="f"/><feComposite in="f" in2="SourceAlpha" operator="in" result="t"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="t"/></feMerge></filter>';
    var Rr=lfSeed(300+lay),gy=y0+BY[lay]+(lay===2?10:0),gh=[34,50,70][lay],pv=lfMix(lfMix("#7f8a9c",haze,.3+(2-lay)*.12),"#0c1022",L.dark*.88),cb=lfMix(lfMix("#b9bfc9",haze,.25+(2-lay)*.1),"#262c4a",L.dark*.85);pv=lfMix(pv,"#a8644c",warm*.3);
    bod+='<rect x="'+X0+'" y="'+(gy-gh)+'" width="'+(X1-X0)+'" height="'+(gh+16)+'" fill="'+pv+'"/><rect x="'+X0+'" y="'+(gy-gh)+'" width="'+(X1-X0)+'" height="'+[2,3,4][lay]+'" fill="'+cb+'"/><rect x="'+X0+'" y="'+(gy+10)+'" width="'+(X1-X0)+'" height="6" fill="'+cb+'" opacity=".7"/>';
    for(var dx=X0;dx<X1;dx+=[46,64,90][lay])bod+='<rect x="'+dx+'" y="'+(gy-gh*.35)+'" width="'+[20,30,44][lay]+'" height="'+[1.5,2,3][lay]+'" fill="'+lfMix(cb,pv,.35)+'" opacity=".55"/>';
    arr.forEach(function(b,i){var S=window.LFSPR&&LFSPR[b[0]];if(!S)return;var wd=S.w*BS[lay],hg=S.h*BS[lay],x=b[1]+((i*37)%23)-10,yb=y0+BY[lay]-hg+(lay===2?hg*.04:0),id="lfb"+lay+"_"+i;
      defs+='<linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".0"/><stop offset=".45" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="#ffffff" stop-opacity=".05"/></linearGradient>';
      bod+='<g filter="url(#'+fid+')"><image href="'+lfSprUrl(b[0])+'" x="'+x+'" y="'+yb.toFixed(1)+'" width="'+wd.toFixed(1)+'" height="'+hg.toFixed(1)+'" preserveAspectRatio="none" style=""/></g>'+(S.w&&window.LFSPR[b[0]+"_m"]?bwin(L,sk,lay,b[0],x,+yb.toFixed(1),+wd.toFixed(1),+hg.toFixed(1),id,Rr):'')+'';
      if(b[0]==="bld_a"||b[0]==="bld_e")bod+='<circle cx="'+(x+wd*.5).toFixed(0)+'" cy="'+(yb+4).toFixed(0)+'" r="2.4" fill="#ff4040" class="lfblink"/>'});
    if(lay===0)bod+='<rect x="'+X0+'" y="'+(y0-190)+'" width="'+(X1-X0)+'" height="200" fill="'+haze+'" opacity="'+(L.dark>.5?.05:.2)+'"/>';
  });
  s+='<defs>'+defs+'</defs>'+bod;
  // street-level palms
  var pc=lfMix("#1f2b2a","#05080f",L.dark*.9);
  [[40,0],[210,1],[1010,0],[1150,1]].forEach(function(p){var x=p[0],h=170+p[1]*30;s+='<g transform="translate('+x+','+y0+')"><path d="M0 0 Q4 '+(-h*.5)+' 0 '+(-h)+'" stroke="'+pc+'" stroke-width="6" fill="none"/>';for(var a=-2;a<=2;a++)s+='<path d="M0 '+(-h)+' q'+(a*26)+' '+(-24+Math.abs(a)*10)+' '+(a*40)+' '+(Math.abs(a)*14)+'" stroke="'+pc+'" stroke-width="5" fill="none" stroke-linecap="round"/>';s+='</g>'});
  // low haze at the base
  s+='<rect x="'+X0+'" y="'+(y0-120)+'" width="'+(X1-X0)+'" height="130" fill="'+haze+'" opacity="'+(L.dark>.5?.06:.22)+'"/>';
  if(L.wx==="rain")s+='<rect x="'+X0+'" y="'+top+'" width="'+(X1-X0)+'" height="'+(y0-top)+'" fill="rgba(70,85,110,.28)"/>';
  if(L.wx==="fog")s+='<rect x="'+X0+'" y="'+top+'" width="'+(X1-X0)+'" height="'+(y0-top)+'" fill="rgba(225,232,240,.4)"/>';
  return '<g class="lfskyl" pointer-events="none">'+s+'</g></g>';
}

/* shell: floor, walls, slab, windows */
function lfFloor(T,kind,st,uid){
  if(window.LFCR==="bedroom"&&window.lfFloor4&&window.LFSP4&&LFSP4.shl_floor)return lfFloor4(uid);
  var N=LF.W,M=LF.D,s="",R=lfSeed(7+uid);
  var base={w:["#c0864f","#b57a45","#c98f58","#ad7140","#bd8350"],d:["#5a4a78","#52436e","#614f80","#4b3e66","#574776"],g:["#4d5a6a","#46525f","#566372","#404c59","#4f5c6c"],t:["#b4bc86","#aab27c","#bdc58f","#a2aa74","#b0b882"],
    grass:["#6fbf5a","#66b552","#78c862","#5fae4c","#6bba56"],grass2:["#6fbf5a","#66b552","#78c862","#5fae4c","#6bba56"],dirt:["#9a6b3e","#8f6236","#a4743f","#865a32","#986a3c"],deck:["#a27650","#986c46","#ad7f58","#8f643f","#a07450"]}[kind]||[];
  var wood=kind==="w"||kind==="deck"||kind==="d"||kind==="g";
  if(kind==="stone"||kind==="s"||kind==="k"){var pal=kind==="k"?["#4a4560","#443f59","#504a68","#3d3952"]:["#a39d92","#99938a","#aca69b","#8f897f"],sz=2;
    for(var a=0;a*sz<N;a++)for(var b2=0;b2*sz<M;b2++){var x0=a*sz,y0=b2*sz,w2=Math.min(sz,N-x0),d2=Math.min(sz,M-y0);
      s+=lfPoly([lfP(x0,y0,0),lfP(x0+w2,y0,0),lfP(x0+w2,y0+d2,0),lfP(x0,y0+d2,0)],pal[(a*3+b2*5+uid)%4],"rgba(30,28,24,.42)",.8);
      s+=lfPoly([lfP(x0+.08,y0+.08,0),lfP(x0+w2-.08,y0+.08,0),lfP(x0+w2-.08,y0+.2,0),lfP(x0+.08,y0+.2,0)],"rgba(255,255,255,.10)")}
    for(var q2=0;q2<N*M*1.4;q2++){var p3=lfP(R()*N,R()*M,0);s+='<circle cx="'+p3[0].toFixed(1)+'" cy="'+p3[1].toFixed(1)+'" r=".8" fill="rgba(30,28,24,.25)"/>'}
    return s}
  // base poly
  s+=lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,M,0),lfP(0,M,0)],base[0],"rgba(20,26,50,.5)",1);
  if(wood){
    var rows=M*2;
    for(var j=0;j<rows;j++){var y0=j/2,c=base[Math.floor(R()*base.length)],off=R()*1.6;
      s+=lfPoly([lfP(0,y0,0),lfP(N,y0,0),lfP(N,y0+.5,0),lfP(0,y0+.5,0)],c,"rgba(40,22,10,.28)",.6);
      s+=lfPoly([lfP(0,y0+.05,0),lfP(N,y0+.05,0),lfP(N,y0+.12,0),lfP(0,y0+.12,0)],"rgba(255,255,255,.10)");
      // end joints staggered
      for(var xx=off;xx<N;xx+=2.1){s+='<path d="M'+lfPt(lfP(xx,y0,0))+' L'+lfPt(lfP(xx,y0+.5,0))+'" stroke="rgba(40,22,10,.35)" stroke-width=".7"/>'}
      // grain
      for(var g=0;g<4;g++){var gx=R()*N,gl=.5+R()*1.4,gy=y0+.12+R()*.3;s+='<path d="M'+lfPt(lfP(gx,gy,0))+' L'+lfPt(lfP(Math.min(N,gx+gl),gy,0))+'" stroke="rgba(60,30,12,.22)" stroke-width=".6"/>'}
    }
  }else if(kind==="t"){ // tatami
    var th2=M/2;for(var a=0;a<Math.ceil(N/2);a++)for(var b=0;b<2;b++){var x0=a*2,y0=b*th2;s+=lfPoly([lfP(x0,y0,0),lfP(x0+2,y0,0),lfP(x0+2,y0+th2,0),lfP(x0,y0+th2,0)],(a+b)%2?base[1]:base[2],"rgba(60,70,30,.55)",1);for(var k=1;k<8;k++)s+='<path d="M'+lfPt(lfP(x0,y0+k*th2/8,0))+' L'+lfPt(lfP(x0+2,y0+k*th2/8,0))+'" stroke="rgba(70,80,36,.25)" stroke-width=".5"/>'}
  }else{ // grass / dirt
    for(var i=0;i<N*M;i++){var gx2=(i%N),gy2=Math.floor(i/N);s+=lfPoly([lfP(gx2,gy2,0),lfP(gx2+1,gy2,0),lfP(gx2+1,gy2+1,0),lfP(gx2,gy2+1,0)],base[(gx2*3+gy2*5+uid)%5],"rgba(30,70,20,.12)",.5)}
    for(var q=0;q<Math.round(70*N*M/36);q++){var px=R()*N,py=R()*M,p=lfP(px,py,0);s+='<path d="M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' l-1 -4 M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' l1.5 -3.4" stroke="'+(kind==="dirt"?"#6e4a28":"#3f8f36")+'" stroke-width=".9" opacity=".55"/>'}
  }
  return s;
}
function lfSlab(){var N=LF.W,M=LF.D,t=15;
  return lfPoly([lfP(0,M,0),lfP(N,M,0),lfP(N,M,-t),lfP(0,M,-t)],"#4d3a52","rgba(18,20,40,.7)",1)
   +lfPoly([lfP(N,0,0),lfP(N,M,0),lfP(N,M,-t),lfP(N,0,-t)],"#392a3f","rgba(18,20,40,.7)",1)
   +lfPoly([lfP(0,M,-t+4),lfP(N,M,-t+4),lfP(N,M,-t+6),lfP(0,M,-t+6)],"rgba(255,255,255,.1)")
   +lfPoly([lfP(0,M,0),lfP(N,M,0),lfP(N,M,-2),lfP(0,M,-2)],"#7a5b4a");
}
function lfWalls(t,st,uid,wx){
  if(window.LFCR==="bedroom"&&window.lfWalls4&&window.LFSP4&&LFSP4.shl_wall)return lfWalls4(t,st,uid,wx);
  var N=LF.W,M=LF.D,H=LF.H,c=lfWallC(t,st),w=c[0],wn=c[1],s="",th=.42;
  // wall bases (inner faces)
  s+='<linearGradient id="lfwl'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+lfSh(w,.14)+'"/><stop offset="1" stop-color="'+lfSh(w,-.1)+'"/></linearGradient>';
  s+='<linearGradient id="lfwr'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+lfSh(w,.04)+'"/><stop offset="1" stop-color="'+lfSh(w,-.22)+'"/></linearGradient>';
  // left wall (plane x=0) inner
  s+=lfPoly([lfP(0,0,0),lfP(0,M,0),lfP(0,M,H),lfP(0,0,H)],'url(#lfwl'+uid+')',LFOL,1);
  // right wall (plane y=0) inner
  s+=lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,0,H),lfP(0,0,H)],'url(#lfwr'+uid+')',LFOL,1);
  // thickness caps
  s+=lfPoly([lfP(-th,-th,H),lfP(-th,M,H),lfP(0,M,H),lfP(0,0,H),lfP(N,0,H),lfP(N,-th,H)],lfSh(w,.4),LFOL,1);
  s+=lfPoly([lfP(-th,M,0),lfP(0,M,0),lfP(0,M,H),lfP(-th,M,H)],lfSh(wn,-.15),LFOL,1);
  s+=lfPoly([lfP(N,-th,0),lfP(N,0,0),lfP(N,0,H),lfP(N,-th,H)],lfSh(wn,-.35),LFOL,1);
  s+=lfPoly([lfP(-th,-th,0),lfP(0,0,0),lfP(0,0,H),lfP(-th,-th,H)],lfSh(w,-.3),"none");
  // wainscot
  var wh=40;
  s+=lfPoly([lfP(0,0,0),lfP(0,M,0),lfP(0,M,wh),lfP(0,0,wh)],wn,"none");
  s+=lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,0,wh),lfP(0,0,wh)],lfSh(wn,-.16),"none");
  for(var k=1;k<Math.max(N,M)*2;k++){var u=k/2;
    if(u<M){s+='<path d="M'+lfPt(lfP(0,u,4))+' L'+lfPt(lfP(0,u,wh-3))+'" stroke="rgba(10,16,36,.22)" stroke-width="1"/>';}
    if(u<N){s+='<path d="M'+lfPt(lfP(u,0,4))+' L'+lfPt(lfP(u,0,wh-3))+'" stroke="rgba(10,16,36,.26)" stroke-width="1"/>';}
    if(u<M){s+='<path d="M'+lfPt(lfP(0,u+.03,4))+' L'+lfPt(lfP(0,u+.03,wh-3))+'" stroke="rgba(255,255,255,.12)" stroke-width=".8"/>';}
    if(u<N){s+='<path d="M'+lfPt(lfP(u+.03,0,4))+' L'+lfPt(lfP(u+.03,0,wh-3))+'" stroke="rgba(255,255,255,.1)" stroke-width=".8"/>';}
  }
  // chair rail + baseboard + crown
  s+=lfPoly([lfP(0,0,wh),lfP(0,M,wh),lfP(0,M,wh+4),lfP(0,0,wh+4)],lfSh(w,.55),LFOL,.7);
  s+=lfPoly([lfP(0,0,wh),lfP(N,0,wh),lfP(N,0,wh+4),lfP(0,0,wh+4)],lfSh(w,.4),LFOL,.7);
  s+=lfPoly([lfP(0,0,0),lfP(0,M,0),lfP(0,M,5),lfP(0,0,5)],"#f3ead8",LFOL,.7);
  s+=lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,0,5),lfP(0,0,5)],"#d9cfb9",LFOL,.7);
  s+=lfPoly([lfP(0,0,H-6),lfP(0,M,H-6),lfP(0,M,H),lfP(0,0,H)],lfSh(w,.45),LFOL,.7);
  s+=lfPoly([lfP(0,0,H-6),lfP(N,0,H-6),lfP(N,0,H),lfP(0,0,H)],lfSh(w,.3),LFOL,.7);
  // wallpaper subtle pattern above rail
  for(var r=0;r<Math.max(N,M)*2;r++){var u2=r*.5+.25;
    if(u2<M)s+='<path d="M'+lfPt(lfP(0,u2,wh+10))+' L'+lfPt(lfP(0,u2,H-10))+'" stroke="rgba(255,255,255,.06)" stroke-width="2.2"/>';
    if(u2<N)s+='<path d="M'+lfPt(lfP(u2,0,wh+10))+' L'+lfPt(lfP(u2,0,H-10))+'" stroke="rgba(255,255,255,.05)" stroke-width="2.2"/>';
  }
  return s;
}
/* window on right wall (plane y=0) between x0..x0+w; weather sets the glass */
function lfWindow(x0,wx){
  LFWINS.push(x0);var L=lfLS(),id="lfwg"+Math.floor(x0*10)+"_"+Math.round(L.el)+wx;
  var c='<path d="M0 60 L0 24 Q0 0 26 0 Q52 0 52 24 L52 60Z" fill="#f0e6d2" stroke="'+LFOL+'" stroke-width="1"/>'+lfSkyArt(L,x0,id);
  c+='<path d="M26 6 L26 56 M5 30 L47 30" stroke="#f0e6d2" stroke-width="2.4"/><path d="M5 25 Q5 6 26 6" stroke="rgba(255,255,255,.4)" stroke-width="1" fill="none"/>'
   +'<rect x="-3" y="56" width="58" height="5" rx="1" fill="#e7dcc4" stroke="'+LFOL+'" stroke-width=".8"/>'
   +'<path d="M-4 -2 L8 -2 L8 58 Q-2 52 -4 58Z" fill="#d95f7a" opacity=".92"/><path d="M60 -2 L44 -2 L44 58 Q54 52 60 58Z" fill="#d95f7a" opacity=".92"/><path d="M-2 4 L-2 54 M3 4 L3 56 M48 4 L48 56 M54 4 L54 54" stroke="rgba(0,0,0,.14)" stroke-width="1"/>'
   +'<rect x="-6" y="-4" width="66" height="3" fill="#b9a87f" stroke="'+LFOL+'" stroke-width=".6"/>';
  return lfFaceY(x0,0,86,c);
}
function lfWinLight(x0){return ""}
/* outdoor shell: no walls; sky backdrop, hedge back rail, bright light */
function lfOutBack(t,wx,uid){
  var N=LF.W,M=LF.D,H=LF.H,L=lfLS(),sk=lfSkyCols(L);if(t==="sky")sk=[lfMix(sk[0],"#253d78",.4),lfMix(sk[1],"#f0a36b",.35*(1-L.dark))];
  var fz=lfCl(L.golden*1.5,0,1)*(1-L.dark*.5)*(1-lfCl(L.cl,0,1)*.5),tp=lfMix(sk[0],"#40368a",fz*.7),md=lfMix(lfMix(sk[0],sk[1],.5),"#ff6f8f",fz*.85),lw=lfMix(sk[1],"#ffb54d",fz*.9);
  var s='<linearGradient id="lfsk'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+tp+'"/><stop offset=".55" stop-color="'+md+'"/><stop offset="1" stop-color="'+lw+'"/></linearGradient>';
  var e0=t==="sky"?9:.2,big=[lfP(-e0,-e0,-8-(t==="sky"?120:0)),lfP(N+e0,-e0,-8-(t==="sky"?120:0)),lfP(N+e0,-e0,H+16+(t==="sky"?60:0)),lfP(-e0,-e0,H+16+(t==="sky"?60:0)),lfP(-e0,M+e0,H+16+(t==="sky"?60:0)),lfP(-e0,M+e0,-8-(t==="sky"?120:0))];
  if(t==="sky"){var bx=big.map(function(q){return q[0]}),by=big.map(function(q){return q[1]}),x0=Math.min.apply(0,bx),x1=Math.max.apply(0,bx),y0=Math.min.apply(0,by),y1=Math.max.apply(0,by);s+='<rect x="'+x0.toFixed(0)+'" y="'+y0.toFixed(0)+'" width="'+(x1-x0).toFixed(0)+'" height="'+(y1-y0).toFixed(0)+'" fill="url(#lfsk'+uid+')"/>'}else s+=lfPoly(big,'url(#lfsk'+uid+')',"none");
  // clouds
  var c=[[-70,H-70,34],[40,H-100,26],[110,H-62,30]];
  var ccx=lfMix("#ffffff","#ffc9a0",L.golden*.9);ccx=lfMix(ccx,"#262f5a",L.dark*.85);if(wx==="rain")ccx=lfMix(ccx,"#6f7f95",.6);
  c.forEach(function(q){s+='<g opacity="'+(wx==="fog"?.9:lfCl(.25+L.cl*.7,0,.9)).toFixed(2)+'" fill="'+ccx+'">'+lfE(q[0],q[1],q[2],q[2]*.36,"inherit")+lfE(q[0]+q[2]*.5,q[1]-4,q[2]*.55,q[2]*.3,"inherit")+'</g>'});
  if(L.dark>.4){var R0=lfSeed(uid+11);for(var si=0;si<26;si++){var sp=lfP(R0()*N,-.2,40+R0()*(H-10));s+='<circle cx="'+sp[0].toFixed(1)+'" cy="'+sp[1].toFixed(1)+'" r="'+(R0()<.2?1.3:.7)+'" fill="#fff" opacity="'+(lfCl((L.dark-.4)*1.5,0,1)*(L.cl>.6?.2:.8)*R0()).toFixed(2)+'"/>'}}
  if(L.el>-3&&L.cl<.7&&wx!=="fog"&&wx!=="rain"){var hz=lfCl((L.el+3)/60,0,1),sc=lfP(N*.25+lfCl((L.S.az-190)/150,0,1)*N*.5,0,18+hz*(H-30)),scl=lfMix("#ff8a3a","#fff6c8",lfCl(L.el/25,0,1));s+='<circle cx="'+sc[0]+'" cy="'+sc[1]+'" r="'+(L.el<8?26:20)+'" fill="'+scl+'" opacity=".3"/><circle cx="'+sc[0]+'" cy="'+sc[1]+'" r="'+(L.el<8?15:12)+'" fill="'+scl+'"/>'}
  else if(L.dark>.4&&wx!=="rain"){var mc=lfP(N*.7,0,H*.8);s+='<circle cx="'+mc[0]+'" cy="'+mc[1]+'" r="22" fill="rgba(190,210,255,.2)"/><circle cx="'+mc[0]+'" cy="'+mc[1]+'" r="11" fill="#f2f0dc"/>'}
  // distant skyline / trees
  var R=lfSeed(uid+3);
  if(t==="sky"){s+=lfSkyView(N,M,L,uid)}
  else for(var i=0;i<Math.round(N);i++){var p=lfP(.3+i*N/Math.round(N)*.97,-.3,0),r=16+R()*10;s+='<circle cx="'+p[0].toFixed(1)+'" cy="'+(p[1]-18).toFixed(1)+'" r="'+r.toFixed(1)+'" fill="'+lfMix("#4f9b44","#2d6a3a",R()*.7)+'"/><rect x="'+(p[0]-2).toFixed(1)+'" y="'+(p[1]-8).toFixed(1)+'" width="4" height="14" fill="#6b4a2c"/>'}
  return s;
}
function lfOutFront(t,uid){ // fence/hedge on back edges + low curb along front edges
  var N=LF.W,M=LF.D,s="";
  var hedge=t==="sky"?"#2b2f55":"#3f9a45";
  function seg(a,b,c,d){return lfBox(a,b,0,c,d,t==="sky"?20:15,hedge,{top:lfSh(hedge,.3),r:lfSh(hedge,-.3)})}
  if(t==="sky"){
    var gl=function(a,b,pl){return lfPoly(pl==="r"?[lfP(a,0,2),lfP(b,0,2),lfP(b,0,26),lfP(a,0,26)]:[lfP(0,a,2),lfP(0,b,2),lfP(0,b,26),lfP(0,a,26)],"rgba(200,232,255,.17)","rgba(255,255,255,.38)",.8)};
    for(var gi=0;gi<N;gi+=2)s+=gl(gi,Math.min(N,gi+2),"r");for(var gj=0;gj<M;gj+=2)s+=gl(gj,Math.min(M,gj+2),"l");
    s+=lfBox(0,-.05,26,N,.1,2.4,"#d5dcea",{top:"#f2f5fb"})+lfBox(-.05,0,26,.1,M,2.4,"#c2cbdd",{top:"#f2f5fb"});
    for(var pi=0;pi<=N;pi+=2)s+=lfBox(pi-.05,-.05,0,.1,.1,26,"#c9d2e0",{top:"#f2f5fb"});
    for(var pj=2;pj<=M;pj+=2)s+=lfBox(-.05,pj-.05,0,.1,.1,26,"#b9c3d8",{top:"#f2f5fb"});
  }else{
    s+=lfBox(0,0,0,N,.45,14,hedge,{top:lfSh(hedge,.28),r:lfSh(hedge,-.28)})+lfBox(0,.45,0,.45,M-.45,14,lfSh(hedge,-.08),{top:lfSh(hedge,.28),r:lfSh(hedge,-.28)});
    var R=lfSeed(uid+9);for(var k=0;k<46;k++){var x=R()*N,p=lfP(x,.46,4+R()*8);s+='<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="1.4" fill="'+lfSh(hedge,.3+R()*.3)+'"/>'}
    for(var j=0;j<7;j++){var p2=lfP(.6+j*.8,.46,10);s+='<circle cx="'+p2[0].toFixed(1)+'" cy="'+p2[1].toFixed(1)+'" r="2" fill="'+["#ff8fb2","#ffe27a","#fff","#b0a0ff"][j%4]+'"/>'}
  }
  return s;
}

/* ===== soft-3D textured shell ===== */
var LFDEC=null,LFTEXU={};
function lfTexUrl(k){var d=window.LFTEX&&LFTEX[k];if(!d)return null;if(LFTEXU[k])return LFTEXU[k];try{var b=atob(d.split(",")[1]),n=b.length,u=new Uint8Array(n);while(n--)u[n]=b.charCodeAt(n);LFTEXU[k]=URL.createObjectURL(new Blob([u],{type:"image/jpeg"}))}catch(e){LFTEXU[k]=d}return LFTEXU[k]}
function lfPat(id,key,tw,th,pt){var u=lfTexUrl(key);if(!u)return "";var im=function(tr){return '<image href="'+u+'" x="0" y="0" width="'+tw+'" height="'+th+'" preserveAspectRatio="none"'+(tr?' transform="'+tr+'"':'')+'/>'};
  return '<pattern id="'+id+'" patternUnits="userSpaceOnUse" width="'+(tw*2)+'" height="'+(th*2)+'" patternTransform="'+pt+'">'+im("")+im("translate("+tw*2+",0) scale(-1,1)")+im("translate(0,"+th*2+") scale(1,-1)")+im("translate("+tw*2+","+th*2+") scale(-1,-1)")+'</pattern>'}
var LFDEFFL={w:"oak",d:"walnut",g:"concrete",t:"bamboo"};
/* curated per-room style sets. fl floor, wl/wr left/right wall texture, wc/wcr paint tint, acc accent segment on a wall */
var LFDS={
 bedroom:[
  {id:"mid",name:"Neutral Loft",cost:0,fl:"oak",wl:"plaster",wc:"#ddd8cf",wr:"plaster",wcr:"#cfcac1"},
  {id:"brick",name:"Brick Studio",cost:3000,fl:"concrete",wl:"plaster",wc:"#d9d2c6",wr:"plaster",wcr:"#c9c2b6",acc:{w:"L",a:4.3,b:9,tex:"brick"}},/* left wall (Cal): the patio glass covers the back-right wall */
  {id:"warm",name:"Warm Oak",cost:2200,fl:"oak",wl:"plaster",wc:"#ead7cd",wr:"plaster",wcr:"#bfd0c2",acc:{w:"L",a:4.3,b:9,c:"#c98a8a"}},
  {id:"noir",name:"Neon Noir",cost:5200,fl:"walnut",wl:"plaster",wc:"#5a6486",wr:"plaster",wcr:"#4a5374",acc:{w:"L",a:4.3,b:9.3,tex:"slat"}}],
 lounge:[
  {id:"cozy",name:"Neutral Lounge",cost:0,fl:"oak",wl:"plaster",wc:"#ddd8cf",wr:"plaster",wcr:"#cfcac1"},
  {id:"loft",name:"Industrial Lounge",cost:3200,fl:"concrete",wl:"plaster",wc:"#d4cfc8",wr:"plaster",wcr:"#c5c0b9",acc:{w:"L",a:1,b:8,tex:"brick"}},
  {id:"sage",name:"Sage & Walnut",cost:2600,fl:"walnut",wl:"plaster",wc:"#c3d4c3",wr:"plaster",wcr:"#b0c4b2",acc:{w:"R",a:2,b:9,tex:"slat"}},
  {id:"blush",name:"Blush Pop",cost:2400,fl:"white",wl:"plaster",wc:"#ecd0cb",wr:"plaster",wcr:"#c8d3ea",acc:{w:"L",a:2,b:7,c:"#7f9bbd"}}],
 restaurant:[
  {id:"bistro",name:"Neutral Bistro",cost:0,fl:"oak",wl:"plaster",wc:"#efe3cf",wr:"plaster",wcr:"#e2d3bb"},
  {id:"brickbar",name:"Brick Bar Wall",cost:3800,fl:"herring",wl:"plaster",wc:"#e7ddcc",wr:"plaster",wcr:"#d8ccb8",acc:{w:"L",a:.3,b:4.7,tex:"brick"}},
  {id:"modern",name:"Modern Dining",cost:3400,fl:"concrete",wl:"plaster",wc:"#d9dde6",wr:"plaster",wcr:"#c7ccd8",acc:{w:"L",a:.3,b:4.7,c:"#2b3552"}},
  {id:"trattoria",name:"Trattoria Red",cost:4200,fl:"walnut",wl:"plaster",wc:"#efdcc3",wr:"plaster",wcr:"#e2cdb0",acc:{w:"L",a:.3,b:4.7,c:"#9a3a3a"}}]
};
function lfDecSets(t){if(LFDS[t])return LFDS[t];var th=LFTH[t]||LFTH.lounge,w=th.wall||"#86a6cc",f=LFDEFFL[th.fl]||"oak";
  return [{id:"std",name:"Neutral",cost:0,fl:f,wl:"plaster",wc:"#ddd8cf",wr:"plaster",wcr:"#cfcac1"},
   {id:"ind",name:"Industrial",cost:3000,fl:"concrete",wl:"plaster",wc:"#d6d2cb",wr:"plaster",wcr:"#c6c2bb",acc:{w:"L",a:1,b:7,tex:"brick"}},
   {id:"mod",name:"Modern",cost:2600,fl:"grey",wl:"plaster",wc:"#d8dce6",wr:"plaster",wcr:"#c4c9d6",acc:{w:"R",a:2,b:8,c:"#2b3552"}}]}
function lfDecUnlocked(r,s){return !s.cost||(r.du&&r.du[s.id])}
function lfDecFor(r,T){if(!window.LFTEX||T.out)return null;var sets=lfDecSets(r.t),s=sets.filter(function(q){return q.id===r.ds&&lfDecUnlocked(r,q)})[0]||sets[0];return s}
function lfTexFloor(uid){var N=LF.W,M=LF.D,id="lfpf"+uid,s=lfPat(id,"f_"+LFDEC.fl,4,2.667,"matrix(26,13,-26,13,0,0)");
  s+=lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,M,0),lfP(0,M,0)],'url(#'+id+')',"rgba(20,26,50,.5)",1);
  s+=lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,M,0),lfP(0,M,0)],'url(#lfshf'+uid+')',"none");
  return '<linearGradient id="lfshf'+uid+'" gradientUnits="userSpaceOnUse" x1="'+lfP(0,0,0)[0]+'" y1="'+lfP(0,0,0)[1]+'" x2="'+lfP(N,M,0)[0]+'" y2="'+lfP(N,M,0)[1]+'"><stop offset="0" stop-color="rgba(255,236,200,.10)"/><stop offset="1" stop-color="rgba(20,16,40,.18)"/></linearGradient>'+s}
function lfTexWalls(t,st,uid,wx){var N=LF.W,M=LF.D,H=LF.H,c=lfWallC(t,st),w=c[0],wn=c[1],s="",th=.42,D=LFDEC,kl="w_"+D.wl,kr="w_"+(D.wr||D.wl),idl="lfpl"+uid,idr="lfpr"+uid;
  s+=lfPat(idl,kl,6,104,"matrix(-26,13,0,1,0,"+(-H)+")")+lfPat(idr,kr,6,104,"matrix(26,13,0,1,0,"+(-H)+")");
  var L=[lfP(0,0,0),lfP(0,M,0),lfP(0,M,H),lfP(0,0,H)],R=[lfP(0,0,0),lfP(N,0,0),lfP(N,0,H),lfP(0,0,H)];
  s+=lfPoly(L,'url(#'+idl+')',LFOL,1)+lfPoly(R,'url(#'+idr+')',LFOL,1);
  if(D.wc)s+=lfPoly(L,D.wc,"none",0,' style="mix-blend-mode:multiply"');
  if(D.wcr||D.wc)s+=lfPoly(R,D.wcr||lfSh(D.wc,-.12),"none",0,' style="mix-blend-mode:multiply"');
  if(D.acc){var A=D.acc,L2=A.w==="L",a0=A.a,b0=Math.min(A.b,L2?M:N),pts=L2?[lfP(0,a0,0),lfP(0,b0,0),lfP(0,b0,H),lfP(0,a0,H)]:[lfP(a0,0,0),lfP(b0,0,0),lfP(b0,0,H),lfP(a0,0,H)];
    if(A.tex){var ia="lfpa"+uid;s+=lfPat(ia,"w_"+A.tex,6,104,L2?"matrix(-26,13,0,1,0,"+(-H)+")":"matrix(26,13,0,1,0,"+(-H)+")");s+=lfPoly(pts,'url(#'+ia+')',LFOL,.8)}
    else{var ib="lfpb"+uid;s+=lfPat(ib,"w_plaster",6,104,L2?"matrix(-26,13,0,1,0,"+(-H)+")":"matrix(26,13,0,1,0,"+(-H)+")");s+=lfPoly(pts,'url(#'+ib+')',LFOL,.8)+lfPoly(pts,A.c,"none",0,' style="mix-blend-mode:multiply"')}
    var tr=lfPoly(L2?[lfP(0,a0,0),lfP(0,a0+.08,0),lfP(0,a0+.08,H),lfP(0,a0,H)]:[lfP(a0,0,0),lfP(a0+.08,0,0),lfP(a0+.08,0,H),lfP(a0,0,H)],"rgba(0,0,0,.18)","none");s+=tr}
  s+='<linearGradient id="lfwsh'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,244,222,.10)"/><stop offset=".6" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(18,14,34,.30)"/></linearGradient>';
  s+=lfPoly(L,'url(#lfwsh'+uid+')',"none")+lfPoly(R,'url(#lfwsh'+uid+')',"none");
  s+=lfPoly(R,"rgba(14,10,30,.12)","none");
  var base="#f4ede0";
  s+=lfPoly([lfP(-th,-th,H),lfP(-th,M,H),lfP(0,M,H),lfP(0,0,H),lfP(N,0,H),lfP(N,-th,H)],lfSh(w,.4),LFOL,1);
  s+=lfPoly([lfP(-th,M,0),lfP(0,M,0),lfP(0,M,H),lfP(-th,M,H)],lfSh(wn,-.15),LFOL,1);
  s+=lfPoly([lfP(N,-th,0),lfP(N,0,0),lfP(N,0,H),lfP(N,-th,H)],lfSh(wn,-.35),LFOL,1);
  s+=lfPoly([lfP(-th,-th,0),lfP(0,0,0),lfP(0,0,H),lfP(-th,-th,H)],lfSh(w,-.3),"none");
  s+=lfPoly([lfP(0,0,0),lfP(0,M,0),lfP(0,M,6),lfP(0,0,6)],base,LFOL,.6)+lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,0,6),lfP(0,0,6)],lfSh(base,-.12),LFOL,.6);
  s+=lfPoly([lfP(0,0,H-5),lfP(0,M,H-5),lfP(0,M,H),lfP(0,0,H)],base,LFOL,.5)+lfPoly([lfP(0,0,H-5),lfP(N,0,H-5),lfP(N,0,H),lfP(0,0,H)],lfSh(base,-.1),LFOL,.5);
  return s}
(function(){var f=lfFloor;lfFloor=function(T,kind,st,uid){if(LFDEC&&LFDEC.fl&&lfTexUrl("f_"+LFDEC.fl))return lfTexFloor(uid);return f(T,kind,st,uid)};
 var w=lfWalls;lfWalls=function(t,st,uid,wx){if(LFDEC&&LFDEC.wl&&lfTexUrl("w_"+LFDEC.wl))return lfTexWalls(t,st,uid,wx);return w(t,st,uid,wx)}})();

/* old add-on ids -> soft-3D tier ids */
var LFMIGA={l_desk:"bd_desk1",l_pc:"bd_pc1",l_chair:"bd_chair1",l_lamp:"bd_nstand",bd_ward:"bd_ward1",bd_post:"bd_art2"};
function lfMigA(r){if(!r||r.t!=="bedroom"||!r.a||r.a.__m35)return;Object.keys(LFMIGA).forEach(function(k){if(r.a[k]){r.a[LFMIGA[k]]=1;delete r.a[k]}});r.a.__m35=1}

/* prop helpers. ctx.box adds sorted items, ctx.s adds stations */
function lfCtx(t,own,uid,st,wx){var C={t:t,own:own||{},uid:uid,W:LF.W,D:LF.D,plat:[],st:[],items:[],decals:[],walls:[],front:[],wx:wx||"sun",T:LFTH[t]||LFTH.lounge,sc:st||0};
  C.add=function(k,svg){C.items.push({k:k,s:svg,b:C._lb||null});C._lb=null};
  C.box=function(x,y,z,w,d,h,c,o){C.add(x+w+y+d-(o&&o.dk||0),lfBox(x,y,z,w,d,h,c,o))};
  C.s=function(kind,x,y,fx,act,dur,o){var s=Object.assign({kind:kind,x:x,y:y,fx:fx,act:act||"look",dur:dur||[3,6]},o||{});s.ix=C.st.length;C.st.push(s);return s};
  C.has=function(id){return !!C.own[id]};
  C.acc=C.T.acc;
  return C;
}
function lfPlant(C,x,y,sc,pot){sc=sc||1;pot=pot||"#d98c5a";
  C.add(x+y+.3,lfBox(x-.22,y-.22,0,.44,.44,12*sc,pot,{top:lfSh(pot,-.1)}));
  var b=lfP(x,y,12*sc),s="",R=lfSeed(Math.floor(x*10+y*7));
  for(var i=0;i<9;i++){var a=-Math.PI/2+(i-4)*.36+R()*.1,l=(26+R()*14)*sc,ex=b[0]+Math.cos(a)*l*.9,ey=b[1]+Math.sin(a)*l-R()*4,mx=(b[0]+ex)/2+(R()-.5)*6,my=(b[1]+ey)/2-8*sc;
    var c=i%2?"#2f8f4a":"#3fae5a";
    s+='<path d="M'+b[0].toFixed(1)+' '+b[1].toFixed(1)+' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+ex.toFixed(1)+' '+ey.toFixed(1)+' Q'+(mx+5).toFixed(1)+' '+(my+5).toFixed(1)+' '+b[0].toFixed(1)+' '+b[1].toFixed(1)+'Z" fill="'+c+'" stroke="rgba(10,50,30,.55)" stroke-width=".7"/><path d="M'+b[0].toFixed(1)+' '+b[1].toFixed(1)+' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+ex.toFixed(1)+' '+ey.toFixed(1)+'" stroke="rgba(255,255,255,.28)" stroke-width=".7" fill="none"/>'}
  C.add(x+y+.32,s);
}
function lfSofa(C,x,y,w,col){col=col||"#8a4a6a";
  C.box(x,y,0,w,1.05,9,lfSh(col,-.22),{dk:.7});
  C.add(x+w+y+.35,lfBox(x,y,9,w,.34,20,col,{top:lfSh(col,.22)}));
  C.add(x+w+y+1.05,lfBox(x+.3,y+.34,9,w-.6,.72,5,lfSh(col,.1),{top:lfSh(col,.3)}));
  C.add(x+w+y+1.06,lfBox(x,y,9,.32,1.05,8,lfSh(col,-.1)));
  C.add(x+w+y+1.06,lfBox(x+w-.32,y,9,.32,1.05,8,lfSh(col,-.1)));
  var g="";for(var i=1;i<3;i++){var u=x+.3+(w-.6)*i/3;g+='<path d="M'+lfPt(lfP(u,y+.4,14))+' L'+lfPt(lfP(u,y+1.04,14))+'" stroke="rgba(0,0,0,.25)" stroke-width=".8"/>'}
  C.add(x+w+y+1.07,g);
  for(var k=0;k<w-.4;k+=1.1){var bx=x+.55+k;C.s("sit",bx+.35,y+.72,-1,"sit",[8,20],{dk:x+w+y+1.07,tag:"sofa"})}
}
function lfStool(C,x,y,c){c=c||"#6a4a3a";C.add(x+y+.3,lfBox(x-.2,y-.2,0,.4,.4,3,"#4b3a30")+lfBox(x-.16,y-.16,3,.32,.32,13,lfSh(c,-.1))+lfBox(x-.3,y-.3,16,.6,.6,5,c,{top:lfSh(c,.3)}))}
function lfBooks(w,h,seed,pal){var R=lfSeed(seed),s="",x=1;pal=pal||["#d94f5a","#e8a33a","#4a8ad9","#4fb58a","#8a5ad9","#e6e0cf","#c76a3a"];
  while(x<w-3){var bw=3+R()*4.5,bh=h*(.62+R()*.36);s+=lfR(x.toFixed(1),(h-bh).toFixed(1),bw.toFixed(1),bh.toFixed(1),pal[Math.floor(R()*pal.length)],"rgba(20,20,40,.5)")+'<rect x="'+(x+.6).toFixed(1)+'" y="'+(h-bh+1.5).toFixed(1)+'" width=".8" height="'+(bh-3).toFixed(1)+'" fill="rgba(255,255,255,.35)"/>';x+=bw+.4}
  return s}
function lfShelfR(C,x,y,w,hz,id){ // bookshelf against right wall (plane y=0), front at y+.55
  C.add(x+w+y+.55,lfBox(x,y,0,w,.55,hz,"#9a6a3c",{top:"#b9854e"}));
  var wpx=w*LF.U,hpx=hz,c='<rect x="2" y="2" width="'+(wpx-4)+'" height="'+(hpx-4)+'" fill="#6a4426"/>',rows=Math.max(2,Math.round(hz/24)),rh=(hpx-6)/rows;
  for(var r=0;r<rows;r++){c+='<g transform="translate(2,'+(3+r*rh)+')">'+lfBooks(wpx-4,rh-3,id*7+r)+'</g><rect x="2" y="'+(3+(r+1)*rh-3)+'" width="'+(wpx-4)+'" height="3" fill="#b9854e"/>'}
  C.add(x+w+y+.56,lfFaceY(x,y+.55,hz,c));
}
function lfShelfL(C,x,y,d,hz,id){ // bookshelf against left wall (plane x=0), front at x+.55
  C.add(x+.55+y+d,lfBox(x,y,0,.55,d,hz,"#9a6a3c",{top:"#b9854e"}));
  var wpx=d*LF.U,hpx=hz,c='<rect x="2" y="2" width="'+(wpx-4)+'" height="'+(hpx-4)+'" fill="#6a4426"/>',rows=Math.max(2,Math.round(hz/24)),rh=(hpx-6)/rows;
  for(var r=0;r<rows;r++){c+='<g transform="translate(2,'+(3+r*rh)+')">'+lfBooks(wpx-4,rh-3,id*5+r)+'</g><rect x="2" y="'+(3+(r+1)*rh-3)+'" width="'+(wpx-4)+'" height="3" fill="#b9854e"/>'}
  C.add(x+.56+y+d,'<g transform="matrix(.894,-.447,0,1,'+lfP(x+.55,y+d,hz)[0].toFixed(1)+','+lfP(x+.55,y+d,hz)[1].toFixed(1)+')">'+c+'</g>');
}
function lfFrame(wallSide,u,z,w,h,pic,col){ // wall art frame, returns wall-attached svg (decal, drawn with the walls)
  var c='<rect x="-3" y="-3" width="'+(w+6)+'" height="'+(h+6)+'" fill="'+(col||"#6a4426")+'" stroke="'+LFOL+'" stroke-width=".8"/><rect x="0" y="0" width="'+w+'" height="'+h+'" fill="#f6f0e0"/>'+pic;
  return wallSide==="R"?lfFaceY(u,0,z,c):lfFaceX(0,u+w/LF.U,z,c);
}
function lfPics(k,w,h){
  if(k===0)return '<rect width="'+w+'" height="'+h+'" fill="#8fd0f0"/><path d="M0 '+h*.7+' L'+w*.3+' '+h*.42+' L'+w*.55+' '+h*.66+' L'+w*.78+' '+h*.34+' L'+w+' '+h*.7+' L'+w+' '+h+' L0 '+h+'Z" fill="#5a7ab5"/><path d="M0 '+h*.82+' Q'+w*.5+' '+h*.62+' '+w+' '+h*.8+' L'+w+' '+h+' L0 '+h+'Z" fill="#4a9a58"/><circle cx="'+w*.78+'" cy="'+h*.2+'" r="'+h*.1+'" fill="#fff2a8"/>';
  if(k===1)return '<rect width="'+w+'" height="'+h+'" fill="#2a2a5a"/><circle cx="'+w*.5+'" cy="'+h*.45+'" r="'+h*.28+'" fill="#ff8ab8"/><rect y="'+h*.55+'" width="'+w+'" height="'+h*.45+'" fill="#3a3a7a"/><path d="M0 '+h*.7+' H'+w+' M0 '+h*.82+' H'+w+'" stroke="#ffb6d2" stroke-width="1"/>';
  if(k===2)return '<rect width="'+w+'" height="'+h+'" fill="#e8d8b8"/><circle cx="'+w*.3+'" cy="'+h*.5+'" r="'+h*.26+'" fill="#d9534f"/><rect x="'+w*.5+'" y="'+h*.22+'" width="'+w*.3+'" height="'+h*.56+'" fill="#3a6ab5"/><path d="M'+w*.1+' '+h*.9+' L'+w*.9+' '+h*.9+'" stroke="#222" stroke-width="1.4"/>';
  return '<rect width="'+w+'" height="'+h+'" fill="#f0e2c0"/><path d="M4 '+h*.8+' Q'+w*.3+' '+h*.1+' '+w*.5+' '+h*.6+' T'+(w-4)+' '+h*.3+'" stroke="#c0392b" stroke-width="2" fill="none"/><circle cx="'+w*.5+'" cy="'+h*.4+'" r="3" fill="#2a7a4a"/>';
}
function lfLamp(C,x,y,col){col=col||"#ffe9a8";C.add(x+y+.3,lfBox(x-.15,y-.15,0,.3,.3,2,"#3a3040")+lfBox(x-.04,y-.04,2,.08,.08,36,"#4a4056")+'<polygon points="'+[lfP(x-.3,y-.3,38),lfP(x+.3,y-.3,38),lfP(x+.22,y+.22,50),lfP(x-.22,y-.22,50)].map(lfPt).join(" ")+'" fill="'+col+'" stroke="'+LFOL+'" stroke-width=".7"/>');lfLight(C,x,y,46,col==="#ffe9a8"?"#ffd890":col,2.8,.8)}
function lfRugD(C,x,y,w,d,c1,c2){var W=w*LF.U,D=d*LF.U;
  var s=lfRr(0,0,W,D,6,c1,"rgba(20,20,40,.5)")+lfRr(5,5,W-10,D-10,4,c2)+lfRr(11,11,W-22,D-22,3,c1);
  for(var i=0;i<6;i++)s+='<rect x="'+(18+i*(W-36)/6)+'" y="16" width="2" height="'+(D-32)+'" fill="rgba(255,255,255,.18)"/>';
  s+=lfE(W/2,D/2,W*.16,D*.16,c2)+lfE(W/2,D/2,W*.08,D*.08,c1);
  C.decals.push(lfFloorG(x,y,s));
}
function lfNeonTxt(side,u,z,txt,col,sz){var c='<text x="0" y="'+sz+'" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="'+sz+'" fill="'+col+'" stroke="'+col+'" stroke-width=".6" filter="url(#lfneon)" letter-spacing="1.5">'+txt+'</text><text x="0" y="'+sz+'" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="'+sz+'" fill="#fff" opacity=".85" letter-spacing="1.5">'+txt+'</text>';
  return side==="R"?lfFaceY(u,0,z,c):lfFaceX(0,u,z,c)}
function lfDogBed(C,x,y,col,name){C.plat.push({x0:x-.5,y0:y-.4,x1:x+.5,y1:y+.4,z:5,key:x+y+.4});C.add(x+y+.4,lfBox(x-.5,y-.4,0,1,.8,5,col,{top:lfSh(col,.3)})+lfBox(x-.38,y-.3,5,.76,.6,1,lfSh(col,.5),{top:lfSh(col,.5)})+lfFaceY(x-.3,y+.4,4,'<text x="2" y="9" font-size="7" fill="rgba(255,255,255,.8)" font-family="Arial" font-weight="700">'+name+'</text>'))}
/* ---- sprite props (generated pixel art). Falls back to the vector prop when a sprite is missing ---- */
function lfSprUrl(k){var S=window.LFSPR&&LFSPR[k];if(!S)return null;if(S.b)return S.b;try{var b=atob(S.u.split(",")[1]),n=b.length,u=new Uint8Array(n);while(n--)u[n]=b.charCodeAt(n);S.b=URL.createObjectURL(new Blob([u],{type:"image/webp"}))}catch(e){S.b=S.u}return S.b}
function lfClampO(S,x,y,w,d,o){if(o.noclamp)return o;var a=lfP(x+w,y+d,0),ax=a[0]+(o.ctr?(d-w)*LF.sx/2:0)+(o.ax||0),lim=-LF.H+Math.abs(ax)/2+1,Hh=o.H||((w+d)*LF.sx*(o.sc||1)*S.h/S.w),top=a[1]+(o.dy||0)-Hh;
  if(top>=lim)return o;var v=lim-top,n=Object.assign({},o);if((o.dy||0)<0)n.dy=(o.dy||0)+v;else n.H=Math.max(24,Hh-v);return n}
function lfSpr(C,k,x,y,w,d,o){o=o||{};var S=window.LFSPR&&LFSPR[k];if(!S)return false;o=lfClampO(S,x,y,w,d,o);
  if(LFREC){var nr=LFREC.length;lfRecBox(x,y,0,w,d,o.h||24);if(LFREC.length>nr)LFREC[nr].spr=1}
  var a=lfP(x+w,y+d,0),W=(w+d)*LF.sx*(o.sc||1),Hh=W*S.h/S.w,fx=o.flip?-1:1;if(o.H){Hh=o.H;W=Hh*S.w/S.h}
  /* Cal: every piece of furniture casts the same soft shadow. A floor piece (not nosh: wall art, rugs, painted shells;
     not lifted with dy; at least 4 high; or o.sh to force one) adds its footprint to C.shd, and lfRoomLight draws them all in one blurred pass
     under the furniture, a little wider than the base so solid pieces (sofas, beds) show one as clearly as leggy ones. */
  if(o.shz!=null){/* a piece standing on a raised deck or tier (o.shz = its height): the same soft shadow, drawn right
     under it at that height, since a floor shadow would be hidden under the deck */
    if(!C._sfd){C._sfd="lfsoft"+C.uid+"_"+(window.LFRID=(window.LFRID||0)+1);C.add(-999,'<defs><filter id="'+C._sfd+'" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter></defs>')}
    var zz=o.shz,p2=.14,q2=.36;C.add(x+w+y+d-(o.dk||0)-.02,'<g filter="url(#'+C._sfd+')" opacity=".5" pointer-events="none">'+lfPolyS([lfP(x-p2,y-p2,zz),lfP(x+w+q2,y-p2,zz),lfP(x+w+q2,y+d+q2,zz),lfP(x-p2,y+d+q2,zz)],"#1c1410")+'</g>')}
  else if(o.sh||(!o.nosh&&!o.dy&&(o.h||24)>=4&&w*d>=.04)){(C.shd=C.shd||[]).push([x,y,x+w,y+d])}
  C._lb=(!o.nob&&(o.h||24)>=10&&Math.abs(o.dk||0)<50)?[x,y,x+w,y+d]:null;
  /* o.act: the sprite is a button (data-act, a pointer cursor, and it takes clicks even where the room picture does not) */
  C.add(x+w+y+d-(o.dk||0),'<g'+(o.act?' data-act="'+o.act+'" style="cursor:pointer;pointer-events:auto"':'')+' transform="translate('+(a[0]+(o.ctr?(d-w)*LF.sx/2:0)+(o.ax||0)).toFixed(1)+','+(a[1]+(o.dy||0)).toFixed(1)+') scale('+fx+',1)"><image href="'+lfSprUrl(k)+'" x="'+(-W/2).toFixed(1)+'" y="'+(-Hh).toFixed(1)+'" width="'+W.toFixed(1)+'" height="'+Hh.toFixed(1)+'" preserveAspectRatio="none"'+(o.fl?' filter="url(#'+o.fl+')"':'')+' style=""/>'
    /* o.hit: a small button gets an invisible tap area at least this many room pixels across (QA: the can on a phone) */
    +(o.act&&o.hit?'<rect x="'+(-Math.max(W,o.hit)/2).toFixed(1)+'" y="'+(-Hh/2-Math.max(Hh,o.hit)/2).toFixed(1)+'" width="'+Math.max(W,o.hit).toFixed(1)+'" height="'+Math.max(Hh,o.hit).toFixed(1)+'" fill="rgba(0,0,0,.001)"/>':'')+'</g>');
  return true}
/* A flat piece (a dance floor panel) fitted to its footprint exactly. The art is drawn at 30 degrees and the room at
   2:1, so a plain scale never lines up with the floor grid and panels laid side by side leave gaps. LFFIT gives the
   art's top face (its top, right and left corners, as fractions of the picture) and the rim under it; the face is
   mapped onto the footprint and the rim stands on the floor. Everything else in the room draws over it. */
var LFFIT={cbx_floor:{t:[.4992,0],r:[.9984,.4648],l:[0,.4648],rim:.0574}};
function lfSprFit(C,k,x,y,w,d,o){var S=window.LFSPR&&LFSPR[k],F=LFFIT[k];if(!S||!F)return lfSpr(C,k,x,y,w,d,o);
  var T=[F.t[0]*S.w,F.t[1]*S.h],u1=F.r[0]*S.w-T[0],v1=F.r[1]*S.h-T[1],u2=F.l[0]*S.w-T[0],v2=F.l[1]*S.h-T[1],det=u1*v2-u2*v1,
    p=lfP(x,y,0),q=lfP(x+w,y,0),r=lfP(x,y+d,0),X1=q[0]-p[0],Y1=q[1]-p[1],X2=r[0]-p[0],Y2=r[1]-p[1],
    a=(X1*v2-X2*v1)/det,c=(X2*u1-X1*u2)/det,b=(Y1*v2-Y2*v1)/det,dd=(Y2*u1-Y1*u2)/det,z=dd*F.rim*S.h,
    e=p[0]-a*T[0]-c*T[1],f=p[1]-z-b*T[0]-dd*T[1];
  if(LFREC)lfRecBox(x,y,0,w,d,z);C._lb=null;
  C.add(x+y-1,'<image href="'+lfSprUrl(k)+'" width="'+S.w+'" height="'+S.h+'" preserveAspectRatio="none" transform="matrix('+[a,b,c,dd,e,f].map(function(n){return n.toFixed(4)}).join(" ")+')"/>');
  return z}
function lfSprFloor(C,k,x,y,w,d,o){o=o||{};var S=window.LFSPR&&LFSPR[k];if(!S)return false;
  var c=lfP(x+w/2,y+d/2,0),W=(w+d)*LF.sx*(o.sc||1),Hh=W*S.h/S.w;
  C.decals.push('<image href="'+lfSprUrl(k)+'" x="'+(c[0]-W/2).toFixed(1)+'" y="'+(c[1]-Hh/2+(o.dy||0)).toFixed(1)+'" width="'+W.toFixed(1)+'" height="'+Hh.toFixed(1)+'" preserveAspectRatio="none"/>');return true}
function lfV(C,k,x,y,w,d,o,fn){if(!lfSpr(C,k,x,y,w,d,o))fn()}

/* wall-mounted sprites. w:"R" plane y=0 (u = x position), "L" plane x=0 (u = y position). z = bottom edge in px */
function lfWallSpr(C,key,w,u,z,wu,o){o=o||{};var S=window.LFSPR&&LFSPR[key];if(!S)return false;
  var W=wu*LF.U,Hh=W*S.h/S.w,img='<image href="'+lfSprUrl(key)+'" x="0" y="0" width="'+W.toFixed(1)+'" height="'+Hh.toFixed(1)+'" preserveAspectRatio="none"'+(o.op?' opacity="'+o.op+'"':'')+'/>';
  var win="";
  if(o.win&&window.LFSPR[key+"_m"]){var L=lfLS(),id="lfwk"+key+Math.round(u*10)+w+Math.round(L.el),sky=lfSkyArt(L,u,id).replace("M5 56 L5 25 Q5 6 26 6 Q47 6 47 25 L47 56Z","M-30 -30 H90 V100 H-30Z"),sc=Math.max(W/52,Hh/60);
    win='<mask id="m'+id+'" maskUnits="userSpaceOnUse" x="0" y="0" width="'+W.toFixed(1)+'" height="'+Hh.toFixed(1)+'"><image href="'+lfSprUrl(key+"_m")+'" x="0" y="0" width="'+W.toFixed(1)+'" height="'+Hh.toFixed(1)+'" preserveAspectRatio="none"/></mask><g mask="url(#m'+id+')"><g transform="translate('+((W-52*sc)/2).toFixed(1)+','+((Hh-60*sc)/2).toFixed(1)+') scale('+sc.toFixed(3)+')">'+sky+'</g></g>';
    if(w==="R")LFWINS.push(u+wu*.18)}
  var c=win+img,g=w==="L"?lfFaceX(0,u+wu,z+Hh,c):lfFaceY(u,0,z+Hh,c);
  if(o.lay==="decal")C.decals.push(g);else C.walls.push(g);return true}

/* window sprite (already iso-skewed) with live sky shown through the glass mask */
function lfSprWin(C,key,x,y,w,d,o){o=o||{};var S=window.LFSPR&&LFSPR[key];if(!S)return false;o=lfClampO(S,x,y,w,d,o);
  var a=lfP(x+w,y+d,0),W=(w+d)*LF.sx*(o.sc||1),Hh=W*S.h/S.w,fx=o.flip?-1:1;if(o.H){Hh=o.H;W=Hh*S.w/S.h}
  if(window.LFSPR[key+"_m"]){var L=lfLS(),id="lfsw"+key+Math.round(x*10)+"_"+Math.round(L.el),sky=lfSkyArt(L,x,id).replace("M5 56 L5 25 Q5 6 26 6 Q47 6 47 25 L47 56Z","M-30 -30 H90 V100 H-30Z"),sc=Math.max(W/52,Hh/60)*1.1;
    var mk='<mask id="m'+id+'" maskUnits="userSpaceOnUse" x="'+(-W/2).toFixed(1)+'" y="'+(-Hh).toFixed(1)+'" width="'+W.toFixed(1)+'" height="'+Hh.toFixed(1)+'"><image href="'+lfSprUrl(key+"_m")+'" x="'+(-W/2).toFixed(1)+'" y="'+(-Hh).toFixed(1)+'" width="'+W.toFixed(1)+'" height="'+Hh.toFixed(1)+'" preserveAspectRatio="none"/></mask>';
    C.add(x+w+y+d-(o.dk||0)-.02,'<g transform="translate('+a[0].toFixed(1)+','+(a[1]+(o.dy||0)).toFixed(1)+') scale('+fx+',1)">'+mk+'<g mask="url(#m'+id+')"><g transform="translate('+(-26*sc).toFixed(1)+','+(-Hh/2-30*sc).toFixed(1)+') scale('+sc.toFixed(3)+')">'+sky+'</g></g></g>');
    if(o.flip)LFWINS.push(x+w*.5)}
  return lfSpr(C,key,x,y,w,d,Object.assign({},o,{nosh:1}))}

/* v2 furniture: overrides earlier helpers with better proportions */
function lfSofa(C,x,y,w,col,act,tag){
  col=col||"#8a4a6a";act=act||"sit";tag=tag||"sofa";
  var d=1.05,fr=lfSh(col,-.32),cu=lfSh(col,.08),n=Math.max(1,Math.round((w-.7)/.95)),cw=(w-.7)/n,k=x+w+y;
  [[.08,.08],[w-.2,.08],[.08,d-.2],[w-.2,d-.2]].forEach(function(p,i){C.add(x+p[0]+y+p[1]+.2,lfBox(x+p[0],y+p[1],0,.12,.12,4,"#2a2230"))});
  C.add(k+.25,lfBox(x,y,4,w,d,6,fr,{top:fr}));
  C.add(k+.3,lfBox(x+.02,y,10,w-.04,.36,26,col,{top:lfSh(col,.25),r:lfSh(col,-.3)}));
  for(var i=0;i<n;i++){var bx=x+.35+i*cw+.015;
    C.add(bx+cw+y+.62,lfBox(bx,y+.34,10,cw-.03,.3,18,cu,{top:lfSh(cu,.3)}));
    C.add(bx+cw+y+d,lfBox(bx,y+.36,10,cw-.03,d-.38,7,cu,{top:lfSh(cu,.28)}));
    if(i<n-1)C.add(bx+cw+y+d+.01,'<path d="M'+lfPt(lfP(bx+cw,y+.4,17))+' L'+lfPt(lfP(bx+cw,y+d,17))+'" stroke="rgba(0,0,0,.28)" stroke-width="1"/>');
    C.s("sit",bx+cw/2,y+.78,-1,act,[8,20],{dk:k+d+.5,tag:tag,lift:1})}
  C.add(x+.35+y+d+.02,lfBox(x,y,10,.35,d,15,lfSh(col,-.06),{top:lfSh(col,.3),r:lfSh(col,-.26)}));
  C.add(k+d+.03,lfBox(x+w-.35,y,10,.35,d,15,lfSh(col,-.06),{top:lfSh(col,.3),r:lfSh(col,-.28)}));
  return k+d;
}
function lfArcade(C,x,y,col,scr,act){
  var K=x+.8+y+.8,ac=col||"#3b2f6a";
  C.add(K,lfBox(x,y,0,.8,.8,58,ac,{top:lfSh(ac,.3),r:lfSh(ac,-.3)})
   +lfPoly([lfP(x+.8,y+.08,32),lfP(x+.8,y+.72,32),lfP(x+.8,y+.72,50),lfP(x+.8,y+.08,50)],"#10182a")
   +lfPoly([lfP(x+.81,y+.12,34),lfP(x+.81,y+.68,34),lfP(x+.81,y+.68,48),lfP(x+.81,y+.12,48)],scr||"#4dd2ff",null,0,' opacity=".7"')
   +lfPoly([lfP(x+.8,y+.04,52),lfP(x+.8,y+.76,52),lfP(x+.8,y+.76,57),lfP(x+.8,y+.04,57)],lfSh(scr||"#4dd2ff",.2),null,0,' opacity=".9"')
   +lfPoly([lfP(x+.8,y+.05,27),lfP(x+.8,y+.75,27),lfP(x+1.05,y+.75,24),lfP(x+1.05,y+.05,24)],lfSh(ac,.2),LFOL,.7)
   +lfPoly([lfP(x+.8,y+.05,27),lfP(x+.8,y+.75,27),lfP(x+.8,y+.75,22),lfP(x+.8,y+.05,22)],lfSh(ac,-.35))
   +[.22,.38,.54,.66].map(function(u,i){var p=lfP(x+.93,y+u,26);return '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="1.7" fill="'+["#ff5c5c","#ffd24a","#4dff9a","#fff"][i]+'"/>'}).join(""));
  C.s("play",x+1.45,y+.4,-1,act||"work",[6,14],{tag:"arcade"});
}
function lfJuke(C,x,y){
  var K=x+.9+y+.62;
  C.add(K,lfBox(x,y,0,.9,.62,48,"#a83a2a",{top:"#d9604a",r:"#7a2a20"})
   +lfPoly([lfP(x,y+.62,48),lfP(x+.9,y+.62,48),lfP(x+.45,y+.62,58)],"#d9604a",LFOL,.8).replace("<polygon","<polygon")
   +lfPoly([lfP(x+.1,y+.62,10),lfP(x+.8,y+.62,10),lfP(x+.8,y+.62,38),lfP(x+.1,y+.62,38)],"#2a1810")
   +lfPoly([lfP(x+.14,y+.63,30),lfP(x+.76,y+.63,30),lfP(x+.76,y+.63,36),lfP(x+.14,y+.63,36)],"#ffd27a")
   +lfPoly([lfP(x+.14,y+.63,14),lfP(x+.35,y+.63,14),lfP(x+.35,y+.63,26),lfP(x+.14,y+.63,26)],"#ff5c9a",null,0,' opacity=".85"')
   +lfPoly([lfP(x+.4,y+.63,14),lfP(x+.76,y+.63,14),lfP(x+.76,y+.63,26),lfP(x+.4,y+.63,26)],"#4dd2ff",null,0,' opacity=".8"')
   +lfPoly([lfP(x+.06,y+.62,4),lfP(x+.84,y+.62,4),lfP(x+.84,y+.62,8),lfP(x+.06,y+.62,8)],"#ffd24a"));
  C.s("play",x+.5,y+1.4,-1,"reach",[4,8],{tag:"juke"});
}
function lfPool(C,x,y){
  var W=2.2,D=1.3,K=x+W+y+D;
  [[.1,.1],[W-.25,.1],[.1,D-.25],[W-.25,D-.25]].forEach(function(p){C.add(x+p[0]+y+p[1]+.2,lfBox(x+p[0],y+p[1],0,.15,.15,10,"#3a2418"))});
  C.add(K,lfBox(x,y,10,W,D,5,"#5a3a24",{top:"#6a4430",r:"#3a2418"}));
  var fe=function(a,b,z){return lfP(a,b,z)};
  var felt=lfPoly([fe(x+.12,y+.12,15.2),fe(x+W-.12,y+.12,15.2),fe(x+W-.12,y+D-.12,15.2),fe(x+.12,y+D-.12,15.2)],"#2f9a62","rgba(0,40,20,.5)",.8);
  var pk=[[.12,.12],[W/2,.1],[W-.12,.12],[.12,D-.12],[W/2,D-.1],[W-.12,D-.12]].map(function(p){var q=lfP(x+p[0],y+p[1],15.4);return lfE(q[0].toFixed(1),q[1].toFixed(1),2.6,1.3,"#0c1410")}).join("");
  var balls=[[1.4,.55,"#ffd24a"],[1.52,.5,"#d9534f"],[1.52,.62,"#3a6ab5"],[1.64,.45,"#7a3aa0"],[1.64,.58,"#222"],[1.64,.72,"#ff8a3d"],[.55,.65,"#fff"]].map(function(b){var q=lfP(x+b[0],y+b[1],16.4);return '<circle cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="1.9" fill="'+b[2]+'" stroke="rgba(0,0,0,.35)" stroke-width=".4"/>'}).join("");
  C.add(K+.01,felt+pk+balls);
  C.s("play",x+W/2,y+D+.6,1,"reach",[8,16],{tag:"pool"});C.s("play",x-.5,y+D/2,1,"reach",[8,16],{tag:"pool"});
}
function lfDesk(C,x,y){ // desk 1.5 x .8 at x,y ; top z=16
  C.add(x+.1+y+.1+.2,lfBox(x+.05,y+.05,0,.12,.7,14,"#6a4a2a"));
  C.add(x+1.5+y+.8,lfBox(x+1.33,y+.05,0,.12,.7,14,"#6a4a2a",{r:"#4a3220"}));
  C.add(x+1.5+y+.8+.1,lfBox(x,y,14,1.5,.8,3,"#b9814a",{top:"#d9a56a",r:"#8a5a30"}));
}
function lfPC(C,x,y,glow){
  var K=x+1.5+y+.8+.3;
  C.add(K,lfBox(x+.62,y+.34,17,.3,.05,2,"#2a2d38")+lfBox(x+.5,y+.3,19,.54,.06,16,"#15182a",{top:"#2a2d44"})
   +lfPoly([lfP(x+.52,y+.36,20),lfP(x+.82,y+.36,20),lfP(x+.82,y+.36,32),lfP(x+.52,y+.36,32)],"#3a8af0",null,0,' opacity=".9"')
   +lfPoly([lfP(x+.52,y+.36,26),lfP(x+.82,y+.36,29),lfP(x+.82,y+.36,32),lfP(x+.52,y+.36,32)],"#9a5af0",null,0,' opacity=".6"')
   +lfBox(x+1.12,y+.14,17,.28,.5,18,"#1d2030",{top:"#2a2e44"})
   +lfPoly([lfP(x+1.4,y+.2,22),lfP(x+1.4,y+.5,22),lfP(x+1.4,y+.5,32),lfP(x+1.4,y+.2,32)],"#ff3d81",null,0,' opacity=".8"')
   +lfBox(x+.38,y+.58,17,.56,.17,1.2,"#1a1c28",{top:"#2e3248"}));
}
function lfMouse(C,x,y){
  C.add(x+1.5+y+.8+.35,lfBox(x+1.0,y+.52,17,.36,.3,.5,"#8a2a5a",{top:"#ff3d81"})+lfBox(x+1.12,y+.6,17.5,.1,.14,1.4,"#e9e9f2"));
}
function lfGChair(C,x,y){
  var K=x+.8+y+.8;
  C.add(K-.1,lfBox(x+.28,y+.28,0,.08,.08,10,"#2a2a32")+lfBox(x+.02,y+.3,0,.5,.06,2,"#2a2a32")+lfBox(x+.3,y+.02,0,.06,.5,2,"#2a2a32"));
  C.add(K,lfBox(x,y,10,.76,.7,6,"#1d1f28",{top:"#d9302a",r:"#14151c"}));
  C.add(K+.9,lfBox(x+.03,y+.64,12,.7,.2,30,"#d9302a",{top:"#ff5a4a",r:"#8a1a16"})+lfBox(x+.25,y+.74,14,.26,.04,24,"#1d1f28")+lfBox(x+.1,y+.6,40,.56,.18,8,"#1d1f28",{top:"#d9302a"}));
  C.s("sit",x+.38,y+.28,1,"type",[10,25],{dk:K+1.2,tag:"pc",lift:1});
}

/* v3 props: synth keyboard on stand, treadmill, wooden dummy */
function lfSynthProp(x,y){
  var k=x+.8+y+1.9+.5,s='';
  [[.1,.15],[.1,1.6]].forEach(function(p){
    s+=lfBox(x+p[0],y+p[1],0,.6,.1,24,"#2b2d36")+lfBox(x+p[0]+.2,y+p[1]-.05,0,.2,.2,3,"#1a1b22");
  });
  s+=lfBox(x+.05,y+.3,18,.7,1.3,3,"#2b2d36");
  s+=lfBox(x,y,24,.8,1.9,5,"#1c1d25",{top:"#2a2c38",l:"#15161c",r:"#101117"});
  s+=lfBox(x+.38,y+.06,29,.4,1.78,1.6,"#f4f1e8",{top:"#fffdf6",l:"#d8d4c8",r:"#c9c5b8"});
  for(var i=0;i<9;i++){var yy=y+.08+i*.2;if(i%7!==2&&i%7!==6&&i<8)s+=lfBox(x+.38,yy+.15,30.6,.2,.11,1.6,"#16161c",{top:"#262630"})}
  s+=lfBox(x,y+.06,29,.36,1.78,3.5,"#14151c",{top:"#242634",l:"#101117",r:"#0b0b10"});
  for(var j=0;j<5;j++){var p=lfP(x+.19,y+.22+j*.34,34.5);s+='<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="1.8" fill="'+["#ff4d8d","#4dd2ff","#ffd24a","#7cf09a","#b58cff"][j]+'"/>'}
  var q=lfP(x+.19,y+1.62,33.4);s+='<rect x="'+(q[0]-4).toFixed(1)+'" y="'+(q[1]-2).toFixed(1)+'" width="8" height="4" fill="#4dffc3" opacity=".85"/>';
  return [k,s];
}
function lfTreadProp(x,y){
  var k=x+.9+y+2.1+.5,s='';
  s+=lfBox(x,y,3,.9,2.1,6,"#2c303c",{top:"#3a3f4e",l:"#23262f",r:"#1a1c24"});
  s+=lfBox(x+.08,y+.12,9,.74,1.86,1.4,"#14151b",{top:"#1d1f27"});
  for(var i=0;i<6;i++){var a=lfP(x+.08,y+.3+i*.3,10.4),b=lfP(x+.82,y+.3+i*.3,10.4);s+='<path d="M'+lfPt(a)+' L'+lfPt(b)+'" stroke="#3b3e4a" stroke-width="1"/>'}
  s+=lfBox(x-.02,y+.1,6,.05,1.9,4,"#8a90a2")+lfBox(x+.87,y+.1,6,.05,1.9,4,"#8a90a2");
  [[x+.03,y+1.95],[x+.72,y+1.95]].forEach(function(p){s+=lfBox(p[0],p[1],8,.14,.14,38,"#8d93a6",{top:"#b8bdcc"})});
  s+=lfBox(x,y+1.9,40,.9,.24,3,"#8d93a6");
  s+=lfBox(x+.12,y+1.88,41,.66,.3,12,"#1d2030",{top:"#2c3048"});
  var c=lfP(x+.45,y+2.19,47);s+='<rect x="'+(c[0]-8).toFixed(1)+'" y="'+(c[1]-4).toFixed(1)+'" width="14" height="7" fill="#4dd2ff" opacity=".85"/>';
  s+=lfBox(x+.02,y+.4,26,.05,1.5,2,"#8d93a6")+lfBox(x+.83,y+.4,26,.05,1.5,2,"#8d93a6");
  return [k,s];
}
function lfDummyProp(x,y){
  var k=x+1.4+y+1.4+.5,s='';
  s+=lfBox(x-.3,y+.2,0,1.1,.3,4,"#6b4526",{top:"#8a5a30"})+lfBox(x+.1,y-.2,0,.3,1.1,4,"#6b4526",{top:"#8a5a30"});
  s+=lfBox(x+.1,y+.1,4,.3,.3,54,"#8a5a30",{top:"#a8743c",l:"#6e4724",r:"#573819"});
  s+=lfBox(x-.2,y+.14,36,1.1,.22,6,"#8a5a30",{top:"#a8743c"});
  s+=lfBox(x-.05,y-.05,16,.6,.7,30,"#d9b070",{top:"#ead19a",l:"#bf9552",r:"#a88043"});
  [20,27,34].forEach(function(z){s+=lfBox(x-.06,y-.06,z,.62,.72,1.6,"#9a7536",{top:"#9a7536"})});
  s+=lfBox(x-.05,y-.05,42,.6,.7,4,"#b02f2f",{top:"#d04545"});
  var h=lfP(x+.25,y+.25,70);s+='<circle cx="'+h[0].toFixed(1)+'" cy="'+h[1].toFixed(1)+'" r="8" fill="#d9b070" stroke="#8a6a2e" stroke-width="1"/><path d="M'+(h[0]-7)+' '+(h[1]-1)+' L'+(h[0]+7)+' '+(h[1]-1)+'" stroke="#9a7536" stroke-width="1.4"/><circle cx="'+(h[0]-2).toFixed(1)+'" cy="'+(h[1]-3).toFixed(1)+'" r="2" fill="#f2dfa8"/>';
  return [k,s];
}

var LFROOM={};
function lfWander(C,pts){pts.forEach(function(p){C.s("wander",p[0],p[1],p[2]||-1,"look",[1.5,4])})}
function lfDoorAt(C,x){
  /* entrance = a doormat on the front edge with a soft warm glow pooling around it (no frame, no posts) */
  var W=C.W,y=Math.max(2.2,C.D*.5-.2);
  var q=function(x0,y0,x1,y1,col){return '<polygon points="'+[lfP(x0,y0,0),lfP(x1,y0,0),lfP(x1,y1,0),lfP(x0,y1,0)].map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' ')+'" fill="'+col+'"/>'};
  var c=lfP(W-.9,y+.6,0);
  var gid="lfmatg"+Math.round(W*10),U=LF.U;
  C.decals.push(lfFloorG(W-3.5,y-.9,'<defs><radialGradient id="'+gid+'"><stop offset="0" stop-color="rgba(255,240,180,.95)"/><stop offset=".5" stop-color="rgba(255,226,150,.5)"/><stop offset="1" stop-color="rgba(255,226,150,0)"/></radialGradient></defs><ellipse cx="'+(U*1.7)+'" cy="'+(U*1.7)+'" rx="'+(U*1.7)+'" ry="'+(U*1.7)+'" fill="url(#'+gid+')"/>'));
  C.decals.push(q(W-1.9,y-.1,W-.1,y+1.3,"#6b4a30")+q(W-1.8,y,W-.2,y+1.2,"#a5703f")+q(W-1.6,y+.2,W-.4,y+1.0,"#c58a4f"));
  C.s("door",W-.9,y+.6,1,"look",[1,1]);
  C.door={x:W-.9,y:y+.6};
}
LFROOM.lounge=function(C){
  // door on right wall + window
  C.walls.push(lfWindow(.55,C.wx));C.decals.push(lfWinLight(.55));C.walls.push(lfWindow(5.9,C.wx));C.decals.push(lfWinLight(5.9));
  lfDoorAt(C,8.4);
  // bare room: free wander spots
  lfWander(C,[[2.4,3.8,-1],[4.6,3.4,1],[3.6,5.6,-1],[6.4,3.6,1],[7.6,4.8,-1],[2.0,6.4,1],[5.4,6.6,-1],[8.6,2.8,1]]);
  if(C.has("l_couch"))lfSofa(C,2.2,.45,2.4,"#8a4a6a");
  if(C.has("l_rug"))lfRugD(C,1.8,2.0,4.2,3.0,"#d96a7a","#f2c8b0");
  if(C.has("l_plant"))lfPlant(C,.5,.5,1.35);
  if(C.has("l_art")){C.walls.push(lfFrame("R",2.35,100,34,26,lfPics(0,34,26))+lfFrame("R",3.4,102,22,28,lfPics(1,22,28))+lfFrame("L",3.0,96,26,20,lfPics(2,26,20))+lfFrame("L",4.2,98,20,26,lfPics(3,20,26)));
    C.s("art",3.0,1.9,1,"look",[4,8],{fxwall:1});C.s("art",1.0,3.6,-1,"look",[4,8])}
  if(C.has("l_tv")){var tv='<rect x="-3" y="-3" width="'+(LF.U*1.8+6)+'" height="'+(LF.U*1.0+6)+'" fill="#1a1a24" stroke="'+LFOL+'" stroke-width="1"/><rect x="0" y="0" width="'+LF.U*1.8+'" height="'+LF.U+'" fill="#27375f"/><rect x="0" y="0" width="'+LF.U*1.8+'" height="'+LF.U+'" fill="url(#lftvg)" opacity=".9"/><path d="M6 '+LF.U*.8+' L'+LF.U*.5+' '+LF.U*.3+' L'+LF.U*.9+' '+LF.U*.6+' L'+LF.U*1.3+' '+LF.U*.2+' L'+LF.U*1.75+' '+LF.U*.8+'Z" fill="#ffffff" opacity=".18"/>';
    C.walls.push(lfFaceX(0,3.3,92,tv));C.s("watch",3.4,3.4,-1,"sit",[10,22],{dk:99,seatless:1})}
  if(C.has("l_arcade"))lfArcade(C,.25,4.6,"#3b2f6a","#4dd2ff");
  if(C.has("l_neon"))lfLight(C,1.2,2.5,100,"#ff9d5c",3,.7);if(C.has("l_neon"))C.walls.push(lfNeonTxt("L",2.5,114,"HOME","#ff9d5c",15));
  if(C.has("l_table")){C.box(3.9,3.9,0,1.2,.7,9,"#8a5a3a",{top:"#c9a070",dk:.2});C.add(3.9+1.2+3.9+.7+.2,lfBox(4.1,4.05,9,.3,.3,3,"#f6f0e0")+lfBox(4.6,4.1,9,.3,.3,5,"#d9534f"))}
  if(C.has("l_beans")){[[7.2,3.0,"#d9534f","#ff7a6a"],[8.5,4.0,"#4dd2ff","#8ae6ff"]].forEach(function(b){C.add(b[0]+b[1]+.9,lfBox(b[0],b[1],0,.9,.9,12,b[2],{top:b[3]}));C.s("sit",b[0]+.45,b[1]+.45,-1,"sit",[10,24],{dk:99,tag:"bean",lift:1})})}
  if(C.has("l_sofa2"))lfSofa(C,4.8,6.2,2.4,"#4a6a8a");
  if(C.has("l_plant2"))lfPlant(C,9.4,2.2,1.2);
  if(C.has("l_cart")){C.box(8.6,4.6,0,.9,.7,16,"#3a3040",{top:"#c9a070",dk:.2});C.add(8.6+.9+4.6+.7+.3,lfBox(8.75,4.7,16,.2,.2,9,"#6cb86a")+lfBox(9.1,4.8,16,.2,.2,7,"#d9534f")+lfBox(8.9,5.1,16,.3,.2,4,"#f6f0e0"))}
  if(C.has("l_speaker")){C.box(.3,2.2,0,.6,.6,34,"#1a1a24",{top:"#2a2a3a"});C.box(.3,5.0,0,.6,.6,34,"#1a1a24",{top:"#2a2a3a"})}
};

LFROOM.bedroom=function(C){
  var H=function(k){return C.has(k)};
  lfDoorAt(C,6.4);
  if(H("bd_win2"))lfSprWin(C,"w_win2",1.7,.05,.1,.05,{flip:1,H:68,dy:-30});else lfSprWin(C,"w_win1",1.7,.05,.1,.05,{flip:1,H:76,dy:-26});
  C.decals.push(lfWinLight(1.2));
  var AN=H("bd_ward2");
  if(AN){C.annex={lair:H("bd_lair"),shoe:H("bd_cl_shoe"),isle:H("bd_cl_isle"),wall:H("bd_lr_wall"),arm:H("bd_lr_arm"),holo:H("bd_lr_holo")};C.walls.push(lfAnnexFrame(C));lfLight(C,-1.2,1.8,86,C.annex.lair?"#9d7cff":"#ffd9a0",2.6,.5)}
  lfWander(C,[[2.6,2.4,-1],[4.2,4.4,1],[5.2,3.4,-1],[4.4,6.6,1],[6.6,4.4,-1],[2.2,2.0,1]]);
  if(H("bd_rug"))lfSprFloor(C,"bd_rug",2.4,3.7,3.4,3.0);
  var bk=H("bd_bed2")?"bd_bed2":H("bd_bed1")?"bd_bed1":"bd_bed0";
  lfSpr(C,bk,.1,4.0,3.3,2.7,{h:14,flip:bk==="bd_bed2"?1:0});
  C.s("look",3.0,6.4,-1,"look",[4,9]);
  if(H("bd_nstand")){lfSpr(C,"bd_nstand",.15,6.95,.9,.9,{h:12,H:34});lfLight(C,.6,7.3,34,"#ffc27a",1.7,.5)}
  if(H("bd_plant"))lfSpr(C,"bd_plant",6.9,6.8,.8,.8,{h:40,H:66});
  var wk=H("bd_ward2")?"bd_ward2":H("bd_ward1")?"bd_ward1":"bd_ward0",wh=wk==="bd_ward0"?92:wk==="bd_ward1"?98:104;
  if(!AN)lfSpr(C,wk,.1,.7,1.2,2.2,{h:70,H:wh});
  if(H("bd_mirror")){lfSpr(C,"bd_mirror",3.0,.05,1.0,.4,{h:70,H:92,flip:1});C.s("art",3.5,1.2,1,"look",[6,11],{tag:"mirror",fxwall:1})}
  var pc2=H("bd_pc2"),dk=pc2?"bd_deskpc2":H("bd_desk1")?"bd_desk1":"bd_desk0";
  lfSpr(C,dk,4.0,.05,2.1,1.1,{h:30,flip:1,dk:.2});
  if(!pc2&&H("bd_pc1")){lfSpr(C,"bd_pc1",4.55,.1,1.0,.7,{h:16,flip:1,H:54,dy:-30,dk:-2});lfLight(C,5.15,1.0,44,"#58d6ff",1.9,.55)}
  var ck=H("bd_chair2")?"bd_chair2":H("bd_chair1")?"bd_chair1":H("bd_chair0")?"bd_chair0":null;
  if(ck){lfSpr(C,ck,5.0,2.0,.9,.9,{h:30,H:78,flip:1,dk:-3});C.s("sit",5.55,2.0,1,"type",[10,25],{dk:2,tag:"pc",lift:1})}
  else C.s("work",5.2,2.1,-1,"work",[10,25]);
  if(H("bd_shelf"))lfSpr(C,"bd_shelf",6.4,.05,1.0,.55,{h:60,flip:1,H:76});
  if(H("bd_art1"))lfSpr(C,"w_art1",5.3,.05,.1,.05,{h:1,flip:1,H:40,dy:-72,nosh:1});
  if(H("bd_art2")){lfSpr(C,"w_prs",.05,5.2,.1,.1,{h:1,H:36,dy:-76,nosh:1})}
  if(H("bd_art3"))lfSpr(C,"w_art3",.05,4.6,.1,.1,{h:1,H:52,dy:-50,nosh:1});
  if(H("bd_fshelf"))lfSpr(C,"w_fshelf",6.5,.05,.1,.05,{h:1,flip:1,H:34,dy:-80,nosh:1});
  if(H("bd_clock"))lfSpr(C,"w_clock",.05,7.2,.1,.1,{h:1,H:24,dy:-90,nosh:1});
  if(H("bd_lights"))lfFairy(C,[{w:"R",u0:.6,u1:7.6,z:122,sw:4,sag:22},{w:"L",u0:.6,u1:7.6,z:122,sw:4,sag:22}],7);
  if(H("bd_neon")){lfSpr(C,"w_neon",.05,6.2,.1,.1,{h:1,H:54,dy:-48,nosh:1});lfLight(C,.3,5.9,62,"#7aa8ff",1.6,.5)}
};
LFROOM.bar=function(C){
  C.walls.push(lfWindow(3.4,C.wx));C.decals.push(lfWinLight(3.4));
  C.box(1.35,1.0,0,.8,3.6,26,"#5a3a28",{top:"#a96e3c",dk:.3});C.box(1.2,.9,26,1.1,3.8,3,"#c98f58",{top:"#e0aa70",dk:.2});
  // bar back (bottles shelf area is an addon)
  for(var k=0;k<3;k++)lfStool(C,2.9,1.7+k*1.2,"#c9546a");
  C.s("work",.75,2.6,1,"work",[6,14],{tag:"pour"});C.s("work",.75,4.0,1,"work",[5,10],{tag:"wipe"});C.s("sit",2.92,1.7,-1,"sit",[10,22],{dk:99,tag:"stool",lift:1});C.s("sit",2.92,2.9,-1,"sit",[10,22],{dk:99,tag:"stool",lift:1});C.s("sit",2.92,4.1,-1,"sit",[10,22],{dk:99,tag:"stool",lift:1});
  lfWander(C,[[4.6,2.0,-1],[4.2,4.4,1],[3.6,3.4,-1]]);
  lfOrderBoard(C,6.0,96);
  if(C.has("b_shelf")){var sh='<rect width="'+LF.U*3.4+'" height="6" fill="#6a4426"/>';for(var r=0;r<3;r++){sh+='<g transform="translate(0,'+(r*22)+')"><rect x="2" y="20" width="'+(LF.U*3.4-4)+'" height="4" fill="#b9854e"/>'+Array.apply(0,Array(11)).map(function(_,i){var cl=["#3a8ad9","#d9534f","#4fb58a","#e8a33a","#9a5ad9"][(i+r)%5];return '<rect x="'+(5+i*8.6)+'" y="'+(6+((i*7)%4))+'" width="6.4" height="14" rx="2" fill="'+cl+'" stroke="rgba(0,0,0,.4)" stroke-width=".6"/><rect x="'+(6.2+i*8.6)+'" y="'+(2+((i*7)%4))+'" width="3" height="5" fill="'+cl+'"/><rect x="'+(5.6+i*8.6)+'" y="'+(8+((i*7)%4))+'" width="1.6" height="9" fill="rgba(255,255,255,.4)"/>'}).join("")+'</g>'}
    C.walls.push(lfFaceX(0,4.9,86,sh))}
  if(C.has("b_neon"))lfLight(C,1.5,1.2,90,"#ff5c9a",3.4,.8);if(C.has("b_neon"))C.walls.push(lfNeonTxt("R",.7,96,"BAR","#ff5c9a",20));
  if(C.has("b_juke"))lfJuke(C,4.8,.3);
  if(C.has("b_menu"))C.walls.push(lfFrame("R",3.45,90,60,44,'<rect width="60" height="44" fill="#233"/><text x="6" y="14" font-size="9" fill="#fff" font-family="Arial" font-weight="700">HOUSE</text><path d="M6 20 H54 M6 28 H48 M6 36 H52" stroke="#ffd27a" stroke-width="1.6"/>',"#8a6a3a"));
  if(C.has("b_taps")){C.add(1.5+.4+4.2+.2,lfBox(1.45,1.6,29,.25,.25,8,"#c9ced8")+lfBox(1.45,2.4,29,.25,.25,8,"#c9ced8")+lfBox(1.45,3.2,29,.25,.25,8,"#c9ced8"))}
  if(C.has("b_pool"))lfPool(C,3.8,6.0);
  if(C.has("b_dj")){C.box(4.0,4.4,0,1.6,1.1,18,"#2a2438",{dk:.2});C.add(4.0+1.6+4.4+1.1+.1,lfBox(4.2,4.6,18,.6,.5,2,"#111")+lfE(lfP(4.5,4.85,20)[0],lfP(4.5,4.85,20)[1],7,3,"#4dd2ff")+lfE(lfP(5.2,4.85,20)[0],lfP(5.2,4.85,20)[1],7,3,"#ff5c9a"));C.s("work",4.8,3.8,1,"work",[10,20])}
};
function lfDining(C,X,Y,first){
  C.box(X,Y,0,1.4,1.1,15,"#a9763f",{dk:.2,top:"#e2c590"});
  C.add(X+1.4+Y+1.1+.5,lfBox(X-.6,Y+.2,0,.5,.5,2,"#555")+lfBox(X-.55,Y+.25,2,.4,.4,10,"#d9534f")+lfBox(X+1.5,Y+.2,0,.5,.5,2,"#555")+lfBox(X+1.55,Y+.25,2,.4,.4,10,"#d9534f")+lfBox(X+.3,Y+.4,15,.4,.4,3,"#f6f0e0")+lfBox(X+.9,Y+.5,15,.3,.3,5,"#6cb86a"));
  C.s("sit",X-.28,Y+.48,1,"eat",[10,20],{dk:99,tag:"diner",lift:1,wx:X+.3,wy:Y+1.45,tb:[X,Y]});
  C.s("sit",X+1.78,Y+.48,-1,"eat",[10,20],{dk:99,tag:"diner",lift:1,wx:X+1.1,wy:Y+1.45,tb:[X,Y]});
}
function lfOrderBoard(C,u,z){
  var bd='<rect x="-3" y="-3" width="62" height="52" rx="2" fill="#6a4426" stroke="'+LFOL+'" stroke-width=".8"/><rect width="56" height="46" fill="#1d2a26"/><text x="28" y="9" text-anchor="middle" font-size="6.5" font-weight="700" fill="#ffd27a" font-family="Arial">ORDERS</text><path d="M4 12H52" stroke="rgba(255,255,255,.25)" stroke-width=".6"/>'
    +[0,1,2,3].map(function(k){return '<text class="lfobl" data-k="'+k+'" x="4" y="'+(21+k*8.5)+'" font-size="6" fill="#d8efe6" font-family="Arial"></text>'}).join("");
  C.walls.push('<g class="lfob">'+lfFaceY(u,0,z,bd)+'</g>');
}
LFROOM.restaurant=function(C){
  C.walls.push(lfWindow(3.2,C.wx));C.decals.push(lfWinLight(3.2));C.walls.push(lfWindow(7.4,C.wx));C.decals.push(lfWinLight(7.4));lfDoorAt(C,10.5);
  lfOrderBoard(C,5.45,96);
  C.box(.45,.9,0,1.0,3.4,20,"#8a5a3a",{top:"#c9a070",dk:.3});C.add(1.45+.9+4.3,lfBox(.55,1.2,20,.4,.5,14,"#c9ced8")+lfBox(.55,2.6,20,.4,.6,3,"#222")+lfPoly([lfP(.9,1.1,23),lfP(.9,1.7,23),lfP(.9,1.7,27),lfP(.9,1.1,27)],"#ff9d5c"));
  [3.0,6.5,10.0].forEach(function(X,ti){lfDining(C,X,2.5,ti===0)});
  C.s("work",1.9,2.0,-1,"work",[8,16],{tag:"cook"});C.s("work",1.9,3.4,-1,"work",[6,10],{tag:"prep"});
  C.s("serve",2.3,3.0,-1,"carry",[2,3],{tag:"serve"});
  lfWander(C,[[5.4,1.2,-1],[8.6,1.2,1],[2.6,4.6,-1],[5.4,4.9,1],[8.4,4.7,-1],[11.2,4.2,1]]);
  if(C.has("r_coffee"))C.add(.45+1.0+.9+3.4,lfBox(.6,3.5,20,.4,.5,13,"#2a2a34")+lfPoly([lfP(1.0,3.55,28),lfP(1.0,3.95,28),lfP(1.0,3.95,32),lfP(1.0,3.55,32)],"#ff5a4a"));
  if(C.has("r_pend")){[3.7,7.2,10.7].forEach(function(x){var p=lfP(x,2.6,96);C.front.push('<path d="M'+p[0]+' '+(p[1]-60)+' L'+p[0]+' '+p[1]+'" stroke="#222" stroke-width="1"/><path d="M'+(p[0]-9)+' '+(p[1]+8)+' Q'+p[0]+' '+(p[1]-10)+' '+(p[0]+9)+' '+(p[1]+8)+'Z" fill="#ffc857" stroke="'+LFOL+'" stroke-width=".7"/>'+lfE(p[0],p[1]+16,16,9,"rgba(255,224,140,.35)"))})}
  if(C.has("r_oven")){C.add(5.0+.9+.3+.7,lfBox(4.4,.2,0,1.2,.9,44,"#b9593a",{top:"#d97a50"})+lfPoly([lfP(4.6,1.1,6),lfP(5.4,1.1,6),lfP(5.4,1.1,26),lfP(4.6,1.1,26)],"#2a1a14")+lfE(lfP(5.0,1.1,12)[0],lfP(5.0,1.1,12)[1],6,4,"#ff9d3a")+lfPoly([lfP(4.7,1.1,40),lfP(5.3,1.1,40),lfP(5.3,1.1,44),lfP(4.7,1.1,44)],"#6a3a2a"));C.s("work",5.0,1.9,1,"work",[6,12],{tag:"oven"})}
  if(C.has("r_booth"))lfSofa(C,3.7,4.75,1.95,"#9a3a4a","eat","booth");
  if(C.has("r_tbl2")){lfDining(C,6.5,4.2,false);lfDining(C,10.0,4.2,false)}
  if(C.has("r_host")){C.box(9.0,.3,0,.9,.5,28,"#3a2a20",{top:"#c9a070"});C.s("work",9.45,1.15,-1,"work",[6,12],{tag:"host"})}
  if(C.has("r_plants")){lfPlant(C,5.6,.5,1.1);lfPlant(C,8.8,5.6,1.0)}
  if(C.has("r_star"))C.walls.push(lfFrame("R",1.55,98,28,28,'<rect width="28" height="28" fill="#222a44"/><polygon points="14,3 17,11 26,11 19,16 21,25 14,20 7,25 9,16 2,11 11,11" fill="#ffd24a"/>',"#caa24a"));
  ["r_salad","r_omelet","r_rice","r_sushi","r_ramen"].forEach(function(id,k){if(C.has(id))C.add(7.5,lfBox(3.1+k*.22,2.7+(k%2)*.3,15,.26,.26,1.4,["#6cb86a","#f2d36a","#e8c07a","#f08a7a","#d9824a"][k]))});
};
LFROOM.gameroom=function(C){
  C.walls.push(lfWindow(.7,C.wx));C.decals.push(lfWinLight(.7));
  lfRugD(C,1.0,2.4,3.2,2.6,"#5547a0","#7f74c8");
  C.add(2.5+3.5+1,lfBox(1.6,3.0,0,.9,.9,12,"#d9534f",{top:"#ff7a6a"})+lfBox(2.9,3.6,0,.9,.9,12,"#4dd2ff",{top:"#8ae6ff"}));
  C.s("sit",2.2,4.3,-1,"sit",[10,24],{dk:99,tag:"bean",lift:1});C.s("sit",3.6,4.9,-1,"sit",[10,24],{dk:99,tag:"bean",lift:1});
  lfWander(C,[[4.6,3.4,-1],[3.2,2.4,-1]]);
  if(C.has("gm_tft")){C.box(3.4,1.4,0,1.5,1.1,16,"#3a2a5a",{dk:.1,top:"#2f9a7a"});C.s("play",4.1,3.0,-1,"work",[10,20])}
  if(C.has("gm_cab")){for(var k=0;k<3;k++)lfArcade(C,.3,.4+k*1.05,["#7a3aa0","#3a7aa0","#a03a7a"][k],["#4dd2ff","#ffd24a","#ff5c9a"][k])}
  if(C.has("gm_pool"))lfPool(C,3.2,4.0);
  if(C.has("gm_couch")){C.walls.push('');lfSofa(C,2.0,.45,2.4,"#4a5aa0");var tv='<rect x="-3" y="-3" width="'+(LF.U*2.2+6)+'" height="'+(LF.U*1.2+6)+'" fill="#12121c" stroke="'+LFOL+'" stroke-width="1"/><rect width="'+LF.U*2.2+'" height="'+LF.U*1.2+'" fill="#1f3a6a"/><circle cx="'+LF.U*1.1+'" cy="'+LF.U*.6+'" r="12" fill="#ffd24a" opacity=".6"/>';C.walls.push(lfFaceY(2.3,0,94,tv))}
};
LFROOM.studio=function(C){
  C.walls.push(lfWindow(4.0,C.wx));C.decals.push(lfWinLight(4.0));
  C.box(.5,1.3,0,.9,2.8,17,"#2c2f44",{top:"#4a5170",dk:.2});
  C.add(.5+.9+1.3+2.8+.3,lfBox(.6,1.6,17,.55,.04,16,"#10141f")+lfPoly([lfP(1.15,1.6,19),lfP(1.15,2.5,19),lfP(1.15,2.5,31),lfP(1.15,1.6,31)],"#2a1d4a")+lfPoly([lfP(1.16,1.65,20),lfP(1.16,2.45,20),lfP(1.16,2.45,30),lfP(1.16,1.65,30)],"#ff3d81",null,0,' opacity=".5"'));
  C.add(2.6+3.0+.6,lfBox(2.2,2.2,0,.9,.9,3,"#2a2a36")+lfBox(2.35,2.35,3,.6,.6,14,"#1e2230")+lfBox(2.1,2.1,17,.9,.9,4,"#d9534f",{top:"#ff7a6a"}));
  C.s("work",1.8,2.8,-1,"work",[12,26],{tag:"mix"});C.s("look",3.4,4.2,-1,"look",[2,5]);
  lfWander(C,[[4.4,3.2,-1],[3.4,5.0,-1]]);
  if(C.has("s_mon")){C.add(.5+.9+1.3+.5,lfBox(.55,1.2,17,.35,.4,18,"#222")+lfBox(.55,3.9,17,.35,.4,18,"#222"))}
  if(C.has("s_panel")){var pn='';for(var i=0;i<3;i++)pn+='<g transform="translate('+(i*44)+',0)">'+lfRr(0,0,38,38,3,"#2a2f4f","rgba(0,0,0,.4)")+'<path d="M4 4 L34 34 M4 34 L34 4" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/></g>';C.walls.push(lfFaceY(.6,0,96,pn)+lfFaceX(0,4.6,96,pn))}
  if(C.has("s_synth")){var sy=lfSynthProp(3.6,3.0);C.add(sy[0],sy[1]);C.s("work",4.9,4.0,-1,"work",[10,20])}
  if(C.has("s_booth")){C.box(4.2,.3,0,1.5,1.5,70,"rgba(170,215,240,.35)",{top:"rgba(210,235,250,.5)",l:"rgba(170,215,240,.3)",r:"rgba(130,185,225,.4)"});C.s("work",4.9,.9,1,"look",[6,12])}
};
LFROOM.gym=function(C){
  C.walls.push(lfWindow(.6,C.wx));C.decals.push(lfWinLight(.6));
  C.decals.push(lfFloorG(.8,2.2,lfRr(0,0,LF.U*4.2,LF.U*3,4,"#2a3038","rgba(0,0,0,.4)")+'<path d="M0 '+LF.U+' H'+LF.U*4.2+' M0 '+LF.U*2+' H'+LF.U*4.2+'" stroke="rgba(255,255,255,.08)"/>'));
  C.add(5.0+.8+.5+.8,lfBox(4.4,.4,0,1.2,.7,24,"#3a3f4a")+lfBox(4.4,.4,24,1.2,.7,2,"#555a66")+lfBox(4.5,.5,26,.2,.5,8,"#c9ced8")+lfBox(4.8,.5,26,.2,.5,8,"#ff6a4d")+lfBox(5.1,.5,26,.2,.5,8,"#c9ced8"));
  C.s("work",2.4,3.4,-1,"up",[6,12],{tag:"lift"});C.s("work",3.4,4.5,-1,"up",[6,12],{tag:"lift"});C.s("look",4.4,2.6,-1,"look",[3,6]);
  lfWander(C,[[1.6,4.8,-1],[4.8,4.4,1]]);
  if(C.has("y_bag")){C.add(2.5,'<path d="M'+lfPt(lfP(3.6,1.6,118))+' L'+lfPt(lfP(3.6,1.6,70))+'" stroke="#bbb" stroke-width="1.6"/>'+lfPoly([lfP(3.35,1.35,70),lfP(3.85,1.35,70),lfP(3.85,1.85,70),lfP(3.35,1.85,70)],"#222")+lfBox(3.35,1.35,10,.5,.5,60,"#c0392b",{top:"#e0584a"}));C.s("work",3.6,2.6,1,"work",[8,16],{tag:"punch"})}
  if(C.has("y_rack")){C.box(1.6,1.0,0,.22,.22,70,"#555a66");C.box(2.6,1.0,0,.22,.22,70,"#555a66");C.box(1.6,1.0,56,1.2,.22,3,"#9aa0ac");C.box(1.4,1.05,58,.2,.14,10,"#222");C.box(2.9,1.05,58,.2,.14,10,"#222");C.s("work",2.2,2.0,-1,"up",[8,14],{tag:"squat"})}
  if(C.has("y_bench")){C.box(4.6,5.3,0,1.5,.6,10,"#2a2f3a");C.box(4.6,5.3,10,1.5,.6,2,"#c9ced8");C.s("work",5.35,6.5,-1,"up",[6,12],{tag:"lift"})}
  if(C.has("y_tread")){var tp=lfTreadProp(4.4,3.0);C.add(tp[0],tp[1]);C.s("run",4.9,4.0,-1,"run",[10,24],{tag:"tread",onspot:1})}
  if(C.has("y_mirror")){var mr='<rect width="'+LF.U*3+'" height="70" fill="#bfe3f0" stroke="#d9dde5" stroke-width="3"/><path d="M10 60 L60 10 M50 62 L110 8" stroke="rgba(255,255,255,.5)" stroke-width="5"/>';C.walls.push(lfFaceX(0,5.4,90,mr))}
};
LFROOM.library=function(C){
  C.walls.push(lfWindow(3.6,C.wx));C.decals.push(lfWinLight(3.6));
  lfShelfL(C,.15,1.0,3.2,96,1);lfShelfR(C,.6,.15,2.6,84,2);
  C.box(3.0,3.0,0,1.5,.9,15,"#a9763f",{dk:.1,top:"#d9a870"});C.add(3.0+1.5+3.9+.5,lfBox(3.3,3.2,15,.4,.3,3,"#d9534f")+lfBox(3.9,3.3,15,.4,.3,2,"#3a6ab5"));
  C.s("sit",3.4,4.5,-1,"read",[14,30],{dk:99,tag:"read",lift:1});
  C.s("browse",1.4,2.6,-1,"look",[5,10],{tag:"browse"});
  lfWander(C,[[4.8,2.0,-1],[2.2,4.6,-1]]);
  lfLamp(C,5.3,2.4);
  if(C.has("lb_lamp"))lfSofa(C,4.1,3.8,1.45,"#9a5a4a","read","readc");
  if(C.has("lb_globe")){C.add(5.6+1.4+1,lfBox(5.1,.8,0,.5,.5,12,"#6a4426")+lfE(lfP(5.35,1.05,30)[0],lfP(5.35,1.05,30)[1],11,11,"#3a8ad9")+'<path d="M'+(lfP(5.35,1.05,30)[0]-9)+' '+(lfP(5.35,1.05,30)[1]-2)+' q6 -6 12 1 q3 5 6 -3" stroke="#6cb86a" stroke-width="4" fill="none"/>');C.s("look",5.1,1.9,1,"look",[3,6])}
  if(C.has("lb_fire")){lfLight(C,.9,4.3,22,"#ff9d3a",3,.95);var fp='<rect x="-6" y="-6" width="'+(LF.U*1.8+12)+'" height="'+(66)+'" fill="#7a6a5a" stroke="'+LFOL+'" stroke-width="1"/><rect width="'+LF.U*1.8+'" height="60" fill="#2a1a14"/><path d="M12 56 Q18 24 26 44 Q30 16 38 40 Q46 28 52 56Z" fill="#ff9d3a"/><path d="M22 56 Q26 36 32 48 Q38 34 42 56Z" fill="#ffd24a"/>';C.walls.push(lfFaceX(0,5.2,60,fp))}
};
LFROOM.dojo=function(C){
  C.walls.push(lfWindow(.8,C.wx));C.decals.push(lfWinLight(.8));
  C.walls.push(lfFrame("R",3.2,86,60,44,'<rect width="60" height="44" fill="#f2e8d0"/><text x="9" y="30" font-size="22" font-family="Arial" font-weight="900" fill="#b0302a">道</text>',"#6a4426"));
  C.s("work",3.2,3.2,-1,"work",[8,16],{tag:"train"});C.s("work",2.2,4.2,1,"up",[8,16],{tag:"stretch"});
  lfWander(C,[[4.4,3.4,-1],[1.6,2.2,-1],[4.2,5.0,1]]);
  if(C.has("d_dummy")){var dm=lfDummyProp(4.2,2.7);C.add(dm[0],dm[1]);C.s("work",3.9,3.1,1,"work",[8,16],{tag:"hit"})}
  if(C.has("d_rack")){C.box(5.1,1.2,0,.5,1.6,36,"#4a2e1a",{dk:.2});for(var k=0;k<3;k++)C.add(5.9+k*.5+1.2+1.6+.3,lfBox(5.2,1.4+k*.45,36,.12,.12,12,"#c9ced8")+lfBox(5.2,1.4+k*.45,34,.12,.12,3,"#222"))}
  if(C.has("d_bonsai")){C.box(1.2,.6,0,1.0,.8,12,"#6a4a3a",{dk:.1});C.add(2.2+1.4+.5,'<path d="M'+lfPt(lfP(1.7,1.0,12))+' q-6 -14 4 -22 q-8 -4 0 -12" stroke="#4a3220" stroke-width="3.4" fill="none"/>'+lfE(lfP(1.7,1.0,50)[0]+6,lfP(1.7,1.0,50)[1],17,9,"#2f8a4a")+lfE(lfP(1.7,1.0,52)[0]+10,lfP(1.7,1.0,52)[1]-6,10,6,"#3fae5a"))}
};
/* outdoor rooms */
LFROOM.garden=function(C){
  C.out=1;
  var bed=function(y){C.add(4.0+y+1.0,lfBox(.9,y,0,3.2,.8,8,"#a9763f",{top:"#5a3a22",dk:.1})+lfBox(1.0,y+.1,8,3.0,.6,.6,"#4a2e1c"));var R=lfSeed(Math.floor(y*10));var g="";for(var i=0;i<10;i++){var p=lfP(1.1+i*.3,y+.2+R()*.4,9);g+='<path d="M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' q-3 -6 -5 -4 M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' q3 -8 6 -6 M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' v-9" stroke="#2f9a4a" stroke-width="1.8" fill="none"/>'+(i%3==0?'<circle cx="'+p[0].toFixed(1)+'" cy="'+(p[1]-10).toFixed(1)+'" r="3" fill="'+["#e8453a","#ffb02e","#a03aa8"][i%3]+'"/>':'')}C.add(4.5+y+1,g)};
  bed(1.2);bed(2.8);
  if(C.has("g_box"))bed(4.4);
  C.add(8,lfBox(.3,4.5,0,.5,.5,10,"#9a6a3c",{top:"#5a3a22"})+'<circle cx="'+lfP(.55,4.75,12)[0]+'" cy="'+(lfP(.55,4.75,12)[1]-4)+'" r="5" fill="#ff6a9a"/><circle cx="'+(lfP(.55,4.75,12)[0]+8)+'" cy="'+(lfP(.55,4.75,12)[1]-2)+'" r="4" fill="#ffd24a"/><circle cx="'+(lfP(.55,4.75,12)[0]-7)+'" cy="'+(lfP(.55,4.75,12)[1]-1)+'" r="4" fill="#fff"/>');
  C.s("water",2.4,2.35,1,"water",[8,14],{tag:"water"});C.s("work",2.9,.8,1,"work",[8,14],{tag:"weed"});C.s("smell",.9,4.1,-1,"smell",[5,9],{tag:"smell"});C.s("work",3.0,3.9,-1,"work",[8,14],{tag:"weed"});
  lfWander(C,[[4.8,3.0,-1],[4.6,5.0,1],[1.4,5.2,-1]]);
  if(C.has("g_spr")){[[1.6,2.1],[3.4,2.1],[1.6,3.7],[3.4,3.7]].forEach(function(p){var q=lfP(p[0],p[1],6);C.add(p[0]+p[1]+.2,'<rect x="'+(q[0]-1.5)+'" y="'+(q[1]-6)+'" width="3" height="6" fill="#aab"/><path d="M'+q[0]+' '+(q[1]-8)+' q-12 -14 -18 -4 M'+q[0]+' '+(q[1]-8)+' q12 -14 18 -4" stroke="rgba(180,225,255,.8)" stroke-width="1.4" fill="none" class="lfmist"/>')})}
  if(C.has("g_lamp")){lfLight(C,1.6,2.3,66,"#d68aff",2.6,.8);lfLight(C,3.6,2.3,66,"#d68aff",2.6,.8);[1.6,3.6].forEach(function(x){var p=lfP(x,2.3,66);C.add(x+2.3+.3,lfBox(x-.04,2.26,0,.08,.08,64,"#4a3a6a")+lfBox(x-.4,2.0,64,.8,.6,5,"#4a3a6a",{top:"#d68aff"}));C.front.push('<polygon points="'+(p[0]-14)+','+p[1]+' '+(p[0]+14)+','+p[1]+' '+(p[0]+30)+','+(p[1]+64)+' '+(p[0]-30)+','+(p[1]+64)+'" fill="rgba(210,110,255,.14)"/>')})}
  if(C.has("g_koi")){var q=lfP(4.5,4.3,0);C.add(8.6,lfPoly([lfP(3.8,3.7,0),lfP(5.3,3.7,0),lfP(5.3,5.2,0),lfP(3.8,5.2,0)],"#b9b4a6",LFOL,1)+lfPoly([lfP(3.95,3.85,0),lfP(5.15,3.85,0),lfP(5.15,5.05,0),lfP(3.95,5.05,0)],"#5ab4d6")+lfE(q[0]+6,q[1]-4,6,2.6,"#ff8a3a")+lfE(q[0]-9,q[1]+3,5,2,"#fff3e0")+'<path d="M'+(q[0]+2)+' '+(q[1]-26)+' q8 -12 16 4" stroke="rgba(190,230,255,.9)" stroke-width="2" fill="none" class="lfmist"/>'+lfBox(4.35,4.15,0,.3,.3,16,"#9aa0a8"))}
};
LFROOM.farm=function(C){
  C.out=1;
  for(var r=0;r<4;r++){var y=1.0+r*.95;C.add(3.5+y+.6,lfBox(.9,y,0,3.6,.5,4,"#7a5230",{top:"#6a4426"})+(function(){var g="",R=lfSeed(r*13+2);for(var i=0;i<26;i++){var p=lfP(1.0+i*.14,y+.1+R()*.3,4);g+='<path d="M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' v-'+(10+R()*8).toFixed(0)+'" stroke="#e6c34a" stroke-width="1.6"/><ellipse cx="'+p[0].toFixed(1)+'" cy="'+(p[1]-(14+R()*5)).toFixed(1)+'" rx="1.6" ry="3.4" fill="#f3d86a"/>'}return g})())}
  C.add(6,lfBox(5.0,1.2,0,.14,.14,38,"#8a5a30")+lfBox(4.6,1.2,24,1.0,.14,5,"#8a5a30")+lfBox(4.8,1.1,28,.5,.3,12,"#d9b070",{top:"#e8c890"})+lfE(lfP(5.05,1.2,46)[0],lfP(5.05,1.2,46)[1],8,8,"#e8c890"));
  C.s("work",2.4,1.7,-1,"work",[8,14],{tag:"hoe"});C.s("work",3.4,3.6,-1,"work",[8,14],{tag:"hoe"});C.s("look",5.2,2.6,-1,"look",[3,6]);
  lfWander(C,[[4.8,4.2,-1],[2.0,5.0,-1]]);
  if(C.has("f_coop")){C.add(5.2+4+.5,lfBox(4.5,3.8,0,1.2,1.0,24,"#c0613a",{top:"#e07a50"})+lfBox(4.4,3.7,24,1.4,1.2,3,"#8a3a2a")+lfPoly([lfP(5.7,3.9,4),lfP(5.7,4.4,4),lfP(5.7,4.4,18),lfP(5.7,3.9,18)],"#2a1a14"));C.s("work",4.4,5.4,-1,"work",[6,10],{tag:"feed"})}
  if(C.has("f_tractor")){C.add(2.5+5.2+.8,lfBox(1.6,4.7,6,1.5,.8,12,"#d9534f",{top:"#ff7a6a"})+lfBox(2.3,4.7,18,.6,.8,14,"#c0392b")+lfE(lfP(1.8,5.5,6)[0],lfP(1.8,5.5,6)[1],7,7,"#222")+lfE(lfP(2.8,5.5,8)[0],lfP(2.8,5.5,8)[1],5,5,"#222"));}
  if(C.has("f_silo")){C.add(2,lfBox(.5,.5,0,1.1,1.1,90,"#c9ced8",{top:"#e6eaf2"})+lfBox(.45,.45,90,1.2,1.2,6,"#8a93a6"))}
};
LFROOM.pond=function(C){
  C.out=1;
  var q=lfP(3.0,3.0,0);
  C.decals.push(lfPoly([lfP(.9,1.0,0),lfP(5.1,1.0,0),lfP(5.1,4.8,0),lfP(.9,4.8,0)],"#b9b4a6",LFOL,1)+lfPoly([lfP(1.1,1.2,0),lfP(4.9,1.2,0),lfP(4.9,4.6,0),lfP(1.1,4.6,0)],"#4fb8da")+lfPoly([lfP(1.1,1.2,0),lfP(4.9,1.2,0),lfP(4.9,1.9,0),lfP(1.1,1.9,0)],"rgba(255,255,255,.12)"));
  C.add(8,lfE(q[0]-12,q[1]-6,7,3,"#ff8a3a")+lfE(q[0]+22,q[1]+6,6,2.6,"#fff3e0")+lfE(q[0]+4,q[1]+14,6,2.4,"#ffd24a")+lfE(q[0]-40,q[1]+4,12,5,"#3fae5a")+lfE(q[0]+40,q[1]-8,10,4,"#3fae5a")+'<circle cx="'+(q[0]+40)+'" cy="'+(q[1]-10)+'" r="2.6" fill="#ff8ab8"/>');
  [[.5,.6],[5.4,.7],[.5,5.3],[5.5,5.4]].forEach(function(p,i){C.add(p[0]+p[1]+.3,lfBox(p[0]-.3,p[1]-.3,0,.6,.6,8+i*2,"#8a8f9c",{top:"#b5bac6"}))});
  C.s("fish",.5,2.8,1,"fish",[10,24],{tag:"fish"});C.s("fish",3.2,5.5,1,"fish",[10,24],{tag:"fish"});
  lfWander(C,[[.6,4.4,-1],[5.5,3.2,-1]]);
  if(C.has("p_net"))C.add(9,'<path d="M'+lfPt(lfP(5.2,1.2,26))+' L'+lfPt(lfP(5.2,3.2,26))+'" stroke="#c9b47a" stroke-width="1.4"/>'+lfBox(5.1,1.1,0,.14,.14,26,"#8a5a30")+lfBox(5.1,3.2,0,.14,.14,26,"#8a5a30"));
  if(C.has("p_lant"))[1.5,3.0,4.5].forEach(function(x){var p=lfP(x,1.0,40);C.add(x+1.2,'<path d="M'+p[0]+' '+(p[1]-20)+' V'+p[1]+'" stroke="#444" stroke-width="1"/><rect x="'+(p[0]-6)+'" y="'+p[1]+'" width="12" height="16" rx="5" fill="#ff7a5a" stroke="'+LFOL+'" stroke-width=".7"/>'+lfE(p[0],p[1]+10,16,10,"rgba(255,170,90,.28)"))});
  if(C.has("p_pump")){C.add(5.9,lfBox(5.2,4.9,0,.5,.5,14,"#7a8a9a")+'<path d="M'+lfPt(lfP(5.0,4.8,10))+' q-10 -14 -22 -6" stroke="rgba(190,230,255,.9)" stroke-width="2" fill="none" class="lfmist"/>')}
};
LFROOM.sky=function(C){
  C.out=1;
  C.box(.6,.9,0,.9,3.4,17,"#2a2f55",{top:"#4a5190",dk:.2});C.box(2.6,3.4,0,1.2,.6,12,"#e8e0d0",{top:"#fff",dk:.1});C.box(4.0,3.4,0,1.2,.6,12,"#e8e0d0",{top:"#fff",dk:.1});
  C.s("sit",3.2,4.5,-1,"sit",[12,26],{dk:99,tag:"chair",lift:1});C.s("sit",4.6,4.5,-1,"sit",[12,26],{dk:99,tag:"chair",lift:1});C.s("work",1.9,2.4,-1,"work",[8,14],{tag:"pour"});
  lfWander(C,[[4.6,2.0,-1],[3.0,2.6,1]]);
  if(C.has("k_lights"))for(var k=0;k<5;k++){var p=lfP(.5+k*1.2,.3,92+Math.sin(k)*3);C.front.push('<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3" fill="#fff3b0"/><circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="9" fill="rgba(255,243,176,.3)"/>')}
  if(C.has("k_fire")){lfLight(C,4.0,2.2,14,"#ff9d3a",3.2,.9);var f=lfP(4.0,2.2,0);C.add(6.3,lfBox(3.6,1.8,0,.9,.9,8,"#7a6a60",{top:"#3a302c"})+'<path d="M'+(f[0]-6)+' '+(f[1]-4)+' q4 -20 8 -8 q6 -20 8 8Z" fill="#ff9d3a" class="lfmist"/><path d="M'+(f[0]-2)+' '+(f[1]-4)+' q2 -12 4 -4 q4 -12 5 4Z" fill="#ffd24a"/>');C.s("sit",4.8,2.5,-1,"sit",[14,30],{dk:99,lift:1})}
  if(C.has("k_tub")){C.add(9,lfBox(4.2,.5,0,1.5,1.4,14,"#6a7a9a",{top:"#4fc8e8"}));}
};

/* ---------- navigation: obstacles, A*, snapping ---------- */
var LFREC=null,LFNC=.25,LFPAD=.25;
function lfRecBox(x,y,z,w,d,h){
  if(!LFREC)return;
  if(w<.06&&d<.06)return;
  var low=z<=6&&z+h>=9, top=z>6&&z<=26&&w*d>=.45&&h>=2;
  if(low||top){var o=[x,y,x+w,y+d];o.h=z+h;LFREC.push(o)}
}
function lfNavBuild(C,obs){
  var W=C.W,D=C.D,nx=Math.ceil(W/LFNC),ny=Math.ceil(D/LFNC),cnt=new Uint8Array(nx*ny),list=[];
  // merge duplicates (same footprint recorded twice)
  var seen={};
  obs.forEach(function(r){var k=r.map(function(v){return Math.round(v*20)}).join(",");if(seen[k])return;seen[k]=1;
    var x0=r[0]-LFPAD,y0=r[1]-LFPAD,x1=r[2]+LFPAD,y1=r[3]+LFPAD,cells=[];
    for(var i=Math.max(0,Math.floor(x0/LFNC));i<=Math.min(nx-1,Math.floor(x1/LFNC));i++)for(var j=Math.max(0,Math.floor(y0/LFNC));j<=Math.min(ny-1,Math.floor(y1/LFNC));j++){
      var cx=(i+.5)*LFNC,cy=(j+.5)*LFNC;if(cx>=x0&&cx<=x1&&cy>=y0&&cy<=y1){cells.push(j*nx+i);cnt[j*nx+i]++}}
    list.push({x0:x0,y0:y0,x1:x1,y1:y1,cells:cells});});
  C.nav={nx:nx,ny:ny,cnt:cnt,obs:list,W:W,D:D};
  if(C.patio&&C.patio.deck){C.nav.pa=lfPaObs(C.patio);if(C.patio.real)C.nav.paR=C.patio.real}
  if(C.annex&&!C.annex.lair&&window.LFCL)C.nav.cl={x0:.9,x1:LFCL.CW-.3,y0:D-.3,yd:D+.25,y1:D+1.45,dx0:3.5,dx1:4.0,lr:!!C.annex.lr,lro:lfLrObs(C.annex)};
}
function lfCell(N,x,y){var i=Math.floor(x/LFNC),j=Math.floor(y/LFNC);i=Math.max(0,Math.min(N.nx-1,i));j=Math.max(0,Math.min(N.ny-1,j));return j*N.nx+i}
function lfClIn(N,x,y){var c=N&&N.cl;if(!c||x<=.1||x>=c.x1||y<=c.y0||y>=c.y1)return false;
  if(x<=c.x0)return c.lr&&y>9.4&&y<10.3;
  if(y<c.yd&&(x<c.dx0||x>c.dx1))return false;return true}
/* lair zone: bare floor + walkway; local frame u=x+18, v=y-6; item footprints appear as upgrades are bought */
function lfLrObs(A){var o=[];if(!A)return o;
  if(A.rack||A.desk){o.push([0,0,1.5,1.6]);o.push([0,9.5,1.5,12])}
  if(A.desk)o.push([0,1.4,2.4,9.8]);
  if(A.trophy)o.push([0,0,2.4,1.5]);
  if(A.arm)o.push([2.2,0,5.3,1.3]);
  if(A.suit)o.push([5.2,0,12,1.9]);
  if(A.holo)o.push([2.45,2.05,6.15,5.75,"c"]);
  return o}
function lfLrIn(N,x,y){var c=N&&N.cl;if(!c||!c.lr||x>=.2)return false;
  if(x>-7.4&&y>9.35&&y<10.75)return true;
  var u=x+18,v=y-6;if(u<.45||u>(v>2.4&&v<6.2?13.2:11.7)||v<.45||v>11.05)return false;
  var L=c.lro||[];for(var i=0;i<L.length;i++){var o=L[i];
    if(o[4]){var cx=(o[0]+o[2])/2,cy=(o[1]+o[3])/2,r=(o[2]-o[0])/2+.35;if((u-cx)*(u-cx)+(v-cy)*(v-cy)<r*r)return false}
    else if(u>o[0]-.35&&u<o[2]+.35&&v>o[1]-.35&&v<o[3]+.35)return false}
  return true}
function lfGLos(N,inF,ax,ay,bx,by){var d=Math.hypot(bx-ax,by-ay),n=Math.ceil(d/.04),px=d?-(by-ay)/d*.07:0,py=d?(bx-ax)/d*.07:0;for(var k=1;k<=n;k++){var t=k/n,x=ax+(bx-ax)*t,y=ay+(by-ay)*t;if(!inF(N,x,y)||!inF(N,x+px,y+py)||!inF(N,x-px,y-py))return false}return true}
function lfGPath(N,inF,X0,Y0,WD,HD,sx,sy,gx,gy){
  if(lfGLos(N,inF,sx,sy,gx,gy))return [[gx,gy]];
  var S=.3,nx=Math.ceil(WD/S),ny=Math.ceil(HD/S),id=function(i,j){return j*nx+i},
    ci=function(x,y){return [Math.max(0,Math.min(nx-1,Math.floor((x-X0)/S))),Math.max(0,Math.min(ny-1,Math.floor((y-Y0)/S)))]},
    cp=function(i,j){return [X0+(i+.5)*S,Y0+(j+.5)*S]};
  var s0=ci(sx,sy),g0=ci(gx,gy),g=new Float32Array(nx*ny).fill(1e9),par=new Int32Array(nx*ny).fill(-1),cl=new Uint8Array(nx*ny),open=[id(s0[0],s0[1])];
  g[open[0]]=0;var G=id(g0[0],g0[1]),found=false;
  while(open.length){var bi=0,bf=1e9;for(var k=0;k<open.length;k++){var q=open[k],qi=q%nx,qj=(q/nx)|0,h=Math.hypot(qi-g0[0],qj-g0[1])*S,f=g[q]+h;if(f<bf){bf=f;bi=k}}
    var cur=open.splice(bi,1)[0];if(cl[cur])continue;cl[cur]=1;if(cur===G){found=true;break}
    var ci0=cur%nx,cj0=(cur/nx)|0;
    for(var dx=-1;dx<=1;dx++)for(var dy=-1;dy<=1;dy++){if(!dx&&!dy)continue;var X=ci0+dx,Y=cj0+dy;if(X<0||Y<0||X>=nx||Y>=ny)continue;var ni=id(X,Y);if(cl[ni])continue;
      var p=cp(X,Y);if(!inF(N,p[0],p[1])&&ni!==G)continue;if(dx&&dy){var p1=cp(ci0+dx,cj0),p2=cp(ci0,cj0+dy);if(!inF(N,p1[0],p1[1])||!inF(N,p2[0],p2[1]))continue}var ng=g[cur]+(dx&&dy?1.414:1)*S;if(ng<g[ni]){g[ni]=ng;par[ni]=cur;open.push(ni)}}}
  if(!found)return [[gx,gy]];
  var pts=[],c=G;while(c!==-1&&c!==id(s0[0],s0[1])){pts.push(cp(c%nx,(c/nx)|0));c=par[c]}pts.reverse();pts[pts.length-1]=[gx,gy];
  var out=[],ax=sx,ay=sy,i=0;while(i<pts.length){var j=pts.length-1;while(j>i&&!lfGLos(N,inF,ax,ay,pts[j][0],pts[j][1]))j--;out.push(pts[j]);ax=pts[j][0];ay=pts[j][1];i=j+1}
  return out}
function lfLrPath(N,sx,sy,gx,gy){return lfGPath(N,lfLrIn,-18.6,5.4,19,13,sx,sy,gx,gy)}
/* patio deck outside the glass door (y<0): door strip x 8.3-9.15, deck stays inside the glass view */
function lfPaObs(P){var o=[];if(P.swing){o.push([3.0,-1.0,1.1]);o.push([2.0,-1.0,.5])}if(P.deco)o.push([6.7,-1.7,.4]);return o}
function lfPaIn(N,x,y){if(!N||!N.pa)return false;
  if(x>8.05&&x<9.15&&y>-.75&&y<.4)return true;
  var R=N.paR;if(R){var px=x-R.ox,py=y-R.oy;if(px<.3||px>R.W-.12||py<.3||py>R.D+.05)return false;
    for(var b=0;b<R.box.length;b++){var o=R.box[b];if(px>o[0]&&px<o[2]&&py>o[1]&&py<o[3])return false}return true}
  var ok=false;
  if(y<=-.3&&y>=-1.25&&x>7.5&&x<9.15)ok=true;
  else if(y<=-.3&&y>=-2.4&&x>1.8&&x<8.45-Math.abs(y))ok=true;
  if(!ok)return false;
  for(var i=0;i<N.pa.length;i++){var o=N.pa[i];if((x-o[0])*(x-o[0])+(y-o[1])*(y-o[1])<(o[2]+.35)*(o[2]+.35))return false}
  return true}
function lfPaPath(N,sx,sy,gx,gy){var R=N.paR;if(R)return lfGPath(N,lfPaIn,R.ox,R.oy,Math.max(R.W,9.4-R.ox)+.2,R.D+1.0,sx,sy,gx,gy);return lfGPath(N,lfPaIn,1.2,-2.8,8.2,3.4,sx,sy,gx,gy)}
window.lfPaIn=lfPaIn;
function lfZoneIn(N,x,y){return lfClIn(N,x,y)||lfLrIn(N,x,y)||lfPaIn(N,x,y)}
window.lfZoneIn=lfZoneIn;
window.lfLrIn=lfLrIn;window.lfLrObs=lfLrObs;
function lfBlockedAt(C,x,y){var N=C.nav;if(!N)return false;if(N.pa&&y<.3)return !lfPaIn(N,x,y);if(N.cl&&x<=.15)return !lfLrIn(N,x,y);if(N.cl&&y>N.D-.3)return !lfClIn(N,x,y);if(x<.3||y<.3||x>N.W-.3||y>N.D-.3)return true;return N.cnt[lfCell(N,x,y)]>0}
/* nearest free spot to (x,y), searching in rings; returns [x,y] */
/* Nearest walkable point with no clamping to the main room, for spots in annexes and patios. */
function lfFreeSpot(C,x,y,maxr){var best=[x,y],bd=1e9;for(var dx=-maxr;dx<=maxr;dx+=LFNC)for(var dy=-maxr;dy<=maxr;dy+=LFNC){var dd=dx*dx+dy*dy;if(dd<bd&&!lfBlockedAt(C,x+dx,y+dy)){bd=dd;best=[x+dx,y+dy]}}return best}
function lfFreeNear(C,x,y,maxr){
  var N=C.nav;x=Math.max(.45,Math.min(C.W-.45,x));y=Math.max(.45,Math.min(C.D-.45,y));
  if(!N||!lfBlockedAt(C,x,y))return [x,y];
  var best=null,bd=1e9;maxr=maxr||2.4;
  for(var dx=-maxr;dx<=maxr;dx+=LFNC)for(var dy=-maxr;dy<=maxr;dy+=LFNC){
    var qx=x+dx,qy=y+dy,dd=dx*dx+dy*dy;if(dd>=bd)continue;if(!lfBlockedAt(C,qx,qy)){bd=dd;best=[qx,qy]}}
  return best||[x,y];
}
function lfRandFree(C){
  for(var k=0;k<40;k++){var x=lfRand(.8,C.W-.8),y=lfRand(.8,C.D-.8);if(!lfBlockedAt(C,x,y))return [x,y]}
  return [C.W/2,C.D/2];
}
/* A* with exemption for obstacles that contain the start/goal */
function lfPath(C,sx,sy,gx,gy){
  var N=C.nav;if(!N)return [[gx,gy]];
  var ex=[],cs=lfCell(N,sx,sy),cg=lfCell(N,gx,gy);N.obs.forEach(function(o){if(sx>=o.x0&&sx<=o.x1&&sy>=o.y0&&sy<=o.y1||gx>=o.x0&&gx<=o.x1&&gy>=o.y0&&gy<=o.y1||o.cells.indexOf(cs)>=0||o.cells.indexOf(cg)>=0)ex.push(o)});
  var soft=new Uint8Array(N.nx*N.ny);
  ex.forEach(function(o){o.cells.forEach(function(c){N.cnt[c]--;soft[c]=1})});
  var res=null;
  try{res=lfAstar(C,N,soft,sx,sy,gx,gy)}catch(e){res=null}
  ex.forEach(function(o){o.cells.forEach(function(c){N.cnt[c]++})});
  return res||[[gx,gy]];
}
function lfLos(N,soft,ax,ay,bx,by){
  var d=Math.hypot(bx-ax,by-ay),n=Math.ceil(d/.08);
  for(var k=1;k<=n;k++){var t=k/n,x=ax+(bx-ax)*t,y=ay+(by-ay)*t;
    if(N.pa&&y<.3){if(!lfPaIn(N,x,y))return false;continue}
    if(N.cl&&x<=.15){if(!lfLrIn(N,x,y))return false;continue}if(N.cl&&y>N.D-.3){if(!lfClIn(N,x,y))return false;continue}
    if(x<.3||y<.3||x>N.W-.3||y>N.D-.3)return false;
    var c=lfCell(N,x,y);if(N.cnt[c]>0)return false;if(soft[c])return false}
  return true;
}
function lfAstar(C,N,soft,sx,sy,gx,gy){
  var nx=N.nx,ny=N.ny,S=lfCell(N,sx,sy),G=lfCell(N,gx,gy);
  if(lfLos(N,soft,sx,sy,gx,gy))return [[gx,gy]];
  var g=new Float32Array(nx*ny).fill(1e9),par=new Int32Array(nx*ny).fill(-1),closed=new Uint8Array(nx*ny);
  var heap=[],hx=function(i){var ix=i%nx,iy=(i/nx)|0,gxi=G%nx,gyi=(G/nx)|0,dx=Math.abs(ix-gxi),dy=Math.abs(iy-gyi);return (Math.max(dx,dy)+.414*Math.min(dx,dy))*LFNC};
  function push(i,f){heap.push([f,i]);var k=heap.length-1;while(k>0){var p=(k-1)>>1;if(heap[p][0]<=heap[k][0])break;var t=heap[p];heap[p]=heap[k];heap[k]=t;k=p}}
  function pop(){var top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;var k=0,n=heap.length;for(;;){var l=2*k+1,r=l+1,m=k;if(l<n&&heap[l][0]<heap[m][0])m=l;if(r<n&&heap[r][0]<heap[m][0])m=r;if(m===k)break;var t=heap[m];heap[m]=heap[k];heap[k]=t;k=m}}return top}
  g[S]=0;push(S,hx(S));var found=false,iter=0,bestN=S,bestH=hx(S);
  while(heap.length&&iter++<6000){
    var cur=pop()[1];if(closed[cur])continue;closed[cur]=1;if(cur===G){found=true;break}var hc=hx(cur);if(hc<bestH){bestH=hc;bestN=cur}
    var cx=cur%nx,cy=(cur/nx)|0;
    for(var dx=-1;dx<=1;dx++)for(var dy=-1;dy<=1;dy++){
      if(!dx&&!dy)continue;var X=cx+dx,Y=cy+dy;if(X<0||Y<0||X>=nx||Y>=ny)continue;
      var ni=Y*nx+X;if(closed[ni])continue;
      var px=(X+.5)*LFNC,py=(Y+.5)*LFNC;if(px<.3||py<.3||px>N.W-.3||py>N.D-.3)continue;
      var blocked=N.cnt[ni]>0;if(blocked)continue;
      if(dx&&dy){ // no corner cutting
        if(N.cnt[cy*nx+X]>0||N.cnt[Y*nx+cx]>0)continue}
      var step=(dx&&dy?1.414:1)*LFNC*(soft[ni]?4:1),ng=g[cur]+step;
      if(ng<g[ni]){g[ni]=ng;par[ni]=cur;push(ni,ng+hx(ni))}
    }
  }
  var partial=!found;if(partial){if(bestN===S)return [[sx,sy]];G=bestN}
  var pts=[],c=G;while(c!==-1&&c!==S){pts.push([(c%nx+.5)*LFNC,((c/nx)|0)*LFNC+LFNC/2]);c=par[c]}
  pts.reverse();if(!partial)pts[pts.length-1]=[gx,gy];if(!pts.length)return [[sx,sy]];
  // string pulling
  var out=[],ax=sx,ay=sy,i=0;
  while(i<pts.length){var j=pts.length-1;while(j>i&&!lfLos(N,soft,ax,ay,pts[j][0],pts[j][1]))j--;out.push(pts[j]);ax=pts[j][0];ay=pts[j][1];i=j+1}
  return out;
}

/* route that knows about the walk-in closet (outside the nav grid): door at x=0, corridor y=3.3 in front of the island */
function lfZone(N,x,y){if(N&&N.pa&&y<.35&&lfPaIn(N,x,y))return "p";if(!N||!N.cl)return "m";if(x<=.15)return lfLrIn(N,x,y)?"l":"m";return lfClIn(N,x,y)?"c":"m"}
function lfRoute(C,sx,sy,gx,gy){
  var N=C.nav;if(!N)return [[gx,gy]];
  var zs=lfZone(N,sx,sy),zg=lfZone(N,gx,gy);
  if(zs==='p'||zg==='p'){var DX=8.75;
    if(zs==='p'&&zg==='p')return lfPaPath(N,sx,sy,gx,gy);
    if(zg==='p'){var w1=lfRoute(C,sx,sy,DX,.9);w1.push([DX,.35],[DX,-.4]);return w1.concat(lfPaPath(N,DX,-.4,gx,gy))}
    var w2=lfPaPath(N,sx,sy,DX,-.4);w2.push([DX,.35],[DX,.9]);return w2.concat(lfRoute(C,DX,.9,gx,gy))}
  if(!N.cl)return lfPath(C,sx,sy,gx,gy);if(zs==="m"&&zg==="m")return lfPath(C,sx,sy,gx,gy);
  var c=N.cl,dxm=(c.dx0+c.dx1)/2,D=N.D,wp=[],i;
  /* chain: m <-> c <-> l ; node lists per hop */
  var toC_fromM=[[dxm,D-.45],[dxm,D-.05],[dxm,D+.6]],toC_fromL=[[-.9,9.85],[.1,9.85],[.7,9.85],[1.1,9.85]];
  var E=[-.4,9.85],inLair=function(sx,sy,gx,gy){return lfLrPath(N,sx,sy,gx,gy)};
  var fromL=function(){var w=lfLrPath(N,sx,sy,E[0],E[1]);w.push([.5,9.85],[1.05,9.8]);return w};
  var intoL=function(){return [[.5,9.85],[-.4,9.85]]};
  if(zs==="m"){ /* m -> c [-> l] */
    wp=lfPath(C,sx,sy,dxm,D-.45).concat([[dxm,D-.05],[dxm,D+.6]]);
    if(zg==="c")wp.push([gx,gy]);
    else{wp.push([1.1,9.85]);wp=wp.concat(intoL());wp=wp.concat(inLair(E[0],E[1],gx,gy))}
  }else if(zs==="c"){
    if(zg==="m"){wp=[[dxm,D+.6],[dxm,D-.05]].concat(lfPath(C,dxm,D-.45,gx,gy))}
    else if(zg==="c")wp=[[gx,gy]];
    else{wp=[[1.1,9.85]].concat(intoL()).concat(inLair(E[0],E[1],gx,gy))}
  }else{ /* lair */
    if(zg==="l")wp=inLair(sx,sy,gx,gy);
    else{wp=fromL();if(zg==="c")wp.push([gx,gy]);else{wp.push([1.1,9.85],[dxm,D+.6],[dxm,D-.05]);wp=wp.concat(lfPath(C,dxm,D-.45,gx,gy))}}
  }
  return wp;
}


window.lfClIn=lfClIn;

/* scene: room composer, world layout, facade */
var LFW={wx:"sun",src:"sim",hour:null,cloud:null,temp:null,storm:0,t:0};
var LFRS={restaurant:.7,garden:.72,gameroom:.88,auditorium:.84,spa:.88};function lfRsc(t){var d=lfDimOf(t),s=LFRS[t]||1;return Math.min(s,556/((d[0]+d[1])*26),415/(LF.H+(d[0]+d[1])*13+30))}
var LFFP=400,LFCOLW=600,LFOX=[300,900],LFWW=1200,LFROOF=168,LFSTREET=130;
function lfRoomCtx(r,i){
  lfSetDim(r.t);window.LFCR=r.t;
  var uid=i+1,C=lfCtx(r.t,r.a||{},uid,r.st||0,LFW.wx);
  C.room=r;C.key=i;var rec=[];LFREC=rec;LFWINS=[];try{lfMigA(r);LFROOM[r.t](C);if(window.rmPortalsOn)rmPortals(C,r)}finally{LFREC=null}
  C.items.sort(function(a,b){return a.k-b.k});C.obsRaw=rec;C.wins=LFWINS.slice();lfNavBuild(C,rec);
  /* Standing spots may never sit inside furniture, whatever upgrades are owned. */
  C.st.forEach(function(s){if(s.exit&&lfBlockedAt(C,s.exit[0],s.exit[1]))s.exit=lfFreeSpot(C,s.exit[0],s.exit[1],4);if(s.kind==="door"||lfSeatish(s)||s.lift||s.onspot||!lfBlockedAt(C,s.x,s.y))return;var f=lfFreeNear(C,s.x,s.y,3);s.x=f[0];s.y=f[1]});try{C.LT=lfRoomLight(C,uid,r.t,!!C.T.out)}catch(e){C.LT={pre:"",mid:"",post:"",defs:""}}return C;
}
/* static room (no agents). C.items kept as separate <g data-k> so agents can be interleaved. */
function lfRoomSvg(r,i,C,opt){
  lfSetDim(r.t);opt=opt||{};var uid=opt.uid||(i+1),t=r.t,out=C.T.out,s='',st=r.st||0;
  LFDEC=lfDecFor(r,C.T);var hole=(C.annex||C.patio)?lfHoles(C,uid):null;if(hole)s+=hole.defs+(C.annex?lfAnnexPre(C,uid):'')+(C.patio?lfPatioPre(C,uid):'');if(C.bg&&opt.uid)s=C.bg+s;var s0=s.length;if(C.noshell!==1)s+=lfSlab();
  /* C.noOut: a painted outdoor room (the Garden lot) brings its own walls, so no hedge behind and no fence in front */
  if(out&&!C.bg&&!C.noOut)s+=lfOutBack(t,LFW.wx,uid);
  if(!C.noshell)s+=lfFloor(C.T,C.T.fl,st,uid);
  if(C.notch)s=s.slice(0,s0)+rsNotchShell(C,uid,s.slice(s0));
  if(!out&&!C.noshell){var wlW=LF.W,wlN=LF.N;if(C.rsW){LF.W=C.rsW;LF.N=C.rsW}var wls=lfWalls(t,st,uid,LFW.wx);LF.W=wlW;LF.N=wlN;s+=hole?'<g clip-path="url(#'+hole.id+')">'+wls+'</g>':wls}
  s+=C.decals.join("")+C.walls.join("");
  if(C.LT)s+=C.LT.defs+C.LT.pre;
  s+='<g class="lfitems" data-i="'+i+'">';
  C.items.forEach(function(it){s+='<g data-k="'+it.k.toFixed(2)+'"'+(it.b?' data-b="'+it.b.join(",")+'"':'')+'>'+it.s+'</g>'});
  s+='</g>';
  if(out&&!C.noOut)s+=lfOutFront(t,uid);
  s+=C.front.join("");
  if(C.LT)s+=C.LT.mid;
  if(opt.uid&&C.pfront)s+=C.pfront.join("");
  return s;
}
function lfRainG(w,h,seed){var R=lfSeed(seed),s='';for(var k=0;k<26;k++){var x=-w/2+R()*w,y=-h+R()*h,d=(R()*1.2).toFixed(2);s+='<path d="M'+x.toFixed(0)+' '+y.toFixed(0)+' l-4 11" stroke="rgba(200,225,255,.7)" stroke-width="1.2" class="lfdrop" style="animation-delay:-'+d+'s"/>'}return s}
function lfPlusG(){return '<g class="lfplus" transform="translate(0,104)"><circle r="22" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.5)" stroke-width="1.5" stroke-dasharray="4 3"/><path d="M-9 0H9M0 -9V9" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>'}
function lfEmptySlot(i){
  var nx=nextRoom();if(i!==S.base.slots.length||!nx)return '';
  lfSetDim("");var N=LF.W,s=lfSlab(),lk=effLvl()<ROOMT[nx].lv;
  s+=lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,N,0),lfP(0,N,0)],"#23212f","rgba(255,255,255,.22)",1.2,' stroke-dasharray="6 5"');
  for(var k=1;k<N;k++)s+='<path d="M'+lfPt(lfP(k,0,0))+' L'+lfPt(lfP(k,N,0))+' M'+lfPt(lfP(0,k,0))+' L'+lfPt(lfP(N,k,0))+'" stroke="rgba(255,255,255,.06)"/>';
  s+=lfPoly([lfP(0,0,0),lfP(0,N,0),lfP(0,N,40),lfP(0,0,40)],"rgba(255,255,255,.05)","rgba(255,255,255,.14)",1,' stroke-dasharray="6 5"')+lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,0,40),lfP(0,0,40)],"rgba(255,255,255,.07)","rgba(255,255,255,.14)",1,' stroke-dasharray="6 5"');
  if(lk)s+='<g class="lfplus" transform="translate(0,100)"><circle r="26" fill="rgba(20,18,28,.85)" stroke="rgba(255,200,87,.7)" stroke-width="2"/><rect x="-10" y="-3" width="20" height="15" rx="3" fill="#ffc857"/><path d="M-6 -3V-9a6 6 0 0 1 12 0V-3" fill="none" stroke="#ffc857" stroke-width="3"/></g><rect x="-118" y="136" width="236" height="52" rx="26" fill="#14121c" stroke="rgba(255,200,87,.6)" stroke-width="2"/><text y="160" text-anchor="middle" font-size="19" font-weight="700" fill="#fff" font-family="Inter,sans-serif">Expand &middot; '+esc(ROOMT[nx].name)+'</text><text y="180" text-anchor="middle" font-size="15" font-weight="700" fill="#ffc857" font-family="monospace">Lv 3</text>';
  else s+=lfPlusG()+'<rect x="-118" y="136" width="236" height="40" rx="20" fill="#14121c" stroke="rgba(255,255,255,.4)" stroke-width="2"/><text y="162" text-anchor="middle" font-size="19" font-weight="700" fill="#fff" font-family="Inter,sans-serif">Expand &middot; Restaurant</text>';
  return s;
}
function lfLockedRow(lv){
  var s='';
  [0,1].forEach(function(c){
    lfSetDim("");s+='<g transform="translate('+LFOX[c]+',0)">'+lfSlab();
    var N=LF.W;
    s+=lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,N,0),lfP(0,N,0)],"#23212e","rgba(255,255,255,.14)",1);
    [0,N].forEach(function(u){s+=lfBox(u?N-.2:0,0,0,.2,.2,110,"#6a6a78",{top:"#8a8a98"})+lfBox(0,u?N-.2:0,0,.2,.2,110,"#6a6a78",{top:"#8a8a98"})});
    for(var z=30;z<=110;z+=40)s+=lfPoly([lfP(0,0,z),lfP(N,0,z),lfP(N,.1,z),lfP(0,.1,z)],"#9a9aa8","none")+lfPoly([lfP(0,0,z),lfP(0,N,z),lfP(.1,N,z),lfP(.1,0,z)],"#85858f","none");
    s+='</g>';
  });
  s+='<g transform="translate('+(LFWW/2)+',78)"><rect x="-86" y="-22" width="172" height="44" rx="10" fill="#14121c" stroke="#ffc857" stroke-width="1.4"/><text y="-3" text-anchor="middle" class="lflbl">MYSTERY FLOOR</text><text y="14" text-anchor="middle" class="lflbl2" fill="#ffc857">Something is coming</text></g>';
  return s;
}
function lfFacade(rows,hasLock,wxs){
  var H=LFROOF+rows*LFFP+LFSTREET,s='';
  s+='<defs><linearGradient id="lfbrick" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2638"/><stop offset="1" stop-color="#1a1724"/></linearGradient><pattern id="lfbp" width="26" height="12" patternUnits="userSpaceOnUse"><rect width="26" height="12" fill="none"/><path d="M0 .5H26M13 .5V6.5M0 6.5H26M0 6.5V12M26 6.5V12" stroke="rgba(255,255,255,.045)" fill="none"/></pattern></defs>';
  s+='<rect x="0" y="0" width="'+LFWW+'" height="'+H+'" fill="'+(LFW.wx==="rain"?"#3b4560":"#6c8fc2")+'" opacity="0"/>';
  var bt=LFROOF-20;
  /* city sky removed: rooms stand alone (the Sky Lounge draws its own view) */
  /* removed: tower frame / sign */
  /* removed: tower frame / sign */
  // roof parapet + props
  /* removed: tower frame / sign */
  // water tower
  /* removed: tower frame / sign */
  // antenna
  /* removed: tower frame / sign */
  // sign
  /* removed: tower frame / sign */
  return s;
}
function lfStreet(rows){return ""
}
/* world html */
function lfSlotPos(i,rows,F,lockF){
  var fl=Math.floor(i/2),col=i%2,rr=(F-1-fl)+(lockF?1:0);
  return {x:LFOX[col],y:LFROOF+118+rr*LFFP};
}
function lfRoomLabel(r,i){
  var DM=lfDimOf(r.t),LOFF=(DM[0]-DM[1])*13,LY=(DM[0]+DM[1])*13+30;
  var T=ROOMT[r.t],txt=T.coin?Math.round(coinRate(i))+"/h":T.food?(T.rate*roomMult(i)*openMult()).toFixed(1)+"/h":T.buff?"+"+(T.pct+addonsOf(r).reduce(function(s,a){return s+(a[3].xp||0)},0)+roomCrew(i).length)+"% XP":"";
  var nm=T.name,w=Math.max(80,(nm.length+(txt?txt.length+3:0))*7.4+22);
  return '<g transform="translate('+LOFF+','+LY+') scale('+(1/lfRsc(r.t))+')" class="lflabel"><rect x="'+(-w/2)+'" y="-12" width="'+w+'" height="24" rx="12" fill="#14121c" stroke="rgba(255,255,255,.2)"/><text y="4.5" text-anchor="middle" class="lflbl">'+esc(nm)+(txt?' <tspan fill="#9cff8a">'+esc(txt)+'</tspan>':'')+'</text></g>';
}
function lfSkyline(rows){
  var y0=LFROOF+rows*LFFP,gy=y0+20,L=lfLS(),night=L.dark>.25,o='',X0=-1100,X1=LFWW+1100,top=gy-760;
  o+='<defs><linearGradient id="lfsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+(night?"#0d1030":"#5f8fd0")+'"/><stop offset=".62" stop-color="'+(night?"#2a2352":"#a9c8ea")+'"/><stop offset="1" stop-color="'+(night?"#4a3563":"#f4dcc0")+'"/></linearGradient></defs>';
  o+='<rect x="'+X0+'" y="'+(top-1600)+'" width="'+(X1-X0)+'" height="'+(gy-top+1600)+'" fill="url(#lfsky)"/>';
  var far=night?"#1b1f44":"#8ea6c8",mid=night?"#141838":"#6f86ab",nr=night?"#0c0f26":"#4c5f84",win=night?"#ffd98a":"",seed=7;
  function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
  function win_(x,y,w,h,n){var t='';if(!night)return t;for(var q=0;q<n;q++){var wx=x+3+rnd()*(w-9),wy=y+6+rnd()*(h-14);t+='<rect x="'+wx.toFixed(1)+'" y="'+wy.toFixed(1)+'" width="3" height="4" fill="'+win+'" opacity="'+(.35+rnd()*.5).toFixed(2)+'"/>'}return t}
  /* hills */
  o+='<path d="M'+X0+' '+gy+' L'+X0+' '+(gy-150)+' Q-700 '+(gy-230)+' -400 '+(gy-140)+' T 100 '+(gy-120)+' T 700 '+(gy-130)+' T 1300 '+(gy-170)+' T 1800 '+(gy-120)+' T '+X1+' '+(gy-170)+' L'+X1+' '+gy+'Z" fill="'+far+'" opacity=".7"/>';
  /* far towers */
  var x=X0;while(x<X1){var w=26+rnd()*44,h=400+rnd()*420;o+='<rect x="'+x.toFixed(1)+'" y="'+(gy-h).toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+h.toFixed(1)+'" fill="'+far+'"/>';x+=w+2+rnd()*6}
  /* landmarks (mid layer) */
  function usb(cx){var w=62,h=780;return '<g fill="'+mid+'"><rect x="'+(cx-w/2)+'" y="'+(gy-h)+'" width="'+w+'" height="'+h+'"/><path d="M'+(cx-w/2)+' '+(gy-h)+' L'+(cx-w/2+8)+' '+(gy-h-18)+' L'+(cx+w/2-8)+' '+(gy-h-18)+' L'+(cx+w/2)+' '+(gy-h)+'Z"/><rect x="'+(cx-17)+'" y="'+(gy-h-34)+'" width="34" height="18"/><rect x="'+(cx-9)+'" y="'+(gy-h-50)+'" width="18" height="16"/></g>'+win_(cx-w/2,gy-h,w,h,26)}
  function wg(cx){var w=54,h=840;return '<g fill="'+mid+'"><path d="M'+(cx-w/2)+' '+gy+' V'+(gy-h+30)+' L'+cx+' '+(gy-h)+' L'+(cx+w/2)+' '+(gy-h+30)+' V'+gy+'Z"/><rect x="'+(cx-2)+'" y="'+(gy-h-70)+'" width="4" height="72"/></g>'+win_(cx-w/2,gy-h,w,h,22)}
  function gas(cx){return '<g transform="translate(0,'+gy+') scale(1,1.7) translate(0,'+(-gy)+')">'+gas_(cx)+'</g>'}
  function gas_(cx){var w=70,h=380,t='<g fill="'+mid+'">';for(var q=0;q<4;q++){var ww=w-q*13;t+='<rect x="'+(cx-ww/2)+'" y="'+(gy-h+q*0)+'" width="'+ww+'" height="'+h+'" opacity="0"/>'}t+='<rect x="'+(cx-w/2)+'" y="'+(gy-300)+'" width="'+w+'" height="300"/><rect x="'+(cx-w/2+8)+'" y="'+(gy-340)+'" width="'+(w-16)+'" height="42"/><rect x="'+(cx-w/2+16)+'" y="'+(gy-372)+'" width="'+(w-32)+'" height="34"/><path d="M'+(cx-w/2+24)+' '+(gy-372)+' L'+cx+' '+(gy-404)+' L'+(cx+w/2-24)+' '+(gy-372)+'Z"/></g>';return t+win_(cx-w/2,gy-300,w,300,18)}
  function aon(cx){var w=58,h=660;return '<g fill="'+mid+'"><rect x="'+(cx-w/2)+'" y="'+(gy-h)+'" width="'+w+'" height="'+h+'"/><rect x="'+(cx-w/2+6)+'" y="'+(gy-h-10)+'" width="'+(w-12)+'" height="12"/></g>'+win_(cx-w/2,gy-h,w,h,18)}
  function bon(cx){return '<g transform="translate(0,'+gy+') scale(1,1.7) translate(0,'+(-gy)+')">'+bon_(cx)+'</g>'}
  function bon_(cx){var t='<g fill="'+mid+'">';[[-30,300],[0,330],[30,300]].forEach(function(a){t+='<rect x="'+(cx+a[0]-13)+'" y="'+(gy-a[1])+'" width="26" height="'+a[1]+'" rx="6"/>'});return t+'<rect x="'+(cx-52)+'" y="'+(gy-60)+'" width="104" height="60"/></g>'}
  function cap(cx){return '<g transform="translate(0,'+gy+') scale(1,1.7) translate(0,'+(-gy)+')">'+cap_(cx)+'</g>'}
  function cap_(cx){return '<g fill="'+mid+'"><rect x="'+(cx-22)+'" y="'+(gy-130)+'" width="44" height="130"/><rect x="'+(cx-3)+'" y="'+(gy-170)+'" width="6" height="40"/></g>'}
  o+=aon(-470)+usb(-300)+gas(-90)+usb(190)+gas(520)+wg(880)+aon(1130)+cap(1290)+bon(1420)+wg(1580)+usb(1760)+aon(1890)+gas(2050);
  var x2=X0+30;while(x2<X1){var ww=34+rnd()*48,hh=330+rnd()*300;o+='<rect x="'+x2.toFixed(1)+'" y="'+(gy-hh).toFixed(1)+'" width="'+ww.toFixed(1)+'" height="'+hh.toFixed(1)+'" fill="'+mid+'"/>'+win_(x2,gy-hh,ww,hh,Math.round(hh/16));x2+=ww+4+rnd()*10}
  /* near strip + palms */
  o+='<rect x="'+X0+'" y="'+(gy-34)+'" width="'+(X1-X0)+'" height="40" fill="'+nr+'"/>';
  for(var px=X0+80;px<X1;px+=260+Math.floor(rnd()*140)){if(px>-60&&px<LFWW+60)continue;var ph=120+rnd()*50,lean=(rnd()-.5)*26;
    o+='<g fill="'+nr+'" stroke="'+nr+'"><path d="M'+px+' '+gy+' Q'+(px+lean*.4)+' '+(gy-ph*.55)+' '+(px+lean)+' '+(gy-ph)+'" fill="none" stroke-width="5" stroke-linecap="round"/>';
    for(var f=0;f<7;f++){var a=-Math.PI+f*(Math.PI/6),fx=px+lean+Math.cos(a)*46,fy=gy-ph+Math.sin(a)*22+10;o+='<path d="M'+(px+lean)+' '+(gy-ph)+' Q'+((px+lean+fx)/2)+' '+(gy-ph-22+Math.sin(a)*10)+' '+fx.toFixed(1)+' '+fy.toFixed(1)+'" fill="none" stroke-width="3.2" stroke-linecap="round"/>'}o+='</g>'}
  if(night){for(var st=0;st<70;st++)o+='<circle cx="'+(X0+rnd()*(X1-X0)).toFixed(0)+'" cy="'+(top-380+rnd()*420).toFixed(0)+'" r="'+(.6+rnd()*1.1).toFixed(1)+'" fill="#fff" opacity="'+(.3+rnd()*.5).toFixed(2)+'"/>'}
  o+='<rect x="'+X0+'" y="'+(gy+80)+'" width="'+(X1-X0)+'" height="1600" fill="'+(night?"#14152a":"#4a5068")+'"/>';
  return '<g class="lfskyl" pointer-events="none">'+o+'</g>'}
function lfWorld(){
  var F=floorsOpen(),B=S.base,lockF=0,rows=F+(lockF?1:0);
  var H=LFROOF+rows*LFFP+LFSTREET,s='';
  s+=lfSkyline(rows)+lfFacade(rows,!!lockF)+lfAtmos(0);
  if(lockF)s+='<g transform="translate(0,'+(LFROOF+118)+')">'+lfLockedRow(lockF)+'</g>';
  var order=[];for(var i=0;i<F*2;i++)order.push(i);
  // paint upper floors first so lower floors overlap correctly
  order.sort(function(a,b){return Math.floor(b/2)-Math.floor(a/2)||a-b});
  var meta={};
  order.forEach(function(i){
    var r=B.slots[i],p=lfSlotPos(i,rows,F,lockF);
    var DM=r?lfDimOf(r.t):[8,8],LOFF=(DM[0]-DM[1])*13;
    var RS=r?lfRsc(r.t):1;s+='<g class="lfroom" data-i="'+i+'" transform="'+(RS===1?'translate('+(p.x-LOFF)+','+p.y+')':'translate('+p.x+','+p.y+') scale('+RS+') translate('+(-LOFF)+',0)')+'">';
    if(!r){s+='<g data-lf="build:'+i+'">'+lfEmptySlot(i)+'</g>'}
    else{
      var C=lfRoomCtx(r,i);meta[i]={C:C,p:p,r:r};
      s+='<g data-lf="room:'+i+'">'+lfRoomSvg(r,i,C)+'<g class="lfag" id="lfag'+i+'"></g>'+(C.LT?C.LT.post:'')+'</g>';
      if(LFW.wx==="rain"&&C.T.out)s+='<g class="lfrain" clip-path="url(#lfclip)" transform="translate('+LOFF+',150)">'+lfRainG(300,260,i+4)+'</g>';
      s+=lfRoomLabel(r,i);
      var pend=Math.floor(r.pend||0);
      if(pend>=1&&(typeof payRoom!=="function"||payRoom()>=1))s+='<g class="lfbub" data-lf="collect:'+i+'" transform="translate('+LOFF+',-70) scale('+(1/RS)+')"><g class="lfbob"><circle r="19" fill="#14121c" stroke="#ffc857" stroke-width="2"/><circle cy="-4" r="7" fill="#ffc857"/><text y="14" text-anchor="middle" class="lflbl" fill="#fff">'+pend+'</text></g></g>';
    }
    s+='</g>';
  });
  s+=lfStreet(rows)+lfAtmos(LFROOF+rows*LFFP+6);
  s+='<g id="lfagS"></g><g id="lfwxo" pointer-events="none"></g>';
  window.LFMETA=meta;window.LFDIM={w:LFWW,h:H,rows:rows,F:F,lockF:lockF};
  return '<defs><clipPath id="lfclip"><rect x="-240" y="-140" width="480" height="362"/></clipPath><radialGradient id="lftvg"><stop offset="0" stop-color="#6aa8ff" stop-opacity=".5"/><stop offset="1" stop-color="#6aa8ff" stop-opacity="0"/></radialGradient></defs><g id="lfw">'+s+'</g>';
}
function lfPreview(r,uid){
  var C=lfRoomCtx(r,uid||90),dm=lfDimOf(r.t),LRX=C.annex&&C.annex.lr,ex=C.annex?(LRX?300:60):0,lx=C.annex?(LRX?700:150):0,vb=[-dm[1]*26-14-lx,-(LF.H+10)-ex,(dm[0]+dm[1])*26+28+lx,(dm[0]+dm[1])*13+LF.H+40+ex];
  LFPCS[uid||90]=C;
  return '<svg class="lfprev" viewBox="'+vb.join(" ")+'" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><filter id="prtBlur" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="5"/></filter><radialGradient id="lftvg"><stop offset="0" stop-color="#6aa8ff" stop-opacity=".5"/><stop offset="1" stop-color="#6aa8ff" stop-opacity="0"/></radialGradient></defs>'+lfRoomSvg(r,uid||90,C,{uid:uid||90})+(C.LT?C.LT.post:'')+'</svg>';
}

/* Zoom for the room preview in the upgrade screen: buttons, wheel, pinch and drag.
   Zoom survives the screen redrawing after a purchase, so the change stays in view. */
var LFPZ={};
/* Cal (playtest): "Is it possible to make them glow and flash for a second so we know what was just added?" The install effect
   (lfInstallFx) tags the pieces a purchase adds with .isonew; they now pulse gold twice, about 1.3 s, instead of one faint flash. */
(function(){var st=document.createElement("style");st.textContent="svg .isonew{animation:lfnewpulse 1.3s ease-in-out!important}"
 +"@keyframes lfnewpulse{0%{filter:none}18%{filter:brightness(1.75) drop-shadow(0 0 4px #ffe08a) drop-shadow(0 0 10px #ffc94d)}42%{filter:brightness(1.1) drop-shadow(0 0 2px #ffe08a)}66%{filter:brightness(1.75) drop-shadow(0 0 4px #ffe08a) drop-shadow(0 0 10px #ffc94d)}100%{filter:none}}"
 +".scrBase{animation:scrBaseHide .05s forwards}@keyframes scrBaseHide{to{opacity:0}}"/* a screen's still picture, shown only when animations are off */
 +"svg .isonew[filter],svg .isonew[clip-path]{animation:none!important}"/* the soft-shadow layer changes with every piece; it is not the new piece */
 +"@media (prefers-reduced-motion:reduce){svg .isonew:not([filter]):not([clip-path]){animation:none!important;outline:2px solid #ffd36b}}";(document.head||document.documentElement).appendChild(st)})();
function lfPrevAttach(wrap){var svg=wrap.querySelector("svg");if(!svg||svg.dataset.z)return;svg.dataset.z=1;wrap.classList.add("rbigz");
  /* Cal (playtest): "zooming in makes the game lag a lot. If there's no clean way to fix this, don't allow us to zoom in so the
     experience is seamless". Room windows no longer zoom: no + and - buttons, no wheel or pinch; the room always shows whole at its
     fitted size (a frame too short for it still drags up and down). */
  var base=svg.getAttribute("viewBox").split(" ").map(Number),key=base.join(" "),MAX=1;wrap.style.setProperty("aspect-ratio",base[2]+" / "+base[3],"important");wrap.style.setProperty("height","auto","important");
  /* widest zoom: the room reaches both sides of the frame. If the frame is too short for all of it, drag up and down. */
  var ar=Math.min(base[3]/base[2],(wrap.clientHeight/wrap.clientWidth)||base[3]/base[2]),v0=[base[0],base[1]+(base[3]-base[2]*ar)*.42,base[2],base[2]*ar],v=v0.slice();
  var clamp=function(){v[0]=Math.min(base[0]+base[2]-v[2],Math.max(base[0],v[0]));v[1]=Math.min(base[1]+base[3]-v[3],Math.max(base[1],v[1]))};
  /* LEAD (Cal, 2026-11-06: "zooming in on any room drastically reduces frame rate"; ROOMS OK'd). Setting the viewBox redraws the
     whole room at the zoomed size, 80 to 150 ms a step at CPU x4. While a finger moves, the drawn picture is moved and scaled as
     one layer (CSS transform from the last committed viewBox c to v), and the viewBox is committed once, 140 ms after the last
     move or when the fingers lift, so the picture ends sharp. Buttons and the wheel commit straight away. */
  var c=null,T=0;wrap.style.overflow="hidden";
  var commit=function(){clearTimeout(T);T=0;svg.style.transform="";svg.style.willChange="";svg.setAttribute("viewBox",v.map(function(n){return n.toFixed(2)}).join(" "));c=v.slice()};
  var show=function(live){clamp();LFPZ[key]=v.slice();if(!live||!c){commit();return}
    var k=(svg.clientWidth||wrap.clientWidth)/v[2];svg.style.transformOrigin="0 0";svg.style.willChange="transform";
    svg.style.transform="translate("+((c[0]-v[0])*k).toFixed(2)+"px,"+((c[1]-v[1])*k).toFixed(2)+"px) scale("+(c[2]/v[2]).toFixed(4)+")";clearTimeout(T);T=setTimeout(commit,140)};
  var zoom=function(f,fx,fy,live){var w=Math.min(base[2],Math.max(base[2]/MAX,v[2]/f)),h=w*ar;v[0]+=(v[2]-w)*fx;v[1]+=(v[3]-h)*fy;v[2]=w;v[3]=h;show(live)};
  var ctl=document.createElement("div");ctl.className="lfctl lfpzc";ctl.innerHTML="";wrap.appendChild(ctl);
  show();
  if(wrap.dataset.room!=null&&lfLightUseful()&&(bslot(+wrap.dataset.room)||{}).t==="bedroom"){var on=(bslot(+wrap.dataset.room)||{}).lit;ctl.insertAdjacentHTML("beforeend",'<button type="button" class="lflamp'+(on?" on":"")+'" data-act="lflight" data-i="'+wrap.dataset.room+'" aria-pressed="'+(on?"true":"false")+'" aria-label="Room light"><svg viewBox="0 0 24 24" width="20" height="20" fill="'+(on?"currentColor":"none")+'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg></button>')}
  if(!ctl.children.length)ctl.remove();/* only the Bedroom keeps a control there, its lamp */
  var at=function(e){var r=svg.getBoundingClientRect();return [(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};
  var P={},pinch=0,R=null;
  svg.addEventListener("pointerdown",function(e){if(T)commit();P[e.pointerId]=[e.clientX,e.clientY];try{svg.setPointerCapture(e.pointerId)}catch(_){}pinch=0;R=svg.getBoundingClientRect()});
  svg.addEventListener("pointermove",function(e){var o=P[e.pointerId];if(!o)return;var ids=Object.keys(P),r=R||svg.getBoundingClientRect();
    if(ids.length===2){P[e.pointerId]=[e.clientX,e.clientY];return}
    var dx=e.clientX-o[0],dy=e.clientY-o[1];P[e.pointerId]=[e.clientX,e.clientY];
    // Not zoomed in, a drag should scroll the screen as usual.
    if(v[2]>=base[2]-.01&&v[3]>=base[3]-.01){var sc=wrap.closest(".modal")||wrap.parentElement;if(sc)sc.scrollTop-=dy;return}
    v[0]-=dx*v[2]/r.width;v[1]-=dy*v[3]/r.height;show(true)});
  var up=function(e){delete P[e.pointerId];pinch=0;if(!Object.keys(P).length&&T)commit()};svg.addEventListener("pointerup",up);svg.addEventListener("pointercancel",up);
  show()}
(function(){var go=function(){var scan=function(){var w=document.querySelectorAll(".rbig");for(var i=0;i<w.length;i++)lfPrevAttach(w[i])};new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});scan()};if(document.body)go();else document.addEventListener("DOMContentLoaded",go)})();

/* agents, dogs, visitors, weather, drag world */
var LFV={x:0,y:0,s:1,init:0},LFA={},LFSC=.33,LFK=.825,LFBIG=1.45,LFRAF=0,LFLT=0,LFDEF=1,LFWXTRY=0,LFVISWIN=25*60000;
function lfHash(s){var h=7;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
function lfWeatherInit(){
  if(window.LFWXO){Object.assign(LFW,{wx:"sun",cloud:null,storm:0},window.LFWXO,{src:"live"});return}
  if(!LFW.t){var d=today(),r=lfHash("wx"+d)%100;LFW.wx=r<62?"sun":r<80?"cloud":r<90?"fog":"rain";LFW.src="sim"}
  if(LFWXTRY&&Date.now()-LFW.t<15*60000)return;LFWXTRY=1;LFW.t=Date.now();
  try{var ac=new AbortController();setTimeout(function(){ac.abort()},4000);
    fetch("https://api.open-meteo.com/v1/forecast?latitude=34.05&longitude=-118.24&current=weather_code,cloud_cover,temperature_2m&temperature_unit=fahrenheit&timezone=auto",{signal:ac.signal}).then(function(r){return r.json()}).then(function(j){
      var cur=j&&j.current,c=cur&&cur.weather_code;if(c==null)return;
      var w=c<=1?"sun":c<=3?"cloud":(c===45||c===48||(c>=71&&c<=77)||c===85||c===86)?"fog":"rain",cl=cur.cloud_cover!=null?cur.cloud_cover/100:null,st=c>=95?1:0;
      var ch=(w!==LFW.wx)||st!==LFW.storm||Math.abs((cl||0)-(LFW.cloud||0))>.2;
      LFW.src="live";LFW.cloud=cl;LFW.storm=st;LFW.temp=cur.temperature_2m;LFW.wx=w;
      if(ch&&view==="hideout"&&!document.querySelector("#layer .modal")&&!document.querySelector(".lfwrap.grab"))render();else{var el=document.getElementById("lfwxb");if(el)el.textContent=lfWxText()}
    }).catch(function(){})}catch(e){}
}
function lfWxText(){return lfLightLabel()}
var LFLK="";function lfRelight(){var k=lfLS().key;if(LFLK&&k!==LFLK&&view==="hideout"&&!document.querySelector("#layer .modal")&&!document.querySelector(".lfwrap.grab")){LFLK=k;render();return}LFLK=k;var el=document.getElementById("lfwxb");if(el)el.textContent=lfWxText()}
function lfAtmos(y0){return "";var L=lfLS();if(L.mul==="#ffffff")return"";var rows=(window.LFDIM&&LFDIM.rows)||6,y=y0||0,h=y?LFSTREET+500:LFROOF+rows*LFFP+LFSTREET+600;
  return '<rect x="-300" y="'+y+'" width="'+(LFWW+600)+'" height="'+h+'" fill="'+L.mul+'" pointer-events="none" style="mix-blend-mode:multiply"/>'}
function lfRand(a,b){return a+Math.random()*(b-a)}
function lfPick(a){return a[Math.floor(Math.random()*a.length)]}
var LFGUEST=[{skin:"#e9b892",hair:"#2a1d18",hair_s:"textured",tc:"#c9503e"},{skin:"#c68a5e",hair:"#1a1426",hair_s:"bob",tc:"#4a8ad9",f:1},{skin:"#f2c9a0",hair:"#8a5a3c",hair_s:"waves",tc:"#e8a33a",f:1},{skin:"#8d5a3b",hair:"#1a1426",hair_s:"buzz",tc:"#4fb58a"},{skin:"#e0b08a",hair:"#4a2a1a",hair_s:"sidepart",tc:"#8a5ad9"},{skin:"#d9a67c",hair:"#1a1416",hair_s:"long",tc:"#d94f8a",f:1}];
function lfGuestLook(){var g=lfPick(LFGUEST);return {sex:g.f?"f":"m",skin:g.skin,hair:g.hair,hair_s:g.hair_s,eyes:"#2a2030",top:{s:g.f?"tank":"tee",c:g.tc},bottom:{s:g.f?"skirt":"pants",c:lfPick(["#2a2a36","#3a4a6a","#e9e2d0"])},shoes:{s:"sneakers",c:"#eef1f6"}}}
/* Cal (playtest): "there are two of the same NPCs in the restaurant. Keep it unique but sparse ... Make it busy but tasteful".
   lfGuestN thins every business's customer count (one or two stay as they are, more are about halved, five at most), so the
   eight guest looks never have to repeat in a room. */
function lfGuestN(n){n=Math.max(0,n|0);return n<=2?n:Math.min(5,2+Math.round((n-2)*.5))}
/* ---- desired agents ---- */
var LFWANDER=240000;function lfHash(t){var h=7;for(var i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;return h}
function lfLoungeIdx(){var k=-1;S.base.slots.forEach(function(r,i){if(r&&r.t==="lounge"&&k<0)k=i});return k}
function lfCoachSplit(){
  var on=typeof coachesOn==="function"&&coachesOn(),o={gym:[],lounge:[]};if(!on)return o;
  var rk=coachRanked(),pin=S.wk&&S.wk.coach?coachById(S.wk.coach):null,hasGym=S.base.slots.some(function(r){return r&&r.t==="gym"});
  if(pin&&hasGym){o.gym.push(pin);rk=rk.filter(function(c){return c.id!==pin.id})}
  rk.forEach(function(c){if(hasGym&&o.gym.length<2)o.gym.push(c);else if(o.lounge.length<3)o.lounge.push(c)});
  return o;
}
function lfDesired(){if(window.LFNOCHAR){var o=[],me=0;S.base.slots.forEach(function(r,i){if(!r||!LFMETA[i])return;if(r.t==="bedroom"&&!me){me=1;o.push({id:"me",room:i,role:"me",look:lookOf()})}if(ROOMDEF[r.t])genPeople(r,i,LFMETA[i].C,o);if(LFMETA[i].C.dogs)LFMETA[i].C.dogs.forEach(function(d){o.push({id:"dog:"+d.id,room:i,role:"dog",dname:d.id,bed:d.bed})});if(r.t==="restaurant")rsPeople(r,i,LFMETA[i].C,o);if(r.t==="garden")gdPeople(r,i,LFMETA[i].C,o);if(r.t==="theater")thPeople(r,i,LFMETA[i].C,o);if(r.t==="auditorium")auPeople(r,i,LFMETA[i].C,o)});try{lfVisitors().forEach(function(v){if(v.room>=0)o.push(v)})}catch(e){}return o}
  var out=[],B=S.base,vw0=lfVisitors(),cs0=lfCoachSplit(),hasLg=lfLoungeIdx()>=0;
  B.slots.forEach(function(r,i){if(!r||!LFMETA[i])return;var C=LFMETA[i].C;
    if(r.t==="bedroom"){
      if(!hasLg||!vw0.length)out.push({id:"me",room:i,role:"me",look:lookOf()});
      if(C.dogs)C.dogs.forEach(function(d){out.push({id:"dog:"+d.id,room:i,role:"dog",dname:d.id,bed:d.bed})});
    }
    if(r.t==="lounge"){
      if(vw0.length)out.push({id:"me",room:i,role:"me",look:lookOf()});
      var cr=crewUnlocked().filter(function(k){return B.crew[k]==null}).slice(0,3);
      var outd=[];B.slots.forEach(function(rr,ri){if(rr&&/^(garden|farm|pond|sky)$/.test(rr.t)&&LFMETA[ri])outd.push(ri)});
      var slotN=Math.floor(Date.now()/LFWANDER);
      cr.forEach(function(k){var h=lfHash(k+slotN),to=(outd.length&&h%3===0)?outd[Math.floor(h/3)%outd.length]:i;
        out.push({id:"c:"+k+"@"+to,room:to,role:"crew",look:crewLook(CREW[k].a),idle:1,wand:1})});
      cs0.lounge.forEach(function(c,j){out.push({id:"k:"+c.id,room:i,role:"crew",look:c.L,idle:1,wand:1,ix:j})});
      if(C.dogs)C.dogs.forEach(function(d){out.push({id:"dog:"+d.id,room:i,role:"dog",dname:d.id,bed:d.bed})});
      vw0.forEach(function(v){v.room=i;out.push(v)});
      try{socVisitors().forEach(function(v){v.room=i;out.push(v)})}catch(e){}
    }
    if(r.t==="gym"){cs0.gym.forEach(function(c,j){out.push({id:"k:"+c.id,room:i,role:"crew",look:c.L,ix:2+j})})}
    roomCrew(i).forEach(function(k,j){out.push({id:"c:"+k,room:i,role:"crew",look:crewLook(CREW[k].a),ix:j})});
    var SD=SVC[r.t];if(SD){var seats=C.st.filter(function(s){return s.cust}).length,n=SD.guests?SD.guests(r,C,seats):Math.min(seats,2+Math.floor(addonsOf(r).length/2));n=Math.min(lfGuestN(n),seats);for(var g=0;g<n;g++)out.push({id:"g:"+i+":"+g,room:i,role:"guest",gi:g})}
  });
  return out;
}
/* LEAD (Cal, 2026-11-06, friends "hang out in our loft or other buildings for a day"; ROOMS OK'd): a friend stays the whole day
   in the room their visit names (S.visit.place) when you have it, else the Lounge, else the Bedroom; the day ending clears them */
function lfVisitRoom(place){var sl=S.base.slots,f=function(t){for(var i=0;i<sl.length;i++)if(sl[i]&&sl[i].t===t&&LFMETA[i])return i;return -1};
  /* QA: a room you own in another building is drawn there, not here too; the Lounge/Bedroom fallback is only for a place you don't own */
  var own=place&&sl.some(function(r){return r&&r.t===place});if(own)return f(place);
  var i=f("lounge");if(i<0)i=f("bedroom");return i}
function lfVisitors(){
  var v=S.visit;if(!v||v.d!==today()||!v.t)return [];
  var el=Date.now()-v.t,rm=lfVisitRoom(v.place);if(rm<0)return [];
  return v.who.map(function(w,k){
    if(w.indexOf("dog:")===0)return null; /* the dogs live here already (QA: a dog visit drew a second copy) */
    return FRIENDS[w]?{id:"v:"+w,room:rm,role:"visitor",look:FRIENDS[w].look,visitor:1,fresh:el<90000,leaveAt:0,k:k,idle:1,wand:1}:null;
  }).filter(Boolean);
}
var LFSYNCED=0;
function lfSync(){
  var want=lfDesired(),ids={};
  want.forEach(function(w){ids[w.id]=1;var a=LFA[w.id];
    if(a&&a.room!==w.room){delete LFA[w.id];a=null}
    if(!a){a=LFA[w.id]=Object.assign({wspawn:LFSYNCED,x:3,y:3,mode:"idle",t:0,ph:0,face:1,pose:0,alpha:1,fade:0,si:-1,tx:0,ty:0,sk:"",leaving:0},w);lfPlace(a)}
    else{Object.assign(a,{look:w.look||a.look,ix:w.ix,leaveAt:w.leaveAt});}
  });
  LFSYNCED=1;
  Object.keys(LFA).forEach(function(k){var a=LFA[k];if(ids[k]||a.leaving||a.pv||a.npc)return;
    if(a.wand&&a.alpha>0&&lfC(a)){a.leaving=1;a.mode="idle";a.t=0;return}
    delete LFA[k]});
}
function lfC(a){var m=LFMETA[a.room];return m&&m.C}
function lfPlace(a){
  var C=lfC(a);if(!C){return}
  if(a.visitor&&a.fresh&&C.door){a.x=C.door.x;a.y=C.door.y+.25;a.alpha=0;a.fade=1;a.mode="idle";a.t=.3;return}
  if(a.role==="dog"&&a.bed&&!a.visitor){a.x=a.bed[0];a.y=a.bed[1];a.mode="do";a.act="sleep";a.t=lfRand(8,30);a.sleep=1;return}
  if(a.role==="guest"){a.alpha=0;a.mode="idle";a.t=lfRand(.5,6)*(a.gi+1);a.look=lfGuestLook(a);return}
  if(a.wand&&a.wspawn){var dd=C.door;a.alpha=0;a.fade=1;a.mode="idle";a.t=.2;if(dd){a.x=dd.x;a.y=dd.y+.3;return}}
  var s=lfPick(C.st.filter(function(s){return s.kind==="wander"||s.kind==="look"}));
  if(s){var sp=lfFreeNear(C,s.x+lfRand(-.3,.3),s.y+lfRand(-.3,.3),2)}else{var sp=lfRandFree(C)}
  a.x=sp[0];a.y=sp[1];
  a.t=lfRand(.2,2.5);a.mode="idle";
}
/* ---- choosing what to do ---- */
function lfFree(C,a,pred){return C.st.map(function(s,i){return {s:s,i:i}}).filter(function(o){return (o.s.by==null||o.s.by===a.id)&&pred(o.s)})}
function lfRelease(C,a){if(C&&a.si>=0&&C.st[a.si]&&C.st[a.si].by===a.id)C.st[a.si].by=null;a.si=-1}
function lfSeatish(s){return !!s&&(s.cust||s.lift||s.onspot||s.kind==="dogbed"||s.kind==="door"||/^(sit|eat|read|type)$/.test(s.act||""))}
function lfGo(a,x,y,o){
  var C=lfC(a);
  if(C&&C.nav){
    var st=o&&typeof o==="object"?o:null;
    if((!lfSeatish(st)||(st&&st.kind==="door"))&&!lfZoneIn(C.nav,x,y)){var f=lfFreeNear(C,x,y,2.4);x=f[0];y=f[1]}
    var pre=a._exit;a._exit=null;if(pre&&!lfBlockedAt(C,pre[0],pre[1])){a.wp=lfRoute(C,pre[0],pre[1],x,y);a.wp.unshift([pre[0],pre[1]])}else a.wp=lfRoute(C,a.x,a.y,x,y);
    if(st&&st.exit&&lfSeatish(st)&&!lfBlockedAt(C,st.exit[0],st.exit[1])&&Math.hypot(a.x-x,a.y-y)>1.4){a.wp=lfRoute(C,a.x,a.y,st.exit[0],st.exit[1]);a.wp.push([x,y])}
  }else a.wp=[[x,y]];
  a.p0=[a.x,a.y];a.wtime=0;a.tx=a.wp[0][0];a.ty=a.wp[0][1];a.mode="walk";a.arr=o||null;a.speed=a.speed||1}
function lfDoorOf(C){return C.door||{x:Math.max(1,C.W-1.1),y:.75}}
function lfNext(a){
  var C=lfC(a);if(!C)return;lfRelease(C,a);a.carry=0;a.tag=null;a.act=null;a.emo=null;
  var r=LFMETA[a.room].r,R=a.role;
  if(R==="dog")return lfDogNext(a,C);
  if(R==="npc"){a.leaving=1;a.carry=0}
  if(R==="guest")return lfGuestNext(a,C,r);
  if(a.leaving){var d=lfDoorOf(C);lfGo(a,d.x,d.y+.3,"leave");a.speed=1.1;return}
  if(a.visitor&&a.leaveAt&&Date.now()>a.leaveAt){a.leaving=1;return lfNext(a)}
  if(R==="crew"&&lfSvcWork(a,C,r))return;
  var cand=lfFree(C,a,function(s){return !s.cust&&!s.plot&&s.kind!=="door"&&!(s.tag==="deck"&&(lfBlockedAt(C,8.75,.75)||lfBlockedAt(C,8.75,1.3)))&&(R==="me"||R==="visitor"||true)});
  // roles prefer their trade
  if(R==="crew"&&r.t!=="lounge"&&!a.wand){var jobs=cand.filter(function(o){return o.s.kind==="work"||o.s.kind==="play"||o.s.kind==="run"||o.s.kind==="fish"||o.s.kind==="water"||o.s.kind==="smell"||o.s.kind==="browse"});
    if(jobs.length&&Math.random()<.78)cand=jobs;
    if(r.t==="restaurant"||r.t==="bar"){var tr=cand.filter(function(o){return o.s.kind==="work"});if(a.ix===0&&tr.length)cand=tr}}
  if(R==="me"||R==="crew"&&(r.t==="lounge"||a.wand)||R==="visitor"){var cs=cand.filter(function(o){return o.s.kind!=="wander"&&o.s.kind!=="work"||C.has("l_desk")&&o.s.kind==="work"});if(cs.length&&Math.random()<.62)cand=cs}
  if(!cand.length){var rf=lfRandFree(C);lfGo(a,rf[0],rf[1],null);a.stretch=Math.random()<.3;return}
  // avoid repeating the last station
  var c2=cand.filter(function(o){return o.i!==a.last});if(c2.length)cand=c2;
  var o2=lfPick(cand);a.si=o2.i;o2.s.by=a.id;a.last=o2.i;a.speed=1;a.stretch=0;
  var s=o2.s,tx=s.x,ty=s.y;
  if(s.kind==="wander"||s.kind==="look"){a.stretch=Math.random()<.35}
  lfGo(a,tx,ty,s);
}
function lfDogNext(a,C){
  var r=Math.random(),bed=a.bed;
  if(a.visitor&&a.leaveAt&&Date.now()>a.leaveAt){a.leaving=1;var d=lfDoorOf(C);a.speed=1.6;lfGo(a,d.x,d.y+.3,"leave");return}
  var PR=C.patio&&C.patio.real;
  /* out on the Patio a dog mostly goes to its own Patio bed (QA: they lay on the deck instead), else sniffs around or
     comes back in */
  var onP=PR&&a.y<-.3;
  if(PR&&!a.visitor&&(onP?Math.random()<.8:Math.random()<.3)){var pb=PR.beds[a.dname==="chopstick"?1:0]||PR.beds[0];
    if(pb&&Math.random()<(onP?.7:.45)){a.speed=1.3;lfGo(a,pb[0],pb[1],{kind:"dogbed"});a.last="bed";return}
    var ps=lfPick(PR.spots.filter(function(q){return lfPaIn({pa:[],paR:PR},q[0],q[1])}));if(ps){a.last="run";a.speed=a.dname==="chopstick"?2.3:1.2;lfGo(a,ps[0]+lfRand(-.3,.3),ps[1]+lfRand(-.3,.3),{kind:"dogrun"});return}}
  if(!a.visitor&&bed&&(a.last==="run"||r<.28)){a.speed=1.3;lfGo(a,bed[0],bed[1],{kind:"dogbed"});a.last="bed";return}
  if(r<.45){a.last="sit";a.mode="do";a.act="sit";a.t=lfRand(3,8);return}
  if(r<.72){var pts=C.st.filter(function(s){return s.kind==="wander"});var s=lfPick(pts)||{x:3,y:3};a.last="run";a.speed=a.dname==="chopstick"?2.3:1.2;lfGo(a,s.x+lfRand(-.5,.5),s.y+lfRand(-.5,.5),{kind:"dogrun"});return}
  var me=LFA[a.pv?"pv:me":"me"];if(me&&me.room===a.room){a.last="near";a.speed=1.4;lfGo(a,me.x+lfRand(-.7,.7),me.y+lfRand(.3,.9),{kind:"dognear"});return}
  a.mode="do";a.act="stand";a.t=lfRand(1.5,3);
}
var LFEMO={admire:"★",smell:"♥",art:"★",stool:"♪",diner:"♥",tv:"♪",look:"?"};
var LFACT={type:[["type"],1],sit:[["sit"],1],chair:[["sit"],1],read:[["read"],1],eat:[["eat","sit","eat"],.9],work:[["work2","reach"],.55],up:[["up","down"],.9],look:[[null],1],water:[["water","reach"],.7],run:[["pose"],1],smell:[["lean"],1],fish:[["reach","lean"],1.6],carry:[["carry"],1],reach:[["reach"],1],wave:[["wave"],1],lie:[["lie"],1],dance:[["up","wave","down","wave","up","pose"],.42]};
function lfArrive(a,s){
  var C=lfC(a);a.mode="do";a.tag=s.tag||s.kind;
  var act=s.act||"look";if(s.seatless)act="look";
  a.act=act;a.t=lfRand(s.dur[0],s.dur[1]);a.at=0;
  if(s.fx)a.face=s.fx;
  a.sx=s.x;a.sy=s.y;a.st=s;
  if(a.stretch&&(s.kind==="wander"||s.kind==="look")){a.act="up";a.t=lfRand(1.6,2.6);a.emo="♪"}
  if(s.pick){a.carry=1}
  if(!a.emo&&Math.random()<.4)a.emo=LFEMO[a.tag]||null;
  if(a.emo){a.emot=2}
  if(a.role==="guest"&&s.cust)lfGuestSeated(a,s);
}
function lfDone(a){
  var s=a.st;if(a.job&&s&&s.svc)a.job.k++;
  a._exit=s&&s.exit?s.exit:null;a.st=null;lfNext(a);
}
/* ---- per-frame ---- */
function lfStep(a,dt){
  var C=lfC(a);if(!C)return;
  if(a.emot>0){a.emot-=dt;if(a.emot<=0)a.emo=null}
  if(a.fade){a.alpha=Math.max(0,Math.min(1,a.alpha+a.fade*dt*1.8));if(a.alpha>=1&&a.fade>0)a.fade=0;if(a.alpha<=0&&a.fade<0){a.fade=0;if(a.leaving){delete LFA[a.id];lfDrop(a.id);return}}}
  if(a.mode==="idle"){a.t-=dt;if(a.t<=0)lfNext(a);return}
  if(a.mode==="do"){a.t-=dt;a.at+=dt;if(a.t<=0)lfDone(a);return}
  if(a.mode==="walk"){
    var dx=a.tx-a.x,dy=a.ty-a.y,d=Math.sqrt(dx*dx+dy*dy),sp=(a.speed||1)*(a.role==="dog"?1.4:1.15)*(a.carry?.85:1);
    a.wtime=(a.wtime||0)+dt;
    var fin=!a.wp||a.wp.length<=1;
    if(d<.06||fin&&(d<.2||a.wtime>45)){a.x=a.tx;a.y=a.ty;
      if(a.wp&&a.wp.length>1){a.wp.shift();a.tx=a.wp[0][0];a.ty=a.wp[0][1];return}
      if(a.arr==="leave"){a.fade=-1;a.mode="idle";a.t=9;return}
      if(a.arr&&a.arr.kind){var s=a.arr;if(a.role==="dog"){a.mode="do";a.act=s.kind==="dogbed"?"sleep":s.kind==="dognear"?"sit":"stand";a.sleep=s.kind==="dogbed";a.t=a.sleep?lfRand(12,34):lfRand(2,5);a.at=0}else lfArrive(a,s)}
      else{a.mode="do";a.act="look";a.t=lfRand(1,3);a.at=0;if(a.stretch){a.act="up";a.emo="♪";a.emot=2;a.t=2}}
      return}
    var m=Math.min(d,sp*dt);
    if(a._rp>0)a._rp-=dt;
    if(a.role==="me"&&C.nav){var nx=a.x+dx/d*m,ny=a.y+dy/d*m;
      if((nx>.15&&ny>=.3&&ny<=C.D-.3||!C.nav.cl&&!C.nav.pa)&&lfBlockedAt(C,nx,ny)&&!lfBlockedAt(C,a.tx,a.ty)&&!lfBlockedAt(C,a.x,a.y)){
        var g=a.wp&&a.wp.length?a.wp[a.wp.length-1]:[a.tx,a.ty];
        if(!(a._rp>0)){a.wp=lfRoute(C,a.x,a.y,g[0],g[1]);a.tx=a.wp[0][0];a.ty=a.wp[0][1];a._rp=.5}
        else{a.mode="idle";a.t=.4;a.st=null;a.arr=null}
        return}}
    a.x+=dx/d*m;a.y+=dy/d*m;
    var sdx=dx-dy;if(Math.abs(sdx)>.01)a.face=sdx>0?1:-1;
    a.ph+=dt*4.6*(a.speed||1)*(a.role==="dog"?1.3:1);
    lfSep(a,dt,C);
  }
}
/* personal space: walkers get nudged off bodies that are close, never into furniture */
function lfSep(a,dt,C){
  var R=.62,keys=Object.keys(LFA);
  for(var i=0;i<keys.length;i++){var b=LFA[keys[i]];if(b===a||b.room!==a.room||b.alpha<.3)continue;
    if(a.role==="dog"!==(b.role==="dog")&&false)continue;
    var dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d>=R)continue;if(d<.001){dx=.01;dy=-.01;d=.014}
    var push=Math.min(R-d,.45*dt),nx=a.x+dx/d*push,ny=a.y+dy/d*push;
    if(!lfBlockedAt(C,nx,ny)||lfBlockedAt(C,a.x,a.y)){a.x=nx;a.y=ny}}
}
function lfAnimF(a){ // returns {pose,act,key}
  if(a.role==="dog"){
    if(a.mode==="walk")return {p:Math.floor(a.ph)%4};
    if(a.mode==="do")return {p:a.act==="sleep"?"sleep":a.act==="sit"?"sit":0};
    return {p:0};
  }
  if(a.mode==="walk")return {p:Math.floor(a.ph)%4,act:a.carry?"carry":null};
  if(a.mode==="do"){
    var f=LFACT[a.act]||LFACT.look,seq=f[0];
    if(seq[0]==="pose"){a.ph+=.2;return {p:Math.floor(a.ph)%4}}
    var k=seq.length>1?Math.floor(a.at/f[1])%seq.length:0;
    return {act:seq[k]||null}
  }
  return {};
}
function lfAgentG(a){
  var g='<g class="lfa" id="lfa-'+a.id.replace(/[^a-z0-9_-]/gi,"_")+'" style="pointer-events:none"><ellipse rx="'+((a.role==="dog"?14:12*LFBIG)*LFK).toFixed(1)+'" ry="'+(5*LFK*(a.role==="dog"?1:LFBIG)).toFixed(1)+'" fill="rgba(0,0,0,.28)"/><g class="lfs"><image class="lfi" width="'+PixAv.W*LFSC+'" height="'+PixAv.H*LFSC+'" x="'+(-PixAv.W*LFSC/2)+'" y="'+(-170*LFSC)+'"/></g><g class="lfp"></g><g class="lfe" transform="scale('+LFK+')"></g></g>';
  return g;
}
function lfDrop(id){var e=document.getElementById("lfa-"+id.replace(/[^a-z0-9_-]/gi,"_"));if(e)e.remove()}
function lfDogURL(n,p){var k="dog2|"+n+"|"+p;if(PXC[k])return PXC[k];
  var g=PixAv.dog2(n,p),o=[],h=Math.ceil(36*PixAv.K*1.0);
  for(var y=0;y<h&&y<g.length;y++){var x=0,row=g[y];while(x<row.length){var c=row[x];if(!c){x++;continue}var x1=x;while(x1+1<row.length&&row[x1+1]===c)x1++;o.push('<rect x="'+x+'" y="'+y+'" width="'+(x1-x+1)+'" height="1" fill="'+c+'"/>');x=x1+1}}
  var u="data:image/svg+xml;charset=utf-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+Math.ceil(46*PixAv.K)+'" height="'+h+'" viewBox="0 0 '+Math.ceil(46*PixAv.K)+' '+h+'" shape-rendering="crispEdges">'+o.join("")+'</svg>');
  PXC[k]=u;return u}
/* held props, drawn in feet-origin px, facing right (flipped by group) */
function lfProp(a){
  var t=a.tag,at=a.at||0,w=Math.sin(at*6),s="";
  if(a.carry||t==="serve"&&a.mode==="do"){var it=a.job&&a.job.s?(a.job.plot?"crate":a.job.s.item||""):a.npc?"box":"";var cp=lfCarryProp(it,a);if(cp)return cp;return '<g transform="translate(11,-40)"><rect x="-9" y="3" width="18" height="2.4" rx="1" fill="#c9ced8" stroke="rgba(0,0,0,.4)" stroke-width=".6"/><ellipse cx="0" cy="1.6" rx="5.6" ry="2.2" fill="#fff" stroke="rgba(0,0,0,.35)" stroke-width=".5"/><ellipse cx="0" cy=".8" rx="3.4" ry="1.4" fill="#ff8a5c"/></g>';}
  if(a.mode!=="do")return "";
  if(t==="pour"||t==="mix"){var r=t==="mix"?w*8:0;return '<g transform="translate(12,-34) rotate('+(t==="pour"?-50:r)+')"><rect x="-3" y="-8" width="6" height="14" rx="2" fill="'+(t==="mix"?"#c9ced8":"#6cff9a")+'" stroke="rgba(0,0,0,.4)" stroke-width=".6"/><rect x="-1.4" y="-12" width="2.8" height="5" fill="#8a8f9c"/></g>'+(t==="pour"?'<path d="M14 -30 q4 4 3 14" stroke="rgba(255,190,110,.9)" stroke-width="1.6" fill="none"/><rect x="14" y="-16" width="6" height="8" rx="1" fill="rgba(255,255,255,.35)" stroke="rgba(0,0,0,.3)" stroke-width=".5"/>':'')}
  if(t==="cook"||t==="oven")return '<g transform="translate(14,-27)"><ellipse rx="7" ry="2.4" fill="#2a2a32" stroke="rgba(0,0,0,.5)" stroke-width=".6"/><rect x="5" y="-1" width="9" height="2" fill="#2a2a32"/></g><g class="lfsteam" fill="rgba(255,255,255,.5)"><circle cx="12" cy="-36" r="2.2"/><circle cx="17" cy="-42" r="1.8"/></g>';
  if(t==="prep")return '<rect x="8" y="-26" width="16" height="3" rx="1" fill="#c9a06a" stroke="rgba(0,0,0,.4)" stroke-width=".5"/><path d="M12 '+(-34+w*3)+' l8 6" stroke="#dfe6ee" stroke-width="1.8"/>';
  if(t==="wipe")return '<path d="M8 '+(-24+w*2)+' h16" stroke="rgba(255,255,255,.7)" stroke-width="5" stroke-linecap="round"/>';
  if(t==="water")return '<g transform="translate(12,-30) rotate(-18)"><rect x="-6" y="-4" width="12" height="9" rx="2" fill="#6cb6ff" stroke="rgba(0,0,0,.4)" stroke-width=".6"/><path d="M6 -1 l9 -4" stroke="#6cb6ff" stroke-width="2.2"/></g><g fill="rgba(160,215,255,.9)"><circle cx="28" cy="-30" r="1.3" class="lfdrop2"/><circle cx="31" cy="-24" r="1.3" class="lfdrop2" style="animation-delay:-.3s"/><circle cx="26" cy="-22" r="1.3" class="lfdrop2" style="animation-delay:-.6s"/></g>';
  if(t==="hoe")return '<path d="M12 -34 L26 -4" stroke="#8a5a30" stroke-width="2.4" stroke-linecap="round"/><path d="M24 -6 l8 2" stroke="#9aa3b5" stroke-width="3"/>';
  if(t==="weed")return '<path d="M20 -2 q-2 -8 0 -12 M23 -2 q1 -8 4 -10 M17 -2 q-4 -6 -6 -8" stroke="#3fae5a" stroke-width="2" fill="none"/>';
  if(t==="feed")return '<g transform="translate(12,-24)"><path d="M-6 -5 h12 l-2 11 h-8z" fill="#c9a06a" stroke="rgba(0,0,0,.4)" stroke-width=".6"/></g><g fill="#f0d878"><circle cx="22" cy="-18" r="1.2"/><circle cx="26" cy="-10" r="1.2"/><circle cx="19" cy="-8" r="1.2"/></g>';
  if(t==="smell")return '<g transform="translate(10,-42)"><path d="M0 0 v8" stroke="#3fae5a" stroke-width="1.6"/><circle r="3.6" fill="#ff8ab8"/><circle r="1.4" fill="#ffe27a"/></g>';
  if(t==="fish")return '<path d="M12 -32 L32 -64" stroke="#8a5a30" stroke-width="1.6"/><path d="M32 -64 L38 -8" stroke="rgba(255,255,255,.7)" stroke-width=".7" fill="none"/><circle cx="38" cy="'+(-8+Math.sin(at*2)*1.5)+'" r="2.2" fill="#ff5a4a"/>';
  if(t==="read")return '<g transform="translate(9,-30)"><path d="M0 0 L-8 -3 V9 L0 12 L8 9 V-3Z" fill="#fff" stroke="rgba(0,0,0,.45)" stroke-width=".7"/><path d="M0 0 V12" stroke="rgba(0,0,0,.3)"/></g>';
  if(t==="lift"||t==="squat")return '<g transform="translate(0,'+(a.act==="up"&&Math.floor(at/.9)%2===0?-84:-70)+')"><rect x="-16" y="-1.4" width="32" height="2.8" fill="#9aa3b5"/><rect x="-19" y="-6" width="4" height="12" fill="#2a2a32"/><rect x="15" y="-6" width="4" height="12" fill="#2a2a32"/></g>';
  if(t==="train")return '<g transform="translate(12,-26)"><rect x="-5" y="-1.2" width="10" height="2.4" fill="#9aa3b5"/><rect x="-7" y="-4" width="3" height="8" fill="#2a2a32"/><rect x="4" y="-4" width="3" height="8" fill="#2a2a32"/></g>';
  if(t==="punch"||t==="hit")return Math.floor(at*4)%2?'<g fill="#fff" opacity=".85"><path d="M26 -34 l6 -4 M28 -28 l8 0 M26 -22 l6 4" stroke="#fff" stroke-width="1.6"/></g>':'';
  if(a.act==="eat"&&a.st&&a.st.cust&&a.st.tag!=="diner")return '<g transform="translate(12,-36)"><rect x="-2" y="-4" width="4.4" height="8" rx="1" fill="rgba(210,240,255,.85)" stroke="rgba(0,0,0,.35)" stroke-width=".5"/><rect x="-1.6" y="0" width="3.6" height="3.4" fill="#ff9d5c" opacity=".8"/></g>';
  if(t==="eat"||a.act==="eat")return '<g class="lfsteam" fill="rgba(255,255,255,.45)"><circle cx="14" cy="-34" r="2"/><circle cx="17" cy="-40" r="1.6"/></g>';
  return "";
}
function lfEmoG(a){if(!a.emo)return "";var n=a.emo.length,w=Math.max(18,n*5.6+10),fs=n>2?8.5:11;
  return '<g transform="translate(0,-82)"><rect x="'+(-w/2)+'" y="-9" width="'+w+'" height="16" rx="6" fill="rgba(255,255,255,.95)" stroke="rgba(0,0,0,.3)" stroke-width=".8"/><path d="M-2 7 l2 4 l2 -4z" fill="rgba(255,255,255,.95)"/><text y="'+(n>2?3.4:4)+'" text-anchor="middle" font-size="'+fs+'" font-weight="700" fill="'+(a.emo==="♥"?"#e8486a":"#4a5a8a")+'">'+a.emo+'</text></g>'}
function lfDraw(a,force){
  var C=lfC(a);if(!C)return;
  var id="lfa-"+a.id.replace(/[^a-z0-9_-]/gi,"_"),g=document.getElementById(id),items=document.querySelector('.lfitems[data-i="'+a.room+'"]');
  if(!items)return;
  if(!g){var tmp=document.createElementNS("http://www.w3.org/2000/svg","g");tmp.innerHTML=lfAgentG(a);g=tmp.firstChild;g.id=id;items.appendChild(g)}
  var sv=items.closest("svg")||document,inLr=a.role==="me"&&C.nav&&C.nav.cl&&C.nav.cl.lr&&a.x<-.02?sv.querySelector("[id^=lfllg]"):null,
    inCl=a.role==="me"&&C.nav&&C.nav.cl&&!inLr&&a.y>C.D+.02&&a.x>=-.02?sv.querySelector("[id^=lfclg]"):null;
  if(a.role==="me"&&C.nav&&C.nav.cl&&window.LFCL){var ce=sv.querySelector("[id^=lfscl][id$=e]");if(ce){var pp=lfP(a.x,a.y,0),hid=0;
      if(!inCl){var K=LFCL,D2=C.D,bx=pp[0],by=pp[1]-28,qs=[[lfP(0,D2,0),lfP(0,D2+K.CD,0),lfP(0,D2+K.CD,K.H),lfP(0,D2,K.H)],[lfP(0,D2,0),lfP(K.CW,D2,0),lfP(K.CW,D2,K.H),lfP(0,D2,K.H)]];
        for(var qi=0;qi<2&&!hid;qi++){var q=qs[qi],ins=false;for(var u=0,w2=3;u<4;w2=u++){if((q[u][1]>by)!==(q[w2][1]>by)&&bx<(q[w2][0]-q[u][0])*(by-q[u][1])/(q[w2][1]-q[u][1])+q[u][0])ins=!ins}if(ins)hid=1}}
      ce.setAttribute("cx",pp[0].toFixed(1));ce.setAttribute("cy",(pp[1]-28).toFixed(1));ce.setAttribute("rx",hid?"34":"0");ce.setAttribute("ry",hid?"46":"0")}}
  var inPa=(a.role==="me"||a.role==="dog")&&C.nav&&C.nav.pa&&a.y<-.02?sv.querySelector("[id^=lfpcg]"):null;
  if((a.role==="me"||a.role==="dog")&&C.nav&&C.nav.pa){var dr=sv.querySelector("[id^=lfpdr]");if(dr){var nw=Date.now();if((a.y<.95&&a.x>7.7&&a.x<9.9&&a.y>-1.6))dr._ou=nw+700;var op=nw<(dr._ou||0),tf=op?"translate(-28.6px,-14.3px)":"translate(-14.3px,-7.15px)";if(dr._tf!==tf){dr._tf=tf;dr.style.transform=tf}}}
  if(inPa){if(g.parentNode!==inPa)inPa.appendChild(g)}else if(inLr){if(g.parentNode!==inLr)inLr.appendChild(g)}else if(inCl){if(g.parentNode!==inCl)inCl.appendChild(g)}else if(g.parentNode!==items){items.appendChild(g);a._in=0}
  if(a.role==="me"&&inLr){var ho=sv.querySelector("[id^=lfllho]"),hu=sv.querySelector("[id^=lfllhu]");if(ho){var bh=(a.x+a.y)<-3.8&&a.x<-9.5&&a.x>-17.5;ho.style.display=bh?"":"none";if(hu)hu.style.display=bh?"none":""}}
  if(a.mode==="walk"){var sdy=(a.tx-a.x)+(a.ty-a.y);if(Math.abs(sdy)>.02)a.back=sdy<0}
  if(a.role==="me"&&window.lfChairTick)lfChairTick(a);
  var p=lfP(a.x,a.y,0),f=lfAnimF(a),cpi=(typeof chPose==="function"&&CHB.ready&&a.role!=="dog"&&!(a.look&&a.look.npc))?chPose(a,f):-1;if(cpi>=0&&a.mode==="do"&&a.act==="lie")cpi=0;var k=a.role+"|"+f.p+"|"+f.act+"|"+cpi+(CHB.ready?"c":"")+((a.role==="me"||(a.look&&a.look.npc))?lfRigKey(a):"");
  var seat=(a.role!=="dog"&&a.mode==="do"&&(a.st&&a.st.cust?a.st.lift&&a.act!=="lie":(a.act==="sit"||a.act==="read"||a.act==="eat"||a.act==="type")))?(a.st&&a.st.sz!=null?a.st.sz:20)*LFBIG:0;
  var dkey=a.x+a.y+(a.mode==="do"&&a.st&&a.st.dk?a.st.dk:0)+.001;
  var gx=a.role==="dog"?1:1;
  var plz=0,C2=lfC(a);if(C2&&C2.plat){for(var q=0;q<C2.plat.length;q++){var P=C2.plat[q];if(a.x>=P.x0&&a.x<=P.x1&&a.y>=P.y0&&a.y<=P.y1){plz=P.z;dkey=Math.max(dkey,P.key+.25);break}}}
  var lift=seat*LFK-plz;
  var gtf="translate("+p[0].toFixed(1)+","+p[1].toFixed(1)+")";if(g._tf!==gtf){g._tf=gtf;g.setAttribute("transform",gtf)}
  if(g._op!==a.alpha){g._op=a.alpha;g.style.opacity=a.alpha}
  if(a._k!==k||force){a._k=k;var img=g.querySelector(".lfi");
    var cdg=a.role==="dog"&&typeof chDog==="function"?chDog(a.dname,f.p):null;
    if(cdg){var DK=.19;img.setAttribute("href",cdg.u);img.setAttribute("width",(cdg.w*DK).toFixed(1));img.setAttribute("height",(cdg.h*DK).toFixed(1));img.setAttribute("x",(-cdg.ax*DK).toFixed(1));img.setAttribute("y",(-cdg.ay*DK).toFixed(1));a._chb=1}
    else if(a.role==="dog"){img.setAttribute("href",lfDogURL(a.dname,f.p));var dw=Math.ceil(46*PixAv.K)*LFSC*1.12;img.setAttribute("width",dw);img.setAttribute("height",Math.ceil(36*PixAv.K)*LFSC*1.12);img.setAttribute("x",-dw*.5);img.setAttribute("y",-Math.ceil(33*PixAv.K)*LFSC*1.12)}
    else{if(img._bd==null){img._bd=1;img.style.animationDelay=(-Math.random()*3).toFixed(2)+"s"}img.classList.toggle("lfidle",a.mode!=="walk");var cf=cpi>=0?chFrame(a.look,cpi):null;
      if((a.role==="me"||(a.look&&a.look.npc))&&lfCalImg(a,f,img)){a._chb=0}else if(cf){var KK=CHB.K*LFBIG;img.setAttribute("href",cf.u);img.setAttribute("width",(cf.w*KK).toFixed(1));img.setAttribute("height",(cf.h*KK).toFixed(1));img.setAttribute("x",(-cf.ax*KK).toFixed(1));img.setAttribute("y",(-cf.ay*KK).toFixed(1));a._chb=1}
      else{var L=Object.assign({},a.look);if(f.p!=null)L.pose=f.p;if(f.act)L.act=f.act;if(L.act==="lie")L.act=null;if(L.act==="pose"){L.act=null;L.pose=1}img.setAttribute("href",pxURL(L));if(a._chb){a._chb=0;img.setAttribute("width",PixAv.W*LFSC);img.setAttribute("height",PixAv.H*LFSC);img.setAttribute("x",-PixAv.W*LFSC/2);img.setAttribute("y",-170*LFSC)}}}}
  if(a.role==="me"&&window.lfCalShadow)lfCalShadow(a,g,C);
  var s=g.querySelector(".lfs"),fl=(a.face*LFDEF)<0?-1:1;if(a._chb){fl*=CHB.FLIP;if(cpi===2)fl=-fl}var stp=a.ph%1,bob=a._chb&&a.mode==="walk"?-Math.sin(stp*Math.PI)*3.6*LFBIG/1.2:0,sway=a._chb&&a.mode==="walk"?(Math.floor(a.ph)%2?1:-1)*Math.sin(stp*Math.PI)*3.4:0;
  var lie=a.mode==="do"&&a.act==="lie"&&a.role!=="dog",lz=a.st&&a.st.lz!=null?a.st.lz:14;
  var stf=lie?"translate("+(22*fl)+","+(-lz)+") rotate("+(-63.4*fl)+") scale("+fl+",1)":"translate(0,"+(lift+bob).toFixed(1)+") rotate("+sway.toFixed(1)+") scale("+fl+",1)";if(s._tf!==stf){s._tf=stf;s.setAttribute("transform",stf)}
  var pr=g.querySelector(".lfp"),ptf="translate(0,"+lift+") scale("+((a.face>0?1:-1)*LFK*(a.role==="dog"?1:LFBIG))+","+LFK*(a.role==="dog"?1:LFBIG)+")";if(pr._tf!==ptf){pr._tf=ptf;pr.setAttribute("transform",ptf)}
  var ftf="translate(0,"+(-plz)+")";if(g.firstChild._tf!==ftf){g.firstChild._tf=ftf;g.firstChild.setAttribute("transform",ftf)}
  var ph=a.role==="dog"?"":lfProp(a);if(a._ph!==ph){a._ph=ph;pr.innerHTML=ph}
  var em=g.querySelector(".lfe"),eh=lfEmoG(a);if(a._em!==eh){a._em=eh;em.innerHTML=eh}
  var EK=LFK*(a.role==="dog"?1:LFBIG),etf=lie?"translate(0,"+(-lz+30*LFK)+") scale("+EK+")":"translate(0,"+(lift-plz*0)+") scale("+EK+")";if(a._etf!==etf){a._etf=etf;em.setAttribute("transform",etf)}
  // depth: reinsert before first item with a larger key
  if(!inCl&&!inLr&&(Math.abs((a._dk||-9)-dkey)>.02||!a._in)){a._dk=dkey;a._in=1;var cs=items.children,ref=null,start=0,i,c;
    /* Clearly in front of an item (past its near edge, not behind its other edge) means drawn after it, whatever other pieces sort around it. */
    if(!(a.st&&a.st.dk))for(i=0;i<cs.length;i++){c=cs[i];if(c===g)continue;var fb=c.getAttribute("data-b");if(fb){var fq=fb.split(",");if((a.x>=+fq[2]-.02&&a.y>=+fq[1]-.02)||(a.y>=+fq[3]-.02&&a.x>=+fq[0]-.02))start=i+1}}
    for(i=start;i<cs.length;i++){c=cs[i];if(c===g)continue;var kk=c.getAttribute("data-k");var ck=kk!=null?+kk:(c._dk!=null?c._dk:null);
      var bb=!(a.st&&a.st.dk)?c.getAttribute("data-b"):null;
      if(bb){var q=bb.split(",");var fr=a.x>=+q[2]-.02||a.y>=+q[3]-.02,bk2=a.x<=+q[0]+.02||a.y<=+q[1]+.02;if(fr){continue}if(bk2){ref=c;break}}
      if(ck!=null&&ck>dkey){ref=c;break}}
    g._dk=dkey;if(ref){if(g.nextSibling!==ref)items.insertBefore(g,ref)}else items.appendChild(g)}
}
function lfLoop(ts){
  LFRAF=0;
  if(!document.getElementById("lfwrap")||document.hidden){return}
  var dt=Math.min(.1,(ts-LFLT)/1000||0);
  /* The whole building redraws at 15 frames a second, a single room at 26 (15 on a phone): every new frame of every person means an
     image decode and a repaint of the room behind them, and that is what made the building view lag on a phone. */
  if(ts-LFLT<(document.querySelector("#layer .modal")&&innerWidth>640?38:66)){LFRAF=requestAnimationFrame(lfLoop);return}
  LFLT=ts;
  if(ts-LFOBT>700){LFOBT=ts;try{lfObUpdate()}catch(e){}}
  try{lfAmbient(ts)}catch(e){}try{lfClockTick(ts)}catch(e){}
  Object.keys(LFMETA).forEach(function(k){var m=LFMETA[k];if(m&&m.C&&m.r)try{lfPlotTick(m.C,m.r,dt)}catch(e){}});
  var mdl=!!document.querySelector("#layer .modal"),vis=lfVisRooms();
  /* Everyone keeps living, but only people in a room on screen are drawn: a phone could not redraw 21 rooms of people. */
  Object.keys(LFA).forEach(function(k){var a=LFA[k];if(mdl&&!a.pv)return;if(LFA[k]===a){lfStep(a,dt);if(LFA[k]!==a)return;
    if(!a.pv&&vis&&!vis[a.room]){a._off=1;return}if(a._off){a._off=0;lfDraw(a,true)}else lfDraw(a)}});
  LFRAF=requestAnimationFrame(lfLoop);
}
/* Rooms of the building view that are on screen, by slot, with a margin. Off-screen rooms are hidden so the phone does
   not paint them, and their people are not drawn. null when there is no building view. */
var LFVIS=null,LFVISK="";
function lfVisRooms(){var c=document.getElementById("lfwrap"),L=window.LFLAY;if(!c||!L||!window.LFMETA)return null;
  var cw=c.clientWidth,ch=c.clientHeight,k=[LFV.x,LFV.y,LFV.s,cw,ch].map(function(v){return Math.round(v)}).join(",")+":"+LFV.s.toFixed(3);if(k===LFVISK&&LFVIS)return LFVIS;
  var vis={},m=80;Object.keys(LFMETA).forEach(function(i){var M=LFMETA[i];if(!M||!M.r||!M.p||+i>=90)return;var x0=LFV.x+(M.p.x-LFCELLW/2)*LFV.s,y0=LFV.y+(M.p.y-LFFP/2)*LFV.s,x1=x0+LFCELLW*LFV.s,y1=y0+LFFP*LFV.s;
    vis[i]=x1>-m&&x0<cw+m&&y1>-m&&y0<ch+m});
  document.querySelectorAll("#lfw > g.lfroom[data-i]").forEach(function(g){var on=vis[g.getAttribute("data-i")]!==false;if(g._vis!==on){g._vis=on;g.style.display=on?"":"none"}});
  LFVISK=k;LFVIS=vis;return vis}
/* ---- drag / zoom ---- */
/* Dragging and pinching call this on every pointer move; the transform is applied at most once a frame (lag, LEAD's
   request). The first call in a frame schedules it, later ones in the same frame only update LFV. */
var LFAPR=0;function lfApply(){if(LFAPR)return;LFAPR=requestAnimationFrame(function(){LFAPR=0;lfApplyNow()})}
function lfApplyNow(){var w=document.getElementById("lfw");if(w)w.setAttribute("transform","translate("+LFV.x.toFixed(1)+","+LFV.y.toFixed(1)+") scale("+LFV.s.toFixed(3)+")");var c=document.getElementById("lfwrap");if(c){if(LFV.s0&&LFV.s>=LFV.s0*1.18)c.setAttribute("data-zin","1");else c.removeAttribute("data-zin")}}
function lfClamp(){var c=document.getElementById("lfwrap");if(!c)return;var cw=c.clientWidth,ch=c.clientHeight,W=LFWW*LFV.s,H=LFDIM.h*LFV.s,m=90;
  LFV.x=Math.min(m,Math.max(cw-W-m,LFV.x));if(W+2*m<cw)LFV.x=(cw-W)/2;
  /* LEAD (QA and ROOMS: "the building view below the street is empty grey" on phones; ROOMS OK'd): zoomed out on a tall screen the
     limit on sky above the world won over the limit below it, lifting the street to mid-screen over the grey ground. Now the street's
     bottom never rises above the visible bottom (the top of the nav bar, which covers the view), and spare height goes to the sky. */
  var nb=lfNavCover(c),lo=ch-nb-H,hi=m+640*LFV.s;LFV.y=lo>=hi?lo:Math.min(hi,Math.max(lo,LFV.y))}
var LFNAVC={t:0,v:0};
function lfNavCover(c){var t=Date.now();if(t-LFNAVC.t<1500)return LFNAVC.v;LFNAVC.t=t;var n=document.querySelector(".nav");
  LFNAVC.v=n?Math.max(0,Math.round(c.getBoundingClientRect().bottom-n.getBoundingClientRect().top)):0;return LFNAVC.v}
/* Cal (playtest): zooming in lagged. The street and building views keep their controls but stop at 1.6x (was 2.6x) */
var LFZMAX=1.6;
function lfZoomAt(f,cx,cy){var n=Math.min(LFZMAX,Math.max(lfMinS(),LFV.s*f));f=n/LFV.s;LFV.x=cx-(cx-LFV.x)*f;LFV.y=cy-(cy-LFV.y)*f;LFV.s=n;lfClamp();lfApply()}
window.__qbLoft=function(){return {fx:typeof LFFX!=="undefined"?LFFX:null,defs:typeof ROOMDEF!=="undefined"?ROOMDEF:null,A:LFA,V:LFV,apply:lfApply,clamp:lfClamp,go:lfGo,C:lfC,P:lfP,arrive:lfArrive,draw:lfDraw,route:lfRoute,seatish:lfSeatish,blocked:lfBlockedAt,rerender:render,roomCtx:lfRoomCtx,roomSvg:lfRoomSvg,addons:ADDONS,roomT:ROOMT}};
/* Zoomed all the way out, the whole street fits the width of the screen. */
function lfMinS(){var c=document.getElementById("lfwrap"),cw=(c&&c.clientWidth)||360;return Math.min(.32,cw/((window.LFWW||2400)+120))}
function lfZoom(d){var c=document.getElementById("lfwrap");if(!c)return;if(d===0){LFV.init=0;lfInitView(c);return}lfZoomAt(d>0?1.25:.8,c.clientWidth/2,c.clientHeight/2)}
function lfInitView(c){
  var cw=c.clientWidth||360,ch=c.clientHeight||520;
  LFV.s=Math.min(1.5,Math.max(.5,cw/600));
  var rows=LFDIM.rows,gy=LFROOF+118+(rows-1)*LFFP+20;
  LFV.s0=LFV.s;LFV.x=cw/2-LFOX[0]*LFV.s;LFV.y=ch*.5-gy*LFV.s;LFV.init=1;lfClamp();lfApply()}
function lfBind(c){
  var P={},drag=null,pinch=null,tgt=null,moved=0;
  function pt(e){var r=c.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]}
  c.addEventListener("pointerdown",function(e){if(e.target.closest&&e.target.closest(".lfctl"))return;P[e.pointerId]=pt(e);tgt=e.target;moved=0;
    if(Object.keys(P).length===1){var p=P[e.pointerId];drag={x:p[0],y:p[1],vx:LFV.x,vy:LFV.y}}
    else if(Object.keys(P).length===2){var k=Object.keys(P),a=P[k[0]],b=P[k[1]];pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]),s:LFV.s,cx:(a[0]+b[0])/2,cy:(a[1]+b[1])/2,vx:LFV.x,vy:LFV.y};drag=null;moved=99}});
  c.addEventListener("pointermove",function(e){if(!P[e.pointerId])return;P[e.pointerId]=pt(e);
    if(pinch&&Object.keys(P).length>=2){var k=Object.keys(P),a=P[k[0]],b=P[k[1]],d=Math.hypot(a[0]-b[0],a[1]-b[1]);var n=Math.min(LFZMAX,Math.max(lfMinS(),pinch.s*d/pinch.d)),f=n/pinch.s;LFV.s=n;LFV.x=pinch.cx-(pinch.cx-pinch.vx)*f;LFV.y=pinch.cy-(pinch.cy-pinch.vy)*f;lfClamp();lfApply();return}
    if(drag){var p=P[e.pointerId],dx=p[0]-drag.x,dy=p[1]-drag.y;if(moved||Math.hypot(dx,dy)>6){if(!moved){try{c.setPointerCapture(e.pointerId)}catch(x){}}moved=1;c.classList.add("grab");LFV.x=drag.vx+dx;LFV.y=drag.vy+dy;lfClamp();lfApply()}}});
  function up(e){if(!P[e.pointerId])return;delete P[e.pointerId];
    if(!Object.keys(P).length){c.classList.remove("grab");
      if(!moved&&tgt){var el=tgt.closest&&!tgt.closest("[data-act=gotoroom]")&&tgt.closest("[data-lf]");if(el){var q=el.getAttribute("data-lf").split(":"),i=+q[1];
        if(q[0]==="lock"){pop("The "+q[1]+" unlocks at level "+q[2])}else if(q[0]==="room")roomModal(i);else if(q[0]==="build"){buildModal(i)}else if(q[0]==="collect"){baseAct("rcollect",{dataset:{i:i}},e)}else if(q[0]==="closet"){wardrobeModal()}}}
      drag=null;pinch=null;tgt=null}else if(Object.keys(P).length===1){var k=Object.keys(P)[0];drag={x:P[k][0],y:P[k][1],vx:LFV.x,vy:LFV.y};pinch=null;moved=99}}
  c.addEventListener("pointerup",up);c.addEventListener("pointercancel",up);
  c.addEventListener("wheel",function(e){e.preventDefault();var p=pt(e);lfZoomAt(e.deltaY<0?1.12:.89,p[0],p[1])},{passive:false});
}
function lfTint(){return ""}
function lfHtml(){
  lfWeatherInit();
  var w=lfWorld();
  var _sc=lfSkyCols();return '<div class="lfwrap" id="lfwrap" style="background:linear-gradient(180deg,'+_sc[0]+' 0,'+_sc[1]+' 62%,'+lfMix(_sc[1],'#ffffff',.18)+' 100%)"><svg id="lfsvg" class="lfsvg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Loft, an isometric building. Drag to pan, pinch to zoom, tap a room.">'+w+'</svg>'
   +'<div class="lfctl"><button data-act="lfz" data-d="1" aria-label="Zoom in">+</button><button data-act="lfz" data-d="-1" aria-label="Zoom out">&minus;</button><button data-act="lfz" data-d="0" aria-label="Reset view">&#9678;</button>'+'</div>'
   +'<div class="lfwxb mono" id="lfwxb">'+lfWxText()+'</div><div class="lfhint mono">Drag to move &middot; pinch to zoom &middot; tap a room</div></div>';
}
function lfMount(){
  var c=document.getElementById("lfwrap");if(!c)return;
  try{maybeVisit(.4)}catch(e){}try{communityJoin()}catch(e){}
  lfSync();
  var svg=document.getElementById("lfsvg"),w=document.getElementById("lfw");
  if(w){var t=lfTint();if(t){var gg=document.createElementNS("http://www.w3.org/2000/svg","g");gg.innerHTML=t;w.appendChild(gg.firstChild)}}
  if(!LFV.init)lfInitView(c);else{lfClamp();lfApply()}
  lfBind(c);
  Object.keys(LFA).forEach(function(k){var a=LFA[k];a._in=0;a._k=null;a._ph=null;a._em=null;var C=lfC(a);if(!C){if(a.pv){try{lfPvMem(a)}catch(e){}lfPvKeep(a)}delete LFA[k];return}if(a.role=="me"&&!a.pv){try{lfRestore(a,lfSnap(a),C)}catch(e){lfRebind(a,C)}}else lfRebind(a,C);lfDraw(a,true)});
  if(!LFRAF){LFLT=performance.now();LFRAF=requestAnimationFrame(lfLoop)}
}
setInterval(function(){if(document.getElementById("lfwrap")&&!document.hidden){try{lfSync()}catch(e){}try{lfWeatherInit()}catch(e){}try{lfRelight()}catch(e){}}},20000);
window.LFV=LFV;window.lfApply=lfApply;window.LFA=LFA;window.lfSync=lfSync;
window.lfStep=lfStep;window.lfGo=lfGo;window.lfRoute=lfRoute;window.lfBlockedAt=lfBlockedAt;window.lfC=lfC;window.lfDraw=lfDraw;window.lfNext=lfNext;

/* ---- live preview inside the room modal ---- */
var LFPCS={};
var LFPVSNAP=null;
function lfPvKeep(a){if(a.role!=="me"||a.pvslot==null)return;LFPVSNAP={slot:a.pvslot,t:Date.now(),sn:lfSnap(a)};
  var wa=LFA.me;if(wa&&!wa.pv&&wa.room===a.pvslot){var C=lfC(wa);if(C){try{lfRestore(wa,LFPVSNAP.sn,C)}catch(e){}}}}
/* Cal (playtest): "Adding a new upgrade resets all the NPCs positions". A purchase redraws the room window, so everyone in it
   (not only you) is remembered for a few seconds: where they are, what they are doing, their seat and order, and their look. */
var LFPVS={},LFPVX=["sat","wait","look","ths","want","last","gid"];
function lfPvMem(a){var M=LFPVS[a.pvslot];if(!M||Date.now()-M.t>1500)M=LFPVS[a.pvslot]={t:Date.now(),m:{}};var x={sn:lfSnap(a),st0:a.st,arr0:a.arr};LFPVX.forEach(function(f){x[f]=a[f]});M.m[a.id]=x}
function lfPvBack(a,C){var M=LFPVS[a.pvslot],x=M&&Date.now()-M.t<6000&&M.m[a.id];if(!x)return false;
  C.st.forEach(function(q){if(q.by===a.id)q.by=null});/* lfPlace may have claimed another spot */
  try{lfRestore(a,x.sn,C)}catch(e){return false}LFPVX.forEach(function(f){if(x[f]!==undefined)a[f]=x[f]});
  [[a.st,x.st0],[typeof a.arr==="object"?a.arr:null,typeof x.arr0==="object"?x.arr0:null]].forEach(function(q){if(q[0]&&q[1])LFSF.forEach(function(f){if(q[1][f]!=null)q[0][f]=q[1][f]})});
  if(a.st)a.st.by=a.id;a.fade=0;return true}
function lfPvStop(){Object.keys(LFA).forEach(function(k){var a=LFA[k];if(a.pv){var u=a.room;try{lfPvMem(a)}catch(e){}lfPvKeep(a);delete LFA[k];delete LFMETA[u]}})}
function lfPvStart(i,mm){
  lfPvStop();var r=S.base.slots[i];if(!r||!LFMETA[i])return;
  var it=mm.querySelector(".lfitems");if(!it)return;var uid=+it.getAttribute("data-i"),C=LFPCS[uid];if(!C)return;
  LFMETA[uid]={C:C,p:{x:0,y:0},r:r,slot:i};
  if(SVC[r.t]&&!document.getElementById("obpanel")){var rb=mm.querySelector(".rm-scroll");if(rb){var d=document.createElement("div");d.id="obpanel";d.className="obpanel mono";rb.insertBefore(d,rb.firstChild)}}
  lfDesired().filter(function(w){return w.room===i}).forEach(function(w){
    var n=Object.assign({},w,{id:"pv:"+w.id,room:uid,pv:1,pvslot:i,fresh:0,wand:0,leaveAt:0,visitor:w.visitor?0:0});
    var a=LFA[n.id]=Object.assign({wspawn:0,x:3,y:3,mode:"idle",t:0,ph:0,face:1,pose:0,alpha:1,fade:0,si:-1,tx:0,ty:0,sk:"",leaving:0},n);
    lfPlace(a);if(a.role!=="guest"&&a.alpha<1){a.alpha=1;a.fade=0}
    if(lfPvBack(a,C))return;
    if(a.role==="me"){var sn=null;if(LFPVSNAP&&LFPVSNAP.slot===i&&Date.now()-LFPVSNAP.t<6000)sn=LFPVSNAP.sn;else{var wa=LFA[w.id];if(wa&&wa.room===i&&!wa.pv)sn=lfSnap(wa)}
      if(sn){try{lfRestore(a,sn,C)}catch(e){}}}});
  /* The Patio window shows you and the dogs out there too (Cal): copies of the Bedroom's people for this window, each
     dog with its own Patio bed (Pluto the first, Chopstick the second). */
  if(r.t==="patio"){var bi=-1;S.base.slots.forEach(function(q,j){if(bi<0&&q&&q.t==="bedroom")bi=j});
    if(bi>=0){var pa=r.a||{},beds=[];if(pa.pt_dbed)beds.push([1.95,4.05]);if(pa.pt_dbed2)beds.push([.75,4.05]);
      lfDesired().filter(function(w){return w.room===bi&&(w.role==="me"||w.role==="dog")}).forEach(function(w){
        var n=Object.assign({},w,{id:"pv:"+w.id,room:uid,pv:1,pvslot:i,fresh:0,wand:0,leaveAt:0,visitor:0});
        if(w.role==="dog")n.bed=beds[w.dname==="chopstick"?1:0]||beds[0]||null;
        var a=LFA[n.id]=Object.assign({wspawn:0,x:3,y:3,mode:"idle",t:0,ph:0,face:1,pose:0,alpha:1,fade:0,si:-1,tx:0,ty:0,sk:"",leaving:0},n);
        try{lfPlace(a)}catch(e){}a.alpha=1;a.fade=0})}}
}
window.lfPvStart=lfPvStart;window.lfPvStop=lfPvStop;


/* ---- keep what a character is doing when the room is rebuilt (upgrades, re-render) ---- */
function lfStO(s){return s&&typeof s==="object"?{kind:s.kind,tag:s.tag,x:s.x,y:s.y}:null}
function lfSnap(a){return {x:a.x,y:a.y,mode:a.mode,act:a.act,t:a.t,at:a.at||0,face:a.face,ph:a.ph,speed:a.speed,carry:a.carry,stretch:a.stretch,wtime:a.wtime||0,emo:a.emo,emot:a.emot,sleep:a.sleep,goal:a.wp&&a.wp.length?a.wp[a.wp.length-1].slice():null,arr:typeof a.arr==="string"?a.arr:lfStO(a.arr),st:lfStO(a.st),alpha:a.alpha}}
function lfFindSt(C,o){if(!o)return null;var best=null,bd=1e9;C.st.forEach(function(s){if(s.kind!==o.kind||(o.tag||"")!==(s.tag||""))return;var dd=Math.abs(s.x-o.x)+Math.abs(s.y-o.y);if(dd<bd){bd=dd;best=s}});return bd<1.2?best:null}
function lfRestore(a,sn,C){
  a.x=sn.x;a.y=sn.y;a.face=sn.face;a.ph=sn.ph;a.speed=sn.speed;a.carry=sn.carry;a.stretch=sn.stretch;a.emo=sn.emo;a.emot=sn.emot;a.sleep=sn.sleep;a.act=sn.act;a.at=sn.at;if(sn.alpha!=null)a.alpha=sn.alpha;
  var st=lfFindSt(C,sn.st),arr=typeof sn.arr==="string"?sn.arr:lfFindSt(C,sn.arr);
  a.si=-1;a.st=null;a.arr=null;
  if(st){a.st=st;a.si=C.st.indexOf(st);st.by=a.id}
  if(sn.mode==="do"&&(st||!sn.st)){a.mode="do";a.t=sn.t}
  else if(sn.mode==="walk"){
    var g=sn.goal||[sn.x,sn.y];a.mode="walk";a.arr=arr||null;a.wtime=sn.wtime;
    if(arr&&typeof arr==="object"){a.si=C.st.indexOf(arr);arr.by=a.id}
    a.wp=lfRoute(C,a.x,a.y,g[0],g[1]);
    if(arr&&typeof arr==='object'&&arr.exit&&lfSeatish(arr)&&Math.hypot(a.x-g[0],a.y-g[1])>1.4){a.wp=lfPath(C,a.x,a.y,arr.exit[0],arr.exit[1]);a.wp.push([g[0],g[1]])}
    a.p0=[a.x,a.y];a.tx=a.wp[0][0];a.ty=a.wp[0][1]}
  else{a.mode="idle";a.t=Math.max(.3,sn.t||0)}
  /* never leave a character standing inside furniture unless they are on a seat/bed */
  var seat=a.mode==="do"&&a.st&&lfSeatish(a.st)||a.mode==="do"&&a.st&&/^(pc|bed)$/.test(a.st.tag||"");
  var toSeat=a.mode==="walk"&&a.arr&&typeof a.arr==="object"&&lfSeatish(a.arr);
  if(!seat&&!toSeat&&C.nav&&lfBlockedAt(C,a.x,a.y)){var f=lfFreeNear(C,a.x,a.y,3);a.x=f[0];a.y=f[1];if(a.mode==="walk"){var g2=a.wp[a.wp.length-1];a.wp=lfPath(C,a.x,a.y,g2[0],g2[1]);a.tx=a.wp[0][0];a.ty=a.wp[0][1]}}
}

/* keep claims and orders when the world re-renders (stations are rebuilt each render) */
var LFSF=["by","ord","item","t0","stage","served","hand","need"];
function lfRebind(a,C){
  function mv(o){if(!o||o.ix==null)return o;var n=C.st[o.ix];if(!n||n===o||n.kind!==o.kind)return o;LFSF.forEach(function(f){if(o[f]!=null)n[f]=o[f]});return n}
  if(a.st)a.st=mv(a.st);if(a.arr&&typeof a.arr==="object"&&a.arr.ix!=null)a.arr=mv(a.arr);if(a.job)a.job.s=mv(a.job.s);
}

function lfCarryProp(it,a){
  if(/Bottle|Champ/.test(it))return '<g transform="translate(12,-42)"><rect x="-2.4" y="-10" width="4.8" height="14" rx="1.6" fill="#1a3a2a" stroke="rgba(0,0,0,.5)" stroke-width=".5"/><rect x="-1.2" y="-14" width="2.4" height="5" fill="#c9a24a"/><g class="lfspark"><circle cx="0" cy="-17" r="2.4" fill="#fff6c2"/><path d="M0 -17 l-5 -5 M0 -17 l5 -5 M0 -17 l0 -7 M0 -17 l-6 1 M0 -17 l6 1" stroke="#ffd24a" stroke-width="1"/></g></g>';
  if(/Popcorn/.test(it))return '<g transform="translate(12,-40)"><path d="M-5 -6 h10 l-2 12 h-6z" fill="#fff" stroke="#c0392b" stroke-width="1"/><path d="M-3 -6 v12 M1 -6 v12" stroke="#d9534f" stroke-width="1.4"/><circle cx="-2" cy="-7" r="2.2" fill="#fff3c0"/><circle cx="2" cy="-8" r="2.4" fill="#fff3c0"/></g>';
  if(/Towel/.test(it))return '<g transform="translate(12,-38)"><rect x="-6" y="-3" width="12" height="6" rx="1.5" fill="#fff" stroke="rgba(0,0,0,.3)" stroke-width=".5"/><path d="M-6 0 h12" stroke="#cfe8f0" stroke-width="1.2"/></g>';
  if(it==="crate")return '<g transform="translate(12,-38)"><rect x="-7" y="-4" width="14" height="8" fill="#a9763f" stroke="rgba(0,0,0,.45)" stroke-width=".6"/><circle cx="-3" cy="-5" r="2.6" fill="#e8453a"/><circle cx="2" cy="-5.5" r="2.6" fill="#ffcf3a"/><circle cx="5" cy="-4" r="2" fill="#9be05a"/></g>';
  if(it==="box")return '<g transform="translate(12,-40)"><rect x="-7" y="-6" width="14" height="11" fill="#c9965a" stroke="rgba(0,0,0,.45)" stroke-width=".6"/><path d="M-7 -1 h14 M0 -6 v11" stroke="#8a5a30" stroke-width="1"/></g>';
  var C=lfC(a),m=LFMETA[a.room];if(m&&m.r&&m.r.t==="library")return '<g transform="translate(12,-38)"><rect x="-5" y="-6" width="10" height="12" fill="'+["#d9534f","#3a6ab5","#4fb58a"][a.id.length%3]+'" stroke="rgba(0,0,0,.45)" stroke-width=".6"/><rect x="-4" y="-5" width="1.4" height="10" fill="rgba(255,255,255,.4)"/></g>';
  return "";
}

/* ---------- service engine ----------
   Every service room runs the same loop: a customer walks in, sits at a "cust" spot, shows a request,
   a crew member runs the room's steps (prep, deliver, perform), the customer enjoys it, then tips and reviews.
   Production rooms (garden, farm, pond) run "plots" that need water, harvest, collecting or reeling. */
var SVC={},LFPS={},LFLOG={},LFFILM={},LFPERS=0;
function lfFace(p,q){return ((q.x-p.x)-(q.y-p.y))>=0?1:-1}
function lfCust(C,x,y,fx,o){o=o||{};
  var sit=!!o.sit,lie=!!o.lie;
  var s=C.s("cust",x,y,fx,sit?"sit":lie?"lie":(o.wact||"look"),[10,20],Object.assign({cust:1,tag:o.tag||"cust",lift:sit?1:0,dk:(sit||lie)?99:0},o));
  return s;
}
function lfCustFrom(C,n0,o){C.st.slice(n0).forEach(function(s){if(s.kind!=="sit")return;s.kind="cust";s.cust=1;Object.assign(s,o||{})})}
function lfPrep(C,name,x,y){C.prep=C.prep||{};C.prep[name]={x:x,y:y}}
function lfPlotS(C,pid,x,y,o){return C.s("plot",x,y,1,"look",[1,1],Object.assign({plot:1,pid:pid},o||{}))}
function lfBlock(x0,y0,x1,y1){if(LFREC)LFREC.push([x0,y0,x1,y1])}
/* modifiers from add-ons: tip, spd, pat, m (menu), p */
function lfSvcMods(r){var o={tip:0,spd:0,pat:0,m:[],p:0};
  try{addonsOf(r).forEach(function(a){var e=a[3]||{};o.tip+=e.tip||0;o.spd+=e.spd||0;o.pat+=e.pat||0;o.p+=e.p||0;if(e.m)o.m=o.m.concat(e.m)})}catch(e){}
  return o}
function lfMenuFor(def,r,C,s,mods){var base=s&&s.menu?s.menu:(typeof def.menu==="function"?def.menu(r,C):def.menu||["Order"]);
  if(!s||s.mx!==false)base=base.concat(mods.m.filter(function(x){return !def.mfor||def.mfor(x,s)}));return base}
function lfRoomCrew(a){var o=[];Object.keys(LFA).forEach(function(k){var b=LFA[k];if(b.room===a.room&&b.role==="crew"&&b.alpha>0&&!b.leaving&&!b.wand)o.push(b)});return o}
function lfSvcStaffOn(a,r){var def=SVC[r.t];if(!def)return false;var cr=lfRoomCrew(a),mi=def.staffIx?def.staffIx(cr.length):0;return cr.some(function(b){return (b.ix||0)>=mi})}
function lfGuestAt(s){var k=Object.keys(LFA);for(var i=0;i<k.length;i++){var g=LFA[k[i]];if(g.role==="guest"&&g.st===s&&g.alpha>0)return g}return null}
function lfLive(a){return !a.pv}
function lfPersistSoon(){var t=Date.now();if(t-LFPERS>15000){LFPERS=t;try{persist()}catch(e){}}}
/* ---- reviews ---- */
var LFREV={5:["{i} hit different.","Best {i} in LA, no cap.","Fast service. Coming back.","Ten out of ten vibes.","Staff remembered my name.","Absolutely elite {i}."],
  4:["Solid {i}. Short wait.","Good spot. Would return.","{i} was great, the line was not.","Nice crew, nice {i}."],
  3:["Took a while but the {i} was fine.","Mid wait, decent {i}.","OK. Busy night."],
  1:["Waited forever. Never got my {i}.","Service? Never heard of her.","Left empty-handed. One star.","Walked out. Too slow."]};
function lfReview(i,stars,item){
  if(!S.base.rev)S.base.rev={};var arr=S.base.rev[i]=S.base.rev[i]||[];
  arr.unshift({s:stars,t:lfPick(LFREV[stars]).replace("{i}",item||"order"),ts:Date.now()});if(arr.length>8)arr.length=8;
  var all=S.base.rstat=S.base.rstat||{};var q=all[i]=all[i]||{n:0,sum:0};q.n++;q.sum+=stars;
}
/* ---- guests ---- */
function lfGuestNext(a,C,r){
  var def=SVC[r.t];
  if(a.sat){
    if(a.wait&&lfLive(a)&&a.st){var i=a.room;r.pend=Math.max(0,(r.pend||0)-10);a.emo="1 star";a.emot=3;lfReview(i,1,a.st.item);lfPersistSoon();
      if(Date.now()-(window.LFREVT||0)>150000){window.LFREVT=Date.now();try{pop("1-star review at the "+ROOMT[r.t].name+": the wait was too long. -10 coins.")}catch(e){}}}
    if(a.st){a.st.ord=0;a.st.served=0;a.st.hand=null}
    a.wait=0;a.sat=0;a.st=null;var d=lfDoorOf(C);a.speed=1;lfGo(a,d.x,d.y+.3,"leave");return}
  if(a.alpha>0&&a.mode!=="idle"){a.mode="idle";a.t=1;return}
  var f=lfFree(C,a,function(s){return s.cust});if(!f.length){a.alpha=0;a.mode="idle";a.t=6;return}
  var dv=ROOMDEF[r.t]&&ROOMDEF[r.t].visitors,me=dv&&a.vis&&dv.filter(function(v){return v.id===a.vis})[0];
  var o=lfPick(f);a.look=me?rsNpc(me.look):lfGuestLook(a);a.si=o.i;o.s.by=a.id;o.s.ord=0;o.s.served=0;o.s.hand=null;o.s.stage=0;
  var d=lfDoorOf(C);a.x=d.x;a.y=d.y+.3;a.alpha=0;a.fade=1;a.sat=0;a.speed=lfRand(.85,1.1);
  lfGo(a,o.s.x,o.s.y,o.s);
}
function lfGuestSeated(a,s){
  var C=lfC(a),m=LFMETA[a.room],r=m&&m.r;if(!r)return;var def=SVC[r.t];if(!def)return;
  var mods=lfSvcMods(r);a.sat=1;s.t0=Date.now();s.stage=0;s.served=0;s.hand=null;
  if(lfSvcStaffOn(a,r)){
    s.item=lfPick(lfMenuFor(def,r,C,s,mods));s.ord=1;a.act=s.wact||(s.lift?"sit":s.lie?"lie":"look");
    a.t=(def.pat||80)+mods.pat;a.at=0;a.emo=s.item;a.emot=1e9;a.wait=1;
  }else{s.ord=0;a.act=s.uact||def.use||"sit";var ud=s.udur||def.udur||[12,22];a.t=lfRand(ud[0],ud[1]);a.at=0;a.wait=0}
}
function lfSvcServe(C,s,a,r){
  var def=SVC[r.t],g=lfGuestAt(s);s.served=1;s.ord=0;s.stage=2;
  if(!g)return;var ud=s.udur||def.udur||[12,22];
  g.act=s.uact||def.use||"eat";g.at=0;g.t=lfRand(ud[0],ud[1]);g.wait=0;g.emo="♥";g.emot=2.4;
  if(lfLive(a)&&lfLive(g)){
    var mods=lfSvcMods(r),wt=(Date.now()-(s.t0||Date.now()))/1000,tip=lfTipFor(a.room,r,wt,mods);
    if(tip>0){r.pend=(r.pend||0)+tip;g.emo="+"+tip}else g.emo="♥";
    lfReview(a.room,wt<22?5:wt<40?4:3,s.item);lfPersistSoon();
  }
}
/* ---- staff ---- */
function lfSvcWork(a,C,r){
  var def=SVC[r.t];if(!def)return false;
  if(a.wand&&def.kind!=="prod")return false;
  var mods=lfSvcMods(r);
  if(a.job){var J=a.job,s=J.s;
    var gone=!J.plot&&(!s.by||s.by!==J.by||!s.ord&&!J.done);
    if(gone||Date.now()-J.t0>90000){a.job=null;s.hand=null}
    else{
      if(J.k===1&&!J.plot){s.stage=1;var g=lfGuestAt(s);if(g&&J.st.length>1){g.emo="OK";g.emot=2}}
      if(J.k<J.st.length){lfSvcStep(a,J,mods);return true}
      a.job=null;s.hand=null;
      if(J.plot)lfPlotDone(C,s,a,r);else lfSvcServe(C,s,a,r);
    }
  }
  var crew=lfRoomCrew(a),mi=def.staffIx?def.staffIx(crew.length):0;
  if((a.ix||0)<mi&&!a.wand)return false;
  var need=C.st.filter(function(s){return s.hand==null&&(s.plot?(s.need&&!s.auto):(s.cust&&s.ord&&!s.served&&s.by))});
  if(!need.length)return false;
  need.sort(function(p,q){return (p.t0||0)-(q.t0||0)});
  var s=need[0];if(Math.random()<.35&&need.length>1)s=need[1];
  s.hand=a.id;
  var X={C:C,r:r,P:function(n){return (C.prep&&C.prep[n])||{x:C.W/2,y:C.D/2}},A:function(z){return lfApproach(C,z)}};
  var st=(s.plot?def.plotSteps:def.steps)(s,X,s.plot?s.need:s.item);
  st.forEach(function(p){if(p.fx==null)p.fx=lfFace(p,s)});
  a.job={s:s,by:s.by,k:0,st:st,plot:!!s.plot,t0:Date.now()};
  lfSvcStep(a,a.job,mods);return true;
}
function lfSvcStep(a,J,mods){var p=lfSpread(a,J.st[J.k]);a.carry=p.carry?1:0;a.speed=(p.carry?.92:1.05)*(1+(mods?mods.spd:0));
  lfGo(a,p.x,p.y,{kind:"svc",svc:1,act:p.act||"reach",tag:p.tag||"svc",dur:p.dur||[1.4,2.2],fx:p.fx,prop:p.prop})}
/* ---- plots ---- */
function lfPlotSt(C,s){var k=C.key+":"+s.pid,st=LFPS[k];if(!st){st=LFPS[k]={stage:Math.random()<.5?1:0,g:Math.random()*10,need:null,crop:lfPick(s.crops||["Tomato"]),next:lfRand(8,18)}}return st}
function lfPlotTick(C,r,dt){
  var def=SVC[r.t];if(!def||def.kind!=="prod")return;
  var mods=lfSvcMods(r),rate=1+mods.p+(def.rate?def.rate(C):0),auto=def.auto?def.auto(C):false;
  C.st.forEach(function(s){if(!s.plot)return;var st=lfPlotSt(C,s),before=st.stage+"|"+st.need;
    if(s.fish){
      if(st.need){st.g+=dt;if(st.g>24&&s.hand==null){st.need=null;st.g=0;st.next=lfRand(10,22);st.miss=(st.miss||0)+1}}
      else{st.g+=dt*rate;if(st.g>st.next){st.need="Bite!";st.g=0}}
    }else if(s.animal){
      if(!st.need){st.g+=dt*rate;if(st.g>(s.cycle||30)){st.need=s.animal;st.g=0}}
    }else{
      if(st.need==="Water"){if(auto){st.wt=(st.wt||0)+dt;if(st.wt>2.5){st.need=null;st.stage=1;st.g=0;st.wt=0}}}
      else if(!st.need){st.g+=dt*rate;if(st.stage===0&&st.g>(s.t1||16)){st.need="Water";st.g=0}else if(st.stage===1&&st.g>(s.t2||28)){st.stage=2;st.need="Harvest";st.g=0}}
    }
    s.need=st.need;s.ord=st.need?1:0;s.auto=st.need==="Water"&&auto;s.item=st.crop;
    if(before!==st.stage+"|"+st.need)lfPlotDraw(C,s,st);
  });
}
function lfPlotDraw(C,s,st){
  var it=document.querySelector('.lfitems[data-i="'+C.key+'"]');if(!it)return;
  var g=it.querySelector('.lfplot[data-pid="'+s.pid+'"]');if(!g)return;
  g.innerHTML=s.draw?s.draw(st,s):"";
}
function lfPlotInit(C,s){var st=lfPlotSt(C,s);s.need=st.need;s.ord=st.need?1:0;return '<g class="lfplot" data-pid="'+s.pid+'">'+(s.draw?s.draw(st,s):"")+'</g>'}
function lfPlotDone(C,s,a,r){
  var st=lfPlotSt(C,s),T=ROOMT[r.t],live=lfLive(a)&&C.key<90,log=LFLOG[C.key]=LFLOG[C.key]||[];
  if(st.need==="Water"){st.need=null;st.stage=1;st.g=0;a.emo="✓";a.emot=1.5}
  else if(st.need==="Harvest"||(s.animal&&st.need)){
    var got=st.crop||st.need;st.need=null;st.stage=0;st.g=0;st.crop=lfPick(lfMenuFor(SVC[r.t],r,C,s,lfSvcMods(r)));
    if(live&&T.food){S.base.food[T.food]=Math.min(foodCap(),(S.base.food[T.food]||0)+1);lfPersistSoon()}
    a.emo="+1 "+(T.food?FOODN[T.food]:got);a.emot=2;log.unshift({t:got,ts:Date.now()});
  }else if(st.need==="Bite!"){
    st.need=null;st.g=0;st.next=lfRand(10,22);var mods=lfSvcMods(r),rare=mods.m.indexOf("Rare")>=0&&Math.random()<.3;
    var fish=rare?lfPick(["Golden Koi","Rainbow Trout","Sturgeon"]):lfPick(["Koi","Trout","Bass","Carp","Catfish","Bluegill"]),lb=(rare?6:1)+Math.random()*(rare?8:5);
    if(live&&T.food){S.base.food[T.food]=Math.min(foodCap(),(S.base.food[T.food]||0)+1);lfPersistSoon()}
    a.emo=lb.toFixed(1)+"lb";a.emot=2.4;log.unshift({t:fish+" "+lb.toFixed(1)+" lb",ts:Date.now()});
  }
  if(log.length>6)log.length=6;
  s.need=st.need;s.ord=st.need?1:0;lfPlotDraw(C,s,st);
}
/* ---- order board data ---- */
function lfOrders(C,r){
  var def=r&&SVC[r.t];if(!def)return [];var out=[],cnt={};
  C.st.forEach(function(s){
    if(s.plot){var st=lfPlotSt(C,s);cnt.p=(cnt.p||0)+1;
      out.push({p:def.lbl||"P",t:cnt.p,dish:s.fish?"":(st.crop||""),st:st.need?(st.need==="Water"||st.need==="Bite!"?0:1):2,need:st.need,lab:st.need?st.need:(s.fish?"calm":st.stage===0?"sprout":"growing")});return}
    if(!s.cust)return;var gk=s.grp||"c";cnt[gk]=(cnt[gk]||0)+1;
    if(!s.by||!(s.ord||s.served))return;
    out.push({p:s.lbl||def.lbl||"T",t:s.num||cnt[gk],dish:s.item||"Order",st:s.served?2:s.stage?1:0});
  });
  out.sort(function(a,b){return a.st-b.st});return out;
}
function lfBoardLines(C,r){
  var def=SVC[r.t];if(!def)return [];var o=lfOrders(C,r),L=[];
  if(def.head)L.push({t:def.head(C),c:"#ffd27a"});
  if(def.kind==="prod"){o.slice(0,4-L.length).forEach(function(q){var lab=q.lab||(def.short||["wait","prep","enjoy"])[q.st];L.push({t:q.p+q.t+" "+(q.dish||"").slice(0,7)+" · "+lab,c:q.need||q.st===0?"#ffd27a":"#8cf0a8"})})}
  else o.slice(0,4-L.length).forEach(function(q){L.push({t:q.p+q.t+" "+q.dish.slice(0,8)+" · "+(def.short||["wait","prep","enjoy"])[q.st],c:["#ffd27a","#7ad0ff","#8cf0a8"][q.st]})});
  if(!L.length)L.push({t:def.quiet||"All quiet",c:"#8aa"});
  return L;
}
var LFOBT=0;
function lfObUpdate(){
  var gs=document.querySelectorAll(".lfob");
  for(var i=0;i<gs.length;i++){var g=gs[i],C=null,r=null,rm=g.closest(".lfroom"),pv=g.closest("svg.lfprev");
    if(rm){var m=LFMETA[+rm.getAttribute("data-i")];C=m&&m.C;r=m&&m.r}else if(pv){var it=pv.querySelector(".lfitems"),k=it&&+it.getAttribute("data-i");C=LFPCS[k];r=LFMETA[k]&&LFMETA[k].r}
    if(!C||!r)continue;var L=lfBoardLines(C,r),tx=g.querySelectorAll(".lfobl");
    for(var k2=0;k2<tx.length;k2++){var q=L[k2];tx[k2].textContent=q?q.t:"";if(q)tx[k2].setAttribute("fill",q.c)}}
  var sc=document.querySelectorAll(".lfscrt");for(var j=0;j<sc.length;j++){var key=+sc[j].getAttribute("data-k"),F=lfFilm(key);sc[j].textContent=F.on?F.name:"Intermission"}
  var pn=document.getElementById("obpanel");
  if(pn){var it2=document.querySelector("#layer .lfprev .lfitems"),uid=it2&&+it2.getAttribute("data-i"),C2=LFPCS[uid],M=LFMETA[uid];
    if(C2&&M)pn.innerHTML=lfPanelHtml(C2,M.r,M.slot);}
}
function lfStars(n){var s="";for(var i=1;i<=5;i++)s+=i<=Math.round(n)?"★":"☆";return s}
function lfPanelHtml(C,r,i){
  var def=SVC[r.t];if(!def)return "";var mods=lfSvcMods(r),h='',o=lfOrders(C,r);
  if(def.kind==="prod"){
    h+='<div class="obh"><b>'+esc(def.boardName||"Plots")+'</b><span>'+o.filter(function(x){return x.need}).length+' need help</span></div>';
    h+=o.map(function(x){return '<div class="obr"><span>'+(def.lblName||"Plot")+' '+x.t+'</span><span>'+esc(x.dish||"")+'</span><em style="color:'+(x.need?"#ffd27a":"#8cf0a8")+'">'+esc(x.lab)+'</em></div>'}).join("");
    var lg=LFLOG[C.key]||[];if(lg.length)h+='<div class="obh obs"><b>'+(r.t==="pond"?"Catch log":"Recent harvest")+'</b></div>'+lg.slice(0,4).map(function(x){return '<div class="obr"><span>'+esc(x.t)+'</span></div>'}).join("");
  }else{
    var q=o.filter(function(x){return x.st<2}).length;
    h+='<div class="obh"><b>'+esc(def.boardName||"Order board")+'</b><span>'+q+' in queue</span></div>';
    if(def.head)h+='<div class="obr"><span>'+esc(def.head(C))+'</span></div>';
    h+=o.length?o.map(function(x){return '<div class="obr"><span>'+esc(def.unit||"Table")+' '+x.t+'</span><span>'+esc(x.dish)+'</span><em style="color:'+["#ffd27a","#7ad0ff","#8cf0a8"][x.st]+'">'+esc((def.verbs||["Waiting","In progress","Enjoying"])[x.st])+'</em></div>'}).join(""):'<div class="obr"><span>'+esc(def.quiet||"All quiet")+'</span></div>';
    var staff=Object.keys(LFA).some(function(k){var b=LFA[k];return b.room===C.key&&b.role==="crew"&&!b.wand});
    if(!staff)h+='<div class="obr obw"><span>'+(r&&r.t==="restaurant"?"No staff yet. Guests help themselves until you hire a cook.":"No crew here. Customers will not order until you assign crew.")+'</span></div>';
    var menu=lfMenuFor(def,r,C,null,mods);
    h+='<div class="obh obs"><b>Menu</b><span>'+menu.length+' items</span></div><div class="obm">'+menu.map(function(x){return '<span>'+esc(x)+'</span>'}).join("")+'</div>';
  }
  var rv=(S.base.rev||{})[i]||[],rs=(S.base.rstat||{})[i];
  if(rv.length){h+='<div class="obh obs"><b>Reviews</b><span>'+(rs?lfStars(rs.sum/rs.n)+' '+(rs.sum/rs.n).toFixed(1)+' ('+rs.n+')':'')+'</span></div>'+rv.slice(0,4).map(function(x){return '<div class="obr"><span class="obst">'+lfStars(x.s)+'</span><span class="obq">'+esc(x.t)+'</span></div>'}).join("")}
  var tips=[];if(mods.tip)tips.push("+"+mods.tip+" tips");if(mods.spd)tips.push("+"+Math.round(mods.spd*100)+"% staff speed");if(mods.pat)tips.push("+"+mods.pat+"s patience");
  if(tips.length)h+='<div class="obr obw"><span>Upgrades: '+tips.join(" · ")+'</span></div>';
  if(def.kind!=="prod"||C.st.some(function(z){return z.cust})){var left=lfTipsLeft(i,r);h+='<div class="obr"><span>Tip jar today</span><em style="color:'+(left?"#8cf0a8":"#ff9d7a")+'">'+(left?left+" coins left":"full until tomorrow")+'</em></div>'}
  return h;
}
/* ---- theater film clock ---- */
var LFFILMS=["Neon Drift","Kaiju Breakfast","Midnight in Shibuya","Bass Drop 2","The Last Ramen","Sky Lounge Heist","Pluto vs. The Vacuum","Calibur: Live","Garden of Static","Tokyo Drift Club"];
function lfFilm(key){var F=LFFILM[key];var now=Date.now();
  if(!F||now>F.end){var on=!F||!F.on;F=LFFILM[key]={on:on,name:on?lfPick(LFFILMS):"",start:now,end:now+(on?190000:25000)}}
  F.left=Math.max(0,Math.round((F.end-now)/60000));return F}
/* ---- generic board renderers ---- */
function lfOrderBoard(C,u,z,title){
  var bd='<rect x="-3" y="-3" width="62" height="52" rx="2" fill="#6a4426" stroke="'+LFOL+'" stroke-width=".8"/><rect width="56" height="46" fill="#1d2a26"/><text x="28" y="9" text-anchor="middle" font-size="6.5" font-weight="700" fill="#ffd27a" font-family="Arial">'+(title||"ORDERS")+'</text><path d="M4 12H52" stroke="rgba(255,255,255,.25)" stroke-width=".6"/>'
    +[0,1,2,3].map(function(k){return '<text class="lfobl" data-k="'+k+'" x="4" y="'+(21+k*8.5)+'" font-size="5.6" fill="#d8efe6" font-family="Arial"></text>'}).join("");
  if(C.obsc)bd='<g transform="scale('+C.obsc+')">'+bd+'</g>';
  C.walls.push('<g class="lfob">'+lfFaceY(u,0,z,bd)+'</g>');
}
function lfStandBoard(C,u,title){
  C.add(u+.3,lfBox(u+.15,.25,0,.1,.1,72,"#5a3a22")+lfBox(u+1.75,.25,0,.1,.1,72,"#5a3a22"));
  lfOrderBoard(C,u,74,title);
}

/* tips: small and capped per room per day so the Loft never out-earns real quests */
function lfTipCap(r,mods){return 10*(3+Math.floor(addonsOf(r).length/4)+Math.min(2,mods.tip))}
function lfTipFor(i,r,wt,mods){
  var t=today(),T=S.base.tipd;if(!T||T.d!==t)T=S.base.tipd={d:t,n:{}};
  var n=T.n[i]||0,cap=lfTipCap(r,mods);if(n>=cap)return 0;
  var tip=10*(1+(wt<22?1:0));tip=Math.min(tip,cap-n);T.n[i]=n+tip;return tip;
}
function lfTipsLeft(i,r){var T=S.base.tipd,t=today(),n=T&&T.d===t?(T.n[i]||0):0;return Math.max(0,lfTipCap(r,lfSvcMods(r))-n)}
window.lfDbg={S:function(){return S},lines:lfBoardLines,orders:lfOrders,panel:lfPanelHtml};

/* staff stand next to a customer: explicit spot, else the free point around them closest to the room centre */
function lfApproach(C,z){
  if(z.wx!=null)return {x:z.wx,y:z.wy!=null?z.wy:z.y+.9};
  if(z._ap)return z._ap;
  var best=null,bd=1e9,cx=C.W/2,cy=C.D/2,others=C.st.filter(function(o){return o!==z&&(o.cust||o.plot)});
  [.8,1.1,1.4].some(function(rad){
    for(var k=0;k<16;k++){var an=k*Math.PI/8,x=z.x+Math.cos(an)*rad,y=z.y+Math.sin(an)*rad;if(lfBlockedAt(C,x,y))continue;
      if(others.some(function(o){return Math.hypot(o.x-x,o.y-y)<.6}))continue;
      var d=Math.hypot(x-cx,y-cy)+rad*2;if(d<bd){bd=d;best={x:x,y:y}}}
    return !!best});
  z._ap=best||{x:z.x,y:z.y+.9};return z._ap;
}
/* two staff never stand on the same spot */
function lfSpread(a,p){
  var C=lfC(a),q={x:p.x,y:p.y},offs=[[0,0],[0,.55],[.55,0],[0,-.55],[-.55,0],[.5,.5]];
  for(var k=0;k<offs.length;k++){var x=p.x+offs[k][0],y=p.y+offs[k][1],clash=false;
    Object.keys(LFA).forEach(function(id){var b=LFA[id];if(b===a||b.room!==a.room||b.alpha<.3)return;if(b.role!=="crew"&&b.mode==="walk")return;var bx=b.mode==="walk"?b.tx:b.x,by=b.mode==="walk"?b.ty:b.y;if(b.mode==="walk"&&b.wp&&b.wp.length){bx=b.wp[b.wp.length-1][0];by=b.wp[b.wp.length-1][1]}if(Math.hypot(bx-x,by-y)<.4)clash=true});
    if(!clash&&(!C||k===0||!lfBlockedAt(C,x,y))){q.x=x;q.y=y;break}}
  return Object.assign({},p,q);
}
window.lfDbg.tick=lfPlotTick;
window.lfDbg.approach=lfApproach;window.lfDbg.path=lfPath;window.lfDbg.spread=lfSpread;

/* ---------- rooms v3: every room runs a service loop ---------- */
function lfChair(C,x,y,col){col=col||"#8a5a3a";
  C.add(x+y+.3,lfBox(x-.2,y-.2,0,.4,.4,10,lfSh(col,-.25),{top:col})+lfBox(x-.2,y-.24,10,.4,.08,16,lfSh(col,-.1),{top:col}))}
function lfGlow(x,y,z,r,col,cls){var p=lfP(x,y,z);return '<circle class="'+(cls||"lfglow")+'" cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="'+r+'" fill="'+col+'"/>'}
function lfCandle(x,y){var p=lfP(x,y,6);return '<g class="lfcandle"><rect x="'+(p[0]-1.5)+'" y="'+(p[1]-6)+'" width="3" height="6" fill="#f4ecd8"/><path d="M'+p[0]+' '+(p[1]-11)+' q2 3 0 5 q-2 -2 0 -5Z" fill="#ffcf5a"/><circle cx="'+p[0]+'" cy="'+(p[1]-8)+'" r="6" fill="rgba(255,200,90,.25)"/></g>'}
function lfSteam(x,y,z,n){var p=lfP(x,y,z),s="";for(var i=0;i<(n||3);i++)s+='<circle class="lfrise" style="animation-delay:'+(i*.7).toFixed(1)+'s" cx="'+(p[0]+(i-1)*4)+'" cy="'+p[1]+'" r="'+(3+i)+'" fill="rgba(255,255,255,.35)"/>';return s}
function lfConvert(C,n0,kind,o){C.st.slice(n0).forEach(function(s){if(kind&&s.kind!==kind)return;s.kind="cust";s.cust=1;Object.assign(s,o)})}
function lfNum(C,g){C.nm=C.nm||{};C.nm[g]=(C.nm[g]||0)+1;return C.nm[g]}

/* ===== restaurant ===== */
function lfDining(C,X,Y){
  C.box(X,Y,0,1.4,1.1,15,"#a9763f",{dk:.2,top:"#e2c590"});
  C.add(X+1.4+Y+1.1+.5,lfBox(X-.6,Y+.2,0,.5,.5,2,"#555")+lfBox(X-.55,Y+.25,2,.4,.4,10,"#d9534f")+lfBox(X+1.5,Y+.2,0,.5,.5,2,"#555")+lfBox(X+1.55,Y+.25,2,.4,.4,10,"#d9534f")+lfBox(X+.3,Y+.4,15,.4,.4,3,"#f6f0e0")+lfBox(X+.9,Y+.5,15,.3,.3,5,"#6cb86a"));
  var n=lfNum(C,"t");
  lfCust(C,X-.28,Y+.48,1,{sit:1,tag:"diner",uact:"eat",wx:X+.3,wy:Y+1.45,num:n,grp:"t"});
  lfCust(C,X+1.78,Y+.48,-1,{sit:1,tag:"diner",uact:"eat",wx:X+1.1,wy:Y+1.45,num:n,grp:"t"});
}
function lfRsK(C,tier,k0,k1,k2){var ks=[k0,k1,k2],k=ks[tier-1];return (window.LFSPR&&LFSPR[k])?k:(ks[1]||k)}
function lfRsT(C){return C.has("r_tab2")?3:C.has("r_tab1")?2:1}
function lfDine(C,X,Y,big){var t=lfRsT(C),k=big?lfRsK(C,t,"rs0_tbl4","rs_tbl4","rs3_tbl4"):lfRsK(C,t,"rs0_tbl2","rs_tbl2","rs3_tbl2"),w=big?2.2:1.7,d=1.7;
  lfSpr(C,k,X,Y,w,d,{h:22,ctr:1});
  C.s("sit",X+.05,Y+.55,1,"eat",[10,20],{dk:99,tag:"diner",lift:1,wx:X+.6,wy:Y+1.8,tb:[X,Y]});
  C.s("sit",X+w-.1,Y+.55,-1,"eat",[10,20],{dk:99,tag:"diner",lift:1,wx:X+1.2,wy:Y+1.8,tb:[X,Y]}); }
function lfCStool(C,x,y,tbx,tby){var t=C.has("r_stl2")?3:C.has("r_stl1")?2:1;lfSpr(C,lfRsK(C,t,"rs0_stool","rs2_stool","rs3_stool"),x-.3,y-.3,.6,.6,{h:30,H:t===3?58:50,dk:-1});
  var n0=C.st.length;C.s("sit",x,y,1,"eat",[10,20],{dk:99,tag:"diner",lift:1,wx:x,wy:y+.9,tb:[tbx,tby]});lfConvert(C,n0,"sit",{uact:"eat",lbl:"S",grp:"s"})}
LFROOM.restaurant=function(C){
  var H=function(k){return C.has(k)};
  lfDoorAt(C,19);
  /* back wall (y=0): kitchen pass-through behind the diner counter */
  lfSpr(C,"w_pass",7.6,.05,.1,.05,{flip:1,h:1,H:150,dy:-8,nosh:1});
  C.obsc=.7;lfOrderBoard(C,1.7,96,"ORDERS");
  /* left wall windows over the booth row */
  [3.7,7.0,10.3].forEach(function(y){lfSprWin(C,"w_winrs2",.05,y,.1,.05,{H:92,dy:-34})});
  /* diner counter + stools (counter ladder: laminate, marble, black marble and gold) */
  var ct=H("r_ctr2")?3:H("r_ctr1")?2:1;
  lfSpr(C,lfRsK(C,ct,"rs0_counter","rs2_counter","rs3_counter"),3.6,2.4,8.4,1.1,{h:34,flip:1,ctr:1,dk:6.5});
  lfPrep(C,"pass",7.8,1.5);
  C.s("work",6.4,1.4,-1,"work",[8,16],{tag:"cook"});C.s("work",9.2,1.4,-1,"work",[6,10],{tag:"prep"});
  [4.7,6.0,7.3,8.6,9.9,11.2].forEach(function(x){lfCStool(C,x,4.1,x,3.0)});
  /* wall row: small tables, upgraded to booths, then velvet banquettes */
  [2.4,5.7,9.0].forEach(function(Y){
    if(H("r_booth")){var n0=C.st.length,lux=H("r_booth2");lfSpr(C,lux?"rsb_l1":"rsb_t2",.05,Y,3.0,2.6,{h:34,ctr:1});
      C.s("sit",.9,Y+1.3,1,"eat",[10,20],{dk:99,tag:"diner",lift:1,wx:1.7,wy:Y+2.6,tb:[1.7,Y+1.3]});C.s("sit",2.6,Y+1.3,-1,"eat",[10,20],{dk:99,tag:"diner",lift:1,wx:1.7,wy:Y+2.6,tb:[1.7,Y+1.3]});
      lfConvert(C,n0,"sit",{uact:"eat",lbl:"B",grp:"b"})}
    else lfDine(C,.6,Y+.5,false)});
  /* floor tables */
  [[6.0,6.8],[10.0,6.8]].forEach(function(p){lfDine(C,p[0],p[1],false)});
  if(H("r_tbl2")){lfDine(C,14.0,6.8,false);lfDine(C,5.6,9.6,true);lfDine(C,9.8,9.6,false);lfDine(C,13.6,9.6,true)}
  lfWander(C,[[5,5.5,-1],[9,5.5,1],[13,5.5,-1],[18,6,1],[4.6,10.6,-1],[12,8.8,1]]);
  if(H("r_bar")){lfSpr(C,"rs2_bar",12.0,2.4,4.6,1.1,{h:34,flip:1,ctr:1,dk:3.5});
    lfSpr(C,"w_backbar",14.5,.05,.1,.05,{flip:1,h:1,H:118,dy:-30,nosh:1});lfLight(C,14.5,1.0,70,"#ffb860",2.4,.4);
    [12.9,14.2,15.5].forEach(function(x){lfCStool(C,x,4.1,x,3.0)})}
  if(H("r_oven")){lfSpr(C,"w_ovenwin",11.5,.05,.1,.05,{h:1,flip:1,H:92,dy:-14,nosh:1});C.s("work",11.4,1.3,-1,"work",[6,12],{tag:"oven"});lfLight(C,11.5,.9,40,"#ff9a3a",1.6,.6)}
  if(H("r_coffee"))lfSpr(C,"rs_coffee",17.2,.2,1.5,1.0,{h:26,flip:1,H:70,ctr:1});
  if(H("r_chan")){[[7.6,7.6],[12.0,7.6],[9.8,10.4]].forEach(function(p){lfSpr(C,"rs3_chand",p[0],p[1],.2,.2,{h:1,H:112,dy:-84,nosh:1,dk:-6});lfLight(C,p[0],p[1],90,"#ffd890",3.2,.55)})}
  else if(H("r_pend")){[5.4,8.0,10.6].forEach(function(x,i){lfSpr(C,["rs_pend1","rs_pend2","rs_pend3"][i],x,3.0,.2,.2,{h:1,H:[84,92,88][i],dy:-70,nosh:1,dk:-5});lfLight(C,x,3.2,70,"#ffc968",2.3,.45)})}
  if(H("r_host")){lfSpr(C,"rs_host",20.0,1.4,.8,.8,{h:30,flip:1,H:64});C.s("work",20.4,2.6,-1,"work",[6,12],{tag:"host"})}
  if(H("r_plants")){lfSpr(C,"bd_plant",4.0,11.0,.8,.8,{h:40,H:78});lfSpr(C,"bd_plant",19.6,10.4,.8,.8,{h:40,H:78})}
  if(H("r_flora")){lfSpr(C,"rs3_flora",18.2,3.6,.8,.8,{h:40,H:70});lfSpr(C,"rs3_flora",2.2,11.6,.8,.8,{h:40,H:70})}
  if(H("r_dessert"))lfSpr(C,"rs_dessert",18.0,6.6,1.6,.8,{h:30,H:80});
  if(H("r_wine2"))lfSpr(C,"rs3_cellar",.4,.4,1.4,1.2,{h:50,ctr:1,H:104});
  else if(H("r_wine"))lfSpr(C,"rs_wine",.05,1.2,.1,.1,{h:1,H:60,dy:-30,nosh:1});
  if(H("r_chef"))lfSpr(C,"rs_chef",3.0,.05,.1,.05,{h:1,flip:1,H:26,dy:-112,nosh:1});
  if(H("r_star"))lfSpr(C,"rs_star",.05,2.9,.1,.1,{h:1,H:34,dy:-108,nosh:1});
  if(H("r_mirror"))lfSpr(C,"w_mirror3",.05,11.2,.1,.1,{h:1,H:84,dy:-30,nosh:1});
  if(H("r_art")){lfSpr(C,"w_neonrs",4.1,.05,.1,.05,{h:1,flip:1,H:54,dy:-84,nosh:1});lfLight(C,3.6,1.0,100,"#ff6aa8",2.2,.35);lfSpr(C,"w_menu",17.7,.05,.1,.05,{h:1,flip:1,H:56,dy:-96,nosh:1})}
};
SVC.restaurant={lbl:"T",unit:"Table",boardName:"Order board",verbs:["Waiting","In kitchen","Eating"],short:["wait","cook","eat"],quiet:"Kitchen quiet",
  staffIx:function(n){return n>=2?1:0},
  menu:function(r){var d=dishesOn(r).map(function(k){return DISHES[k][0].split(" ").pop()});return d.length?d:["Coffee","Pizza","Tacos","Burger","Pasta"]},
  use:"eat",udur:[12,22],pat:80,
  guests:function(r,C,n){return 2+dishesOn(r).length+(C.has("r_tbl2")?2:0)+(C.has("r_chef")?1:0)},
  steps:function(s,X){var A=X.A(s),P=X.P("pass");return [{x:A.x,y:A.y,act:"reach",tag:"order",dur:[1.2,1.9]},{x:P.x,y:P.y,act:"carry",tag:"serve",dur:[1.6,2.4],fx:-1},{x:A.x,y:A.y,act:"reach",tag:"place",dur:[1.1,1.6],carry:1}]}};

/* ===== bar ===== */
LFROOM.bar=function(C){
  C.walls.push(lfWindow(3.4,C.wx));C.decals.push(lfWinLight(3.4));
  C.box(1.35,1.0,0,.8,3.6,26,"#5a3a28",{top:"#a96e3c",dk:.3});C.box(1.2,.9,26,1.1,3.8,3,"#c98f58",{top:"#e0aa70",dk:.2});
  for(var k=0;k<3;k++){lfStool(C,2.9,1.7+k*1.2,"#c9546a");lfCust(C,2.92,1.7+k*1.2,-1,{sit:1,tag:"stool",stool:1,uact:"eat",lbl:"S",grp:"s",num:k+1})}
  C.s("work",.75,2.6,1,"work",[6,14],{tag:"pour"});C.s("work",.75,4.0,1,"work",[5,10],{tag:"wipe"});
  lfPrep(C,"bar",.75,3.3);
  lfWander(C,[[4.6,2.0,-1],[4.2,4.4,1],[3.6,3.4,-1]]);
  lfOrderBoard(C,6.0,96,"BAR TAB");
  if(C.has("b_shelf")){var sh='<rect width="'+LF.U*3.4+'" height="6" fill="#6a4426"/>';for(var r=0;r<3;r++){sh+='<g transform="translate(0,'+(r*22)+')"><rect x="2" y="20" width="'+(LF.U*3.4-4)+'" height="4" fill="#b9854e"/>'+Array.apply(0,Array(11)).map(function(_,i){var cl=["#3a8ad9","#d9534f","#4fb58a","#e8a33a","#9a5ad9"][(i+r)%5];return '<rect x="'+(5+i*8.6)+'" y="'+(6+((i*7)%4))+'" width="6.4" height="14" rx="2" fill="'+cl+'" stroke="rgba(0,0,0,.4)" stroke-width=".6"/><rect x="'+(6.2+i*8.6)+'" y="'+(2+((i*7)%4))+'" width="3" height="5" fill="'+cl+'"/><rect x="'+(5.6+i*8.6)+'" y="'+(8+((i*7)%4))+'" width="1.6" height="9" fill="rgba(255,255,255,.4)"/>'}).join("")+'</g>'}
    C.walls.push(lfFaceX(0,4.9,86,sh))}
  if(C.has("b_neon"))lfLight(C,1.5,1.2,90,"#ff5c9a",3.4,.8);if(C.has("b_neon"))C.walls.push('<g class="lfneon">'+lfNeonTxt("R",.7,96,"BAR","#ff5c9a",20)+'</g>');
  if(C.has("b_juke"))lfJuke(C,4.8,.3);
  if(C.has("b_menu"))C.walls.push(lfFrame("R",3.45,90,60,44,'<rect width="60" height="44" fill="#233"/><text x="6" y="14" font-size="9" fill="#fff" font-family="Arial" font-weight="700">HOUSE</text><path d="M6 20 H54 M6 28 H48 M6 36 H52" stroke="#ffd27a" stroke-width="1.6"/>',"#8a6a3a"));
  if(C.has("b_taps")){C.add(1.5+.4+4.2+.2,lfBox(1.45,1.6,29,.25,.25,8,"#c9ced8")+lfBox(1.45,2.4,29,.25,.25,8,"#c9ced8")+lfBox(1.45,3.2,29,.25,.25,8,"#c9ced8"))}
  if(C.has("b_snack"))C.add(1.2+1.1+.9+3.8+.1,lfBox(1.45,3.9,29,.35,.35,4,"#c9a06a",{top:"#e8c07a"}));
  if(C.has("b_pool"))lfPool(C,3.8,6.0);
  if(C.has("b_dj")){C.box(4.0,4.4,0,1.6,1.1,18,"#2a2438",{dk:.2});C.add(4.0+1.6+4.4+1.1+.1,lfBox(4.2,4.6,18,.6,.5,2,"#111")+'<ellipse class="lfspin" cx="'+lfP(4.5,4.85,20)[0]+'" cy="'+lfP(4.5,4.85,20)[1]+'" rx="7" ry="3" fill="#4dd2ff"/><ellipse class="lfspin" cx="'+lfP(5.2,4.85,20)[0]+'" cy="'+lfP(5.2,4.85,20)[1]+'" rx="7" ry="3" fill="#ff5c9a"/>');C.s("work",4.8,3.8,1,"work",[10,20])}
  if(C.has("b_hightop"))[[5.9,1.6],[6.6,3.2]].forEach(function(p,j){C.add(p[0]+p[1]+.7,lfBox(p[0]+.25,p[1]+.25,0,.1,.1,24,"#333")+lfBox(p[0],p[1],24,.6,.6,3,"#3a2a20",{top:"#7a5a3a"}));lfCust(C,p[0]+.3,p[1]+1.0,-1,{wact:"look",uact:"eat",lbl:"H",grp:"h",num:j+1})});
  if(C.has("b_lounge")){var n0=C.st.length;lfSofa(C,.4,5.7,2.4,"#5a2a4a");lfConvert(C,n0,"sit",{uact:"eat",lbl:"V",grp:"v",wy:5.3})}
  if(C.has("b_rare")){var wh='<rect width="'+LF.U*1.4+'" height="30" fill="#3a2214" stroke="'+LFOL+'"/>';for(var i=0;i<5;i++)wh+='<rect x="'+(4+i*7.6)+'" y="6" width="5" height="18" rx="1.5" fill="'+["#c9822a","#a85a1a","#e0a040"][i%3]+'" stroke="rgba(0,0,0,.4)" stroke-width=".5"/>';C.walls.push(lfFaceY(.6,0,64,wh))}
};
SVC.bar={lbl:"S",unit:"Seat",boardName:"Bar tab",verbs:["Waiting","Mixing","Drinking"],short:["wait","mix","sip"],quiet:"Bar is quiet",
  menu:["Mule","Sour","Lager","Negroni","Spritz","Old Fash"],use:"eat",udur:[10,18],pat:80,
  guests:function(r,C,n){return 2+Math.floor(addonsOf(r).length/2)},
  steps:function(s,X){if(s.stool)return [{x:.75,y:s.y,act:"work",tag:"mix",dur:[2.2,3.2],fx:1}];var P=X.P("bar"),A=X.A(s);return [{x:P.x,y:P.y,act:"work",tag:"mix",dur:[2,3],fx:1},{x:A.x,y:A.y,act:"reach",tag:"place",dur:[1,1.5],carry:1}]}};

/* ===== sky lounge (rooftop) ===== */
LFROOM.sky=function(C){
  C.out=1;
  C.box(.6,.9,0,.9,3.4,17,"#2a2f55",{top:"#4a5190",dk:.2});C.box(2.6,3.4,0,1.2,.6,12,"#e8e0d0",{top:"#fff",dk:.1});C.box(4.0,3.4,0,1.2,.6,12,"#e8e0d0",{top:"#fff",dk:.1});
  lfCust(C,3.2,4.5,-1,{sit:1,tag:"chair",uact:"eat",lbl:"C",grp:"c",num:1});lfCust(C,4.6,4.5,-1,{sit:1,tag:"chair",uact:"eat",lbl:"C",grp:"c",num:2});
  C.s("work",1.9,2.4,-1,"work",[8,14],{tag:"pour"});lfPrep(C,"skybar",1.9,2.4);
  lfWander(C,[[4.6,2.0,-1],[3.0,2.6,1],[6.4,6.6,-1]]);
  lfStandBoard(C,5.9,"ROOFTOP");
  if(C.has("k_lights"))for(var k=0;k<7;k++){var p=lfP(.5+k*1.1,.3,92+Math.sin(k)*3);C.front.push('<circle class="lftwk" style="animation-delay:'+(k*.37).toFixed(2)+'s" cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3" fill="#fff3b0"/><circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="9" fill="rgba(255,243,176,.3)"/>')}
  if(C.has("k_fire")){lfLight(C,4.0,2.2,14,"#ff9d3a",3.2,.9);var f=lfP(4.0,2.2,0);C.add(6.3,lfBox(3.6,1.8,0,.9,.9,8,"#7a6a60",{top:"#3a302c"})+'<path class="lfflick" d="M'+(f[0]-6)+' '+(f[1]-4)+' q4 -20 8 -8 q6 -20 8 8Z" fill="#ff9d3a"/><path class="lfflick" style="animation-delay:.3s" d="M'+(f[0]-2)+' '+(f[1]-4)+' q2 -12 4 -4 q4 -12 5 4Z" fill="#ffd24a"/>');lfCust(C,4.8,2.5,-1,{sit:1,uact:"eat",lbl:"F",grp:"f",num:1,wx:5.7,wy:2.7})}
  if(C.has("k_cabana")){C.add(9,lfBox(4.2,.5,0,1.5,1.4,12,"#e8e0d0",{top:"#fff"})+lfBox(4.2,.5,12,1.5,.3,16,"#d8c8b8",{top:"#e8dccc"})+[[4.2,.5],[5.6,.5],[4.2,1.8],[5.6,1.8]].map(function(p){return lfBox(p[0],p[1],12,.1,.1,34,"#8a6a4a")}).join("")+lfBox(4.15,.45,46,1.7,1.5,2,"#ff9db8",{top:"#ffc0d0"}));lfCust(C,4.6,1.0,1,{sit:1,uact:"eat",lbl:"J",grp:"j",num:1,wx:3.9,wy:1.0});lfCust(C,5.3,1.5,-1,{sit:1,uact:"eat",lbl:"J",grp:"j",num:2,wx:6.15,wy:1.6})}
  if(C.has("k_day"))[[5.4,4.6],[5.4,5.9]].forEach(function(p,j){C.add(p[0]+p[1]+1.4,lfBox(p[0],p[1],0,1.5,.75,10,"#e8e0d0",{top:"#ffffff"})+lfBox(p[0],p[1],10,.3,.75,6,"#ffd27a",{top:"#ffe6a0"}));lfCust(C,p[0]+.8,p[1]+.38,1,{lie:1,uact:"lie",lz:12,lbl:"D",grp:"d",num:j+1,wx:p[0]+.8,wy:p[1]+1.1})});
  if(C.has("k_scope")){C.add(7.4,lfBox(6.8,2.6,0,.06,.06,30,"#444")+lfBox(6.55,2.5,30,.6,.18,8,"#c9ced8",{top:"#e6eaf2"}));lfCust(C,6.9,3.2,-1,{wact:"look",uact:"look",lbl:"T",grp:"tl",num:1,menu:["Stargaze","Sake"]})}
  if(C.has("k_dj")){C.add(6.6+1.2+.6,lfBox(6.6,1.2,0,1.0,.6,22,"#1e1a2a",{top:"#2a2440"})+'<ellipse class="lfspin" cx="'+lfP(7.0,1.5,23)[0]+'" cy="'+lfP(7.0,1.5,23)[1]+'" rx="6" ry="2.6" fill="#ffb36b"/>');C.s("work",7.1,.75,1,"work",[10,20],{tag:"dj"})}
};
SVC.sky={lbl:"C",unit:"Spot",boardName:"Rooftop orders",verbs:["Waiting","Mixing","Sipping"],short:["wait","mix","sip"],quiet:"Sunset calm",
  menu:["Spritz","Champagne","Sake","Mojito","Sunset"],use:"eat",udur:[14,24],pat:85,
  guests:function(r,C,n){return 2+Math.floor(addonsOf(r).length/2)},
  steps:function(s,X,item){var P=X.P("skybar"),A=X.A(s);return [{x:P.x,y:P.y,act:"work",tag:"mix",dur:[2,3],fx:1},{x:A.x,y:A.y,act:"reach",tag:item==="Bottle"?"bottle":"place",dur:[1.1,1.6],carry:1}]}};

/* ===== garden ===== */
var LFCROPC={Tomato:"#e8453a",Carrot:"#ff8a2e",Lettuce:"#9be05a",Pepper:"#ffcf3a",Berry:"#ff3d6a",Wheat:"#e6c34a",Rice:"#d9e6a0",Corn:"#ffd84a",Eggs:"#fff3e0",Milk:"#ffffff"};
function lfBubble(x,y,txt){var w=Math.max(18,txt.length*5.2+8);return '<g transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')"><g class="lfbob2"><rect x="'+(-w/2)+'" y="-9" width="'+w+'" height="14" rx="5" fill="rgba(255,255,255,.95)" stroke="rgba(0,0,0,.3)" stroke-width=".7"/><text y="1.6" text-anchor="middle" font-size="7.6" font-weight="700" fill="#2a5a8a" font-family="Arial">'+txt+'</text></g></g>'}
function lfBedPlot(x0,y0,len,crop){return function(st){
  var g="",n=Math.max(3,Math.round(len/.35)),col=LFCROPC[st.crop]||"#e8453a",dry=st.need==="Water";
  for(var i=0;i<n;i++){var p=lfP(x0+.18+i*(len-.36)/(n-1),y0+.4,8.6),sz=st.stage===0?.45:st.stage===1?.8:1,lc=dry?"#a8a040":(i%2?"#2f9a4a":"#3fae5a");
    var h=(st.crop==="Lettuce"?7:11)*sz;
    g+='<g class="lfsway" style="animation-delay:'+(i*.21).toFixed(2)+'s"><path d="M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' q-'+(4*sz).toFixed(1)+' -'+(h*.7).toFixed(1)+' -'+(6*sz).toFixed(1)+' -'+(h*.5).toFixed(1)+' M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' q'+(4*sz).toFixed(1)+' -'+h.toFixed(1)+' '+(7*sz).toFixed(1)+' -'+(h*.7).toFixed(1)+' M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' v-'+h.toFixed(1)+'" stroke="'+lc+'" stroke-width="'+(dry?1.4:1.9)+'" fill="none"/>';
    if(st.stage>=2)g+='<circle cx="'+(p[0]+(i%2?3:-3)).toFixed(1)+'" cy="'+(p[1]-h*.7).toFixed(1)+'" r="2.8" fill="'+col+'" stroke="rgba(0,0,0,.3)" stroke-width=".5"/>';
    g+='</g>'}
  var c=lfP(x0+len/2,y0+.4,30);
  if(st.need==="Water")g+=lfBubble(c[0],c[1],"Water");else if(st.need==="Harvest")g+=lfBubble(c[0],c[1],"Ripe!");
  return g}}
function lfGdPlot(wx,wy){return function(st){var p=lfP(wx,wy,34);if(st.need==="Water")return lfBubble(p[0],p[1],"Water");if(st.need==="Harvest")return lfBubble(p[0],p[1],"Ripe!");return ""}}
LFROOM.garden=function(C){
  C.out=1;var crops=["Tomato","Carrot","Lettuce","Pepper"].concat(C.has("g_berry")?["Berry"]:[]),pid=0;
  var bed=function(key,x,y,np){lfSpr(C,key,x,y,3.4,1.5,{ctr:1,h:20,dk:1});
    for(var k=0;k<np;k++){pid++;var cx=x+3.4*(k+.5)/np,cy=y+.8;var s=lfPlotS(C,"g"+pid,cx,cy,{crops:crops,wx:cx,wy:y+1.9});s.draw=lfGdPlot(cx,cy);C.add(x+3.4+y+1.5+.1,lfPlotInit(C,s))}};
  bed("gd_bed1",1.4,1.8,2);bed("gd_bed2",1.4,5.2,2);if(C.has("g_box"))bed("gd_bed1",1.4,8.6,2);
  /* fences along both edges, planter trellis in the corner */
  for(var fx=.2;fx<15.4;fx+=1.7)lfSpr(C,"w_gfence",fx,.08,1.6,.1,{flip:1,h:1,H:50,ctr:1,nosh:1,dk:-1});
  for(var fy=.2;fy<12.4;fy+=1.7)lfSpr(C,"w_gfence",.05,fy,.1,1.6,{h:1,H:50,ctr:1,nosh:1,dk:-1});
  lfSpr(C,"w_gtrel",12.0,.2,1.7,1.0,{flip:1,h:30,ctr:1,H:104});
  if(C.has("g_koi")){lfSpr(C,"gd_koi",9.4,2.2,2.4,2.0,{h:18,ctr:1,dk:1});lfBlock(9.4,2.2,11.8,4.2)}
  if(C.has("g_berry")){lfSpr(C,"gd_berry",9.8,5.8,2.2,1.6,{ctr:1,h:20,dk:1});pid++;var sb=lfPlotS(C,"g"+pid,10.9,6.6,{crops:["Berry"],wx:10.9,wy:7.7});sb.draw=lfGdPlot(10.9,6.6);C.add(12.0+7.4+.1,lfPlotInit(C,sb))}
  if(C.has("g_green")){lfSpr(C,"gd_green",10.2,9.0,2.8,2.0,{ctr:1,h:60,dk:1});pid++;var sg=lfPlotS(C,"g"+pid,11.6,10.0,{crops:["Pepper","Tomato","Berry"],wx:11.6,wy:11.4,t1:10,t2:18});sg.draw=lfGdPlot(11.6,10.0);C.add(13.0+11+.1,lfPlotInit(C,sg));lfLight(C,11.6,10.0,40,"#c89aff",2.4,.4)}
  lfSpr(C,"gd_crate",14.0,1.4,1.0,.9,{h:18,H:46});lfPrep(C,"crate",13.6,2.7);
  C.s("smell",6.4,.9,-1,"smell",[5,9],{tag:"smell"});
  lfWander(C,[[6.8,4.0,-1],[7.0,9.0,1],[13.0,6.0,-1],[1.0,11.6,1]]);
  lfStandBoard(C,8.0,"PLOTS");
  if(C.has("g_spr")){[[2.2,1.7],[4.2,1.7],[2.2,4.7],[4.2,4.7]].forEach(function(p){var q=lfP(p[0],p[1],6);C.add(p[0]+p[1]+.2,'<rect x="'+(q[0]-1.5)+'" y="'+(q[1]-6)+'" width="3" height="6" fill="#aab"/><path d="M'+q[0]+' '+(q[1]-8)+' q-12 -14 -18 -4 M'+q[0]+' '+(q[1]-8)+' q12 -14 18 -4" stroke="rgba(180,225,255,.8)" stroke-width="1.4" fill="none" class="lfmist"/>')})}
  if(C.has("g_lamp")){[3.9,6.9].forEach(function(y){lfSpr(C,"gd_lamp",6.4,y,.8,.8,{h:40,H:86,dk:-1});lfLight(C,6.7,y+.3,60,"#d68aff",2.8,.7)})}
  if(C.has("g_bee")){lfSpr(C,"gd_bee",.4,12.0,.9,.9,{h:30,H:70});var bp=lfP(.7,12.3,40);for(var b=0;b<4;b++)C.front.push('<circle class="lfbee" style="animation-delay:'+(b*.6)+'s" cx="'+bp[0]+'" cy="'+bp[1]+'" r="1.6" fill="#2a2a2a"/>')}
  if(C.has("g_scare"))lfSpr(C,"gd_scare",6.4,11.8,.7,.7,{h:50,H:100});
};
SVC.garden={kind:"prod",lbl:"P",lblName:"Plot",boardName:"Plots",quiet:"All growing",menu:["Tomato","Carrot","Lettuce","Pepper"],
  rate:function(C){return (C.has("g_lamp")?.3:0)+(C.has("g_bee")?.2:0)},auto:function(C){return C.has("g_spr")||LFW.wx==="rain"},
  plotSteps:function(s,X,need){var A=X.A(s),P=X.P("crate");if(need==="Water")return [{x:A.x,y:A.y,act:"water",tag:"water",dur:[2.4,3.4]}];return [{x:A.x,y:A.y,act:"reach",tag:"harvest",dur:[1.8,2.6]},{x:P.x,y:P.y,act:"reach",tag:"crate",dur:[1,1.5],carry:1,fx:-1}]}};

/* ===== farm ===== */
function lfRowPlot(x0,y0,len,tall){return function(st){
  var g="",R=lfSeed(Math.floor(x0*10+y0*7)),n=Math.round(len/.16),col=LFCROPC[st.crop]||"#e6c34a",dry=st.need==="Water";
  for(var i=0;i<n;i++){var p=lfP(x0+.08+i*.16,y0+.1+R()*.3,4),h=(tall?20:12)*(st.stage===0?.35:st.stage===1?.75:1)*(.8+R()*.3),c=st.stage>=2?col:dry?"#a8a040":"#5cae4a";
    g+='<g class="lfsway" style="animation-delay:'+((i%7)*.18).toFixed(2)+'s"><path d="M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+' v-'+h.toFixed(0)+'" stroke="'+(st.stage>=2&&!tall?col:"#4f9a3a")+'" stroke-width="1.6"/>'+(st.stage>=1?'<ellipse cx="'+p[0].toFixed(1)+'" cy="'+(p[1]-h).toFixed(1)+'" rx="1.6" ry="'+(tall?4:3.2)+'" fill="'+c+'"/>':'')+'</g>'}
  var c2=lfP(x0+len/2,y0+.25,tall?34:26);
  if(st.need==="Water")g+=lfBubble(c2[0],c2[1],"Water");else if(st.need==="Harvest")g+=lfBubble(c2[0],c2[1],"Ripe!");
  return g}}
function lfAnimalPlot(x,y,label){return function(st){var c=lfP(x,y,36);return st.need?lfBubble(c[0],c[1],label):""}}
LFROOM.farm=function(C){
  C.out=1;var crops=["Wheat","Rice"];
  for(var r=0;r<4;r++){var y=1.0+r*.95;C.add(3.5+y+.6,lfBox(.9,y,0,3.6,.5,4,"#7a5230",{top:"#6a4426"}));var s=lfPlotS(C,"f"+r,2.7,y+.25,{crops:crops,wx:2.7,wy:y+.73});s.draw=lfRowPlot(.9,y,3.6,false);C.add(3.5+y+.62,lfPlotInit(C,s))}
  C.add(6,lfBox(5.0,1.2,0,.14,.14,38,"#8a5a30")+lfBox(4.6,1.2,24,1.0,.14,5,"#8a5a30")+lfBox(4.8,1.1,28,.5,.3,12,"#d9b070",{top:"#e8c890"})+'<g class="lfspin2" style="transform-origin:'+lfP(5.05,1.2,46)[0]+'px '+lfP(5.05,1.2,46)[1]+'px"><path d="M'+lfP(5.05,1.2,46)[0]+' '+(lfP(5.05,1.2,46)[1]-14)+' v28 M'+(lfP(5.05,1.2,46)[0]-14)+' '+lfP(5.05,1.2,46)[1]+' h28" stroke="#e8c890" stroke-width="3"/></g>');
  C.s("look",5.2,2.6,-1,"look",[3,6]);
  C.add(6.0+.8+2.2+.6,lfBox(6.0,2.2,0,.8,.6,12,"#a9763f",{top:"#7a5230"})+lfBox(6.06,2.26,12,.68,.48,3,"#e6c34a"));lfPrep(C,"crate",6.4,3.1);
  lfWander(C,[[4.8,4.2,-1],[2.0,5.6,-1],[7.2,6.0,1]]);
  lfStandBoard(C,5.9,"FIELDS");
  if(C.has("f_coop")){C.add(5.2+4+.5,lfBox(4.5,3.8,0,1.2,1.0,24,"#c0613a",{top:"#e07a50"})+lfBox(4.4,3.7,24,1.4,1.2,3,"#8a3a2a")+lfPoly([lfP(5.7,3.9,4),lfP(5.7,4.4,4),lfP(5.7,4.4,18),lfP(5.7,3.9,18)],"#2a1a14"));
    var ce=lfP(5.9,4.6,0);C.front.push('<g class="lfpeck"><ellipse cx="'+ce[0]+'" cy="'+(ce[1]-4)+'" rx="4" ry="3" fill="#fff"/><path d="M'+(ce[0]+3)+' '+(ce[1]-7)+' l3 1 l-3 1z" fill="#ff8a2e"/></g>');
    var se=lfPlotS(C,"egg",5.1,5.2,{animal:"Eggs",crops:["Eggs"],wx:5.4,wy:5.3,cycle:32});se.draw=lfAnimalPlot(5.1,4.3,"Eggs");C.add(9.6,lfPlotInit(C,se))}
  if(C.has("f_corn")){for(var r2=0;r2<2;r2++){var y2=5.0+r2*.95;C.add(3.5+y2+.6,lfBox(.9,y2,0,3.6,.5,4,"#7a5230",{top:"#6a4426"}));var s2=lfPlotS(C,"c"+r2,2.7,y2+.25,{crops:["Corn"],wx:2.7,wy:y2+.73,t2:34});s2.draw=lfRowPlot(.9,y2,3.6,true);C.add(3.5+y2+.62,lfPlotInit(C,s2))}}
  if(C.has("f_tractor")){C.add(5.6+6.4+.8,lfBox(5.6,6.4,6,1.5,.8,12,"#d9534f",{top:"#ff7a6a"})+lfBox(6.3,6.4,18,.6,.8,14,"#c0392b")+lfE(lfP(5.8,7.2,6)[0],lfP(5.8,7.2,6)[1],7,7,"#222")+lfE(lfP(6.8,7.2,8)[0],lfP(6.8,7.2,8)[1],5,5,"#222"))}
  if(C.has("f_silo")){C.add(7.6,lfBox(.3,6.5,0,1.0,1.0,90,"#c9ced8",{top:"#e6eaf2"})+lfBox(.25,6.45,90,1.1,1.1,6,"#8a93a6"))}
  if(C.has("f_cow")){C.add(7.8+5.0,lfBox(6.2,3.6,0,1.4,.06,12,"#8a5a30")+lfBox(6.2,3.6,0,.06,1.4,12,"#8a5a30")+lfBox(7.6,3.6,0,.06,1.4,12,"#8a5a30")+lfBox(6.2,5.0,0,1.4,.06,12,"#8a5a30"));
    C.add(6.9+4.3+.5,'<g class="lfgraze">'+lfBox(6.6,4.1,6,.9,.45,12,"#ffffff",{top:"#f2f2f2"})+lfBox(7.4,4.15,10,.3,.35,10,"#ffffff")+lfE(lfP(6.9,4.4,14)[0],lfP(6.9,4.4,14)[1],4,3,"#222")+'</g>');
    var sc=lfPlotS(C,"cow",6.0,4.4,{animal:"Milk",crops:["Milk"],wx:5.9,wy:4.6,cycle:44});sc.draw=lfAnimalPlot(7.0,4.3,"Milk");C.add(12,lfPlotInit(C,sc))}
  if(C.has("f_stand")){C.add(6.4+6.8+.9,lfBox(6.4,6.0,0,1.2,.6,18,"#a9763f",{top:"#c9a070"})+lfBox(6.5,6.05,18,.4,.4,4,"#e8453a")+lfBox(7.0,6.05,18,.4,.4,4,"#ffd84a"));lfCust(C,7.0,7.2,-1,{wact:"look",uact:"look",udur:[4,7],menu:["Eggs","Corn","Bread","Milk"],mx:false,lbl:"F",grp:"st",num:1,wx:7.0,wy:6.9})}
};
SVC.farm={kind:"prod",lbl:"R",lblName:"Row",boardName:"Fields",quiet:"Fields growing",menu:["Wheat","Rice"],unit:"Stand",verbs:["Waiting","Packing","Browsing"],short:["wait","pack","shop"],
  rate:function(C){return (C.has("f_tractor")?.3:0)},auto:function(C){return C.has("f_pump")||LFW.wx==="rain"},pat:70,use:"look",udur:[4,7],
  plotSteps:function(s,X,need){var A=X.A(s),P=X.P("crate");if(need==="Water")return [{x:A.x,y:A.y,act:"water",tag:"water",dur:[2.4,3.4]}];return [{x:A.x,y:A.y,act:"reach",tag:"harvest",dur:[1.8,2.6]},{x:P.x,y:P.y,act:"reach",tag:"crate",dur:[1,1.5],carry:1,fx:-1}]},
  steps:function(s,X){var P=X.P("crate"),A=X.A(s);return [{x:P.x,y:P.y,act:"reach",tag:"crate",dur:[1.2,1.8]},{x:A.x,y:A.y,act:"reach",tag:"place",dur:[1,1.4],carry:1}]}};

/* ===== pond ===== */
function lfSpotDraw(bx,by){return function(st){var p=lfP(bx,by,0),g='<g class="lfbobber"><circle cx="'+p[0]+'" cy="'+(p[1]-2)+'" r="2.4" fill="#ff5a4a"/><circle cx="'+p[0]+'" cy="'+(p[1]-3.6)+'" r="1.2" fill="#fff"/></g>';
  if(st.need){g+='<ellipse class="lfsplash" cx="'+p[0]+'" cy="'+p[1]+'" rx="8" ry="3.4" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1"/>'+lfBubble(p[0],p[1]-22,"Bite!")}return g}}
LFROOM.pond=function(C){
  C.out=1;var q=lfP(3.0,3.0,0);
  C.decals.push(lfPoly([lfP(.9,1.0,0),lfP(5.1,1.0,0),lfP(5.1,4.8,0),lfP(.9,4.8,0)],"#b9b4a6",LFOL,1)+lfPoly([lfP(1.1,1.2,0),lfP(4.9,1.2,0),lfP(4.9,4.6,0),lfP(1.1,4.6,0)],"#4fb8da")+lfPoly([lfP(1.1,1.2,0),lfP(4.9,1.2,0),lfP(4.9,1.9,0),lfP(1.1,1.9,0)],"rgba(255,255,255,.12)"));
  C.decals.push('<g class="lfripple">'+lfE(q[0]-20,q[1]+10,14,6,"none").replace('fill="none"','fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"')+'</g><g class="lfripple" style="animation-delay:-1.6s">'+lfE(q[0]+30,q[1]-6,12,5,"none").replace('fill="none"','fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1"')+'</g>');
  lfBlock(1.1,1.2,4.9,4.6);
  C.add(8,'<g class="lfswim">'+lfE(q[0]-12,q[1]-6,7,3,"#ff8a3a")+'</g><g class="lfswim" style="animation-delay:-3s">'+lfE(q[0]+22,q[1]+6,6,2.6,"#fff3e0")+'</g><g class="lfswim" style="animation-delay:-1.5s">'+lfE(q[0]+4,q[1]+14,6,2.4,"#ffd24a")+'</g>'+lfE(q[0]-40,q[1]+4,12,5,"#3fae5a")+lfE(q[0]+40,q[1]-8,10,4,"#3fae5a")+'<circle cx="'+(q[0]+40)+'" cy="'+(q[1]-10)+'" r="2.6" fill="#ff8ab8"/>');
  [[.5,.6],[5.4,.7],[.3,6.4],[5.6,5.6]].forEach(function(p,i){C.add(p[0]+p[1]+.3,lfBox(p[0]-.3,p[1]-.3,0,.6,.6,5+i,"#8a8f9c",{top:"#b5bac6"}))});
  var spots=[[.5,2.8,1.4,2.8,1],[3.2,5.5,3.2,4.3,-1]];
  if(C.has("p_dock")){C.add(5.0+2.4+.6,lfBox(4.4,2.2,2,1.6,.7,3,"#8a6a44",{top:"#a9865a"}));C.plat.push({x0:4.4,y0:2.2,x1:6.0,y1:2.9,z:5,key:5.0+2.4+.61});spots.push([4.7,2.55,3.9,2.6,1]);spots.push([5.6,4.0,4.6,3.9,1])}
  spots.forEach(function(sp,k){var s=lfPlotS(C,"s"+k,sp[0],sp[1],{fish:1,onspot:1,wx:sp[0],wy:sp[1],ff:sp[4]});s.draw=lfSpotDraw(sp[2],sp[3]);C.add(9+k*.01,lfPlotInit(C,s))});
  lfWander(C,[[.6,4.4,-1],[5.8,6.2,-1],[6.8,3.2,1]]);
  lfStandBoard(C,5.9,"CATCH");
  if(C.has("p_net"))C.add(9,'<path d="M'+lfPt(lfP(5.2,1.2,26))+' L'+lfPt(lfP(5.2,3.2,26))+'" stroke="#c9b47a" stroke-width="1.4"/>'+lfBox(5.1,1.1,0,.14,.14,26,"#8a5a30")+lfBox(5.1,3.2,0,.14,.14,26,"#8a5a30"));
  if(C.has("p_lant"))[1.5,3.0,4.5].forEach(function(x){var p=lfP(x,1.0,40);C.add(x+1.2,'<path d="M'+p[0]+' '+(p[1]-20)+' V'+p[1]+'" stroke="#444" stroke-width="1"/><g class="lfsway"><rect x="'+(p[0]-6)+'" y="'+p[1]+'" width="12" height="16" rx="5" fill="#ff7a5a" stroke="'+LFOL+'" stroke-width=".7"/></g><ellipse class="lfglow" cx="'+p[0]+'" cy="'+(p[1]+10)+'" rx="16" ry="10" fill="rgba(255,170,90,.28)"/>')});
  if(C.has("p_pump")){C.add(5.9,lfBox(5.2,4.9,0,.5,.5,14,"#7a8a9a")+'<path d="M'+lfPt(lfP(5.0,4.8,10))+' q-10 -14 -22 -6" stroke="rgba(190,230,255,.9)" stroke-width="2" fill="none" class="lfmist"/>')}
  if(C.has("p_lily")){[[2.0,2.0],[3.8,3.6],[1.6,3.8]].forEach(function(p){C.decals.push(lfE(lfP(p[0],p[1],0)[0],lfP(p[0],p[1],0)[1],9,4,"#3fae5a")+'<circle cx="'+(lfP(p[0],p[1],0)[0]+3)+'" cy="'+(lfP(p[0],p[1],0)[1]-2)+'" r="2.2" fill="#ffb8d8"/>')})}
  if(C.has("p_bait")){C.add(6.6+6.2+1,lfBox(6.4,6.2,0,1.2,.9,30,"#7a5a3a",{top:"#a94a3a"})+lfBox(6.3,6.1,30,1.4,1.1,4,"#c0392b"));C.walls.push(lfFaceY(6.5,7.1,26,'<rect width="30" height="10" fill="#1a1a1a"/><text x="15" y="8" text-anchor="middle" font-size="7" fill="#ffd27a" font-family="Arial" font-weight="700">BAIT</text>'))}
};
SVC.pond={kind:"prod",lbl:"S",lblName:"Spot",boardName:"Fishing spots",quiet:"Lines in the water",menu:[],
  rate:function(C){return C.has("p_pump")?.25:0},
  plotSteps:function(s){return [{x:s.x,y:s.y,act:"fish",tag:"fish",dur:[3.4,5.8],fx:s.ff||1}]}};

/* ===== game room ===== */
LFROOM.gameroom=function(C){
  C.walls.push(lfWindow(.7,C.wx));C.decals.push(lfWinLight(.7));
  lfRugD(C,1.0,2.4,3.2,2.6,"#5547a0","#7f74c8");
  C.add(2.5+3.5+1,lfBox(1.6,3.0,0,.9,.9,12,"#d9534f",{top:"#ff7a6a"})+lfBox(2.9,3.6,0,.9,.9,12,"#4dd2ff",{top:"#8ae6ff"}));
  lfCust(C,2.05,3.45,-1,{sit:1,tag:"bean",uact:"type",menu:["Controller","Snacks","Soda"],lbl:"B",grp:"b",num:1,wx:2.05,wy:4.3});lfCust(C,3.35,4.05,-1,{sit:1,tag:"bean",uact:"type",menu:["Controller","Snacks","Soda"],lbl:"B",grp:"b",num:2,wx:3.35,wy:4.9});
  C.add(6.2+1.6+.3+.6,lfBox(6.2,.3,0,1.6,.6,26,"#3a2a5a",{top:"#5547a0"})+lfBox(6.3,.35,26,.5,.4,6,"#ffd24a")+lfBox(7.0,.35,26,.6,.4,10,"rgba(200,235,255,.4)"));lfPrep(C,"counter",6.6,1.3);
  C.s("work",7.5,1.35,1,"look",[6,12],{tag:"counter"});
  lfWander(C,[[4.6,3.4,-1],[6.4,5.6,-1],[5.6,2.6,1]]);
  lfOrderBoard(C,4.7,98,"QUEUE");
  var arc=function(x,y,c1,c2,k){var n0=C.st.length;lfArcade(C,x,y,c1,c2);lfConvert(C,n0,"play",{wact:"look",uact:"work",menu:["Tokens","Soda","Rematch"],lbl:"A",grp:"a",num:k,udur:[14,22]})};
  if(C.has("gm_tft")){C.box(4.6,2.2,0,1.5,1.1,16,"#3a2a5a",{dk:.1,top:"#2f9a7a"});lfCust(C,5.35,3.75,-1,{wact:"look",uact:"work",menu:["Snacks","Rematch","Soda"],lbl:"T",grp:"tft",num:1});lfCust(C,6.55,2.75,-1,{wact:"look",uact:"work",menu:["Snacks","Rematch","Soda"],lbl:"T",grp:"tft",num:2})}
  if(C.has("gm_cab")){for(var k=0;k<3;k++)arc(.3,.4+k*1.05,["#7a3aa0","#3a7aa0","#a03a7a"][k],["#4dd2ff","#ffd24a","#ff5c9a"][k],k+1)}
  if(C.has("gm_pool")){var n1=C.st.length;lfPool(C,1.6,5.6);lfConvert(C,n1,"play",{wact:"look",uact:"reach",menu:["Rack 'em","Chalk","Soda"],lbl:"P",grp:"p",udur:[14,22]})}
  if(C.has("gm_couch")){var n2=C.st.length;lfSofa(C,2.0,.45,2.4,"#4a5aa0");lfConvert(C,n2,"sit",{uact:"type",menu:["Controller","Snacks","Soda"],lbl:"C",grp:"c",wy:1.9});var tv='<rect x="-3" y="-3" width="'+(LF.U*2.2+6)+'" height="'+(LF.U*1.2+6)+'" fill="#12121c" stroke="'+LFOL+'" stroke-width="1"/><rect class="lfscr" width="'+LF.U*2.2+'" height="'+LF.U*1.2+'" fill="#1f3a6a"/><circle class="lfglow" cx="'+LF.U*1.1+'" cy="'+LF.U*.6+'" r="12" fill="#ffd24a" opacity=".6"/>';C.walls.push(lfFaceY(2.3,0,94,tv))}
  if(C.has("gm_claw")){C.add(5.3+.8+.3+.8,lfBox(5.3,.3,0,.8,.8,30,"#ff5c9a",{top:"#ff8ab8"})+lfBox(5.32,.32,30,.76,.76,30,"rgba(200,235,255,.3)",{top:"rgba(255,255,255,.4)"})+lfBox(5.5,.5,30,.4,.4,6,"#ffd24a"));lfCust(C,5.7,1.6,1,{wact:"look",uact:"work",menu:["Tokens","Soda"],lbl:"K",grp:"k",num:1})}
  if(C.has("gm_hockey")){C.add(5.0+1.8+4.6+1.0,lfBox(5.0,4.6,0,1.8,1.0,14,"#2a4a8a",{top:"#e6f0ff"})+lfE(lfP(5.9,5.1,15)[0],lfP(5.9,5.1,15)[1],3,1.5,"#d9534f"));lfCust(C,4.5,5.1,1,{wact:"look",uact:"reach",menu:["Puck","Rematch"],lbl:"H",grp:"h",num:1});lfCust(C,7.3,5.1,-1,{wact:"look",uact:"reach",menu:["Puck","Rematch"],lbl:"H",grp:"h",num:2})}
  if(C.has("gm_vr")){C.decals.push(lfFloorG(5.6,6.4,'<circle cx="'+LF.U*.6+'" cy="'+LF.U*.6+'" r="'+LF.U*.6+'" fill="rgba(77,210,255,.25)" stroke="#4dd2ff" stroke-width="2" class="lfglow"/>'));lfCust(C,6.2,7.0,-1,{wact:"look",uact:"up",menu:["Headset","Reset"],lbl:"V",grp:"v",num:1})}
  if(C.has("gm_snack"))C.add(6.2+1.6+.3+.7,lfBox(6.9,.35,26,.3,.3,5,"#ff8a2e")+lfBox(7.3,.35,26,.3,.3,7,"#d9534f"));
  if(C.has("gm_league"))C.walls.push(lfFrame("L",5.2,96,46,30,'<rect width="46" height="30" fill="#1a1a2a"/><text x="23" y="12" text-anchor="middle" font-size="7" fill="#ffd27a" font-family="Arial" font-weight="700">LEAGUE</text><text x="23" y="23" text-anchor="middle" font-size="6" fill="#fff" font-family="Arial">1. CAL  2400</text>',"#caa24a"));
};
SVC.gameroom={lbl:"G",unit:"Game",boardName:"Floor queue",verbs:["Waiting","Fetching","Playing"],short:["wait","fetch","play"],quiet:"Free play",menu:["Snacks","Soda"],use:"work",udur:[14,24],pat:90,
  steps:function(s,X){var P=X.P("counter"),A=X.A(s);return [{x:P.x,y:P.y,act:"reach",tag:"fetch",dur:[1.2,1.8],fx:1},{x:A.x,y:A.y,act:"reach",tag:"place",dur:[1,1.5],carry:1}]}};

/* ===== studio ===== */
LFROOM.studio=function(C){
  C.walls.push(lfWindow(4.0,C.wx));C.decals.push(lfWinLight(4.0));
  C.box(.5,1.3,0,.9,2.8,17,"#2c2f44",{top:"#4a5170",dk:.2});
  C.add(.5+.9+1.3+2.8+.3,lfBox(.6,1.6,17,.55,.04,16,"#10141f")+lfPoly([lfP(1.15,1.6,19),lfP(1.15,2.5,19),lfP(1.15,2.5,31),lfP(1.15,1.6,31)],"#2a1d4a")+'<g class="lfeq">'+lfPoly([lfP(1.16,1.65,20),lfP(1.16,2.45,20),lfP(1.16,2.45,30),lfP(1.16,1.65,30)],"#ff3d81",null,0,' opacity=".5"')+'</g>');
  C.add(2.6+3.0+.6,lfBox(2.2,2.2,0,.9,.9,3,"#2a2a36")+lfBox(2.35,2.35,3,.6,.6,14,"#1e2230")+lfBox(2.1,2.1,17,.9,.9,4,"#d9534f",{top:"#ff7a6a"}));
  C.s("work",1.8,2.8,-1,"work",[12,26],{tag:"mix"});lfPrep(C,"desk",1.8,3.4);
  var n0=C.st.length;lfSofa(C,5.0,5.6,2.2,"#3a3a5a");lfConvert(C,n0,"sit",{uact:"sit",menu:["Mix","Master","Stems","Beat"],lbl:"C",grp:"c",wy:5.2});
  lfWander(C,[[4.4,3.2,-1],[3.4,5.0,-1],[6.8,3.8,1]]);
  lfOrderBoard(C,6.0,96,"SESSIONS");
  if(C.has("s_mon")){C.add(.5+.9+1.3+.5,lfBox(.55,1.2,17,.35,.4,18,"#222")+lfBox(.55,3.9,17,.35,.4,18,"#222"))}
  if(C.has("s_panel")){var pn='';for(var i=0;i<3;i++)pn+='<g transform="translate('+(i*44)+',0)">'+lfRr(0,0,38,38,3,"#2a2f4f","rgba(0,0,0,.4)")+'<path d="M4 4 L34 34 M4 34 L34 4" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/></g>';C.walls.push(lfFaceY(.6,0,96,pn.replace(/translate\((\d+),0\)/g,function(m,a){return "translate("+(a*.7)+",0)"}))+lfFaceX(0,4.6,96,pn))}
  if(C.has("s_synth")){var sy=lfSynthProp(3.6,3.0);C.add(sy[0],sy[1]);lfCust(C,4.9,4.0,-1,{wact:"look",uact:"work",menu:["Synth patch","Chords"],lbl:"K",grp:"k",num:1})}
  if(C.has("s_booth")){C.box(4.2,.3,0,1.5,1.5,70,"rgba(170,215,240,.35)",{top:"rgba(210,235,250,.5)",l:"rgba(170,215,240,.3)",r:"rgba(130,185,225,.4)"});C.add(4.95+1.05+.1,lfBox(4.93,1.03,0,.04,.04,40,"#333")+lfE(lfP(4.95,1.05,42)[0],lfP(4.95,1.05,42)[1],2.4,3.2,"#555"));lfCust(C,4.95,1.25,-1,{wact:"look",uact:"up",menu:["Vocal take","Ad-libs","Harmony"],mx:false,lbl:"V",grp:"v",num:1,wx:4.95,wy:2.3})}
  if(C.has("s_drums")){var dp=function(x,y,r,h,c){return lfBox(x-r,y-r,0,r*2,r*2,h,c,{top:"#e8e8e8"})};C.add(6.0+2.4+.6,dp(6.0,2.4,.25,14,"#c0392b")+dp(6.5,2.2,.2,18,"#c0392b")+dp(6.9,2.5,.22,12,"#c0392b")+lfBox(6.4,2.6,0,.04,.04,30,"#999")+lfE(lfP(6.42,2.62,30)[0],lfP(6.42,2.62,30)[1],7,2.6,"#e8c34a"));lfCust(C,6.5,3.2,-1,{wact:"look",uact:"up",menu:["Drum take"],mx:false,lbl:"D",grp:"d",num:1})}
  if(C.has("s_lounge")){var n1=C.st.length;lfSofa(C,1.6,6.4,2.0,"#6a3a5a");lfConvert(C,n1,"sit",{uact:"sit",menu:["Mix","Master","Beat"],lbl:"G",grp:"g",wy:6.0})}
  if(C.has("s_plaque"))C.walls.push(lfFrame("L",5.6,98,22,28,'<rect width="22" height="28" fill="#2a2a2a"/><circle cx="11" cy="12" r="8" fill="#e6eaf2"/><circle cx="11" cy="12" r="2" fill="#2a2a2a"/>',"#c9ced8")+lfFrame("L",6.6,98,22,28,'<rect width="22" height="28" fill="#2a2a2a"/><circle cx="11" cy="12" r="8" fill="#ffd24a"/><circle cx="11" cy="12" r="2" fill="#2a2a2a"/>',"#caa24a"));
  if(C.has("s_console"))C.add(.5+.9+1.3+2.8+.31,lfBox(.95,1.5,17,.3,2.4,4,"#3a3f5a",{top:"#5a6080"}));
};
SVC.studio={lbl:"C",unit:"Client",boardName:"Session board",verbs:["Booked","Mixing","Listening"],short:["book","mix","vibe"],quiet:"Studio open",menu:["Mix","Master"],use:"sit",udur:[14,22],pat:95,
  steps:function(s,X){var P=X.P("desk"),A=X.A(s);return [{x:P.x,y:P.y,act:"work",tag:"mix",dur:[3.2,5],fx:-1},{x:A.x,y:A.y,act:"reach",tag:"handoff",dur:[1,1.4]}]}};

/* ===== gym ===== */
LFROOM.gym=function(C){
  C.walls.push(lfWindow(.6,C.wx));C.decals.push(lfWinLight(.6));
  C.decals.push(lfFloorG(.8,2.2,lfRr(0,0,LF.U*4.2,LF.U*3,4,"#2a3038","rgba(0,0,0,.4)")+'<path d="M0 '+LF.U+' H'+LF.U*4.2+' M0 '+LF.U*2+' H'+LF.U*4.2+'" stroke="rgba(255,255,255,.08)"/>'));
  C.add(5.0+.8+.5+.8,lfBox(4.4,.4,0,1.2,.7,24,"#3a3f4a")+lfBox(4.4,.4,24,1.2,.7,2,"#555a66")+lfBox(4.5,.5,26,.2,.5,8,"#c9ced8")+lfBox(4.8,.5,26,.2,.5,8,"#ff6a4d")+lfBox(5.1,.5,26,.2,.5,8,"#c9ced8"));
  C.add(6.4+1.4+.3+.6,lfBox(6.4,.3,0,1.4,.6,26,"#2a2f3a",{top:"#4a5060"})+lfBox(6.5,.35,26,.3,.3,8,"#4dd2ff"));lfPrep(C,"desk",6.6,1.3);C.s("work",7.45,1.35,1,"look",[5,10],{tag:"desk"});
  var mem=function(x,y,ua,o){return lfCust(C,x,y,-1,Object.assign({wact:"look",uact:ua,lbl:"M",grp:"m",num:lfNum(C,"m")},o||{}))};
  mem(2.4,3.4,"up");mem(3.4,4.5,"up");
  C.s("look",4.4,2.6,-1,"look",[3,6]);
  lfWander(C,[[1.6,4.8,-1],[4.8,4.4,1],[6.6,6.6,-1]]);
  lfOrderBoard(C,2.7,98,"FLOOR");
  if(C.has("y_bag")){C.add(2.5,'<path d="M'+lfPt(lfP(3.6,1.6,118))+' L'+lfPt(lfP(3.6,1.6,70))+'" stroke="#bbb" stroke-width="1.6"/><g class="lfswing">'+lfPoly([lfP(3.35,1.35,70),lfP(3.85,1.35,70),lfP(3.85,1.85,70),lfP(3.35,1.85,70)],"#222")+lfBox(3.35,1.35,10,.5,.5,60,"#c0392b",{top:"#e0584a"})+'</g>');mem(3.6,2.6,"work",{tag:"punch"})}
  if(C.has("y_rack")){C.box(1.6,1.0,0,.22,.22,70,"#555a66");C.box(2.6,1.0,0,.22,.22,70,"#555a66");C.box(1.6,1.0,56,1.2,.22,3,"#9aa0ac");C.box(1.4,1.05,58,.2,.14,10,"#222");C.box(2.9,1.05,58,.2,.14,10,"#222");mem(2.2,2.0,"up",{tag:"squat"})}
  if(C.has("y_bench")){C.box(4.6,5.3,0,1.5,.6,10,"#2a2f3a");C.box(4.6,5.3,10,1.5,.6,2,"#c9ced8");mem(5.35,6.5,"down")}
  if(C.has("y_tread")){var tp=lfTreadProp(4.4,3.0);C.add(tp[0],tp[1]);mem(4.9,4.0,"run",{tag:"tread",onspot:1,wx:5.6,wy:4.6})}
  if(C.has("y_mirror")){var mr='<rect width="'+LF.U*3+'" height="70" fill="#bfe3f0" stroke="#d9dde5" stroke-width="3"/><path class="lfshine" d="M10 60 L60 10 M50 62 L110 8" stroke="rgba(255,255,255,.5)" stroke-width="5"/>';C.walls.push(lfFaceX(0,5.4,90,mr))}
  if(C.has("y_bike"))[[6.4,3.2],[6.4,4.5]].forEach(function(p){C.add(p[0]+p[1]+.9,lfBox(p[0],p[1],0,.8,.3,6,"#2a2f3a")+lfBox(p[0]+.5,p[1]+.05,6,.1,.2,18,"#555")+lfBox(p[0]+.4,p[1],24,.3,.3,3,"#ff6a4d")+lfBox(p[0]+.05,p[1]+.05,6,.08,.2,24,"#555"));mem(p[0]+.5,p[1]+.15,"run",{onspot:1,wx:p[0]+.5,wy:p[1]+.9})});
  if(C.has("y_cable")){C.add(1.0+7.0,lfBox(.3,6.2,0,.6,.9,72,"#3a3f4a",{top:"#555a66"})+lfBox(.35,6.35,10,.5,.6,20,"#222"));mem(1.4,6.7,"down")}
  if(C.has("y_smoothie"))C.add(6.4+1.4+.3+.61,lfBox(7.3,.35,26,.25,.25,12,"rgba(200,235,255,.5)")+lfBox(7.3,.35,26,.25,.25,5,"#ff8ab8"));
  if(C.has("y_sauna")){C.decals.push(lfFloorG(5.8,6.4,lfRr(0,0,LF.U*1.8,LF.U*1.2,3,"#3a6a5a")));C.add(7.4,lfBox(6.0,6.6,0,.6,.15,3,"#4dd2ff"))}
  if(C.has("y_pt"))C.walls.push(lfFrame("L",3.0,100,26,18,'<rect width="26" height="18" fill="#1a1a1a"/><text x="13" y="12" text-anchor="middle" font-size="7" fill="#ff6a4d" font-family="Arial" font-weight="900">PT</text>',"#c9ced8"));
};
SVC.gym={lbl:"M",unit:"Member",boardName:"Gym floor",verbs:["Waiting","Coaching","Training"],short:["wait","help","lift"],quiet:"Open gym",menu:["Spot me","Form check","Towel","Water"],use:"up",udur:[12,20],pat:85,
  guests:function(r,C,n){return 2+Math.floor(addonsOf(r).length/2)},
  steps:function(s,X,item){var A=X.A(s);if(/Towel|Water|Shake/.test(item)){var P=X.P("desk");return [{x:P.x,y:P.y,act:"reach",tag:"fetch",dur:[1.1,1.6],fx:1},{x:A.x,y:A.y,act:"reach",tag:"place",dur:[1,1.4],carry:1}]}return [{x:A.x,y:A.y,act:"wave",tag:"coach",dur:[2.6,4]}]}};

/* ===== library ===== */
LFROOM.library=function(C){
  C.walls.push(lfWindow(3.6,C.wx));C.decals.push(lfWinLight(3.6));
  C.decals.push('<g class="lfdust">'+[0,1,2,3,4].map(function(i){var p=lfP(4.2+i*.3,1.0+i*.25,30+i*9);return '<circle style="animation-delay:'+(i*.8)+'s" cx="'+p[0]+'" cy="'+p[1]+'" r="1" fill="rgba(255,240,200,.8)"/>'}).join("")+'</g>');
  lfShelfL(C,.15,1.0,3.2,96,1);lfShelfR(C,.6,.15,2.6,84,2);
  C.box(3.0,3.0,0,1.5,.9,15,"#a9763f",{dk:.1,top:"#d9a870"});C.add(3.0+1.5+3.9+.5,lfBox(3.3,3.2,15,.4,.3,3,"#d9534f")+lfBox(3.9,3.3,15,.4,.3,2,"#3a6ab5"));
  lfChair(C,3.4,4.2,"#8a5a3a");lfChair(C,4.2,4.2,"#8a5a3a");
  lfCust(C,3.4,4.2,-1,{sit:1,uact:"read",lbl:"S",grp:"s",num:1,wy:4.9});lfCust(C,4.2,4.2,-1,{sit:1,uact:"read",lbl:"S",grp:"s",num:2,wy:4.9});
  C.s("browse",1.4,2.6,-1,"look",[5,10],{tag:"browse"});lfPrep(C,"shelf",1.2,2.6);
  lfWander(C,[[4.8,2.0,-1],[2.2,4.6,-1],[6.6,4.6,1]]);
  lfLamp(C,5.3,2.4);
  lfOrderBoard(C,5.8,96,"REQUESTS");
  if(C.has("lb_lamp")){var n0=C.st.length;lfSofa(C,5.0,4.8,1.45,"#9a5a4a","read","readc");lfConvert(C,n0,"sit",{uact:"read",lbl:"R",grp:"r",wy:4.4})}
  if(C.has("lb_globe")){C.add(5.6+1.4+1,lfBox(5.1,.8,0,.5,.5,12,"#6a4426")+'<g class="lfspin3">'+lfE(lfP(5.35,1.05,30)[0],lfP(5.35,1.05,30)[1],11,11,"#3a8ad9")+'<path d="M'+(lfP(5.35,1.05,30)[0]-9)+' '+(lfP(5.35,1.05,30)[1]-2)+' q6 -6 12 1 q3 5 6 -3" stroke="#6cb86a" stroke-width="4" fill="none"/></g>');C.s("look",5.1,1.9,1,"look",[3,6])}
  if(C.has("lb_fire")){lfLight(C,.9,4.3,22,"#ff9d3a",3,.95);var fp='<rect x="-6" y="-6" width="'+(LF.U*1.8+12)+'" height="'+(66)+'" fill="#7a6a5a" stroke="'+LFOL+'" stroke-width="1"/><rect width="'+LF.U*1.8+'" height="60" fill="#2a1a14"/><path class="lfflick" d="M12 56 Q18 24 26 44 Q30 16 38 40 Q46 28 52 56Z" fill="#ff9d3a"/><path class="lfflick" style="animation-delay:.4s" d="M22 56 Q26 36 32 48 Q38 34 42 56Z" fill="#ffd24a"/>';C.walls.push(lfFaceX(0,5.2,60,fp))}
  if(C.has("lb_carrel"))[6.0,7.0].forEach(function(x,j){C.add(x+.9+.3+.5,lfBox(x,.3,0,.9,.5,15,"#7a5230",{top:"#b9854e"})+lfBox(x,.3,15,.9,.06,14,"#7a5230"));lfChair(C,x+.45,1.15,"#6a4426");lfCust(C,x+.45,1.15,-1,{sit:1,uact:"read",lbl:"D",grp:"d",num:j+1,wy:1.8})});
  if(C.has("lb_cafe")){C.add(6.6+.9+6.4+.6,lfBox(6.6,6.4,0,.9,.6,24,"#5a3a28",{top:"#a96e3c"})+lfBox(6.7,6.45,24,.35,.35,12,"#2a2a34"));C.front.push(lfSteam(6.85,6.6,38,2));lfPrep(C,"cafe",6.9,7.3)}
  if(C.has("lb_rare")){C.add(6.4+1.0+3.2+.6,lfBox(6.4,3.2,0,1.0,.6,16,"#4a2e1a")+lfBox(6.42,3.22,16,.96,.56,14,"rgba(200,235,255,.3)",{top:"rgba(255,255,255,.35)"})+lfBox(6.6,3.35,16,.3,.25,3,"#8a1a1a"));lfPrep(C,"rare",6.9,4.1)}
  if(C.has("lb_ladder"))C.add(1.0+3.0,lfBox(.75,2.2,0,.06,.06,90,"#8a5a30")+lfBox(.75,2.7,0,.06,.06,90,"#8a5a30"));
  if(C.has("lb_quiet"))C.walls.push(lfFrame("R",3.0,108,30,12,'<rect width="30" height="12" fill="#2a3a2a"/><text x="15" y="8.5" text-anchor="middle" font-size="6" fill="#d8efe6" font-family="Arial">QUIET</text>',"#6a4426"));
};
SVC.library={lbl:"S",unit:"Seat",boardName:"Book requests",verbs:["Waiting","Searching","Reading"],short:["wait","find","read"],quiet:"Shhh",menu:["Sci-fi","History","Poetry","Manga","Atlas"],use:"read",udur:[18,30],pat:95,
  steps:function(s,X,item){var A=X.A(s),P=X.P(item==="Coffee"?"cafe":item==="First Edition"?"rare":"shelf");return [{x:P.x,y:P.y,act:"reach",tag:"browse",dur:[1.8,2.6],fx:-1},{x:A.x,y:A.y,act:"reach",tag:"place",dur:[1,1.4],carry:1}]}};

/* ===== dojo ===== */
LFROOM.dojo=function(C){
  C.walls.push(lfWindow(.8,C.wx));C.decals.push(lfWinLight(.8));
  C.walls.push(lfFrame("R",3.2,86,60,44,'<rect width="60" height="44" fill="#f2e8d0"/><text x="9" y="30" font-size="22" font-family="Arial" font-weight="900" fill="#b0302a">道</text>',"#6a4426"));
  [[1.8,4.4],[3.4,5.2]].forEach(function(p){C.decals.push(lfFloorG(p[0],p[1],lfRr(0,0,LF.U*1.4,LF.U*1.1,2,"#3a5a8a","rgba(0,0,0,.3)")))});
  C.s("work",3.2,3.2,-1,"work",[8,16],{tag:"train"});C.s("work",2.2,3.4,1,"up",[8,16],{tag:"stretch"});
  var st=function(x,y,o){return lfCust(C,x,y,-1,Object.assign({wact:"look",uact:"work",lbl:"M",grp:"m",num:lfNum(C,"m")},o||{}))};
  st(2.5,5.0);st(4.1,5.8);
  lfWander(C,[[4.4,3.4,-1],[1.6,2.2,-1],[6.4,3.0,1]]);
  lfOrderBoard(C,5.8,96,"MAT");
  if(C.has("d_dummy")){var dm=lfDummyProp(4.2,2.7);C.add(dm[0],dm[1]);C.s("work",3.9,3.1,1,"work",[8,16],{tag:"hit"})}
  if(C.has("d_rack")){C.box(5.1,1.2,0,.5,1.6,36,"#4a2e1a",{dk:.2});for(var k=0;k<3;k++)C.add(5.9+k*.5+1.2+1.6+.3,lfBox(5.2,1.4+k*.45,36,.12,.12,12,"#c9ced8")+lfBox(5.2,1.4+k*.45,34,.12,.12,3,"#222"))}
  if(C.has("d_bonsai")){C.box(1.2,.6,0,1.0,.8,12,"#6a4a3a",{dk:.1});C.add(2.2+1.4+.5,'<path d="M'+lfPt(lfP(1.7,1.0,12))+' q-6 -14 4 -22 q-8 -4 0 -12" stroke="#4a3220" stroke-width="3.4" fill="none"/><g class="lfsway">'+lfE(lfP(1.7,1.0,50)[0]+6,lfP(1.7,1.0,50)[1],17,9,"#2f8a4a")+lfE(lfP(1.7,1.0,52)[0]+10,lfP(1.7,1.0,52)[1]-6,10,6,"#3fae5a")+'</g>');
    var lp=lfP(1.9,1.2,40);for(var l=0;l<3;l++)C.front.push('<path class="lfleaf" style="animation-delay:'+(l*2.3)+'s" d="M'+lp[0]+' '+lp[1]+' q3 -2 5 0 q-3 2 -5 0z" fill="#ff9ab8"/>')}
  if(C.has("d_mats")){[[5.0,4.6],[1.4,6.4]].forEach(function(p){C.decals.push(lfFloorG(p[0],p[1],lfRr(0,0,LF.U*1.4,LF.U*1.1,2,"#8a3a3a","rgba(0,0,0,.3)")))});st(5.6,5.1);st(2.0,6.9)}
  if(C.has("d_cush")){[[6.4,1.4],[7.2,1.8]].forEach(function(p,j){C.add(p[0]+p[1]+.5,lfBox(p[0]-.25,p[1]-.25,0,.5,.5,5,"#b0302a",{top:"#d9534f"}));lfCust(C,p[0],p[1],-1,{sit:1,uact:"sit",menu:["Meditate","Breathwork"],mx:false,lbl:"Z",grp:"z",num:j+1})})}
  if(C.has("d_ring")){var rp=[[5.6,5.8],[7.6,5.8],[5.6,7.6],[7.6,7.6]];C.add(5.6+5.8+.01,lfBox(5.6,5.8,0,2.0,2.0,2,"#e8e0d0",{top:"#f2ece0"}));rp.forEach(function(p){C.add(p[0]+p[1]+.05,lfBox(p[0]-.06,p[1]-.06,0,.12,.12,30,"#c0392b"))});C.front.push('<path d="M'+lfPt(lfP(5.6,7.6,24))+' L'+lfPt(lfP(7.6,7.6,24))+' L'+lfPt(lfP(7.6,5.8,24))+'" stroke="#fff" stroke-width="1.4" fill="none"/>');st(6.2,6.6,{menu:["Spar"],mx:false});st(7.0,7.0,{menu:["Spar"],mx:false})}
  if(C.has("d_gong")){C.add(6.6+.6+.4,lfBox(6.4,.4,0,.08,.08,50,"#4a2e1a")+lfBox(7.4,.4,0,.08,.08,50,"#4a2e1a")+lfBox(6.4,.4,48,1.08,.08,4,"#4a2e1a")+'<ellipse class="lfglow" cx="'+lfP(6.9,.44,28)[0]+'" cy="'+lfP(6.9,.44,28)[1]+'" rx="11" ry="12" fill="#d9a83a" stroke="#8a6a1a"/>')}
  if(C.has("d_belt"))C.walls.push(lfFrame("L",4.6,96,40,24,['#fff','#ffd24a','#ff8a2e','#3fae5a','#3a6ab5','#5a2a1a','#111'].map(function(c,i){return '<rect x="'+(3+i*5)+'" y="4" width="4" height="16" fill="'+c+'"/>'}).join(""),"#6a4426"));
};
SVC.dojo={lbl:"M",unit:"Mat",boardName:"Mat schedule",verbs:["Waiting","Training","Practicing"],short:["wait","train","drill"],quiet:"Mats are open",menu:["Spar","Kata","Belt test","Stretch"],use:"work",udur:[12,20],pat:90,
  steps:function(s,X){var A=X.A(s);return [{x:A.x,y:A.y,act:"work",tag:"train",dur:[3.4,5.2]}]}};

/* ===== movie theater (new) ===== */
function lfCinemaSeat(C,x,y,col,rec){var d=rec?.75:.6;
  C.add(x+.8+y+.3,lfBox(x,y-d/2,0,.62,d,8,"#2a1a20",{top:"#3a2a30"})+lfBox(x,y-d/2,8,.62,d,4,col,{top:lfSh(col,.25)})+lfBox(x+.5,y-d/2,8,.18,d,rec?22:20,lfSh(col,-.1),{top:lfSh(col,.2)})+lfBox(x+.05,y-d/2-.04,8,.5,.06,7,"#1a1014")+lfBox(x+.05,y+d/2-.02,8,.5,.06,7,"#1a1014"))}
LFROOM.theater=function(C){
  lfDoorAt(C,8.6);
  C.decals.push(lfFloorG(2.8,1.2,lfRr(0,0,LF.U*5.6,LF.U*6.0,4,"#5a1a2a","rgba(0,0,0,.3)")+'<path d="M0 '+LF.U*1+' H'+LF.U*5.6+' M0 '+LF.U*2+' H'+LF.U*5.6+' M0 '+LF.U*3+' H'+LF.U*5.6+' M0 '+LF.U*4+' H'+LF.U*5.6+' M0 '+LF.U*5+' H'+LF.U*5.6+'" stroke="rgba(255,255,255,.05)"/>'));
  var big=C.has("t_imax"),sw=big?6.4:5.2,sh=big?84:66,y0=big?7.2:6.6;
  var scr='<rect x="-5" y="-5" width="'+(LF.U*sw+10)+'" height="'+(sh+10)+'" fill="#0a0a0e" stroke="'+LFOL+'" stroke-width="1"/><rect class="lfscr2" width="'+LF.U*sw+'" height="'+sh+'" fill="url(#lfscrg'+C.uid+')"/><text class="lfscrt" data-k="'+C.key+'" x="'+LF.U*sw/2+'" y="'+(sh/2+4)+'" text-anchor="middle" font-size="11" font-weight="900" fill="rgba(255,255,255,.85)" font-family="Arial Black,Arial">NOW SHOWING</text>';
  C.walls.push('<defs><linearGradient id="lfscrg'+C.uid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a6ab5"/><stop offset=".5" stop-color="#b03a8a"/><stop offset="1" stop-color="#ff9d3a"/></linearGradient></defs>'+lfFaceX(0,y0,big?118:108,scr));
  C.walls.push(lfFaceX(0,y0+.05,30,'<rect width="'+LF.U*sw+'" height="6" fill="#4a0a14"/>'));
  var pj=lfP(9.4,.25,96),s1=lfP(0,y0-sw,(big?118:108)-sh/2),s2=lfP(0,y0,(big?118:108)-sh/2);
  C.front.push('<polygon class="lfbeam" points="'+pj[0]+','+pj[1]+' '+s1[0]+','+(s1[1]-sh/2)+' '+s2[0]+','+(s2[1]+sh/2)+'" fill="rgba(200,220,255,.07)"/>');
  C.add(5.4+2.8+.3+.6,lfBox(5.4,.3,0,2.8,.6,22,"#5a1a2a",{top:"#c9a070"})+lfBox(5.5,.32,0,2.6,.02,22,"#ff4d6d"));lfPrep(C,"counter",6.2,1.35);
  C.s("work",7.6,1.35,1,"look",[6,12],{tag:"counter"});C.s("look",8.6,6.8,-1,"look",[5,10],{tag:"usher"});
  var rowsX=[3.4,4.9].concat(C.has("t_recline")?[6.4]:[]);
  rowsX.forEach(function(x,ri){var rec=ri===2;[2.2,3.2,4.2,5.2].forEach(function(y,k){lfCinemaSeat(C,x,y,rec?"#7a2a5a":"#b0303a",rec);lfCust(C,x+.25,y,-1,{sit:1,uact:"eat",lbl:String.fromCharCode(65+ri),grp:"r"+ri,num:k+1,wx:x+1.05,wy:y,udur:[30,55]})})});
  lfWander(C,[[8.2,4.0,-1],[7.6,6.6,1],[2.2,6.8,-1]]);
  lfOrderBoard(C,.7,104,"SNACKS");
  if(C.has("t_pop")){C.add(5.4+2.8+.3+.61,lfBox(5.6,.35,22,.5,.5,20,"rgba(255,240,200,.35)",{top:"#c0392b"})+lfBox(5.62,.37,22,.46,.46,10,"#ffe9a0"));C.front.push(lfSteam(5.85,.6,44,2))}
  if(C.has("t_candy")){var cw='<rect width="'+LF.U*1.6+'" height="40" fill="#2a1a20" stroke="'+LFOL+'"/>';for(var a=0;a<4;a++)for(var b=0;b<6;b++)cw+='<circle cx="'+(5+b*7.6)+'" cy="'+(6+a*9)+'" r="3" fill="'+["#ff5c9a","#ffd24a","#4dd2ff","#9cff8a"][(a+b)%4]+'"/>';C.walls.push(lfFaceY(3.0,0,74,cw))}
  if(C.has("t_hotdog"))C.add(5.4+2.8+.3+.62,lfBox(7.4,.35,22,.6,.4,8,"#c9ced8")+lfBox(7.45,.4,30,.5,.3,2,"#d9824a"));
  if(C.has("t_marquee"))for(var m=0;m<14;m++){var mp=lfP(.4+m*.6,0,118);C.walls.push('<circle class="lftwk" style="animation-delay:'+(m*.15).toFixed(2)+'s" cx="'+mp[0].toFixed(1)+'" cy="'+mp[1].toFixed(1)+'" r="2.2" fill="#ffe27a"/>')}
  if(C.has("t_sound"))[[.3,.4],[.3,7.1]].forEach(function(p){C.add(p[0]+p[1]+.6,lfBox(p[0],p[1],0,.5,.5,52,"#1a1a1a",{top:"#2a2a2a"})+'<circle class="lfpulse" cx="'+lfP(p[0]+.5,p[1]+.25,30)[0]+'" cy="'+lfP(p[0]+.5,p[1]+.25,30)[1]+'" r="5" fill="#333" stroke="#555"/>')});
};
SVC.theater={lbl:"A",unit:"Seat",boardName:"Snack orders",verbs:["Waiting","At the counter","Watching"],short:["wait","prep","watch"],quiet:"Enjoy the show",menu:["Soda","Water","Pretzel"],use:"eat",udur:[30,55],pat:90,
  guests:function(r,C,n){return 4+addonsOf(r).length},
  head:function(C){var F=lfFilm(C.key);return F.on?"▶ "+F.name+" · "+F.left+"m":"Intermission"},
  steps:function(s,X){var P=X.P("counter"),A=X.A(s);return [{x:P.x,y:P.y,act:"work",tag:"pop",dur:[1.6,2.4],fx:-1},{x:A.x,y:A.y,act:"reach",tag:"place",dur:[1,1.4],carry:1}]}};

/* ===== nightclub (new) ===== */
LFROOM.club=function(C){
  lfDoorAt(C,8.4);
  var df='',cols=C.has("c_led")?["#ff3df0","#4dd2ff","#9cff8a","#ffd24a","#ff5c5c"]:["#7a2a9a","#2a5a9a","#9a2a6a"];
  for(var i=0;i<5;i++)for(var j=0;j<4;j++)df+='<rect class="lfdf" style="animation-delay:'+(((i*3+j*5)%7)*.23).toFixed(2)+'s" x="'+(i*LF.U*.8+1)+'" y="'+(j*LF.U*.75+1)+'" width="'+(LF.U*.8-2)+'" height="'+(LF.U*.75-2)+'" fill="'+cols[(i+j)%cols.length]+'"/>';
  C.decals.push(lfFloorG(3.2,2.8,'<rect width="'+LF.U*4+'" height="'+LF.U*3+'" fill="#0a0a14"/>'+df));
  C.add(3.4+2.2+1.2+.8,lfBox(3.4,1.2,0,2.2,.8,26,"#14121c",{top:"#2a2638"})+lfBox(3.42,1.99,4,2.16,.02,18,"#ff3df0")+lfBox(3.6,1.35,26,.6,.5,3,"#111")+lfBox(4.6,1.35,26,.6,.5,3,"#111")+'<ellipse class="lfspin" cx="'+lfP(3.9,1.6,29)[0]+'" cy="'+lfP(3.9,1.6,29)[1]+'" rx="6" ry="2.6" fill="#4dd2ff"/><ellipse class="lfspin" cx="'+lfP(4.9,1.6,29)[0]+'" cy="'+lfP(4.9,1.6,29)[1]+'" rx="6" ry="2.6" fill="#ff5c9a"/>');
  lfPrep(C,"dj",4.0,.6);C.s("work",5.1,.6,1,"work",[10,20],{tag:"dj"});
  C.box(.9,2.0,0,.8,3.4,26,"#1a1424",{top:"#3a2a4a",dk:.3});C.add(.9+.8+2.0+3.4+.1,lfBox(1.65,2.0,4,.03,3.4,16,"#4dd2ff"));
  var bb='';for(var b=0;b<10;b++)bb+='<rect x="'+(4+b*8)+'" y="'+(6+(b%3)*2)+'" width="5" height="14" rx="1.5" fill="'+["#4dd2ff","#ff5c9a","#9cff8a","#ffd24a"][b%4]+'" opacity=".85"/>';C.walls.push(lfFaceX(0,5.4,70,'<rect width="'+LF.U*3.2+'" height="26" fill="#120f1c" stroke="#ff3df0" stroke-width="1"/>'+bb));
  lfPrep(C,"clubbar",.5,3.6);C.s("work",.5,3.0,1,"work",[6,12],{tag:"pour"});
  [2.6,3.6,4.6].forEach(function(y,k){lfStool(C,2.25,y,"#ff3df0");lfCust(C,2.27,y,-1,{sit:1,stool:1,uact:"eat",lbl:"S",grp:"s",num:k+1})});
  var dsp=[[3.9,3.4],[5.1,3.7],[6.3,3.3],[4.5,4.9]].concat(C.has("c_led")?[[5.9,5.0],[6.8,4.3]]:[]);
  dsp.forEach(function(p,k){lfCust(C,p[0],p[1],-1,{wact:"dance",uact:"dance",menu:["Song req","Water","Shots"],mx:false,lbl:"D",grp:"d",num:k+1,udur:[16,28]})});
  lfWander(C,[[8.0,3.2,-1],[2.6,6.6,1],[7.4,6.2,-1]]);
  lfOrderBoard(C,6.3,104,"BAR TAB");
  var db=lfP(5.2,4.3,108);C.front.push('<path d="M'+db[0]+' '+(db[1]-40)+' V'+(db[1]-8)+'" stroke="#888" stroke-width="1"/><g class="lfspin3"><circle cx="'+db[0]+'" cy="'+db[1]+'" r="8" fill="#c9ced8" stroke="#fff" stroke-width=".6"/><path d="M'+(db[0]-8)+' '+db[1]+' h16 M'+db[0]+' '+(db[1]-8)+' v16" stroke="rgba(255,255,255,.6)" stroke-width=".6"/></g>'+[0,1,2,3,4,5].map(function(k){return '<circle class="lftwk" style="animation-delay:'+(k*.3)+'s" cx="'+(db[0]+Math.cos(k)*60).toFixed(0)+'" cy="'+(db[1]+40+Math.sin(k*2)*30).toFixed(0)+'" r="1.6" fill="#fff"/>'}).join(""));
  if(C.has("c_laser")){var lo=lfP(4.5,.4,60);["#3dff6a","#ff3df0","#4dd2ff"].forEach(function(c,k){C.front.push('<g class="lflaser" style="animation-delay:'+(k*.6)+'s;transform-origin:'+lo[0]+'px '+lo[1]+'px"><path d="M'+lo[0]+' '+lo[1]+' L'+(lo[0]-120+k*120)+' '+(lo[1]+160)+'" stroke="'+c+'" stroke-width="1.2" opacity=".7"/></g>')})}
  if(C.has("c_fog"))C.front.push([0,1,2].map(function(k){var fp=lfP(3.6+k*1.4,5.6,4);return '<ellipse class="lffog" style="animation-delay:'+(-k*3)+'s" cx="'+fp[0]+'" cy="'+fp[1]+'" rx="46" ry="14" fill="rgba(220,210,255,.16)"/>'}).join(""));
  if(C.has("c_vip")){var n0=C.st.length;lfSofa(C,6.2,6.1,2.4,"#2a1a3a");lfConvert(C,n0,"sit",{uact:"eat",menu:["Bottle","Champagne"],mx:false,lbl:"V",grp:"v"});C.add(8.8+6.3+.6,lfBox(8.8,6.3,0,.6,.6,10,"#2a2a2a",{top:"#c9ced8"})+lfBox(8.95,6.45,10,.25,.25,10,"#c9ced8"))}
  if(C.has("c_vip2")){var n1=C.st.length;lfSofa(C,3.2,6.1,2.4,"#3a1a2a");lfConvert(C,n1,"sit",{uact:"eat",menu:["Bottle","Champagne"],mx:false,lbl:"W",grp:"w"})}
  if(C.has("c_podium"))[[8.4,2.8],[8.4,4.8]].forEach(function(p,k){C.add(p[0]+p[1]+.8,lfBox(p[0]-.4,p[1]-.4,0,.8,.8,14,"#2a2438",{top:"#ff3df0"}));C.plat.push({x0:p[0]-.4,y0:p[1]-.4,x1:p[0]+.4,y1:p[1]+.4,z:14,key:p[0]+p[1]+.81});lfCust(C,p[0],p[1],-1,{wact:"dance",uact:"dance",menu:["Water"],mx:false,lbl:"P",grp:"p",num:k+1,udur:[20,34],wx:p[0]-.8,wy:p[1]})});
  if(C.has("c_sound"))[[2.6,.3],[6.1,.3]].forEach(function(p){C.add(p[0]+p[1]+.7,lfBox(p[0],p[1],0,.6,.6,74,"#111",{top:"#222"})+'<circle class="lfpulse" cx="'+lfP(p[0]+.3,p[1]+.6,24)[0]+'" cy="'+lfP(p[0]+.3,p[1]+.6,24)[1]+'" r="6" fill="#222" stroke="#444"/><circle class="lfpulse" cx="'+lfP(p[0]+.3,p[1]+.6,52)[0]+'" cy="'+lfP(p[0]+.3,p[1]+.6,52)[1]+'" r="4" fill="#222" stroke="#444"/>')});
  if(C.has("c_rope")){C.add(9.0+1.6,lfBox(8.2,1.5,0,.08,.08,16,"#caa24a")+lfBox(9.6,1.5,0,.08,.08,16,"#caa24a"));C.front.push('<path d="M'+lfPt(lfP(8.24,1.54,14))+' Q'+lfPt(lfP(8.9,1.54,6))+' '+lfPt(lfP(9.64,1.54,14))+'" stroke="#b0102a" stroke-width="2" fill="none"/>')}
};
SVC.club={lbl:"D",unit:"Spot",boardName:"Bar tab",verbs:["Waiting","Making","Partying"],short:["wait","make","party"],quiet:"Floor is open",menu:["Vodka Soda","Tequila","Mule","Shots"],use:"eat",udur:[14,24],pat:75,
  guests:function(r,C,n){return 5+addonsOf(r).length},
  steps:function(s,X,item){if(item==="Song req"){var D=X.P("dj");return [{x:D.x,y:D.y,act:"work",tag:"mix",dur:[2,3],fx:1}]}var P=X.P("clubbar");if(s.stool)return [{x:P.x,y:s.y,act:"work",tag:"mix",dur:[1.8,2.8],fx:1}];var A=X.A(s);return [{x:P.x,y:P.y,act:"work",tag:"mix",dur:[1.8,2.8],fx:1},{x:A.x,y:A.y,act:"reach",tag:/Bottle|Champ/.test(item)?"bottle":"place",dur:[1.1,1.6],carry:1}]}};

/* ===== spa (new) ===== */
LFROOM.spa=function(C){
  C.walls.push(lfWindow(5.4,C.wx));C.decals.push(lfWinLight(5.4));
  C.decals.push(lfFloorG(.6,1.6,lfRr(0,0,LF.U*2.6,LF.U*5.0,4,"#d8c8a8","rgba(0,0,0,.15)")));
  C.add(5.8+1.6+.3+.6,lfBox(5.8,.3,0,1.6,.6,24,"#a98a6a",{top:"#e8dcc8"})+lfBox(6.0,.4,24,.3,.3,6,"#7fe0c0"));
  C.add(3.0+1.4+.2+.4,lfBox(3.0,.2,0,1.4,.4,50,"#c9b090",{top:"#e8dcc8"})+[0,1,2].map(function(k){return lfBox(3.1+k*.42,.25,20,.34,.3,6,["#fff","#cfe8f0","#f0d8e0"][k])+lfBox(3.1+k*.42,.25,34,.34,.3,6,["#cfe8f0","#fff","#fff"][k])}).join(""));
  lfPrep(C,"supply",3.7,1.0);C.s("work",6.6,1.3,1,"look",[6,12],{tag:"desk"});
  var tbl=function(y,k){C.add(1.0+1.6+y+.7,lfBox(1.1,y+.1,0,.1,.1,12,"#a98a6a")+lfBox(2.4,y+.1,0,.1,.1,12,"#a98a6a")+lfBox(1.0,y,12,1.6,.7,3,"#f6f0e8",{top:"#ffffff"})+lfBox(1.0,y,15,.3,.7,2,"#cfe8f0"));lfCust(C,1.8,y+.35,1,{lie:1,uact:"lie",lz:16,lbl:"B",grp:"b",num:k,wx:1.8,wy:y+1.05,udur:[18,30]})};
  tbl(2.0,1);tbl(3.6,2);if(C.has("sp_table"))tbl(5.2,3);
  lfWander(C,[[4.2,3.0,-1],[6.8,2.0,1],[3.4,6.8,-1]]);
  lfOrderBoard(C,.6,100,"BOOKINGS");
  C.front.push(lfSteam(2.0,2.8,22,1));
  if(C.has("sp_candle")){[[.5,1.8],[.5,3.4],[2.9,2.0],[2.9,3.6],[6.2,.8]].forEach(function(p){lfLight(C,p[0],p[1],8,"#ffb060",1.8,.8)});[[.5,1.8],[.5,3.4],[2.9,2.0],[2.9,3.6],[6.2,.8]].forEach(function(p){C.front.push(lfCandle(p[0],p[1]))})}
  if(C.has("sp_sauna")){var sx=5.4,sy=2.0,sw2=2.0,sd=1.6,wd="#b9854e";
    C.add(sx+sy+.2,lfBox(sx,sy,0,sw2,sd,2,"#8a5a30",{top:"#a9763f"})+lfBox(sx,sy,0,sw2,.12,64,wd,{top:"#8a5a30"})+lfBox(sx,sy,0,.12,sd,64,lfSh(wd,-.1),{top:"#8a5a30"})+lfBox(sx+.12,sy+.12,0,sw2-.12,.45,14,"#a9763f",{top:"#c9965a"}));
    C.add(sx+sw2+sy+sd+.5,lfBox(sx+sw2-.08,sy,0,.08,sd,64,"rgba(255,220,170,.18)",{top:"#8a5a30",l:"rgba(255,220,170,.15)",r:"rgba(220,170,120,.22)"})+lfBox(sx,sy+sd-.08,0,sw2,.08,64,"rgba(255,220,170,.16)",{top:"#8a5a30",l:"rgba(255,220,170,.14)",r:"rgba(220,170,120,.2)"})+lfBox(sx,sy,64,sw2,sd,4,"#7a4a26",{top:"rgba(160,110,60,.55)"}));
    C.front.push(lfSteam(6.4,2.6,50,3));[[6.0,2.45],[6.8,2.45]].forEach(function(p,k){lfCust(C,p[0],p[1],-1,{sit:1,uact:"sit",menu:["Towel","Cold water","Eucalyptus"],mx:false,lbl:"S",grp:"sa",num:k+1,wx:p[0],wy:4.0})})}
  if(C.has("sp_wine")){C.add(4.2+2.8+4.8+2.2,lfBox(4.2,4.8,0,2.8,2.2,8,"#a8a29a",{top:"#c9c3b8"})+lfBox(4.4,5.0,7.4,2.4,1.8,1,"#7a0a2a",{top:"#9a1a3a"}));C.front.push(lfSteam(5.6,5.9,12,3));lfBlock(4.2,4.8,7.0,7.0);
    [[4.9,5.5],[5.9,5.9],[6.5,5.2]].forEach(function(p,k){lfCust(C,p[0],p[1],-1,{sit:1,uact:"sit",menu:["Wine pour","Green tea","Coffee bath"],mx:false,lbl:"W",grp:"w",num:k+1,wx:p[0],wy:7.35,udur:[20,32]})})}
  if(C.has("sp_facial")){C.add(2.8+6.4+.9,lfBox(2.8,6.4,0,.7,.8,10,"#cfe8f0",{top:"#e8f6fa"})+lfBox(2.8,6.4,10,.7,.15,22,"#cfe8f0"));lfCust(C,3.15,6.85,-1,{sit:1,uact:"sit",menu:["Facial","Sheet mask"],mx:false,lbl:"F",grp:"f",num:1})}
  if(C.has("sp_zen"))C.decals.push(lfFloorG(.4,6.4,lfRr(0,0,LF.U*1.8,LF.U*1.2,3,"#e8dcc0","#c9b890")+[0,1,2,3].map(function(k){return '<path d="M4 '+(6+k*7)+' q'+LF.U*.9+' -6 '+(LF.U*1.8-8)+' 0" stroke="rgba(150,130,90,.6)" fill="none"/>'}).join("")+'<ellipse cx="'+LF.U*1.2+'" cy="'+LF.U*.6+'" rx="6" ry="4" fill="#8a8a8a"/>'));
  if(C.has("sp_robe"))C.walls.push(lfFaceY(2.6,0,70,'<rect width="44" height="4" fill="#a98a6a"/><path d="M6 4 h12 l3 30 h-18z" fill="#fff" stroke="#ddd"/><path d="M24 4 h12 l3 30 h-18z" fill="#f0d8e0" stroke="#ddd"/>'));
};
SVC.spa={lbl:"B",unit:"Bed",boardName:"Bookings",verbs:["Waiting","Prepping","Relaxing"],short:["wait","prep","relax"],quiet:"Serene",menu:["Massage","Deep tissue","Aromatherapy"],use:"lie",udur:[18,30],pat:95,
  guests:function(r,C,n){return 2+Math.floor(addonsOf(r).length/2)},
  steps:function(s,X,item){var P=X.P("supply"),A=X.A(s),srv=/Massage|tissue|stone|Aroma|Facial|mask/i.test(item),pour=/pour|tea|bath/i.test(item);
    return [{x:P.x,y:P.y,act:"reach",tag:"towel",dur:[1.1,1.6],fx:-1},{x:A.x,y:A.y,act:srv?"work":"reach",tag:pour?"pour":srv?"massage":"place",dur:srv?[4.5,7]:[1.3,2],carry:!srv}]}};

/* ===== arcade (sprite room) ===== */
function lfArcStn(C,x,y,k,gx,gy){var n0=C.st.length;C.s("play",x,y,-1,"work",[6,14],{tag:"arcade"});lfConvert(C,n0,"play",{wact:"look",uact:"work",menu:["Tokens","Soda","Rematch"],lbl:"A",grp:"a",num:k,udur:[14,22]})}
LFROOM.gameroom=function(C){
  var H=function(k){return C.has(k)};
  lfDoorAt(C,11.2);
  lfSprWin(C,"w_winrs2",.05,7.6,.1,.05,{H:92,dy:-34});
  lfSpr(C,"w_arneon",.05,3.4,.1,.1,{h:1,H:60,dy:-84,nosh:1});lfLight(C,.8,3.4,100,"#4aa8ff",2.2,.3);
  lfSpr(C,"w_arart",.05,9.9,.1,.1,{h:1,H:58,dy:-74,nosh:1});
  lfSpr(C,"w_arclock",12.9,.05,.1,.05,{h:1,flip:1,H:44,dy:-96,nosh:1});
  C.obsc=.7;lfOrderBoard(C,1.5,96,"QUEUE");
  /* prize counter against the back wall */
  lfSpr(C,"ar_ticket",4.4,.2,2.8,1.9,{h:34,flip:1,ctr:1,H:104});lfPrep(C,"counter",5.4,2.5);
  C.s("work",5.9,1.2,1,"look",[6,12],{tag:"counter"});
  lfSpr(C,"w_artv",8.2,.05,.1,.05,{h:1,flip:1,H:70,dy:-64,nosh:1});
  /* cabinets down the left wall (pro cabinets upgrade swaps the art) */
  var lux1=H("gm_lux1");
  lfSpr(C,lux1?"arL_fight":"ar_fight",.12,1.4,1.1,1.0,{h:40,H:106});lfArcStn(C,1.9,1.9,1);
  if(H("gm_cab")){lfSpr(C,lux1?"arL_fight":"ar_fight",.12,2.8,1.1,1.0,{h:40,H:106});lfArcStn(C,1.9,3.3,2);
    lfSpr(C,lux1?"arL_race":"ar_race",.12,4.3,1.9,1.7,{h:44,H:114,ctr:1});lfArcStn(C,2.6,5.1,3)}
  lfRugD&&lfRugD(C,2.2,7.2,3.6,2.8,"#3f3470","#5a4ea3");
  /* bean bags (base) */
  lfSpr(C,"ar_bean",2.4,7.4,2.4,1.6,{h:30,H:48,ctr:1});
  lfCust(C,3.0,8.1,-1,{sit:1,tag:"bean",uact:"type",menu:["Controller","Snacks","Soda"],lbl:"B",grp:"b",num:1,wx:3.0,wy:9.2});lfCust(C,4.2,8.7,-1,{sit:1,tag:"bean",uact:"type",menu:["Controller","Snacks","Soda"],lbl:"B",grp:"b",num:2,wx:4.2,wy:9.6});
  lfWander(C,[[7,5,-1],[9,8,1],[5.8,3.4,1],[10.5,3,-1]]);
  if(H("gm_tft")){lfSpr(C,"ar_pin",6.2,3.6,1.3,2.1,{h:44,H:100,ctr:1});var n=C.st.length;lfCust(C,7.9,4.7,-1,{wact:"look",uact:"work",menu:["Snacks","Rematch","Soda"],lbl:"T",grp:"tft",num:1})}
  if(H("gm_pool")){lfSpr(C,H("gm_lux2")?"arL_foos":"ar_foos",6.8,7.0,2.3,1.5,{h:34,H:74,ctr:1});lfCust(C,7.4,8.8,-1,{wact:"look",uact:"reach",menu:["Rack 'em","Chalk","Soda"],lbl:"P",grp:"p",num:1});lfCust(C,9.3,7.9,1,{wact:"look",uact:"reach",menu:["Rack 'em","Chalk","Soda"],lbl:"P",grp:"p",num:2})}
  if(H("gm_hockey")){lfSpr(C,H("gm_lux2")?"arL_hockey":"ar_hockey",9.6,3.8,2.6,1.7,{h:30,H:70,ctr:1});lfCust(C,10.4,5.9,-1,{wact:"look",uact:"reach",menu:["Puck","Rematch"],lbl:"H",grp:"h",num:1});lfCust(C,12.2,4.6,1,{wact:"look",uact:"reach",menu:["Puck","Rematch"],lbl:"H",grp:"h",num:2})}
  if(H("gm_snack")){lfSpr(C,H("gm_lux4")?"arL_vend":"ar_vend",9.6,.2,1.3,1.1,{h:40,flip:1,H:116,ctr:1})}
  if(H("gm_claw")){lfSpr(C,H("gm_lux5")?"arL_prize":"ar_claw1",13.0,.2,1.4,1.4,{h:44,flip:1,H:118,ctr:1});lfCust(C,13.5,2.4,-1,{wact:"look",uact:"work",menu:["Tokens","Soda"],lbl:"K",grp:"k",num:1})}
  if(H("gm_vr")){lfSpr(C,"arL_vr",12.4,8.2,2.3,2.0,{h:44,H:84,ctr:1});lfCust(C,13.0,10.3,-1,{wact:"look",uact:"up",menu:["Headset","Reset"],lbl:"V",grp:"v",num:1})}
  if(H("gm_couch")){var n2=C.st.length;lfSpr(C,H("gm_lux3")?"arL_sofa":"lg_sofa",6.8,10.2,3.0,1.5,{h:30,ctr:1,H:H("gm_lux3")?74:64});lfConvert(C,n2,"sit",{uact:"type",menu:["Controller","Snacks","Soda"],lbl:"C",grp:"c",wy:9.2});
    lfCust(C,7.7,10.7,1,{sit:1,tag:"sofa",uact:"type",menu:["Controller","Snacks","Soda"],lbl:"C",grp:"c",num:1,wx:7.7,wy:9.7});lfCust(C,8.9,10.7,1,{sit:1,tag:"sofa",uact:"type",menu:["Controller","Snacks","Soda"],lbl:"C",grp:"c",num:2,wx:8.9,wy:9.7})}
  if(H("gm_league"))lfSpr(C,"w_arscore",.05,6.6,.1,.1,{h:1,H:44,dy:-100,nosh:1});if(H("gm_cab"))lfSpr(C,"w_arled",.05,6.0,.1,.1,{h:1,H:20,dy:-76,nosh:1});
  if(H("gm_lux3"))lfLight(C,8.2,9.5,60,"#b388ff",2.4,.35);
};

/* ===== dojo / club / spa (sprite rooms) ===== */
function lfW1(C,k,x,y,H,dy,flip,hx){lfSpr(C,k,x,y,.1,.1,{h:1,H:H,dy:dy,nosh:1,flip:flip?1:0})}
LFROOM.dojo=function(C){
  var H=function(k){return C.has(k)};
  lfDoorAt(C,8.2);
  lfSprWin(C,"w_winrs2",.05,4.5,.1,.05,{H:92,dy:-34});
  lfW1(C,"w_djwave",1.7,.05,58,-76,1);lfW1(C,"w_djscroll",4.1,.05,104,-62,1);
  if(H("d_belt"))lfW1(C,"w_djbelts",.05,6.4,34,-88,0);
  lfW1(C,"w_djshoji",.05,1.9,64,-70,0);
  if(H("d_lux3"))lfW1(C,"w_djcarve",.05,7.4,40,-80,0);
  lfW1(C,"w_djclock",6.9,.05,38,-96,1);
  var lux1=H("d_lux1"),lux2=H("d_lux2"),lux3=H("d_lux3"),lux4=H("d_lux4");
  C.decals.push(lfFloorG(1.8,4.4,lfRr(0,0,LF.U*1.4,LF.U*1.1,2,"#3a5a8a","rgba(0,0,0,.3)")));C.decals.push(lfFloorG(3.4,5.2,lfRr(0,0,LF.U*1.4,LF.U*1.1,2,"#3a5a8a","rgba(0,0,0,.3)")));
  lfSpr(C,lux1?"djL_bag":"dj_bag",.15,.5,1.1,1.1,{h:34,H:112});C.s("work",1.9,1.1,-1,"work",[8,16],{tag:"train"});C.s("work",2.2,3.4,1,"up",[8,16],{tag:"stretch"});
  var st=function(x,y,o){return lfCust(C,x,y,-1,Object.assign({wact:"look",uact:"work",lbl:"M",grp:"m",num:lfNum(C,"m")},o||{}))};
  st(2.5,5.0);st(4.1,5.8);
  lfWander(C,[[5.4,4.4,-1],[6.6,2.4,1],[7.2,6.4,-1],[3.4,3.4,-1]]);
  lfOrderBoard(C,7.4,96,"MAT");
  if(H("d_dummy")){lfSpr(C,lux1?"djL_dummy":"dj_dummy",4.5,3.2,1.2,1.2,{h:34,H:104,ctr:1});C.s("work",4.0,4.4,1,"work",[8,16],{tag:"hit"})}
  if(H("d_rack"))lfSpr(C,lux2?"djL_rack":"dj_rack",.5,.15,2.1,.9,{h:30,flip:1,H:74});
  if(H("d_bonsai"))lfSpr(C,lux3?"djL_bonsai":"dj_bonsai",.15,2.6,1.0,1.4,{h:30,H:92});
  if(H("d_gong"))lfSpr(C,lux2?"djL_gong":"dj_gong",5.6,.15,1.5,.8,{h:44,flip:1,H:104});
  if(H("d_mats")){[[5.0,4.8],[1.4,6.6]].forEach(function(p){C.decals.push(lfFloorG(p[0],p[1],lfRr(0,0,LF.U*1.4,LF.U*1.1,2,"#8a3a3a","rgba(0,0,0,.3)")))});st(5.6,5.3);st(2.0,7.1);
    lfSpr(C,lux4?"djL_tatami":"dj_tatami",8.5,7.7,1.3,1.1,{h:20,H:50,ctr:1})}
  if(H("d_cush")){lfSpr(C,lux4?"djL_cush":"dj_cush",6.6,2.8,2.0,1.0,{h:16,H:36,ctr:1});[[7.1,3.2],[8.0,3.2]].forEach(function(p,j){lfCust(C,p[0],p[1],-1,{sit:1,uact:"sit",menu:["Meditate","Breathwork"],mx:false,lbl:"Z",grp:"z",num:j+1})});
    lfSpr(C,lux3?"djL_tea":"dj_tea",7.4,4.4,1.2,1.2,{h:20,H:44,ctr:1})}
  if(H("d_ring")){var rp=[[5.6,5.8],[7.6,5.8],[5.6,7.6],[7.6,7.6]];C.add(5.6+5.8+.01,lfBox(5.6,5.8,0,2.0,2.0,2,"#e8e0d0",{top:"#f2ece0"}));rp.forEach(function(p){C.add(p[0]+p[1]+.05,lfBox(p[0]-.06,p[1]-.06,0,.12,.12,30,"#c0392b"))})}
  if(lux4)lfSpr(C,"djL_cab",.15,7.0,1.0,1.6,{h:34,H:80});
  if(lux3)lfLight(C,1.4,3.2,70,"#ffd9a0",2,.3);
};
/* ===== nightclub ===== */
LFROOM.club=function(C){
  var H=function(k){return C.has(k)};
  lfDoorAt(C,8.4);
  var df='',cols=H("c_led")?["#ff3df0","#4dd2ff","#9cff8a","#ffd24a","#ff5c5c"]:["#7a2a9a","#2a5a9a","#9a2a6a"];
  for(var i=0;i<5;i++)for(var j=0;j<4;j++)df+='<rect class="lfdf" style="animation-delay:'+(((i*3+j*5)%7)*.23).toFixed(2)+'s" x="'+(i*LF.U*.8+1)+'" y="'+(j*LF.U*.75+1)+'" width="'+(LF.U*.8-2)+'" height="'+(LF.U*.75-2)+'" fill="'+cols[(i+j)%cols.length]+'"/>';
  C.decals.push(lfFloorG(3.2,2.8,'<rect width="'+LF.U*4+'" height="'+LF.U*3+'" fill="#0a0a14"/>'+df));
  var lx1=H("c_lux1"),lx2=H("c_lux2"),lx3=H("c_lux3"),lx4=H("c_lux4");
  lfW1(C,"w_clbolt",3.0,.05,70,-84,1);lfW1(C,"w_clled",4.6,.05,36,-112,1);lfW1(C,"w_clart",.05,6.2,56,-70,0);
  if(H("c_laser"))lfW1(C,"w_cllaser",7.3,.05,22,-120,1);
  lfSpr(C,lx1?"clL_dj":"cl_dj",2.4,.2,2.8,1.4,{h:30,flip:1,H:76,ctr:1});lfPrep(C,"dj",3.6,1.8);C.s("work",3.8,1.9,1,"work",[10,20],{tag:"dj"});
  lfSpr(C,lx2?"clL_bar":"cl_bar",.12,2.2,2.2,2.8,{h:40,H:96});lfPrep(C,"clubbar",2.6,3.6);C.s("work",2.7,3.0,1,"work",[6,12],{tag:"pour"});
  [2.6,3.6,4.6].forEach(function(y,k){lfCust(C,3.0,y,-1,{wact:"look",uact:"eat",stool:1,lbl:"S",grp:"s",num:k+1})});
  var dsp=[[4.0,3.8],[5.2,4.0],[6.4,3.4],[4.6,5.0]].concat(H("c_led")?[[6.0,5.1],[6.9,4.4]]:[]);
  dsp.forEach(function(p,k){lfCust(C,p[0],p[1],-1,{wact:"dance",uact:"dance",menu:["Song req","Water","Shots"],mx:false,lbl:"D",grp:"d",num:k+1,udur:[16,28]})});
  lfWander(C,[[8.2,3.4,-1],[2.6,6.8,1],[7.4,6.4,-1]]);
  lfOrderBoard(C,6.3,104,"BAR TAB");
  lfSpr(C,lx3?"clL_high":"cl_high",4.2,6.2,1.4,1.4,{h:34,H:60,ctr:1});
  if(H("c_led"))lfSpr(C,lx1?"clL_ball":"cl_ball",5.6,4.6,.8,.8,{h:40,H:92,ctr:1});
  if(H("c_laser"))lfSpr(C,"cl_truss",7.4,6.4,1.6,1.0,{h:30,H:104,ctr:1});
  if(H("c_fog")){lfSpr(C,"cl_fog",8.2,1.0,1.1,.9,{h:26,flip:1,H:46,ctr:1});C.front.push([0,1,2].map(function(k){var fp=lfP(3.6+k*1.4,5.6,4);return '<ellipse class="lffog" style="animation-delay:'+(-k*3)+'s" cx="'+fp[0]+'" cy="'+fp[1]+'" rx="46" ry="14" fill="rgba(220,210,255,.16)"/>'}).join(""))}
  if(H("c_vip")){var n0=C.st.length;lfSpr(C,lx3?"clL_sofa":"cl_sofa",6.6,6.0,2.6,2.0,{h:36,H:78,ctr:1});C.s("sit",7.4,7.0,1,"eat",[10,20],{dk:99,tag:"vip"});lfConvert(C,n0,"sit",{uact:"eat",menu:["Bottle","Champagne"],mx:false,lbl:"V",grp:"v"})}
  if(H("c_vip2")){var n1=C.st.length;lfSpr(C,lx3?"clL_sofa":"cl_sofa",1.4,5.6,2.6,2.0,{h:36,H:78,ctr:1});C.s("sit",2.2,6.6,1,"eat",[10,20],{dk:99,tag:"vip"});lfConvert(C,n1,"sit",{uact:"eat",menu:["Bottle","Champagne"],mx:false,lbl:"W",grp:"w"})}
  if(H("c_podium"))[[8.4,3.0],[8.4,4.8]].forEach(function(p,k){C.add(p[0]+p[1]+.8,lfBox(p[0]-.4,p[1]-.4,0,.8,.8,14,"#2a2438",{top:"#ff3df0"}));C.plat.push({x0:p[0]-.4,y0:p[1]-.4,x1:p[0]+.4,y1:p[1]+.4,z:14,key:p[0]+p[1]+.81});lfCust(C,p[0],p[1],-1,{wact:"dance",uact:"dance",menu:["Water"],mx:false,lbl:"P",grp:"p",num:k+1,udur:[16,28]})});
  if(H("c_sound")){lfSpr(C,lx4?"clL_spk":"cl_spk",.15,.2,.9,.9,{h:30,H:112});lfSpr(C,lx4?"clL_spk2":"cl_spk2",.15,1.2,.9,.9,{h:30,H:112})}
  if(H("c_rope"))lfSpr(C,lx2?"clL_rope":"cl_rope",7.4,2.6,1.8,.9,{h:20,H:50,ctr:1});
  if(lx1||lx3)lfLight(C,5.2,4.4,70,"#b388ff",2.6,.35);
};
/* ===== spa ===== */
LFROOM.spa=function(C){
  var H=function(k){return C.has(k)};
  var lx1=H("sp_lux1"),lx2=H("sp_lux2"),lx3=H("sp_lux3"),lx4=H("sp_lux4");
  lfDoorAt(C,4.8);
  lfSprWin(C,"w_winrs2",.05,5.2,.1,.05,{H:92,dy:-34});lfSprWin(C,"w_winrs2",.05,9.0,.1,.05,{H:92,dy:-34});
  /* sections: A treatment lounge (x<6.4), B sauna (back right), C onsen (front right) divided by partition walls */
  var wcol=lx2?"#e8e2d4":"#d9c7a4",wtop=lx2?"#fbf6ea":"#f0e2c4",WH=lx2?64:60;
  var pw=function(x,y,w,d){C.add(x+w+y+d-.02,lfBox(x,y,0,w,d,WH,wcol,{top:wtop})+(lx2?lfBox(x,y,WH,w,d,2.4,"#caa24a",{top:"#e8c56a"}):lfBox(x,y,WH,w,d,2,"#8a6a3a",{top:"#a98a5a"})))};
  pw(6.4,0,.28,1.2);pw(6.4,2.8,.28,3.6);pw(6.4,8.0,.28,3.0);        /* x=6.4 partition, openings y1.2-2.8 and y6.4-8.0 */
  pw(6.68,4.8,6.0,.28);pw(13.8,4.8,.2,.28);                          /* y=4.8 partition, opening x12.68-13.8 */
  lfW1(C,"w_spart",11.4,.05,70,-70,1);lfW1(C,"w_spclock",.05,7.2,34,-100,0);lfW1(C,"w_spfount",.05,.9,30,-60,0);
  C.decals.push(lfFloorG(.6,1.6,lfRr(0,0,LF.U*2.6,LF.U*8.6,4,"#d8c8a8","rgba(0,0,0,.15)")));
  C.decals.push(lfFloorG(6.9,5.3,lfRr(0,0,LF.U*6.8,LF.U*5.4,4,lx2?"#cfc8b8":"#9a8a6a","rgba(0,0,0,.15)")));
  lfPrep(C,"supply",3.6,1.0);C.s("work",4.0,2.0,1,"look",[6,12],{tag:"desk"});
  lfSpr(C,lx3?"spL_robes":"sp_robes",2.2,.15,1.5,.8,{h:24,flip:1,H:52});
  var tbl=function(y,k){lfSpr(C,lx1?"spL_table":"sp_table",.3,y,1.4,2.2,{h:30,H:54,ctr:1});lfCust(C,1.0,y+1.1,1,{lie:1,uact:"lie",lz:20,lbl:"B",grp:"b",num:k,wx:2.4,wy:y+1.1,udur:[18,30]})};
  tbl(1.0,1);tbl(3.4,2);if(H("sp_table"))tbl(5.8,3);
  lfWander(C,[[3.6,4.4,-1],[4.0,7.6,1],[7.2,7.4,-1],[9.6,3.2,1],[8.0,10.0,-1]]);
  lfOrderBoard(C,.9,100,"BOOKINGS");
  lfSpr(C,lx4?"spL_orchid":"sp_bamboo",13.2,8.6,.6,.6,{h:26,H:96,ctr:1});
  if(H("sp_candle")){lfSpr(C,lx4?"spL_candle":"sp_candle",3.8,.15,.8,.7,{h:20,flip:1,H:60});lfLight(C,4.1,.6,40,"#ffb060",1.8,.8);lfLight(C,3.2,7.8,20,"#ffb060",1.8,.5)}
  if(H("sp_stone"))lfSpr(C,lx4?"spL_stones":"sp_stones",1.0,.15,.9,.8,{h:16,flip:1,H:30});
  if(H("sp_sauna")){lfSpr(C,lx2?"spL_sauna":"sp_sauna",8.0,.2,2.0,1.8,{h:60,flip:1,H:104,ctr:1});C.front.push(lfSteam(9.0,1.2,70,3));[[8.5,2.3],[9.5,2.3]].forEach(function(p,k){lfCust(C,p[0],p[1],-1,{sit:1,uact:"sit",menu:["Towel","Cold water","Eucalyptus"],mx:false,lbl:"S",grp:"sa",num:k+1,wx:p[0],wy:3.8})})}
  if(H("sp_wine")){lfSpr(C,lx2?"spL_tub":"sp_tub",7.8,6.2,4.4,4.0,{h:30,H:118,ctr:1});C.front.push(lfSteam(10.0,8.0,24,3));C.front.push(lfSteam(11.4,8.8,24,2));lfBlock(7.8,6.2,12.2,10.2);
    [[8.8,7.4],[9.9,7.0],[11.0,7.4],[9.1,8.6],[10.2,9.0],[11.3,8.6]].forEach(function(p,k){lfCust(C,p[0],p[1],-1,{sit:1,uact:"sit",menu:["Sake pour","Green tea","Yuzu soak"],mx:false,lbl:"W",grp:"w",num:k+1,wx:9.8,wy:10.5,udur:[20,32]})})}
  if(H("sp_facial")){lfSpr(C,lx3?"spL_chaise":"sp_chaise",3.6,8.6,1.8,1.4,{h:26,H:62,ctr:1});lfCust(C,4.3,9.2,-1,{sit:1,uact:"sit",menu:["Facial","Sheet mask"],mx:false,lbl:"F",grp:"f",num:1})}
  if(H("sp_zen"))lfSpr(C,lx2?"spL_foot":"sp_foot",12.6,3.0,1.2,1.1,{h:24,H:54,ctr:1});
  if(H("sp_robe"))lfW1(C,"w_spglass",.05,7.9,44,-84,0);
  C.front.push(lfSteam(1.5,3.0,22,1));
};
/* ===== movie theater (sprite) ===== */
LFROOM.theater=function(C){
  var H=function(k){return C.has(k)};
  lfDoorAt(C,8.6);
  var lx1=H("t_lux1"),lx2=H("t_lux2"),lx3=H("t_lux3"),lx4=H("t_lux4");
  C.decals.push(lfFloorG(2.6,1.8,lfRr(0,0,LF.U*5.8,LF.U*6.0,4,"#5a1a2a","rgba(0,0,0,.3)")+'<path d="M0 '+LF.U*1+' H'+LF.U*5.8+' M0 '+LF.U*2+' H'+LF.U*5.8+' M0 '+LF.U*3+' H'+LF.U*5.8+' M0 '+LF.U*4+' H'+LF.U*5.8+' M0 '+LF.U*5+' H'+LF.U*5.8+'" stroke="rgba(255,255,255,.05)"/>'));
  var big=H("t_imax"),sw=big?5.6:4.4,sh=big?84:66,y0=big?7.2:6.6;
  var scr='<rect x="-5" y="-5" width="'+(LF.U*sw+10)+'" height="'+(sh+10)+'" fill="#0a0a0e" stroke="'+LFOL+'" stroke-width="1"/><rect class="lfscr2" width="'+LF.U*sw+'" height="'+sh+'" fill="url(#lfscrg'+C.uid+')"/><text class="lfscrt" data-k="'+C.key+'" x="'+LF.U*sw/2+'" y="'+(sh/2+4)+'" text-anchor="middle" font-size="11" font-family="Arial" font-weight="800" fill="rgba(255,255,255,.9)"></text>';
  C.walls.push('<defs><linearGradient id="lfscrg'+C.uid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a6ab5"/><stop offset=".5" stop-color="#b03a8a"/><stop offset="1" stop-color="#ff9d3a"/></linearGradient></defs>'+lfFaceX(0,y0,big?116:106,scr));
  C.walls.push(lfFaceX(0,y0+.05,30,'<rect width="'+LF.U*sw+'" height="6" fill="#4a0a14"/>'));
  var pj=lfP(9.4,.25,96),s1=lfP(0,y0-sw,(big?116:106)-sh/2),s2=lfP(0,y0,(big?116:106)-sh/2);
  C.front.push('<polygon class="lfbeam" points="'+pj[0]+','+pj[1]+' '+s1[0]+','+(s1[1]-sh/2)+' '+s2[0]+','+(s2[1]+sh/2)+'" fill="rgba(200,220,255,.07)"/>');
  lfW1(C,"w_thposter",.05,H("t_sound")?7.3:1.55,64,-70,0);lfW1(C,"w_thmarq",6.0,.05,26,-112,1);if(!H("t_sound"))lfW1(C,"w_thclap",.05,7.2,34,-96,0);
  lfSpr(C,lx2?"thL_ctr":"th_ctr",4.6,.2,2.8,1.8,{h:30,flip:1,ctr:1,H:78});lfPrep(C,"counter",5.8,2.4);
  C.s("work",6.2,1.2,1,"look",[6,12],{tag:"counter"});C.s("look",8.6,6.8,-1,"look",[5,10],{tag:"usher"});
  var rowsX=[3.2,4.8].concat(H("t_recline")?[6.4]:[]);
  rowsX.forEach(function(x,ri){var rec=ri===2;[2.9,3.9,4.9,5.9].forEach(function(y,k){
    var key=rec?(lx3?"ts_v1":"ts_b1"):(lx1?"ts_b1":"ts_r1");
    lfSpr(C,key,x,y-.48,.95,.95,{h:26,H:rec?70:64,ctr:1});
    lfCust(C,x+.3,y,-1,{sit:1,uact:"eat",lbl:String.fromCharCode(65+ri),grp:"r"+ri,num:k+1,wx:x+1.05,wy:y,udur:[30,55]})})});
  lfWander(C,[[8.2,4.0,-1],[7.8,6.4,1],[2.2,7.2,-1]]);
  lfOrderBoard(C,2.4,104,"SNACKS");
  if(H("t_pop")){lfSpr(C,lx2?"thL_pop":"th_pop",2.9,.2,1.0,1.0,{h:30,flip:1,ctr:1,H:92});C.front.push(lfSteam(3.2,.7,60,2))}
  if(H("t_candy")){var cw='<rect width="'+LF.U*1.6+'" height="40" fill="#2a1a20" stroke="'+LFOL+'"/>';for(var a=0;a<4;a++)for(var b=0;b<6;b++)cw+='<circle cx="'+(5+b*7.6)+'" cy="'+(6+a*9)+'" r="3" fill="'+["#ff5c9a","#ffd24a","#4dd2ff","#9cff8a"][(a+b)%4]+'"/>';C.walls.push(lfFaceY(7.7,0,64,cw))}
  if(H("t_hotdog"))lfSpr(C,lx2?"thL_cart":"th_drk",8.0,2.0,1.1,1.1,{h:30,ctr:1,H:62});
  if(H("t_marquee"))for(var m=0;m<14;m++){var mp=lfP(.4+m*.6,0,118);C.walls.push('<circle class="lftwk" style="animation-delay:'+(m*.15).toFixed(2)+'s" cx="'+mp[0].toFixed(1)+'" cy="'+mp[1].toFixed(1)+'" r="2.2" fill="#ffe27a"/>')}
  if(H("t_sound")){lfSpr(C,lx4?"thL_spk":"th_spk",.15,.25,lx4?1.0:.9,lx4?1.8:.9,{h:30,H:120});if(!lx4)lfSpr(C,"th_spk2",.15,7.0,.9,.9,{h:30,H:120})}
  if(H("t_imax"))lfSpr(C,lx4?"thL_proj":"th_proj",9.0,6.6,1.0,1.0,{h:30,ctr:1,H:104});
  if(lx2||lx4)lfLight(C,4.6,2.2,60,"#ffcf8a",2.4,.3);
};

/* ===== lounge / gym / bar / library (sprite rooms) ===== */
LFROOM.lounge=function(C){
  var H=function(k){return C.has(k)};
  lfDoorAt(C,8.4);
  lfSprWin(C,"w_winrs2",.05,1.6,.1,.05,{H:92,dy:-34});lfSprWin(C,"w_winrs2",.05,5.5,.1,.05,{H:92,dy:-34});
  var l1=H("l_lux1"),l2=H("l_lux2"),l3=H("l_lux3"),l4=H("l_lux4");
  lfWander(C,[[2.2,3.2,-1],[3.8,2.8,1],[3.0,4.8,-1],[5.4,3.0,1],[6.4,4.0,-1],[1.8,5.6,1],[4.6,5.6,-1],[7.2,2.4,1]]);
  lfSpr(C,"lg_dogbed",.3,6.3,1.2,1.2,{h:12,H:34,ctr:1});
  lfSpr(C,"lg_lamp",4.7,.15,.9,.9,{h:20,flip:1,H:130});
  if(H("l_rug"))lfRugD(C,1.6,1.8,3.6,2.7,"#d96a7a","#f2c8b0");
  if(H("l_couch"))lfSpr(C,l1?"lgL_sofa":"lg_sofa",l1?.8:1.1,.15,l1?3.4:2.8,l1?3.0:1.3,{h:34,flip:1,H:l1?74:62,ctr:1});
  if(H("l_plant"))lfSpr(C,"lg_plant",.2,.2,.9,.9,{h:20,H:118});
  if(H("l_art")){lfW1(C,"w_lgart",5.9,.05,50,-86,1);lfW1(C,"w_lgshelf",.05,3.9,60,-72,0)}
  if(H("l_tv")){lfSpr(C,l3?"lgL_media":"lg_media",.15,2.9,1.0,2.4,{h:36,H:l3?70:80,ctr:1});C.s("watch",3.2,4.1,-1,"sit",[10,22],{dk:99,seatless:1})}
  if(H("l_arcade"))lfSpr(C,"ar_fight",.15,5.5,1.1,1.0,{h:40,H:104});
  if(H("l_neon")){lfLight(C,1.2,2.2,100,"#ff9d5c",3,.7);C.walls.push(lfNeonTxt("R",4.6,114,"HOME","#ff9d5c",15))}
  if(H("l_table"))lfSpr(C,l2?"lgL_coffee":"lg_coffee",3.5,3.1,1.5,1.5,{h:22,H:36,ctr:1});
  if(H("l_beans"))lfSpr(C,"ar_bean",6.8,4.1,2.2,1.5,{h:28,H:44,ctr:1});
  if(H("l_sofa2")){lfSpr(C,l3?"lgL_chair":"lg_chair",3.6,5.3,1.5,1.5,{h:30,H:62,ctr:1});lfSpr(C,l3?"lgL_chair":"lg_chair",5.2,5.3,1.5,1.5,{h:30,H:62,ctr:1})}
  if(H("l_plant2"))lfSpr(C,l4?"lgL_plant":"lb_fern",9.3,2.9,.8,.8,{h:20,H:l4?84:78,ctr:1});
  if(H("l_cart"))lfSpr(C,l2?"lgL_side":"lg_side",8.0,2.4,.9,.9,{h:26,H:l2?96:80,ctr:1});
  if(H("l_speaker")){lfSpr(C,"th_spk",.3,.2,.8,.8,{h:30,flip:1,H:110});lfSpr(C,"th_spk2",.3,7.0,.8,.8,{h:30,H:110})}
  if(l4)lfSpr(C,"lgL_shelf",8.3,.15,1.3,.9,{h:30,flip:1,H:120});else lfSpr(C,"lg_shelf",8.3,.15,1.3,.9,{h:30,flip:1,H:110});
  if(l1||l2)lfLight(C,4.2,3.4,60,"#ffcf8a",2.8,.3);
};
LFROOM.gym=function(C){
  var H=function(k){return C.has(k)};
  var g1=H("y_lux1"),g2=H("y_lux2"),g3=H("y_lux3"),g4=H("y_lux4");
  lfSprWin(C,"w_winrs2",.05,7.6,.1,.05,{H:92,dy:-34});
  var mem=function(x,y,ua,o){return lfCust(C,x,y,-1,Object.assign({wact:"look",uact:ua,lbl:"M",grp:"m",num:lfNum(C,"m")},o||{}))};
  lfSpr(C,"th_ctr",9.0,.2,2.4,1.6,{h:30,flip:1,ctr:1,H:78});lfPrep(C,"desk",9.8,2.3);C.s("work",10.2,1.2,1,"look",[5,10],{tag:"desk"});
  mem(2.8,3.6,"up");mem(3.8,4.6,"up");
  C.s("look",4.4,2.6,-1,"look",[3,6]);
  lfWander(C,[[1.6,4.8,-1],[4.8,4.4,1],[6.6,6.6,-1]]);
  lfOrderBoard(C,6.6,98,"FLOOR");
  lfSpr(C,"gy_plates",11.6,3.0,1.4,1.2,{h:20,ctr:1,H:44});
  lfW1(C,"w_gytv",2.3,.05,50,-96,1);lfW1(C,"w_gyclock",4.4,.05,34,-100,1);lfW1(C,"w_gybolt",.05,2.0,56,-84,0);
  if(H("y_rack")){lfSpr(C,g1?"gyL_rack":"gy_rack",.5,.15,2.1,1.6,{h:44,flip:1,H:112});mem(1.5,2.2,"up",{tag:"squat"})}
  if(H("y_bag")){lfSpr(C,g3?"gyL_db":"gy_db",3.0,.15,2.0,1.0,{h:26,flip:1,H:68});mem(3.7,1.7,"work",{tag:"punch"})}
  if(H("y_bench")){lfSpr(C,g1?"gyL_bench":"gy_bench",5.0,4.0,1.9,1.3,{h:30,ctr:1,H:70});mem(5.8,5.6,"down")}
  if(H("y_tread")){lfSpr(C,g2?"gyL_tread":"gy_tread",.15,3.4,1.6,1.3,{h:34,H:84});mem(1.7,4.3,"run",{tag:"tread",onspot:1,wx:2.4,wy:4.8})}
  if(H("y_mirror"))lfW1(C,"w_gymirror",.05,4.6,76,-70,0);
  if(H("y_bike"))[[9.0,4.2],[9.0,6.2]].forEach(function(p){lfSpr(C,g2?"gyL_bike":"gy_bike",p[0],p[1],1.2,1.2,{h:30,ctr:1,H:84,flip:g2?1:0});mem(p[0]+.6,p[1]+.2,"run",{onspot:1,wx:p[0]+.6,wy:p[1]+1.0})});
  if(H("y_cable")){lfSpr(C,g3?"gyL_cable":"gy_cable",.15,6.9,1.2,1.3,{h:40,H:140});mem(1.7,7.5,"down")}
  if(H("y_smoothie"))lfSpr(C,g2?"gyL_row":"gy_row",5.0,8.0,1.8,.9,{h:20,ctr:1,H:48});
  if(H("y_sauna")){lfSpr(C,g4?"gyL_stretch":"gy_mat",7.6,8.2,g4?1.8:1.1,g4?1.2:1.1,{h:24,ctr:1,H:g4?60:70});lfSpr(C,g4?"gyL_kb":"gy_plates",11.6,8.2,.9,.9,{h:24,ctr:1,H:g4?120:44})}
  if(H("y_pt"))lfW1(C,"w_gyposter",9.4,.05,58,-90,1);
};
LFROOM.bar=function(C){
  var H=function(k){return C.has(k)};
  var b1=H("b_lux1"),b2=H("b_lux2"),b3=H("b_lux3"),b4=H("b_lux4");
  lfSprWin(C,"w_winrs2",.05,5.6,.1,.05,{H:92,dy:-34});
  lfSpr(C,b1?"brL_bar":"br_bar",.9,.9,1.3,4.0,{h:40,H:b1?74:70});
  for(var k=0;k<3;k++){lfSpr(C,b1?"brL_stool":"br_stool",2.5,1.6+k*1.2,.7,.7,{h:26,ctr:1,H:78});lfCust(C,2.65,1.8+k*1.2,-1,{sit:1,tag:"stool",stool:1,uact:"eat",lbl:"S",grp:"s",num:k+1})}
  C.s("work",.5,2.6,1,"work",[6,14],{tag:"pour"});C.s("work",.5,4.0,1,"work",[5,10],{tag:"wipe"});
  lfPrep(C,"bar",.5,3.3);
  lfWander(C,[[4.6,2.0,-1],[4.2,4.4,1],[3.6,3.4,-1]]);
  lfOrderBoard(C,6.0,96,"BAR TAB");
  lfW1(C,"w_brclock",.05,7.4,34,-100,0);
  if(H("b_shelf"))lfSpr(C,b2?"brL_back":"br_back",1.4,.15,3.0,.9,{h:50,flip:1,H:92});
  if(H("b_neon")){lfLight(C,1.5,1.2,90,"#ff5c9a",3.4,.8);lfW1(C,"w_brneon",4.8,.05,50,-96,1)}
  if(H("b_juke"))lfSpr(C,b4?"brL_tree":"br_palm",.3,8.0,1.0,1.0,{h:24,ctr:1,H:b4?120:112});
  if(H("b_menu"))lfW1(C,"w_brmenu",.05,5.6<4?0:3.4,46,-90,0);
  if(H("b_taps"))lfSpr(C,b3?"brL_station":"br_station",4.6,.15,1.6,.8,{h:30,flip:1,H:b3?90:60});
  if(H("b_snack"))lfSpr(C,b3?"brL_tower":"br_ice",7.0,.2,.9,.9,{h:26,flip:1,ctr:1,H:b3?100:120});
  if(H("b_pool"))lfSpr(C,b2?"brL_sofa":"br_sofa",4.6,5.6,2.6,1.6,{h:36,ctr:1,H:74});
  if(H("b_dj"))lfSpr(C,b2?"brL_fire":"br_fire",5.2,3.6,1.6,1.6,{h:26,ctr:1,H:52});
  if(H("b_hightop"))[[5.9,1.6],[6.6,3.2]].forEach(function(p,j){lfSpr(C,b4?"brL_high":"br_high",p[0],p[1],.9,.9,{h:26,ctr:1,H:62});lfCust(C,p[0]+.3,p[1]+1.0,-1,{wact:"look",uact:"eat",lbl:"H",grp:"h",num:j+1})});
  if(H("b_lounge")){var n0=C.st.length;lfSpr(C,b2?"brL_sofa":"br_sofa",1.4,6.0,2.4,1.6,{h:36,ctr:1,H:74});C.s("sit",2.2,6.8,1,"eat",[10,20],{dk:99});lfConvert(C,n0,"sit",{uact:"eat",lbl:"V",grp:"v",wy:5.3})}
  if(H("b_rare"))lfW1(C,"w_brshelf",.05,3.4,44,-80,0);
  if(H("b_string")||b4){var sg=function(r,zz,n,col){var pd='';for(var m=0;m<=n;m++){var tq=m/n,pq=lfP(r*tq,r*(1-tq),zz-9*Math.sin(Math.PI*tq));pd+=(m?'L':'M')+pq[0].toFixed(1)+' '+pq[1].toFixed(1)}C.front.push('<path d="'+pd+'" fill="none" stroke="#2a1c14" stroke-width=".9" opacity=".7"/>');for(var m=0;m<=n;m++){var t=m/n,px=r*t,py=r*(1-t),zb=zz-9*Math.sin(Math.PI*t),p=lfP(px,py,zb);C.front.push('<circle class="lftwk" style="animation-delay:'+((m*.23)%2).toFixed(2)+'s" cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="2.3" fill="'+col+'"/><circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="5" fill="'+col+'" opacity=".16"/>')}};
    sg(3.2,132,8,"#ffe9a8");sg(5.8,126,12,"#ffd27a");sg(8.4,120,16,"#ffe9a8");if(b4||b2)sg(4.5,138,10,"#ffb3d0")}
};
LFROOM.library=function(C){
  var H=function(k){return C.has(k)};
  var a1=H("lb_lux1"),a2=H("lb_lux2"),a3=H("lb_lux3"),a4=H("lb_lux4");
  lfSprWin(C,"w_winrs2",.05,3.9,.1,.05,{H:92,dy:-34});
  C.decals.push('<g class="lfdust">'+[0,1,2,3,4].map(function(i){var p=lfP(4.2+i*.3,1.0+i*.25,30+i*9);return '<circle style="animation-delay:'+(i*.8)+'s" cx="'+p[0]+'" cy="'+p[1]+'" r="1" fill="rgba(255,240,200,.8)"/>'}).join("")+'</g>');
  lfSpr(C,a1?"lbL_shelf":"lb_shelf",.15,.8,1.0,2.2,{h:40,H:a1?132:120});lfSpr(C,a1?"lbL_shelf":"lb_shelf",1.6,.15,2.0,1.0,{h:40,flip:1,H:a1?132:120});
  lfSpr(C,a3?"lbL_desk":"lb_desk",3.0,3.0,1.8,1.3,{h:32,ctr:1,H:a3?60:62});lfSpr(C,"lb_dchair",3.6,4.4,.9,.9,{h:26,ctr:1,H:62});
  lfCust(C,3.6,4.4,-1,{sit:1,uact:"read",lbl:"S",grp:"s",num:1,wy:5.2});lfCust(C,4.4,4.4,-1,{sit:1,uact:"read",lbl:"S",grp:"s",num:2,wy:5.2});
  C.s("browse",1.4,2.6,-1,"look",[5,10],{tag:"browse"});lfPrep(C,"shelf",1.2,2.6);
  lfWander(C,[[4.8,2.0,-1],[2.2,4.6,-1],[6.6,4.6,1]]);
  lfSpr(C,"lb_lamp",5.3,.2,.8,.8,{h:20,flip:1,ctr:1,H:104});
  lfOrderBoard(C,3.9,96,"REQUESTS");
  lfW1(C,"w_lbmap",.05,5.7,56,-84,0);lfW1(C,"w_lbclock",.05,7.0,36,-100,0);
  if(H("lb_lamp")){var n0=C.st.length;lfSpr(C,a2?"lbL_chair":"lb_chair",5.0,4.8,1.5,1.5,{h:32,ctr:1,H:a2?62:60});lfConvert(C,n0,"sit",{uact:"read",lbl:"R",grp:"r",wy:4.4});C.s("sit",5.7,5.5,-1,"read",[18,30],{dk:99})}
  if(H("lb_globe")){lfSpr(C,a3?"lbL_globe":"lb_globe",6.2,.7,1.0,1.0,{h:30,flip:1,ctr:1,H:a3?100:96});C.s("look",5.1,1.9,1,"look",[3,6])}
  if(H("lb_fire")){lfSpr(C,a4?"lbL_lamp":"lb_lamp",.4,6.4,.8,.8,{h:20,ctr:1,H:a4?88:104});lfLight(C,.9,6.6,50,"#ffd27a",2.6,.5)}
  if(H("lb_carrel"))[6.0,7.4].forEach(function(x,j){lfSpr(C,a3?"lbL_desk":"lb_desk",x,.15,1.4,.9,{h:30,flip:1,H:58});lfCust(C,x+.6,1.4,-1,{sit:1,uact:"read",lbl:"D",grp:"d",num:j+1,wy:2.0})});
  if(H("lb_cafe")){lfSpr(C,a4?"lbL_table":"lb_table",6.6,6.2,1.2,1.2,{h:24,ctr:1,H:a4?52:44});C.front.push(lfSteam(7.0,6.6,38,2));lfPrep(C,"cafe",6.9,7.3)}
  if(H("lb_rare")){lfSpr(C,"lbL_shelf",8.6,3.4,1.0,1.4,{h:34,ctr:1,H:132});lfPrep(C,"rare",8.0,4.4)}
  if(H("lb_ladder"))lfSpr(C,a1?"lbL_corner":"lb_corner",8.6,.15,1.2,1.2,{h:30,flip:1,H:a1?96:110});
  if(H("lb_quiet"))lfW1(C,"w_lbpeg",.05,2.0?4.6:0,44,-96,0);
  if(a4)lfSpr(C,"lbL_fern",.4,7.2,.8,.8,{h:20,ctr:1,H:70});else lfSpr(C,"lb_fern",.4,7.2,.8,.8,{h:20,ctr:1,H:70});
};

/* ===== cinema: lobby deck + stepped auditorium ===== */
function lfTbox(C,x,y,w,d,z0,h,col,top,lay){var r=LFREC;LFREC=null;var g=lfBox(x,y,z0,w,d,h,col,{top:top||col});LFREC=r;(lay==="w"?C.walls:C.decals).push(g)}
function lfToon(uid,W,Hh){
  var P=function(n,r){return '<ellipse class="tnp tnp'+n+'" cx="'+r[0]+'" cy="-6" rx="1.6" ry="1" fill="#ffb8d0"/>'};
  var css='<style>.tnB,.tnC{opacity:0}.tnA{animation:tnA 30s infinite}.tnB{animation:tnB 30s infinite}.tnC{animation:tnC 30s infinite}'
  +'@keyframes tnA{0%,30%{opacity:1}34%,94%{opacity:0}100%{opacity:1}}@keyframes tnB{0%,30%{opacity:0}34%,63%{opacity:1}67%,100%{opacity:0}}@keyframes tnC{0%,63%{opacity:0}67%,94%{opacity:1}98%,100%{opacity:0}}'
  +'.tnS1{animation:tnS 14s linear infinite}.tnS2{animation:tnS 5s linear infinite}.tnS3{animation:tnS 22s linear infinite}@keyframes tnS{to{transform:translateX(-160px)}}'
  +'.tnp{animation:tnF 5s linear infinite}.tnp2{animation-delay:-1s}.tnp3{animation-delay:-2s;animation-duration:6s}.tnp4{animation-delay:-3.2s}.tnp5{animation-delay:-4s;animation-duration:7s}.tnp6{animation-delay:-.4s}@keyframes tnF{0%{transform:translate(0,0) rotate(0)}100%{transform:translate(-42px,100px) rotate(540deg)}}'
  +'.tnW{transform-box:fill-box;transform-origin:0% 50%;animation:tnW 1.4s ease-in-out infinite alternate}@keyframes tnW{from{transform:skewY(-8deg) scaleX(.9)}to{transform:skewY(8deg) scaleX(1.1)}}'
  +'.tnL1,.tnL2,.tnA1,.tnA2{transform-box:fill-box;transform-origin:50% 0%}.tnL1{animation:tnL .5s ease-in-out infinite alternate}.tnL2{animation:tnL .5s ease-in-out infinite alternate-reverse}.tnA1{animation:tnL .5s ease-in-out infinite alternate-reverse}.tnA2{animation:tnL .5s ease-in-out infinite alternate}@keyframes tnL{from{transform:rotate(-38deg)}to{transform:rotate(38deg)}}'
  +'.tnBn{animation:tnBn .6s ease-in-out infinite alternate}@keyframes tnBn{from{transform:translateY(0)}to{transform:translateY(-4px)}}.tnBb{animation:tnBn 1.8s ease-in-out infinite alternate}'
  +'.tnTw{animation:tnTw 1.6s ease-in-out infinite alternate}@keyframes tnTw{from{opacity:.25}to{opacity:1}}.tnPl{animation:tnPl 9s linear infinite}@keyframes tnPl{from{transform:translate(-20px,30px)}to{transform:translate(190px,6px)}}'
  +'.tnR{transform-box:fill-box;transform-origin:50% 50%;animation:tnR 24s linear infinite}@keyframes tnR{to{transform:rotate(360deg)}}.tnCl{animation:tnS 40s linear infinite}.tnSp{animation:tnSp .35s linear infinite}@keyframes tnSp{from{transform:translateX(0)}to{transform:translateX(-14px)}}</style>';
  var city=function(c1,c2){var s='',x=0,hs=[22,34,18,40,26,30,16,36,24,28,20,38];for(var i=0;i<12;i++){var w=13,h=hs[i];s+='<rect x="'+x+'" y="'+(70-h)+'" width="'+w+'" height="'+(h+20)+'" fill="'+(i%2?c1:c2)+'"/>';x+=w+.3}return s};
  var kid=function(x,y,legs){return '<g transform="translate('+x+','+y+')"><g class="tnL1"><rect x="-3" y="0" width="2.4" height="8" rx="1" fill="#2a2a5a"/></g><g class="tnL2"><rect x=".6" y="0" width="2.4" height="8" rx="1" fill="#2a2a5a"/></g><rect x="-4.5" y="-10" width="9" height="11" rx="3" fill="#e84a5f"/><g class="tnA1"><rect x="-6" y="-9" width="2.2" height="7" rx="1" fill="#e84a5f"/></g><g class="tnA2"><rect x="3.8" y="-9" width="2.2" height="7" rx="1" fill="#e84a5f"/></g><circle cx="0" cy="-15" r="5.5" fill="#ffd9b0"/><path d="M-6 -16 L-4 -24 L-1 -18 L1 -25 L3 -18 L6 -23 L6 -14 Q0 -19 -6 -14Z" fill="#1a1a3a"/><circle cx="2" cy="-14.5" r=".9" fill="#222"/><circle cx="-1.8" cy="-14.5" r=".9" fill="#222"/><g class="tnW"><path d="M-4 -9 L-14 -7 L-12 -3 L-4 -6Z" fill="#ffd24a"/></g></g>'};
  var spirit=function(x,y,c){return '<g transform="translate('+x+','+y+')"><g class="tnBn"><ellipse cx="0" cy="0" rx="5" ry="4.2" fill="'+c+'"/><path d="M-4 -3 L-5 -8 L-1.5 -4Z M4 -3 L5 -8 L1.5 -4Z" fill="'+c+'"/><circle cx="-1.8" cy="-.6" r=".9" fill="#222"/><circle cx="1.8" cy="-.6" r=".9" fill="#222"/><path d="M-1 1.2 Q0 2.2 1 1.2" stroke="#222" stroke-width=".5" fill="none"/></g></g>'};
  var A='<g class="tnA"><rect width="160" height="90" fill="url(#tnSA'+uid+')"/><circle cx="112" cy="52" r="20" fill="#ffe08a"/><circle cx="112" cy="52" r="26" fill="#ffd27a" opacity=".25"/><g class="tnS3">'+city("#7a3a6a","#5a2a58")+'<g transform="translate(160,0)">'+city("#7a3a6a","#5a2a58")+'</g></g><g class="tnS1" opacity=".95">'+city("#3a1f4a","#2a1640").replace(/y="(\d+)"/g,function(m,n){return 'y="'+(+n+8)+'"'})+'<g transform="translate(160,0)">'+city("#3a1f4a","#2a1640").replace(/y="(\d+)"/g,function(m,n){return 'y="'+(+n+8)+'"'})+'</g></g><rect y="76" width="160" height="14" fill="#1a1030"/><path d="M0 76 H160" stroke="#3a2a5a" stroke-width="1"/>'+kid(48,74)+spirit(62,73,"#ffb8d0")+'<g class="tnPl"><path d="M0 0 L9 3 L2 4 L0 7Z" fill="#fff"/></g>'+[[20],[60],[100],[140],[40],[120]].map(function(r,i){return '<g transform="translate('+(r[0]+30)+',0)">'+P(i+1,[0])+'</g>'}).join("")+'</g>';
  var B='<g class="tnB"><rect width="160" height="90" fill="url(#tnSB'+uid+')"/>'+[[12,10],[40,22],[66,8],[90,26],[120,14],[148,30],[28,40],[104,6],[140,44],[58,34]].map(function(s,i){return '<circle class="tnTw" style="animation-delay:-'+(i*.4)+'s" cx="'+s[0]+'" cy="'+s[1]+'" r=".9" fill="#fff"/>'}).join("")+'<circle cx="126" cy="20" r="9" fill="#f4f0ff"/><circle cx="130" cy="18" r="9" fill="#14123a"/><g class="tnS2">'+city("#2a2a8a","#3a1a7a")+'<g transform="translate(160,0)">'+city("#2a2a8a","#3a1a7a")+'</g></g><g class="tnS2" opacity=".9">'+[0,1,2,3,4,5,6,7].map(function(i){return '<rect x="'+(i*22+4)+'" y="'+(40+(i%3)*8)+'" width="2" height="18" fill="'+["#4dd2ff","#ff3df0","#9cff8a"][i%3]+'"/>'}).join("")+'<g transform="translate(160,0)">'+[0,1,2,3,4,5,6,7].map(function(i){return '<rect x="'+(i*22+4)+'" y="'+(40+(i%3)*8)+'" width="2" height="18" fill="'+["#4dd2ff","#ff3df0","#9cff8a"][i%3]+'"/>'}).join("")+'</g></g><rect y="76" width="160" height="14" fill="#10102a"/><g class="tnSp">'+[0,1,2,3,4,5,6,7,8,9,10,11].map(function(i){return '<rect x="'+(i*14)+'" y="83" width="7" height="1.4" fill="#ffd24a"/>'}).join("")+'</g>'+kid(54,74)+spirit(30,66,"#9ae0ff")+[[70,50],[84,58],[96,46]].map(function(l){return '<rect class="tnSp" x="'+l[0]+'" y="'+l[1]+'" width="14" height=".8" fill="#fff" opacity=".6"/>'}).join("")+'</g>';
  var C2='<g class="tnC"><rect width="160" height="90" fill="url(#tnSC'+uid+')"/><g class="tnR" opacity=".35" style="transform-origin:120px 30px"><circle cx="120" cy="30" r="40" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 9"/></g><circle cx="120" cy="30" r="12" fill="#fff6c8"/><g class="tnCl"><g>'+[[10,60,18],[60,70,22],[110,58,16]].map(function(c){return '<ellipse cx="'+c[0]+'" cy="'+c[1]+'" rx="'+c[2]+'" ry="5" fill="#fff" opacity=".85"/>'}).join("")+'</g><g transform="translate(160,0)">'+[[10,60,18],[60,70,22],[110,58,16]].map(function(c){return '<ellipse cx="'+c[0]+'" cy="'+c[1]+'" rx="'+c[2]+'" ry="5" fill="#fff" opacity=".85"/>'}).join("")+'</g></g><path d="M0 90 L30 62 L52 80 L84 54 L112 78 L140 60 L160 76 V90Z" fill="#6a8ac8" opacity=".8"/><g class="tnBb"><g transform="translate(60,42) rotate(-12)"><g class="tnW"><path d="M-4 0 L-26 -6 L-24 6Z" fill="#e84a5f"/></g><rect x="-5" y="-4" width="11" height="8" rx="3" fill="#e84a5f"/><circle cx="9" cy="-2" r="5" fill="#ffd9b0"/><path d="M5 -4 L8 -11 L10 -5 L13 -10 L14 -3Z" fill="#1a1a3a"/><circle cx="11" cy="-2" r=".9" fill="#222"/><rect x="-2" y="3" width="2.4" height="7" rx="1" fill="#2a2a5a"/><rect x="2" y="3" width="2.4" height="7" rx="1" fill="#2a2a5a"/></g></g>'+spirit(92,44,"#ffd0e8")+spirit(34,52,"#c0ffd8")+'</g>';
  return css+'<defs><linearGradient id="tnSA'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a7a"/><stop offset=".45" stop-color="#d04a7a"/><stop offset="1" stop-color="#ffb060"/></linearGradient><linearGradient id="tnSB'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06061c"/><stop offset="1" stop-color="#3a1a6a"/></linearGradient><linearGradient id="tnSC'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ab0ff"/><stop offset="1" stop-color="#ffe3b8"/></linearGradient><clipPath id="tnK'+uid+'"><rect width="160" height="90"/></clipPath></defs><g transform="scale('+(W/160).toFixed(4)+','+(Hh/90).toFixed(4)+')"><g clip-path="url(#tnK'+uid+')">'+A+B+C2+'</g></g>';
}

function lfGoDoor(C,sideX,y,z,w,act,label,col,hit){ /* left-wall double door (plane x=const) */
  var U=LF.U,W=U*w,h=96;
  var c='<g data-act="'+act+'" data-i="0" style="cursor:pointer"><rect x="-5" y="-5" width="'+(W+10)+'" height="'+(h+10)+'" fill="#caa24a" stroke="'+LFOL+'" stroke-width=".8"/>'
   +'<rect width="'+(W/2-.6)+'" height="'+h+'" fill="#5a1424" stroke="'+LFOL+'" stroke-width=".7"/><rect x="'+(W/2+.6)+'" width="'+(W/2-.6)+'" height="'+h+'" fill="#5a1424" stroke="'+LFOL+'" stroke-width=".7"/>'
   +'<rect x="4" y="8" width="'+(W/2-9)+'" height="'+(h-16)+'" fill="none" stroke="#e8c56a" stroke-width=".8" opacity=".7"/><rect x="'+(W/2+5)+'" y="8" width="'+(W/2-9)+'" height="'+(h-16)+'" fill="none" stroke="#e8c56a" stroke-width=".8" opacity=".7"/>'
   +'<circle cx="'+(W/2-5)+'" cy="'+(h*.55)+'" r="2.2" fill="#ffd27a"/><circle cx="'+(W/2+5)+'" cy="'+(h*.55)+'" r="2.2" fill="#ffd27a"/>'
   +'<rect x="-7" y="-26" width="'+(W+14)+'" height="16" rx="2" fill="#12080e" stroke="'+col+'" stroke-width="1.2"/><text x="'+(W/2)+'" y="-14.5" text-anchor="middle" font-size="8.5" font-weight="800" font-family="Arial" fill="'+col+'">'+label+'</text></g>';
  return c;
}
LFROOM.theater=function(C){
  var H=function(k){return C.has(k)},U=LF.U;
  var lx1=H("t_lux1"),lx2=H("t_lux2"),lx3=H("t_lux3"),lx4=H("t_lux4");
  /* floor: carpet runner, marble when premium */
  if(lx1)C.decals.push(lfFloorG(.3,.3,'<rect width="'+U*11.4+'" height="'+U*8.4+'" fill="#e6e0d2" stroke="rgba(0,0,0,.18)"/><path d="'+[1,2,3,4,5,6,7,8,9,10,11].map(function(k){return 'M'+U*k+' 0V'+U*8.4}).join("")+[1,2,3,4,5,6,7].map(function(k){return 'M0 '+U*k+'H'+U*11.4}).join("")+'" stroke="rgba(0,0,0,.07)"/>'));
  C.decals.push(lfFloorG(1.0,1.6,lfRr(0,0,U*10,U*6.2,4,lx1?"#5a1a3a":"#5a1424","rgba(0,0,0,.3)")+'<rect x="5" y="5" width="'+(U*10-10)+'" height="'+(U*6.2-10)+'" fill="none" stroke="'+(lx1?"#e8c56a":"rgba(255,210,122,.5)")+'" stroke-width="1.4"/>'));
  /* auditorium door (left wall) */
  C.walls.push(lfFaceX(0,5.0,104,lfGoDoor(C,0,5.0,104,1.9,"gotoaud","AUDITORIUM",hasRoom("auditorium")?"#ffd27a":"#8a7a90")));
  C.decals.push(lfFloorG(.4,3.0,lfRr(0,0,U*1.2,U*2.2,3,"#3a0e1a","rgba(0,0,0,.25)")));
  lfW1(C,"w_thposter",.05,1.9,64,-70,0);if(H("t_marquee"))lfW1(C,"w_thmarq",.05,8.3,26,-112,0);
  lfW1(C,"w_threel",.05,7.0,40,-92,0);
  lfW1(C,"w_thclock",4.9,.05,36,-112,1);
  lfDoorAt(C,6.9);
  lfSpr(C,lx4?"loL_sign":"lo_booth",.6,.2,2.0,1.6,{h:34,flip:1,ctr:1,H:96});
  lfSpr(C,lx4?"loL_ctr":"lo_ctr",3.0,.2,3.0,1.6,{h:30,flip:1,ctr:1,H:lx4?72:80});
  lfPrep(C,"counter",4.6,2.4);C.s("work",4.7,1.2,1,"look",[6,12],{tag:"counter"});C.s("look",2.0,5.2,1,"look",[5,10],{tag:"usher"});
  if(H("t_pop")){lfSpr(C,lx2?"loL_pop":"lo_pop",8.2,.3,1.0,1.0,{h:30,flip:1,ctr:1,H:96});C.front.push(lfSteam(8.6,.8,60,2))}
  if(H("t_soda"))lfSpr(C,"lo_soda",9.8,.3,1.3,1.3,{h:30,flip:1,ctr:1,H:84});
  if(H("t_candy"))lfSpr(C,lx2?"loL_candy":"lo_candy",5.6,4.6,1.8,1.4,{h:28,ctr:1,H:72});
  if(H("t_hotdog")){lfSpr(C,lx2?"loL_dog":"lo_dog",8.0,4.2,1.5,1.3,{h:28,ctr:1,H:76});lfSpr(C,lx2?"loL_nacho":"lo_nacho",9.8,4.4,1.3,1.3,{h:28,ctr:1,H:76})}
  if(H("t_bar")){lfSpr(C,lx3?"loL_taps":"br_bar",6.2,7.0,2.6,1.2,{h:24,flip:1,ctr:1,H:62});var stl=lx3?"brL_stool":"br_stool";lfSpr(C,stl,7.0,8.3,.8,.8,{h:20,ctr:1,H:44});lfSpr(C,stl,8.4,8.3,.8,.8,{h:20,ctr:1,H:44})}
  lfSpr(C,lx4?"loL_stand":"lo_stand",10.8,6.0,1.0,.6,{h:36,ctr:1,H:104});
  lfSpr(C,lx4?"loL_bins":"lo_bins",11.0,8.0,1.0,1.0,{h:26,ctr:1,H:60});
  lfSpr(C,lx1?"thL_sofa":"th_sofa",.15,5.8,1.2,2.6,{h:30,H:58});
  [6.5,7.4,8.3].forEach(function(y,k){lfCust(C,.75,y,1,{sit:1,uact:"eat",lbl:"A",grp:"s",num:k+1,wx:1.9,wy:y,udur:[30,55]})});
  lfWander(C,[[4.2,4.4,-1],[7.2,3.0,1],[9.6,6.0,-1],[3.2,3.4,1],[2.2,5.0,1]]);
  lfOrderBoard(C,6.0,128,"SNACKS");
  if(lx2||lx4)lfLight(C,5.6,3.4,70,"#ffcf8a",3,.3);
};
SVC.auditorium={lbl:"A",unit:"Seat",boardName:"Snack orders",verbs:["Waiting","At the cart","Watching"],short:["wait","prep","watch"],quiet:"Enjoy the show",menu:["Popcorn","Soda"],use:"eat",udur:[40,70],pat:90,
  guests:function(r,C,n){return 5+addonsOf(r).length},
  head:function(C){var F=lfFilm(C.key);return F.on?"▶ "+F.name+" · "+F.left+"m":"Intermission"},
  steps:function(s,X){var P=X.P("counter"),A=X.A(s);return [{x:P.x,y:P.y,act:"work",tag:"pop",dur:[1.6,2.4],fx:-1},{x:A.x,y:A.y,act:"reach",tag:"place",dur:[1,1.4],carry:1}]}};
LFROOM.auditorium=function(C){
  var H=function(k){return C.has(k)};
  var rec=H("au_recline"),vel=H("au_lux1"),gld=H("au_lux2"),spkL=H("au_lux3"),prjL=H("au_lux4"),big=H("au_imax"),car=H("au_carpet");
  var TX=[2.6,3.9,5.2,6.5],TZ=[7,14,21,28],DX=7.8,DZ=28,U=LF.U,HH=LF.H,WD=12;
  var carpT=car?"#8a2444":"#5e1a2e",carpS=car?"#4a1426":"#2e0f1c";
  C.walls.push('<defs><filter id="lfdk" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".62 0 0 0 0 0 .62 0 0 0 0 0 .78 0 .01 0 0 0 1 0"/></filter></defs>');
  if(H("au_wall2"))thWalls(C,"#35121f","#2c0f1a",gld?"#e8c56a":"rgba(0,0,0,.3)");else if(H("au_wall1"))thWalls(C,"#2b2733","#25212c","rgba(255,255,255,.08)");
  var dk=function(pts){return '<polygon points="'+pts.map(function(p){return p.join(",")}).join(" ")+'" fill="rgba(4,4,24,.55)"/>'};
  C.walls.push(dk([lfP(0,0,0),lfP(0,10,0),lfP(0,10,HH),lfP(0,0,HH)]));
  C.walls.push(dk([lfP(0,0,0),lfP(WD,0,0),lfP(WD,0,HH),lfP(0,0,HH)]));
  C.decals.push(lfFloorG(.2,.2,'<rect width="'+U*(TX[0]-.2)+'" height="'+U*9.6+'" fill="#2a0e1a"/>'));
  TX.forEach(function(x,i){lfTbox(C,x,1.45,1.3,8.55,0,TZ[i],carpS,carpT)});
  lfTbox(C,DX,0,WD-DX,10,0,DZ,gld?"#d8d2c6":"#4a3a48",gld?"#efe9dc":"#6a5668");
  if(gld)for(var q=0;q<4;q++)lfTbox(C,DX+.4+q*1.0,.2,.05,9.6,DZ,.6,"#caa24a","#e8c56a");
  for(var j=0;j<8;j++){var sz=3.5*(j+1);lfTbox(C,2.6+.65*j,.15,.65,1.3,0,sz,"#3a1a28",carpT);lfTbox(C,2.6+.65*j,1.4,.65,.05,sz-1.2,1.2,"#ffd27a","#ffe9b0")}
  lfTbox(C,2.6,1.38,5.2,.07,0,9,"#1a0a12","#4a2a3a");
  if(H("au_aisle"))TX.forEach(function(x,i){lfTbox(C,x,1.45,1.3,.06,TZ[i],.8,"#ffd27a","#ffe9b0");lfTbox(C,x,9.94,1.3,.06,TZ[i],.8,"#ffd27a","#ffe9b0")});
  var scr2=H("au_scr2"),sw=big?9.5:scr2?7.8:6.0,sh=big?136:scr2?104:80,y0=big?9.8:scr2?9.2:8.2,sz0=big?10:14;
  var scr='<rect x="-6" y="-6" width="'+(U*sw+12)+'" height="'+(sh+12)+'" fill="#0a0a0e" stroke="'+LFOL+'"/><rect width="'+U*sw+'" height="'+sh+'" fill="#10102a"/>'+lfToon(C.uid,U*sw,sh)+'<text class="lfscrt" data-k="'+C.key+'" x="'+(U*sw-8)+'" y="'+(sh-6)+'" text-anchor="end" font-size="8" font-family="Arial" font-weight="800" fill="rgba(255,255,255,.75)"></text>';
  C.walls.push(lfFaceX(0,y0,sz0+sh,scr));
  C.walls.push(lfFaceX(0,y0+.1,sz0+4,'<rect width="'+(U*sw)+'" height="7" fill="#3a0a14"/>'));
  C.decals.push('<ellipse class="lfglow" cx="'+lfP(2.2,5.2,0)[0]+'" cy="'+lfP(2.2,5.2,0)[1]+'" rx="'+(U*3.4)+'" ry="'+(U*1.3)+'" fill="rgba(180,150,255,.22)"/>');
  var key=vel?"ts_v2":(rec?"ts_b2":"ts_r2"),nrow=H("au_rows")?4:3;
  for(var r=0;r<nrow;r++){var x=TX[r];[1.6,4.3,7.0].forEach(function(y0s,pi){
    lfSpr(C,key,x,y0s,1.2,2.7,{h:26,H:66,dy:-TZ[r],fl:"lfdk",flip:1});
    for(var s=0;s<3;s++)lfCust(C,x+.35,y0s+.45+s*.9,-1,{sit:1,uact:"eat",lbl:String.fromCharCode(65+r),grp:"r"+r,num:pi*3+s+1,wx:x+1.4,wy:y0s+.45+s*.9,udur:[40,70]})});
    C.plat.push({x0:x,y0:1.45,x1:x+1.3,y1:10,z:TZ[r],key:x+1.3+10+.01})}
  C.plat.push({x0:DX,y0:0,x1:WD,y1:10,z:DZ,key:WD+10+.01});
  for(var j2=0;j2<8;j2++)C.plat.push({x0:2.6+.65*j2,y0:.15,x1:2.6+.65*(j2+1),y1:1.45,z:3.5*(j2+1),key:2.6+.65*(j2+1)+1.45+.01});
  /* door back to the lobby */
  var dc='<g data-act="gotolobby" data-i="0" style="cursor:pointer"><rect x="-4" y="-4" width="'+(U*1.05+8)+'" height="94" fill="#caa24a" stroke="'+LFOL+'" stroke-width=".8"/><rect width="'+U*1.05+'" height="90" fill="#3a1220" stroke="'+LFOL+'" stroke-width=".8"/><rect x="5" y="6" width="'+(U*1.05-10)+'" height="26" fill="#9fd6f5" opacity=".75" stroke="'+LFOL+'" stroke-width=".7"/><rect x="-7" y="-24" width="'+(U*1.05+14)+'" height="15" rx="2" fill="#0c3a1e" stroke="#7dff9a" stroke-width="1"/><text x="'+(U*1.05/2)+'" y="-13" text-anchor="middle" font-size="7.5" font-weight="800" font-family="Arial" fill="#9dffb4">LOBBY</text></g>';
  C.walls.push(lfFaceY(9.6,0,92+DZ,dc));C.s("door",10.0,.75,1,"look",[1,1]);C.door={x:10.0,y:.75};
  if(gld){lfW1(C,"w_thsconce",2.4,.05,44,-92,1);lfW1(C,"w_thsconce",6.2,.05,44,-92,1)}
  lfW1(C,"w_thposter",8.0,.05,64,-90,1);
  /* landing kit */
  lfPrep(C,"counter",9.2,2.4);C.s("work",9.4,1.3,1,"look",[6,12],{tag:"counter"});C.s("look",8.4,3.4,-1,"look",[5,10],{tag:"usher"});
  lfSpr(C,gld?"thL_cart":"th_drk",11.0,2.4,1.1,1.1,{h:30,ctr:1,H:62,dy:-DZ});
  lfSpr(C,spkL?"thL_spk":"th_spk",.15,.25,spkL?1.0:.9,spkL?1.8:.9,{h:30,H:120,dy:0});if(!spkL)lfSpr(C,"th_spk2",.15,9.0,.9,.9,{h:30,H:120});
  if(H("au_sound")&&!spkL){lfSpr(C,"th_spk",11.0,.3,.9,.9,{h:30,flip:1,H:100,dy:-DZ})}
  lfSpr(C,prjL?"thL_proj":H("au_proj2")?"thx_proj2":H("au_proj1")?"thx_proj1":"th_proj",11.0,7.0,1.0,1.0,{h:30,ctr:1,H:prjL?104:84,dy:-DZ});
  /* projection slit in the back wall */
  C.walls.push(lfFaceY(10.4,0,DZ+132,'<rect width="'+U*.9+'" height="12" fill="#06060e" stroke="'+LFOL+'"/><rect x="2" y="3" width="'+(U*.9-4)+'" height="6" fill="rgba(210,225,255,.85)"/>'));
  var pj=lfP(10.8,0,DZ+126),s1=lfP(0,y0-sw,sz0+sh/2),s2=lfP(0,y0,sz0+sh/2);
  C.front.push('<polygon class="lfbeam" points="'+pj[0]+','+pj[1]+' '+s1[0]+','+(s1[1]-sh/2)+' '+s2[0]+','+(s2[1]+sh/2)+'" fill="rgba(200,220,255,.06)"/>');
  lfWander(C,[[9.0,4.6,-1],[10.4,5.8,1],[8.6,8.0,-1],[9.6,3.2,1]]);
  lfLight(C,.3,5,60,"#9a8aff",4,.4);
};

/* sprite keys: sk_pond sk_fire sk_bed sk_scope sk_dj sk_cart sk_cab sk_sofa sk_tree skL_pond skL_fire skL_bed skL_scope skL_dj skL_cart skL_cab skL_sofa skL_tree */
/* ===== sky lounge (sprite, 14x11, uncrowded) ===== */
LFROOM.sky=function(C){
  C.out=1;
  var H=function(k){return C.has(k)};
  var L1=H("k_lux1"),L2=H("k_lux2"),L3=H("k_lux3"),L4=H("k_lux4");
  var sp=function(k,l,x,y,w,d,o){lfSpr(C,(l?"skL_":"sk_")+k,x,y,w,d,o)};
  /* basic deck: sofa set facing the fire spot, bar cart, planters */
  sp("sofa",L2,4.6,5.2,1.3,2.8,{h:22,H:72,ctr:1});
  lfCust(C,5.4,6.0,1,{sit:1,tag:"chair",uact:"eat",lbl:"C",grp:"c",num:1});lfCust(C,5.4,7.3,1,{sit:1,tag:"chair",uact:"eat",lbl:"C",grp:"c",num:2});
  sp("cart",L3,3.0,.3,1.4,1.0,{h:26,H:76,flip:1,ctr:1});lfPrep(C,"skybar",3.7,1.8);C.s("work",3.7,1.9,-1,"work",[8,14],{tag:"pour"});
  sp("tree",L4,.5,6.3,1.0,1.0,{h:30,H:100,ctr:1});sp("tree",L4,12.8,9.4,1.0,1.0,{h:30,H:100,ctr:1});
  if(H("k_bar"))sp("cart",L3,12.9,4.6,1.4,1.0,{h:26,H:76,flip:1,ctr:1});
  if(H("k_fire")){sp("fire",L3,7.6,5.9,2.2,1.8,{h:20,H:84,ctr:1});lfLight(C,8.7,6.8,16,"#ff9d3a",3.4,.9)}
  if(H("k_pond")){sp("pond",L1,9.0,.6,3.8,3.0,{h:14,H:128,ctr:1});lfBlock(9.0,.6,12.8,3.6);
    if(L1){lfLight(C,10.9,2.1,20,"#ffd27a",3,.5)}
    lfWander(C,[[8.4,4.6,1],[11.6,4.6,-1],[10.0,5.0,1]])}
  if(H("k_cabana")){sp("cab",L2,.3,8.4,2.2,1.8,{h:30,H:115,ctr:1});lfCust(C,1.2,9.2,1,{sit:1,uact:"lie",lbl:"V",grp:"v",num:1})}
  if(H("k_day"))[1.0,3.3].forEach(function(y,j){sp("bed",L2,.3,y,2.0,1.6,{h:24,H:100,ctr:1});lfCust(C,1.2,y+.8,1,{lie:1,uact:"lie",lz:14,lbl:"D",grp:"d",num:j+1,wx:2.6,wy:y+.8})});
  if(H("k_scope")){sp("scope",L4,11.6,6.8,.8,.8,{h:30,H:70,ctr:1});lfCust(C,12.5,7.2,-1,{wact:"look",uact:"look",lbl:"T",grp:"tl",num:1,menu:["Stargaze","Sake"]})}
  if(H("k_dj")){sp("dj",L3,5.6,.3,2.2,1.4,{h:26,H:84,flip:1,ctr:1});C.s("work",6.7,1.9,-1,"work",[10,20],{tag:"dj"})}
  if(H("k_bottle"))lfLight(C,3.7,.9,40,"#ffe6a0",1.6,.7);
  lfWander(C,[[4.0,3.6,1],[7.0,4.0,-1],[9.0,9.0,1],[3.4,9.6,-1]]);
  lfStandBoard(C,1.6,"ROOFTOP");
  if(H("k_lights")||L1){[[3.2,134,"#fff3b0"],[7.0,126,"#ffd7a0"],[10.8,120,"#fff3b0"]].forEach(function(s,si){
    var a=lfP(s[0],0,s[1]),b=lfP(0,s[0],s[1]);var mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2+22;
    var g='<path d="M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+b[0].toFixed(1)+' '+b[1].toFixed(1)+'" fill="none" stroke="#2a2430" stroke-width="1.2"/>';
    for(var k=1;k<10;k++){var t=k/10,px=(1-t)*(1-t)*a[0]+2*t*(1-t)*mx+t*t*b[0],py=(1-t)*(1-t)*a[1]+2*t*(1-t)*my+t*t*b[1];
      g+='<circle class="lftwk" style="animation-delay:'+((k+si*3)*.31%2).toFixed(2)+'s" cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="2.6" fill="'+s[2]+'"/><circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="8" fill="rgba(255,230,160,.14)"/>'}
    C.front.push(g)})}
};

/* floors: stone pavers for the sky deck, spa and club; carpet-dark tile for game room & studio */
LFTH.sky.fl="stone";LFTH.spa.fl="s";LFTH.club.fl="s";LFTH.gameroom.fl="k";LFTH.studio.fl="k";
LFDEFFL.s="slate";LFDEFFL.k="grey";LFDEFFL.stone="slate";
/* sky lounge skyline seen past the glass railing, driven by time of day / weather */
function lfSkyView(N,M,L,uid){
  var sk=lfSkyCols(L),haze=lfMix(sk[1],"#ffffff",.12),warm=L.golden*(1-L.dark),s="";
  var far=lfMix(lfMix("#6f86ad",haze,.45),"#10152e",L.dark*.85);far=lfMix(far,"#c98a6a",warm*.5);
  var mid=lfMix(lfMix("#4d6288",haze,.25),"#0b0f26",L.dark*.88);mid=lfMix(mid,"#a8644c",warm*.45);
  var near=lfMix("#2d3552","#070a1c",L.dark*.9);near=lfMix(near,"#6a4048",warm*.4);
  if(L.wx==="rain"||L.wx==="fog"){far=lfMix(far,sk[1],.5);mid=lfMix(mid,sk[1],.35)}
  var win=L.dark>.2?Math.min(1,(L.dark-.2)*1.6):0;
  var layers=[[far,-12,.55,70],[mid,-8,.78,45],[near,-4.5,1,25]];
  layers.forEach(function(ly,li){
    var R=lfSeed(uid*7+li*31),col=ly[0],gap=ly[1],top=ly[3];
    /* buildings behind the right railing (plane y=0) */
    for(var x=-4;x<N+7;){var w=.8+R()*1.0,h=-120+R()*top;
      s+=lfBox(x,gap,-260,w,1.1,h+260,col,{top:lfSh(col,.18),r:lfSh(col,-.2)});
      if(win>0)for(var wz=-40;wz<h-6;wz+=9)for(var wx=.25;wx<w-.2;wx+=.5){if(R()<.45)s+=lfPoly([lfP(x+wx,gap+1.1,wz),lfP(x+wx+.26,gap+1.1,wz),lfP(x+wx+.26,gap+1.1,wz+4),lfP(x+wx,gap+1.1,wz+4)],"rgba(255,217,138,"+(win*.8).toFixed(2)+")")}
      x+=w+.2+R()*.5}
    /* buildings behind the left railing (plane x=0) */
    for(var y=-3;y<M+6;){var d=.8+R()*1.0,h2=-120+R()*top;
      s+=lfBox(gap,y,-260,1.1,d,h2+260,col,{top:lfSh(col,.18),r:lfSh(col,-.2)});
      if(win>0)for(var wz2=-40;wz2<h2-6;wz2+=9)for(var wy=.25;wy<d-.2;wy+=.5){if(R()<.45)s+=lfPoly([lfP(gap+1.1,y+wy,wz2),lfP(gap+1.1,y+wy+.26,wz2),lfP(gap+1.1,y+wy+.26,wz2+4),lfP(gap+1.1,y+wy,wz2+4)],"rgba(255,217,138,"+(win*.8).toFixed(2)+")")}
      y+=d+.2+R()*.5}
  });
  return s}

/* ===== Bedroom annex: the walk-in closet that bulges out of the left wall, and the lair behind it ===== */
var LFAU=29.07;
function lfAnnexDim(a){return a.lair?{A:3.6,y0:4.9,y1:8.7,Ha:118}:{A:3.4,y0:4.9,y1:8.3,Ha:114}}
function lfAnnexDoor(){return {y0:5.2,y1:8.0,zd:104}}
/* clip that cuts the doorway out of the room's walls */
function lfAnnexHole(uid){var D=lfAnnexDoor(),q=[lfP(0,D.y0,0),lfP(0,D.y1,0),lfP(0,D.y1,D.zd),lfP(0,D.y0,D.zd)],id="lfah"+uid;
  return {id:id,defs:'<clipPath id="'+id+'"><path clip-rule="evenodd" d="M-1400 -1400H1400V1400H-1400Z M'+q.map(lfPt).join(" L")+'Z"/></clipPath>'}}
/* door frame trim, drawn on the left wall over the cut edge */
function lfAnnexFrame(C){var D=lfAnnexDoor(),t=.16,c=C.annex.lair?"#3a2f66":"#f3ead8",e=C.annex.lair?"#a58bff":"rgba(24,30,58,.5)",s="";
  s+=lfPoly([lfP(0,D.y1-t,0),lfP(0,D.y1,0),lfP(0,D.y1,D.zd+8),lfP(0,D.y1-t,D.zd+8)],c,e,.7);
  s+=lfPoly([lfP(0,D.y0,0),lfP(0,D.y0+t,0),lfP(0,D.y0+t,D.zd+8),lfP(0,D.y0,D.zd+8)],c,e,.7);
  s+=lfPoly([lfP(0,D.y0,D.zd),lfP(0,D.y1,D.zd),lfP(0,D.y1,D.zd+9),lfP(0,D.y0,D.zd+9)],c,e,.7);
  if(C.annex.lair)s+=lfPoly([lfP(0,D.y0+t,D.zd-2),lfP(0,D.y1-t,D.zd-2),lfP(0,D.y1-t,D.zd),lfP(0,D.y0+t,D.zd)],"#9d7cff","none",0,' class="lfneonp"');
  return s}
function lfAGar(u,v,w,h,c){var sh="rgba(10,10,30,.22)";return '<path d="M'+(u+w/2)+' '+(v-5)+' l-2 3 h4z" fill="#9aa3b4"/><path d="M'+u+' '+(v)+' h'+w+' l1.6 '+(h*.28)+' v'+(h*.72)+' h-'+(w+3.2)+' v-'+(h*.72)+' z" fill="'+c+'"/><rect x="'+(u+w*.55)+'" y="'+v+'" width="'+(w*.45+1.6)+'" height="'+h+'" fill="'+sh+'"/><rect x="'+(u+1)+'" y="'+(v+1)+'" width="1.6" height="'+(h-2)+'" fill="rgba(255,255,255,.18)"/>'}
function lfAShoe(u,v,c){return '<path d="M'+u+' '+v+' q0 -6 5 -6 h5 q5 0 9 4 l3 2 v2 z" fill="'+c+'"/><rect x="'+u+'" y="'+v+'" width="20" height="2" fill="rgba(10,10,30,.55)"/><path d="M'+(u+3)+' '+(v-5)+' h6" stroke="rgba(255,255,255,.35)" stroke-width="1"/>'}
function lfAnnexPre(C,uid){
  if(!C.annex.lair&&window.lfAnnexPre4&&typeof LFSP4!=="undefined"&&LFSP4.cl_in)return lfAnnexPre4(C,uid);
  var a=C.annex,lair=!!a.lair,d=lfAnnexDim(a),A=d.A,y0=d.y0,y1=d.y1,Ha=d.Ha,th=.42,s="",P=lfP;
  var wc=lair?"#2a2347":"#e0d3bf",wd=lair?"#1b1632":"#c9b9a2",ac=lair?"#a58bff":"#ffd9a0";
  s+='<linearGradient id="lfaw'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+lfSh(wc,.1)+'"/><stop offset="1" stop-color="'+lfSh(wc,-.14)+'"/></linearGradient>'
    +'<linearGradient id="lfas'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+lfSh(wd,.08)+'"/><stop offset="1" stop-color="'+lfSh(wd,-.18)+'"/></linearGradient>'
    +'<linearGradient id="lfag'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+ac+'" stop-opacity=".55"/><stop offset="1" stop-color="'+ac+'" stop-opacity="0"/></linearGradient>';
  /* floor */
  var fp=[P(-A,y0,0),P(0,y0,0),P(0,y1,0),P(-A,y1,0)],fid="lfaf"+uid,pat=lfPat(fid,lair?"f_slate":"f_marble",4,2.667,"matrix(26,13,-26,13,0,0)");
  s+=pat+lfPoly(fp,pat?'url(#'+fid+')':(lair?"#2a2640":"#e8dfd0"),LFOL,1);
  if(lair)s+=lfPoly(fp,"rgba(22,16,56,.5)","none");
  else s+=lfPoly(fp,"rgba(255,226,170,.12)","none");
  /* walls */
  var bk=[P(-A,y0,0),P(-A,y1,0),P(-A,y1,Ha),P(-A,y0,Ha)],sd=[P(-A,y0,0),P(0,y0,0),P(0,y0,Ha),P(-A,y0,Ha)];
  s+=lfPoly(bk,'url(#lfaw'+uid+')',LFOL,1)+lfPoly(sd,'url(#lfas'+uid+')',LFOL,1);
  /* wainscot + base + crown */
  s+=lfPoly([P(-A,y0,0),P(-A,y1,0),P(-A,y1,5),P(-A,y0,5)],lair?"#17122a":"#f3ead8",LFOL,.6)+lfPoly([P(-A,y0,0),P(0,y0,0),P(0,y0,5),P(-A,y0,5)],lair?"#120e22":"#d9cfb9",LFOL,.6);
  s+=lfPoly([P(-A,y0,Ha-6),P(-A,y1,Ha-6),P(-A,y1,Ha),P(-A,y0,Ha)],lfSh(wc,.35),LFOL,.6)+lfPoly([P(-A,y0,Ha-6),P(0,y0,Ha-6),P(0,y0,Ha),P(-A,y0,Ha)],lfSh(wd,.25),LFOL,.6);
  /* light strip under the crown + glow */
  s+=lfPoly([P(-A,y0,Ha-9),P(-A,y1,Ha-9),P(-A,y1,Ha-7),P(-A,y0,Ha-7)],ac,"none")+lfPoly([P(-A,y0,Ha-9),P(0,y0,Ha-9),P(0,y0,Ha-7),P(-A,y0,Ha-7)],ac,"none");
  s+=lfPoly([P(-A,y0,Ha-9),P(-A,y1,Ha-9),P(-A,y1,Ha-52),P(-A,y0,Ha-52)],'url(#lfag'+uid+')',"none")+lfPoly([P(-A,y0,Ha-9),P(0,y0,Ha-9),P(0,y0,Ha-52),P(-A,y0,Ha-52)],'url(#lfag'+uid+')',"none");
  /* thickness caps (same look as the main walls) */
  s+=lfPoly([P(-A-th,y0-th,Ha),P(-A-th,y1,Ha),P(-A,y1,Ha),P(-A,y0,Ha),P(0,y0,Ha),P(0,y0-th,Ha)],lfSh(lair?"#3a3060":"#d9cdb8",.4),LFOL,1);
  s+=lfPoly([P(-A-th,y1,0),P(-A,y1,0),P(-A,y1,Ha),P(-A-th,y1,Ha)],lair?"#231c40":"#b7a893",LFOL,1);
  s+=lfPoly([P(-A-th,y0-th,0),P(-A,y0,0),P(-A,y0,Ha),P(-A-th,y0-th,Ha)],lair?"#1a1432":"#a99a84","none");
  /* ---------- contents ---------- */
  var sideW=A*LFAU,backW=(y1-y0)*LFAU,pal=["#2b3a55","#e6e0d2","#7a2e3a","#3d5a45","#c4a35a","#1c1c24","#8a8fa3","#efe9dc","#4a3566","#9b6b4a"];
  if(!lair){
    /* side wall: shelf, two rails, clothes */
    var g="";
    g+=lfR(4,Ha-104,sideW-8,5,"#cdbb9e","rgba(24,30,58,.4)")+lfR(4,Ha-99,sideW-8,2,"rgba(10,10,30,.25)","")
    ;[Ha-90,Ha-52].forEach(function(rv,ri){g+='<rect x="6" y="'+rv+'" width="'+(sideW-12)+'" height="2.4" rx="1" fill="#b9bfca" stroke="rgba(24,30,58,.4)" stroke-width=".5"/>';
      var n=Math.floor((sideW-16)/9.5);for(var i=0;i<n;i++){var h=ri?30+((i*7)%6):40+((i*5)%7);g+=lfAGar(10+i*9.5,rv+3,8,h,pal[(i*3+ri*5)%pal.length])}});
    s+=lfFaceY(-A,y0,Ha,g);
    s+=lfBox(-A+.04,y0,Ha-104,A-.08,.5,4,"#cdbb9e",{top:"#e7d8bd"});
    if(C.annex.shoe){var sg="";[8,26,44].forEach(function(v){sg+=lfR(4,Ha-v-6,sideW-8,3,"#cdbb9e","rgba(24,30,58,.4)");for(var k=0;k<Math.floor((sideW-20)/23);k++)sg+=lfAShoe(10+k*23,Ha-v-7,pal[(k*2+v)%pal.length])});
      s+=lfFaceY(-A,y0,Ha,sg);s+=lfPoly([P(-A,y0,2),P(0,y0,2),P(0,y0,56),P(-A,y0,56)],"rgba(255,226,170,.10)","none")}
    /* back wall: mirror panel + bag shelves */
    var b="",mw=backW*.46,mx=(backW-mw)/2;
    b+='<rect x="'+mx+'" y="'+(Ha-100)+'" width="'+mw+'" height="88" rx="3" fill="#ffe2a8"/><rect x="'+(mx+2.5)+'" y="'+(Ha-97.5)+'" width="'+(mw-5)+'" height="83" rx="2" fill="url(#lfam'+uid+')"/>';
    b+='<path d="M'+(mx+6)+' '+(Ha-14)+' L'+(mx+mw*.45)+' '+(Ha-96)+'" stroke="rgba(255,255,255,.35)" stroke-width="5"/>';
    b+=lfR(4,Ha-60,mx-10,3,"#cdbb9e","rgba(24,30,58,.4)")+lfR(mx+mw+6,Ha-60,backW-mx-mw-10,3,"#cdbb9e","rgba(24,30,58,.4)");
    for(var q=0;q<3;q++){b+=lfRr(8+q*10,Ha-77+q*0,8,16,2,pal[(q*4)%pal.length],"rgba(24,30,58,.35)");b+=lfRr(mx+mw+10+q*10,Ha-77,8,16,2,pal[(q*3+1)%pal.length],"rgba(24,30,58,.35)")}
    s+='<linearGradient id="lfam'+uid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dff0ff"/><stop offset="1" stop-color="#a9c8e8"/></linearGradient>'+lfFaceX(-A,y1,Ha,b);
    if(C.annex.isle){s+=lfBox(-2.1,.4,0,.9,1.2,30,"#e9e1d3",{top:"#fbf7ee"})+lfPoly([P(-2.1,.4,30),P(-1.2,.4,30),P(-1.2,1.6,30),P(-2.1,1.6,30)],"rgba(255,255,255,.35)","none")+lfBox(-1.0,.5,0,.6,.6,15,"#5b3d8a",{top:"#7a58b0"})}
  }else{
    /* lair: neon trim, floor glyph, tech panels */
    var ng="";for(var k=0;k<Math.floor(sideW/22);k++){ng+=lfR(8+k*22,Ha-96,14,70,"#241d44","rgba(165,139,255,.55)")+lfR(10+k*22,Ha-94,10,2,"#9d7cff","")+lfR(10+k*22,Ha-30,10,2,"#58d6ff","")}
    s+=lfFaceY(-A,y0,Ha,ng);
    var cx=-A/2,cy=(y0+y1)/2,ring=function(r,c,w){var p=[];for(var k=0;k<=36;k++){var an=k/36*Math.PI*2;p.push(P(cx+Math.cos(an)*r,cy+Math.sin(an)*r,0))}return '<polygon points="'+p.map(lfPt).join(" ")+'" fill="none" stroke="'+c+'" stroke-width="'+w+'" class="lfneonp"/>'};
    s+=ring(1.55,"#7c5cff",2)+ring(1.15,"#58d6ff",1.4)+ring(.55,"#9d7cff",1.2);
    s+=lfPoly([P(-A+.2,y0+.15,0),P(-.2,y0+.15,0),P(-.2,y0+.3,0),P(-A+.2,y0+.3,0)],"#58d6ff","none",0,' class="lfneonp"')+lfPoly([P(-A+.15,y0+.2,0),P(-A+.3,y0+.2,0),P(-A+.3,y1-.2,0),P(-A+.15,y1-.2,0)],"#58d6ff","none",0,' class="lfneonp"');
    if(C.annex.wall){var cg="",mxx=backW/2,cyy=Ha-62;
      cg+='<path d="M'+mxx+' '+(cyy-30)+' l26 15 v30 l-26 15 l-26 -15 v-30z" fill="#17122a" stroke="#9d7cff" stroke-width="2.4" class="lfneonp"/><path d="M'+mxx+' '+(cyy-18)+' l15 9 v18 l-15 9 l-15 -9 v-18z" fill="none" stroke="#58d6ff" stroke-width="1.8"/><path d="M'+mxx+' '+(cyy-10)+' l8 20 h-16z" fill="#ffd97a"/>';
      [[10,0],[backW-62,0]].forEach(function(q){cg+=lfR(q[0],Ha-34,52,3,"#3a2f66","rgba(165,139,255,.6)");for(var k=0;k<4;k++)cg+='<path d="M'+(q[0]+8+k*11)+' '+(Ha-35)+' v-10 h6 v10z" fill="'+["#ffd97a","#58d6ff","#ff7ab8","#9d7cff"][k]+'"/>'});
      s+=lfFaceX(-A,y1,Ha,cg)}
    if(C.annex.arm){var ag="";for(var k=0;k<3;k++){var ax=14+k*((sideW-60)/2.2);ag+=lfR(ax,Ha-98,40,74,"#120e24","rgba(88,214,255,.7)")+'<path d="M'+(ax+20)+' '+(Ha-92)+' l-14 70 h28z" fill="rgba(88,214,255,.14)"/><circle cx="'+(ax+20)+'" cy="'+(Ha-80)+'" r="6" fill="#c8cbe0"/><path d="M'+(ax+11)+' '+(Ha-73)+' h18 l4 24 h-26z" fill="#6f7aa8" stroke="#a58bff" stroke-width="1"/><rect x="'+(ax+13)+'" y="'+(Ha-49)+'" width="5" height="22" fill="#4b5380"/><rect x="'+(ax+22)+'" y="'+(Ha-49)+'" width="5" height="22" fill="#4b5380"/><path d="M'+(ax+8)+' '+(Ha-72)+' l-6 30" stroke="#a58bff" stroke-width="2"/>'}
      s+=lfFaceY(-A,y0,Ha,ag)}
    if(C.annex.holo){var hx=-A/2,hy=cy;s+=lfBox(hx-.55,hy-.55,0,1.1,1.1,16,"#1d1738",{top:"#2b2352",ol:"rgba(165,139,255,.6)"});
      s+='<ellipse cx="'+P(hx,hy,16)[0]+'" cy="'+P(hx,hy,16)[1]+'" rx="22" ry="11" fill="#58d6ff" opacity=".55" class="lfneonp"/><path d="M'+(P(hx,hy,16)[0]-18)+' '+P(hx,hy,16)[1]+' L'+(P(hx,hy,16)[0])+' '+(P(hx,hy,16)[1]-62)+' L'+(P(hx,hy,16)[0]+18)+' '+P(hx,hy,16)[1]+'z" fill="rgba(88,214,255,.22)"/><circle cx="'+P(hx,hy,16)[0]+'" cy="'+(P(hx,hy,16)[1]-40)+'" r="15" fill="none" stroke="#9cf0ff" stroke-width="1.6" class="lfneonp"/><ellipse cx="'+P(hx,hy,16)[0]+'" cy="'+(P(hx,hy,16)[1]-40)+'" rx="15" ry="5" fill="none" stroke="#9cf0ff" stroke-width="1.2"/><path d="M'+P(hx,hy,16)[0]+' '+(P(hx,hy,16)[1]-55)+' v30" stroke="#9cf0ff" stroke-width="1.2"/>'}
  }
  return s}

/* ===== fairy lights: draped strands with real glow (replaces the tiny sprite) ===== */
function lfFairy(C,strands,uid){
  var L=lfLS(),dk=Math.max(0,Math.min(1,L.dark||0)),ho=(.34+dk*.6).toFixed(2),id="lfff"+(uid||0),g='<defs><radialGradient id="'+id+'"><stop offset="0" stop-color="#fff1c2" stop-opacity="'+ho+'"/><stop offset=".35" stop-color="#ffd27a" stop-opacity="'+(ho*.5).toFixed(2)+'"/><stop offset="1" stop-color="#ffb25a" stop-opacity="0"/></radialGradient></defs>',n=0;
  strands.forEach(function(st){
    var pt=function(u,z){return st.w==="R"?lfP(u,0,z):lfP(0,u,z)},sw=st.sw||4,span=(st.u1-st.u0)/sw;
    var wire="",bulbs="",halos="";
    for(var s=0;s<sw;s++){
      var a=pt(st.u0+s*span,st.z),b=pt(st.u0+(s+1)*span,st.z),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2+(st.sag||20);
      wire+='M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+b[0].toFixed(1)+' '+b[1].toFixed(1)+' ';
      for(var k=0;k<=5;k++){var t=k/6+(k?0:.08);if(k===0&&s>0)continue;t=Math.min(.94,Math.max(.06,k/5));
        var px=(1-t)*(1-t)*a[0]+2*t*(1-t)*mx+t*t*b[0],py=(1-t)*(1-t)*a[1]+2*t*(1-t)*my+t*t*b[1],col=["#fff4cc","#ffe19a","#ffd0a0"][(n+k)%3];
        halos+='<circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="15" fill="url(#'+id+')"/>';
        bulbs+='<g class="lftwk" style="animation-delay:'+(((n++)*.43)%2.2).toFixed(2)+'s"><circle cx="'+px.toFixed(1)+'" cy="'+(py+1.5).toFixed(1)+'" r="2.9" fill="'+col+'" stroke="rgba(120,70,10,.55)" stroke-width=".5"/><circle cx="'+(px-.7).toFixed(1)+'" cy="'+(py+.7).toFixed(1)+'" r="1" fill="#fff"/></g>'}
    }
    C.walls.push('<g pointer-events="none">'+halos+'<path d="'+wire+'" fill="none" stroke="#2a2430" stroke-width="1.3" stroke-linecap="round"/>'+bulbs+'</g>');
    var cx=st.w==="R"?(st.u0+st.u1)/2:.3,cy=st.w==="R"?.3:(st.u0+st.u1)/2;lfLight(C,cx,cy,st.z-10,"#ffd98a",3.0,.55)});
  C.walls.push(g)}

/* building frame: tidy facade, ground, road, streetlights, small sign (building view only) */
function lfFacade(rows,hasLock){
  var top=LFROOF-64,y0=LFROOF+rows*LFFP,bot=y0-14,L=lfLS(),night=L.mul!=="#ffffff",s='';
  s+='<defs><linearGradient id="lffg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe6f1"/><stop offset="1" stop-color="#c3cddd"/></linearGradient>'
   +'<linearGradient id="lfpil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9aa6bb"/><stop offset="1" stop-color="#7e8aa1"/></linearGradient>'
   +'<linearGradient id="lfgnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d3c7"/><stop offset="1" stop-color="#c4bdb0"/></linearGradient>'
   +'<linearGradient id="lfrd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6c7080"/><stop offset="1" stop-color="#565a69"/></linearGradient></defs>';
  /* back panel */
  s+='<rect x="-22" y="'+top+'" width="'+(LFWW+44)+'" height="'+(bot-top)+'" rx="14" fill="url(#lffg)"/>';
  s+='<rect x="-22" y="'+top+'" width="'+(LFWW+44)+'" height="'+(bot-top)+'" rx="14" fill="none" stroke="rgba(60,72,98,.35)" stroke-width="2"/>';
  /* centre divider between columns */
  s+='<rect x="'+(LFWW/2-3)+'" y="'+(top+30)+'" width="6" height="'+(bot-top-40)+'" fill="rgba(90,104,130,.22)"/>';
  /* floor ledges */
  for(var k=1;k<=rows;k++){var y=LFROOF+k*LFFP-12-(k===rows?2:0);
    s+='<rect x="-22" y="'+(y-6)+'" width="'+(LFWW+44)+'" height="12" fill="#8d99b0"/><rect x="-22" y="'+(y-6)+'" width="'+(LFWW+44)+'" height="3" fill="rgba(255,255,255,.45)"/>';}
  /* pillars */
  [-34,LFWW+10].forEach(function(x){s+='<rect x="'+x+'" y="'+(top-6)+'" width="24" height="'+(bot-top+14)+'" rx="5" fill="url(#lfpil)"/><rect x="'+(x+3)+'" y="'+(top-6)+'" width="4" height="'+(bot-top+14)+'" fill="rgba(255,255,255,.35)"/>'});
  /* roof cap */
  s+='<rect x="-46" y="'+(top-22)+'" width="'+(LFWW+92)+'" height="26" rx="8" fill="#8d99b0"/><rect x="-46" y="'+(top-22)+'" width="'+(LFWW+92)+'" height="6" rx="3" fill="rgba(255,255,255,.5)"/>';
  /* sign */
  var cx=LFWW/2;
  s+='<g transform="translate('+cx+','+(top-44)+')"><rect x="-74" y="-17" width="148" height="34" rx="9" fill="#232a3c"/><rect x="-74" y="-17" width="148" height="34" rx="9" fill="none" stroke="#e7c36a" stroke-width="1.6"/><text y="6" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-weight="700" font-size="17" letter-spacing="4" fill="#ffe7a3">THE LOFT</text></g>';
  /* ground */
  s+='<rect x="-600" y="'+bot+'" width="'+(LFWW+1200)+'" height="34" fill="url(#lfgnd)"/><rect x="-600" y="'+bot+'" width="'+(LFWW+1200)+'" height="4" fill="rgba(255,255,255,.55)"/>';
  return s;
}
function lfStreet(rows){
  var y0=LFROOF+rows*LFFP,rd=y0+20,night=lfLS().mul!=="#ffffff",s='';
  s+='<rect x="-600" y="'+rd+'" width="'+(LFWW+1200)+'" height="82" fill="url(#lfrd)"/>';
  s+='<rect x="-600" y="'+rd+'" width="'+(LFWW+1200)+'" height="3" fill="rgba(255,255,255,.28)"/>';
  for(var x=-560;x<LFWW+600;x+=110)s+='<rect x="'+x+'" y="'+(rd+39)+'" width="56" height="5" rx="2.5" fill="rgba(235,235,225,.55)"/>';
  [150,LFWW-150].forEach(function(x){
    var b=y0+14;
    s+='<ellipse cx="'+x+'" cy="'+(b+2)+'" rx="16" ry="5" fill="rgba(40,40,60,.25)"/>';
    s+='<rect x="'+(x-3)+'" y="'+(b-96)+'" width="6" height="98" rx="3" fill="#434a5e"/><rect x="'+(x-9)+'" y="'+(b-8)+'" width="18" height="8" rx="3" fill="#434a5e"/>';
    s+='<path d="M'+x+' '+(b-94)+' q0 -12 -16 -12" fill="none" stroke="#434a5e" stroke-width="5" stroke-linecap="round"/>';
    s+='<rect x="'+(x-30)+'" y="'+(b-110)+'" width="22" height="8" rx="4" fill="'+(night?"#ffe9a8":"#eef0f4")+'"/>';
    if(night)s+='<ellipse cx="'+(x-19)+'" cy="'+(b-60)+'" rx="46" ry="62" fill="#ffd98a" opacity=".16"/>';
  });
  return s;
}
function lfInitView(c){
  var cw=c.clientWidth||360,ch=c.clientHeight||520;
  LFV.s=Math.min(1.2,Math.max(.3,cw/1060));
  var rows=LFDIM.rows,gy=LFROOF+rows*LFFP+90;
  LFV.s0=LFV.s;LFV.x=cw/2-(LFWW/2)*LFV.s;LFV.y=ch*.80-gy*LFV.s;LFV.init=1;lfClamp();lfApply()}

/* ===== Bedroom v54: vector rug, picture window, floor-to-ceiling glass + patio, LED strips + grass panels ===== */
var LFWBR=[.9,2.4,3.9,5.4,6.9,8.2,9.3],LFWBR0=LFWBR,LFWDOOR=[8.0,9.3];
function lfPatioQ(){var a=LFWBR[0],b=LFWBR[LFWBR.length-1];return [lfP(a,0,0),lfP(b,0,0),lfP(b,0,LF.H-10),lfP(a,0,LF.H-10)]}
function lfHoles(C,uid){
  var id="lfah"+uid,p="M-1400 -1400H1400V1400H-1400Z",d="";
  if(C.annex&&C.annex.lair){var D=lfAnnexDoor();p+=" M"+[lfP(0,D.y0,0),lfP(0,D.y1,0),lfP(0,D.y1,D.zd),lfP(0,D.y0,D.zd)].map(lfPt).join(" L")+"Z"}
  if(C.patio){p+=" M"+lfPatioQ().map(lfPt).join(" L")+"Z";d='<clipPath id="lfph'+uid+'"><path d="M'+lfPatioQ().map(lfPt).join(" L")+'Z"/></clipPath>'}
  return {id:id,defs:'<clipPath id="'+id+'"><path clip-rule="evenodd" d="'+p+'"/></clipPath>'+d}}
/* ---- rug ---- */
function lfRugPts(x,y,w,d,r,ins){
  var X0=x+ins,Y0=y+ins,X1=x+w-ins,Y1=y+d-ins,rr=Math.max(.05,r-ins),pts=[],cs=[[X1-rr,Y0+rr,-90],[X1-rr,Y1-rr,0],[X0+rr,Y1-rr,90],[X0+rr,Y0+rr,180]];
  cs.forEach(function(c){for(var k=0;k<=6;k++){var a=(c[2]+k*15)*Math.PI/180;pts.push(lfP(c[0]+Math.cos(a)*rr,c[1]+Math.sin(a)*rr,0))}});return pts}
function lfRugBd(C,x,y,w,d){
  var s="";
  s+=lfPoly(lfRugPts(x-.06,y-.06,w+.12,d+.12,.8,0),"rgba(20,16,36,.18)","none");
  s+=lfPoly(lfRugPts(x,y,w,d,.8,0),"#d8c8a6","rgba(60,44,30,.45)",.8);
  s+=lfPoly(lfRugPts(x,y,w,d,.8,.16),"#2f6a72","none");
  s+=lfPoly(lfRugPts(x,y,w,d,.8,.36),"#efe6d2","none");
  s+=lfPoly(lfRugPts(x,y,w,d,.8,.5),"none","#c97a52",1.6);
  s+=lfPoly(lfRugPts(x,y,w,d,.8,.62),"none","#2f6a72",.9);
  /* centre medallion */
  var cx=x+w/2,cy=y+d/2;
  for(var k=0;k<5;k++){var rx=w*.17-k*.1,ry=d*.17-k*.1;if(rx<.1)break;var p=[];for(var a=0;a<=24;a++){var t=a/24*Math.PI*2;p.push(lfP(cx+Math.cos(t)*rx,cy+Math.sin(t)*ry,0))}
    s+='<polygon points="'+p.map(lfPt).join(" ")+'" fill="'+(k%2?"#efe6d2":(k===0?"#2f6a72":"#c97a52"))+'" fill-opacity="'+(k===0?.9:.95)+'"/>'}
  /* tassels */
  for(var f=0;f<9;f++){var fy=y+.9+f*((d-1.8)/8);s+='<path d="M'+lfPt(lfP(x,fy,0))+' L'+lfPt(lfP(x-.2,fy,0))+' M'+lfPt(lfP(x+w,fy,0))+' L'+lfPt(lfP(x+w+.2,fy,0))+'" stroke="#d8c8a6" stroke-width="1.4"/>'}
  C.decals.push(s)}
/* ---- windows on the right wall (plane y=0) ---- */
function lfWallQ(x0,x1,z0,z1){return [lfP(x0,0,z0),lfP(x1,0,z0),lfP(x1,0,z1),lfP(x0,0,z1)]}
function lfWinPic(C,x0,x1,z0,z1,uid){
  var L=lfLS(),sk=lfSkyCols(L),q=lfWallQ(x0,x1,z0,z1),ys=q.map(function(a){return a[1]}),id="lfwp"+uid,s="";
  s+='<linearGradient id="'+id+'" gradientUnits="userSpaceOnUse" x1="0" y1="'+Math.min.apply(0,ys)+'" x2="0" y2="'+Math.max.apply(0,ys)+'"><stop offset="0" stop-color="'+sk[0]+'"/><stop offset="1" stop-color="'+sk[1]+'"/></linearGradient>';
  var t=.07,b=3;
  s+=lfPoly(lfWallQ(x0-.1,x1+.1,z0-5,z1+5),"#1c212b","rgba(0,0,0,.5)",.8);
  s+=lfPoly(lfWallQ(x0,x1,z0,z1),'url(#'+id+')',"none");
  /* soft haze + cloud puffs */
  s+=lfPoly(lfWallQ(x0,x1,z0,z0+(z1-z0)*.28),"rgba(255,255,255,.28)","none");
  var cw=lfP((x0+x1)/2-.2,0,z0+(z1-z0)*.62),cs=(1-(L.dark||0)*.7)*(1-lfCl(L.cl,0,1)*.2);
  s+='<g fill="rgba(255,255,255,'+(.7*cs).toFixed(2)+')"><ellipse cx="'+cw[0]+'" cy="'+cw[1]+'" rx="22" ry="6"/><ellipse cx="'+(cw[0]+11)+'" cy="'+(cw[1]-5)+'" rx="12" ry="6"/><ellipse cx="'+(cw[0]-14)+'" cy="'+(cw[1]-3)+'" rx="10" ry="5"/></g>';
  /* mullions */
  var xm=(x0+x1)/2;
  s+=lfPoly(lfWallQ(xm-.035,xm+.035,z0,z1),"#1c212b","none")+lfPoly(lfWallQ(x0,x1,(z0+z1)/2-1.5,(z0+z1)/2+1.5),"#1c212b","none");
  /* glass sheen */
  s+=lfPoly([lfP(x0+.25,0,z1),lfP(x0+.55,0,z1),lfP(x0+.2,0,z0),lfP(x0,0,z0),lfP(x0,0,z0+8)].slice(0,4),"rgba(255,255,255,.16)","none");
  /* sill + frame highlights */
  s+=lfBox(x0-.12,-.02,z0-9,x1-x0+.24,.34,4,"#f0ece3",{top:"#fffdf8"});
  s+=lfPoly(lfWallQ(x0-.1,x1+.1,z1+3,z1+5),"rgba(255,255,255,.25)","none");
  C.walls.push(s)}
function lfWinFtc(C,uid){
  var BR=LFWBR,x0=BR[0],x1=BR[BR.length-1],z1=LF.H-10,s="",fw=.05,fc="#1a1e27",door=!!(C.patio&&(C.patio.deck||C.patio.room)),n=BR.length-1;
  /* jamb depth + sill */
  s+=lfPoly([lfP(x0,-.45,0),lfP(x0,0,0),lfP(x0,0,z1),lfP(x0,-.45,z1)],"#c9bfae","rgba(24,30,58,.35)",.8);
  s+=lfPoly([lfP(x0,-.45,0),lfP(x1,-.45,0),lfP(x1,0,0),lfP(x0,0,0)],"#e8dfcf","rgba(24,30,58,.3)",.8);
  /* header + base rail across the whole glass wall */
  s+=lfPoly(lfWallQ(x0-.08,x1+.08,z1-2,z1+7),fc,"none")+lfPoly(lfWallQ(x0-.08,x1+.08,z1+7,z1+8.4),"rgba(255,255,255,.18)","none");
  s+=lfPoly(lfWallQ(x0-.08,x1+.08,0,4),"#0f1218","none")+lfPoly(lfWallQ(x0-.08,x1+.08,4,5.2),"#8e95a3","none");
  /* mullions */
  for(var i=0;i<=n;i++){var xx=BR[i];s+=lfPoly(lfWallQ(xx-(i===0?.08:fw),xx+(i===n?.08:fw),0,z1+7),fc,"none")}
  /* glass sheen on every pane */
  for(var k=0;k<(door?n-1:n);k++){var xa=BR[k],pw=BR[k+1]-xa;
    s+=lfPoly([lfP(xa+pw*.18,0,z1-8),lfP(xa+pw*.36,0,z1-8),lfP(xa+pw*.1,0,z1*.42),lfP(xa+pw*.03,0,z1*.42)],"rgba(255,255,255,.12)","none");
    s+=lfPoly([lfP(xa+pw*.5,0,z1-8),lfP(xa+pw*.56,0,z1-8),lfP(xa+pw*.42,0,z1*.55),lfP(xa+pw*.38,0,z1*.55)],"rgba(255,255,255,.07)","none")}
  /* transom line */
  s+=lfPoly(lfWallQ(x0,door?BR[n-1]:x1,z1*.74,z1*.74+2),fc,"none");
  /* patio door: last pane, heavier frame, handle bars, floor track */
  if(door){var da=BR[n-1],db=x1,fh=.09;
    /* The door pane carries its own glass, so sliding it opens a clear gap onto the patio; it rests ajar (Cal: "the
       patio door still looks like it doesn't open") and slides fully open when someone walks up. A threshold under it. */
    s+=lfPoly([lfP(da,-.45,0),lfP(db,-.45,0),lfP(db,.12,0),lfP(da,.12,0)],"#6f6a63","rgba(24,30,58,.4)",.6);
    s+='<g id="lfpdr'+uid+'" style="transition:transform .9s ease-in-out;transform:translate(-14.3px,-7.15px)">';
    s+=lfPoly(lfWallQ(da,db,0,10),fc,"none")+lfPoly(lfWallQ(da,db,z1-3,z1+4),fc,"none")+lfPoly(lfWallQ(da,da+fh,0,z1+7),"#232833","none")+lfPoly(lfWallQ(db-fh,db,0,z1+7),"#232833","none");
    s+=lfPoly(lfWallQ(da+.05,db-.05,0,3),"#8e95a3","none");
    s+=lfPoly(lfWallQ(da+.16,da+.21,z1*.28,z1*.56),"#d6dae3","rgba(20,24,34,.45)",.5);
    var pw2=db-da;s+=lfPoly(lfWallQ(da+fh,db-fh,10,z1-3),"rgba(170,212,238,.30)","none");
    s+=lfPoly([lfP(da+pw2*.18,0,z1-8),lfP(da+pw2*.36,0,z1-8),lfP(da+pw2*.1,0,z1*.42),lfP(da+pw2*.03,0,z1*.42)],"rgba(255,255,255,.22)","none");
    s+=lfPoly([lfP(da+pw2*.5,0,z1-8),lfP(da+pw2*.56,0,z1-8),lfP(da+pw2*.42,0,z1*.55),lfP(da+pw2*.38,0,z1*.55)],"rgba(255,255,255,.12)","none")+'</g>'}
  C.walls.push(s)}
/* ---- patio (behind the glass) ---- */
function lfRattanEgg(x,y,zc,sc){
  var c=lfP(x,y,zc),s="",rx=17*sc,ry=22*sc,top=lfP(x,y,zc+ry/1+22);
  s+='<ellipse cx="'+c[0]+'" cy="'+(c[1]+ry+8)+'" rx="'+(rx*.9)+'" ry="'+(rx*.38)+'" fill="rgba(20,16,10,.22)"/>';
  s+='<path d="M'+(c[0]-3)+' '+(c[1]-ry+2)+' L'+(top[0]-3)+' '+(top[1])+' M'+(c[0]+3)+' '+(c[1]-ry+2)+' L'+(top[0]+3)+' '+top[1]+'" stroke="#8d8f98" stroke-width="1.2"/>';
  s+='<ellipse cx="'+c[0]+'" cy="'+c[1]+'" rx="'+rx+'" ry="'+ry+'" fill="url(#lfegg)" stroke="#5e4630" stroke-width="1.2"/>';
  for(var k=1;k<6;k++){s+='<path d="M'+(c[0]-rx*Math.sin(k/6*Math.PI)*.96)+' '+(c[1]-ry+k*(2*ry/6))+' Q'+c[0]+' '+(c[1]-ry+k*(2*ry/6)+4)+' '+(c[0]+rx*Math.sin(k/6*Math.PI)*.96)+' '+(c[1]-ry+k*(2*ry/6))+'" fill="none" stroke="rgba(70,48,26,.42)" stroke-width=".9"/>'}
  s+='<ellipse cx="'+(c[0]+3)+'" cy="'+(c[1]+3)+'" rx="'+(rx*.66)+'" ry="'+(ry*.7)+'" fill="#3b2c1f" opacity=".55"/>';
  s+='<ellipse cx="'+(c[0]+3)+'" cy="'+(c[1]+9)+'" rx="'+(rx*.62)+'" ry="'+(ry*.36)+'" fill="#f2e8d4" stroke="rgba(90,70,40,.35)" stroke-width=".8"/><ellipse cx="'+(c[0]+3)+'" cy="'+(c[1]+5)+'" rx="'+(rx*.5)+'" ry="'+(ry*.2)+'" fill="#e8c9a0"/>';
  s+='<ellipse cx="'+(c[0]-rx*.5)+'" cy="'+(c[1]-ry*.45)+'" rx="3" ry="9" fill="rgba(255,255,255,.28)" transform="rotate(-18 '+(c[0]-rx*.5)+' '+(c[1]-ry*.45)+')"/>';
  return s}
function lfPotPlant(x,y,sc,kind){
  var b=lfP(x,y,0),s="";sc=sc||1;
  s+='<ellipse cx="'+b[0]+'" cy="'+(b[1]+2)+'" rx="'+(12*sc)+'" ry="'+(5*sc)+'" fill="rgba(20,16,10,.22)"/>';
  s+='<path d="M'+(b[0]-9*sc)+' '+(b[1]-14*sc)+' h'+(18*sc)+' l'+(-3*sc)+' '+(15*sc)+' h'+(-12*sc)+'z" fill="'+(kind==="b"?"#d8cdb8":"#a75f3d")+'" stroke="rgba(30,20,10,.4)" stroke-width=".8"/><ellipse cx="'+b[0]+'" cy="'+(b[1]-14*sc)+'" rx="'+(9*sc)+'" ry="'+(3*sc)+'" fill="#4a3322"/>';
  var gs=["#3f8a3f","#5aa84a","#2f6e36","#74c05a"];
  for(var k=0;k<9;k++){var a=(-70+k*17.5)*Math.PI/180,len=(kind==="b"?26:34)*sc+(k%3)*5,ex=b[0]+Math.sin(a)*len*.85,ey=b[1]-14*sc-Math.cos(a)*len;
    s+='<path d="M'+b[0]+' '+(b[1]-14*sc)+' Q'+(b[0]+Math.sin(a)*len*.3)+' '+(b[1]-14*sc-len*.7)+' '+ex+' '+ey+' Q'+(b[0]+Math.sin(a)*len*.55+5*sc)+' '+(b[1]-14*sc-len*.4)+' '+b[0]+' '+(b[1]-14*sc)+'z" fill="'+gs[k%4]+'" stroke="rgba(10,40,16,.35)" stroke-width=".6"/>'}
  return s}
/* The Patio room's slot, or -1. */
function lfPatioSlot(){var k=-1;(S.base.slots||[]).forEach(function(r,i){if(k<0&&r&&r.t==="patio")k=i});return k}
/* The Patio room drawn as it is furnished, placed behind the Bedroom's back wall: its front edge just outside the wall,
   centred on the glass. Room drawing works on shared globals, so they are put back afterwards. */
function lfPatioView(){
  var i=lfPatioSlot();if(i<0)return null;
  var r=S.base.slots[i],sv=[LF.W,LF.D,LF.N,LF.H,window.LFCR,LFDEC,LFWINS,LFREC,window.rmPortalsOn,LFWBR],s="",x0=LFWBR[0],x1=LFWBR[LFWBR.length-1];
  try{window.rmPortalsOn=0;var C=lfRoomCtx(r,900+i),W=C.W||7.5,D=C.D||5,o=lfP((x0+x1)/2-W/2,-.45-D,0);
    /* its item layer is renamed: the Bedroom window looks up the first ".lfitems" to start its people, and found this one */
    s='<g transform="translate('+o[0].toFixed(1)+','+o[1].toFixed(1)+')">'+lfRoomSvg(r,900+i,C,{uid:901+i}).replace(/class="lfitems"/g,'class="lfitems-pt"')+'</g>'}
  catch(e){s=null}
  finally{LF.W=sv[0];LF.D=sv[1];LF.N=sv[2];LF.H=sv[3];window.LFCR=sv[4];LFDEC=sv[5];LFWINS=sv[6];LFREC=sv[7];window.rmPortalsOn=sv[8];LFWBR=sv[9]}
  return s}
/* The Patio room's real layout seen from the Bedroom (Cal: "the character and the dogs ... go in and out of the bedroom
   and the patio"): its furniture footprints, spots to stand at and dog beds, moved into Bedroom coordinates (the Patio
   sits behind the back wall, centred on the glass, as lfPatioView draws it). Shared globals are put back. */
function lfPatioReal(){
  var i=lfPatioSlot();if(i<0)return null;
  var r=S.base.slots[i],sv=[LF.W,LF.D,LF.N,LF.H,window.LFCR,LFDEC,LFWINS,LFREC,window.rmPortalsOn,LFWBR],x0=LFWBR[0],x1=LFWBR[LFWBR.length-1],R=null;
  try{window.rmPortalsOn=0;var C=lfRoomCtx(r,900+i),W=C.W||7.5,D=C.D||5,ox=(x0+x1)/2-W/2,oy=-.45-D,a=r.a||{};
    R={ox:ox,oy:oy,W:W,D:D,box:((C.nav&&C.nav.obs)||[]).map(function(o){return [o.x0,o.y0,o.x1,o.y1]}),spots:[],beds:[]};
    (C.st||[]).forEach(function(q){if(!q.lift&&!q.seat&&/^(look|wander|art|admire|smell|browse)$/.test(q.kind))R.spots.push([q.x+ox,q.y+oy,q.fx||1])});
    [[2.4,1.6],[4.6,1.0],[5.9,2.6],[3.2,3.0]].forEach(function(q){R.spots.push([q[0]+ox,q[1]+oy,1])});
    if(a.pt_dbed)R.beds.push([1.95+ox,4.05+oy]);if(a.pt_dbed2)R.beds.push([.75+ox,4.05+oy]);
    /* a dog walks onto its own bed, so the beds are not obstacles (the Bedroom's beds work the same way) */
    R.box=R.box.filter(function(o){return !R.beds.some(function(q){var px=q[0]-ox,py=q[1]-oy;return px>o[0]&&px<o[2]&&py>o[1]&&py<o[3]})})}
  catch(e){R=null}
  finally{LF.W=sv[0];LF.D=sv[1];LF.N=sv[2];LF.H=sv[3];window.LFCR=sv[4];LFDEC=sv[5];LFWINS=sv[6];LFREC=sv[7];window.rmPortalsOn=sv[8];LFWBR=sv[9]}
  return R}
function lfPatioPre(C,uid){
  if(C.patio&&C.patio.room){var v=lfPatioView();if(v)return '<g clip-path="url(#lfph'+uid+')" pointer-events="none">'+v+'</g>'+(C.patio.deck?'<g clip-path="url(#lfph'+uid+')"><g id="lfpcg'+uid+'"></g></g>':'')}
  var p=C.patio,L=lfLS(),sk=lfSkyCols(L),dk=L.dark||0,q=lfPatioQ(),ys=q.map(function(a){return a[1]}),yT=Math.min.apply(0,ys),yB=Math.max.apply(0,ys),s="",P=lfP;
  s+='<linearGradient id="lfpsk'+uid+'" gradientUnits="userSpaceOnUse" x1="0" y1="'+yT+'" x2="0" y2="'+yB+'"><stop offset="0" stop-color="'+sk[0]+'"/><stop offset="1" stop-color="'+sk[1]+'"/></linearGradient>'
   +'<radialGradient id="lfegg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#e3c391"/><stop offset="1" stop-color="#a47a48"/></radialGradient>'
   +'<linearGradient id="lfdeck'+uid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c79a66"/><stop offset="1" stop-color="#a77a4a"/></linearGradient>';
  s+='<g clip-path="url(#lfph'+uid+')"><rect x="-1400" y="-1400" width="2800" height="2800" fill="url(#lfpsk'+uid+')"/>';
  var hz=lfMix(sk[1],"#7d90b8",.5-dk*.2),hz2=lfMix(sk[1],"#91a3c6",.45-dk*.2);
  var bl=[[-9,-9.2,1.6,60,0],[-10.6,-9.2,1.4,92,1],[-12,-11,2,70,0],[-13.4,-11,1.6,118,1],[-15,-13.5,2.2,84,0],[-16.6,-13.5,1.8,104,1],[-18,-15,2,66,0]];
  bl.forEach(function(b){s+=lfBox(b[0],b[1],-6,b[2],b[2]*.9,b[3],b[4]?hz2:hz,{top:lfSh(hz,.22)})});
  s+=lfPoly([P(-24,-2.6,0),P(8,-2.6,0),P(8,-9,0),P(-24,-9,0)],lfMix(sk[1],"#6c8a62",.38),"none");
  if(p.deck){
    s+='<g transform="translate('+(26*3.4)+','+(13*3.4)+')">';
    var x0=-3.4,x1=8.2,y0=-3.5,y1=.15;
    s+=lfPoly([P(x0,y0,0),P(x1,y0,0),P(x1,y1,0),P(x0,y1,0)],'url(#lfdeck'+uid+')',"rgba(60,36,16,.55)",1);
    for(var k=1;k<10;k++){var yy=y0+k*(y1-y0)/10;s+='<path d="M'+lfPt(P(x0,yy,0))+' L'+lfPt(P(x1,yy,0))+'" stroke="rgba(70,40,18,.35)" stroke-width="1"/>'}
    var rh=40,gq=function(xa,xb,ya,yb){return [P(xa,ya,0),P(xb,yb,0),P(xb,yb,rh),P(xa,ya,rh)]};
    s+=lfPoly(gq(x0,x1,y0,y0),"rgba(190,225,245,.22)","rgba(220,235,245,.7)",1)+lfPoly([P(x0,y0,rh),P(x1,y0,rh),P(x1,y0,rh+3),P(x0,y0,rh+3)],"#2a2f3a","none");
    for(var pp=0;pp<=4;pp++){var px=x0+pp*(x1-x0)/4;s+='<path d="M'+lfPt(P(px,y0,0))+' L'+lfPt(P(px,y0,rh+3))+'" stroke="#2a2f3a" stroke-width="2.4"/>'}
    s+=lfPotPlant(-1.0,y0+.4,1.0,"b")+lfPotPlant(.1,y0+.4,.9,"a");
    if(p.deco){
      s+=lfPoly([P(.1,-2.5,0),P(2.9,-2.5,0),P(2.9,-.3,0),P(.1,-.3,0)],"#e9dfcb","rgba(80,60,40,.4)",1)+lfPoly([P(.3,-2.3,0),P(2.7,-2.3,0),P(2.7,-.5,0),P(.3,-.5,0)],"none","#3f7f86",2);
      for(var r=0;r<5;r++){var ry=-2.1+r*.34;s+=lfPoly([P(.5,ry,0),P(2.5,ry,0),P(2.5,ry+.14,0),P(.5,ry+.14,0)],r%2?"rgba(201,122,82,.55)":"rgba(63,127,134,.45)","none")}
      [[2.9,-.5],[.7,-.6]].forEach(function(l){var b=P(l[0],l[1],0);s+='<ellipse cx="'+b[0]+'" cy="'+(b[1]+1)+'" rx="7" ry="3" fill="rgba(20,16,10,.25)"/><rect x="'+(b[0]-5)+'" y="'+(b[1]-16)+'" width="10" height="15" rx="2" fill="#3a3a44" stroke="#1c1c24" stroke-width=".8"/><rect x="'+(b[0]-3.6)+'" y="'+(b[1]-14)+'" width="7.2" height="11" rx="1.4" fill="'+(dk>.25?"#ffd98a":"#f5e7b8")+'"/>'+(dk>.2?'<circle cx="'+b[0]+'" cy="'+(b[1]-9)+'" r="16" fill="#ffd27a" opacity=".22"/>':'')});
      s+=lfPotPlant(3.3,-1.7,1.1,"a")+lfPotPlant(-.5,-2.9,.9,"b");
      var a=P(x0,y0,rh+22),b2=P(x1,y0,rh+22),mid=[(a[0]+b2[0])/2,(a[1]+b2[1])/2+14];
      s+='<path d="M'+a[0]+' '+a[1]+' Q'+mid[0]+' '+mid[1]+' '+b2[0]+' '+b2[1]+'" fill="none" stroke="#2a2430" stroke-width="1.1"/>';
      for(var i=0;i<=8;i++){var t=i/8,bx=(1-t)*(1-t)*a[0]+2*t*(1-t)*mid[0]+t*t*b2[0],by=(1-t)*(1-t)*a[1]+2*t*(1-t)*mid[1]+t*t*b2[1];
        s+='<circle cx="'+bx+'" cy="'+by+'" r="'+(dk>.2?11:6)+'" fill="#ffd98a" opacity="'+(dk>.2?.28:.0)+'"/><circle cx="'+bx+'" cy="'+(by+1.5)+'" r="2.6" fill="#ffe7a8" stroke="rgba(120,70,10,.5)" stroke-width=".5"/>'}}
    if(p.swing){
      var sx=-.4,sy=-1.0,base=P(sx-1.0,sy,0),top=P(sx,sy,100),pole=P(sx-1.0,sy,84);
      s+='<ellipse cx="'+base[0]+'" cy="'+(base[1]+1)+'" rx="14" ry="5" fill="#2e3340" stroke="#1c1f28" stroke-width=".8"/><path d="M'+base[0]+' '+base[1]+' L'+pole[0]+' '+pole[1]+' Q'+P(sx-.95,sy,106)[0]+' '+P(sx-.95,sy,106)[1]+' '+P(sx-.5,sy,106)[0]+' '+P(sx-.5,sy,106)[1]+' L'+top[0]+' '+top[1]+'" fill="none" stroke="#3a4050" stroke-width="3.6" stroke-linecap="round"/><path d="M'+base[0]+' '+base[1]+' L'+pole[0]+' '+pole[1]+'" stroke="rgba(255,255,255,.25)" stroke-width="1" fill="none"/>';
      s+=lfRattanEgg(sx,sy,50,1.15)}
    s+='</g>';
  }
  if(p.deck)s+='<g id="lfpcg'+uid+'"></g>';
  if(dk>.05)s+='<rect x="-1400" y="-1400" width="2800" height="2800" fill="rgba(12,16,44,'+(dk*.32).toFixed(2)+')"/>';
  s+='</g>';
  return s}
/* ---- LED strips + grass panels ---- */
function lfLedGrass(C,uid,annex){
  var H=LF.H,z=H-8,s="",W=LF.W,D=LF.D,c0="#3ee6d0",c1="#7f8cff",c2="#b57bff";
  var a=lfP(0,0,0)[0],bx=lfP(W,0,0)[0],lx=lfP(0,D,0)[0];
  s+='<linearGradient id="lfl'+uid+'r" gradientUnits="userSpaceOnUse" x1="'+a+'" x2="'+bx+'" y1="0" y2="0"><stop offset="0" stop-color="'+c2+'"/><stop offset=".5" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c0+'"/></linearGradient>'
   +'<linearGradient id="lfl'+uid+'l" gradientUnits="userSpaceOnUse" x1="'+a+'" x2="'+lx+'" y1="0" y2="0"><stop offset="0" stop-color="'+c2+'"/><stop offset=".5" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c0+'"/></linearGradient>'
   +'<linearGradient id="lflg'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fa0ff" stop-opacity=".42"/><stop offset="1" stop-color="#8fa0ff" stop-opacity="0"/></linearGradient>';
  var rQ=function(x0,x1,za,zb){return lfWallQ(x0,x1,za,zb)},lQ=function(y0,y1,za,zb){return [lfP(0,y0,za),lfP(0,y1,za),lfP(0,y1,zb),lfP(0,y0,zb)]};
  s+=lfPoly(rQ(.1,W,z-44,z),'url(#lflg'+uid+')',"none")+lfPoly(rQ(.1,W,z,z+3.4),'url(#lfl'+uid+'r)',"none");
  var segs=annex?[[3.75,D]]:[[0,D]];
  segs.forEach(function(g){s+=lfPoly(lQ(g[0],g[1],z-44,z),'url(#lflg'+uid+')',"none")+lfPoly(lQ(g[0],g[1],z,z+3.4),'url(#lfl'+uid+'l)',"none")});
  var y0=3.75,y1=5.45,zt=112,zb=58,wp=(y1-y0)*LF.U,hp=zt-zb,g="";
  g+='<rect x="-5" y="-5" width="'+(wp+10)+'" height="'+(hp+10)+'" rx="6" fill="#9dffc0" opacity=".16"/><rect x="-2.5" y="-2.5" width="'+(wp+5)+'" height="'+(hp+5)+'" rx="5" fill="#9dffc0" opacity=".2"/>';
  g+='<rect x="0" y="0" width="'+wp+'" height="'+hp+'" rx="4" fill="#1d2d22" stroke="#d2b88e" stroke-width="2.2"/>';
  var gs=["#2f6e36","#3f8a3f","#4f9a45","#5aa84a","#79c75e","#9be07a"],n=0;
  g+='<rect x="3" y="3" width="'+(wp-6)+'" height="'+(hp-6)+'" rx="3" fill="#2b5a2d"/>';
  for(var r=0;r<13;r++){var by=hp-8-r*((hp-16)/12);for(var cx=2+(r%2)*2.5;cx<wp-2;cx+=5){var hh=7+((n*5)%6);n++;var c=gs[Math.min(5,Math.floor(r/3)+((n*3)%3)-0)%6];
    g+='<path d="M'+cx+' '+(by+hh*.4)+' Q'+(cx-1.5)+' '+(by-hh*.3)+' '+(cx-2+(n%3))+' '+(by-hh)+' Q'+(cx+1.4)+' '+(by-hh*.3)+' '+(cx+2.6)+' '+(by+hh*.4)+'z" fill="'+c+'"/>'}}
  g+='<rect x="1" y="1" width="'+(wp-2)+'" height="3" rx="1.5" fill="rgba(255,255,255,.16)"/>';
  g+='<rect x="0" y="'+(hp-6)+'" width="'+wp+'" height="6" rx="3" fill="rgba(0,0,0,.25)"/>';
  s+=lfFaceX(0,y0,zt,g);
  C.walls.push('<g pointer-events="none">'+s+'</g>');
  lfLight(C,4,.4,H-18,"#9aa6ff",3.6,.45);lfLight(C,.4,5.0,92,"#8dffb0",2.2,.32)}

LFROOM.bedroom=function(C){
  var H=function(k){return C.has(k)},uid=7;
  lfDoorAt(C,6.4);
  var w3=H("bd_win3"),w2=H("bd_win2");
  if(w3)C.patio={deck:H("bd_patio"),swing:H("bd_swing"),deco:H("bd_pdeco")};
  if(w3)lfWinFtc(C,uid);
  else if(w2)lfWinPic(C,1.5,3.7,50,114,uid);
  else lfSprWin(C,"w_win1",1.7,.05,.1,.05,{flip:1,H:76,dy:-26});
  var AN=H("bd_ward2");
  if(AN){C.annex={lair:H("bd_lair"),shoe:H("bd_cl_shoe"),isle:H("bd_cl_isle"),wall:H("bd_lr_wall"),arm:H("bd_lr_arm"),holo:H("bd_lr_holo")};C.walls.push(lfAnnexFrame(C));lfLight(C,-1.2,1.8,86,C.annex.lair?"#9d7cff":"#ffd9a0",2.6,.5)}
  lfWander(C,[[2.6,2.4,-1],[4.2,4.4,1],[5.2,3.4,-1],[4.4,6.6,1],[6.6,4.4,-1],[2.2,2.0,1]]);
  if(H("bd_rug"))lfRugBd(C,1.7,3.3,4.4,4.0);
  var bk=H("bd_bed2")?"bd_bed2":H("bd_bed1")?"bd_bed1":"bd_bed0";
  lfSpr(C,bk,.1,4.0,3.3,2.7,{h:14,flip:bk==="bd_bed2"?1:0});
  C.s("look",3.0,6.4,-1,"look",[4,9]);
  if(H("bd_nstand")){lfSpr(C,"bd_nstand",.15,6.95,.9,.9,{h:12,H:34});lfLight(C,.6,7.3,34,"#ffc27a",1.7,.5)}
  if(H("bd_plant"))lfSpr(C,"bd_plant",6.9,6.8,.8,.8,{h:40,H:66});
  var wk=H("bd_ward2")?"bd_ward2":H("bd_ward1")?"bd_ward1":"bd_ward0",wh=wk==="bd_ward0"?92:wk==="bd_ward1"?98:104;
  if(!AN)lfSpr(C,wk,.1,.7,1.2,2.2,{h:70,H:wh});
  if(H("bd_mirror")){lfSpr(C,"bd_mirror",.2,.05,1.0,.4,{h:70,H:92,flip:1});C.s("art",1.1,1.2,1,"look",[6,11],{tag:"mirror",fxwall:1})}
  var dk=H("bd_desk1")?"bd_desk1":"bd_desk0";
  lfSpr(C,dk,4.0,.05,2.1,1.1,{h:30,dk:.2});
  if(H("bd_pc2"))lfSpr(C,"bd_pc2o",4.0,.05,2.1,1.1,{h:2,flip:1,H:55.5,dy:-32.3,nosh:1,dk:-.2});
  else if(H("bd_pc1")){lfSpr(C,"bd_pc1",4.55,.1,1.0,.7,{h:16,flip:1,H:54,dy:-30,dk:-2});lfLight(C,5.15,1.0,44,"#58d6ff",1.9,.55)}
  if(H("bd_pc2"))lfLight(C,5.15,1.0,52,"#58d6ff",2.1,.6);
  var ck=H("bd_chair2")?"bd_chair2":H("bd_chair1")?"bd_chair1":H("bd_chair0")?"bd_chair0":null;
  if(ck){lfSpr(C,ck,5.0,2.0,.9,.9,{h:30,H:78,flip:1,dk:-3});C.s("sit",5.55,2.0,1,"type",[10,25],{dk:2,tag:"pc",lift:1})}
  else C.s("work",5.2,2.1,-1,"work",[10,25]);
  if(H("bd_shelf"))lfSpr(C,"bd_shelf",6.4,.05,1.0,.55,{h:60,flip:1,H:76});
  if(H("bd_art1"))lfSpr(C,"w_art1",5.3,.05,.1,.05,{h:1,flip:1,H:40,dy:-72,nosh:1});
  if(H("bd_art2")){lfSpr(C,"w_prs",.05,5.2,.1,.1,{h:1,H:36,dy:-76,nosh:1})}
  var gl=H("bd_lights");
  if(H("bd_art3"))lfSpr(C,"w_art3",.05,gl?5.9:4.6,.1,.1,{h:1,H:52,dy:-50,nosh:1});
  if(H("bd_fshelf"))lfSpr(C,"w_fshelf",6.5,.05,.1,.05,{h:1,flip:1,H:34,dy:-80,nosh:1});
  if(H("bd_clock"))lfSpr(C,"w_clock",.05,7.5,.1,.1,{h:1,H:24,dy:-90,nosh:1});
  if(gl)lfLedGrass(C,uid,!!AN);
  if(H("bd_neon")){lfSpr(C,"w_neon",.05,6.8,.1,.1,{h:1,H:54,dy:-48,nosh:1});lfLight(C,.3,6.5,62,"#7aa8ff",1.6,.5)}
};

window.LFSP4={"bd4_bed2":{"w":300,"h":263,"d":__B[0],"n":__B[1],"bx":0.492,"bl":0.01,"br":0.99},"bd4_bed1":{"w":315,"h":245,"d":__B[2],"n":__B[3],"bx":0.513,"bl":0.029,"br":0.86},"bd4_bed0":{"w":263,"h":234,"d":__B[4],"n":__B[5],"bx":0.395,"bl":0.011,"br":0.84},"bd4_ward2":{"w":167,"h":265,"d":__B[6],"n":__B[7],"bx":0.743,"bl":0.018,"br":0.982},"bd4_ward1":{"w":150,"h":258,"d":__B[8],"n":__B[9],"bx":0.72,"bl":0.02,"br":0.98},"bd4_nstand":{"w":103,"h":165,"d":__B[10],"n":__B[11],"bx":0.553,"bl":0.029,"br":0.971},"bd4_plant":{"w":127,"h":220,"d":__B[12],"n":__B[13],"bx":0.504,"bl":0.299,"br":0.709},"bd4_mirror":{"w":95,"h":219,"d":__B[14],"n":__B[15],"bx":0.568,"bl":0.032,"br":0.968},"bd4_rug":{"w":271,"h":140,"d":__B[16],"n":__B[17],"bx":0.498,"bl":0.052,"br":0.948},"bd4_desk1":{"w":254,"h":280,"d":__B[18],"n":__B[19],"bx":0.661,"bl":0.039,"br":0.965},"bd4_desk0":{"w":268,"h":259,"d":__B[20],"n":__B[21],"bx":0.334,"bl":0.034,"br":0.362},"bd4_pc1":{"w":313,"h":221,"d":__B[22],"n":__B[23],"bx":0.348,"bl":0.01,"br":0.754},"bd4_chair1":{"w":134,"h":254,"d":__B[24],"n":__B[25],"bx":0.496,"bl":0.03,"br":0.978},"bd4_pc2":{"w":319,"h":232,"d":__B[26],"n":__B[27],"bx":0.334,"bl":0.009,"br":0.759},"bd4_chair0":{"w":128,"h":222,"d":__B[28],"n":__B[29],"bx":0.625,"bl":0.094,"br":0.969},"bd4_shelf":{"w":160,"h":273,"d":__B[30],"n":__B[31],"bx":0.231,"bl":0.019,"br":0.981},"bd4_chair2":{"w":141,"h":257,"d":__B[32],"n":__B[33],"bx":0.443,"bl":0.078,"br":0.943},"bd4_fshelf":{"w":224,"h":161,"d":__B[34],"n":__B[35],"bx":0.748,"bl":0.326,"br":0.987},"bd4_art2":{"w":316,"h":240,"d":__B[36],"n":__B[37],"bx":0.049,"bl":0.009,"br":0.737},"bd4_art3":{"w":237,"h":274,"d":__B[38],"n":__B[39],"bx":0.116,"bl":0.013,"br":0.92},"bd4_art1":{"w":141,"h":242,"d":__B[40],"n":__B[41],"bx":0.099,"bl":0.021,"br":0.979},"bd4_neon":{"w":130,"h":241,"d":__B[42],"n":__B[43],"bx":0.146,"bl":0.023,"br":0.977},"bd4_clock":{"w":174,"h":194,"d":__B[44],"n":__B[45],"bx":0.422,"bl":0.023,"br":0.897},"bd4_led":{"w":271,"h":114,"d":__B[46],"n":__B[47],"bx":0.05,"bl":0.011,"br":0.38},"bd4_win3":{"w":203,"h":303,"d":__B[48],"n":__B[49],"bx":0.069,"bl":0.015,"br":0.985},"bd4_grass":{"w":188,"h":276,"d":__B[50],"n":__B[51],"bx":0.077,"bl":0.016,"br":0.984},"bd4_swing":{"w":158,"h":267,"d":__B[52],"n":__B[53],"bx":0.421,"bl":0.019,"br":0.981},"bd4_gch_0":{"w":140,"h":266,"d":__B[54],"n":__B[55],"bx":0.443,"bl":0.079,"br":0.943},"bd4_gch_1":{"w":141,"h":256,"d":__B[56],"n":__B[57],"bx":0.443,"bl":0.078,"br":0.943},"bd4_gch_2":{"w":130,"h":267,"d":__B[58],"n":__B[59],"bx":0.631,"bl":0.023,"br":0.977},"bd4_gch_3":{"w":140,"h":231,"d":__B[60],"n":__B[61],"bx":0.471,"bl":0.064,"br":0.95},"bd4_gch_4":{"w":139,"h":232,"d":__B[62],"n":__B[63],"bx":0.496,"bl":0.043,"br":0.942},"bd4_ch0_0":{"w":128,"h":222,"d":__B[64],"n":__B[65],"bx":0.625,"bl":0.094,"br":0.969},"bd4_ch0_1":{"w":123,"h":211,"d":__B[66],"n":__B[67],"bx":0.553,"bl":0.024,"br":0.976},"bd4_ch0_2":{"w":128,"h":194,"d":__B[68],"n":__B[69],"bx":0.348,"bl":0.039,"br":0.93},"bd4_ch1_0":{"w":135,"h":255,"d":__B[70],"n":__B[71],"bx":0.493,"bl":0.022,"br":0.97},"bd4_ch1_1":{"w":136,"h":254,"d":__B[72],"n":__B[73],"bx":0.621,"bl":0.066,"br":0.978},"bd4_ch1_2":{"w":135,"h":235,"d":__B[74],"n":__B[75],"bx":0.496,"bl":0.03,"br":0.978},"bd4_ch2_0":{"w":141,"h":256,"d":__B[76],"n":__B[77],"bx":0.443,"bl":0.078,"br":0.943},"bd4_ch2_1":{"w":133,"h":246,"d":__B[78],"n":__B[79],"bx":0.605,"bl":0.075,"br":0.977},"bd4_ch2_2":{"w":141,"h":234,"d":__B[80],"n":__B[81],"bx":0.515,"bl":0.05,"br":0.929},"m_idle":{"w":105,"h":226,"d":__B[82],"n":"","bx":0.41,"bl":0.152,"br":0.876,"mk1":__B[83],"mk2":__B[84]},"m_w1":{"w":105,"h":226,"d":__B[85],"n":"","bx":0.619,"bl":0.095,"br":0.943,"mk1":__B[86],"mk2":__B[87]},"m_w2":{"w":106,"h":226,"d":__B[88],"n":"","bx":0.618,"bl":0.038,"br":0.943,"mk1":__B[89],"mk2":__B[90]},"m_w3":{"w":105,"h":220,"d":__B[91],"n":"","bx":0.587,"bl":0.067,"br":0.943,"mk1":__B[92],"mk2":__B[93]},"m_t1":{"w":162,"h":223,"d":__B[94],"n":"","bx":0.682,"bl":0.056,"br":0.944},"m_t2":{"w":193,"h":224,"d":__B[95],"n":"","bx":0.723,"bl":0.047,"br":0.953},"m_t3":{"w":144,"h":225,"d":__B[96],"n":"","bx":0.66,"bl":0.208,"br":0.931},"m_sleep":{"w":187,"h":176,"d":__B[97],"n":"","bx":0.594,"bl":0.219,"br":0.989,"mk1":__B[98],"mk2":__B[99]},"m_stretch":{"w":119,"h":228,"d":__B[100],"n":"","bx":0.622,"bl":0.227,"br":0.739,"mk1":__B[101],"mk2":__B[102]},"cs_0":{"w":195,"h":377,"d":__B[103],"n":__B[104],"bx":0.456,"bl":0.005,"br":0.959},"cs_1":{"w":230,"h":366,"d":__B[105],"n":__B[106],"bx":0.488,"bl":0.043,"br":0.865},"cs_2":{"w":199,"h":380,"d":__B[107],"n":__B[108],"bx":0.47,"bl":0.02,"br":0.995},"cs_3":{"w":213,"h":385,"d":__B[109],"n":__B[110],"bx":0.57,"bl":0.047,"br":0.967},"cs_4":{"w":217,"h":405,"d":__B[111],"n":__B[112],"bx":0.424,"bl":0.037,"br":0.935},"bd4_slp":{"w":300,"h":263,"d":__B[113],"n":__B[114],"bx":0.52,"bl":0.0,"br":0.963},"cl_in":{"w":555,"h":473,"d":__B[115],"n":__B[116],"bx":0.499,"bl":0.0,"br":1.0},"shl_wall":{"w":1200,"h":805,"d":__B[117],"n":"","bx":0.5,"bl":0.0,"br":1.0},"shl_floor":{"w":1024,"h":1024,"d":__B[118],"n":"","bx":0.5,"bl":0.0,"br":1.0},"lair_in":{"w":821,"h":645,"d":__B[119],"n":"","bx":0.506,"bl":0.018,"br":0.981},"lair_u_suit":{"w":821,"h":645,"d":__B[120],"n":"","bx":0.964,"bl":0.711,"br":0.982},"lair_u_arm":{"w":821,"h":645,"d":__B[121],"n":"","bx":0.702,"bl":0.59,"br":0.713},"lair_u_trophy":{"w":821,"h":645,"d":__B[122],"n":"","bx":0.58,"bl":0.495,"br":0.591},"lair_u_rack":{"w":821,"h":645,"d":__B[123],"n":"","bx":0.021,"bl":0.01,"br":0.119},"lair_u_desk":{"w":821,"h":645,"d":__B[124],"n":"","bx":0.144,"bl":0.117,"br":0.43},"lair_u_holo":{"w":821,"h":645,"d":__B[125],"n":"","bx":0.511,"bl":0.44,"br":0.585},"lair_cs4":{"w":217,"h":405,"d":__B[126],"n":"","bx":0.424,"bl":0.037,"br":0.935},"f_idle":{"w":114,"h":226,"d":__B[127],"n":"","bx":0.529,"bl":0.193,"br":0.86,"ref":[135,135,34,190,215],"mk1":__B[128],"mk2":__B[129]},"f_w1":{"w":114,"h":227,"d":__B[130],"n":"","bx":0.64,"bl":0.149,"br":0.947,"ref":[135,135,34,190,215],"mk1":__B[131],"mk2":__B[132]},"f_w2":{"w":114,"h":227,"d":__B[133],"n":"","bx":0.662,"bl":0.132,"br":0.921,"ref":[135,135,34,190,215],"mk1":__B[134],"mk2":__B[135]},"f_w3":{"w":114,"h":227,"d":__B[136],"n":"","bx":0.614,"bl":0.14,"br":0.939,"ref":[135,135,34,190,215],"mk1":__B[137],"mk2":__B[138]},"f_stretch":{"w":120,"h":227,"d":__B[139],"n":"","bx":0.582,"bl":0.208,"br":0.725,"ref":[135,135,34,190,215],"mk1":__B[140],"mk2":__B[141]},"m_cs_0":{"w":195,"h":377,"d":__B[142],"n":"","bx":0.459,"bl":0.005,"br":0.959,"mk1":__B[143],"mk2":__B[144]},"m_cs_1":{"w":230,"h":366,"d":__B[145],"n":"","bx":0.47,"bl":0.048,"br":0.857,"mk1":__B[146],"mk2":__B[147]},"m_cs_2":{"w":199,"h":380,"d":__B[148],"n":"","bx":0.47,"bl":0.02,"br":1.0,"mk1":__B[149],"mk2":__B[150]},"m_cs_3":{"w":213,"h":385,"d":__B[151],"n":"","bx":0.568,"bl":0.047,"br":0.967,"mk1":__B[152],"mk2":__B[153]},"m_cs_4":{"w":217,"h":405,"d":__B[154],"n":"","bx":0.422,"bl":0.037,"br":0.94,"mk1":__B[155],"mk2":__B[156]},"f_cs_0":{"w":195,"h":377,"d":__B[157],"n":"","bx":0.503,"bl":0.0,"br":0.959,"ref":[135,135,34,190,215],"mk1":__B[158],"mk2":__B[159]},"f_cs_1":{"w":230,"h":366,"d":__B[160],"n":"","bx":0.411,"bl":0.013,"br":0.883,"ref":[135,135,34,190,215],"mk1":__B[161],"mk2":__B[162]},"f_cs_2":{"w":199,"h":380,"d":__B[163],"n":"","bx":0.47,"bl":0.015,"br":1.0,"ref":[135,135,34,190,215],"mk1":__B[164],"mk2":__B[165]},"f_cs_3":{"w":213,"h":385,"d":__B[166],"n":"","bx":0.575,"bl":0.056,"br":0.972,"ref":[135,135,34,190,215],"mk1":__B[167],"mk2":__B[168]},"f_cs_4":{"w":217,"h":405,"d":__B[169],"n":"","bx":0.576,"bl":0.06,"br":0.972,"ref":[135,135,34,190,215],"mk1":__B[170],"mk2":__B[171]},"m_sl2":{"w":300,"h":263,"d":__B[172],"n":"","bx":0.508,"bl":0.01,"br":0.99,"mk1":__B[173],"mk2":__B[174]},"f_sl2":{"w":300,"h":263,"d":__B[172],"n":"","bx":0.508,"bl":0.01,"br":0.99,"ref":[135,135,34,190,215],"mk1":__B[173],"mk2":__B[174]},"m_sl1":{"w":315,"h":245,"d":__B[175],"n":"","bx":0.487,"bl":0.14,"br":0.971,"mk1":__B[176],"mk2":__B[177]},"f_sl1":{"w":315,"h":245,"d":__B[175],"n":"","bx":0.487,"bl":0.14,"br":0.971,"ref":[135,135,34,190,215],"mk1":__B[176],"mk2":__B[177]},"m_sl0":{"w":263,"h":234,"d":__B[178],"n":"","bx":0.605,"bl":0.16,"br":0.989,"mk1":__B[179],"mk2":__B[180]},"f_sl0":{"w":263,"h":234,"d":__B[178],"n":"","bx":0.605,"bl":0.16,"br":0.989,"ref":[135,135,34,190,215],"mk1":__B[179],"mk2":__B[180]}};
LFSP4.man_ax={"cs_0": 101.5, "cs_1": 96.8, "cs_2": 92.0, "cs_3": 121.8, "cs_4": 91.5, "lair_cs4": 91.5, "m_cs_0": 101.5, "m_cs_1": 96.8, "m_cs_2": 92.0, "m_cs_3": 121.8, "m_cs_4": 91.5, "f_cs_0": 101.5, "f_cs_1": 96.8, "f_cs_2": 92.0, "f_cs_3": 121.8, "f_cs_4": 91.5};

/* ---- bedroom v4: rendered 3D-style furniture with day/night cross-fade ---- */
function lfSp4Url(k,t){var S=window.LFSP4&&LFSP4[k];if(!S)return null;var f=t==="n"?"nb":"db";if(S[f])return S[f];var v=S[t==="n"?"n":"d"];try{var b=atob(v.split(",")[1]),n=b.length,u=new Uint8Array(n);while(n--)u[n]=b.charCodeAt(n);S[f]=URL.createObjectURL(new Blob([u],{type:"image/webp"}))}catch(e){S[f]=v}return S[f]}
function lfSpr4(C,k,x,y,w,d,o){o=o||{};var S=window.LFSP4&&LFSP4[k];if(!S)return false;
  var a=lfP(x+w,y+d,0),W=(w+d)*LF.sx*(o.sc||1),Hh=W*S.h/S.w;if(o.H){Hh=o.H;W=Hh*S.w/S.h}
  if(typeof LFREC!=="undefined"&&LFREC)lfRecBox(x,y,0,w,d,o.h||24);
  if(o.occ&&typeof LFREC!=="undefined"&&LFREC&&y-o.occ>.3)lfRecBox(x,y-o.occ,0,w,o.occ,o.h||24); /* area hidden behind tall art is off limits too */
  var fx=o.flip?-1:1,L=lfInLS(C),nt=Math.min(1,Math.max(0,L.dark*1.2)),ax=(a[0]+(o.ax||0)).toFixed(1),ay=(a[1]+(o.dy||0)).toFixed(1);
  var bxo=W/2;if(o.fit&&S.bl!=null){var bl=S.bl,br=S.br;if(br-bl<.6){bl=0;br=1}var kf=((w+d)*LF.sx*(o.sc||1))/((br-bl)*S.w);W=S.w*kf;Hh=S.h*kf;bxo=o.flip?br*W-LF.sx*w:LF.sx*w+bl*W}
  var at=' x="'+(-bxo).toFixed(1)+'" y="'+(-Hh).toFixed(1)+'" width="'+W.toFixed(1)+'" height="'+Hh.toFixed(1)+'" preserveAspectRatio="none"';
  var im='<image href="'+lfSp4Url(k,"d")+'"'+at+'/>'+(nt>.02?'<image href="'+lfSp4Url(k,"n")+'"'+at+(nt<.98?' opacity="'+nt.toFixed(2)+'"':'')+'/>':'');
  var LB=(!o.nob&&(o.h||24)>=10)?[x,y,x+w,y+d]:null;
  if(!o.nosh){var cx=(x+w/2),cy=(y+d/2),c=lfP(cx,cy,0),sw=(w+d)*LF.sx*.5,sh=sw*.5,al=.16*(1-nt*.4);
    C._lb=LB;C.add(x+w+y+d-(o.dk||0)-.01,'<g><ellipse cx="'+c[0].toFixed(1)+'" cy="'+c[1].toFixed(1)+'" rx="'+(sw*1.0).toFixed(1)+'" ry="'+(sh*1.0).toFixed(1)+'" fill="rgba(20,14,34,'+(al*.5).toFixed(3)+')"/><ellipse cx="'+c[0].toFixed(1)+'" cy="'+c[1].toFixed(1)+'" rx="'+(sw*.78).toFixed(1)+'" ry="'+(sh*.78).toFixed(1)+'" fill="rgba(20,14,34,'+(al*.7).toFixed(3)+')"/><ellipse cx="'+c[0].toFixed(1)+'" cy="'+c[1].toFixed(1)+'" rx="'+(sw*.55).toFixed(1)+'" ry="'+(sh*.55).toFixed(1)+'" fill="rgba(20,14,34,'+al.toFixed(3)+')"/></g>')}
  C._lb=LB;C.add(x+w+y+d-(o.dk||0),'<g'+(o.id?' id="'+o.id+'"':'')+(o.hid?' style="display:none"':'')+' transform="translate('+ax+','+ay+') scale('+fx+',1)">'+im+'</g>');
  return true}
LFSZ.bedroom=[10,9];LFRS.bedroom=.86;
LFROOM.bedroom=function(C){
  var H=function(k){return C.has(k)},uid=7;C.chu=(window.LFCU=(window.LFCU||0)+1);C.chd={ph:"empty",t0:0,k:"",sl:0,pp:78/266};
  lfDoorAt(C,7.4);
  /* The Patio is its own room. Once it exists the Bedroom has a sliding glass door onto it (the last pane of the glass
     wall, or a door of its own in the wall), and through the glass you see that room as it is furnished. */
  var w3=H("bd_win3"),w2=H("bd_win2"),pr=lfPatioSlot()>=0;
  LFWBR=w3?LFWBR0:LFWDOOR;
  if(w3||pr)C.patio={deck:pr||w3&&H("bd_patio"),swing:H("bd_swing"),deco:H("bd_pdeco"),room:pr};
  if(pr&&C.patio)C.patio.real=lfPatioReal();
  if(w3||pr)lfWinFtc(C,uid);
  if(!w3){if(w2)lfWinPic(C,2.6,4.9,50,114,uid);
  else{lfSprWin(C,"w_win1",3.5,.05,.1,.05,{flip:1,H:76,dy:-26});LFWINS.push(2.7)}}
  var AN=H("bd_ward2")&&!window.LFNOANX;
  if(AN){C.annex={lair:0,lr:H("bd_lair"),shoe:H("bd_cl_shoe"),isle:H("bd_cl_isle"),rack:H("bd_lr_rack"),desk:H("bd_lr_desk"),trophy:H("bd_lr_trophy"),arm:H("bd_lr_arm"),suit:H("bd_lr_suit"),holo:H("bd_lr_holo")};
    if(C.annex.lr)lfSLairItem(C);lfSClosetItem(C)}
  lfWander(C,[[3.2,3.6,-1],[5,5.2,1],[6.4,4,-1],[7.4,6.4,1],[4.6,8,-1],[2.4,6.6,1]]);
  /* QA (every room against references): the round rug floated in the open floor; it now tucks under the foot of the bed */
  if(H("bd_rug"))lfSpr4(C,"bd4_rug",2.3,2.6,2.8,2.8,{h:1,nosh:1,dk:99,sc:1});
  var bk=H("bd_bed2")?"bd4_bed2":H("bd_bed1")?"bd4_bed1":"bd4_bed0";
  var bo={h:14,occ:1.3,flip:1,fit:1,sc:H("bd_bed2")?1:H("bd_bed1")?.86:.88,dy:H("bd_bed2")?4:H("bd_bed1")?7:6};
  lfSpr4(C,bk,.1,1.0,3.3,2.7,Object.assign({id:"lfbed"+C.chu},bo));
  C.chd.slk=bk.slice(-1);lfSpr4(C,bk,.1,1.0,3.3,2.7,Object.assign({id:"lfslp"+C.chu,hid:1,nosh:1,dk:-.02},bo));
  C.s("look",4.8,4.6,-1,"look",[4,9]);
  C.s("bed",3.6,4.6,-1,"lie",[16,30],{tag:"bed",lz:0,slp:1});
  if(AN&&!C.annex.lair){var K=LFCL,Y=C.D;C.s("browse",1.05,Y+.7,-1,"look",[6,11],{tag:"browse"});C.s("browse",2.2,Y+.85,1,"look",[6,11],{tag:"browse"});C.s("browse",3.0,Y+.85,1,"look",[6,11],{tag:"browse"});
    if(C.annex.lr&&C.annex.desk)C.s("sit",-17.2,10.7,-1,"type",[14,30],{tag:"lairpc",lift:1,sz:0,exit:[-14.9,11.0]});
    if(C.annex.lr){C.s("look",-11,12,1,"look",[8,14],{tag:"lair"});C.s("look",-13,14.5,-1,"look",[8,14],{tag:"lair"});C.s("look",-9,14.5,1,"look",[8,14],{tag:"lair"});C.s("look",-14.4,12.8,-1,"look",[6,10],{tag:"lair"});C.s("look",-11.4,9.9,-1,"look",[6,10],{tag:"lair"})}}
  if(C.patio&&C.patio.real){var PR=C.patio.real,dk0=0;PR.spots.forEach(function(q){if(dk0<6&&lfPaIn({pa:[],paR:PR},q[0],q[1])){dk0++;C.s("look",q[0],q[1],q[2],"look",[8,16],{tag:"deck"})}})}
  else if(C.patio&&C.patio.deck){C.s("look",7.7,-.95,1,"look",[8,14],{tag:"deck"});if(C.patio.swing)C.s("sit",3.0,-1.0,1,"sit",[14,30],{tag:"egg",lift:1,exit:[4.6,-.45],sz:QBLoft.data.loft.eggLift});if(!C.patio.swing){C.s("look",4.0,-1.9,-1,"look",[8,14],{tag:"deck"});C.s("look",2.6,-1.6,1,"look",[6,10],{tag:"deck"})}}
  if(H("bd_nstand")){lfSpr4(C,"bd4_nstand",.15,4.3,.9,.8,{h:12,fit:1,flip:1,dk:-1.8});lfLight(C,.6,4.7,34,"#ffc27a",1.7,.5)}
  if(H("bd_plant"))lfSpr4(C,"bd4_plant",9.0,7.9,.8,.8,{h:40,H:84,occ:.9});
  /* The Closet door is in the left wall where the wardrobe stood (Cal, 2026-11-05). The wardrobe upgrade became a
     figurine cabinet hung on the wall over the nightstand, clear of the door. Without its art nothing shows there. */
  if(H("bd_ward1"))lfSpr(C,"bdx_figcab",.02,7.45,.3,1.2,{h:1,H:62,dy:-46,nosh:1,nob:1,dk:-3,flip:1,ctr:1});/* just past the door, over the dog beds */
  if(typeof hasRoom==="function"&&hasRoom("closet"))lfDoorL(C,5.85,7.15,100,"#ffd27a");
  if(false){var _cp=[[.1,5.6,0],[1.3,5.6,0],[1.3,7.8,0],[.1,7.8,0],[.1,5.6,74],[1.3,5.6,74],[1.3,7.8,74],[.1,7.8,74]].map(function(q){return lfP(q[0],q[1],q[2])}),_hx=_cp.slice().sort(function(a,b){return a[0]-b[0]||a[1]-b[1]}),_cr=function(o,a,b){return (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])},_lo=[],_up=[];
    _hx.forEach(function(p){while(_lo.length>1&&_cr(_lo[_lo.length-2],_lo[_lo.length-1],p)<=0)_lo.pop();_lo.push(p)});_hx.slice().reverse().forEach(function(p){while(_up.length>1&&_cr(_up[_up.length-2],_up[_up.length-1],p)<=0)_up.pop();_up.push(p)});
    var _hl=_lo.slice(0,-1).concat(_up.slice(0,-1)),_tp=lfP(.7,6.7,92);
    C.add(40,'<g data-lf="closet:0" class="lfclo" style="cursor:pointer"><polygon points="'+_hl.map(lfPt).join(" ")+'" fill="rgba(255,255,255,0.004)"/></g>')}
  /* on the bare wall between the bed and the desk; at 4.75 the PC tower stood in front of it */
  if(H("bd_mirror")){lfSpr4(C,"bd4_mirror",3.2,.05,.85,.4,{h:70,H:96});C.s("art",3.8,1.3,1,"look",[6,11],{tag:"mirror",fxwall:1})}
  var dk=H("bd_pc2")?"bd4_pc2":H("bd_pc1")?"bd4_pc1":H("bd_desk1")?"bd4_desk1":"bd4_desk0";
  var PCt=H("bd_pc1")||H("bd_pc2");
  var LH=PCt?17:0;
  if(PCt){var _R=LFREC;LFREC=null;var mt="#262a33",lg=function(lx){return lfBox(lx,.15,0,.16,1.5,2.4,mt,{l:"#2f343f",r:"#1a1d24",top:"#3a404d"})+lfBox(lx+.01,.58,2.4,.14,.14,LH-2.4,mt,{l:"#303642",r:"#1a1d24",top:"#3a404d"})};
    C._lb=[5.7,.05,8.2,1.35];C.add(5.7+2.5+.05+1.3-.6,'<g>'+lg(5.95)+lg(7.85)+lfBox(6.05,.62,LH-3.2,1.9,.1,2.6,mt,{l:"#2c313b",r:"#1a1d24",top:"#343a46"})+'</g>');LFREC=_R}
  var LD=QBLoft.data.loft,DK=LD.desks[dk];lfSpr4(C,dk,5.7,.05,2.5,1.3,{h:30,dk:.2,fit:1,flip:DK.flip,dy:-LH});scrPc(C,dk,5.7,.05,2.5,1.3,{h:30,dk:.2,fit:1,flip:DK.flip,dy:-LH});/* each desk's art decides its own mirroring so the screen faces into the room */
  if(H("bd_pc2"))lfLight(C,7.0,1.0,52,"#58d6ff",2.1,.6);else if(H("bd_pc1"))lfLight(C,7.0,1.0,44,"#58d6ff",1.9,.55);
  var ck=H("bd_chair2")?"bd_chair2":H("bd_chair1")?"bd_chair1":H("bd_chair0")?"bd_chair0":null;
  var CX=DK.seatX,CY=LD.seatY;
  /* The seat lines up with this desk's screen, so whoever sits here faces it. */
  if(ck){lfChairDyn(C,ck,CX,CY);C.s("sit",CX,CY,1,"type",[10,25],{dk:2,tag:"pc",lift:1,exit:[CX+.1,CY+1.05]})}
  else C.s("work",CX,CY-.25,1,"work",[10,25],{tag:"deskstand",fxwall:1});
  if(H("bd_shelf"))lfSpr4(C,"bd4_shelf",w3?1.2:8.85,.05,1.1,.55,{h:60,flip:1,fit:1});
  /* above the desk: the mirror fills the wall at x=5. The glass wall leaves no room there, so then the canvas hangs on
     the left wall in front of the Closet door and the figurine shelf in the back corner (both used to vanish). */
  /* Canvas Art and the Figurine Shelf hang on the back wall; the glass wall leaves them no proper place (Cal: no poster
     over the Closet door, no shelf poking out of the glass), so they are no longer sold and show only without the glass. */
  if(H("bd_art1")&&!w3)lfSpr4(C,"bd4_art1",6.75,.05,.1,.05,{h:1,flip:1,H:50,dy:-82,nosh:1});
  if(H("bd_fshelf")&&!w3)lfSpr4(C,"bd4_fshelf",9.0,.05,.1,.05,{h:1,flip:1,H:34,dy:-80,nosh:1});
  /* no RGB strip (Cal: "Don't need that"); bd_lights is the moss panel alone (lfWallArtL) */
  lfWallArtL(C,H);
  if(H("bd_neon"))lfLight(C,.3,4.0,70,"#7aa8ff",1.4,.4);
};
/* A doorway cut into the left wall (x=0) from y=a to y=b, h px tall, with the next room's light beyond it. From the
   room you see into it: the floor running on behind the wall and the back jamb (it faces the front); the front jamb and
   the head face away. */
function lfDoorL(C,a,b,h,glow,onWall){var th=.42,u=C.chu||0,id="lfdl"+u,P=function(x,y,z){return lfPt(lfP(x,y,z))},
  hole=[P(0,a,0),P(0,b,0),P(0,b,h),P(0,a,h)].join(" "),g=lfP(0,(a+b)/2,0),t=lfP(0,(a+b)/2,h);
  /* onWall: for rooms whose walls are drawn as room art (C.walls, after the decals) */
  (onWall?C.walls:C.decals).push('<linearGradient id="'+id+'g" gradientUnits="userSpaceOnUse" x1="'+g[0]+'" y1="'+t[1]+'" x2="'+g[0]+'" y2="'+g[1]+'"><stop offset="0" stop-color="#140f14"/><stop offset=".55" stop-color="#3a2a22"/><stop offset="1" stop-color="'+glow+'" stop-opacity=".85"/></linearGradient>'
    +'<clipPath id="'+id+'"><polygon points="'+hole+'"/></clipPath><g clip-path="url(#'+id+')" pointer-events="none">'
    +'<polygon points="'+hole+'" fill="url(#'+id+'g)"/>'
    +'<polygon points="'+[P(-th,a,0),P(-2.5,a,0),P(-2.5,b+.6,0),P(-th,b+.6,0)].join(" ")+'" fill="'+glow+'" opacity=".35"/>'
    +'<polygon points="'+[P(-th,a,0),P(0,a,0),P(0,a,h),P(-th,a,h)].join(" ")+'" fill="#d9d0c3"/>'
    +'<polygon points="'+[P(-th,a,0),P(0,a,0),P(0,a,h),P(-th,a,h)].join(" ")+'" fill="'+glow+'" opacity=".18"/></g>'
    +'<polyline points="'+[P(.01,a,0),P(.01,a,h),P(.01,b,h),P(.01,b,0)].join(" ")+'" fill="none" stroke="#f1eadf" stroke-width="2.4" stroke-linejoin="miter"/>'
    +'<polyline points="'+[P(.01,a,0),P(.01,a,h),P(.01,b,h),P(.01,b,0)].join(" ")+'" fill="none" stroke="rgba(40,30,30,.45)" stroke-width=".6"/>')}
/* ---- Cal (male chibi sprite) ---- */
var LFCALH=74;
var LFRC={};
var LFANC={idle:{eL:[50,70],eR:[79,70],top:[53,5],eaL:[22,82],hr:[74,13],ch:[56,99],cx:53},str:{eL:[33,66],eR:[66,66],top:[50,10],eaL:[12,76],hr:[70,16],ch:[50,100],cx:50},fidle:{eL:[53,67],eR:[86,66],top:[57,3],eaL:[28,67],hr:[85,13],ch:[57,94],cx:57},fstr:{eL:[38,63],eR:[74,63],top:[60,3],eaL:[24,70],hr:[88,12],ch:[56,98],cx:58}};
function lfHexRGB(h){h=(h||"#000000").replace("#","");if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];return[parseInt(h.substr(0,2),16)||0,parseInt(h.substr(2,2),16)||0,parseInt(h.substr(4,2),16)||0]}
function lfAccDraw(x,k,acc,ac,pad){var A=LFANC[(k.charAt(0)==="f"?"f":"")+(/stretch$/.test(k)?"str":"idle")];if(!A||k==="m_sleep")return;x.save();x.translate(0,pad);x.lineCap="round";x.lineJoin="round";
  var has=function(n){return acc.indexOf(n)>=0},eL=A.eL,eR=A.eR;
  var ring=function(c,r,col,w){x.beginPath();x.arc(c[0],c[1],r,0,7);x.strokeStyle=col;x.lineWidth=w;x.stroke()};
  if(has("scarf")){x.fillStyle=ac||"#b8323a";x.beginPath();x.moveTo(A.ch[0]-24,A.ch[1]-3);x.quadraticCurveTo(A.ch[0],A.ch[1]+10,A.ch[0]+24,A.ch[1]-3);x.lineTo(A.ch[0]+22,A.ch[1]+5);x.quadraticCurveTo(A.ch[0],A.ch[1]+19,A.ch[0]-22,A.ch[1]+5);x.fill();x.fillRect(A.ch[0]-18,A.ch[1]+8,9,18);x.fillStyle="rgba(0,0,0,.18)";x.fillRect(A.ch[0]-18,A.ch[1]+20,9,3)}
  if(has("chain")){x.strokeStyle="#d6dce8";x.lineWidth=1.6;x.beginPath();x.moveTo(A.ch[0]-18,A.ch[1]-2);x.quadraticCurveTo(A.ch[0],A.ch[1]+24,A.ch[0]+18,A.ch[1]-2);x.stroke();x.strokeStyle="rgba(120,130,150,.8)";x.lineWidth=.6;x.stroke()}
  if(has("cross")){var cx=A.ch[0],cy=A.ch[1]+13;x.fillStyle="#e6ebf5";x.fillRect(cx-1.4,cy-4,2.8,10);x.fillRect(cx-4,cy-1.5,8,2.6);x.strokeStyle="rgba(80,90,110,.9)";x.lineWidth=.5;x.strokeRect(cx-1.4,cy-4,2.8,10)}
  if(has("halo")){x.strokeStyle="rgba(255,214,90,.35)";x.lineWidth=7;x.beginPath();x.ellipse(A.cx,A.top[1]-4,27,6.5,0,0,7);x.stroke();x.strokeStyle="#ffd65a";x.lineWidth=3;x.stroke();x.strokeStyle="#fff3b8";x.lineWidth=1;x.stroke()}
  if(has("crown")){var cx=A.cx,y=A.top[1]+8;x.fillStyle="#f2c230";x.beginPath();x.moveTo(cx-26,y+6);x.lineTo(cx-28,y-13);x.lineTo(cx-14,y-4);x.lineTo(cx,y-17);x.lineTo(cx+14,y-4);x.lineTo(cx+28,y-13);x.lineTo(cx+26,y+6);x.closePath();x.fill();x.strokeStyle="#9a6d10";x.lineWidth=1.2;x.stroke();x.fillStyle="#d8302f";x.beginPath();x.arc(cx,y-1,2.4,0,7);x.fill();x.fillStyle="#3b8bff";x.beginPath();x.arc(cx-14,y,1.8,0,7);x.arc(cx+14,y,1.8,0,7);x.fill()}
  if(has("beanie")||has("cap")||has("bucket")){var cx=A.cx,c=ac||(has("beanie")?"#b8323a":has("bucket")?"#6b4a32":"#2c3a5c"),y=A.top[1];x.fillStyle=c;x.strokeStyle="rgba(0,0,0,.45)";x.lineWidth=1.2;x.beginPath();x.moveTo(cx-48,y+36);x.bezierCurveTo(cx-52,y-14,cx+50,y-14,cx+46,y+34);x.quadraticCurveTo(cx,y+24,cx-48,y+36);x.closePath();x.fill();x.stroke();
    if(has("cap")){x.beginPath();x.moveTo(cx-36,y+32);x.quadraticCurveTo(cx-6,y+42,cx+32,y+36);x.quadraticCurveTo(cx+14,y+24,cx-36,y+32);x.fillStyle=c;x.fill();x.stroke()}
    if(has("beanie")){x.fillStyle="rgba(0,0,0,.2)";x.fillRect(cx-47,y+28,92,8);x.beginPath();x.arc(cx,y-3,5,0,7);x.fillStyle="#eef0f5";x.fill()}
    if(has("bucket")){x.beginPath();x.ellipse(cx,y+30,54,10,-.04,0,7);x.fill();x.stroke()}}
  if(has("phones")){x.strokeStyle=ac||"#2b2b35";x.lineWidth=5;x.beginPath();x.moveTo(14,62);x.quadraticCurveTo(A.cx+2,-22+A.top[1],A.cx+46,56);x.stroke();x.strokeStyle="rgba(255,255,255,.2)";x.lineWidth=1.2;x.stroke();
    [[A.cx-40,66,6.5,10],[A.cx+45,58,5.5,10]].forEach(function(e){x.fillStyle="#3a3a48";x.beginPath();x.ellipse(e[0],e[1],e[2],e[3],0,0,7);x.fill();x.strokeStyle="#15151c";x.lineWidth=1.4;x.stroke();x.fillStyle=ac||"#ff3d81";x.beginPath();x.ellipse(e[0]+.5,e[1],e[2]*.45,e[3]*.5,0,0,7);x.fill()})}
  if(has("bow")){var b=A.hr;x.fillStyle="#f7f7fb";x.strokeStyle="rgba(60,60,80,.55)";x.lineWidth=1;[-1,1].forEach(function(d){x.beginPath();x.moveTo(b[0],b[1]);x.lineTo(b[0]+d*13,b[1]-7);x.lineTo(b[0]+d*13,b[1]+7);x.closePath();x.fill();x.stroke()});x.beginPath();x.arc(b[0],b[1],3,0,7);x.fill();x.stroke()}
  if(has("flower")){var f=A.hr;for(var i=0;i<5;i++){x.fillStyle="#e0343a";x.beginPath();x.arc(f[0]+Math.cos(i*1.2566)*4.4,f[1]+Math.sin(i*1.2566)*4.4,3.3,0,7);x.fill();x.strokeStyle="rgba(90,10,20,.5)";x.lineWidth=.6;x.stroke()}x.fillStyle="#ffd65a";x.beginPath();x.arc(f[0],f[1],2.4,0,7);x.fill()}
  if(has("hoops")){ring([A.eaL[0],A.eaL[1]+3],5.2,"#f2c230",1.8);ring([A.eaL[0],A.eaL[1]+3],5.2,"rgba(255,255,255,.35)",.5)}
  if(has("earring")){x.fillStyle="#f2c230";x.beginPath();x.arc(A.eaL[0],A.eaL[1]+1,2.2,0,7);x.fill();x.strokeStyle="#9a6d10";x.lineWidth=.6;x.stroke()}
  if(has("glasses")){[eL,eR].forEach(function(e){ring(e,10.5,"#2a2a33",1.7);x.fillStyle="rgba(190,225,255,.16)";x.beginPath();x.arc(e[0],e[1],10.5,0,7);x.fill()});x.strokeStyle="#2a2a33";x.lineWidth=1.5;x.beginPath();x.moveTo(eL[0]+10,eL[1]-1);x.quadraticCurveTo((eL[0]+eR[0])/2,eL[1]-5,eR[0]-10,eR[1]-1);x.stroke();x.beginPath();x.moveTo(eL[0]-10,eL[1]-1);x.lineTo(eL[0]-17,eL[1]-3);x.stroke()}
  if(has("sunglasses")){x.fillStyle="#14141b";[eL,eR].forEach(function(e){x.beginPath();x.moveTo(e[0]-11.5,e[1]-7);x.lineTo(e[0]+11.5,e[1]-7);x.quadraticCurveTo(e[0]+12,e[1]+10,e[0],e[1]+10);x.quadraticCurveTo(e[0]-12,e[1]+10,e[0]-11.5,e[1]-7);x.fill()});x.strokeStyle="#14141b";x.lineWidth=2;x.beginPath();x.moveTo(eL[0]+10,eL[1]-5);x.lineTo(eR[0]-10,eR[1]-5);x.moveTo(eL[0]-11,eL[1]-5);x.lineTo(eL[0]-18,eL[1]-6);x.stroke();x.fillStyle="rgba(255,255,255,.28)";[eL,eR].forEach(function(e){x.beginPath();x.moveTo(e[0]-8,e[1]-5);x.lineTo(e[0]-2,e[1]-5);x.lineTo(e[0]-6,e[1]+2);x.lineTo(e[0]-9,e[1]+2);x.fill()})}
  x.restore()}
var LFVSTY={tee:"tee",hoodie:"hoodie",jacket:"bomber",bomber:"bomber"};
function lfVarSel(k,look){var V=window.LFVAR;if(!V||!V.frames||!look)return null;var mm=/^([mf])_(idle|w1|w2|w3|stretch)$/.exec(k);if(!mm)return null;
  var sx=mm[1],t=LFVSTY[look.top&&look.top.s]||"hoodie",p=/^(joggers|jeans|shorts)$/.test(look.bottom&&look.bottom.s)?look.bottom.s:"joggers",ct=t+"+"+p;
  if(!V.frames[k+"@"+ct]){ct="hoodie+joggers";if(!V.frames[k+"@"+ct])return null}
  var sh=/^(sneakers|boots|flips)$/.test(look.shoes&&look.shoes.s)?look.shoes.s:"sneakers",ey=/^(sharp|sleepy)$/.test(look.eyeT)?look.eyeT:"",fc=/^(slim|round)$/.test(look.face)?look.face:"",ov=[],q;
  q=(fc&&ey&&V.ov[k+"@face:"+fc+"_"+ey])||(ey&&V.ov[k+"@face:"+ey])||(fc&&V.ov[k+"@face:"+fc]);if(q)ov.push(["face",q]);if((q=V.ov[k+"@shoes:"+sh]))ov.push(["shoes",q]);
  var rf=V.refs[sx][ct]||[100,60];
  return {fr:V.frames[k+"@"+ct],ov:ov,id:"V"+ct+"|"+sh+"|"+ey+"|"+fc,ref:[rf[0],rf[1],34,(ov.length&&ov[ov.length-1][0]==="shoes"&&ov[ov.length-1][1].rf)||rf[2]||190,215]}}
function lfOvApply(kind,ov,dd,mm,D,A,B,w){var x0=ov.x,y0=ov.y,x1=ov.x+ov.w,y1=ov.y+ov.h,o=D.data,a=A.data,b=B.data,dv=dd.data,mv=mm.data;
  for(var y=y0;y<y1;y++)for(var x=x0;x<x1;x++){var p=(y*w+x)*4,wt;
    if(kind==="shoes"){if(mv[p+2]<128)continue;wt=1}else if(kind==="eyes"){wt=mv[p+2]/255;if(wt<.02)continue}else{wt=Math.max(0,Math.min(1,(y1-y)/4))}
    for(var j=0;j<4;j++)o[p+j]=o[p+j]*(1-wt)+dv[p+j]*wt;
    if(kind==="shoes"){a[p]=0;a[p+1]=0;b[p]=mv[p];b[p+1]=mv[p+1]}else{a[p+2]=a[p+2]*(1-wt)+mv[p]*wt;b[p+1]=b[p+1]*(1-wt)+mv[p+1]*wt}}}
var LFGM={h_varsity:{},h_hoodie:{},h_cardi:{},y_baby:{},y_vjkt:{},y_ring:{},h_cargo:{},h_denim:{},h_trous:{},y_flare:{},y_track:{},h_sneak:{pair:1},h_boots:{pair:1},h_high:{pair:1},y_plat:{},y_mary:{pair:1},h_mask:{k:"mouth"},h_shades:{k:"eyes"},y_bfly:{k:"eyes"},y_pend:{k:"neck"}};
function lfBB(a,ch,w,h,y0,y1,t){var x0=w,x1=-1,ya=h,yb=-1,n=0;for(var y=y0;y<y1;y++)for(var x=0;x<w;x++)if(a[(y*w+x)*4+ch]>t){n++;if(x<x0)x0=x;if(x>x1)x1=x;if(y<ya)ya=y;if(y>yb)yb=y}return {x0:x0,x1:x1+1,y0:ya,y1:yb+1,n:n,w:x1+1-x0,h:yb+1-ya}}
function lfGarApply(D,A,B,w,h,gk,els,bi){var T=document.createElement("canvas");T.width=w;T.height=h;var tc=T.getContext("2d",{willReadFrequently:true}),o=D.data;
  gk.forEach(function(g,n){var sl=g[0],key=g[1];if(sl!=="top"&&sl!=="pants"&&sl!=="shoes")return;var M=LFGM[key]||{},arr=sl==="shoes"?B.data:A.data,ch=sl==="top"?0:sl==="pants"?1:0,bb=lfBB(arr,ch,w,h,0,h,90),img=els[bi+n];if(bb.n<25||!img)return;
    var y1=bb.y1;if(sl==="top"&&M.hf)y1=bb.y0+Math.round(bb.h*M.hf);
    tc.clearRect(0,0,w,h);tc.imageSmoothingEnabled=true;tc.imageSmoothingQuality="high";
    if(sl==="shoes"&&!M.pair){var hw=bb.w/2;tc.drawImage(img,bb.x0-1,bb.y0-1,hw+1,bb.h+2);tc.save();tc.translate(bb.x1+1,0);tc.scale(-1,1);tc.drawImage(img,0,bb.y0-1,hw+1,bb.h+2);tc.restore()}
    else tc.drawImage(img,bb.x0-1,bb.y0-1,bb.w+2,(y1-bb.y0)+2);
    var Gd=tc.getImageData(0,0,w,h).data;
    for(var y=bb.y0;y<bb.y1;y++)for(var x=bb.x0;x<bb.x1;x++){var p=(y*w+x)*4;if(arr[p+ch]<7)continue;var ga=Math.min(1,arr[p+ch]/90)*(Gd[p+3]>0?1:0);if(ga<.03)continue;for(var j=0;j<3;j++)o[p+j]=o[p+j]*(1-ga)+Gd[p+j]*ga}});}
function lfGarOver(x0,A,B,w,h,pad,gk,els,bi){x0.imageSmoothingEnabled=true;x0.imageSmoothingQuality="high";
  var hr=lfBB(A.data,2,w,h,0,h,90),fs=lfBB(B.data,1,w,h,0,Math.floor(h*.45),90);
  gk.forEach(function(g,n){var sl=g[0],key=g[1],img=els[bi+n],M=LFGM[key]||{};if(!img)return;var iw=img.naturalWidth,ih=img.naturalHeight;
    if(sl==="hat"&&hr.n>=15){var W=hr.w*1.1,H=W*ih/iw,bot=hr.y0+Math.min(hr.h,hr.w)*.44,cx=(hr.x0+hr.x1)/2;x0.drawImage(img,cx-W/2,bot-H+pad,W,H)}
    else if(sl==="acc"&&fs.n>=40&&fs.w>=9){var k=M.k||"eyes",cx=(fs.x0+fs.x1)/2,W,H,cy;
      if(k==="eyes"){W=fs.w*1.0;H=W*ih/iw;cy=fs.y0+fs.h*.46}else if(k==="mouth"){W=fs.w*.95;H=W*ih/iw;cy=fs.y0+fs.h*.78}else{W=fs.w*.8;H=W*ih/iw;if(H>15){H=15;W=H*iw/ih}cy=fs.y1+H/2-1}
      x0.drawImage(img,cx-W/2,cy-H/2+pad,W,H)}});}
/* returns [url,pad]; cb(url,pad) fires when the recolored image is ready */
function lfCalGet(k,look,cb){var m=window.LFSP4&&LFSP4[k];if(!m)return null;var d=lfSp4Url(k,"d"),V=lfVarSel(k,look);
  var acc=(look&&look.acc||[]).slice();var accs=acc.join("+");
  var gar=look&&look.gar&&window.LFVAR&&LFVAR.gar?look.gar:null,gs=gar?JSON.stringify(gar):"";
  if(!look||(!V&&!m.mk1&&!accs&&!gs))return [d,0];
  var cols=[look.top&&look.top.c,look.bottom&&look.bottom.c,look.hair,look.shoes&&look.shoes.c,look.skin],id=k+"|"+cols.join(",")+"|"+accs+"|"+(look.accC||"")+(V?"|"+V.id:"")+"|G"+gs,pad=/halo|crown|cap|beanie|bucket/.test(accs)?16:(gar&&gar.hat?20:0);var e=LFRC[id];
  if(e){if(e.u){if(cb)cb(e.u,e.pad);return [e.u,e.pad]}if(cb)e.cbs.push(cb);return [d,0]}
  LFRC[id]=e={u:null,pad:pad,cbs:cb?[cb]:[]};
  var im=V?[V.fr.d,V.fr.m1,V.fr.m2]:(m.mk1?[m.d,m.mk1,m.mk2]:[m.d]);if(V)V.ov.forEach(function(o){im.push(o[1].d,o[1].m)});
  var bi=im.length,gk=[];if(gar)["pants","top","shoes","hat","acc"].forEach(function(sl){var q=gar[sl];if(q&&LFVAR.gar[q]){gk.push([sl,q]);im.push(sl==="hat"||sl==="acc"?LFVAR.gar[q][2]:LFVAR.gar[q][3])}});
  var ld=0,els=im.map(function(u){var i=new Image();i.onload=function(){if(++ld<im.length)return;try{
    var w=els[0].naturalWidth,h=els[0].naturalHeight,c0=document.createElement("canvas");c0.width=w;c0.height=h+pad;var x0=c0.getContext("2d",{willReadFrequently:true});
    var rd=function(i,ox,oy){var c=document.createElement("canvas");c.width=w;c.height=h;var x=c.getContext("2d",{willReadFrequently:true});x.drawImage(i,ox||0,oy||0);return x.getImageData(0,0,w,h)};
    var D=rd(els[0]);
    if(V||m.mk1){var A=rd(els[1]),B=rd(els[2]);
      if(V)V.ov.forEach(function(o,n){var q=o[1];lfOvApply(o[0],q,rd(els[3+2*n],q.x,q.y),rd(els[4+2*n],q.x,q.y),D,A,B,w)});
      var o=D.data,a=A.data,b=B.data,C=cols.map(lfHexRGB),
      R=V?V.ref:(m.ref||[125,35,34,190,215]),ch=[[a,0,C[0],R[0],1.6],[a,1,C[1],R[1],1.6],[a,2,C[2],R[2],2.6,[.85,.3,1.0]],[b,0,C[3],R[3],1.5,[.9,.35,1.4]],[b,1,C[4],R[4],1.15,[.8,.5,1.6]]];
      var fz=lfBB(B.data,1,w,h,0,Math.floor(h*.45),90),ex0=fz.x0+fz.w*.12,ex1=fz.x1-fz.w*.12,ey0=fz.y0+fz.h*.3,ey1=fz.y0+fz.h*.74,okz=fz.n>=40;
      for(var p=0;p<o.length;p+=4){var lum=.3*o[p]+.59*o[p+1]+.11*o[p+2],px=(p>>2)%w,py=((p>>2)/w)|0;
        for(var q=0;q<5;q++){var c=ch[q],wt=c[0][p+c[1]]/255;if(q===2){wt=Math.max(0,(wt-.35)/.65);if(okz&&px>=ex0&&px<ex1&&py>=ey0&&py<ey1){var mx=Math.max(o[p],o[p+1],o[p+2]),mn=Math.min(o[p],o[p+1],o[p+2]);if(mx-mn>24||lum>140)continue}}if(wt<.004)continue;var f=Math.min(c[4],Math.max(0,lum/c[3])),g=c[5];if(g){f=f<1?1-(1-f)*g[0]:1+(f-1)*g[1];wt=Math.min(1,wt*g[2])}
          for(var j=0;j<3;j++){var t=Math.min(255,c[2][j]*f);o[p+j]=o[p+j]*(1-wt)+t*wt}}}}
    if(A&&gk.length)lfGarApply(D,A,B,w,h,gk,els,bi);
    var c1=document.createElement("canvas");c1.width=w;c1.height=h;c1.getContext("2d").putImageData(D,0,0);x0.drawImage(c1,0,pad);
    if(A&&gk.length)lfGarOver(x0,A,B,w,h,pad,gk,els,bi);
    lfAccDraw(x0,k,acc,look.accC,pad);e.u=c0.toDataURL("image/png")}catch(x){e.u=d;e.pad=0}
    e.cbs.forEach(function(f){f(e.u,e.pad)});e.cbs=[]};
    i.src=u;return i});
  return [d,0]}
function lfCalUrl(k,look){var r=lfCalGet(k,look);lfCalUrl.pad=r?r[1]:0;return r?r[0]:null}
function lfCalPfx(look){return look&&look.sex==="f"&&window.LFSP4&&LFSP4.f_idle?"f_":"m_"}
/* The player's character comes from the rig. Seated and sleeping poses are drawn by
   the chair and bed, so the character sits between that furniture's layers. */
/* Everyone but you uses every other animation frame, and every fourth in the building view when zoomed out and they
   are a few pixels tall: each distinct frame has to be drawn and encoded once per outfit. */
function lfRigState(a){var r=lfRigState0(a);if(!r||!r.clip)return r;var far=!a.pv&&LFV.s<.4;
  /* zoomed out, nobody breathes or fidgets: at that size it cannot be seen, and every frame change costs a decode */
  if(far&&a.mode!=="walk"&&r.clip!=="stretch")r.f=0;else if(a.role!=="me"){var q=far?4:2;r.f-=r.f%q}return r}
function lfRigState0(a){var ch=a.look&&a.look.rig;if(!ch)return null;
  if(a.mode==="do"&&a.st&&a.st.tag==="pc"&&/^(sit|type|work|work2)$/.test(a.act||""))return {hide:1,ch:ch};
  if(a.mode==="do"&&a.st&&a.st.tag==="lairpc"){var nw=performance.now();return {ch:ch,clip:"type",f:QBLoft.clipFrame("type",nw),seat:"lair"}}
  if(a.mode==="do"&&a.act==="lie")return {hide:1,ch:ch};
  var now=performance.now();
  if(a.mode==="walk"){var cl=a.back?"walkBack":"walk";return {ch:ch,clip:cl,f:QBLoft.walkFrame(a.ph||0,cl)}}
  if(a.mode==="do"&&(a.act==="up"||a.act==="stretch")){if(!a._st0)a._st0=now;var c=QBLoft.clips.stretch;return {ch:ch,clip:"stretch",f:Math.min(c.frames-1,Math.floor((now-a._st0)/1000*c.fps))}}
  a._st0=0;if(a.mode==="do"&&/^(sit|read|eat)$/.test(a.act||"")){var bk=a.st&&a.st.facewall;return {ch:ch,clip:bk?"sitBack":"sit",f:QBLoft.clipFrame(bk?"sitBack":"sit",now)}}
  if(a.mode==="do"&&a.st&&a.st.fxwall){return {ch:ch,clip:"back",f:QBLoft.clipFrame("back",now)}}return {ch:ch,clip:"idle",f:QBLoft.clipFrame("idle",now)}}
function lfRigKey(a){var r=lfRigState(a);return r?(r.hide?"h":r.clip+r.f+(r.seat||"")):""}
function lfCalImg(a,f,img){var r=lfRigState(a);if(!r)return false;if(!a.look.npc)QBLoft.warm(r.ch);img.style.imageRendering="auto";
  if(r.hide){img.setAttribute("href","data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");return true}
  var u=r.seat?QBLoft.seated(r.ch,r.clip,r.f,r.seat):QBLoft.frameOrNear(r.ch,r.clip,r.f);if(!u){a._k="";return true}
  var G=QBLoft.geometry(LFCALH);img.setAttribute("href",u);img.setAttribute("width",G.w.toFixed(1));img.setAttribute("height",G.h.toFixed(1));img.setAttribute("x",G.x.toFixed(1));img.setAttribute("y",G.y.toFixed(1));
  var L=lfInLS(lfC(a));img.style.filter=L.dark>.05?"brightness("+(1-L.dark*.38).toFixed(2)+")":"";return true}

/* ---- gaming chair: empty (faces out) / occupied, with sit -> swivel -> type ---- */
function lfChairDyn(C,chair,ax,ay){var a=lfP(ax,ay,0),u=C.chu,D=QBLoft.data.loft.chairs[chair];if(typeof LFREC!=="undefined"&&LFREC)lfRecBox(ax-.42,ay-.42,0,.84,.84,30);
  var im=function(i){return '<image id="lfbch'+i+'_'+u+'" x="-40" y="-80" width="80" height="80" preserveAspectRatio="none" opacity="0"/>'};var rg=function(i){return '<image id="lfbrg'+i+'_'+u+'" preserveAspectRatio="none" opacity="0" style="image-rendering:auto"/>'};
  C._lb=[ax-.42,ay-.42,ax+.42,ay+.42];C.add(ax+ay+.42,'<g><ellipse cx="'+a[0].toFixed(1)+'" cy="'+a[1].toFixed(1)+'" rx="24" ry="11" fill="rgba(20,14,34,.13)"/><g id="lfbch_'+u+'" transform="translate('+a[0].toFixed(1)+','+(a[1]+7).toFixed(1)+')"><g id="lfbchb_'+u+'">'+rg(0)+im("0d")+im("0n")+im("1d")+im("1n")+rg(1)+'</g></g></g>');
  C.chd.ph="empty";C.chd.k="";C.chd.fresh=1;C.chd.chair=D;C.chd.pp=D.pp;setTimeout(function(){lfChairShow(C,[D.front,1],null)},0)}
function lfChairLayer(C,i,key,op,nt){var S=window.LFSP4&&LFSP4[key],pp=C.chd.pp;
  ["d","n"].forEach(function(t){var e=document.getElementById("lfbch"+i+t+"_"+C.chu);if(!e)return;
    if(!S||op<=.01){e.setAttribute("opacity","0");return}
    var w=S.w*pp,h=S.h*pp,ax=w/2,hu=lfSp4Url(key,t);
    e.setAttribute("href",hu);e.setAttribute("width",w.toFixed(1));e.setAttribute("height",h.toFixed(1));e.setAttribute("x",(-ax).toFixed(1));e.setAttribute("y",(-h).toFixed(1));
    e.setAttribute("opacity",(t==="d"?op*(1-nt):op*nt).toFixed(3))})}
/* Put the rig on a chair layer: 0 sits under the chair art, 1 over it. */
function lfChairRig(C,layer,ch,clip,f,seat){[0,1].forEach(function(i){var e=document.getElementById("lfbrg"+i+"_"+C.chu);if(!e)return;
    if(i!==layer||!ch){e.setAttribute("opacity","0");return}
    var u=QBLoft.frameOrNear(ch,clip,f);if(!u){e.setAttribute("opacity","0");return}
    var G=QBLoft.geometry(LFCALH*seat.scale),L=lfInLS(C);e.setAttribute("href",u);e.setAttribute("width",G.w.toFixed(1));e.setAttribute("height",G.h.toFixed(1));e.setAttribute("x",(G.x+seat.x).toFixed(1));e.setAttribute("y",(G.y+seat.y).toFixed(1));
    e.setAttribute("transform",seat.flip?"scale(-1,1)":"");e.setAttribute("opacity","1");e.style.filter=L.dark>.05?"brightness("+(1-L.dark*.38).toFixed(2)+")":""})}
function lfChairShow(C,A,B){var L=lfInLS(C),nt=Math.min(1,Math.max(0,L.dark*1.2)),H=C.chd;var kk=JSON.stringify([A,B,nt.toFixed(1)]);if(H.k===kk)return;H.k=kk;
  lfChairLayer(C,0,A[0],A[1]==null?1:A[1],nt);lfChairLayer(C,1,B?B[0]:"",B?B[1]:0,nt)}
function lfBedTick(a,C){var b=document.getElementById("lfbed"+C.chu),sl=document.getElementById("lfslp"+C.chu);if(!b||!sl)return;var z=a.mode==="do"&&a.act==="lie"&&a.st&&a.st.tag==="bed";
  var ch=a.look&&a.look.rig;if(ch)QBLoft.warm(ch);var u=z&&ch?QBLoft.sleeper(ch,"bed"+(C.chd.slk||"0")):null;
  sl.style.display=u?"":"none";b.style.display="";C.chd.sl=z;
  if(u){var ims=sl.querySelectorAll("image");for(var i=1;i<ims.length;i++)ims[i].style.display="none";if(ims[0]&&ims[0].getAttribute("href")!==u){ims[0].setAttribute("href",u);ims[0].style.imageRendering="auto"}var Lq=lfInLS(C);if(ims[0])ims[0].style.filter=Lq.dark>.05?"brightness("+(1-Lq.dark*.38).toFixed(2)+")":""}}
function lfChairTick(a){var C=lfC(a);if(!C||!C.chd)return;var H=C.chd;lfBedTick(a,C);if(!H.chair||!document.getElementById("lfbch_"+C.chu))return;var now=performance.now();
  var seated=a.mode==="do"&&a.st&&a.st.tag==="pc"&&/^(sit|type|work|work2)$/.test(a.act||""),ch=a.look&&a.look.rig,D=H.chair,SD=QBLoft.data.loft.seats;
  if(H.fresh){H.fresh=0;if(seated){H.ph="type";H.t0=now;H.k=""}}
  if(seated&&(H.ph==="empty"||H.ph==="out")){H.ph="sit";H.t0=now}
  if(!seated&&(H.ph==="sit"||H.ph==="type")){H.ph="out";H.t0=now}
  var t=now-H.t0;
  if(H.ph==="sit"){if(t>SD.turnMs){H.ph="type";H.t0=now;H.k=""}else{lfChairShow(C,[D.front,1],null);lfChairRig(C,1,ch,"sit",QBLoft.clipFrame("sit",now),D.sit);return}}
  if(H.ph==="type"){lfChairShow(C,[D.back,1],null);lfChairRig(C,0,ch,"type",QBLoft.clipFrame("type",now),D.type);return}
  lfChairRig(C,-1);
  if(H.ph==="out"&&t>SD.turnMs)H.ph="empty";
  lfChairShow(C,[D.front,1],null)}
window.lfChairTick=lfChairTick;

/* ---- character shadow that follows the window light ---- */
function lfCalShadow(a,g,C){
  var L=lfInLS(C),el=g.querySelector("ellipse"),pa=g.querySelector(".lfshd");if(!pa){pa=document.createElementNS("http://www.w3.org/2000/svg","path");pa.setAttribute("class","lfshd");pa.setAttribute("fill","#0d1030");g.insertBefore(pa,g.firstChild)}
  var src=null;if(L.direct>.04&&L.el>0)src={el:L.el,az:L.S.az,k:L.direct};else if(L.moonK>.05)src={el:Math.min(62,Math.max(22,60-L.el*1.6)),az:(L.S.az+180)%360,k:L.moonK*.5};
  var wins=C.wins||[];if(el)el.setAttribute("opacity",a.mode==="do"&&a.st&&/^(pc|bed)$/.test(a.st.tag||"")?0:(src?".5":"1"));
  if(a.x<.1||a.y>C.D||!src||!wins.length||(a.mode==="do"&&a.st&&a.st.tag==="pc")){pa.setAttribute("d","");return}
  var phi=src.az*Math.PI/180,ux=-Math.cos(phi),uy=-Math.sin(phi),hl=Math.hypot(ux,uy)||1;ux/=hl;uy/=hl;
  var yk=Math.min(1,Math.max(0,(uy-.08)/.3));if(yk<=0){pa.setAttribute("d","");return}
  var tanE=Math.max(Math.tan(src.el*Math.PI/180),.06),lit=false;
  wins.forEach(function(x0){var Lz=a.y/uy,xw=a.x-Lz*ux,z=Lz*tanE*LF.U;if(xw>=x0+.17&&xw<=x0+1.62&&z>=30&&z<=80)lit=true});
  var Ls=Math.min(1.4,(62/LF.U)/tanE),r=.3,P=[],i;
  for(i=0;i<12;i++){var t=i/12*6.283;P.push([Math.cos(t)*r,Math.sin(t)*r*1.0]);P.push([Math.cos(t)*r*.8+ux*Ls,Math.sin(t)*r*.8+uy*Ls])}
  var H=lfHull(P.map(function(q){return lfP(q[0],q[1],0)}));
  pa.setAttribute("d","M"+H.map(function(q){return q[0].toFixed(1)+" "+q[1].toFixed(1)}).join("L")+"Z");
  pa.setAttribute("opacity",(lit?.34*Math.min(1,src.k*1.4)*yk:.08).toFixed(2));
  pa.setAttribute("filter","");
}
window.lfCalShadow=lfCalShadow;

/* ---- new-art shell: closet, walls, floor ---- */
/* ---- freestanding walk-in closet room on the open bottom-left edge (x 0..CW, y D..D+CD) ---- */
var LFCL={CW:5,CD:5,dx0:3.2,dx1:4.3,zd:80,T:[277,197],H:99,ly0:9.35,ly1:10.4,lz:74};
var LFLR={X0:-18,Y0:6,LX:12,LY:11.5,T:[410,276],a:.7744,b:.0141,d:.9284};
window.LFLR=LFLR;
window.LFCL=LFCL;
function lfSClosetItem(C){
  var S=LFSP4.cl_in;if(!S)return;var K=LFCL,D=C.D,CW=K.CW,CD=K.CD,L=lfInLS(C),nt=Math.min(1,Math.max(0,L.dark*1.2)),id="lfscl"+C.chu;
  var ax=26*(CW+CD)/524,bx=13*(CW-CD)/524,cx=26*(CW-CD)/258,dx=13*(CW+CD)/258,t=lfP(0,D,0),e=t[0]-(ax*K.T[0]+cx*K.T[1]),f=t[1]-(bx*K.T[0]+dx*K.T[1]);
  var tf=' preserveAspectRatio="none" width="'+S.w+'" height="'+S.h+'" transform="matrix('+[ax,bx,cx,dx,e,f].map(function(v){return v.toFixed(5)}).join(",")+')"';
  var hq=[lfP(K.dx0,D,0),lfP(K.dx1,D,0),lfP(K.dx1,D,K.zd),lfP(K.dx0,D,K.zd)],LR=C.annex&&C.annex.lr,ly0=K.ly0,ly1=K.ly1,lz=K.lz;
  var hl=LR?' M'+[lfP(0,ly0,0),lfP(0,ly1,0),lfP(0,ly1,lz),lfP(0,ly0,lz)].map(lfPt).join(" L")+'Z':'';
  var defs='<clipPath id="'+id+'h"><path clip-rule="evenodd" d="M-1400 -1400H1400V1400H-1400Z M'+hq.map(lfPt).join(" L")+'Z'+hl+'"/></clipPath>'
   +'<radialGradient id="'+id+'r"><stop offset="0" stop-color="#000"/><stop offset=".55" stop-color="#000" stop-opacity=".9"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>'
   +'<mask id="'+id+'m" maskUnits="userSpaceOnUse" x="-1400" y="-1400" width="2800" height="2800"><rect x="-1400" y="-1400" width="2800" height="2800" fill="#fff"/><ellipse id="'+id+'e" cx="0" cy="0" rx="0" ry="0" fill="url(#'+id+'r)"/></mask>';
  var s=defs+'<g mask="url(#'+id+'m)"><g clip-path="url(#'+id+'h)"><image href="'+lfSp4Url("cl_in","d")+'"'+tf+'/>'+(nt>.02?'<image href="'+lfSp4Url("cl_in","n")+'"'+tf+' opacity="'+nt.toFixed(2)+'"/>':'')+'</g></g>';
  /* door frame trim */
  var tt=.12,fz=K.zd+7,fc="#f5eddc",fe="rgba(24,30,58,.45)";
  s+=lfPoly([lfP(K.dx0-tt,D,0),lfP(K.dx0,D,0),lfP(K.dx0,D,fz),lfP(K.dx0-tt,D,fz)],fc,fe,.7)+lfPoly([lfP(K.dx1,D,0),lfP(K.dx1+tt,D,0),lfP(K.dx1+tt,D,fz),lfP(K.dx1,D,fz)],fc,fe,.7)+lfPoly([lfP(K.dx0-tt,D,K.zd),lfP(K.dx1+tt,D,K.zd),lfP(K.dx1+tt,D,fz),lfP(K.dx0-tt,D,fz)],fc,fe,.7);
  if(LR){var lt=.1,lf=lz+6,lc="#232a38",le="rgba(120,230,255,.8)";
    s+=lfPoly([lfP(0,ly0-lt,0),lfP(0,ly0,0),lfP(0,ly0,lf),lfP(0,ly0-lt,lf)],lc,le,.8)+lfPoly([lfP(0,ly1,0),lfP(0,ly1+lt,0),lfP(0,ly1+lt,lf),lfP(0,ly1,lf)],lc,le,.8)+lfPoly([lfP(0,ly0-lt,lz),lfP(0,ly1+lt,lz),lfP(0,ly1+lt,lf),lfP(0,ly0-lt,lf)],lc,le,.8)
     +lfPoly([lfP(0,ly0,lz-1.5),lfP(0,ly1,lz-1.5),lfP(0,ly1,lz),lfP(0,ly0,lz)],"#7be9ff","none",0,' class="lfneonp"')}
  s+='<g id="lfclg'+C.chu+'"></g>';
  C.add(CW+D+CD+.5,s)}
function lfCorrArt(C){
  var x0=-6.8,x1=0,y0=9,y1=10.8,th=11,s="",P=function(x,y,z){return lfP(x,y,z||0)};
  s+=lfPoly([P(x0,y1,0),P(x1,y1,0),P(x1,y1,-th),P(x0,y1,-th)],"#2c3340","rgba(10,14,28,.6)",.8);
  s+=lfPoly([P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)],"#141a26","rgba(10,14,28,.7)",.8);
  for(var tx=x0+.6;tx<x1-.1;tx+=.6)s+=lfPoly([P(tx,y0),P(tx+.04,y0),P(tx+.04,y1),P(tx,y1)],"rgba(90,160,200,.10)","none");
  s+=lfPoly([P(x0,y0+.05),P(x1,y0+.05),P(x1,y0+.14),P(x0,y0+.14)],"#7be9ff","none",0,' class="lfneonp"');
  s+=lfPoly([P(x0,y1-.14),P(x1,y1-.14),P(x1,y1-.05),P(x0,y1-.05)],"#7be9ff","none",0,' class="lfneonp"');
  for(var px=-1.2;px>x0;px-=2.2){s+=lfPoly([P(px,y1-.05,0),P(px+.14,y1-.05,0),P(px+.14,y1-.05,18),P(px,y1-.05,18)],"#232a38","rgba(120,230,255,.7)",.7)+lfPoly([P(px,y1-.05,18),P(px+.14,y1-.05,18),P(px+.14,y1-.05,22),P(px,y1-.05,22)],"#7be9ff","none",0,' class="lfneonp"')}
  return s}
function lfSLairItem(C){
  var S=LFSP4.lair_in;if(!S)return;var R=LFLR,t=lfP(R.X0,R.Y0,0),e=t[0]-R.a*R.T[0],f=t[1]-(R.b*R.T[0]+R.d*R.T[1]),A=C.annex||{};
  var tf=' preserveAspectRatio="none" width="'+S.w+'" height="'+S.h+'" transform="matrix('+[R.a,R.b,0,R.d,e,f].map(function(v){return v.toFixed(5)}).join(",")+')"';
  var im=function(n,extra){return LFSP4[n]?'<image href="'+lfSp4Url(n,"d")+'"'+tf+(extra||"")+'/>':""};
  var s=im("lair_in")+lfCorrArt(C);
  ["rack","desk","trophy","arm","suit"].forEach(function(k){if(A[k])s+=im("lair_u_"+k)});
  if(A.holo)s+='<g id="lfllhu'+C.chu+'">'+im("lair_u_holo")+'</g>';
  s+='<g id="lfllg'+C.chu+'"></g>';
  if(A.holo)s+='<g id="lfllho'+C.chu+'" style="display:none">'+im("lair_u_holo")+'</g>';
  C.add(10,s)}
window.lfSLairItem=lfSLairItem;
window.lfSClosetItem=lfSClosetItem;
function lfAnnexPre4(C,uid){return ""}
window.lfAnnexPre4=lfAnnexPre4;
function lfWalls4(t,st,uid,wx){
  var N=LF.W,M=LF.D,H=LF.H,c=lfWallC(t,st),w=c[0],wn=c[1],s="",th=.42,S=LFSP4.shl_wall,u=lfSp4Url("shl_wall","d"),iw=S.w,ih=S.h;
  s+='<linearGradient id="lfwl'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1640" stop-opacity=".16"/><stop offset=".7" stop-color="#1b1640" stop-opacity=".07"/><stop offset="1" stop-color="#1b1640" stop-opacity=".2"/></linearGradient>';
  s+='<linearGradient id="lfwr'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1b1640" stop-opacity=".16"/></linearGradient>';
  var oL=[lfP(0,0,0),lfP(0,M,0),lfP(0,M,H),lfP(0,0,H)],oR=[lfP(0,0,0),lfP(N,0,0),lfP(N,0,H),lfP(0,0,H)];
  var mL=[(-26*M/iw).toFixed(4),(13*M/iw).toFixed(4),0,(H/ih).toFixed(4),0,-H],mR=[(26*N/iw).toFixed(4),(13*N/iw).toFixed(4),0,(H/ih).toFixed(4),0,-H];
  s+='<clipPath id="lfwcl'+uid+'"><polygon points="'+oL.map(lfPt).join(" ")+'"/></clipPath><clipPath id="lfwcr'+uid+'"><polygon points="'+oR.map(lfPt).join(" ")+'"/></clipPath>';
  s+='<g clip-path="url(#lfwcl'+uid+')"><image href="'+u+'" width="'+iw+'" height="'+ih+'" preserveAspectRatio="none" transform="matrix('+mL.join(",")+')"/>'+lfPoly(oL,'url(#lfwl'+uid+')',"none")+'</g>';
  s+='<g clip-path="url(#lfwcr'+uid+')"><image href="'+u+'" width="'+iw+'" height="'+ih+'" preserveAspectRatio="none" transform="matrix('+mR.join(",")+')"/>'+lfPoly(oR,'url(#lfwr'+uid+')',"none")+'</g>';
  s+=lfPoly(oL,"none","rgba(24,28,56,.35)",1)+lfPoly(oR,"none","rgba(24,28,56,.35)",1);
  /* corner shade */
  s+=lfPoly([lfP(0,0,0),lfP(.5,0,0),lfP(.5,0,H),lfP(0,0,H)],"rgba(20,16,50,.1)","none");
  s+=lfPoly([lfP(-th,-th,H),lfP(-th,M,H),lfP(0,M,H),lfP(0,0,H),lfP(N,0,H),lfP(N,-th,H)],lfSh(w,.4),LFOL,1);
  s+=lfPoly([lfP(-th,M,0),lfP(0,M,0),lfP(0,M,H),lfP(-th,M,H)],lfSh(wn,-.15),LFOL,1);
  s+=lfPoly([lfP(N,-th,0),lfP(N,0,0),lfP(N,0,H),lfP(N,-th,H)],lfSh(wn,-.35),LFOL,1);
  s+=lfPoly([lfP(-th,-th,0),lfP(0,0,0),lfP(0,0,H),lfP(-th,-th,H)],lfSh(w,-.3),"none");
  return s}
window.lfWalls4=lfWalls4;
function lfFloor4(uid){var N=LF.W,M=LF.D,S=LFSP4.shl_floor,u=lfSp4Url("shl_floor","d"),iw=S.w,ih=S.h,s="",fl=[lfP(0,0,0),lfP(N,0,0),lfP(N,M,0),lfP(0,M,0)];
  var m=[(26*N/iw).toFixed(4),(13*N/iw).toFixed(4),(-26*M/ih).toFixed(4),(13*M/ih).toFixed(4),0,0];
  s+='<clipPath id="lffc'+uid+'"><polygon points="'+fl.map(lfPt).join(" ")+'"/></clipPath>';
  s+='<linearGradient id="lffa'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1640" stop-opacity=".34"/><stop offset="1" stop-color="#1b1640" stop-opacity="0"/></linearGradient>';
  s+='<g clip-path="url(#lffc'+uid+')"><image href="'+u+'" width="'+iw+'" height="'+ih+'" preserveAspectRatio="none" transform="matrix('+m.join(",")+')"/>';
  s+=lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,.9,0),lfP(0,.9,0)],'url(#lffa'+uid+')',"none")+lfPoly([lfP(0,0,0),lfP(.9,0,0),lfP(.9,M,0),lfP(0,M,0)],"rgba(27,22,64,.2)","none")+'</g>';
  s+=lfPoly(fl,"none","rgba(20,26,50,.5)",1);
  return s}
window.lfFloor4=lfFloor4;


/* the real time, for the clocks: hand angles and "3:42" */
function lfClockNow(){var d=new Date(),h=d.getHours(),m=d.getMinutes();return {ha:((h%12)*30+m*.5).toFixed(1),ma:(m*6).toFixed(1),t:((h%12)||12)+":"+(m<10?"0":"")+m}}
var LFCKT=0;function lfClockTick(ts){if(ts-LFCKT<5000)return;LFCKT=ts;var c=lfClockNow();
  document.querySelectorAll(".lfclk").forEach(function(e){if(e.textContent!==c.t)e.textContent=c.t});
  document.querySelectorAll(".lfch").forEach(function(e){e.setAttribute("transform","rotate("+c.ha+" 11.4 11.8)")});
  document.querySelectorAll(".lfcm").forEach(function(e){e.setAttribute("transform","rotate("+c.ma+" 11.4 11.8)")})}
/* ---- wall art: flat pieces drawn straight onto the left-wall plane (flush, no baked perspective) ---- */
function lfWallArtL(C,H){var U=LF.U,s="",R=function(sd){var v=sd;return function(){v=(v*1664525+1013904223)%4294967296;return v/4294967296}};
  var put=function(yb,wpx,zt,g){return lfFaceX(0.03,yb,zt,g)};
  /* put(yb,..) hangs a piece from yb back toward the corner. With the painted grass wall (Tier 3 on) the back 3 tiles of
     this wall are grass, so the clock moves onto the paint, high up (Cal: art on the grass "looks weird"). */
  var gw3=false;/* the painted grass is gone from tiers 3 and 4 (Cal: it replaced the Moss Art Panel), so nothing moves for it */
  var fr=function(x,y,w,h,pr,wood,mat){wood=wood||"#c9964f";mat=mat||"#f3e9d6";return '<rect x="'+(x+1.2)+'" y="'+(y+1.4)+'" width="'+w+'" height="'+h+'" fill="rgba(30,20,40,.22)"/><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+wood+'" stroke="#7a5524" stroke-width=".5"/><rect x="'+(x+1.4)+'" y="'+(y+1.4)+'" width="'+(w-2.8)+'" height="'+(h-2.8)+'" fill="'+mat+'"/><g transform="translate('+(x+3.2)+','+(y+3.2)+')">'+pr(w-6.4,h-6.4)+'</g>'};
  if(H("bd_clock")){var g='<circle cx="12" cy="12.8" r="11.2" fill="rgba(30,20,40,.22)"/><circle cx="11.4" cy="11.8" r="11" fill="#27272c"/><circle cx="11.4" cy="11.8" r="9.4" fill="#f5f0e6"/>';
    for(var k=0;k<12;k++){var an=k*Math.PI/6,l=k%3?1.3:2.2;g+='<line x1="'+(11.4+Math.sin(an)*(9-l)).toFixed(2)+'" y1="'+(11.8-Math.cos(an)*(9-l)).toFixed(2)+'" x2="'+(11.4+Math.sin(an)*8.6).toFixed(2)+'" y2="'+(11.8-Math.cos(an)*8.6).toFixed(2)+'" stroke="#2b2b30" stroke-width=".7"/>'}
    var CK=lfClockNow();g+='<line class="lfch" x1="11.4" y1="11.8" x2="11.4" y2="7" stroke="#222" stroke-width="1.1" stroke-linecap="round" transform="rotate('+CK.ha+' 11.4 11.8)"/><line class="lfcm" x1="11.4" y1="11.8" x2="11.4" y2="4.2" stroke="#222" stroke-width=".8" stroke-linecap="round" transform="rotate('+CK.ma+' 11.4 11.8)"/><circle cx="11.4" cy="11.8" r="1" fill="#222"/>';
    /* the Digital Clock (Cal: "reads the current real time accurately", rectangular and sleek) replaces the round one */
    if(H("bd_clock2"))g='<rect x="1" y="1.2" width="24" height="9" rx="1.6" fill="rgba(20,16,30,.28)"/><rect x="0" y="0" width="24" height="9" rx="1.6" fill="#101217" stroke="#2c3140" stroke-width=".5"/><text class="lfclk" x="12" y="6.9" text-anchor="middle" font-family="Menlo,Consolas,monospace" font-size="6.6" font-weight="700" fill="#8ff0ff" style="filter:drop-shadow(0 0 1.2px #39d0ff)">'+CK.t+'</text>';
    /* with the grass wall the round clock hangs on the back wall's short stretch beside the corner */
    s+=H("bd_clock2")?put(6.95,24,113,g):gw3?lfFaceY(.08,.03,92,g):put(1.0,22,96,g)}/* the digital one: over the Closet door, every tier */
  if(H("bd_art2")){var pm=function(c1,c2){return function(w,h){return '<rect width="'+w+'" height="'+h+'" fill="#e9ddc8"/><circle cx="'+w*.5+'" cy="'+h*.42+'" r="'+Math.min(w,h)*.26+'" fill="'+c1+'"/><path d="M0 '+h+' L'+w*.5+' '+h*.55+' L'+w+' '+h+'z" fill="'+c2+'" opacity=".85"/>'}};
    var gg='';gg+=fr(0,0,12,16,pm("#d98c5f","#2d2d33"),"#2a2a2f","#f5efe3");gg+=fr(13.5,2,12.5,10,function(w,h){return '<rect width="'+w+'" height="'+h+'" fill="#ece3d3"/><path d="M.5 '+h*.6+' q'+w*.25+' -4 '+w*.5+' 0 t'+w*.5+' 0" stroke="#3b3b40" fill="none" stroke-width=".8"/>'},"#c9964f");
    gg+=fr(0,18,10,14,function(w,h){return '<rect width="'+w+'" height="'+h+'" fill="#e4dac6"/><path d="M'+w*.5+' '+h+' V2 M'+w*.5+' '+h*.7+' q-3 -2 -3.4 -5 M'+w*.5+' '+h*.5+' q3 -2 3.4 -5" stroke="#3f5a3a" fill="none" stroke-width=".8"/>'},"#2a2a2f","#f5efe3");
    gg+=fr(11.5,14,14.5,18,function(w,h){var o='<rect width="'+w+'" height="'+h+'" fill="#ece4d4"/><circle cx="'+w*.5+'" cy="'+h*.3+'" r="'+w*.2+'" fill="#b2573a"/>';for(var i=0;i<4;i++)o+='<line x1="1" y1="'+(h*.55+i*2.4)+'" x2="'+(w-1)+'" y2="'+(h*.55+i*2.4)+'" stroke="#444" stroke-width=".6"/>';return o},"#c9964f");
    s+=put(4.25,26,100,gg)}/* Cal: clear of the Closet door frame (5.75) */
  if(H("bd_art3")){var tp=[function(w,h){return '<rect width="'+w+'" height="'+h+'" fill="#efe3cf"/><circle cx="'+w*.5+'" cy="'+h*.32+'" r="'+w*.26+'" fill="#d98c5f"/><path d="M0 '+h*.62+' q'+w*.5+' -'+h*.2+' '+w+' 0 V'+h+' H0z" fill="#2f2f35"/>'},
     function(w,h){return '<rect width="'+w+'" height="'+h+'" fill="#e9dfcb"/><path d="M'+w*.5+' '+h+' V'+h*.2+' M'+w*.5+' '+h*.75+' q-'+w*.4+' -3 -'+w*.4+' -'+h*.25+' M'+w*.5+' '+h*.6+' q'+w*.4+' -3 '+w*.4+' -'+h*.25+' M'+w*.5+' '+h*.42+' q-'+w*.3+' -2 -'+w*.3+' -'+h*.18+'" stroke="#3d5a38" fill="none" stroke-width="1"/>'},
     function(w,h){var o='<rect width="'+w+'" height="'+h+'" fill="#efe3cf"/><circle cx="'+w*.5+'" cy="'+h*.3+'" r="'+w*.24+'" fill="#e3a35d"/>';for(var i=0;i<4;i++)o+='<line x1="'+w*.1+'" y1="'+(h*.58+i*2.6)+'" x2="'+w*.9+'" y2="'+(h*.58+i*2.6)+'" stroke="#35353b" stroke-width=".8"/>';return o}],tg='';
    /* one big original anime poster you can read on a phone (Cal, QA's lessons), over the bed; the three small prints
       are kept for when its art is missing */
    var AP=window.LFSPR&&LFSPR.bdx_animep;
    if(AP){var pw=30,ph=Math.round(pw*AP.h/AP.w);s+=put(5.45,pw,108,'<rect x="1.4" y="1.8" width="'+pw+'" height="'+ph+'" fill="rgba(20,16,30,.3)"/><rect x="-1.2" y="-1.2" width="'+(pw+2.4)+'" height="'+(ph+2.4)+'" fill="#16161b"/><image href="'+AP.u+'" width="'+pw+'" height="'+ph+'" preserveAspectRatio="none"/>')}
    else{for(var i=0;i<3;i++)tg+=fr(i*11,0,9.6,21,tp[i]);s+=put(gw3?3.12:1.12,31,gw3?82:80,tg)}}
  if(H("bd_neon")){var nb='<rect x="0" y="0" width="15" height="30" rx="3" fill="#15161c" stroke="#3a3b46" stroke-width=".8"/>',bp='M9 3 L3.5 16 H7.5 L5.6 27.5 L12 12 H8.2 Z';
    nb+='<path d="'+bp+'" fill="none" stroke="#7aa8ff" stroke-width="5" opacity=".28" stroke-linejoin="round"/><path d="'+bp+'" fill="none" stroke="#fff6d8" stroke-width="1.6" stroke-linejoin="round"/>';s+=lfFaceY(.4,.03,100,nb)}/* on the back wall beside the corner, so the left wall is not crowded (Cal: art too close to the Closet door) */
  /* the moss panel, over the bed on every wall tier */
  if(H("bd_lights")){var G=R(7),gw=60,gh=31,gm='<defs><radialGradient id="lfgw'+C.chu+'" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#ffd08a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd08a" stop-opacity="0"/></radialGradient><linearGradient id="lfgp'+C.chu+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".62"/><stop offset=".55" stop-color="#ffcf86" stop-opacity=".12"/><stop offset="1" stop-color="#ffcf86" stop-opacity="0"/></linearGradient></defs>';
    gm+='<ellipse cx="'+gw/2+'" cy="'+(gh/2+3)+'" rx="'+(gw*.78)+'" ry="'+(gh*.95)+'" fill="url(#lfgw'+C.chu+')"/>';
    gm+='<clipPath id="lfgc'+C.chu+'"><rect x="1.6" y="1.6" width="'+(gw-3.2)+'" height="'+(gh-3.2)+'"/></clipPath><rect x="1.6" y="2.2" width="'+gw+'" height="'+gh+'" fill="rgba(30,20,40,.25)"/><rect x="0" y="0" width="'+gw+'" height="'+gh+'" fill="#b8884a" stroke="#6d4b22" stroke-width=".6"/><rect x="1.6" y="1.6" width="'+(gw-3.2)+'" height="'+(gh-3.2)+'" fill="#2f5d27"/>';
    var gs=["#3d7a2c","#4f9234","#69ad3c","#86c34a","#a8d85a","#2a5a26","#5a9d38"];
    gm+='<g clip-path="url(#lfgc'+C.chu+')">';for(var n=0;n<330;n++){var bx=2.4+G()*(gw-4.8),by=2.4+G()*(gh-4.8),r=1.2+G()*2.2;gm+='<circle cx="'+bx.toFixed(1)+'" cy="'+by.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="'+gs[Math.floor(G()*gs.length)]+'" opacity=".92"/>'}gm+='</g>';
    gm+='<rect x="1.6" y="1.6" width="'+(gw-3.2)+'" height="'+(gh-3.2)+'" fill="url(#lfgp'+C.chu+')"/><rect x="1.6" y="1.6" width="'+(gw-3.2)+'" height="'+(gh-3.2)+'" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="1.2"/>';
    gm+='<rect x="'+(gw/2-13)+'" y="-5.4" width="26" height="2.6" rx="1.3" fill="#c9a24e" stroke="#7a5a1c" stroke-width=".4"/><path d="M'+(gw/2-11)+' -2.6 L'+(gw/2+11)+' -2.6 L'+(gw/2+19)+' '+(gh*.7)+' L'+(gw/2-19)+' '+(gh*.7)+'z" fill="#ffd9a0" opacity=".14"/>';
    s+=put(3.15,gw,100,gm)}
  if(window.LFWDBG){for(var q=0;q<=9;q++)s+=put(q,1,60,'<rect width="1" height="60" fill="red"/><text x="2" y="10" font-size="9" fill="red">'+q+'</text>')}
  if(s)C.walls.push('<g pointer-events="none">'+s+'</g>')}

/* ---- LED cove strips + moss wall panel (bd_lights) ---- */
function lfLedWall(C){var L=lfInLS(C),nt=Math.min(1,Math.max(0,L.dark*1.2)),S=window.LFSP4&&LFSP4.bd4_led,s="";
  var z=116,y0=.7,y1=8.7,P=function(y,zz){return lfP(0.06,y,zz)};
  var id="lfledg"+C.chu;
  s+='<linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff9ad5"/><stop offset=".35" stop-color="#b79cff"/><stop offset=".7" stop-color="#7fd6ff"/><stop offset="1" stop-color="#a8ffd0"/></linearGradient>';
  /* cove glow washing the wall below the strip */
  var g=[P(.7,z),P(5.0,z),P(5.0,z-34),P(.7,z-34)];
  s+='<linearGradient id="'+id+'v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9b8ff" stop-opacity="'+(.34+nt*.3).toFixed(2)+'"/><stop offset="1" stop-color="#7fd6ff" stop-opacity="0"/></linearGradient>';
  s+='<polygon points="'+g.map(function(q){return q[0].toFixed(1)+","+q[1].toFixed(1)}).join(" ")+'" fill="url(#'+id+'v)" style="mix-blend-mode:screen"/>';
  /* strip itself */
  var a=P(y0,z+1),b=P(y1,z+1);
  s+='<line x1="'+a[0].toFixed(1)+'" y1="'+a[1].toFixed(1)+'" x2="'+b[0].toFixed(1)+'" y2="'+b[1].toFixed(1)+'" stroke="url(#'+id+')" stroke-width="3.2" stroke-linecap="round"/><line x1="'+a[0].toFixed(1)+'" y1="'+(a[1]-1.4).toFixed(1)+'" x2="'+b[0].toFixed(1)+'" y2="'+(b[1]-1.4).toFixed(1)+'" stroke="rgba(255,255,255,.7)" stroke-width=".8" stroke-linecap="round"/>';
  C.add(.02,'<g pointer-events="none">'+s+'</g>');
  lfLight(C,.3,2.4,92,"#ffc27a",2.6,.55)}

/* ---------- ambient life: random events so rooms feel alive ---------- */
var LFEVT=0,LFEVN=0;
function lfNight(){var h=(new Date()).getHours();return h<6||h>=19}
function lfFxLayer(k){var it=document.querySelector('.lfitems[data-i="'+k+'"]');return it&&it.parentNode}
function lfFxAdd(k,svg,ms){var L=lfFxLayer(k);if(!L)return;var g=document.createElementNS("http://www.w3.org/2000/svg","g");g.setAttribute("class","lffx");g.setAttribute("pointer-events","none");g.innerHTML=svg;L.appendChild(g);setTimeout(function(){g.remove()},ms||6000)}
var LFFX={
  birds:function(C,k){var p=lfP(C.W*.2,-.5,130),s='';for(var i=0;i<4;i++)s+='<path d="M'+(p[0]+i*14)+' '+(p[1]+(i%2)*8)+' q4 -4 8 0 q4 -4 8 0" stroke="#2a2a3a" stroke-width="1.6" fill="none" class="lfwing"/>';lfFxAdd(k,'<g class="lfbirds">'+s+'</g>',7000)},
  jump:function(C,k){var x=lfRand(1.8,4.2),y=lfRand(1.8,3.8),p=lfP(x,y,0);lfFxAdd(k,'<g class="lfjump"><ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="6" ry="2.6" fill="'+lfPick(["#ff8a3a","#fff3e0","#ffd24a"])+'"/></g><ellipse class="lfsplash1" cx="'+p[0]+'" cy="'+p[1]+'" rx="10" ry="4" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.2"/>',2200)},
  star:function(C,k){var p=lfP(1,-1,170);lfFxAdd(k,'<path class="lfstar" d="M'+p[0]+' '+p[1]+' l60 18" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',1800)},
  /* Club lights: mostly a soft pulse of colour over the dance floor, and now and then the whole room flashes. Both are
     radial glows, so the light has no hard edge. */
  strobe:function(C,k){var Fs=(C.plat||[]).filter(function(p){return p.k==="cbx_floor"}),F=Fs.length?Fs.reduce(function(u,p){return {x0:Math.min(u.x0,p.x0),y0:Math.min(u.y0,p.y0),x1:Math.max(u.x1,p.x1),y1:Math.max(u.y1,p.y1),z:p.z}}):null,gid="lfsg"+(++LFEVN),full=!F||Math.random()<.18;
    var x0=full?0:F.x0,y0=full?0:F.y0,x1=full?C.W:F.x1,y1=full?C.D:F.y1,z=full?60:(F.z||0)+2,c=lfP((x0+x1)/2,(y0+y1)/2,z),a=lfP(x1,y0,z),b=lfP(x0,y1,z);
    var rx=Math.abs(a[0]-b[0])/2*(full?1.25:1),ry=full?rx*.75:Math.abs(lfP(x1,y1,z)[1]-lfP(x0,y0,z)[1])/2,col=full?"#ffffff":lfPick(["#ff3df0","#3dc8ff","#a66bff","#ff7ad8"]);
    lfFxAdd(k,'<defs><radialGradient id="'+gid+'"><stop offset="0" stop-color="'+col+'" stop-opacity="'+(full?.55:.6)+'"/><stop offset=".55" stop-color="'+col+'" stop-opacity="'+(full?.25:.3)+'"/><stop offset="1" stop-color="'+col+'" stop-opacity="0"/></radialGradient></defs><ellipse class="'+(full?"lfstrobe":"lfsoftglow")+'" cx="'+c[0].toFixed(1)+'" cy="'+c[1].toFixed(1)+'" rx="'+rx.toFixed(1)+'" ry="'+ry.toFixed(1)+'" fill="url(#'+gid+')" style="mix-blend-mode:screen"/>',full?1600:1900)},
  butterfly:function(C,k){var p=lfP(lfRand(1,4),lfRand(1,4),30);lfFxAdd(k,'<g class="lfbfly" style="transform-origin:'+p[0]+'px '+p[1]+'px"><path d="M'+p[0]+' '+p[1]+' q-6 -6 -6 0 q0 4 6 0 q6 -6 6 0 q0 4 -6 0" fill="'+lfPick(["#ff8ab8","#ffd24a","#8ad6ff"])+'"/></g>',8000)},
  flare:function(C,k){var p=C.prep&&C.prep.pass?lfP(.75,2.9,26):lfP(.8,2.6,28);lfFxAdd(k,'<path class="lfflare" d="M'+(p[0]-6)+' '+p[1]+' q4 -26 8 -10 q6 -24 8 10Z" fill="#ff9d3a"/>',1400)},
  pop:function(C,k){var p=lfP(lfRand(2,C.W-2),lfRand(2,C.D-2),60);lfFxAdd(k,'<g class="lfconf">'+[0,1,2,3,4,5,6,7].map(function(i){return '<rect x="'+(p[0]+(i-4)*5)+'" y="'+p[1]+'" width="3" height="5" fill="'+["#ff3df0","#4dd2ff","#ffd24a","#9cff8a"][i%4]+'" style="animation-delay:'+(i*.05)+'s"/>'}).join("")+'</g>',2600)},
  courier:function(C,k,m){lfNpc(k,C,{look:{sex:"m",skin:"#c68a5e",hair:"#1a1426",hair_s:"buzz",eyes:"#2a2030",top:{s:"tee",c:"#7a5230"},bottom:{s:"pants",c:"#5a3a22"},shoes:{s:"sneakers",c:"#2a2a2a"}},emo:"Package!",carry:1})},
  supplier:function(C,k,m){var P=C.prep&&C.prep.pass;lfNpc(k,C,{look:{sex:"f",skin:"#e0b08a",hair:"#4a2a1a",hair_s:"long",eyes:"#2a2030",top:{s:"tee",c:"#3fae5a"},bottom:{s:"pants",c:"#2a2a36"},shoes:{s:"sneakers",c:"#eef1f6"}},emo:"Fresh veg!",carry:1,to:P})},
  critic:function(C,k,m){lfNpc(k,C,{look:{sex:"m",skin:"#f2c9a0",hair:"#e9e6f5",hair_s:"sidepart",eyes:"#2a2030",top:{s:"tee",c:"#1a1a1a"},bottom:{s:"pants",c:"#1a1a1a"},shoes:{s:"sneakers",c:"#1a1a1a"}},emo:"Food critic",critic:1})}
};
function lfNpc(k,C,o){if(window.LFNOCHAR)return;
  if(Object.keys(LFA).some(function(id){return LFA[id].npc&&LFA[id].room==k}))return;
  var d=lfDoorOf(C),id="npc:"+(++LFEVN),t=o.to;if(!t){var q=lfRandFree(C);t={x:q[0],y:q[1]}}
  var a=LFA[id]={id:id,room:+k,role:"npc",npc:1,look:o.look,x:d.x,y:d.y+.3,mode:"idle",t:0,ph:0,face:1,alpha:0,fade:1,si:-1,tx:0,ty:0,leaving:0,pv:LFMETA[k]&&LFMETA[k].slot!=null?1:0,carry:o.carry?1:0,critic:o.critic};
  a.speed=1;lfGo(a,t.x,t.y,{kind:"npc",act:"reach",tag:"npc",dur:[2,3],fx:1});a.carry=o.carry?1:0;a.emo=o.emo;a.emot=4;
}
function lfAmbient(ts){
  if(ts-LFEVT<1000)return;LFEVT=ts;if(Math.random()>.06)return;
  var keys=Object.keys(LFMETA).filter(function(k){return LFMETA[k]&&LFMETA[k].r&&lfFxLayer(k)});if(!keys.length)return;
  var mdl=!!document.querySelector("#layer .modal");if(mdl)keys=keys.filter(function(k){return LFMETA[k].slot!=null});
  var k=lfPick(keys);if(k==null)return;var m=LFMETA[k],t=m.r.t,C=m.C,o=[];
  if(C.T.out)o.push("birds");
  if(t==="pond")o.push("jump","jump","jump");
  if(t==="garden"||t==="farm")o.push("butterfly","butterfly");
  if(t==="sky"&&lfNight())o.push("star","star");
  if(t==="club")o.push("strobe","strobe","pop");
  if(t==="restaurant")o.push("flare");
  if(t==="bar")o.push("pop");
  
  if(!o.length)return;var e=lfPick(o);try{LFFX[e](C,k,m)}catch(err){}
}

