<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">
      Étape 1/3 : Importer et sélectionner les films
    </h1>

    <div class="flex gap-4 mb-4">
      <Calendar
        v-model="startDate"
        dateFormat="yy-mm-dd"
        placeholder="Date de début"
      />
      <Calendar
        v-model="endDate"
        dateFormat="yy-mm-dd"
        placeholder="Date de fin"
      />
      <Button
        label="Importer depuis TMDb"
        icon="pi pi-download"
        @click="importFilms"
      />
    </div>

    <div v-if="loading" class="text-center my-6">
      <ProgressSpinner style="width: 50px; height: 50px" />
    </div>

    <div v-else-if="films.length">
      <FilmPreparation :films="films" @validate="handleValidatedFilms" />
    </div>

    <div v-else class="text-sm text-gray-500">
      Aucun film pour cette période.
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import ProgressSpinner from "primevue/progressspinner";
import FilmPreparation from "~/components/FilmPreparation.vue";
import { useImportStore } from "~/stores/import";

const startDate = ref(new Date());
const endDate = ref(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000));
const films = ref([]);
const loading = ref(false);
const formatDate = (date) => date.toISOString().split("T")[0];

const importStore = useImportStore();

const importFilms = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (startDate.value) params.append("start", formatDate(startDate).value);
    if (endDate.value) params.append("end", formatDate(endDate.value));

    const res = await fetch(
      `${config.public.apiBase}/import/tmdb?${params.toString()}`
    );
    /*  const res = await fetch(
      `http:/localhost:4000/api/import/tmdb?startDate=${
        startDate.value.toISOString().split("T")[0]
      }&endDate=${endDate.value.toISOString().split("T")[0]}`
    ); */
    const data = await res.json();
    films.value = data;
  } catch (err) {
    console.error("Erreur import TMDb", err);
  } finally {
    loading.value = false;
  }
};

const handleValidatedFilms = (validated) => {
  console.log(validated.length);
  if (validated.length == 0) {
    alert("pas de données");
  }
  importStore.setImportedFilms(validated);
  /* navigateTo("/films/sauver"); */
};
</script>

<style scoped></style>
