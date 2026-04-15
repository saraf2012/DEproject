export function exec(root: HTMLElement | null, command: string, value?: string): boolean {
  root?.focus();
  try {
    return document.execCommand(command, false, value ?? undefined);
  } catch {
    return false;
  }
}

const SIZE = { min: 14, max: 36, step: 2 };

export function bumpFontSize(root: HTMLElement | null, deltaPx: number): number | null {
  if (!root) return null;
  root.focus();
  const sel = window.getSelection();
  if (!sel?.rangeCount) return null;

  if (sel.isCollapsed) {
    const px = parseFloat(getComputedStyle(root).fontSize) || 18;
    const next = Math.min(SIZE.max, Math.max(SIZE.min, Math.round(px + deltaPx)));
    root.style.fontSize = `${next}px`;
    return next;
  }

  const range = sel.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return null;

  let px = 18;
  let n: Node | null = range.commonAncestorContainer;
  if (n.nodeType === Node.TEXT_NODE) n = (n as Text).parentElement;
  if (n && root.contains(n) && n instanceof Element) {
    px = parseFloat(getComputedStyle(n).fontSize) || 18;
  }
  const next = Math.min(SIZE.max, Math.max(SIZE.min, Math.round(px + deltaPx)));

  document.execCommand("styleWithCSS", false, "true");
  const frag = range.extractContents();
  const span = document.createElement("span");
  span.style.fontSize = `${next}px`;
  span.appendChild(frag);
  range.insertNode(span);
  sel.removeAllRanges();
  const nr = document.createRange();
  nr.selectNodeContents(span);
  sel.addRange(nr);
  return next;
}

export function toggleCodeBlock(root: HTMLElement | null): void {
  root?.focus();
  const sel = window.getSelection();
  if (!sel?.rangeCount || !sel.anchorNode || !root?.contains(sel.anchorNode)) return;

  let el: Node | null = sel.anchorNode;
  if (el.nodeType === Node.TEXT_NODE) el = el.parentElement;
  const pre = el instanceof Element ? el.closest("pre") : null;

  document.execCommand("styleWithCSS", false, "true");
  if (pre && root.contains(pre)) {
    document.execCommand("formatBlock", false, "p");
  } else {
    document.execCommand("formatBlock", false, "pre");
  }
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export function promptAndLink(root: HTMLElement | null): void {
  const url = window.prompt("Link URL (https://…)");
  if (!url?.trim()) return;
  const u = url.trim();
  root?.focus();
  const sel = window.getSelection();
  if (sel?.isCollapsed) {
    document.execCommand(
      "insertHTML",
      false,
      `<a href="${escapeAttr(u)}">${escapeAttr(u)}</a>`
    );
    return;
  }
  document.execCommand("createLink", false, u);
}

export function promptAndImage(root: HTMLElement | null): void {
  const url = window.prompt("Image URL");
  if (!url?.trim()) return;
  root?.focus();
  document.execCommand("insertImage", false, url.trim());
}
