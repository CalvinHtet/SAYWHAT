"""Model of the effort-first economy proposed in docs/QA.md (2026-11-05), before any code exists.
python3 effort_model.py <ups.json from the live game>   (ups.json: [room, id, name, price, group, decor, opens] per upgrade)
Task coins per day come from sim.js runs of the real game (regular player: about 650 on day 1, 3,000 by day 14,
6,000 by day 30); under the proposal levels rise more slowly (no mission XP), so task pay grows more slowly too."""
import json, sys, re
ups = json.load(open(sys.argv[1]))
STEP = dict(garden=1, restaurant=1.25, boba=1.5, dessert=1.75, skybar=2, speakeasy=2, rooftop=2.5, mall=3, theater=3.5,
            auditorium=3.5, arcade=4.5, rhythm=4.5, vr=4.5, bowling=5, karaoke=5.5, club=6)
DECOR = re.compile(r'\b(art|painting|poster|mural|vases?|sconces?|plants?|planters?|flowers?|rug|curtains?|frames?|prints|clock|sign|garland|neon|lamp|lights?|palm|fern|leaf|trim|plaque)\b', re.I)
def new_price(u):
    room, uid, name, price, g, decor, opens = u
    st = STEP.get(room, 1); base = price / st
    if decor or DECOR.search(name): b = 200            # a poster, a plant, a sign
    elif base <= 250: b = 500                            # ordinary furniture
    elif base <= 500: b = 1200                           # equipment that does a job (popcorn machine, oven)
    elif base <= 1000: b = 3000                          # a big piece (pool, DJ booth)
    else: b = base * 3                                   # moments: expansions, IMAX, a new room
    return round(b * st / 50) * 50
NP = sorted(new_price(u) for u in ups)
print('upgrades', len(ups), 'total now', sum(u[3] for u in ups), 'total proposed', sum(NP))
print('proposed price spread: cheapest', NP[0], 'median', NP[len(NP)//2], 'top', NP[-5:])
def run(name, task, quest_e, play_days, days=365):
    # task(d): coins from tasks on day d (with level pay, wheel, weekly bonus folded in at +15%)
    pool = list(NP); owned = 0; bank = 0; tot = {'tasks': 0, 'town': 0, 'missions': 0}; marks = {}
    for d in range(1, days + 1):
        if (d - 1) % 7 not in play_days: continue
        t = task(d) * 1.15
        frac = owned / len(NP)
        C = 0.2 + 0.3 * frac                      # town can earn at most 20% to 50% of today's task coins
        town = t * C * quest_e                     # efficiency from the Daily Quest (0 with no task)
        miss = 0.15 * t if d >= 10 else 0           # missions cost energy that only tasks make
        tot['tasks'] += t; tot['town'] += town; tot['missions'] += miss
        bank += t + town + miss
        while pool and pool[0] <= bank: bank -= pool.pop(0); owned += 1
        for q in (0.25, 0.5, 0.75, 1.0):
            if q not in marks and owned >= q * len(NP): marks[q] = d
        if d in (1, 7, 30, 60, 90, 180, 365):
            s = sum(tot.values()); print('  %-8s day %3d: %3d of %d bought, tasks %.0f%% of coins, next price %s' % (name, d, owned, len(NP), 100 * tot['tasks'] / s, pool[0] if pool else '-'))
    print('  %-8s quarter/half/three-quarters/all bought on day:' % name, [marks.get(q) for q in (0.25, 0.5, 0.75, 1.0)])
reg = lambda d: min(650 + 120 * (d - 1), 4500) + (d > 90) * min(15 * (d - 90), 1500)
run('casual', lambda d: 0.4 * reg(d), 0.8, [1, 2, 3, 4, 5])
run('regular', reg, 1.0, range(7))
run('grinder', lambda d: 2.2 * reg(d), 1.5, range(7))
