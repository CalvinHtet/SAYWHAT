#!/usr/bin/env python3
"""LEAD's version check (TEAMWORK.md rule 14): is everyone on the same version?

    python3 quest-board/tools/version_check.py         run from anywhere in the repo

Checks, and says what to do about each mismatch:
  - main is pushed and matches GitHub
  - uncommitted files, by the chat that owns them (Part 4 of TEAMWORK.md)
  - every Doing line in docs/TASKS.md ends "(on <commit>)" and that commit has the same game files as the latest one
    (a commit that only touches docs does not make anyone out of date)
  - test copies (git worktree list): on the latest game files, or stale
  - APPV in the code against the live APPV in docs/TASKS.md
Exit code 1 when something must be sorted before a publish.
"""
import os
import re
import subprocess
import sys
import time

ROOT = subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True).stdout.strip()
os.chdir(ROOT)
GAME = ["quest-board/app", "quest-board/src", "quest-board/data", "quest-board/art/app", "quest-board/tools/build.py"]
ROOMS = ("quest-board/app/src/20_loft.js", "quest-board/app/src/21_restaurant.js", "quest-board/app/src/22_garden.js",
         "quest-board/app/src/23_theater.js", "quest-board/app/src/26_world.js", "quest-board/app/src/27_rooms.js",
         "quest-board/app/src/27b_skins.js", "quest-board/src/loft_bridge.js", "quest-board/data/items.json",
         "quest-board/data/loft.json", "quest-board/data/rsart.json", "quest-board/art/")
ROOMS_TOOLS = ("rs_art.py", "rs_fix.py", "closet_stages.py", "items.py", "ingest_items.py", "pack.py", "strip_mannequin.py",
               "shell_guide.py", "shell_sheet.py", "shell_styles.py", "yawn_cut.py", "ingest4.sh", "ingest.sh", "iris.py",
               "shell_wallcopy.py", "key_bg.py", "yawn_body_mix.py")
SHARED = ("quest-board/app/index.html", "quest-board/docs/TASKS.md", "quest-board/docs/HANDOFF.md")


def git(*a):
    return subprocess.run(["git", *a], capture_output=True, text=True).stdout.strip()


def owner(path):
    if path.startswith(SHARED):
        return "shared"
    if path.startswith(("quest-board/rigtest/qa", "quest-board/docs/QA.md", "shots/", "quest-board/shots/")):
        return "QA"
    # LEAD writes only build.py and version_check.py among the tools; every other tool is ROOMS's art tooling
    if path.startswith(ROOMS) or (path.startswith("quest-board/tools/") and os.path.basename(path) not in ("build.py", "version_check.py", "art_slots.py")):
        return "ROOMS"
    return "LEAD"


def same_game(a, b):
    return subprocess.run(["git", "diff", "--quiet", a, b, "--", *GAME]).returncode == 0


problems, notes = [], []
head = git("rev-parse", "--short", "HEAD")
branch = git("branch", "--show-current")
subprocess.run(["git", "fetch", "-q", "origin"], capture_output=True)
ahead, behind = git("rev-list", "--left-right", "--count", "HEAD...origin/main").split()
print(f"latest commit {head} on {branch}; GitHub: {ahead} ahead, {behind} behind")
if branch != "main":
    problems.append(f"the folder is on branch {branch}, not main")
if ahead != "0":
    problems.append(f"{ahead} commit(s) not pushed: whoever made them pushes now")
if behind != "0":
    problems.append(f"GitHub has {behind} commit(s) this folder lacks: LEAD pulls (fast-forward only)")

# uncommitted work, by owner
dirty = {}
for line in subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True).stdout.splitlines():
    p = line[3:].strip()
    dirty.setdefault(owner(p), []).append(p)
for who, files in sorted(dirty.items()):
    short = ", ".join(os.path.relpath(f, "quest-board") for f in files[:6]) + (f" and {len(files) - 6} more" if len(files) > 6 else "")
    msg = f"uncommitted, {who}: {short}"
    (problems if who in ("LEAD", "shared") else notes).append(msg if who != "shared" else msg + " (whoever edited it commits it)")

# Doing lines
tasks = open("quest-board/docs/TASKS.md", encoding="utf-8").read()
# a garbled board (7ad5b1a: a text replace with an empty pattern put a line between every character, 40 KB became 20 MB)
if len(tasks) > 300000 or tasks.count("(on ") > 40:
    problems.append(f"docs/TASKS.md looks garbled ({len(tasks) // 1000} KB, {tasks.count('(on ')} Doing stamps): restore it from the last good commit")
for sec in re.finditer(r"^## (LEAD|ROOMS|QA)\b.*?$(.*?)(?=^## |\Z)", tasks, re.M | re.S):
    who, body = sec.group(1), sec.group(2)
    lines = body.split("\n")
    doing = ""
    if "Doing:" in lines:
        rest = lines[lines.index("Doing:") + 1:]
        keep = []
        for ln in rest:
            if not ln.strip() or not (ln.startswith("-") or ln.startswith(" ")):
                break
            keep.append(ln)
        doing = "\n".join(keep).strip()
    if not doing:
        notes.append(f"{who}: Doing line empty")
        continue
    ons = re.findall(r"\(on ([0-9a-f]{7,})\)", doing)
    if not ons:
        problems.append(f"{who}: Doing line has no (on <commit>)")
        continue
    on = ons[-1]
    if not git("rev-parse", "--verify", "-q", on + "^{commit}"):
        problems.append(f"{who}: Doing line names {on}, not a commit here")
    elif not same_game(on, "HEAD"):
        problems.append(f"{who}: Doing line is on {on}, game files changed since; rebuild on {head}")
    else:
        print(f"{who}: on {on}, same game files as {head}")

# test copies
now = time.time()
for block in git("worktree", "list", "--porcelain").split("\n\n"):
    path = re.search(r"^worktree (.*)$", block, re.M)
    sha = re.search(r"^HEAD ([0-9a-f]+)$", block, re.M)
    if not path or not sha or os.path.abspath(path.group(1)) == ROOT:
        continue
    p, c = path.group(1), sha.group(1)[:7]
    age = (now - os.path.getmtime(p)) / 3600 if os.path.exists(p) else None
    tag = "missing (git worktree prune)" if age is None else f"{age:.1f} h old"
    where = "LEAD" if "spare-MOWpiM" in p else "another chat"
    msg = f"test copy {p} at {c}, {tag}, belongs to {where}"
    if age is None or not same_game(c, "HEAD"):
        (problems if where == "LEAD" else notes).append(msg + ": stale, its owner removes it")
    else:
        print(msg + ": current")

# APPV
code = re.search(r"APPV=(\d+)", open("quest-board/app/src/30_app_b.js", encoding="utf-8").read())
live = re.search(r"Live on the phone: `APPV` (\d+)", tasks)
code, live = int(code.group(1)) if code else None, int(live.group(1)) if live else None
print(f"APPV in code {code}, live per TASKS.md {live}")
if code is not None and live is not None and code != live:
    notes.append(f"APPV in code {code} differs from live {live}: a publish is pending or TASKS.md is out of date")

for n in notes:
    print("  note: " + n)
for p in problems:
    print("  FIX:  " + p)
print("version check:", "clear" if not problems else f"{len(problems)} to fix before publishing")
sys.exit(1 if problems else 0)
