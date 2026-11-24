# Text audit, 2026-11-24: music- and Cal-specific player-visible text

Cal 11-24: "Make sure no chores or bounties or anything in the app is very specific to music production or my own life. It needs to be
a general productivity tool." A read-only sweep of app/src and data by a LEAD subagent. Line numbers are physical lines in app/src.

## LEAD fixes these (text only, no art, no decision needed)
- 10_app_a.js:250-256 Runeweaver: tag "Shape sound into spells." -> ideas; role "For makers: music, video..." -> art, writing, video,
  crafts; the story (tune, humming, melody) and the fork (stages, note by note, cathedral of music) -> a maker's story.
- 10_app_a.js:289 Songcaller "For shows and big moments." -> big moments and deadlines. :292 Spellwright "For studio days and deep
  creative work." -> deep creative work; skill "Studio Flow" -> "Deep Flow". :295 Cantor "Heal the room with a melody." -> with calm.
  Skill/place/rival/relic names with stage or composing words (Golden Baton, Tower of Quiet Notes, Unfinished Melody, Silver Tuning
  Fork, Perfect Pitch, Sage Composer, Void Composer): rename to neutral maker words. Path NAMES stay (Cal: "keep everything else").
- 10_app_a.js:48 title "Sound Smith" -> "Maker". :743 "Studio Headphones: For the producers." -> deep-focus hours. :760 "Tired Eyes:
  Producer hours." -> late-night hours.
- 10_app_a.js:1651 club "Calibur on the decks" -> "A DJ on the decks"; :1668 "Sunset sets by Calibur" -> a guest DJ.
- 20_loft.js:2003 film titles "Bass Drop 2", "Calibur: Live", "Pluto vs. The Vacuum" -> neutral titles. :1833 "Best {i} in LA" -> in town.
- 30_app_b.js:1861 guess() creativity regex (mix, master, beat, track, mashup, epk) -> general making words ("track" also catches
  "track spending"). :1882-1884 PARSE: creativity "(music, video, design...)" -> art, writing, music, video, design, crafts; "dogs" ->
  pets; the example "call Sydney" -> "call your partner". 29zu_ui92.js:9 minutes estimator (produc|mixing|master|studio at 120 min) ->
  general making words.
- 30_app_b.js:697-699 coach lines ("You are the headliner!", "Another hit for the album!") -> neutral hype.
- 10_app_a.js:266 Tamer role "friends, your partner, your dogs" -> friends, family, partner, pets. :45 rank B "Crimson stage interface"
  -> "Crimson interface". Runeweaver signature "Encore" stays (common word).
- 29f_bounty.js: six music hobby bounties to about two art ones: swap three for craft/writing/photo.
- 29zs_side.js "Walkies" (Pluto and Chopstick as quest NPCs) and 27_rooms.js:45-48, :207 (Adopt Pluto / Chopstick, their beds): go
  with the pet rework (spec item 15).

## Needs Cal (asked in the end-of-work batch, not before)
1. The Studio room is a recording studio (monitors, synth, vocal booth; services Mix, Master, Stems, Beat). Its art is painted that
   way. Keep as one of the town's rooms (like the Club), or rework it as a general creative studio (new art)?
2. The visitors roster is Cal's real friends (Justin, Vega, Logan, Kenan, Jina, Cynthia, Memo, Kris, Alvina, Nick, Ben, Kevin, Victor),
   some with music lines (rehearsal, jam session). Keep them for every player, or swap for fictional neighbours?
3. Los Angeles: the weather line ("Morning in LA"), Living Sky / Live Weather / Your Skyline, the Patio "30 floors above Los Angeles".
   Keep LA as the game's city, or make it "the city"?
4. "Calibur Mall" (and "Kode Plaza"): keep as the town's place names?
5. SAYMORE's brand line "bass culture", "DJ Headphones", "Bass Shorts": the game's own brand, kept unless Cal says otherwise.

## Clean
Default quests, rewards, clusters and stats, dungeons, the team, tours, letters, the Daily Quest, data/*.json.
