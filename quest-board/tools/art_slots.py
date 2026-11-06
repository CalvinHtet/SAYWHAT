#!/usr/bin/env python3
"""Every picture slot the game reads by name, and whether its file is in art/app yet (LEAD; Cal: "plug and play").

    python3 quest-board/tools/art_slots.py          print the table and rewrite docs/ART_SLOTS.md

Drop a file with the slot's exact name into quest-board/art/app, rebuild, and it shows: no code change. Until then each slot
has a drawn stand-in, listed in the last column. Room furniture and walls are ROOMS's (data/rsart.json, 27_rooms.js) and
not listed here."""
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ART = os.path.join(ROOT, "art", "app")
BRANDS = ["hanga", "y2k", "over", "rose", "alt"]
CLASSES = ["tamer", "swiftblade", "runeweaver", "vanguard"]
TEAM = ["sable", "mara", "rafe", "nova", "theo"]
SLOTS = [  # (group, file names, size, where it shows, stand-in until it exists)
    ("Classes", ["ui_class_%s_%s.webp" % (c, b) for c in CLASSES for b in "mf"], "360 x 480",
     "Class choice and job banner, the player's body", "the old class picture"),
    ("Team", ["ui_team_%s.webp" % t for t in TEAM], "720 x 400", "Join banner, team cards on the Dungeons tab",
     "initials on the member's colour"),
    ("Story scenes", ["ui_story_%s.webp" % s for s in ["chef", "lockkey", "rafe", "mall", "nova", "auditorium"]], "300 x 400",
     "The scene that opens each story step (step id: chef is Mara, lockkey Desmond, mall Priya, auditorium Theo)",
     "initials"),
    ("Return visits", ["ui_story_sable.webp"], "300 x 400",
     "Sable's later visits (Mara and Theo reuse ui_story_chef and ui_story_auditorium)", "her team banner, then initials"),
    ("Brand banners", ["ui_banner_%s.webp" % b for b in BRANDS], "1600 x 600", "Top of each brand's Shop tab",
     "the brand's colours and logo"),
    ("Portrait banners", ["ui_banner_%s_p.webp" % b for b in BRANDS], "720 x 1080", "The weekly drop window",
     "the landscape banner, cropped"),
    ("Brand logos", ["logo_%s.webp" % b for b in BRANDS], "512 x 512", "Banner and drop window wordmark", "brand name in type"),
    ("Dungeon gift", ["ui_gift.webp"], "256 x 256", "A mission's gift before it opens", "a drawn crate"),
    ("Goblin King's Regalia", ["ui_tr_goblin_%s.webp" % p for p in ["helm", "chest", "greaves", "boots", "sword", "set"]],
     "256 x 256", "Gift reveal, Trophies tab (set: its emblem)", "a crown glyph"),
    ("Hollow Amulet", ["ui_tr_amulet_%s.webp" % p for p in ["dusk", "ember", "tide", "thorn", "silence", "set"]], "256 x 256",
     "Gift reveal, Trophies tab (set: its emblem)", "a diamond glyph"),
    ("Relics", ["ui_relic_%s.webp" % r for r in ["streak", "team", "build", "exped", "quests", "collect"]], "128 x 128",
     "Relics tab, one icon for all three tiers", "a star glyph"),
    ("Daily Quest", ["ui_dq_chest.webp", "ui_hidden_quest.webp"], "256 x 256, 512 x 300", "Daily Quest chest, the hidden quest",
     "a drawn crate, no picture"),
    ("Stats", ["ui_stat_%s.webp" % s for s in ["str", "agi", "vit", "int"]], "64 x 64", "Stat chips on the Daily Quest card",
     "text only"),
    ("Town", ["ui_town_board.webp"], "720 x 300", "Town hall card on the Hall tab", "the plain card"),
    ("Buildings", ["bld_%s.webp" % b for b in ["loft", "plaza", "mall"]] + ["bld_bg_%s.webp" % b for b in ["loft", "plaza", "mall"]],
     "per ROOMS", "Street view and inside each building", "drawn blocks"),
]
PLANNED = [  # named in plans, not read by the code yet
    ("Rift Mask", "a dungeon-only wearable (item dg_riftmask, one sheet, every angle, both bodies)", "TASKS.md, ROOMS"),
    ("The artifact", "ten stone pieces for levels 91 to 100, and the portal", "docs/PRESTIGE.md (later)"),
    ("Hidden quest rewards", "rare furniture pieces and cosmetic shards", "QA.md proposal (later)"),
]


def main():
    have = set(os.listdir(ART)) if os.path.isdir(ART) else set()
    out = ["# Art slots (plug and play)", "",
           "Written by `tools/art_slots.py` (LEAD). Drop a file with the exact name into `quest-board/art/app`, run",
           "`python3 quest-board/tools/build.py`, and it shows in the game with no code change. Until then the stand-in in the last",
           "column shows. Rerun the script to refresh this page.", ""]
    total = got = 0
    for group, names, size, where, stand in SLOTS:
        miss = [n for n in names if n not in have]
        total += len(names)
        got += len(names) - len(miss)
        state = "all in" if not miss else ("missing: " + ", ".join("`%s`" % m for m in miss))
        out.append("## %s (%d of %d)" % (group, len(names) - len(miss), len(names)))
        out.append("")
        out.append("- Files: " + ", ".join("`%s`" % n for n in names))
        out.append("- Size: %s. Shows: %s. Until then: %s." % (size, where, stand))
        out.append("- Status: " + state)
        out.append("")
    out += ["## Planned, not read by the code yet", ""] + ["- %s: %s (%s)." % p for p in PLANNED] + [""]
    out.insert(5, "**%d of %d slots filled.**" % (got, total))
    out.insert(6, "")
    open(os.path.join(ROOT, "docs", "ART_SLOTS.md"), "w", encoding="utf-8").write("\n".join(out))
    for group, names, *_ in SLOTS:
        miss = [n for n in names if n not in have]
        print("%-24s %d/%d %s" % (group, len(names) - len(miss), len(names), ("missing " + " ".join(miss)) if miss else ""))
    print("filled %d of %d" % (got, total))


if __name__ == "__main__":
    main()
