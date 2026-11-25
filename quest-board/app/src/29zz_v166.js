/* v1.66 (Cal 11-25): no brand keeps more than 6 pieces in a category. The plainest extras go off sale (cut, as ZXCUT in
   29zx_simple.js and V22CUT in 29zz_v122.js); anyone who owns one keeps it and keeps wearing it.
   HANGANG bottoms: Baggy Cargo Pants, Pleated Wide Trousers. Shoes: Chunky Sneakers, Canvas High-tops.
   Tops: Oversized Cream Hoodie, Oatmeal Knit Cardigan (a twin of the Cropped Cable Cardigan).
   OVERPASS bottom: Carpenter Jorts (a twin of the Double-Knee Carpenters). Tops: Plaid Overshirt, Cropped Zip Hoodie,
   Layered Thermal Tee. VELVET ROSE tops: Keyhole Crop Top, Velvet Smoking Robe. Y2K bottom: Low-rise Flare Jeans.
   Shoes: Retro Runners (a twin of the Bubble Sole Runners). */
var V66CUT=["gx_h_cargo","gx_h_trous","gx_h_sneak","gx_h_high","gx_h_hoodie","gx_h_cardi","gx_o_cshort","gx_o_flannel",
  "gx_o_crop","gx_o_thermal","gx_v_crop","gx_v_robe","gx_y_flare","gx_y_runner"];
SHOP.forEach(function(it){if(it&&it[6]&&V66CUT.indexOf(it[0])>=0)it[6].cut=1});
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV166={cut:V66CUT,fits:function(id){var it=SHOP.filter(function(q){return q[0]===id})[0];return it?!!itemFits(it):null}};
