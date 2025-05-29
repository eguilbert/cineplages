<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Liste des films en base</h1>
    <!-- 🔘 Sélecteur de période -->
    <div class="mb-6">
      <label class="block font-semibold mb-1">Période de programmation :</label>
      <div class="flex items-center gap-4">
        <div>
          <span class="text-sm text-gray-500">Du</span>
          <input type="date" v-model="startDate" class="border p-2 rounded" />
        </div>
        <div>
          <span class="text-sm text-gray-500">au</span>
          <input type="date" v-model="endDate" class="border p-2 rounded" />
        </div>
      </div>
    </div>
    <Button
      @click="importFromTMDB"
      class="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
    >
      Importer depuis TMDb (sorties FR semaine)
    </Button>

    <div v-if="loading" class="flex justify-center items-center my-8">
      <ProgressSpinner />
    </div>

    <div v-if="tmdbFilms.length">
      <div class="flex flex-wrap gap-4 items-center mb-4">
        <!-- <div>
          <label for="genreFilter">Filtrer par genre :</label>
          <select
            id="genreFilter"
            v-model="selectedGenre"
            class="border rounded px-2 py-1 ml-2"
          >
            <option value="">Tous</option>
            <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
          </select>
        </div> -->
        <div>
          <label for="sortField">Trier par :</label>
          <select
            id="sortField"
            v-model="sortField"
            class="border rounded px-2 py-1 ml-2"
          >
            <option value="title">Titre</option>
            <option value="genre">Genre</option>
            <option value="release_date">Date de sortie</option>
          </select>
        </div>
      </div>
      <h3 class="text-lg font-semibold mb-2">
        Sorties du {{ startDate }} au {{ endDate }}:
        {{ tmdbFilms.length }} films
      </h3>

      <div
        v-for="(film, index) in sortedTmdbFilms"
        :key="index"
        class="flex items-center gap-4 border p-2 rounded mb-2"
      >
        <img :src="film.poster_url" alt="" width="100" />
        <input type="checkbox" v-model="film.selected" />
        <div class="flex-1">
          <small> {{ film.release_date }} </small><br />

          <strong
            ><a
              :href="`https://www.themoviedb.org/movie/${film.tmdb_id}`"
              target="_blank"
              class="text-blue-600 hover:underline"
            >
              {{ film.title }}
            </a></strong
          ><small
            ><span v-if="film.production_countries">
              [{{ film.production_countries.join(", ") }}]</span
            ></small
          ><br />
          <small>
            <small
              class="inline-block px-2 py-1 rounded text-white text-xs"
              :style="{ backgroundColor: getGenreColor(film.genre) }"
            >
              {{ film.genre }}
            </small>
            <Tag severity="secondary" value="Secondary"
              >{{ film.duration }} min</Tag
            >
            —
            {{ film.director }}
            <br /><span>{{ film.keywords }}</span></small
          >
          <small> — {{ film.synopsis }}</small>
          <br />
          <small>Avec: {{ film.actors }}</small>
          <div class="mt-1">
            <label class="text-sm mr-2">Catégorie :</label>
            <select
              v-model="film.category"
              class="border rounded px-2 py-1 text-sm"
            >
              <option disabled value="">-- Choisir --</option>
              <option value="Art et Essai">Art et Essai</option>
              <option value="Documentaire">Documentaire</option>
              <option value="Jeunesse">Jeunesse</option>
              <option value="Grand Public">Grand Public</option>
            </select>
          </div>
        </div>
      </div>
      <button
        @click="validerTmdbSelection"
        class="mt-2 px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Valider les films TMDb sélectionnés
      </button>
    </div>

    <div class="flex flex-wrap gap-2 mt-4">
      <span
        v-for="g in genreList"
        :key="g"
        class="px-2 py-1 text-xs rounded text-white"
        :style="{ backgroundColor: getGenreColor(g) }"
      >
        {{ g }}
      </span>
    </div>

    <!-- <button
      @click="fetchMovies"
      class="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Importer les films de la semaine
    </button> -->

    <!--    <table class="min-w-full border text-sm">
      <thead class="bg-gray-200">
        <tr>
          <th class="p-2 border">Titre</th>
          <th class="p-2 border">Réalisateur</th>
          <th class="p-2 border">Genre</th>
          <th class="p-2 border">Durée</th>
          <th class="p-2 border">Catégorie</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="film in films" :key="film.id" class="hover:bg-gray-50">
          <td class="p-2 border">{{ film.title }}</td>
          <td class="p-2 border">{{ film.director }}</td>
          <td class="p-2 border">{{ film.genre }}</td>
          <td class="p-2 border">{{ film.duration }} min</td>
          <td class="p-2 border">{{ film.category || "—" }}</td>
        </tr>
      </tbody>
    </table> -->

    <!--  <button
      @click="importToGrille"
      class="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 btn btn-primary"
    >
      Importer les films OMDb
    </button> -->

    <div v-if="importedFilms.length" class="mt-6">
      <h3 class="text-lg font-semibold mb-2">Films importés (sélection)</h3>
      <div
        v-for="(film, index) in importedFilms"
        :key="index"
        class="flex items-center gap-4 border p-2 rounded mb-2"
      >
        <input type="checkbox" v-model="film.selected" />
        <div class="flex-1">
          <strong>{{ film.title }}</strong
          ><br />
          <small
            >{{ film.genre }} —{{ film.runtime }} — {{ film.director }}</small
          >
        </div>
      </div>
      <button
        @click="validerSelection"
        class="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Valider la sélection
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import ProgressSpinner from "primevue/progressspinner";

import { getGenreColor, genreList } from "@/utils/genreColors";
import { Badge } from "primevue";

const films = ref([]);
const importedFilms = ref([]);
const tmdbFilms = ref([]);
const sortField = ref("title");

const loading = ref(false);
const today = new Date();
const sixDaysLater = new Date();
sixDaysLater.setDate(today.getDate() + 6);

const formatDate = (date) => date.toISOString().split("T")[0];

const startDate = ref(formatDate(today));
const endDate = ref(formatDate(sixDaysLater));

const startD = startDate || lastThursday.toISOString().slice(0, 10);
const endD = endDate || today.toISOString().slice(0, 10);

const categories = ["Art et Essai", "Documentaire", "Jeunesse", "Grand Public"];

const importFromTMDB = async () => {
  loading.value = true;
  const params = new URLSearchParams();
  if (startDate.value) params.append("start", startDate.value);
  if (endDate.value) params.append("end", endDate.value);

  const res = await fetch(
    `http://localhost:4000/api/import/tmdb?${params.toString()}`
  );

  const data = await res.json();
  tmdbFilms.value = data.map((f) => ({
    ...f,
    selected: false,
    category: "",
    tmdb_id: f.tmdb_id || f.id,
  }));
  loading.value = false;
  console.log(sortField.value);

  console.log(tmdbFilms.value);
};

const sortedTmdbFilms = computed(() => {
  return [...tmdbFilms.value].sort((a, b) => {
    const valA = a[sortField.value] || "";
    const valB = b[sortField.value] || "";

    if (sortField.value === "release_date") {
      return new Date(valA).getTime() - new Date(valB).getTime();
    }

    return valA.toString().localeCompare(valB.toString());
  });
});
console.log(
  "Filtered:",
  sortedTmdbFilms.value.map((f) => [f.title, f.genre, f.release_date])
);

const validerTmdbSelection = async () => {
  const selection = tmdbFilms.value.filter((f) => f.selected);

  for (const film of selection) {
    await fetch("http://localhost:4000/api/films", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...film,
        remaining: film.genre === "Animation" ? 5 : 3,
      }),
    });
  }

  tmdbFilms.value = [];

  const r = await fetch("http://localhost:4000/api/films");
  films.value = await r.json();

  alert("Films TMDb ajoutés avec succès !");
};

onMounted(async () => {
  /*   const res = await fetchMovies();
   */ // const res = await fetch("http://localhost:4000/api/films");
  /*   films.value = await res.json();
   */

  importFromTMDB();
});

const importToGrille = async () => {
  const res = await fetch("http://localhost:4000/api/import/premiere");
  const data = await res.json();
  importedFilms.value = data.map((f) => ({ ...f, selected: false }));
};

const validerSelection = async () => {
  const selection = importedFilms.value.filter((f) => f.selected);

  for (const film of selection) {
    await fetch("http://localhost:4000/api/films", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...film,
        remaining: film.genre === "Animation" ? 5 : 3,
      }),
    });
  }

  importedFilms.value = [];

  const r = await fetch("http://localhost:3000/api/films");
  films.value = await r.json();

  alert("Importation réussie !");
};

const API_KEY = "18d8bd3d576cb957d3202bb8a8fb5aea";
const REGION = "FR";
const LANGUAGE = "fr-FR";
const startDateInput = ref(dayjs().format("YYYY-MM-DD"));
const endDateInput = ref(dayjs().add(6, "day").format("YYYY-MM-DD"));
const genres = ref([]);
const selectedGenres = ref([]);
const minRating = ref(6.5);
const movies = ref([]);
const filmCounts = ref({});

async function fetchMovies() {
  console.log("fetchMovies");
  const startDate = dayjs(startDateInput.value).format("YYYY-MM-DD");
  const endDate = dayjs(endDateInput.value).format("YYYY-MM-DD");

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}&include_adult=false&include_video=false&release_date.gte=${startDate}&release_date.lte=${endDate}`;

  console.log(url);
  const res = await fetch(url);
  const data = await res.json();

  const genreMap = Object.fromEntries(genres.value.map((g) => [g.id, g.name]));

  films.value = data.results
    .filter((film) => film.vote_average >= minRating.value)
    .map((film) => {
      const genresNames = film.genre_ids.map((id) => genreMap[id] || "Inconnu");
      const maxShowings = genresNames.includes("Documentaire")
        ? 2
        : genresNames.includes("Animation")
        ? 4
        : genresNames.includes("Horreur")
        ? 3
        : 6;
      filmCounts.value[film.id] = 0;
      return {
        ...film,
        genres: genresNames,
        maxShowings,
      };
    });
}
</script>
