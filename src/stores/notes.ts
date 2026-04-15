import { defineStore } from "pinia";
import { createSeedNotes } from "@/data/seedNotes";
import { NOTE_TEMPLATES } from "@/data/templates";
import type { Note } from "@/types/note";
import { noteMatchesQuery, plainTextFromHtml, sortPinnedFirst } from "@/utils/notes";

const STORAGE_KEY = "aura-notes-v1";

function newId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useNotesStore = defineStore("notes", {
  state: (): { notes: Note[]; hydrated: boolean } => ({
    notes: [],
    hydrated: false,
  }),
  getters: {
    sortedNotes: (s): Note[] => sortPinnedFirst(s.notes),
    noteCount: (s): number => s.notes.filter((n) => !n.archived).length,
  },
  actions: {
    hydrate(): void {
      if (this.hydrated) return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          if (Array.isArray(parsed)) this.notes = parsed as Note[];
        } else {
          this.notes = createSeedNotes();
          this.persist();
        }
      } catch {
        this.notes = createSeedNotes();
        this.persist();
      }
      this.hydrated = true;
    },

    persist(): void {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notes));
    },

    getById(id: string): Note | null {
      return this.notes.find((n) => n.id === id) ?? null;
    },

    createNote(overrides: Partial<Note> = {}): string {
      const now = new Date().toISOString();
      const note: Note = {
        id: newId(),
        title: "",
        excerpt: "",
        category: "Journal",
        pillTags: [],
        tags: [],
        favorite: false,
        archived: false,
        heroImageUrl: null,
        imageUrl: null,
        checklist: null,
        statusLabels: null,
        bodyHtml: "<p><br></p>",
        updatedAt: now,
        createdAt: now,
        ...overrides,
      };
      this.notes.unshift(note);
      this.persist();
      return note.id;
    },

    updateNote(id: string, patch: Partial<Note>): void {
      const i = this.notes.findIndex((n) => n.id === id);
      if (i === -1) return;
      this.notes[i] = {
        ...this.notes[i],
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      this.persist();
    },

    deleteNote(id: string): void {
      this.notes = this.notes.filter((n) => n.id !== id);
      this.persist();
    },

    toggleFavorite(id: string): void {
      const n = this.getById(id);
      if (!n) return;
      this.updateNote(id, { favorite: !n.favorite });
    },

    applyTemplate(id: string, templateId: string): void {
      const t = NOTE_TEMPLATES.find((x) => x.id === templateId);
      if (!t || !this.getById(id)) return;
      const excerpt = plainTextFromHtml(t.bodyHtml).slice(0, 220);
      this.updateNote(id, {
        title: t.title,
        category: t.category,
        bodyHtml: t.bodyHtml,
        tags: [...t.tags],
        excerpt,
      });
    },

    searchNotes(q: string): Note[] {
      return this.sortedNotes.filter((n) => noteMatchesQuery(n, q));
    },
  },
});
