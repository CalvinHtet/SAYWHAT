# SPEC 5 for LEAD (from ARCHITECT, Cal 2026-11-10 ~10:35): legendary levels, Rafe photo-only, Sable "Night watch", photo feed with likes and comments

Cal's words in quotes. Supersedes the matching parts of SPEC3/SPEC4.

## STALE WORK IN THE QUEUES (check first)
- w-rafe (queued): first hunt is level 27, not 25; levels 27/52/77/93; no honor fallback; the hunt is how you meet Rafe (part 1).
- w-sidequests (queued): Sable's quest is now "Night watch" (part 2); honor fallback question (part 2).
- w-photos W8/W9 (queued): grows into a feed with a post view, likes and comments (part 3).

## 1. Rafe's legendary hunts: levels and rules
Cal: "Legendary levels can be lvl 27, 52, 77, and 93." "The hunt is how you meet him." "No two active days. Just go outside for a
walk or do something active."
- Hunts at levels 27, 52, 77 and 93 (each stronger than the last).
- The first hunt is how the player meets Rafe (if he has not joined yet); later he can still show up at the Lock and Key as today,
  and his bar scene must not introduce him a second time.
- Photo only: a fresh camera photo of being outside on a walk or doing something active, checked like a trial photo. No honor
  path. Rejected: he says what he needs; try again any time.

## 2. Sable's side-quest: "Night watch"
Cal: "Go to bed before midnight is a good one and you have to take a picture of a clock."
- A camera photo of a clock (wall, alarm or phone clock) showing a time before midnight, taken fresh (the photo's own time also
  before midnight, game clock). The check: a clock is visible and reads before 12:00 am.
- Defaults (Cal not asked): 3 nights in a row; reward: Sable finds a hidden dungeon (one extra dungeon in Crawls), or an extra crawl
  a day for a week if all dungeons are open. Scene in Sable's voice (terse).
- Side-quests and the honor fallback: SPEC4 said "honor after 2 active days, as trials". Cal said no for Rafe; ARCHITECT asked Cal
  whether side-quests are also photo-only. Until he answers: photo-only for all side-quests too.

## 3. Photo feed on the town board (extends W8 + W9, w-photos)
Cal: "I want the option to be able to post my workout proof or any proof to the town board for everyone to view and react on. The
board could be like an instagram feed where you can click on the board and itll open up the post, with how many likes, and you can
also comment on it. Only the person who posted it can delete their own comments. or the person who created the post can delete any
comments. Think of Dave The Diver and how they had a social media page with likes and comments" (mood only: no names or art from it).
- Posting: after any photo proof is verified and paid (quests, workouts, trials, Rafe, side-quests), "Post to the board" with an
  optional short caption, or skip. Also a plain "Post a photo" on the board (W8). Never automatic.
- Feed: the board's Posts tab shows photo posts as cards (photo, poster's look and name, caption, time, like and comment counts).
  Tap a card: the post opens full screen with the photo, likes (tap to like, one per person, who liked), and comments.
- Comments: anyone signed in can comment. A comment's author can delete it; the post's author can delete any comment on their post;
  the post's author can delete the post. Enforced in firestore.rules, not only the UI (rules can read the post's owner).
- Storage: photos do not fit in a board doc well. Prefer Firebase Storage (downscaled to about 1080 px JPEG/WebP, ~150-250 KB, a
  small thumbnail for the feed), with storage rules: signed-in read, only the owner writes or deletes their own files. If Storage is
  not set up on the project, say so: the Mac README then needs the Storage setup and `firebase deploy --only storage`.
- Performance: the feed loads thumbnails only, full photo on open; 30 newest posts at a time (W1 is measuring load now).
- Privacy: a post is visible to every signed-in player; the poster can delete it any time (photo file removed too).
- Coins/XP: none for posting, likes or comments (no farming). Optional later.

## Acceptance checks
- Rafe: hunt fires at 27, 52, 77, 93 once each; first hunt introduces him; photo accepted/rejected; no honor path.
- Night watch: clock photo before midnight passes, after midnight or no clock fails; 3 nights in a row; reward once.
- Feed: post with and without caption; open a post; like once; comment; comment author deletes own; post author deletes another's
  comment; a third player cannot delete either (rules tested); deleting a post removes its photo; two phones see it live.
