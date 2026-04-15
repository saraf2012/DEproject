import { defineStore } from "pinia";

const STORAGE_KEY = "aura-settings-v1";

export interface SettingsState {
  displayName: string;
  username: string;
  email: string;
  darkMode: boolean;
  blurOverlays: boolean;
  typewriterDefaults: boolean;
  hideSidebar: boolean;
  hydrated: boolean;
}

const defaultState = (): Omit<SettingsState, "hydrated"> => ({
  displayName: "Elena Vance",
  username: "the_curator",
  email: "elena@auranotes.com",
  darkMode: false,
  blurOverlays: true,
  typewriterDefaults: true,
  hideSidebar: false,
});

export const useSettingsStore = defineStore("settings", {
  state: (): SettingsState => ({
    ...defaultState(),
    hydrated: false,
  }),
  actions: {
    hydrate(): void {
      if (this.hydrated) return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) Object.assign(this, JSON.parse(raw) as Partial<SettingsState>, { hydrated: false });
      } catch {
        /* ignore */
      }
      this.hydrated = true;
    },
    persist(): void {
      const data: Omit<SettingsState, "hydrated"> = {
        displayName: this.displayName,
        username: this.username,
        email: this.email,
        darkMode: this.darkMode,
        blurOverlays: this.blurOverlays,
        typewriterDefaults: this.typewriterDefaults,
        hideSidebar: this.hideSidebar,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    patch(payload: Partial<Omit<SettingsState, "hydrated">>): void {
      Object.assign(this, payload);
      this.persist();
    },
    applyDarkClass(): void {
      if (this.darkMode) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    },
    resetLocalData(): void {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("aura-notes-v1");
      Object.assign(this, defaultState(), { hydrated: true });
    },
  },
});
