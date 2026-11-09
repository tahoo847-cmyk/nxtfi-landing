let note: HTMLElement | null = null;
let head: HTMLElement | null = null;
let line: SVGLineElement | null = null;
let dot: SVGCircleElement | null = null;

function find() {
  if (note?.isConnected) return;
  note = document.querySelector("[data-s4-note]");
  head = document.querySelector("[data-s4-head]");
  line = document.querySelector("[data-s4-link] line");
  dot = document.querySelector("[data-s4-link] circle");
}

/** Levels the info box with the terminal's rendered anchor and runs the connector between them. `null` hands the box back to CSS. */
export function placeLink(to: { x: number; y: number } | null) {
  find();
  if (!note || !head || !line || !dot) return;
  if (!to) {
    if (note.style.top) note.style.top = "";
    return;
  }

  const tall = note.offsetHeight;
  const lowest = head.offsetTop + head.offsetHeight + 28;
  const highest = note.parentElement!.clientHeight - tall - 64;
  const top = Math.round(Math.min(highest, Math.max(lowest, to.y - tall / 2)));
  if (note.style.top !== `${top}px`) note.style.top = `${top}px`;

  const [x1, y1, x2, y2] = [note.offsetLeft + note.offsetWidth, top + Math.round(tall / 2), to.x, to.y].map(String);
  if (line.getAttribute("x2") === x2 && line.getAttribute("y2") === y2 && line.getAttribute("y1") === y1 && line.getAttribute("x1") === x1) return;
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  dot.setAttribute("cx", x2);
  dot.setAttribute("cy", y2);
}
