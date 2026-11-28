/* ---------- Cal 2026-11-27: links in posts open; the post window's corners frame the whole post ----------
   Cal: "Can you make links clickable instead of as plain text?" A web link (http:// or https://) in a comment or a post's caption opens
   in a new tab. The text is escaped first, so only real links become links; a full stop or bracket right after a link stays text.
   Cal: "the bottom left and bottom right borders are at the bottom of the last comment rather than all the way at the bottom of the page
   borders": the post window scrolled inside its own card (.ph-modal .card), so the HUD corner brackets (body.fx-brackets .card::before)
   scrolled away with the comments. The window itself scrolls now, the card is as tall as the post, and its four corners frame all of it;
   the close button stays pinned at the top (it is sticky). */
/* QA 789e4bc5: links are found in the raw text (quotes and brackets around a link stay outside it), and every piece is escaped on
   its own; trailing punctuation stays outside, except a ")" that closes a "(" inside the link (Foo_(bar)) */
function phLink(s){s=String(s==null?"":s);var re=/\bhttps?:\/\/[^\s<>"']+/gi,out="",last=0,m;
  while((m=re.exec(s))){var u=m[0],tail="",t=/[.,!?;:)\]&]+$/.exec(u);if(t){tail=t[0];u=u.slice(0,-tail.length)}
    while(tail.charAt(0)===")"&&u.split("(").length>u.split(")").length){u+=")";tail=tail.slice(1)}
    out+=esc(s.slice(last,m.index))+(u.length>8?'<a class="ph-link" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer nofollow">'+esc(u)+'</a>':esc(u))+esc(tail);last=m.index+m[0].length}
  return out+esc(s.slice(last))}
htabCss("qb-v225-css",".ph-modal .card{max-height:none!important;overflow:visible!important}.ph-link{color:var(--accent);text-decoration:underline;word-break:break-all}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV225={link:phLink};
