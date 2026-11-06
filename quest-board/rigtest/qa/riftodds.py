"""The Rift Mask's drop odds (LEAD's e389afa, for v0.51): a copy of dgRoll in app/src/29d_dungeon.js. The mask (gx_dg_riftmask)
comes only from Obsidian Spire (m5) gifts, and only when that gift is not a set piece: a gift fires (m5 .55 plus gift buffs), a
missing amulet piece wins first (r < .32, or the shared pity after 5 dry gifts), else 1 in 8 for the mask until it is owned,
else coins. Every mission runs RUNS times a day, in order m1..m5, 20,000 players. Gift buffs: with BUFFS=1 the Hushstep Boots
(+.05) and the full goblin set (+.10) count once owned; with BUFFS=0 they are left out (the slow case).
  python3 riftodds.py [runs a day] [buffs 0|1]"""
import random, sys
RUNS = int(sys.argv[1]) if len(sys.argv) > 1 else 2
BUFFS = int(sys.argv[2]) if len(sys.argv) > 2 else 1
LOOT = {'m1': ('goblin', ['helm', 'boots'], .30), 'm2': ('goblin', ['greaves', 'chest'], .30), 'm3': ('amulet', ['dusk', 'ember'], .40),
        'm4': ('goblin', ['sword', 'chest'], .40), 'm5': ('amulet', ['tide', 'thorn', 'silence'], .55)}
GOBLIN = {'helm', 'boots', 'greaves', 'chest', 'sword'}
AMULET = {'dusk', 'ember', 'tide', 'thorn', 'silence'}
MASK = .125


def player():
    have = {'goblin': set(), 'amulet': set()}; dry = 0; spire = 0; spire_mask_rolls = 0; amulet_day = None
    for day in range(1, 2000):
        for mid in ('m1', 'm2', 'm3', 'm4', 'm5') * RUNS:
            s, p, g = LOOT[mid]
            if mid == 'm5': spire += 1
            buff = (.05 if BUFFS and 'boots' in have['goblin'] else 0) + (.10 if BUFFS and have['goblin'] == GOBLIN else 0)
            if random.random() >= g + buff: continue
            miss = [x for x in p if x not in have[s]]; pity = dry >= 5; r = random.random()
            if miss and (pity or r < .32):
                dry = 0; have[s].add(random.choice(miss))
                if amulet_day is None and have['amulet'] == AMULET: amulet_day = day
                continue
            if mid == 'm5':
                spire_mask_rolls += 1
                if random.random() < MASK: return day, spire, amulet_day, have['amulet'] >= {'tide', 'thorn', 'silence'}
            dry += 1
    return None, spire, amulet_day, False


R = [player() for _ in range(20000)]
q = lambda a, f: a[int(f * (len(a) - 1))]
ds = sorted(r[0] for r in R); sp = sorted(r[1] for r in R)
print(f'{RUNS} Spire run(s) a day (every mission {RUNS}x a day), gift buffs {"on" if BUFFS else "off"}:')
print(f'  Rift Mask: days median {q(ds, .5)}, 25% by {q(ds, .25)}, 75% by {q(ds, .75)}, 90% by {q(ds, .9)}, 99% by {q(ds, .99)}, unluckiest {ds[-1]};'
      f' Spire runs median {q(sp, .5)}, 90% by {q(sp, .9)}')
print(f'  by day 7: {sum(d <= 7 for d in ds) / len(ds):.0%}, day 14: {sum(d <= 14 for d in ds) / len(ds):.0%}, day 30: {sum(d <= 30 for d in ds) / len(ds):.0%}')
print(f'  found before the Spire\'s three amulet pieces were all in: {sum(not r[3] for r in R) / len(R):.0%}')
