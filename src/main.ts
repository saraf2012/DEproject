import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useNotesStore } from "./stores/notes";
import { useSettingsStore } from "./stores/settings";
import "./style.css";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

useNotesStore().hydrate();
const settings = useSettingsStore();
settings.hydrate();
settings.applyDarkClass();

app.use(router);
app.mount("#app");
