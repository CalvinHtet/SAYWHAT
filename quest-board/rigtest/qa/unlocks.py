#!/usr/bin/env python3
"""Every unlock a simulated player is shown, by day and by level (Cal: "not multiple unlocks from 1 level ... not this early").
Reads sim_<type>.json written by sim.js (which keeps the cards of every level-up screen), plus the story scenes said yes to,
the lots built and the rooms that appeared. Flags any day, and any single level-up screen, with 2 or more unlocks.
  python3 unlocks.py <OUT folder> [type ...] [--days N]
What counts as an unlock: a New area, a new blueprint, a Loft floor, a story scene, a lot built, a new room. Level-up extras
that only add looks or coins (UI upgrade, Shop restocked, level bonus, title) are listed but not counted."""
import json, os, sys, re

args = [a for a in sys.argv[1:] if not a.startswith('--')]
out = args[0] if args else 'qa-out'
types = args[1:] or ['regular', 'casual']
days_max = int(sys.argv[sys.argv.index('--days') + 1]) if '--days' in sys.argv else 30
EXTRA = re.compile(r'^(UI UPGRADE|SHOP RESTOCKED|LEVEL BONUS|TITLE|NEW TITLE|THEME|FRAME|COINS)', re.I)

for t in types:
    f = os.path.join(out, f'sim_{t}.json')
    if not os.path.exists(f):
        print(f'{t}: no {f}'); continue
    D = json.load(open(f))['days'][:days_max]
    print(f'\n=== {t}: the first {len(D)} days ===')
    prev_rooms, prev_lv, flagged_days, flagged_lv = None, 1, [], []
    for d in D:
        real, extra = [], []
        for u in d.get('unl', []):
            r = [c for c in u['cards'] if not EXTRA.match(c)]
            e = [c for c in u['cards'] if EXTRA.match(c)]
            real += [f'L{u["lv"]} {c}' for c in r]; extra += [f'L{u["lv"]} {c}' for c in e]
            if len(r) >= 2: flagged_lv.append((d['d'], u['lv'], r))
        real += [f'story: {s}' for s in d.get('story', [])]
        real += [f'lot: {b}' for b in d.get('built', [])]
        rooms = d.get('rooms', [])
        if prev_rooms is not None:
            new = [r for r in rooms if r not in prev_rooms]
            built = ' '.join(d.get('built', []))
            real += [f'room: {r}' for r in new if r not in built]
        prev_rooms = rooms
        n = len(real)
        if n >= 2: flagged_days.append(d['d'])
        mark = '  <-- 2+' if n >= 2 else ''
        print(f'day {d["d"]:>2} lv {prev_lv:>2}->{d["lv"]:>2} {n} unlock{"s" if n != 1 else ""}{mark}')
        for x in real: print(f'        {x}')
        for x in extra: print(f'        (extra) {x}')
        prev_lv = d['lv']
    print(f'{t}: days with 2 or more unlocks: {flagged_days or "none"}')
    print(f'{t}: single level-ups with 2 or more: ' + ('; '.join(f'day {a} level {b}: {", ".join(c)}' for a, b, c in flagged_lv) or 'none'))
