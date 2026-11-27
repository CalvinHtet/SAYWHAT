/* ---------- Cal 2026-11-26: "Edit tasks" on the first list's own line ----------
   Cal: "Make the edit button on the same height as the priority and the 9. Rename it 'Edit tasks' so we can close the empty space gap".
   The Board's Edit button had a row of its own above the task lists. It now sits in the first list's heading (Priority, or the first
   category), between the name and the count, and reads "Edit tasks" ("Done" while editing). With a single list that has no heading,
   it keeps its own row as before. */
function v94Edit(){try{if(typeof view!=="undefined"&&view!=="board")return;var head=document.querySelector("#app .qhead");if(!head)return;var b=head.querySelector(".qedit");if(!b)return;
    var h=document.querySelector("#app section.cluster > header");
    b.textContent=b.classList.contains("on")?"Done":"Edit tasks";if(!h)return;
    var cnt=h.querySelector(".note");b.classList.add("v94");if(cnt)h.insertBefore(b,cnt);else h.appendChild(b);h.classList.add("v94h");head.remove()}catch(e){}}
var v94Render=render;render=function(){var r=v94Render.apply(this,arguments);v94Edit();return r};
htabCss("qb-v194-css",".cluster header.v94h:not(.hasart){align-items:center}.cluster header.v94h.hasart .note{align-self:flex-end}.cluster header.v94h .qedit.v94{margin-left:auto;min-height:32px;padding:6px 14px;white-space:nowrap}"
  +".cluster header.v94h.hasart .qedit.v94{background:rgba(10,9,18,.7)}.cluster header.v94h.hasart .qedit.v94.on{background:var(--accent);color:var(--accent-ink)}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV194={run:v94Edit};
