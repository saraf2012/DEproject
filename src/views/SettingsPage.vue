<script setup lang="ts">
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useNotesStore } from "@/stores/notes";
import { useSettingsStore } from "@/stores/settings";

const settings = useSettingsStore();
const notesStore = useNotesStore();
const {
  displayName,
  username,
  email,
  darkMode,
  blurOverlays,
  typewriterDefaults,
  hideSidebar,
} = storeToRefs(settings);

watch(darkMode, () => {
  settings.applyDarkClass();
  settings.persist();
});

watch([blurOverlays, typewriterDefaults, hideSidebar], () => settings.persist(), { deep: true });

function saveProfile() {
  settings.persist();
}

function exportAllData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    settings: {
      displayName: settings.displayName,
      username: settings.username,
      email: settings.email,
      darkMode: settings.darkMode,
      blurOverlays: settings.blurOverlays,
      typewriterDefaults: settings.typewriterDefaults,
      hideSidebar: settings.hideSidebar,
    },
    notes: notesStore.notes,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "aura-notes-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function onImportFile(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      if (Array.isArray(data.notes)) {
        notesStore.notes = data.notes;
        notesStore.persist();
      }
      if (data.settings && typeof data.settings === "object") {
        settings.patch(data.settings);
        settings.applyDarkClass();
      }
    } catch {
      window.alert("Invalid backup file.");
    }
  };
  reader.readAsText(file);
  input.value = "";
}

function deactivateAccount() {
  if (!window.confirm("This clears all notes and settings in this browser. Continue?")) return;
  localStorage.removeItem("aura-notes-v1");
  localStorage.removeItem("aura-settings-v1");
  location.reload();
}
</script>

<template>
  <div class="bg-surface text-on-surface">
    <aside
      class="fixed left-0 top-0 z-50 flex h-screen h-full w-64 flex-col border-r-0 bg-slate-50 p-6 font-inter text-sm font-medium dark:bg-slate-950"
    >
      <div class="mb-10 px-4">
        <h1 class="font-manrope text-xl font-bold tracking-tight text-violet-700">Aura Notes</h1>
        <p class="text-xs font-medium tracking-wider text-slate-500">Thought Sanctuary</p>
      </div>
      <nav class="flex flex-1 flex-col gap-2">
        <RouterLink
          to="/"
          class="flex items-center gap-3 rounded-lg px-4 py-2 text-slate-600 transition-all hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <span class="material-symbols-outlined" data-icon="description">description</span>
          <span>Notes</span>
        </RouterLink>
        <a
          class="flex items-center gap-3 rounded-lg px-4 py-2 text-slate-600 transition-all hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
          href="#"
        >
          <span class="material-symbols-outlined" data-icon="star">star</span>
          <span>Favorites</span>
        </a>
        <a
          class="flex items-center gap-3 rounded-lg px-4 py-2 text-slate-600 transition-all hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
          href="#"
        >
          <span class="material-symbols-outlined" data-icon="label">label</span>
          <span>Tags</span>
        </a>
        <RouterLink
          to="/settings"
          class="flex items-center gap-3 rounded-full bg-violet-100 px-4 py-2 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
        >
          <span
            class="material-symbols-outlined"
            data-icon="settings"
            style="font-variation-settings: 'FILL' 1"
            >settings</span
          >
          <span>Settings</span>
        </RouterLink>
      </nav>
      <RouterLink
        to="/editor"
        class="signature-gradient mt-auto flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-on-primary transition-transform active:scale-95"
      >
        <span class="material-symbols-outlined" data-icon="add">add</span>
        New Note
      </RouterLink>
    </aside>
    <main class="ml-64 box-border min-h-screen w-[calc(100%-16rem)] max-w-[100vw] min-w-0">
      <header
        class="sticky top-0 z-40 flex w-full items-center justify-between bg-white/80 px-12 py-8 backdrop-blur-xl dark:bg-slate-900/80"
      >
        <div class="flex items-center gap-8">
          <span class="font-manrope text-xl font-bold tracking-tight text-violet-700 dark:text-violet-400"
            >Aura Notes</span
          >
          <div class="relative">
            <span
              class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400"
              data-icon="search"
              >search</span
            >
            <input
              class="w-64 rounded-lg border-none bg-surface-container-highest py-2 pl-10 pr-4 text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Search thoughts..."
              type="text"
            />
          </div>
        </div>
        <div class="flex items-center gap-6">
          <button
            type="button"
            class="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
          >
            <span class="material-symbols-outlined" data-icon="notifications">notifications</span>
          </button>
          <div
            class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary-container bg-surface-container-high"
          >
            <img
              alt="User profile"
              class="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3_NTUKC5_kLgF85i7Lo-F7s2aWSDqzp6XIRBYHh6JTLZOu0Gb_0cinS_p8Sd0GL50KOeb3-aaJZf4Y5djR4wSteiqWdllKCQfJ0bR8GTTgHljuSIIFLiBAbzG32EmeLR565Q9U9uhPvYwT3za976DW-ltTLeUBvWO5C0eBwDMx9qAzD8ImFhRY6w8o0Uuwsa4JIOK7NFepqPOiVn2bi8NOBu7beyZjtu0ZgJ_pzPx0GbmhVKxV9i7DQQOXd3HRiY7HlGweryJnHQ"
            />
          </div>
        </div>
      </header>
      <div class="mx-auto w-full max-w-4xl px-4 pb-24 sm:px-8 lg:px-12">
        <div class="mb-16 mt-12">
          <h2 class="font-headline mb-2 text-5xl font-extrabold tracking-tight text-on-surface">Settings</h2>
          <p class="font-medium text-on-surface-variant">Refine your digital sanctuary.</p>
        </div>
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div
            class="col-span-1 rounded-[2rem] bg-surface-container-lowest p-6 ring-1 ring-outline-variant/15 sm:p-10 lg:col-span-8"
          >
            <div class="mb-12 flex items-start justify-between">
              <div class="flex items-center gap-6">
                <div class="group relative">
                  <div class="h-24 w-24 overflow-hidden rounded-[2rem] bg-surface-container-high">
                    <img
                      alt="Profile"
                      class="h-full w-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqNXZRvneG5ya_U9xt52B1bWP7MfijgP7elLxSlTrhOYGJI03AmgPm-SBaeKuzLMg0XdXxWV3fM1hDMqNZABfUCOOUs1AlnwtRfA6zhvoo5cp6lYdU6taGDbFHsx-tqmWuqDWegRVO1z7RpdOI0Jmsys4_MejTBp8DkpdaXqxrgjpXHJAO6Q0lNso2juBisUO8q10S80Awo4vqsRWO_ZriRRhDvuNes-H2u5OIRnOG7M-RPF3lXF6kxyRB0HlTCgQeZ1kLT1da_mc"
                    />
                  </div>
                  <button
                    type="button"
                    class="group-hover:scale-110 absolute -bottom-2 -right-2 rounded-full bg-primary p-2 text-on-primary shadow-lg transition-transform"
                  >
                    <span class="material-symbols-outlined text-sm" data-icon="edit">edit</span>
                  </button>
                </div>
                <div>
                  <h3 class="text-2xl font-bold">Personal Identity</h3>
                  <p class="text-sm text-on-surface-variant">Update your public presence</p>
                </div>
              </div>
            </div>
            <form class="space-y-8" @submit.prevent="saveProfile">
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                    >Display Name</label
                  >
                  <input
                    v-model="displayName"
                    class="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 font-medium outline-none transition-all focus:ring-2 focus:ring-primary/20"
                    type="text"
                  />
                </div>
                <div class="space-y-2">
                  <label class="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                    >Pseudonym</label
                  >
                  <input
                    v-model="username"
                    class="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 font-medium outline-none transition-all focus:ring-2 focus:ring-primary/20"
                    type="text"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <label class="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                  >Email Address</label
                >
                <input
                  v-model="email"
                  class="w-full rounded-xl border-none bg-surface-container-low px-4 py-3 font-medium outline-none transition-all focus:ring-2 focus:ring-primary/20"
                  type="email"
                />
              </div>
              <div class="pt-4">
                <button
                  type="submit"
                  class="signature-gradient rounded-full px-8 py-3 font-bold text-on-primary transition-opacity hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
          <div class="col-span-1 space-y-8 lg:col-span-4">
            <div class="rounded-[2rem] bg-surface-container-low p-8">
              <div class="mb-6 flex items-center gap-4">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container/30"
                >
                  <span class="material-symbols-outlined text-primary" data-icon="palette">palette</span>
                </div>
                <h4 class="text-lg font-bold">Atmosphere</h4>
              </div>
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-on-surface-variant">Dark Mode</span>
                  <label class="relative inline-flex cursor-pointer items-center">
                    <input v-model="darkMode" class="peer sr-only" type="checkbox" />
                    <div
                      class="peer relative h-6 w-11 rounded-full bg-surface-container-highest after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-checked:after:border-white"
                    ></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium text-on-surface-variant">Blur Overlays</span>
                  <label class="relative inline-flex cursor-pointer items-center">
                    <input v-model="blurOverlays" class="peer sr-only" type="checkbox" />
                    <div
                      class="peer relative h-6 w-11 rounded-full bg-surface-container-highest after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-checked:after:border-white"
                    ></div>
                  </label>
                </div>
              </div>
            </div>
            <div class="rounded-[2rem] bg-surface-container-lowest p-8 ring-1 ring-outline-variant/15">
              <div class="mb-6 flex items-center gap-4">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-container/30"
                >
                  <span class="material-symbols-outlined text-tertiary" data-icon="auto_awesome"
                    >auto_awesome</span
                  >
                </div>
                <h4 class="text-lg font-bold">Focus Mode</h4>
              </div>
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="font-medium">Typewriter Defaults</span>
                    <span class="text-[10px] uppercase tracking-widest text-on-surface-variant"
                      >Active by default</span
                    >
                  </div>
                  <label class="relative inline-flex cursor-pointer items-center">
                    <input v-model="typewriterDefaults" class="peer sr-only" type="checkbox" />
                    <div
                      class="peer relative h-6 w-11 rounded-full bg-surface-container-highest after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-checked:after:border-white"
                    ></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium text-on-surface-variant">Hide Sidebar</span>
                  <label class="relative inline-flex cursor-pointer items-center">
                    <input v-model="hideSidebar" class="peer sr-only" type="checkbox" />
                    <div
                      class="peer relative h-6 w-11 rounded-full bg-surface-container-highest after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-checked:after:border-white"
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div
            class="col-span-1 rounded-[2rem] bg-surface-container-low p-6 sm:p-8 lg:col-span-6 lg:p-10"
          >
            <h3 class="mb-6 text-xl font-bold">Security</h3>
            <div class="space-y-4">
              <div class="rounded-xl bg-surface-container-lowest p-4">
                <div class="flex items-center justify-between gap-4">
                  <div class="flex min-w-0 items-start gap-3">
                    <span
                      class="material-symbols-outlined flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-[22px] text-on-surface-variant"
                      data-icon="lock"
                      >lock</span
                    >
                    <div class="min-w-0 pt-0.5">
                      <p class="font-medium">Password</p>
                      <p class="mt-0.5 text-xs leading-snug text-on-surface-variant">
                        Last changed 3 months ago
                      </p>
                    </div>
                  </div>
                  <button type="button" class="shrink-0 text-sm font-bold text-primary">
                    Update
                  </button>
                </div>
              </div>
              <div class="rounded-xl bg-surface-container-lowest p-4">
                <div class="flex items-center justify-between gap-4">
                  <div class="flex min-w-0 items-start gap-3">
                    <span
                      class="material-symbols-outlined flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-[22px] text-on-surface-variant"
                      data-icon="phonelink_lock"
                      >phonelink_lock</span
                    >
                    <div class="min-w-0 pt-0.5">
                      <p class="font-medium">2FA Security</p>
                      <p class="mt-0.5 text-xs leading-snug text-on-surface-variant">
                        Extra sign-in protection with an authenticator app
                      </p>
                    </div>
                  </div>
                  <button type="button" class="shrink-0 text-sm font-bold text-on-surface-variant">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="col-span-1 flex flex-col justify-between rounded-[2rem] border border-tertiary-container/30 bg-tertiary-container/20 p-6 sm:p-8 lg:col-span-6 lg:p-10"
          >
            <div>
              <h3 class="mb-2 text-xl font-bold text-tertiary">Cloud Storage</h3>
              <p class="mb-8 text-sm text-tertiary">8.2 GB of 10 GB used</p>
              <div class="mb-4 h-2 w-full overflow-hidden rounded-full bg-tertiary-container/30">
                <div class="h-full w-[82%] bg-tertiary"></div>
              </div>
            </div>
            <button
              type="button"
              class="w-full rounded-full bg-tertiary py-3 font-bold text-on-tertiary"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
        <div class="mt-20 border-t border-outline-variant/10 pt-12">
          <h4 class="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-error">Danger Zone</h4>
          <div class="flex flex-wrap gap-4">
            <button
              type="button"
              class="rounded-xl border-none bg-surface-container-low px-6 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container"
              @click="deactivateAccount"
            >
              Deactivate Account
            </button>
            <button
              type="button"
              class="rounded-xl border-none bg-surface-container-low px-6 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container"
              @click="exportAllData"
            >
              Export All Data (.json)
            </button>
            <label
              class="cursor-pointer rounded-xl border-none bg-surface-container-low px-6 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              Import backup
              <input type="file" accept="application/json" class="sr-only" @change="onImportFile" />
            </label>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
