<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="mb-4">
      <h2 class="text-lg font-semibold">🎨 Code couleur des suggestions :</h2>
      <div class="flex flex-wrap gap-4 text-sm mt-2">
        <div class="flex items-center gap-2">
          <span
            class="w-4 h-4 rounded bg-green-50 border border-green-200"
          ></span>
          Enfants / scolaire (14:00)
        </div>
        <div class="flex items-center gap-2">
          <span
            class="w-4 h-4 rounded bg-yellow-50 border border-yellow-300"
          ></span>
          Documentaire (16:00)
        </div>
        <div class="flex items-center gap-2">
          <span
            class="w-4 h-4 rounded bg-blue-50 border border-blue-200"
          ></span>
          Art & essai (18:00)
        </div>
        <div class="flex items-center gap-2">
          <span class="w-4 h-4 rounded bg-red-50 border border-red-200"></span>
          Grand public (20:00)
        </div>
        <div class="flex items-center gap-2">
          <span
            class="w-4 h-4 rounded bg-purple-50 border border-purple-300"
          ></span>
          Thriller / adulte (22:00)
        </div>
      </div>
    </div>
    <h1 class="text-2xl font-bold mb-4">
      🎬 Suggestions + Programmation Multi-Salles
    </h1>

    <!-- 🔘 Sélecteur de période -->
    <div class="mb-6">
      <label class="block font-semibold mb-1">Période de programmation :</label>
      <div class="flex items-center gap-4">
        <div>
          <span class="text-sm text-gray-500">Du</span>
          <input
            type="date"
            v-model="startDateInput"
            class="border p-2 rounded"
          />
        </div>
        <div>
          <span class="text-sm text-gray-500">au</span>
          <input
            type="date"
            v-model="endDateInput"
            class="border p-2 rounded"
          />
        </div>
      </div>
    </div>

    <div class="md:flex gap-6">
      <aside
        class="md:w-1/3 sticky top-20 self-start max-h-[80vh] overflow-y-auto pr-2 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
      >
        <h2 class="text-xl font-semibold mb-4 text-gray-700">
          🎞️ Films disponibles
        </h2>
        <div class="relative mb-4">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="🔎 Rechercher un film ou un genre..."
            class="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <button
            v-if="searchTerm"
            @click="searchTerm = ''"
            class="absolute right-2 top-2 text-gray-400 hover:text-red-500 text-sm"
            title="Effacer"
          >
            ✖
          </button>
        </div>
        <div v-if="filteredMovies.length" class="grid grid-cols-1 gap-4 mb-10">
          <div
            v-for="movie in filteredMovies"
            :key="movie.id"
            draggable="true"
            @dragstart="
              (e) => e.dataTransfer.setData('film', JSON.stringify(movie))
            "
            :class="[
              getSuggestedColorClass(movie.genres),
              'p-4 border rounded-lg shadow hover:shadow-md transition cursor-move',
            ]"
          >
            <div
              class="font-semibold text-base text-gray-800 flex items-center justify-between"
            >
              {{ movie.title }}
              <span
                class="ml-2 px-2 py-0.5 text-xs rounded-full border bg-white/60 text-gray-600 border-gray-300"
              >
                {{ movie.genres[0] }}
              </span>
            </div>
            <div class="text-xs text-gray-600">
              Genres : {{ movie.genres.join(", ") }}
            </div>
            <div class="text-xs text-gray-500">⭐ {{ movie.vote_average }}</div>
            <div
              class="text-xs mt-1"
              :class="
                movie.maxShowings - filmCounts[movie.id] <= 0
                  ? 'text-red-600 font-semibold'
                  : 'text-gray-800'
              "
            >
              Restants : {{ movie.maxShowings - filmCounts[movie.id] }} /
              {{ movie.maxShowings }}
            </div>
            <a
              :href="`https://www.themoviedb.org/search?query=${encodeURIComponent(
                movie.title
              )}`"
              target="_blank"
              class="text-xs text-blue-600 underline mt-1 inline-block"
            >
              Voir sur TMDB
            </a>
          </div>
        </div>
      </aside>

      <section class="flex-1">
        <h2 class="text-xl font-semibold mb-4">
          🗓️ Grille de programmation (Salle 1 & 2)
        </h2>

        <div v-for="salle in salles" :key="salle" class="mb-8">
          <h3 class="text-lg font-bold text-blue-700 mb-2">{{ salle }}</h3>
          <div class="grid grid-cols-8 gap-1">
            <div></div>
            <div
              v-for="jour in jours"
              :key="jour"
              class="text-center font-bold text-orange-700"
            >
              {{ jour }}
            </div>

            <template v-for="horaire in horaires" :key="horaire">
              <div class="text-right font-semibold pr-2">{{ horaire }}</div>
              <div
                v-for="jour in jours"
                :key="salle + '-' + jour + '-' + horaire"
                class="relative min-h-[60px] p-2 text-sm border flex items-center justify-center text-center"
                :class="getSlotColor(jour, horaire)"
                @dragover.prevent
                @drop="(e) => handleDrop(salle, jour, horaire, e)"
              >
                <div
                  v-if="grille[salle + '-' + jour + '-' + horaire]?.title"
                  class="w-full text-center"
                >
                  {{ grille[salle + "-" + jour + "-" + horaire]?.title }}
                  <button
                    @click.stop="clearSlot(salle, jour, horaire)"
                    class="absolute top-1 right-1 text-red-500 text-xs font-bold hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
                <span v-else class="italic opacity-30">—</span>
              </div>
            </template>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
function getSuggestedColorClass(genres) {
  if (genres.includes("Documentaire")) return "bg-yellow-50 border-yellow-300";
  if (genres.includes("Animation")) return "bg-green-50 border-green-200";
  if (genres.includes("Horreur")) return "bg-purple-50 border-purple-300";
  if (genres.includes("Drame") || genres.includes("Romance"))
    return "bg-blue-50 border-blue-200";
  return "bg-red-50 border-red-200"; // par défaut blockbuster
}
const searchTerm = ref("");
const filteredMovies = computed(() => {
  if (!searchTerm.value) return movies.value;
  const term = searchTerm.value.toLowerCase();
  return movies.value.filter(
    (movie) =>
      movie.title.toLowerCase().includes(term) ||
      movie.genres.some((g) => g.toLowerCase().includes(term))
  );
});
import { ref, onMounted } from "vue";
import dayjs from "dayjs";

const config = useRuntimeConfig();
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

const jours = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
const horaires = ["14:00", "16:00", "18:00", "20:00", "22:00"];
const salles = ["Salle 1", "Salle 2"];
const grille = ref({});

function getSlotColor(jour, horaire) {
  const genreSuggestion = {
    "14:00": "bg-green-50 border-green-200", // enfants / scolaire
    "16:00": "bg-yellow-50 border-yellow-300", // documentaire
    "18:00": "bg-blue-50 border-blue-200", // art et essai
    "20:00": "bg-red-50 border-red-200", // grand public
    "22:00": "bg-purple-50 border-purple-300", // thriller / adulte
  };
  return genreSuggestion[horaire] || "bg-white";
}

async function fetchMovies() {
  const startDate = dayjs(startDateInput.value).format("YYYY-MM-DD");
  const endDate = dayjs(endDateInput.value).format("YYYY-MM-DD");

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}&include_adult=false&include_video=false&release_date.gte=${startDate}&release_date.lte=${endDate}`;

  const res = await fetch(url);
  const data = await res.json();

  const genreMap = Object.fromEntries(genres.value.map((g) => [g.id, g.name]));

  movies.value = data.results
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
fetchMovies();
function handleDrop(salle, jour, horaire, event) {
  event.preventDefault();
  const film = JSON.parse(event.dataTransfer.getData("film"));
  const key = `${salle}-${jour}-${horaire}`;

  if (filmCounts.value[film.id] >= film.maxShowings) {
    alert(
      `Le film "${film.title}" a déjà atteint son maximum de ${film.maxShowings} passages.`
    );
    return;
  }

  // retirer ancien film
  const existing = grille.value[key];
  if (existing && filmCounts.value[existing.id]) {
    filmCounts.value[existing.id]--;
  }

  grille.value[key] = film;
  filmCounts.value[film.id]++;
}

function clearSlot(salle, jour, horaire) {
  const key = `${salle}-${jour}-${horaire}`;
  const current = grille.value[key];
  if (current && filmCounts.value[current.id]) {
    filmCounts.value[current.id]--;
  }
  grille.value[key] = null;
}

function exportGrille() {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(grille.value, null, 2));
  const dl = document.createElement("a");
  dl.setAttribute("href", dataStr);
  dl.setAttribute(
    "download",
    `grille-programmation-${startDateInput.value}.json`
  );
  document.body.appendChild(dl);
  dl.click();
  dl.remove();
}

async function fetchGenres() {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=${LANGUAGE}`
  );
  const data = await res.json();
  genres.value = data.genres;
}

onMounted(fetchGenres);
</script>
