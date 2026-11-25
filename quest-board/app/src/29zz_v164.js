/* ---------- Cal 2026-11-25: the character and the companion centred together on the card ----------
   Cal: "Once the pet is available for purchase, the player card banner should center both of them together. So they should both be a
   little bit more to the right because the pet is going to be cut off when it grows into the evolved form. If there is any part cut off
   for the pet, reduce the scale of both characters by a very little amount until there they both fit onto the player card"
   With a companion on the card (the big card, the profile's banner, posts, other players' cards, the header's small card): the drawn
   parts of the two pictures (their non-transparent pixels, measured once per picture) are taken as one group; the group is moved so it
   sits in the middle of the card, and, only if it is still wider (or taller) than the card less a small margin, both are scaled down
   together by just enough. Without a companion nothing changes. This replaces pcClamp (29zz_v152.js), which nudged only the pet. */
var V64BOX={};
function v64Box(im){try{var u0=im.currentSrc||im.src,u=u0&&u0.length>200?u0.length+":"+u0.slice(-64)+":"+(im.dataset.pzk||""):u0;/* QA: a short key, not a 300 KB data URL */if(!u||!im.complete||!im.naturalWidth||im.naturalWidth<4)return null;if(V64BOX[u])return V64BOX[u];
    var w=im.naturalWidth,h=im.naturalHeight,k=Math.min(1,160/Math.max(w,h)),cw=Math.max(1,Math.round(w*k)),ch=Math.max(1,Math.round(h*k)),c=document.createElement("canvas");c.width=cw;c.height=ch;
    var x=c.getContext("2d");x.drawImage(im,0,0,cw,ch);var d=x.getImageData(0,0,cw,ch).data,x0=cw,y0=ch,x1=-1,y1=-1;
    for(var y=0;y<ch;y++)for(var i=0;i<cw;i++)if(d[(y*cw+i)*4+3]>24){if(i<x0)x0=i;if(i>x1)x1=i;if(y<y0)y0=y;if(y>y1)y1=y}
    if(x1<0)return null;var b=[x0/cw,y0/ch,(x1+1)/cw,(y1+1)/ch];var keys=Object.keys(V64BOX);if(keys.length>80)delete V64BOX[keys[0]];V64BOX[u]=b;return b}catch(e){return null}}
function v64On(im,b){var r=im.getBoundingClientRect();return {l:r.left+b[0]*r.width,t:r.top+b[1]*r.height,r:r.left+b[2]*r.width,b:r.top+b[3]*r.height}}
function v64Fit(stage){try{var fig=stage&&stage.querySelector(".pc-fig");if(!fig||!fig.isConnected)return;var ch=fig.querySelector("img.calp"),pet=fig.querySelector("img.fsh-pet");
    if(!pet){fig.style.transform="";return}pet.style.transform="";fig.style.transform="";fig.style.transformOrigin="";
    var bc=v64Box(ch),bp=v64Box(pet);if(!bc||!bp)return;var A=v64On(ch,bc),B=v64On(pet,bp),U={l:Math.min(A.l,B.l),r:Math.max(A.r,B.r),t:Math.min(A.t,B.t),b:Math.max(A.b,B.b)};
    var host=stage.closest(".pcard,.avbtn")||stage,C=host.getBoundingClientRect();if(C.width<10)return;var m=Math.max(3,C.width*.04),L=C.left+m,R=C.right-m,T=C.top+m;
    var s=1;if(U.r-U.l>R-L)s=(R-L)/(U.r-U.l);if(U.t<T&&U.b>T)s=Math.min(s,(U.b-T)/(U.b-U.t));s=Math.max(.6,Math.min(1,s));
    var cx=(U.l+U.r)/2,F=fig.getBoundingClientRect(),dx=(L+R)/2-cx;fig.style.transformOrigin=(cx-F.left).toFixed(1)+"px "+(U.b-F.top).toFixed(1)+"px";
    fig.style.transform="translateX("+dx.toFixed(1)+"px)"+(s<.999?" scale("+s.toFixed(3)+")":"")}catch(e){}}
pcClamp=function(im){try{var st=im&&im.closest&&im.closest(".pc-stage");if(st)v64Fit(st)}catch(e){}};
/* the character's picture arrives after the pet's (and is swapped for the sharp one): fit again whenever either finishes loading */
document.addEventListener("load",function(e){var t=e.target;if(!t||t.tagName!=="IMG"||!t.closest)return;var st=t.closest(".pc-stage");if(st&&st.querySelector("img.fsh-pet"))v64Fit(st)},true);
window.addEventListener("resize",function(){[].forEach.call(document.querySelectorAll(".pc-stage"),v64Fit)});
/* no transition: each fit measures the pictures with the transform taken off, which an animation would blur */
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV164={fit:v64Fit,box:v64Box};
