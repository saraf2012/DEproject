import type { Note } from "@/types/note";

export function plainTextFromHtml(html: string): string {
  if (!html) return "";
  if (typeof document !== "undefined") {
    const el = document.createElement("div");
    el.innerHTML = html;
    return el.textContent?.replace(/\s+/g, " ").trim() || "";
  }
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function filterNotesByTag(notes: Note[], tag: string | null | undefined): Note[] {
  const t = (tag ?? "").trim().toLowerCase();
  if (!t) return notes;
  return notes.filter((n) => {
    if (n.archived) return false;
    const all = [...(n.tags || []), ...(n.pillTags || [])].map((x) => x.toLowerCase());
    return all.includes(t);
  });
}

export function sortPinnedFirst(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    if (Boolean(a.favorite) !== Boolean(b.favorite)) {
      return b.favorite ? 1 : -1;
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function noteMatchesQuery(note: Note, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  if (note.archived) return false;
  const blob = [
    note.title,
    note.excerpt,
    note.category,
    note.bodyHtml ? plainTextFromHtml(note.bodyHtml) : "",
    ...(note.tags || []),
    ...(note.pillTags || []),
  ]
    .join(" ")
    .toLowerCase();
  return blob.includes(needle);
}
