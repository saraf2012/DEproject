import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalized } from "vue-router";
import { useNotesStore } from "@/stores/notes";
import HomeView from "@/views/HomeView.vue";
import EditorPage from "@/views/EditorPage.vue";
import ExpandedPage from "@/views/ExpandedPage.vue";
import SearchPage from "@/views/SearchPage.vue";
import SettingsPage from "@/views/SettingsPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    {
      path: "/editor/:id?",
      name: "editor",
      component: EditorPage,
      beforeEnter: (to: RouteLocationNormalized) => {
        const store = useNotesStore();
        const paramId = to.params.id;
        const id = Array.isArray(paramId) ? paramId[0] : paramId;
        if (!id) {
          const newId = store.createNote();
          return { name: "editor", params: { id: newId }, replace: true };
        }
        if (!store.getById(id)) return { path: "/" };
      },
    },
    {
      path: "/expanded/:id",
      name: "expanded",
      component: ExpandedPage,
      beforeEnter: (to: RouteLocationNormalized) => {
        const store = useNotesStore();
        const paramId = to.params.id;
        const id = Array.isArray(paramId) ? paramId[0] : paramId;
        if (!id || !store.getById(id)) return { path: "/" };
      },
    },
    { path: "/search", name: "search", component: SearchPage },
    { path: "/settings", name: "settings", component: SettingsPage },
  ],
});

export default router;
