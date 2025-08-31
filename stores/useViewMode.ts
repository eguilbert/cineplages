// stores/useViewMode.js
import { defineStore } from "pinia";

export const useViewMode = defineStore("viewMode", {
  state: () => ({
    mode: "full", // valeur par défaut côté SSR
    ready: false, // devient true après hydratation client
  }),
  actions: {
    init() {
      // Appelé côté client uniquement
      if (typeof window === "undefined") return;
      try {
        const saved = window.localStorage.getItem("filmViewMode");
        this.mode = saved === "compact" || saved === "full" ? saved : "full";
      } catch (_) {
        this.mode = "full";
      } finally {
        this.ready = true;
      }
    },
    setMode(m) {
      this.mode = m;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("filmViewMode", m);
        } catch (_) {}
      }
    },
    toggle() {
      this.setMode(this.mode === "full" ? "compact" : "full");
    },
  },
});
