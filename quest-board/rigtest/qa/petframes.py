"""QA: every pet frame measured (ROOMS's evolved pets, Cal 11-24 item A). No PIL here: ffmpeg decodes each webp to RGBA.
For each frame: canvas size against pet_art.json, the alpha box, art touching the canvas edge, green fringe (semi-transparent edge
pixels that lean green: what a chroma key leaves), specks (separate bits of alpha away from the body), the mass centre's column
against cx, and for pairs (idle 0-1, move 2-3) how much the silhouette changes (IoU of the masks, area ratio, box shift).
   python3 -I petframes.py <dir of pgx_*.webp and pbed_*.webp> <pet_art.json>
"""
import json, subprocess, sys, os
D, J = sys.argv[1], json.load(open(sys.argv[2]))

def rgba(path):
    p = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout.strip().split(',')
    w, h = int(p[0]), int(p[1])
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], capture_output=True).stdout
    return w, h, raw

def stats(path):
    w, h, b = rgba(path)
    A = [b[i * 4 + 3] for i in range(w * h)]
    on = [a > 32 for a in A]
    xs = [i % w for i in range(w * h) if on[i]]; ys = [i // w for i in range(w * h) if on[i]]
    if not xs: return dict(w=w, h=h, empty=1)
    box = (min(xs), min(ys), max(xs), max(ys))
    edge = sum(1 for i in range(w * h) if A[i] > 8 and (i % w in (0, w - 1) or i // w in (0, h - 1)))
    green = 0; fringe = 0
    for i in range(w * h):
        a = A[i]
        if 8 < a < 235:
            fringe += 1
            r, g, bl = b[i * 4], b[i * 4 + 1], b[i * 4 + 2]
            if g > r + 25 and g > bl + 25 and g > 70: green += 1
    # components (4-neighbour) of on-pixels
    seen = bytearray(w * h); comps = []
    for i in range(w * h):
        if on[i] and not seen[i]:
            st = [i]; seen[i] = 1; n = 0
            while st:
                j = st.pop(); n += 1; x, y = j % w, j // w
                for k in ((j - 1) if x > 0 else -1, (j + 1) if x < w - 1 else -1, (j - w) if y > 0 else -1, (j + w) if y < h - 1 else -1):
                    if k >= 0 and on[k] and not seen[k]: seen[k] = 1; st.append(k)
            comps.append(n)
    comps.sort(reverse=True)
    specks = [c for c in comps[1:] if c < 60]
    wsum = sum(A[i] for i in range(w * h)); cxm = sum((i % w) * A[i] for i in range(w * h)) / wsum
    return dict(w=w, h=h, box=box, bw=box[2] - box[0] + 1, bh=box[3] - box[1] + 1, edge=edge, green=green, fringe=fringe, parts=len(comps), big2=comps[1] if len(comps) > 1 else 0, specks=len(specks), speckpx=sum(specks), cxm=round(cxm), mask=on, area=sum(on), bottom=box[3])

def pair(a, b):
    if a['w'] != b['w'] or a['h'] != b['h']: return None
    inter = sum(1 for x, y in zip(a['mask'], b['mask']) if x and y); uni = sum(1 for x, y in zip(a['mask'], b['mask']) if x or y)
    return dict(iou=round(inter / uni, 3), area=round(b['area'] / a['area'], 3), dx=b['box'][0] - a['box'][0], dtop=b['box'][1] - a['box'][1], dbot=b['bottom'] - a['bottom'])

out = {}
for pet in ['wolf', 'wyvern', 'slime', 'k4', 'k5', 'k6']:
    meta = J['pets'].get(pet, {}); fr = []
    for i in range(11):
        f = os.path.join(D, 'pgx_%s_%d.webp' % (pet, i))
        if not os.path.exists(f) or os.path.getsize(f) == 0: fr.append(None); print(pet, i, 'MISSING'); continue
        s = stats(f); fr.append(s)
        flags = []
        if (s['w'], s['h']) != (meta.get('w'), meta.get('h')): flags.append('canvas %dx%d vs json %sx%s' % (s['w'], s['h'], meta.get('w'), meta.get('h')))
        if s['edge']: flags.append('touches edge (%d px)' % s['edge'])
        if s['green'] > 20: flags.append('green fringe %d px' % s['green'])
        if s['specks']: flags.append('%d specks (%d px)' % (s['specks'], s['speckpx']))
        if abs(s['cxm'] - meta.get('cx', s['cxm'])) > 12 and i not in (5,): flags.append('mass centre x %d vs cx %d' % (s['cxm'], meta.get('cx')))
        if s['h'] - 1 - s['bottom'] > 6 and i not in (3,): flags.append('floats %d px above the ground line' % (s['h'] - 1 - s['bottom']))
        print('%-6s %2d  %dx%d box %dx%d bottom %d  parts %d (2nd %d)  fringe %d green %d  cx %d  %s' % (pet, i, s['w'], s['h'], s['bw'], s['bh'], s['bottom'], s['parts'], s['big2'], s['fringe'], s['green'], s['cxm'], '| ' + '; '.join(flags) if flags else 'ok'))
    for a, b in ((0, 1), (2, 3)):
        if fr[a] and fr[b]:
            pr = pair(fr[a], fr[b]); print('%-6s pair %d-%d: IoU %.3f, area x%.3f, box left %+d, top %+d, feet %+d' % (pet, a, b, pr['iou'], pr['area'], pr['dx'], pr['dtop'], pr['dbot']))
    out[pet] = [dict((k, v) for k, v in (s or {}).items() if k != 'mask') for s in fr]
# evolved vs first form: the standing frame's box
for ev, base in (('k5', 'wolf'), ('k6', 'wyvern'), ('k4', 'slime')):
    e, bse = out[ev][0], out[base][0]
    print('%s vs %s (frame 0 box): %dx%d vs %dx%d = x%.2f wide, x%.2f tall' % (ev, base, e['bw'], e['bh'], bse['bw'], bse['bh'], e['bw'] / bse['bw'], e['bh'] / bse['bh']))
for bed in ['pbed_wolf_live', 'pbed_wolf', 'pbed_wyvern', 'pbed_slime', 'pbed_k4', 'pbed_k5', 'pbed_k6']:
    f = os.path.join(D, bed + '.webp')
    if not os.path.exists(f) or os.path.getsize(f) == 0: print(bed, 'MISSING'); continue
    s = stats(f); key = bed.replace('pbed_', '').replace('_live', ''); m = (J['pets'].get(key) or {}).get('bed', {})
    print('%-15s %dx%d box %dx%d edge %d fringe %d green %d parts %d specks %d  json %sx%s' % (bed, s['w'], s['h'], s['bw'], s['bh'], s['edge'], s['fringe'], s['green'], s['parts'], s['specks'], m.get('w'), m.get('h')))
