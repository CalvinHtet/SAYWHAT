"""Dungeon gift odds, a copy of dgRoll in app/src/29d_dungeon.js (9b4cf3a): 5 missions a day (m1 to m5), 20,000 players.
python3 dropodds.py   -> days and missions to finish each set, and whether the pity ever fires twice running.
Set and piece buffs to the gift chance (dgBuff("gift")) are left at 0."""
import random
LOOT = {'m1': ('goblin', ['helm', 'boots'], .30), 'm2': ('goblin', ['greaves', 'chest'], .30), 'm3': ('amulet', ['dusk', 'ember'], .40),
        'm4': ('goblin', ['sword', 'chest'], .40), 'm5': ('amulet', ['tide', 'thorn', 'silence'], .55)}
SETS = {'goblin': {'helm', 'boots', 'greaves', 'chest', 'sword'}, 'amulet': {'dusk', 'ember', 'tide', 'thorn', 'silence'}}
def player():
    have = {'goblin': set(), 'amulet': set()}; dry = 0; done = {}; n = 0; pity_runs = 0; last_pity = False
    for day in range(1, 400):
        for mid in ('m1', 'm2', 'm3', 'm4', 'm5'):
            n += 1; s, p, g = LOOT[mid]
            if random.random() >= g: continue
            miss = [x for x in p if x not in have[s]]; pity = dry >= 5; r = random.random()
            if miss and (pity or r < .32):
                if pity and r >= .32 and last_pity: pity_runs += 1
                last_pity = pity and r >= .32
                dry = 0; have[s].add(random.choice(miss))
            else:
                dry += 1; last_pity = False
            for k in SETS:
                if k not in done and have[k] == SETS[k]: done[k] = (day, n)
        if len(done) == 2: return done, pity_runs
    return done, pity_runs
R = [player() for _ in range(20000)]
for k in ('goblin', 'amulet'):
    ds = sorted(r[0][k][0] for r in R); ms = sorted(r[0][k][1] for r in R)
    q = lambda a, f: a[int(f * (len(a) - 1))]
    print('%-7s set: days median %d, 90%% of players by %d, unluckiest %d (missions median %d)' % (k, q(ds, .5), q(ds, .9), ds[-1], q(ms, .5)))
print('pity firing twice running:', sum(r[1] for r in R), 'times in', len(R), 'players')
