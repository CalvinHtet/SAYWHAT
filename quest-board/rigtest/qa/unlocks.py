#!/usr/bin/env python3
"""Every unlock a simulated player is shown, by day and by level (Cal: "not multiple unlocks from 1 level ... not this early").
Reads sim_<type>.json written by sim.js (which keeps the cards of every level-up screen, the story steps done and the rooms
owned each day). Flags any day, and any single level-up screen, with 2 or more unlocks, and any run of played days where
the player bought nothing (held back with nothing to buy).
  python3 unlocks.py <OUT folder> [type ...] [--days N] [--story <29b_story.js>]
One unlock = a New area card, a story step (with the lot or room it opens counted once, not twice), or a room that opened
by an upgrade (closet, patio, game room ...). Level-up extras that only add looks or shop items (UI upgrade, Shop restocked,
level bonus) are listed but not counted."""
import json, os, sys, re

args, i = [], 1
opt = {}
while i < len(sys.argv):
    a = sys.argv[i]
    if a.startswith('--'): opt[a[2:]] = sys.argv[i + 1]; i += 2
    else: args.append(a); i += 1
out = args[0] if args else 'qa-out'
types = args[1:] or ['regular', 'casual']
days_max = int(opt.get('days', 30))
EXTRA = re.compile(r'^(UI UPGRADE|SHOP RESTOCKED|LEVEL BONUS|TITLE|NEW TITLE|THEME|FRAME|COINS)', re.I)
STEPROOM, STEPLV = {}, {}
if 'story' in opt:
    src = open(opt['story']).read()
    for m in re.finditer(r'\{id:"([a-z0-9_]+)",room:"([a-z0-9_]*)"', src): STEPROOM[m.group(1)] = m.group(2)
    m = re.search(r'stepLv:\{([^}]*)\}', open(os.path.join(os.path.dirname(opt['story']), '29e_economy.js')).read())
    if m: STEPLV = {k: int(v) for k, v in re.findall(r'([a-z0-9_]+):(\d+)', m.group(1))}

for t in types:
    f = os.path.join(out, f'sim_{t}.json')
    if not os.path.exists(f):
        print(f'{t}: no {f}'); continue
    D = json.load(open(f))['days'][:days_max]
    print(f'\n=== {t}: the first {len(D)} days ===')
    prev_rooms, prev_lv, flagged_days, flagged_lv, prev_st, idle = None, 1, [], [], [], []
    prev_areas, prev_off = ['board', 'train', 'shop', 'away'], []  # the level-1 areas every new save has
    for d in D:
        real, extra = [], []
        for u in d.get('unl', []):
            r = [c for c in u['cards'] if not EXTRA.match(c)]
            e = [c for c in u['cards'] if EXTRA.match(c)]
            real += [f'L{u["lv"]} {c}' for c in r]; extra += [f'L{u["lv"]} {c}' for c in e]
            if len(r) >= 2: flagged_lv.append((d['d'], u['lv'], r))
        # since aa165b1: the areas the player has (S.areaOn) and the story steps offered, read each day; when present they are
        # what counts, and the New area cards and storyDone only show when
        if 'areas' in d:
            if prev_areas is not None: real += [f'area: {a}' for a in d['areas'] if a not in prev_areas]
            prev_areas = d['areas']
            real = [x for x in real if 'New area' not in x] + [f'(card) {x}' for x in real if 'New area' in x]
        rooms = d.get('rooms', [])
        new = [r for r in rooms if prev_rooms is not None and r not in prev_rooms]
        if 'offers' in d:
            steps = [s for s in d['offers'] if s not in prev_off]; prev_off = d['offers']
        else:
            steps = [s for s in d.get('storyDone', []) if s not in prev_st]
            prev_st = d.get('storyDone', prev_st)
        for s in steps:
            room = STEPROOM.get(s, '')
            got = room in new
            if got: new.remove(room)
            lv = f' (least level {STEPLV[s]})' if s in STEPLV else ''
            real.append(f'story: {s}' + (f' -> {room} opened' if got else (f' -> {room} offered' if room else '')) + lv)
        stepped = set(STEPROOM.get(x, '') for x in prev_off)
        real += [f'room by upgrade: {r}' for r in new if r not in stepped]
        extra += [f'room built from an earlier step: {r}' for r in new if r in stepped]
        prev_rooms = rooms
        n = len([x for x in real if not x.startswith('(card)')])
        if n >= 2: flagged_days.append(d['d'])
        if d.get('played') and not d.get('bought') and not d.get('built'): idle.append(d['d'])
        mark = '  <-- 2+' if n >= 2 else ''
        print(f'day {d["d"]:>2} lv {prev_lv:>2}->{d["lv"]:>2} {n} unlock{"s" if n != 1 else ""}{mark}  (coins {d.get("coins")}, bought {len(d.get("bought", []))})')
        for x in real: print(f'        {x}')
        for x in extra: print(f'        (extra) {x}')
        prev_lv = d['lv']
    print(f'{t}: days with 2 or more unlocks: {flagged_days or "none"}')
    print(f'{t}: single level-ups with 2 or more: ' + ('; '.join(f'day {a} level {b}: {", ".join(c)}' for a, b, c in flagged_lv) or 'none'))
    print(f'{t}: played days with nothing bought: {idle or "none"}')
