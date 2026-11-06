import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
SH = os.path.abspath(os.environ.get('OUT', 'upgrade-audit-out'))
TH = 24
steps = json.load(open(SH + '/steps.json'))
ORDER = list(steps)
over = json.load(open(D + '/overrides.json')) if os.path.exists(D + '/overrides.json') else {}


def load(p):
    return np.asarray(Image.open(p).convert('RGB')).astype(np.int16)


def diff(a, b):
    if a.shape != b.shape:
        return None
    m = (np.abs(a - b).max(axis=2) > TH)
    # the room-to-room arrow buttons and zoom buttons sit in the corners: they are UI, not the room
    h, w = m.shape
    for (y0, x0) in ((0, 0), (0, w - 150), (h - 52, 0), (h - 52, w - 150)):
        m[y0:y0 + 52, x0:x0 + 150] = False
    pct = m.mean() * 100
    # bbox on the mask with single stray pixels removed
    mo = ndimage.binary_opening(m, structure=np.ones((2, 2)))
    if not mo.any():
        mo = m
    if not mo.any():
        return pct, 0.0, None, m
    ys, xs = np.where(mo)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    bb = (x1 - x0) * (y1 - y0) / (m.shape[0] * m.shape[1]) * 100
    return pct, bb, [int(x0), int(y0), int(x1), int(y1)], m


def verdict(pct):
    if pct is None:
        return '?'
    if pct < 0.05:
        return 'NONE'
    if pct <= 0.6:
        return 'WEAK'
    return 'OK'


NIGHT = {}
NS = os.path.abspath(os.environ.get('NIGHT', SH + '_night'))
if os.path.exists(NS + '/steps.json'):
    ns = json.load(open(NS + '/steps.json'))
    for room, R in ns.items():
        st = R['steps']
        for k in range(1, len(st)):
            a, b = st[k - 1], st[k]
            try:
                res = diff(load(NS + '/' + room + '/' + a['file']), load(NS + '/' + room + '/' + b['file']))
            except Exception:
                continue
            NIGHT[(room, b['id'])] = None if res is None else round(res[0], 3)

rows, nulls = [], {}
for room in ORDER:
    if room not in steps:
        continue
    R = steps[room]
    d = SH + '/' + room
    st = R['steps']
    n0 = diff(load(d + '/00_base.png'), load(d + '/00_base_again.png'))
    n1 = diff(load(d + '/' + st[-1]['file']), load(d + '/zz_final_again.png'))
    nulls[room] = [round(n0[0], 4), round(n1[0], 4)]
    meta = {m['id']: m for m in R['meta']}
    for k in range(1, len(st)):
        a, b = st[k - 1], st[k]
        res = diff(load(d + '/' + a['file']), load(d + '/' + b['file']))
        m = meta[b['id']]
        pct, bb, box = (res[0], res[1], res[2]) if res else (None, None, None)
        v = verdict(pct)
        row = dict(room=room, step=k, id=b['id'], name=m['name'], price=m['price'], pct_changed=None if pct is None else round(pct, 3),
                   bbox_pct=None if bb is None else round(bb, 2), bbox_px=box, framing_changed=a['vb'] != b['vb'], auto_verdict=v, verdict=v,
                   prev=a['file'], file=b['file'], note='', night_pct=NIGHT.get((room, b['id'])))
        if res is None:
            row['verdict'] = row['auto_verdict'] = 'GROWS'
            row['note'] = 'room size changes, so the framing changes and pixels cannot be compared'
        if b.get('forced'):
            row['forced'] = True
            row['note'] = (row['note'] + '; ' if row['note'] else '') + 'never offered by the shop in this run (see gating); forced on to measure'
        o = over.get(b['id'])
        if o:
            row['verdict'] = o['verdict']
            row['note'] = o['note']
        rows.append(row)
    seen = set(s['id'] for s in st)
    for m in R['meta']:
        if m['id'] not in seen:
            rows.append(dict(room=room, step=None, id=m['id'], name=m['name'], price=m['price'], pct_changed=None, bbox_pct=None, bbox_px=None,
                             framing_changed=False, auto_verdict='-', verdict='RETIRED' if m['retired'] else 'NOT REACHED', prev=None, file=None,
                             note='retired: hidden from the shop' if m['retired'] else 'never became buyable in this run'))

json.dump({'threshold': TH, 'null_diff_pct': nulls, 'rows': rows}, open(SH + '/report.json', 'w'), indent=1)

# contact sheets
try:
    F = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 22)
    Fs = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 16)
except Exception:
    F = Fs = ImageFont.load_default()
os.makedirs(SH + '/sheets', exist_ok=True)
for room in ORDER:
    rr = [r for r in rows if r['room'] == room and r['file'] and ((r['auto_verdict'] in ('NONE', 'WEAK') and r['verdict'] != 'N/A') or r['verdict'] in ('NONE', 'WEAK'))]
    if not rr:
        continue
    W = 460
    tiles = []
    for r in rr:
        a = Image.open(SH + '/' + room + '/' + r['prev']).convert('RGB')
        b = Image.open(SH + '/' + room + '/' + r['file']).convert('RGB')
        sc = W / a.width
        a2 = a.resize((W, int(a.height * sc)))
        b2 = b.resize((W, int(b.height * sc)))
        # third panel: the change highlighted in red over a dimmed "after"
        res = diff(np.asarray(a).astype(np.int16), np.asarray(b).astype(np.int16))
        hl = np.asarray(b).astype(np.float32) * 0.35
        if res is not None:
            m = ndimage.binary_dilation(res[3], iterations=2)
            hl[m] = [255, 40, 40]
        c2 = Image.fromarray(hl.astype(np.uint8)).resize((W, int(b.height * sc)))
        # zoomed before/after around the change, so small items can be judged by eye
        if res is not None and res[2]:
            x0, y0, x1, y1 = res[2]
            pad = 50
            x0, y0 = max(0, x0 - pad), max(0, y0 - pad); x1, y1 = min(a.width, x1 + pad), min(a.height, y1 + pad)
            bw, bh = x1 - x0, y1 - y0
            z = min(2.5, W / bw, a2.height / bh)
            za = a.crop((x0, y0, x1, y1)).resize((max(1, int(bw * z)), max(1, int(bh * z))))
            zb = b.crop((x0, y0, x1, y1)).resize((max(1, int(bw * z)), max(1, int(bh * z))))
        else:
            za = zb = Image.new('RGB', (10, 10))
        h = a2.height + 40
        t = Image.new('RGB', (W * 5 + 40, h), (20, 20, 24))
        t.paste(a2, (0, 40)); t.paste(b2, (W + 10, 40)); t.paste(c2, (2 * W + 20, 40)); t.paste(za, (3 * W + 30, 40)); t.paste(zb, (4 * W + 40, 40))
        dr = ImageDraw.Draw(t)
        if res is not None and res[2]:
            x0, y0, x1, y1 = [v * sc for v in res[2]]
            dr.rectangle([W + 10 + x0, 40 + y0, W + 10 + x1, 40 + y1], outline=(255, 60, 60), width=2)
        dr.text((6, 8), '%s  (%s, %s coins)  changed %s%%  bbox %s%%  -> %s' % (r['name'], r['id'], r['price'], r['pct_changed'], r['bbox_pct'], r['verdict']), fill=(255, 255, 255), font=F)
        for k2, lab in enumerate(['before', 'after', 'diff', 'zoom before', 'zoom after']):
            dr.text((k2 * (W + 10) + W - 110, 44), lab, fill=(255, 255, 0), font=Fs)
        tiles.append(t)
    H = sum(t.height for t in tiles) + 10 * len(tiles)
    sheet = Image.new('RGB', (tiles[0].width, H), (0, 0, 0))
    y = 0
    for t in tiles:
        sheet.paste(t, (0, y)); y += t.height + 10
    sheet.save(SH + '/sheets/%s.png' % room)

# markdown
L = ['# Upgrade visibility audit', '', 'Each upgrade bought alone, in unlock order, on top of the ones before it. Room view only, no people, CSS animations off, clock fixed at 14:00. '
     'Changed = pixels where any channel moved more than %d/255, as %% of the room picture (about 942x900 px). Bbox = area of the box around the change (stray pixels removed). '
     'Auto verdict: NONE < 0.05%%, WEAK 0.05-0.6%%, OK above; final verdict after looking at the contact sheets (notes say where it differs).' % TH, '',
     'Null check (same state rendered twice, base / fully upgraded): ' + ', '.join('%s %s/%s%%' % (k, v[0], v[1]) for k, v in nulls.items()), '']
rank = {'NONE': 0, 'WEAK': 1, 'OK': 2, 'GROWS': 2.5, 'N/A': 2.7, 'NOT REACHED': 3, 'RETIRED': 4}
for room in ORDER:
    rr = [r for r in rows if r['room'] == room]
    if not rr:
        continue
    rr.sort(key=lambda r: (rank.get(r['verdict'], 5), r['pct_changed'] if r['pct_changed'] is not None else 1e9))
    c = {}
    for r in rr:
        c[r['verdict']] = c.get(r['verdict'], 0) + 1
    L += ['## %s' % room, '', ', '.join('%s %d' % kv for kv in c.items()) + ('  (sheet: sheets/%s.png)' % room if os.path.exists(SH + '/sheets/%s.png' % room) else ''), '',
          '| upgrade | id | price | changed % (day) | bbox % | night % | verdict | note |', '|---|---|---|---|---|---|---|---|']
    for r in rr:
        L.append('| %s | %s | %s | %s | %s | %s | %s%s | %s |' % (r['name'], r['id'], r['price'], r['pct_changed'], r['bbox_pct'], r.get('night_pct'), r['verdict'],
                 '' if r['verdict'] == r['auto_verdict'] or r['auto_verdict'] == '-' else ' (auto %s)' % r['auto_verdict'], r['note'] + (' framing changed' if r['framing_changed'] else '')))
    L.append('')
tot = {}
for r in rows:
    tot[r['verdict']] = tot.get(r['verdict'], 0) + 1
head = ['', '**Totals (final verdicts):** ' + ', '.join('%s %d' % kv for kv in sorted(tot.items())), '',
        'N/A = staff, menus, money caps, pets and room-opening expansions: nothing to see by design, or not measurable here (see limits). '
        'GROWS was resolved by eye. Night % = same test at 22:30 (lights and glows are stronger at night).', '']
head += open(D + '/notes.md').read().split('\n') if os.path.exists(D + '/notes.md') else []
L = L[:6] + head + L[6:]
open(SH + '/report.md', 'w').write('\n'.join(L))
tot = {}
for r in rows:
    tot[r['verdict']] = tot.get(r['verdict'], 0) + 1
print(tot, nulls)
