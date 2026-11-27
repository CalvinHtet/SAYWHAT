/* ---------- Cal 2026-11-27: the Mon/Wed/Fri brand drops start now ----------
   Cal (Friday 11-27): "Today is Friday, so shouldn't there have been a new brand drop? I asked for brand drops on Monday, Wednesday, and
   Friday for clothing brands. Tuesday and Thursday are for pet shop brands. And Sunday to Sunday, all week, we'll have a rotating vault."
   The one rotation (29zz_v172.js, days Mon/Wed/Fri from 29zz_v201.js) was set to begin on Mon 11-30, so this week still ran the old
   Monday/Thursday calendar. It begins today, Fri 11-27 at 6 am, instead: today is its first drop, then Mon, Wed and Fri. Nothing from
   before today moves. Pet clothes (Tue/Thu/Sat from Sat 11-28) and the Sunday Vault (from Sun 11-29) are as they were. */
try{V72.day="2026-11-27";V72C=null}catch(e){}
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV224={live:function(n){var d=dropFloor(n==null?dropNow():n,flGet("street"));return {live:(d.live||[]).map(function(b){return b.id+"@"+b.start}),soon:(d.soon||[]).map(function(b){return b.id+"@"+b.start})}},cfg:V72};
