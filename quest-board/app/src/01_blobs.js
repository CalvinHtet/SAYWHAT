/* ---------- w-perf2 (v0.92, W1b; QA PERF.md #1): room pictures load per room ----------
   app/blobs.js used to hold 675 pictures as base64 (14 MB) that every open downloaded and evaluated before the first draw, though
   the Board uses almost none of them. The 657 webp ones are now loose art files, art/app/bl_NNN_<table>_<key>.webp, and blobs.js
   holds their names (the 18 jpeg floor and wall textures stay inline: small, and every room uses them). This turns each name into
   the picture's URL before the tables that read window.__B (LFSP4 in 20_loft.js, ART, PXDATA, LFSPR in 30_app_b.js) are built:
   - the web build: art/<name>?h=<fingerprint> (web.js answers QBART from QBDATA.arthash), so a picture is fetched the first time a
     room, the building view or a window draws it, and the service worker keeps every ?h= file offline;
   - the Claude build: the data URL from the art_bl pack (tools/build.py packs bl_* because a published page holds only so many
     files), so it behaves as before.
   A name with no file left behind becomes art/<name>, which fails soft: the room draws without that one picture. */
(function(){var B=window.__B;if(!Array.isArray(B))return;
  var D=window.QBDATA||{},H=D.arthash||{},base=(D.loft&&D.loft.artBase)||"art/",Q=window.QBART;
  for(var i=0;i<B.length;i++){var n=B[i],u=null;if(typeof n!=="string"||n.indexOf("data:")===0||n.indexOf("bl_")!==0)continue;
    try{u=Q&&Q[n]}catch(e){}
    B[i]=u||(base+n+(H[n]?"?h="+H[n]:""))}})();
