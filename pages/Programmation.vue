<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Programmation</h1>

    <FilmSearchAdd :selection-id="selectedSelectionId" v-if="isAdmin" />
    <!-- Sélecteur de sélection -->
    <Select
      v-model="selectedSelectionId"
      :options="visibleSelections"
      optionLabel="name"
      optionValue="id"
      placeholder="Choisir une sélection"
      class="mb-4 md:w-1/3 text-sm h-9 px-2 py-0"
      @change="loadSelection"
      panelClass="text-sm"
    />

    <!-- Menu flottant catégories -->
    <div
      class="fixed top-100 -left-2 bg-white shadow p-2 rounded z-10 shadow-lg"
      v-if="selectedSelectionId"
    >
      <hr />
      <div v-for="cat in categories" :key="cat">
        <a
          :href="`#cat-${cat}`"
          @click.prevent="scrollToCategory(cat)"
          class="block text-sm hover:underline p-2"
          :style="{ backgroundColor: getCategoryColor(cat) }"
        >
          {{ cat }}
        </a>
      </div>
    </div>

    <!-- Affichage de la sélection choisie -->
    <div v-if="selection" class="mb-6">
      <h2 class="text-xl font-light mb-2 mt-4">
        {{ selection.name }}
        <small> ({{ selection.films.length }} films)</small>
      </h2>
      <p v-if="selection.id == 15" class="text-sm mb-8">
        La réunion de programmation aura lieu le 29 aout 2025. Veuillez voter
        avant cette date.
      </p>
      <p>
        {{ selection.description }}
      </p>

      <p v-if="selection.id == 11" class="text-sm mb-8">
        Cette sélection comprend les films d'Art et Essai et Documentaires de
        début août jusqu'au 3 septembre, et les films Grand Public et Jeunesse
        de septembre.
      </p>

      <!-- Changer affichage -->
      <div class="mb-4 flex gap-4 items-center" v-if="selectedSelectionId">
        <Button
          icon="pi pi-th-large"
          text
          @click="layout = 'grid'"
          v-if="layout === 'row'"
        />
        <Button icon="pi pi-bars" text @click="layout = 'row'" v-else />
        <!-- Filtre par date -->
        <Select
          v-if="selectedSelectionId"
          v-model="selectedDate"
          :options="availableDates"
          optionLabel="label"
          optionValue="value"
          placeholder="Filtrer par date de sortie"
          class="md:w-1/3 small"
        />
        <label>
          <input type="checkbox" v-model="sortByInterest" />
          Trier par score
        </label>

        <button
          @click="handlePrint"
          class="print-button justify-self-end ml-auto"
        >
          🖨️ Imprimer la sélection
        </button>
      </div>
      <div id="print-area">
        <!-- ✅ VERSION IMPRESSION SIMPLIFIÉE -->
        <div class="print-only" v-if="selection">
          <h1 class="print-title">Programmation – {{ selection.name }}</h1>

          <div
            v-for="cin in printByCinema"
            :key="cin.cinemaId"
            class="print-cinema"
          >
            <h2 class="print-cinema-title">
              {{ cin.cinemaName }}
              <span class="print-small">({{ cin.items.length }} films)</span>
            </h2>

            <ul class="print-list">
              <li
                v-for="item in cin.items"
                :key="item.filmId"
                class="print-row"
              >
                <span class="print-film-title">{{ item.title }}</span>
                <span class="print-sessions">{{ item.seances }} séance(s)</span>
              </li>
            </ul>
          </div>
        </div>
        <div
          v-for="categorie in categories"
          :key="categorie"
          class="mb-6 flex flex-col"
        >
          <h3
            :id="`cat-${categorie}`"
            class="text-lg font-light mb-2 pb-1 p-1"
            :style="{ color: getCategoryColor(categorie) }"
          >
            {{ categorie }} ({{ getFilteredFilms(categorie).length }})
          </h3>

          <div
            v-if="layout === 'grid'"
            class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <FilmCard
              v-for="film in getFilteredFilms(categorie)"
              :key="film.id"
              :film="film"
              :role="user.role"
              :isAdmin="isAdmin"
              :username="user.username"
              :userId="user.id"
              :displayMode="layout"
              :voteOpen="voteMode"
              :initialInterestCounts="stats[film.id]"
              :interestCounts="interestStats?.[film.id] || null"
              :mode="'programmation'"
              :selectionId="selectedSelectionId"
              @score-changed="onScoreChanged"
              @interest-change="handleInterestChange"
              @update="handleFilmUpdate"
              @remove="handleFilmRemove"
              @toggle-selection="toggleFilmSelection"
              class="col-12 md:col-2 lg:col-3"
            />
            <!--:interestCounts="interestStats?.[film.id] || null"
            :initialInterest="interestMap[film.id] || null"-->
          </div>

          <div v-else class="flex flex-col gap-4">
            <FilmCard
              v-for="film in getFilteredFilms(categorie)"
              :key="film.id"
              :film="film"
              :role="role"
              :isAdmin="isAdmin"
              :username="username"
              :userId="userId"
              :displayMode="layout"
              :voteOpen="voteMode"
              :initial-interest-counts="stats[film.id]"
              :mode="'programmation'"
              @score-changed="onScoreChanged"
              @interest-change="handleInterestChange"
              @update="handleFilmUpdate"
              @remove="handleFilmRemove"
              @update-interest-counts="handleInterestCounts"
              @toggle-selection="toggleFilmSelection"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Barre de sélection fixe en bas -->
    <transition name="slide-up" v-if="isAdmin">
      <div
        v-show="isBarVisible"
        class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow z-50 px-4 py-3"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold">
            🎯 {{ selectedFilms.length }} film(s) sélectionné(s)
          </h2>
          <Button label="Approuver la sélection" @click="submitSelection" />
        </div>
        <div class="flex gap-3 mt-2 overflow-x-auto">
          <div
            v-for="film in selectedFilms"
            :key="film.id"
            class="min-w-[100px] bg-gray-50 border rounded p-2 text-xs text-center"
          >
            <img
              :src="film.poster || '/placeholder.png'"
              class="w-16 h-24 object-cover mx-auto mb-1"
            />
            <div class="truncate">{{ film.title }}</div>
            <div
              class="text-[10px] mt-1 text-white px-1 rounded"
              :style="{ backgroundColor: getCategoryColor(film.category) }"
            >
              {{ film.category }}
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Onglet de toggle -->
    <div
      class="fixed bottom-0 right-0 bg-blue-600 text-white text-sm px-4 py-2 rounded-tl cursor-pointer z-50"
      @click="isBarVisible = !isBarVisible"
      v-if="isAdmin"
    >
      🎯 {{ selectedFilms.length }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import Button from "primevue/button";
import Select from "primevue/select";
import FilmCard from "~/components/FilmCard.vue";
import { watch } from "vue";
import { getCategoryColor } from "@/utils/genreColors";
import { useToast } from "primevue/usetoast";
import { useAuth } from "@/composables/useAuth";
import { useInterestStats } from "@/composables/useInterestStats";
import { prefetchComponents } from "nuxt/app";
const { user, isAuthenticated, isAdmin, getUser } = useAuth();
const visibleSelections = computed(() => {
  return selections.value.filter((s) => s.status === "programmation");
});
const toast = useToast();
const config = useRuntimeConfig();
const selections = ref([]);
const selection = ref(null);
const selectedSelectionId = ref();
/* const selectedSelectionId = ref(15); */
const selectedDate = ref(null);
const layout = ref("grid");
const categories = ["Art et Essai", "Documentaire", "Grand Public", "Jeunesse"];
const interestStats = ref({});
/* const { role, username, userId, fetchRole } = useUserRole(); */
const { fetchInterests } = useMyInterests();
const rawInterests = ref([]);
const interestMap = ref({}); // { [film_id]: "MUST_SEE" }
const sortByInterest = ref(false);
const voteMode = ref(false);
const selectedFilms = ref([]);
const { updateInterest } = useMyInterests();
const scoreFilm = ref(0);
const isBarVisible = ref(false);
const { stats, fetchStatsForFilms } = useInterestStats();
const { apiFetch } = useApi();
const toggleFilmSelection = (film) => {
  const index = selectedFilms.value.findIndex((f) => f.id === film.id);
  if (index === -1) {
    selectedFilms.value.push(film);
  } else {
    selectedFilms.value.splice(index, 1);
  }
};

const printByCinema = computed(() => {
  if (!selection.value?.films?.length) return [];

  const map = new Map();
  const films = selection.value.films.filter((f) => f.selected === true);

  for (const film of films) {
    const entries = extractCinemaEntries(film);

    for (const e of entries) {
      const cinemaId = e.cinemaId ?? "unknown";
      const cinemaName = e.cinemaName ?? "Cinéma (non renseigné)";
      const seances = Number(e.seances ?? 0);

      if (!map.has(cinemaId)) {
        map.set(cinemaId, { cinemaId, cinemaName, items: [] });
      }

      map.get(cinemaId).items.push({
        filmId: film.id,
        title: film.title,
        seances,
      });
    }
  }

  // tri cinéma par nom + tri films par titre
  const res = [...map.values()].sort((a, b) =>
    a.cinemaName.localeCompare(b.cinemaName, "fr"),
  );
  res.forEach((c) =>
    c.items.sort((a, b) => a.title.localeCompare(b.title, "fr")),
  );

  return res;
});

/**
 * ✅ Adaptateur : retourne une liste d'objets { cinemaId, cinemaName, seances }
 * -> ajuste ici si ton backend renvoie un autre shape
 */
function extractCinemaEntries(film) {
  // 1) Cas: film.programmings = [{ cinemaId, cinemaName, seances }]
  if (Array.isArray(film.programmings) && film.programmings.length) {
    return film.programmings.map((p) => ({
      cinemaId: p.cinemaId,
      cinemaName: p.cinemaName,
      seances: p.seances ?? p.sessions ?? 0,
    }));
  }

  // 2) Cas: film.projections = [{ cinemaId, cinemaName, ... }] => on compte
  if (Array.isArray(film.projections) && film.projections.length) {
    const byCinema = new Map();
    for (const pr of film.projections) {
      const id = pr.cinemaId ?? pr.cinema?.id ?? "unknown";
      const name = pr.cinemaName ?? pr.cinema?.name ?? "Cinéma (non renseigné)";
      byCinema.set(id, {
        cinemaId: id,
        cinemaName: name,
        seances: (byCinema.get(id)?.seances ?? 0) + 1,
      });
    }
    return [...byCinema.values()];
  }

  // 3) Cas: film.selectionFilmProgrammings (pivot) = [{ cinemaId, cinema:{name}, sessionsCount }]
  if (
    Array.isArray(film.selectionFilmProgrammings) &&
    film.selectionFilmProgrammings.length
  ) {
    return film.selectionFilmProgrammings.map((p) => ({
      cinemaId: p.cinemaId ?? p.cinema?.id,
      cinemaName: p.cinema?.name ?? p.cinemaName,
      seances: p.sessionsCount ?? p.nbSeances ?? p.seances ?? 0,
    }));
  }

  // fallback : pas d’info cinéma -> une ligne “unknown”
  return [
    { cinemaId: "unknown", cinemaName: "Cinéma (non renseigné)", seances: 0 },
  ];
}

const availableDates = computed(() => {
  if (!selection.value) return [{ label: "Toutes les dates", value: null }];

  // 1) On fabrique des clés YYYY-MM-DD uniques
  const keys = new Set(
    selection.value.films.map((f) => toDateKey(f.releaseDate)).filter(Boolean),
  );

  // 2) Tri croissant par clé (lexicographique OK au format YYYY-MM-DD)
  const sortedKeys = [...keys].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  // 3) Map → label lisible + value = clé stable
  const opts = sortedKeys.map((key) => ({
    label: fromKeyToLocalDate(key).toLocaleDateString("fr-FR"),
    value: key, // <-- clé stable
  }));

  // 4) Ajoute "Toutes les dates"
  return [{ label: "Toutes les dates", value: null }, ...opts];
});

onMounted(async () => {
  selections.value = await apiFetch(`/selections`); // ✅ données directes
  if (selectedSelectionId.value) {
    await loadSelection();
  }
});

watch(selectedSelectionId, async (newId) => {
  if (newId) {
    await loadSelection();
  }
});

const loadSelection = async () => {
  selection.value = await apiFetch(
    `/programmation/${selectedSelectionId.value}`,
  );
  selection.value.films = selection.value.films.map((film) => ({
    ...film,
    layout: undefined,
    // ✅ priorité : score stocké en pivot, puis live, puis calcul local
    score: film.storedScore ?? film.liveScore ?? computeScore(film),
  }));
  const filmIds = selection.value.films.map((film) => film.id);
  await fetchStatsForFilms(filmIds); // ✅ passe un array, pas une string
  interestStats.value = stats.value;

  console.log("Intérêts films", interestStats.value);

  //Get MY interests
  const myInterests = await fetchInterests();
  rawInterests.value = myInterests;
  console.log("Mes intérêts", myInterests);
  // Transformer la liste en map par film_id (si != "SANS_OPINION")
  interestMap.value = Object.fromEntries(
    myInterests
      .filter((item) => item.value !== "SANS_OPINION")
      .map((item) => [item.film_id, item.value]),
  );
  console.log("interestMap", interestMap.value);
  if (selectedSelectionId.value == 11) {
    voteMode.value = true;
  } else {
    voteMode.value = false;
  }
};

function onScoreChanged({ filmId, score }) {
  const f = selection.value?.films.find((x) => x.id === filmId);
  if (f) f.score = score;
  if (sortByInterest.value) {
    selection.value.films.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }
}

function getInterestScore(counts = {}) {
  return (
    (counts.MUST_SEE || 0) * 3 +
    (counts.VERY_INTERESTED || 0) * 2 +
    (counts.CURIOUS || 0) * 1 +
    (counts.NOT_INTERESTED || 0) * -1 +
    (counts.SANS_OPINION || 0) * 0
  );
}
// helpers dates (locales)
const toDateKey = (v) => {
  if (!v) return null;
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) {
    return v.slice(0, 10); // déjà YYYY-MM-DD
  }
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const fromKeyToLocalDate = (key) => new Date(`${key}T00:00:00`);

/* const getFilteredFilms = (category) => {
  if (!selection.value) return [];

  let filtered = selection.value.films
    .filter((f) => f.category === category)
    .filter(
      (f) =>
        !selectedDate.value ||
        new Date(f.releaseDate).toISOString().slice(0, 10) ===
          selectedDate.value
    );

  if (sortByInterest.value) {

    filtered = filtered.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  } else {
    // ✅ Tri par date (défaut)
    filtered = filtered.sort((a, b) => {
      return (
        new Date(a.releaseDate || "1900-01-01") -
        new Date(b.releaseDate || "1900-01-01")
      );
    });
  }
  return filtered;
}; */

const getFilteredFilms = (category) => {
  if (!selection.value) return [];
  const targetKey = toDateKey(selectedDate.value);

  let filtered = selection.value.films.filter(
    (f) =>
      f.category === category &&
      (!targetKey || toDateKey(f.releaseDate) === targetKey) &&
      f.selected == true,
  );

  // clone avant sort pour ne pas muter la source
  if (sortByInterest.value) {
    filtered = [...filtered].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  } else {
    const timeOf = (v) => {
      const k = toDateKey(v);
      return k ? Date.parse(`${k}T00:00:00`) : Number.POSITIVE_INFINITY;
    };
    filtered = [...filtered].sort(
      (a, b) => timeOf(a.releaseDate) - timeOf(b.releaseDate),
    );
  }
  return filtered;
};

const handleFilmUpdate = async (updatedFilm) => {
  alert(JSON.stringify(updatedFilm, null, 2));
  console.log("Mise à jour film", updatedFilm, updatedFilm.externalLinks);
  try {
    await apiFetch(`/films/${updatedFilm.id}/details`, {
      method: "PUT",
      body: {
        commentaire: updatedFilm.commentaire,
        rating: updatedFilm.rating,
        tags: updatedFilm.tags,
        awards: updatedFilm.awards,
        externalLinks: updatedFilm.externalLinks,
      },
    });
  } catch (error) {
    console.error("Erreur mise à jour film", error);
  }
};

const handleFilmRemove = (filmToRemove) => {
  if (!selection.value) return;
  selection.value.films = selection.value.films.filter(
    (f) => f.id !== filmToRemove.id,
  );
  //TODO delete film from selection
};

const scrollToCategory = (cat) => {
  const el = document.getElementById(`cat-${cat}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
const startVote = async () => {
  const input = prompt("Combien de votants pour ce vote ?");
  const nbVotants = parseInt(input);

  if (isNaN(nbVotants) || nbVotants <= 0) {
    toast.add({
      severity: "error",
      summary: "Entrée invalide",
      detail: "Veuillez entrer un nombre valide de votants",
      life: 3000,
    });
    return;
  }

  // ⚙️ Mise à jour du rating pour chaque film sélectionné
  selectedFilms.forEach((film) => {
    if (!film.votes || film.votes.length === 0) return;
    const somme = film.votes.reduce((acc, v) => acc + v.note, 0);
    film.rating = Math.round((somme / nbVotants) * 10) / 10; // ✅ format 1 chiffre après virgule
    film.score = computeScore(film); // si tu l'as défini globalement
  });

  toast.add({
    severity: "success",
    summary: "Vote démarré",
    detail: `${nbVotants} votants pris en compte.`,
    life: 4000,
  });

  isBarVisible.value = true;
  voteMode.value = true;
};

function handleInterestCounts({ filmId, oldValue, newValue }) {
  console.log("handleInterestCounts:", filmId, oldValue, "→", newValue);
  const current = interestStats.value[filmId] || {
    SANS_OPINION: 0,
    NOT_INTERESTED: 0,
    VERY_INTERESTED: 0,
    CURIOUS: 0,
    MUST_SEE: 0,
  };
  if (oldValue === newValue) {
    console.log("Aucun changement d'intérêt détecté, rien à faire.");
    return;
  }
  console.log("current interest stats:", current);
  // Met à jour proprement les comptes
  interestStats.value[filmId] = {
    ...current,
    [oldValue]: Math.max((current[oldValue] || 1) - 1, 0),
    [newValue]: (current[newValue] || 0) + 1,
  };
  console.log(
    "Calcul Updated interest stats:",
    current[oldValue],
    current[newValue],
  );
  console.log("Updated interest stats:", interestStats.value[filmId]);
}
const handlePrint = async () => {
  await nextTick();
  window.print();
};

function computeScore(film) {
  console.log("computeScore for film", film.title, film.id);
  const votes = film.rating || 0; // ou autre metric
  const interestScore = getInterestScore(interestStats.value[film.id] || {});
  console.log("computeScore for film", votes * 2 + interestScore);
  return votes * 2 + interestScore;
}
const updateFilmScore = async (filmId) => {
  alert("update films score SHOULDNT be");
  const res = await apiFetch(`/films/${filmId}/score`);
  const newScore = res?.score ?? null;
  console.log("newScore", newScore);
  // 🎯 Mets à jour le film dans selection.value
  const film = selection.value.films.find((f) => f.id === filmId);
  if (film && newScore !== null) {
    film.score = newScore;
  }
};

async function handleInterestChange({ filmId, oldValue, newValue }) {
  console.log("handleInterestChange:", filmId, oldValue, "→", newValue);

  // Update backend
  await updateInterest(filmId, newValue);

  // Met à jour les compteurs localement
  const current = interestStats.value[filmId] || {
    SANS_OPINION: 0,
    NOT_INTERESTED: 0,
    VERY_INTERESTED: 0,
    CURIOUS: 0,
    MUST_SEE: 0,
  };
  await updateFilmScore(filmId); // 🔁 met à jour localement le score

  interestStats.value[filmId] = {
    ...current,
    [oldValue]: Math.max((current[oldValue] || 1) - 1, 0),
    [newValue]: (current[newValue] || 0) + 1,
  };

  await updateFilmScore(filmId); // 🔁 met à jour localement le score
}
</script>

<style>
.print-only {
  display: none;
}
body {
  font-family: "Inter", sans-serif;
}

h1,
h2,
h3 {
  font-family: "Tiktok Sans", sans-serif;
  /* font-family: "Playfair Display", serif; */
}
@media print {
  /* Cache tout sans casser le flow */
  body * {
    visibility: hidden !important;
  }

  /* Ré-affiche uniquement la zone print */
  #print-area,
  #print-area * {
    visibility: visible !important;
  }

  /* Place la zone imprimée en haut */
  #print-area {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
  }

  /* Affiche le bloc print-only */
  .print-only {
    display: block !important;
  }

  /* (Optionnel) cache le reste dans print-area si tu veux strictement que le print-only */
  #print-area > :not(.print-only) {
    display: none !important;
  }

  @page {
    size: A4 portrait;
    margin: 1cm;
  }
}

.no-print {
  display: none !important;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
