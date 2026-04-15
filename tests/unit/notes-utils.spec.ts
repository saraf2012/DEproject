import { describe, it, expect } from "vitest";
import type { Note } from "@/types/note";
import {
  filterNotesByTag,
  noteMatchesQuery,
  plainTextFromHtml,
  sortPinnedFirst,
} from "@/utils/notes";

const base = (overrides: Partial<Note> = {}): Note => ({
  id: "1",
  title: "T",
  excerpt: "",
  category: "General",
  pillTags: [],
  tags: [],
  favorite: false,
  archived: false,
  heroImageUrl: null,
  imageUrl: null,
  checklist: null,
  statusLabels: null,
  bodyHtml: "<p>hello world</p>",
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("plainTextFromHtml", () => {
  it("strips tags", () => {
    expect(plainTextFromHtml("<p>a <b>b</b></p>")).toBe("a b");
  });
});

describe("filterNotesByTag", () => {
  it("returns all when tag empty", () => {
    const notes = [base({ tags: ["a"] }), base({ id: "2", tags: ["b"] })];
    expect(filterNotesByTag(notes, "")).toHaveLength(2);
  });

  it("filters by tags or pillTags", () => {
    const notes = [
      base({ id: "1", tags: ["work"], pillTags: [] }),
      base({ id: "2", tags: [], pillTags: ["play"] }),
    ];
    const r = filterNotesByTag(notes, "work");
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe("1");
  });
});

describe("sortPinnedFirst", () => {
  it("orders favorite before non-favorite", () => {
    const a = base({ id: "a", favorite: false, updatedAt: "2026-01-02T00:00:00Z" });
    const b = base({ id: "b", favorite: true, updatedAt: "2026-01-01T00:00:00Z" });
    const sorted = sortPinnedFirst([a, b]);
    expect(sorted.map((n) => n.id)).toEqual(["b", "a"]);
  });
});

describe("noteMatchesQuery", () => {
  it("matches title and body text", () => {
    const n = base({ title: "Hello", bodyHtml: "<p>hidden content</p>" });
    expect(noteMatchesQuery(n, "hello")).toBe(true);
    expect(noteMatchesQuery(n, "hidden")).toBe(true);
    expect(noteMatchesQuery(n, "nope")).toBe(false);
  });

  it("ignores archived", () => {
    const n = base({ archived: true, title: "Visible title" });
    expect(noteMatchesQuery(n, "visible")).toBe(false);
  });
});
