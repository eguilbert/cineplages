import { defineStore } from "pinia";

export const useImportStore = defineStore("import", {
  state: () => ({
    importedFilms: [],
  }),
  actions: {
    setImportedFilms(films) {
      this.importedFilms = films;
    },
    clear() {
      this.importedFilms = [];
    },
  },
});
