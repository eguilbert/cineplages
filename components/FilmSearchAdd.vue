<template>
  <div class="space-y-4">
    <input
      v-model="query"
      @input="searchFilm"
      placeholder="Rechercher un film..."
      class="border p-2 w-full rounded"
    />

    <div v-if="results.length" class="space-y-2">
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
import { useRuntimeConfig } from "#imports";

const props = defineProps({
  selectionId: Number,
});

const config = useRuntimeConfig();
const query = ref("");
const results = ref([]);
const selectedCategories = ref({});

const searchFilm = async () => {
  if (!query.value.trim()) return;

  // Recherche locale
  const local = await $fetch(
    `/api/films/search?q=${encodeURIComponent(query.value)}`
  );
  if (local.length) {
    results.value = local;
  } else {
    // Recherche TMDB
    const tmdb = await $fetch(
      `/api/tmdb/search?q=${encodeURIComponent(query.value)}`
    );
    results.value = tmdb;
  }
};

const addFilmToSelection = async (film) => {
  const category = selectedCategories.value[film.tmdbId];
  if (!category) {
    alert("Merci de sélectionner une catégorie.");
    return;
  }

  try {
    await $fetch(`/api/selections/${props.selectionId}/add-film`, {
      method: "POST",
      body: {
        tmdbId: film.tmdbId,
        category,
      },
    });
    alert(`Film "${film.title}" ajouté à la sélection.`);
  } catch (err) {
    console.error("Erreur ajout film:", err);
    alert("Erreur lors de l'ajout.");
  }
};
</script>
