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
            v-model="selectedCategories[getTmdbId(film)]"
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
import { ref, watch } from "vue";
const { apiFetch } = useApi();

const props = defineProps({ selectionId: Number });
const emit = defineEmits(["added"]);

const query = ref("");
const results = ref([]);
const selectedCategories = ref({});

const getTmdbId = (film) => film.tmdbId ?? film.id;

const searchFilm = async () => {
  const q = query.value.trim();
  if (!q) {
    results.value = [];
    return;
  }

  // Essaie local d'abord
  const local = await apiFetch(`/films/search?q=${encodeURIComponent(q)}`);
  if (Array.isArray(local) && local.length) {
    results.value = local;
    return;
  }

  // Sinon TMDB
  const tmdb = await apiFetch(`/tmdb/search?q=${encodeURIComponent(q)}`);
  results.value = Array.isArray(tmdb) ? tmdb : [];
};

const addFilmToSelection = async (film) => {
  const tmdbId = getTmdbId(film);
  const category = selectedCategories.value[tmdbId];

  if (!category) {
    alert("Merci de sélectionner une catégorie.");
    return;
  }

  const res = await apiFetch(`/selections/${props.selectionId}/add-film`, {
    method: "POST",
    body: { tmdbId, category },
  });

  // ✅ rafraîchir la sélection affichée
  emit("added", res?.selection);

  alert(`Film "${film.title}" ajouté à la sélection.`);
};

function resetSearch() {
  query.value = "";
  results.value = [];
}
</script>
