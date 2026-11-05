# Browser checks

Headless Chromium scripts that drive the real app (`/dist/index.html`) and the rig test page.
Build first (`python3 tools/build.py`), serve `quest-board/` on 127.0.0.1:8765, then run from this folder
with `node <script>`. Screenshots go to `$OUT` (default `./shots`, not committed). `drv.js` opens the app
with a save that owns every room and every upgrade.

- `sheet.js out.png "<matrix.html query>" ...` renders rig contact sheets (see `../matrix.html`).
- `rooms.js [room,room]` screenshots each room fully upgraded.
- `guests.js room,room` puts guests on every guest spot and staff on every staff spot, pass by pass. `VIS=1` fills a visitors-only room (the Game Room) with ordinary guests.
- `me.js bedroom` puts your character on every spot of a home room.
- `watch.js room [shots] [gap]` leaves a room to run on its own and screenshots it.
- `gaps.js` lists the closest pairs of furniture in every room and anything outside its room.
- `depth.js` lists furniture drawn in the wrong order against its footprint.
- `stations.js` lists spots that stand inside furniture or seats with nothing under them.
- `rdepth.js` checks each Restaurant table seat is drawn on the right side of its table.
- `phone.js` (W=360 TAG=p) measures the bottom nav and the Collect button at phone width.
- `screens.js` (W=360) opens every bottom-nav tab and a room, screenshots each and lists anything wider than the screen.
- `zoom.js room out.png sprite [sprite]` crops the room view around named sprites at 2.5x.
- `sortwatch.js room [seconds]` lets a room run and lists anyone drawn under a piece they stand in front of (`START`, `STEP` in ms).
- `savecheck.js [case,case]` (`BASE=http://127.0.0.1:8766`) saving against a fake database that freezes what it returns, like the
  real one: online only, device only, both (the Two saves found choice, both ways), newest wins, a stranger's save, a new player.
  Run it after any change to `merge()`, `persist()` or the boot code in `30_app_b.js`.

They run on software WebGL, so a room of guests takes about a minute per pass.
