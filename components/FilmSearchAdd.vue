<template>
  <div class="space-y-4 my-4 bg-slate-200 p-4 rounded">
    + <small>Rajouter un film à la sélection</small>
    <input
      v-model="query"
      @input="searchFilm"
      placeholder="Rechercher un film..."
      class="border p-2 w-full rounded"
    />

    <div v-if="results.length" class="space-y-2">
      <Button
        @click="resetSearch"
        class="mt-2 text-sm text-gray-500 underline hover:text-black bg-red-100"
      >
        Fermer les résultats
      </Button>
      <div
        v-for="film in results"
        :key="film.tmdbId"
        class="flex items-center justify-between border p-2 rounded"
      >
        <div class="flex items-center space-x-2">
          <img
            v-if="film.poster"
            :src="film.poster"
            alt="poster"
            class="w-12 h-18 object-cover rounded"
          />
          <span>{{ film.title }}</span>
        </div>

        <div class="flex items-center space-x-2">
          <select
            v-model="selectedCategories[film.tmdbId]"
            class="border rounded p-1"
          >
            <option disabled value="">Catégorie</option>
            <option>Art et Essai</option>
            <option>Grand Public</option>
            <option>Jeunesse</option>
            <option>Documentaire</option>
          </select>
          <button
            @click="addFilmToSelection(film)"
            class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useFetch } from "#app";

import { Button } from "primevue";

const props = defineProps({
  selectionId: Number,
});
const searchQuery = ref("");
const searchResults = ref([]);
const isSearching = ref(false);

const config = useRuntimeConfig();
const query = ref("");
const results = ref([]);
const selectedCategories = ref({});
const searchFilm = async () => {
  if (!query.value.trim()) return;

  // Recherche locale
  const local = await $fetch(
    `${config.public.apiBase}/films/search?q=${encodeURIComponent(query.value)}`
  );
  if (local.length) {
    results.value = local;
  } else {
    // Recherche TMDB
    const tmdb = await $fetch(
      `${config.public.apiBase}/tmdb/search?q=${encodeURIComponent(
        query.value
      )}`
    );
    results.value = tmdb;
  }
};
watch(searchQuery, async (query) => {
  if (!query) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  const { data, error } = await useFetch(`/api/films/search?query=${query}`);
  if (!error.value) {
    searchResults.value = data.value;
  }
  isSearching.value = false;
});
const addFilmToSelection = async (film) => {
  const category = selectedCategories.value[film.tmdbId];
  if (!category) {
    alert("Merci de sélectionner une catégorie.");
    return;
  }

  try {
    await $fetch(
      `${config.public.apiBase}/selections/${props.selectionId}/add-film`,
      {
        method: "POST",
        body: {
          tmdbId: film.tmdbId,
          category,
        },
      }
    );
    alert(`Film "${film.title}" ajouté à la sélection.`);
  } catch (err) {
    console.error("Erreur ajout film:", err);
    alert("Erreur lors de l'ajout.");
  }
};
function resetSearch() {
  searchQuery.value = "";
  searchResults.value = [];
  results.value = [];
  isSearching.value = false;
}
</script>
