import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useNotesStore } from "@/stores/notes";

describe("useNotesStore", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("createNote adds a note and returns id", () => {
    const store = useNotesStore();
    store.notes = [];
    store.hydrated = true;
    const id = store.createNote({ title: "Hello" });
    expect(id).toBeTruthy();
    expect(store.notes).toHaveLength(1);
    expect(store.getById(id)?.title).toBe("Hello");
  });

  it("updateNote patches fields", () => {
    const store = useNotesStore();
    store.notes = [];
    store.hydrated = true;
    const id = store.createNote({ title: "A" });
    store.updateNote(id, { title: "B", favorite: true });
    expect(store.getById(id)?.title).toBe("B");
    expect(store.getById(id)?.favorite).toBe(true);
  });

  it("searchNotes filters by title", () => {
    const store = useNotesStore();
    store.notes = [];
    store.hydrated = true;
    store.createNote({ title: "Alpha", excerpt: "", archived: false });
    store.createNote({ title: "Beta", excerpt: "", archived: false });
    const r = store.searchNotes("alp");
    expect(r).toHaveLength(1);
    expect(r[0].title).toBe("Alpha");
  });

  it("sortedNotes lists pinned notes first", () => {
    const store = useNotesStore();
    store.notes = [];
    store.hydrated = true;
    const older = store.createNote({ title: "Old", favorite: false });
    const newer = store.createNote({ title: "New", favorite: true });
    expect(store.sortedNotes[0].id).toBe(newer);
    store.updateNote(newer, { favorite: false });
    store.updateNote(older, { favorite: true });
    expect(store.sortedNotes[0].id).toBe(older);
  });

  it("applyTemplate fills title and tags from preset", () => {
    const store = useNotesStore();
    store.notes = [];
    store.hydrated = true;
    const id = store.createNote({ title: "X" });
    store.applyTemplate(id, "meeting");
    const n = store.getById(id);
    expect(n?.title).toBe("Meeting notes");
    expect(n?.tags).toContain("meeting");
    expect(n?.category).toBe("Meeting");
  });
});
