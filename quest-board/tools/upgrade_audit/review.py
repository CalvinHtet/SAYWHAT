# A compact before/after grid for one room: OUT=<folder> python3 review.py <room> -> <OUT>/review/<room>_N.png
import json, sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont
D = os.path.dirname(os.path.abspath(__file__))
SH = os.path.abspath(os.environ.get('OUT', 'upgrade-audit-out'))
rows = json.load(open(SH + '/report.json'))['rows']
room = sys.argv[1]
sel = [r for r in rows if r['room'] == room and r['file'] and (r['auto_verdict'] in ('NONE', 'WEAK') or r['verdict'] in ('NONE', 'WEAK')) and (r['pct_changed'] or 0) > 0]
F = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 15)
P = 250
os.makedirs(SH + '/review', exist_ok=True)
ent = []
for r in sel:
    a = Image.open(SH + '/' + room + '/' + r['prev']).convert('RGB')
    b = Image.open(SH + '/' + room + '/' + r['file']).convert('RGB')
    full = b.copy(); dr = ImageDraw.Draw(full)
    if r['bbox_px']:
        x0, y0, x1, y1 = r['bbox_px']; dr.rectangle([x0 - 4, y0 - 4, x1 + 4, y1 + 4], outline=(255, 0, 0), width=4)
        pad = 40; cx0, cy0, cx1, cy1 = max(0, x0 - pad), max(0, y0 - pad), min(a.width, x1 + pad), min(a.height, y1 + pad)
        za, zb = a.crop((cx0, cy0, cx1, cy1)), b.crop((cx0, cy0, cx1, cy1))
    else:
        za = zb = Image.new('RGB', (P, P))
    def fit(im):
        k = min(P / im.width, P / im.height); return im.resize((max(1, int(im.width * k)), max(1, int(im.height * k))))
    t = Image.new('RGB', (3 * P + 20, P + 24), (25, 25, 30))
    t.paste(fit(full), (0, 24)); t.paste(fit(za), (P + 10, 24)); t.paste(fit(zb), (2 * P + 20, 24))
    ImageDraw.Draw(t).text((4, 3), '%s %s %s%% %s' % (r['name'], r['id'], r['pct_changed'], r['verdict']), fill=(255, 255, 255), font=F)
    ent.append(t)
per = 10
for k in range(0, len(ent), per):
    ch = ent[k:k + per]
    cols = 2; rws = (len(ch) + 1) // 2
    g = Image.new('RGB', (cols * (3 * P + 30), rws * (P + 30)), (0, 0, 0))
    for j, t in enumerate(ch):
        g.paste(t, ((j % 2) * (3 * P + 30), (j // 2) * (P + 30)))
    g.save(SH + '/review/%s_%d.png' % (room, k // per))
    print(SH + '/review/%s_%d.png' % (room, k // per))
