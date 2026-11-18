# Run on a release before shipping:  python3 -I rigtest/lead/artcheck.py <release worktree>/quest-board   (exit 1 on any gap)
# The release's own tree: every Shop row's garment has an items.json entry, an icon and its body art (v1.12/v1.13 shipped 30 rows without
# them because the art commits were never cherry-picked; LEAD 2026-11-17). Exit 1 on any gap.
import json, os, re, sys
qb = sys.argv[1]
items = json.load(open(os.path.join(qb, 'data/items.json')))
art = set(os.listdir(os.path.join(qb, 'art/app')))
src = ''.join(open(os.path.join(qb, 'app/src', f)).read() for f in sorted(os.listdir(os.path.join(qb, 'app/src'))) if f.endswith('.js'))
gars = sorted(set(re.findall(r'gar:\s*"([a-z0-9_]+)"', src)))
bad = []
for g in gars:
    v = items.get(g)
    if not isinstance(v, dict): bad.append(g + ': no items.json entry'); continue
    if 'icon_%s.webp' % g not in art: bad.append(g + ': no icon')
    for s in ('f', 'm'):
        if v.get('maleOnly' if s == 'f' else 'femaleOnly'): continue
        for side in (['front'] if v.get('frontOnly') else ['front', 'back']):
            if '%s_%s_%s.webp' % (s, g, side) not in art: bad.append('%s: no %s_%s' % (g, s, side))
print('art check: %d Shop garments, %d gaps' % (len(gars), len(bad)) + ('' if not bad else ': ' + '; '.join(bad[:12])))
sys.exit(1 if bad else 0)
