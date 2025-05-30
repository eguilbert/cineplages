<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Préparer la sélection</h1>
    <FilmPreparation :films="importedFilms" @validate="handleValidatedFilms" />
  </div>
</template>

<script setup>
import FilmPreparation from "~/components/FilmPreparation.vue";
import { useImportStore } from "~/stores/import";

const importStore = useImportStore();
const importedFilms = importStore.importedFilms;

const handleValidatedFilms = (validated) => {
  importStore.setImportedFilms(validated); // Tu peux écraser ou créer un autre champ
  navigateTo("/films/sauver");
};
</script>
