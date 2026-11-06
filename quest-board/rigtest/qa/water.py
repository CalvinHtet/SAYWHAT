#!/usr/bin/env python3
"""Watering the Garden (a2e234e) in the economy run: compares sim.js runs with different watering habits (WATER=daily, every3,
never). For each: when the Garden opened, visits that found the beds dry, produce sold and the coins it paid, when Mara came
(60 sold) and the Restaurant opened, the level on days 15, 30 and 45, and the day every upgrade was owned.
  python3 water.py <folder> [type]       (reads every sim_<type>*.json in the folder)"""
import json, os, sys

out = sys.argv[1] if len(sys.argv) > 1 else 'qa-out'
t = sys.argv[2] if len(sys.argv) > 2 else 'regular'
import glob
for p in sorted(glob.glob(os.path.join(out, f'sim_{t}*.json'))):
    f = os.path.basename(p)[len(f'sim_{t}'):-5]
    tag = ('forgets (waters 1 day in 3)' if 'every3' in f else 'never waters' if 'never' in f else 'waters daily') + (', no Sprinklers' if 'nog_spr' in f else '')
    D = json.load(open(p))['days']
    first = lambda pred: next((d['d'] for d in D if pred(d)), None)
    g = first(lambda d: 'garden' in d.get('rooms', []))
    dry = sum(d.get('dry', 0) for d in D)
    dry_days = [d['d'] for d in D if d.get('dry')]
    mara = first(lambda d: 'chef' in d.get('offers', []))
    rest = first(lambda d: 'restaurant' in d.get('rooms', []))
    spr = first(lambda d: any('Sprinklers' in x for x in d.get('bought', [])))
    allup = first(lambda d: d.get('cheapest') is None and d['d'] > 5)
    lv = {n: next((d['lv'] for d in D if d['d'] == n), None) for n in (15, 30, 45)}
    last = D[-1]
    print(f'{tag}: Garden day {g}; dry at {dry} visits on {len(dry_days)} days {dry_days[:12]}{"..." if len(dry_days) > 12 else ""}; '
          f'produce sold {last.get("sold")}, produce coins {last["led"].get("produce", 0)}; Mara day {mara}, Restaurant day {rest}; '
          f'level day 15/30/45: {lv[15]}/{lv[30]}/{lv[45]}; every upgrade day {allup}; earned {last["earned"]} by day {last["d"]}; waterings {last.get("watered")}; Sprinklers bought day {spr}')
