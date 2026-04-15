<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import TemplatePicker from "@/components/TemplatePicker.vue";
import { useDebouncedCallback } from "@/composables/useDebouncedCallback";
import {
  bumpFontSize,
  exec,
  promptAndImage,
  promptAndLink,
  toggleCodeBlock,
} from "@/lib/contenteditableFormat";
import { formatRelative } from "@/lib/time";
import { useNotesStore } from "@/stores/notes";

const route = useRoute();
const notesStore = useNotesStore();

const paramId = computed(() => {
  const p = route.params.id;
  return Array.isArray(p) ? p[0] : p;
});

const note = computed(() => (paramId.value ? notesStore.getById(paramId.value) : null));

const title = ref("");
const titleEl = ref<HTMLTextAreaElement | null>(null);
const bodyEl = ref<HTMLElement | null>(null);
const bodyTick = ref(0);
/** Base body font (px) for caret / empty editor; also persisted per note. */
const baseFontPx = ref(18);
const FONT_STEP = 2;

/** Stitch focus-mode hero when note has no hero image */
const fallbackEditorHero =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDo-Q6vy0RPlia4RmPlF2oQ3UxbDB05hE0xM1KUOIIvURUYbUJ6GfFXPVsuR_WuBy3XAxgjgcq0gZlsWXCGd8l2bsGcGWqxAynxTdOcyHKLLuFeHkb1OdW8unGGIQ_UilJgq52r0tkPKexefdOk2Rz_0g6gZsNdfy-f6G-GcZQoR0pbIsShm_KW1upnz94HuukyWagqmRYcOMr3gB-YXMn1qNJIqypRIy9DJ_9HuZbjTi6cTDNHgeYli1jnTuh-JKeRSDiyvyQAu_I";

function resizeTitle() {
  const el = titleEl.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

function syncFromNote() {
  const n = note.value;
  if (!n) return;
  title.value = n.title;
  baseFontPx.value = typeof n.editorBodyFontPx === "number" ? n.editorBodyFontPx : 18;
  nextTick(() => {
    if (bodyEl.value) {
      bodyEl.value.innerHTML = n.bodyHtml || "<p><br></p>";
      bodyEl.value.style.fontSize = `${baseFontPx.value}px`;
    }
    resizeTitle();
  });
}

const persist = useDebouncedCallback(() => {
  const id = paramId.value;
  if (!id || !note.value) return;
  const html = bodyEl.value?.innerHTML ?? note.value.bodyHtml;
  notesStore.updateNote(id, {
    title: title.value,
    bodyHtml: html,
    excerpt: textFromHtml(html).slice(0, 220),
    editorBodyFontPx: baseFontPx.value,
  });
}, 400);

function textFromHtml(html: string): string {
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.textContent?.replace(/\s+/g, " ").trim() || "";
}

const wordStats = computed(() => {
  void bodyTick.value;
  const html = bodyEl.value?.innerHTML ?? note.value?.bodyHtml ?? "";
  const words = textFromHtml(html)
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, minutes };
});

watch(paramId, () => syncFromNote(), { immediate: true });

watch(title, () => {
  nextTick(resizeTitle);
  persist();
});

function onBodyInput() {
  bodyTick.value += 1;
  persist();
}

function runBold() {
  document.execCommand("styleWithCSS", false, "true");
  exec(bodyEl.value, "bold");
  onBodyInput();
}

function runItalic() {
  document.execCommand("styleWithCSS", false, "true");
  exec(bodyEl.value, "italic");
  onBodyInput();
}

function runBulletList() {
  exec(bodyEl.value, "insertUnorderedList");
  onBodyInput();
}

function runCodeBlock() {
  toggleCodeBlock(bodyEl.value);
  onBodyInput();
}

function runLink() {
  promptAndLink(bodyEl.value);
  onBodyInput();
}

function runImage() {
  promptAndImage(bodyEl.value);
  onBodyInput();
}

function runFontLarger() {
  const el = bodyEl.value;
  if (!el) return;
  const sel = window.getSelection();
  const collapsed = !sel?.rangeCount || sel.isCollapsed;
  const n = bumpFontSize(el, FONT_STEP);
  if (n != null && collapsed) baseFontPx.value = n;
  if (n != null) onBodyInput();
}

function runFontSmaller() {
  const el = bodyEl.value;
  if (!el) return;
  const sel = window.getSelection();
  const collapsed = !sel?.rangeCount || sel.isCollapsed;
  const n = bumpFontSize(el, -FONT_STEP);
  if (n != null && collapsed) baseFontPx.value = n;
  if (n != null) onBodyInput();
}

onMounted(() => nextTick(resizeTitle));

function exportNoteJson() {
  const n = note.value;
  if (!n) return;
  const blob = new Blob([JSON.stringify(n, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${n.title.slice(0, 40) || "note"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function onTemplateSelect(templateId: string) {
  const id = paramId.value;
  if (!id || !note.value) return;
  notesStore.applyTemplate(id, templateId);
  nextTick(() => syncFromNote());
}
</script>

<template>
  <div
    v-if="note"
    class="bg-surface font-body text-on-surface selection:bg-primary-container/30"
  >
    <header
      class="fixed top-0 z-40 flex w-full items-center justify-between bg-white/80 px-8 py-4 backdrop-blur-xl dark:bg-slate-900/80"
    >
      <div class="flex items-center gap-6">
        <RouterLink
          to="/"
          class="scale-95 rounded-lg p-2 transition-all hover:bg-slate-100 active:opacity-80 dark:hover:bg-slate-800"
        >
          <span class="material-symbols-outlined text-on-surface-variant">menu_open</span>
        </RouterLink>
        <span class="font-manrope text-xl font-bold tracking-tight text-violet-700 dark:text-violet-400"
          >Aura Notes</span
        >
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5">
          <span
            class="material-symbols-outlined text-[16px] text-primary"
            style="font-variation-settings: 'wght' 600"
            >sync</span
          >
          <span class="font-label text-xs uppercase tracking-wide text-on-surface-variant"
            >Auto-saving</span
          >
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="scale-95 rounded-lg p-2 transition-all hover:bg-slate-100 active:opacity-80 dark:hover:bg-slate-800"
          >
            <span class="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
          <RouterLink
            to="/search"
            class="scale-95 rounded-lg p-2 transition-all hover:bg-slate-100 active:opacity-80 dark:hover:bg-slate-800"
          >
            <span class="material-symbols-outlined text-on-surface-variant">search</span>
          </RouterLink>
          <div class="ml-2 h-8 w-8 overflow-hidden rounded-full ring-2 ring-primary/10">
            <img
              alt="User profile"
              class="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCylD7xqGy_5DX-IUc5NknOV311q2P4pOWuAfrfRr2IOL4e64Qexh08aYjRNe1IsS9S79ijg7xfktfEULPsKm8b0rZyx3XYoJ82IbN1n2wF02shlfeUz6YxPg154CeC6P3V8gYsjzikpELeNVDgwBUk48h1IKd2e4wa5WNa6PY1G9Gpcor-QcICeep_sF-9hltkiJTkASZHIbit59_jGaf-VSjz3bVqhusyvc0NsmAAVxknqJk9ubcI7mQslDJkYxeVgOW0vQoahRY"
            />
          </div>
        </div>
      </div>
    </header>
    <main class="flex min-h-screen justify-center px-6 pb-32 pt-24">
      <div class="flex w-full max-w-3xl flex-col items-center">
        <article class="w-full">
          <div class="mb-12 space-y-4">
            <div
              class="flex flex-wrap items-center gap-3 font-label text-sm text-tertiary"
            >
              <span>{{ note.category }}</span>
              <span class="h-1 w-1 rounded-full bg-outline-variant"></span>
              <span>{{ formatRelative(note.updatedAt) }}</span>
              <TemplatePicker @select="onTemplateSelect" />
            </div>
            <textarea
              ref="titleEl"
              v-model="title"
              class="font-headline w-full resize-none overflow-hidden border-none bg-transparent text-5xl font-extrabold tracking-tight text-on-surface placeholder:text-surface-container-highest focus:ring-0 dark:text-on-surface"
              data-testid="note-title"
              placeholder="Title"
              rows="1"
            ></textarea>
          </div>
          <div class="group relative pt-4">
            <div
              class="glass-panel absolute -top-2 left-1/2 z-30 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-0.5 rounded-full border border-outline-variant/15 px-2 py-1.5 shadow-[0_8px_32px_rgba(46,51,54,0.06)] dark:border-white/10 dark:bg-slate-900/85 dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)] sm:px-3 sm:py-2 opacity-100 translate-y-0 transition-all group-hover:shadow-[0_12px_40px_rgba(46,51,54,0.08)]"
              title="Select text first for inline styles; use A+/A− to scale text"
            >
              <button
                type="button"
                class="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high dark:hover:bg-slate-800"
                title="Bold"
                @mousedown.prevent
                @click="runBold"
              >
                <span class="material-symbols-outlined text-[20px]">format_bold</span>
              </button>
              <button
                type="button"
                class="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high dark:hover:bg-slate-800"
                title="Italic"
                @mousedown.prevent
                @click="runItalic"
              >
                <span class="material-symbols-outlined text-[20px]">format_italic</span>
              </button>
              <button
                type="button"
                class="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high dark:hover:bg-slate-800"
                title="Bullet list"
                @mousedown.prevent
                @click="runBulletList"
              >
                <span class="material-symbols-outlined text-[20px]">format_list_bulleted</span>
              </button>
              <div class="mx-0.5 hidden h-4 w-px bg-outline-variant/30 sm:block"></div>
              <button
                type="button"
                class="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high dark:hover:bg-slate-800"
                title="Smaller text (selection or whole editor)"
                @mousedown.prevent
                @click="runFontSmaller"
              >
                <span class="material-symbols-outlined text-[20px]">text_decrease</span>
              </button>
              <button
                type="button"
                class="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high dark:hover:bg-slate-800"
                title="Larger text (selection or whole editor)"
                @mousedown.prevent
                @click="runFontLarger"
              >
                <span class="material-symbols-outlined text-[20px]">text_increase</span>
              </button>
              <div class="mx-0.5 hidden h-4 w-px bg-outline-variant/30 sm:block"></div>
              <button
                type="button"
                class="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high dark:hover:bg-slate-800"
                title="Code block"
                @mousedown.prevent
                @click="runCodeBlock"
              >
                <span class="material-symbols-outlined text-[20px]">code_blocks</span>
              </button>
              <button
                type="button"
                class="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high dark:hover:bg-slate-800"
                title="Insert link"
                @mousedown.prevent
                @click="runLink"
              >
                <span class="material-symbols-outlined text-[20px]">link</span>
              </button>
              <button
                type="button"
                class="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high dark:hover:bg-slate-800"
                title="Insert image from URL"
                @mousedown.prevent
                @click="runImage"
              >
                <span class="material-symbols-outlined text-[20px]">image</span>
              </button>
            </div>
            <div
              ref="bodyEl"
              class="font-body note-editor-body min-h-[614px] space-y-8 pb-20 leading-[1.8] text-on-surface outline-none"
              contenteditable="true"
              data-testid="note-body"
              spellcheck="true"
              @input="onBodyInput"
            ></div>
          </div>
        </article>
        <section class="group relative mt-12 mb-24 aspect-[21/9] w-full overflow-hidden rounded-3xl">
          <img
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt=""
            :src="note.heroImageUrl || fallbackEditorHero"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-surface/40 to-transparent"></div>
        </section>
      </div>
    </main>
    <RouterLink
      to="/editor"
      class="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0_12px_40px_rgba(109,70,193,0.24)] transition-all hover:scale-110 active:scale-95"
    >
      <span class="material-symbols-outlined text-2xl">add</span>
    </RouterLink>
    <footer
      class="glass-panel fixed bottom-0 left-0 z-40 flex w-full items-center justify-between border-t border-outline-variant/10 px-8 py-4 dark:border-white/10 dark:bg-slate-900/85"
    >
      <div class="flex items-center gap-6 font-label text-xs uppercase tracking-wider text-on-surface-variant">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px]">query_stats</span>
          <span>{{ wordStats.words }} Words</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px]">timer</span>
          <span>{{ wordStats.minutes }} Min Read</span>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <button
          type="button"
          class="font-label flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:bg-surface-container-high"
          @click="exportNoteJson"
        >
          <span class="material-symbols-outlined text-[18px]">ios_share</span>
          <span>Export</span>
        </button>
      </div>
    </footer>
  </div>
</template>
