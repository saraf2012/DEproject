<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import TagFilter from "@/components/TagFilter.vue";
import type { Note } from "@/types/note";
import { useNotesStore } from "@/stores/notes";
import { filterNotesByTag } from "@/utils/notes";
import { formatRelative, formatMonthYear } from "@/lib/time";

const notesStore = useNotesStore();
const route = useRoute();
const router = useRouter();
const searchQuery = ref("");

const isFavoritesView = computed(() => route.query.filter === "favorites");

const allTags = computed(() => {
  const s = new Set<string>();
  for (const n of notesStore.notes) {
    if (n.archived) continue;
    (n.tags || []).forEach((t) => s.add(t));
    (n.pillTags || []).forEach((t) => s.add(t));
  }
  return [...s].sort((a, b) => a.localeCompare(b));
});

const selectedTag = ref<string | null>(null);

const visibleNotes = computed(() => {
  let list = notesStore.sortedNotes.filter((n) => !n.archived);
  if (isFavoritesView.value) list = list.filter((n) => n.favorite);
  list = filterNotesByTag(list, selectedTag.value);
  return list;
});

const featured = computed(() => visibleNotes.value[0]);
const stackPair = computed(() => visibleNotes.value.slice(1, 3));
const rowLeft = computed(() => visibleNotes.value[3]);
const rowRight = computed(() => visibleNotes.value[4]);

const subtitleLine = computed(() => {
  const month = formatMonthYear(new Date());
  const n = visibleNotes.value.length;
  return `${month} — ${n} THOUGHTS COLLECTED`;
});

function runSearch() {
  const q = searchQuery.value.trim();
  router.push({ path: "/search", query: q ? { q } : {} });
}

function toggleStar(note: Note, e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  notesStore.toggleFavorite(note.id);
}

const filledStarStyle = { fontVariationSettings: "'FILL' 1" };
</script>

<template>
  <div class="bg-surface font-body text-on-surface overflow-x-hidden">
    <aside
      class="fixed left-0 top-0 z-50 flex h-full h-screen w-64 flex-col border-r-0 bg-slate-50 p-6 dark:bg-slate-950"
    >
      <div class="mb-10 flex flex-col">
        <div class="mb-2 flex items-center gap-3">
          <div
            class="signature-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg"
          >
            <span
              class="material-symbols-outlined"
              style="font-variation-settings: 'FILL' 1"
              >auto_awesome</span
            >
          </div>
          <h1 class="font-headline text-xl font-bold tracking-tight text-violet-700">Aura Notes</h1>
        </div>
        <div class="px-1">
          <p class="font-inter text-sm font-medium text-violet-700">The Curator</p>
          <p class="font-inter text-xs text-slate-500">Thought Sanctuary</p>
        </div>
      </div>
      <nav class="flex flex-grow flex-col gap-2">
        <RouterLink
          :to="{ path: '/', query: {} }"
          class="flex items-center gap-3 rounded-full px-4 py-2 font-inter text-sm font-medium transition-all duration-200"
          :class="
            route.path === '/' && !isFavoritesView
              ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
              : 'rounded-lg text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
          "
        >
          <span class="material-symbols-outlined" data-icon="description">description</span>
          Notes
        </RouterLink>
        <RouterLink
          :to="{ path: '/', query: { filter: 'favorites' } }"
          class="flex items-center gap-3 px-4 py-2 font-inter text-sm font-medium transition-all"
          :class="
            isFavoritesView
              ? 'rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
              : 'rounded-lg text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
          "
        >
          <span class="material-symbols-outlined" data-icon="star">star</span>
          Favorites
        </RouterLink>
        <RouterLink
          to="/search"
          class="flex items-center gap-3 rounded-lg px-4 py-2 font-inter text-sm font-medium text-slate-600 transition-all hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <span class="material-symbols-outlined" data-icon="label">label</span>
          Tags
        </RouterLink>
        <RouterLink
          to="/settings"
          class="mt-auto flex items-center gap-3 rounded-lg px-4 py-2 font-inter text-sm font-medium text-slate-600 transition-all hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <span class="material-symbols-outlined" data-icon="settings">settings</span>
          Settings
        </RouterLink>
      </nav>
    </aside>
    <main class="relative ml-64 flex min-h-screen flex-col">
      <header
        class="docked full-width sticky top-0 z-40 flex w-full items-center justify-between bg-white/80 px-8 py-4 backdrop-blur-xl dark:bg-slate-900/80"
      >
        <div class="max-w-xl flex-1">
          <div class="group relative flex items-center">
            <span class="material-symbols-outlined absolute left-4 text-slate-400">search</span>
            <input
              v-model="searchQuery"
              class="w-full rounded-lg border-none bg-surface-container-highest py-2.5 pl-12 pr-4 font-inter text-sm placeholder:text-slate-500 transition-all focus:ring-2 focus:ring-primary/20"
              data-testid="search-input"
              placeholder="Search your sanctuary..."
              type="text"
              @keydown.enter.prevent="runSearch"
            />
          </div>
        </div>
        <div class="ml-8 flex items-center gap-4">
          <button
            type="button"
            class="flex items-center justify-center rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span class="material-symbols-outlined" data-icon="notifications">notifications</span>
          </button>
          <div class="h-10 w-10 overflow-hidden rounded-full border border-outline-variant/15">
            <img
              alt="User profile"
              class="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-zIvIzHy3ywlXiKghfVNlmqLtF-cMH3dq0R2WyznynuGOSa1Y3yD119DyR0mYjhn4nzNIhEKeTSyORpWC4yoW8YWR7pKeilcA3JmqoK7WZ55EbBXlfYZsIMOI_t2iBmI7hnK9Lm9IPP9PkpPj5e9wNHX4ZJtdZCB0s4DDvoG4hEi9imQL3-ERvHUleBfE7IFsULMXrULul0ZF7B_zuKiD-2QF1UjOyZ7dwZalrFUIYkNDQxRfEXQAkX2d2I7i1Tdm27MdonaUHQ0"
            />
          </div>
        </div>
      </header>
      <div class="flex-grow px-12 py-10">
        <div class="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              class="font-headline mb-2 text-[3.5rem] font-extrabold leading-tight tracking-tight text-on-surface"
            >
              My Notes
            </h2>
            <p class="font-label text-sm tracking-wide text-on-surface-variant">
              {{ subtitleLine }}
            </p>
          </div>
          <TagFilter v-model="selectedTag" :tags="allTags" />
        </div>

        <p
          v-if="visibleNotes.length === 0"
          class="text-on-surface-variant"
          data-testid="empty-notes"
        >
          No notes here yet. Create one with the + button.
        </p>

        <div v-else class="grid grid-cols-12 items-start gap-8">
          <RouterLink
            v-if="featured"
            :to="{ name: 'expanded', params: { id: featured.id } }"
            class="group col-span-8 block cursor-pointer rounded-xl bg-surface-container-lowest p-10 transition-all duration-300 hover:bg-surface-container-high"
            data-testid="note-card"
          >
            <div class="mb-6 flex items-start justify-between">
              <span class="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">{{
                featured.category
              }}</span>
              <span class="text-xs text-outline-variant">{{ formatRelative(featured.updatedAt) }}</span>
            </div>
            <h3
              class="font-headline mb-6 text-3xl font-bold text-on-surface"
              data-testid="note-card-title"
            >
              {{ featured.title }}
            </h3>
            <p class="mb-8 text-lg leading-relaxed text-on-surface-variant">
              {{ featured.excerpt }}
            </p>
            <div v-if="featured.pillTags?.length" class="flex flex-wrap items-center gap-3">
              <div
                v-for="tag in featured.pillTags"
                :key="tag"
                class="rounded-full bg-tertiary-container/30 px-4 py-1.5 text-xs font-medium text-tertiary"
              >
                {{ tag }}
              </div>
            </div>
          </RouterLink>

          <div v-if="stackPair.length" class="col-span-4 flex flex-col gap-8">
            <RouterLink
              v-for="note in stackPair"
              :key="note.id"
              :to="{ name: 'expanded', params: { id: note.id } }"
              class="group block cursor-pointer rounded-xl bg-surface-container-lowest p-8 transition-all duration-300 hover:bg-surface-container-high"
              data-testid="note-card"
            >
              <div class="mb-4 flex items-start justify-between">
                <span class="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  {{ note.category }}
                </span>
                <button
                  v-if="note.id === stackPair[0]?.id"
                  type="button"
                  class="inline-flex"
                  aria-label="Toggle favorite"
                  @click="toggleStar(note, $event)"
                >
                  <span
                    class="material-symbols-outlined text-sm text-outline-variant"
                    :style="note.favorite ? filledStarStyle : undefined"
                    >star</span
                  >
                </button>
                <span v-else class="text-xs text-outline-variant">{{
                  formatRelative(note.updatedAt)
                }}</span>
              </div>
              <h3 class="font-headline mb-3 text-xl font-bold text-on-surface" data-testid="note-card-title">
                {{ note.title }}
              </h3>
              <ul v-if="note.checklist?.length" class="space-y-2">
                <li
                  v-for="(item, idx) in note.checklist"
                  :key="idx"
                  class="flex items-center gap-2 text-sm text-on-surface-variant"
                >
                  <span
                    v-if="!item.done"
                    class="h-4 w-4 flex-shrink-0 rounded-sm border border-outline"
                  ></span>
                  <span
                    v-else
                    class="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm border border-primary bg-primary text-[10px] text-white"
                    >✓</span
                  >
                  {{ item.text }}
                </li>
              </ul>
              <p v-else class="line-clamp-3 text-sm leading-relaxed text-on-surface-variant">
                {{ note.excerpt }}
              </p>
            </RouterLink>
          </div>

          <RouterLink
            v-if="rowLeft"
            :to="{ name: 'expanded', params: { id: rowLeft.id } }"
            class="group col-span-4 block cursor-pointer rounded-xl bg-surface-container-lowest p-8 transition-all duration-300 hover:bg-surface-container-high"
            data-testid="note-card"
          >
            <div class="mb-4 flex items-start justify-between">
              <span class="font-label text-xs font-bold uppercase tracking-widest text-primary">{{
                rowLeft.category
              }}</span>
              <span class="text-xs text-outline-variant">{{ formatRelative(rowLeft.updatedAt) }}</span>
            </div>
            <div
              v-if="rowLeft.imageUrl"
              class="mb-6 h-32 w-full overflow-hidden rounded-lg bg-surface-container-highest"
            >
              <img
                :alt="rowLeft.title"
                class="h-full w-full object-cover opacity-80 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0"
                :src="rowLeft.imageUrl"
              />
            </div>
            <h3 class="font-headline mb-3 text-xl font-bold text-on-surface" data-testid="note-card-title">
              {{ rowLeft.title }}
            </h3>
            <p class="text-sm leading-relaxed text-on-surface-variant">{{ rowLeft.excerpt }}</p>
          </RouterLink>

          <RouterLink
            v-if="rowRight"
            :to="{ name: 'expanded', params: { id: rowRight.id } }"
            class="group relative col-span-8 block cursor-pointer overflow-hidden rounded-xl bg-surface-container-lowest p-8 transition-all duration-300 hover:bg-surface-container-high"
            data-testid="note-card"
          >
            <div class="relative z-10">
              <div class="mb-4 flex items-start justify-between">
                <span class="font-label text-xs font-bold uppercase tracking-widest text-primary">{{
                  rowRight.category
                }}</span>
                <span class="text-xs text-outline-variant">{{
                  formatRelative(rowRight.updatedAt)
                }}</span>
              </div>
              <h3 class="font-headline mb-4 text-2xl font-bold text-on-surface" data-testid="note-card-title">
                {{ rowRight.title }}
              </h3>
              <div class="grid grid-cols-2 gap-8">
                <p class="text-base leading-relaxed text-on-surface-variant">
                  {{ rowRight.excerpt }}
                </p>
                <div v-if="rowRight.statusLabels?.length" class="flex flex-wrap content-start gap-2">
                  <span
                    v-for="lab in rowRight.statusLabels"
                    :key="lab"
                    class="rounded-full border border-outline-variant/30 px-3 py-1 font-label text-xs text-on-surface-variant"
                    >{{ lab }}</span
                  >
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
      <RouterLink
        to="/editor"
        class="fixed bottom-12 right-12 z-50 flex h-16 w-16 items-center justify-center rounded-full signature-gradient text-white shadow-[0px_8px_32px_rgba(109,70,193,0.24)] transition-all hover:scale-105 active:scale-95"
        data-testid="new-note-fab"
      >
        <span
          class="material-symbols-outlined text-3xl"
          style="font-variation-settings: 'FILL' 0, 'wght' 600"
          >add</span
        >
        <span class="sr-only">New Note</span>
      </RouterLink>
    </main>
  </div>
</template>
