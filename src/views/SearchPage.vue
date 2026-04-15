<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { LocationQueryValue } from "vue-router";
import { useDebouncedCallback } from "@/composables/useDebouncedCallback";
import { formatRelative } from "@/lib/time";
import { useNotesStore } from "@/stores/notes";

const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();

const q = ref(typeof route.query.q === "string" ? route.query.q : "Project");

watch(
  () => route.query.q,
  (v: LocationQueryValue | LocationQueryValue[]) => {
    if (typeof v === "string") q.value = v;
    else if (v === undefined || v === null) q.value = "";
  }
);

const debouncedPush = useDebouncedCallback(() => {
  router.replace({ path: "/search", query: q.value.trim() ? { q: q.value.trim() } : {} });
}, 300);

watch(q, () => debouncedPush());

const results = computed(() => notesStore.searchNotes(q.value || ""));

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightHtml(text: string): string {
  const needle = q.value.trim();
  if (!needle || !text) return text;
  const re = new RegExp(`(${escapeRe(needle)})`, "gi");
  return text.replace(
    re,
    '<span class="rounded bg-primary/10 px-1 text-primary">$1</span>'
  );
}
</script>

<template>
  <div class="bg-surface font-body text-on-surface">
    <aside
      class="fixed left-0 top-0 z-50 flex h-screen h-full w-64 flex-col border-r-0 bg-slate-50 p-6 font-inter text-sm font-medium dark:bg-slate-950"
    >
      <div class="mb-10 flex items-center gap-3">
        <div class="signature-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white">
          <span class="material-symbols-outlined">auto_awesome</span>
        </div>
        <div>
          <h1 class="font-manrope text-lg font-bold leading-none text-violet-700">Aura Notes</h1>
          <p class="mt-1 text-[10px] uppercase tracking-widest text-slate-500">Thought Sanctuary</p>
        </div>
      </div>
      <nav class="flex flex-grow flex-col gap-2">
        <RouterLink v-slot="{ href, navigate }" to="/" custom>
          <a
            :href="href"
            class="flex items-center gap-3 rounded-full bg-violet-100 px-4 py-2 text-violet-700 transition-all dark:bg-violet-900/30 dark:text-violet-300"
            @click="navigate"
          >
            <span class="material-symbols-outlined">description</span>
            <span>Notes</span>
          </a>
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
        class="signature-gradient mt-auto flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-bold text-white shadow-lg transition-all active:scale-95"
      >
        <span class="material-symbols-outlined">add</span>
        New Note
      </RouterLink>
    </aside>
    <main class="ml-64 flex min-h-screen flex-col">
      <header
        class="docked full-width top-0 z-40 flex w-full items-center justify-between bg-white/80 px-8 py-4 font-manrope text-sm font-medium tracking-tight backdrop-blur-xl dark:bg-slate-900/80"
      >
        <div class="flex flex-grow items-center gap-6">
          <div class="group relative w-full max-w-xl">
            <span
              class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
              >search</span
            >
            <input
              v-model="q"
              class="font-body w-full rounded-lg border-none bg-surface-container-highest py-2.5 pl-12 pr-4 text-on-surface-variant transition-all placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20"
              data-testid="search-page-input"
              placeholder="Search your sanctuary..."
              type="search"
            />
          </div>
        </div>
        <div class="ml-8 flex items-center gap-4">
          <button
            type="button"
            class="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <div class="h-8 w-8 overflow-hidden rounded-full border-2 border-surface-container-highest">
            <img
              alt="User profile"
              class="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuADmsvheJ8ZUfEp5zFbrlYIXKIxizesxDmrXEluNoloeiKf6PoqC9Nfz6xaXkae2aXAHlgykyrRdGIRyDS9pjB7L8ufAxu9KexsMKcm9TOsMcCkqM_II_AxdN7E5-1PTIKWHhsy_g8Oy5UydoseHZEr7vAC2tSfDtqRaOcE0VS_QAGTlXhBB7man0lnu7tHNaJOFm7LNMQhyf45z9jsMPFfXTlZoIr3gj3PbR_0CJqKgM5dcy13SFhi7HfMGYA08G9qEZ7_dcKt6nc"
            />
          </div>
        </div>
      </header>
      <div class="flex max-w-7xl flex-col gap-8 p-8">
        <section class="flex flex-col gap-4">
          <div class="flex items-baseline gap-3">
            <h2 class="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
              Search results
            </h2>
            <span class="font-body text-lg italic text-outline-variant"
              >for "{{ q || 'all notes' }}"</span
            >
          </div>
          <div class="flex flex-wrap gap-2">
            <div
              class="flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary"
            >
              <span>Tag: Business</span>
              <span class="material-symbols-outlined text-[16px] leading-none">close</span>
            </div>
            <div
              class="flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary"
            >
              <span>Type: Notes</span>
              <span class="material-symbols-outlined text-[16px] leading-none">close</span>
            </div>
            <button
              type="button"
              class="flex cursor-pointer items-center gap-2 rounded-full border border-outline-variant/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              <span class="material-symbols-outlined text-[16px]">add</span>
              <span>Add Filter</span>
            </button>
          </div>
        </section>

        <div
          v-if="results.length === 0"
          class="flex flex-col items-center justify-center py-32 text-center"
        >
          <div
            class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-container-low"
          >
            <span class="material-symbols-outlined text-4xl text-outline-variant">search_off</span>
          </div>
          <h3 class="font-headline mb-2 text-2xl font-bold text-on-surface">
            Nothing found in the sanctuary
          </h3>
          <p class="font-body mx-auto max-w-sm text-on-surface-variant">
            We couldn't find any notes matching your search. Try adjusting your filters or using
            broader terms.
          </p>
          <button
            type="button"
            class="mt-8 font-bold text-primary hover:underline"
            @click="q = ''"
          >
            Clear all filters
          </button>
        </div>

        <div v-else class="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
          <RouterLink
            v-for="note in results"
            :key="note.id"
            :to="{ name: 'expanded', params: { id: note.id } }"
            class="group block rounded-[1.5rem] border border-transparent bg-surface-container-lowest p-8 transition-all hover:border-primary/10 hover:bg-surface-container-high md:col-span-6 lg:col-span-4"
          >
            <div class="mb-4 flex items-start justify-between">
              <span
                class="rounded bg-tertiary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-tertiary-container"
                >{{ note.category }}</span
              >
              <span class="text-[11px] font-medium uppercase tracking-widest text-outline-variant">{{
                formatRelative(note.updatedAt)
              }}</span>
            </div>
            <h3
              class="font-headline mb-3 text-xl font-bold text-on-surface"
              v-html="highlightHtml(note.title)"
            ></h3>
            <p
              class="line-clamp-3 font-body text-sm leading-relaxed text-on-surface-variant"
              v-html="highlightHtml(note.excerpt || '')"
            ></p>
            <div class="mt-6 flex items-center justify-between">
              <span class="material-symbols-outlined text-outline-variant transition-colors group-hover:text-primary"
                >open_in_new</span
              >
            </div>
          </RouterLink>
        </div>
      </div>
      <div class="fixed bottom-8 right-8 z-50">
        <RouterLink
          to="/editor"
          class="signature-gradient flex h-16 w-16 items-center justify-center rounded-full text-white shadow-[0px_8px_32px_rgba(109,70,193,0.12)] transition-all active:scale-90"
        >
          <span class="material-symbols-outlined text-3xl">add</span>
        </RouterLink>
      </div>
    </main>
  </div>
</template>
