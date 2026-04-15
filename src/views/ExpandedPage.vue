<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatRelative } from "@/lib/time";
import { useNotesStore } from "@/stores/notes";

const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();

const noteId = computed(() => {
  const p = route.params.id;
  return Array.isArray(p) ? p[0] : p;
});

const note = computed(() => (noteId.value ? notesStore.getById(noteId.value) : null));

const tagChips = computed(() => note.value?.tags?.map((t) => (t.startsWith("#") ? t : `#${t}`)) ?? []);

function togglePin() {
  if (note.value) notesStore.toggleFavorite(note.value.id);
}

function removeNote() {
  if (!note.value) return;
  notesStore.deleteNote(note.value.id);
  router.push("/");
}

async function shareNote() {
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    window.prompt("Copy link:", url);
  }
}

const pinIconStyle = computed(() =>
  note.value?.favorite ? { fontVariationSettings: "'FILL' 1" } : undefined
);
</script>

<template>
  <div v-if="note" class="min-h-screen bg-surface text-on-surface">
    <aside
      class="fixed left-0 top-0 z-50 flex h-screen h-full w-64 flex-col border-r-0 bg-slate-50 p-6 font-inter text-sm font-medium dark:bg-slate-950"
    >
      <div class="mb-10">
        <div class="flex items-center gap-3">
          <div class="signature-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white">
            <span class="material-symbols-outlined">auto_awesome</span>
          </div>
          <div>
            <h1 class="font-manrope text-lg font-bold text-violet-700">Aura Notes</h1>
            <p class="text-[10px] uppercase tracking-widest text-slate-500">Thought Sanctuary</p>
          </div>
        </div>
      </div>
      <nav class="flex flex-grow flex-col gap-2">
        <RouterLink
          to="/"
          class="flex items-center gap-3 rounded-full bg-violet-100 px-4 py-2 text-violet-700 transition-all dark:bg-violet-900/30 dark:text-violet-300"
        >
          <span class="material-symbols-outlined">description</span>
          <span>Notes</span>
        </RouterLink>
        <RouterLink
          :to="{ path: '/', query: { filter: 'favorites' } }"
          class="flex items-center gap-3 rounded-lg px-4 py-2 text-slate-600 transition-all hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <span class="material-symbols-outlined">star</span>
          <span>Favorites</span>
        </RouterLink>
        <RouterLink
          to="/search"
          class="flex items-center gap-3 rounded-lg px-4 py-2 text-slate-600 transition-all hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <span class="material-symbols-outlined">label</span>
          <span>Tags</span>
        </RouterLink>
        <RouterLink
          to="/settings"
          class="flex items-center gap-3 rounded-lg px-4 py-2 text-slate-600 transition-all hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <span class="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </RouterLink>
      </nav>
      <RouterLink
        to="/editor"
        class="mt-auto signature-gradient flex items-center justify-center gap-2 rounded-full py-3 px-6 font-bold text-white shadow-lg shadow-primary/20"
      >
        <span class="material-symbols-outlined">add</span>
        New Note
      </RouterLink>
    </aside>
    <main class="ml-64 min-h-screen p-12 opacity-60 blur-sm transition-all duration-500">
      <header class="mb-12 flex items-center justify-between">
        <div>
          <h2 class="font-headline text-4xl font-extrabold tracking-tight text-on-surface">The Curator</h2>
          <p class="font-body mt-2 text-on-surface-variant">
            {{ notesStore.noteCount }} notes gathered this week
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 rounded-lg bg-surface-container-highest px-4 py-2">
            <span class="material-symbols-outlined text-outline">search</span>
            <RouterLink to="/search" class="text-sm text-on-surface-variant hover:text-primary"
              >Search…</RouterLink
            >
          </div>
        </div>
      </header>
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-8 min-h-[300px] rounded-[1.5rem] bg-surface-container-lowest p-8">
          <div class="mb-4 flex items-center gap-2">
            <span
              class="rounded-full bg-tertiary-container px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-on-tertiary-container"
              >Strategy</span
            >
          </div>
          <h3 class="font-headline mb-4 text-2xl font-bold">Quarterly Growth Pillars</h3>
          <p class="leading-relaxed text-on-surface-variant">
            Focusing on the intersection of organic reach and high-fidelity user interactions...
          </p>
        </div>
        <div class="col-span-4 rounded-[1.5rem] bg-secondary-container p-8">
          <h3 class="font-headline mb-4 text-xl font-bold">Quick Capture</h3>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="h-2 w-2 rounded-full bg-primary"></div>
              <p class="text-sm">Buy espresso beans</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="h-2 w-2 rounded-full bg-primary"></div>
              <p class="text-sm">Review design system docs</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <div
      class="fixed inset-0 z-[60] flex items-center justify-end bg-on-surface/5 p-6 backdrop-blur-[2px]"
    >
      <RouterLink to="/" class="absolute inset-0 cursor-default" aria-label="Close overlay" />
      <div
        class="relative z-10 flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-[2.5rem] bg-surface-container-lowest shadow-2xl"
      >
        <div class="flex items-center justify-between border-b border-surface-container-low/50 px-12 py-8">
          <div class="flex items-center gap-6">
            <RouterLink
              to="/"
              class="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container-high"
            >
              <span class="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            </RouterLink>
            <div class="flex flex-col">
              <span class="font-label mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                Last edited {{ formatRelative(note.updatedAt) }}
              </span>
              <h4 class="text-xs font-medium text-on-surface-variant">Shared with 3 collaborators</h4>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="flex h-12 w-12 items-center justify-center rounded-full transition-all hover:bg-surface-container-high active:scale-90"
              title="Pin note"
              @click="togglePin"
            >
              <span class="material-symbols-outlined text-on-surface-variant" :style="pinIconStyle"
                >push_pin</span
              >
            </button>
            <RouterLink
              :to="{ name: 'editor', params: { id: note.id } }"
              class="flex h-12 w-12 items-center justify-center rounded-full transition-all hover:bg-surface-container-high active:scale-90"
              data-testid="edit-note"
              title="Edit note"
            >
              <span class="material-symbols-outlined text-on-surface-variant">edit_note</span>
            </RouterLink>
            <button
              type="button"
              class="flex h-12 w-12 items-center justify-center rounded-full transition-all hover:bg-error/10 hover:text-error active:scale-90"
              data-testid="delete-note"
              title="Delete note"
              @click="removeNote"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
            <div class="mx-2 h-6 w-[1px] bg-outline-variant/30"></div>
            <button
              type="button"
              class="signature-gradient rounded-full px-6 py-2 text-sm font-bold text-white shadow-md"
              @click="shareNote"
            >
              Share
            </button>
          </div>
        </div>
        <div class="custom-scrollbar flex-grow overflow-y-auto px-12 py-12">
          <div class="mx-auto max-w-2xl">
            <div class="mb-10">
              <div class="mb-6 flex flex-wrap gap-2">
                <span
                  v-for="t in tagChips"
                  :key="t"
                  class="rounded-lg bg-surface-container-high px-3 py-1 text-xs font-medium text-on-surface-variant"
                  >{{ t }}</span
                >
              </div>
              <h1
                class="font-headline text-5xl font-extrabold leading-[1.1] tracking-tight text-on-surface"
              >
                {{ note.title }}
              </h1>
            </div>
            <div
              v-if="note.heroImageUrl"
              class="mb-10 aspect-video overflow-hidden rounded-[1.5rem] bg-surface-container-low"
            >
              <img
                :alt="note.title"
                class="h-full w-full object-cover"
                :src="note.heroImageUrl"
              />
            </div>
            <article
              class="note-article prose prose-slate max-w-none dark:prose-invert prose-p:text-on-surface prose-headings:font-headline prose-headings:text-on-surface"
              v-html="note.bodyHtml"
            ></article>
            <div
              class="font-label mt-20 flex items-center justify-between border-t border-surface-container-low pt-8 text-sm text-on-surface-variant"
            >
              <div class="flex items-center gap-4">
                <div class="flex -space-x-2">
                  <img
                    class="h-8 w-8 rounded-full border-2 border-white object-cover"
                    alt=""
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB28Epz5qpVFhGqhgRt01QbC5zKT6N3KNBm_yz74F3PwgmDJL15bTg4smoLzd5elmIKtiXa-hDJNa0ewgIlQQRNWtGpGfTDWI4bVhHfMgLqsQmPaZ2YUEMTx7pVJlb_5IEmZFFxk0p3TWq6ZX4_IN5zZNL8AHhhfh6xSzhwkX2Ej0bliH9HXdJNgSa8LmE6-baifmvDOcLMAdv2aBRuRTdAJqxjqmsuHi1jw9yDCsfNKnTlFKlKBCDjNuu1CtfzWoIDWkRCtpHzdnQ"
                  />
                  <img
                    class="h-8 w-8 rounded-full border-2 border-white object-cover"
                    alt=""
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9WYeDvKnHDbxkBdA3zBRJs2d54HlG-2tELuLJGe3xvhBP6odDQ97pm4niklfh5EaDsrpeseFpbwxfSyqR4COUeHUW7w3uiMZ8OiVYgk7txMJtFtzPa1RqG-lG-gC2oDBDCTPxH2eb546oKaYR6ydq3Gb87fFKgo3SIwxKX9reUreq-eRqbpv0MwKaTpzyjoiJf7SFWXblfEBhh5mNm_zWawMEDipiPeG5BUHitvFiwKntCbjRedo_jsd55WJ0a8F1Z_6MtPiYQkw"
                  />
                </div>
                <span>Collaborators have read access</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-xs">history</span>
                <span>Version 4.2</span>
              </div>
            </div>
          </div>
        </div>
        <RouterLink
          :to="{ name: 'editor', params: { id: note.id } }"
          class="glass-panel absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold text-on-surface shadow-xl transition-colors hover:border-primary/30 hover:text-primary dark:bg-slate-900/90 dark:text-on-surface dark:hover:text-primary-container"
        >
          <span class="material-symbols-outlined text-[22px]">edit_note</span>
          <span class="font-label uppercase tracking-widest">Edit and format</span>
        </RouterLink>
      </div>
    </div>
    <div
      class="glass-panel fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 md:hidden"
    >
      <span class="material-symbols-outlined text-primary">description</span>
      <span class="material-symbols-outlined text-slate-400">star</span>
      <RouterLink
        to="/editor"
        class="signature-gradient -mt-10 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg"
      >
        <span class="material-symbols-outlined">add</span>
      </RouterLink>
      <span class="material-symbols-outlined text-slate-400">label</span>
      <RouterLink to="/settings" class="text-slate-400">
        <span class="material-symbols-outlined">settings</span>
      </RouterLink>
    </div>
  </div>
</template>
