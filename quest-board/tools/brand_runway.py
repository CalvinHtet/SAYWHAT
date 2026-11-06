#!/usr/bin/env python3
"""How long until the Shop runs out of NEW brands (Cal, 2026-11-06: "I want there to be an automatic generation of new brand
assets when it gets close to running out. And it can run through without my approval as long as it works").

Reads BRANDS (app/src/10_app_a.js) and DROPS (app/src/29l_drops.js) the same way the game does:
  - DROPS.on false: each brand drops on its own `start` date (today's one-a-week list).
  - DROPS.on true:  brands fill Monday/Thursday slots from DROPS.launch, one per slot.
Prints the last new drop's date and the days left, and exits 2 when fewer than RUNWAY_DAYS remain, which is ROOMS's signal to
make the next brand (docs/BRAND_AUTOGEN.md). Brands only count once they are in BRANDS, i.e. their art is in the build.

    python3 tools/brand_runway.py            # report
    python3 tools/brand_runway.py --days 28  # a different threshold
"""
import datetime as dt
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RUNWAY_DAYS = 21  # a brand is ~16 sheets plus QA's wear test: start three weeks before the last new drop


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()


def brands():
    src = read("app/src/10_app_a.js")
    block = src[src.index("var BRANDS=["):src.index("];", src.index("var BRANDS=["))]
    return [(m.group(1), m.group(2), m.group(3)) for m in re.finditer(r'\{id:"([^"]+)",name:"([^"]+)".*?start:"(\d{4}-\d{2}-\d{2})"', block)]


def drops():
    src = read("app/src/29l_drops.js")
    m = re.search(r"var DROPS=\{on:(true|false),launch:\"(\d{4}-\d{2}-\d{2})\"", src)
    return m.group(1) == "true", dt.date.fromisoformat(m.group(2))


def slot_date(launch, k):
    return launch + dt.timedelta(days=(k // 2) * 7 + (3 if k % 2 else 0))


def main():
    days = RUNWAY_DAYS
    if "--days" in sys.argv:
        days = int(sys.argv[sys.argv.index("--days") + 1])
    bs = brands()
    on, launch = drops()
    if on:
        last = slot_date(launch, len(bs) - 1)
        mode = "launch schedule (Mon/Thu from %s)" % launch
    else:
        last = max(dt.date.fromisoformat(s) for _, _, s in bs)
        mode = "weekly dates in BRANDS"
    today = dt.date.today()
    left = (last - today).days
    unreleased = [n for _, n, s in bs if not on and dt.date.fromisoformat(s) > today] if not on else []
    print("Mode: %s. Brands in the build: %d." % (mode, len(bs)))
    if unreleased:
        print("Not dropped yet: " + ", ".join(unreleased))
    print("Last new drop: %s (%d days from today, %s)." % (last, left, today))
    if left < days:
        print("NEED A NEW BRAND: fewer than %d days of new drops left. ROOMS: start the next one (docs/BRAND_AUTOGEN.md)." % days)
        sys.exit(2)
    print("OK: %d days of new drops left (threshold %d)." % (left, days))


if __name__ == "__main__":
    main()
