"""Summarise sim.js runs: python3 simsum.py <folder with sim_<type>.json>"""
import json, sys, os
D = sys.argv[1]
for t in ('casual', 'regular', 'grinder'):
    f = os.path.join(D, 'sim_%s.json' % t)
    if not os.path.exists(f): continue
    days = json.load(open(f))['days']
    print('\n##', t, len(days), 'days')
    print('day  lv trial  xp     earned  spent   coins rooms ups  cheapest  quests  level  rooms  missions produce wheel weekly trophies')
    for d in days:
        if d['d'] in (1, 2, 3, 7, 14, 21, 30, 45, 60, 75, 90) or d['d'] == len(days):
            l = d['led']
            print('%3d %3d %5s %6d %8d %7d %6d %4d %4d %8s %7d %6d %6d %8d %7d %5d %6d %8d' % (d['d'], d['lv'], 'yes' if d['raw'] > d['lv'] else '', d['xp'], d['earned'], d['spent'], d['coins'], len(d['rooms']), d['ups'], d['cheapest'], l['quests'], l['level'], l['rooms'], l['missions'], l['produce'], l['wheel'], l['weekly'], l.get('trophies', 0)))
    # rooms opened, by day
    seen = []
    for d in days:
        for r in d['rooms']:
            if r not in seen: seen.append(r); print('   day %3d opens %s' % (d['d'], r))
    # purchases per playing day, and days with nothing to buy
    pd = [d for d in days if d['played']]
    nobuy = [d['d'] for d in pd if not d['bought'] and not d['built']]
    print('   upgrades bought per playing day: week1 %.1f, week2-4 %.1f, month2 %.1f, month3 %.1f' % tuple(
        (sum(len(d['bought']) for d in pd if a <= d['d'] <= b) / max(1, len([d for d in pd if a <= d['d'] <= b]))) for a, b in ((1, 7), (8, 30), (31, 60), (61, 90))))
    print('   playing days with nothing bought:', len(nobuy), nobuy[:30])
    big = max((d['coins'] for d in days), default=0)
    print('   most coins held at the end of a day:', big)
    trial = [d['d'] for d in days if d['raw'] > d['lv']]
    print('   days ending blocked by a level trial:', len(trial))
