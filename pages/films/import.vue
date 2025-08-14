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
const config = useRuntimeConfig();
const startDate = ref(new Date());
const endDate = ref(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000));
const films = ref([]);
const loading = ref(false);

const importStore = useImportStore();
const { apiFetch } = useApi();
const importFilms = async () => {
  loading.value = true;
  try {
    const res = await apiFetch(
      `/import/tmdb?start=${startDate.value.toISOString().split("T")[0]}&end=${
        endDate.value.toISOString().split("T")[0]
      }`
    );
    const data = await res.json();
    films.value = data;
  } catch (err) {
    console.error("Erreur import TMDb", err);
  } finally {
    loading.value = false;

    console.log("data", films.value);
  }
};

const handleValidatedFilms = (validated) => {
  importStore.setImportedFilms(validated);
  navigateTo("/films/sauver");
};

/**
 * Analyse les infos TMDB d’un film pour générer des mots-clés thématiques et stylistiques
 * @param tmdbId - ID du film sur TMDb
 * @returns Tableau de mots-clés (genre, style, thèmes)
 */

async function extractKeywordsFromTMDB(tmdbId) {
  const keywords = new Set();

  try {
    const [movieRes, creditsRes, kwRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
        params: { api_key: TMDB_API_KEY, language: "fr-FR" },
      }),
      axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/credits`, {
        params: { api_key: TMDB_API_KEY },
      }),
      axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/keywords`, {
        params: { api_key: TMDB_API_KEY },
      }),
    ]);

    const movie = movieRes.data;
    const overview = (movie.overview || "").toLowerCase();
    const genreList = (movie.genres || []).map((g) => g.name.toLowerCase());
    const keywordsList = (kwRes.data.keywords || []).map((k) =>
      k.name.toLowerCase()
    );

    // 🔹 Genre
    if (genreList.includes("thriller")) keywords.add("thriller psychologique");
    if (genreList.includes("drame")) keywords.add("drame social");
    if (genreList.includes("documentaire")) keywords.add("documentaire engagé");

    // 🔹 Thématiques récurrentes
    const themeHints = [
      {
        match: ["femme", "féminicide", "harcèlement", "violence conjugale"],
        tag: "violence envers les femmes",
      },
      {
        match: ["journaliste", "enquête", "médias"],
        tag: "presse / journalisme",
      },
      { match: ["banlieue", "quartier", "cité"], tag: "territoires urbains" },
      { match: ["immigration", "réfugié", "exil"], tag: "exil / migration" },
      { match: ["ado", "adolescent", "lycée"], tag: "adolescence" },
    ];

    for (const { match, tag } of themeHints) {
      if (match.some((m) => overview.includes(m))) keywords.add(tag);
    }

    // 🔹 Style & contexte
    if (
      overview.includes("premier film") ||
      overview.includes("réalisateur débutant")
    ) {
      keywords.add("premier film");
    }

    // 🔹 Récupération de mots-clés TMDB utiles
    for (const kw of keywordsList) {
      if (
        [
          "revenge",
          "family",
          "investigation",
          "abuse",
          "murder",
          "secrets",
        ].includes(kw)
      ) {
        keywords.add(kw);
      }
    }

    return Array.from(keywords);
  } catch (error) {
    console.error(`Erreur lors de l’analyse du TMDB ID ${tmdbId} :`, error);
    return [];
  }
}
</script>

<style scoped></style>
