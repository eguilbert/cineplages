<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Présélections</h1>

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
      <!-- Compact FilmCard -->
      <div class="mb-1 flex items-center gap-2 mt-2">
        <Button
          :severity="view.mode === 'compact' ? 'primary' : 'secondary'"
          icon="pi pi-window-minimize"
          size="small"
          label=""
          @click="view.setMode('compact')"
        />
        <Button
          :severity="view.mode === 'full' ? 'primary' : 'secondary'"
          icon="pi pi-window-maximize"
          size="small"
          label=""
          @click="view.setMode('full')"
        />
        <!-- (Option) Raccourci clavier: M pour toggle -->
        <kbd class="ml-2 text-xs">M</kbd>
      </div>
    </div>

    <!-- Affichage de la sélection choisie -->
    <div v-if="selection" class="mb-6">
      <h2 class="text-xl font-light mb-2 mt-4">
        {{ selection.name }}
        <small> ({{ selection.films.length }} films)</small>
      </h2>
      <p class="text-sm text-gray-600">
        👥 {{ interestParticipantCount }} participant(s) au vote d'intérêt
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
        <Button
          label="Démarrer le vote"
          v-if="isAdmin"
          @click="startVote"
          size="small"
          class="mb-4"
        />
        <button
          @click="handlePrint"
          class="print-button justify-self-end ml-auto"
        >
          🖨️ Imprimer la sélection
        </button>
      </div>
      <!-- Compact FilmCard -->
      <div class="mb-3 flex items-center gap-2">
        <Button
          :severity="view.mode === 'compact' ? 'primary' : 'secondary'"
          icon="pi pi-window-minimize"
          size="small"
          label=""
          @click="view.setMode('compact')"
        />
        <Button
          :severity="view.mode === 'full' ? 'primary' : 'secondary'"
          icon="pi pi-window-maximize"
          size="small"
          label=""
          @click="view.setMode('full')"
        />
        <!-- (Option) Raccourci clavier: M pour toggle -->
        <kbd class="ml-2 text-xs">M</kbd>
      </div>
      <div id="print-area">
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
            :class="
              view.mode === 'compact'
                ? 'grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 xs:grid-cols-1 gap-3'
                : 'grid xl:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 gap-4'
            "
          >
            <!--           class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
 -->
            <FilmCard
              v-for="film in getFilteredFilms(categorie)"
              :key="film.id"
              :film="film"
              :role="user.role"
              :isAdmin="isAdmin"
              :username="user.username"
              :userId="user.id"
              :displayMode="layout"
              :initialInterestCounts="stats[film.id]"
              :interestCounts="interestStats?.[film.id] || null"
              :compact="view.mode === 'compact'"
              @score-changed="onScoreChanged"
              @interest-change="handleInterestChange"
              @update="handleFilmUpdate"
              @remove="handleFilmRemove"
              @toggle-selection="toggleFilmSelection"
              @vote-change="onVoteChange"
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
              :role="user.role"
              :isAdmin="isAdmin"
              :username="user.username"
              :userId="user.id"
              :displayMode="layout"
              :initialInterestCounts="stats[film.id]"
              :interestCounts="interestStats?.[film.id] || null"
              @score-changed="onScoreChanged"
              @interest-change="handleInterestChange"
              @update="handleFilmUpdate"
              @remove="handleFilmRemove"
              @toggle-selection="toggleFilmSelection"
              @vote-change="onVoteChange"
            />
          </div>
        </div>
      </div>
    </div>
    <transition name="slide-up">
      <div
        v-if="showInterestProgress"
        class="fixed left-0 w-full bg-white border-t border-gray-200 shadow z-40 px-4 py-2"
        :class="isAdmin ? 'bottom-16' : 'bottom-0'"
      >
        <div class="flex items-center justify-between text-sm">
          <span>📝 Films notés</span>
          <span>{{ ratedFilmsCount }} / {{ totalFilmsCount }}</span>
        </div>
        <div class="mt-1 h-1.5 w-full rounded bg-gray-100">
          <div
            class="h-1.5 rounded bg-blue-500 transition-all"
            :style="{ width: `${interestProgressPercent}%` }"
          ></div>
        </div>
      </div>
    </transition>
    <!-- Barre de sélection fixe en bas -->
    <transition name="slide-up" v-if="isAdmin">
      <div
        v-show="isBarVisible"
        class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow z-50 px-4 py-3"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-semibold">
              🎯 {{ selectedFilms.length }} film(s) sélectionné(s)
            </h2>
            <div class="flex flex-wrap gap-2 mt-1">
              <span
                v-for="(count, genre) in selectedGenreCounts"
                :key="genre"
                class="text-[11px] px-2 py-0.5 rounded bg-gray-100 border text-gray-700"
              >
                {{ genre }} : {{ count }}
              </span>
            </div>
          </div>
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
import { ref, onMounted, computed } from "vue";
import Button from "primevue/button";
import Select from "primevue/select";
import FilmCard from "~/components/FilmCard.vue";
import { watch } from "vue";
import { getCategoryColor } from "@/utils/genreColors";
import { useToast } from "primevue/usetoast";
import { useAuth } from "@/composables/useAuth";
import { useInterestStats } from "@/composables/useInterestStats";
import { useViewMode } from "@/stores/useViewMode";
const view = useViewMode();

onMounted(() => {
  // hydrate depuis localStorage côté client
  view.init();
});
const { user, isAuthenticated, isAdmin, getUser } = useAuth();
const visibleSelections = computed(() => {
  /* selection 18 est un test */
  return selections.value.filter((s) => s.status !== "programmation");
  /*   return selections.value.filter((s) => s.id !== 18 || isAdmin.value);
   */
});
const toast = useToast();
const config = useRuntimeConfig();
const selections = ref([]);
const selection = ref(null);
const selectedSelectionId = ref();
const selectedDate = ref(null);
const layout = ref("grid");
const categories = ["Art et Essai", "Documentaire", "Grand Public", "Jeunesse"];
const interestStats = ref({});
/* const { role, username, userId, fetchRole } = useUserRole(); */
const { fetchInterests } = useMyInterests();
const rawInterests = ref([]);
const interestMap = ref({}); // { [film_id]: "MUST_SEE" }
const sortByInterest = ref(false);
const selectedFilms = ref([]);
const { updateInterest } = useMyInterests();
const scoreFilm = ref(0);
const isBarVisible = ref(false);
const { stats, fetchStatsForFilms } = useInterestStats();
const { apiFetch } = useApi();
const interestParticipantCount = computed(() => {
  if (!selection.value) return 0;
  const filmIds = selection.value.films.map((film) => film.id);
  let maxTotal = 0;
  for (const filmId of filmIds) {
    const counts = interestStats.value?.[filmId];
    if (!counts) continue;
    const total = Object.values(counts).reduce(
      (sum, value) => sum + (Number(value) || 0),
      0
    );
    if (total > maxTotal) maxTotal = total;
  }
  return maxTotal;
});
const totalFilmsCount = computed(() => selection.value?.films.length ?? 0);
const ratedFilmsCount = computed(() => {
  if (!selection.value) return 0;
  return selection.value.films.reduce((count, film) => {
    return interestMap.value[film.id] ? count + 1 : count;
  }, 0);
});
const showInterestProgress = computed(
  () => selection.value && ratedFilmsCount.value > 0
);
const interestProgressPercent = computed(() => {
  if (!totalFilmsCount.value) return 0;
  return Math.min(
    100,
    Math.round((ratedFilmsCount.value / totalFilmsCount.value) * 100)
  );
});
const toggleFilmSelection = (film) => {
  const index = selectedFilms.value.findIndex((f) => f.id === film.id);
  if (index === -1) {
    selectedFilms.value.push(film);
  } else {
    selectedFilms.value.splice(index, 1);
  }
};

function onKey(e) {
  const tag = e.target.tagName.toLowerCase();
  const isTyping =
    tag === "input" || tag === "textarea" || e.target.isContentEditable;

  if (isTyping) return; // ⛔ on ignore si on tape dans un champ

  if (e.key.toLowerCase() === "m") {
    view.toggle(); // ton action compact/complet
  }
}

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));

const availableDates = computed(() => {
  if (!selection.value) return [{ label: "Toutes les dates", value: null }];

  // 1) On fabrique des clés YYYY-MM-DD uniques
  const keys = new Set(
    selection.value.films.map((f) => toDateKey(f.releaseDate)).filter(Boolean)
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
  selection.value = await apiFetch(`/selections/${selectedSelectionId.value}`);
  /* todo filtreer selections par !programmation */
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
      .map((item) => [item.film_id, item.value])
  );
  console.log("interestMap", interestMap.value);
};

function onScoreChanged({ filmId, score }) {
  console.log("onScoreChanged:", filmId, score);
  const f = selection.value?.films.find((x) => x.id === filmId);
  if (f) f.score = score;
  console.log("Film updated score:", f, score);
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

const getFilteredFilms = (category) => {
  if (!selection.value) return [];
  const targetKey = toDateKey(selectedDate.value);

  let filtered = selection.value.films.filter(
    (f) =>
      f.category === category &&
      (!targetKey || toDateKey(f.releaseDate) === targetKey)
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
      (a, b) => timeOf(a.releaseDate) - timeOf(b.releaseDate)
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
    (f) => f.id !== filmToRemove.id
  );
  //TODO delete film from selection
};

const scrollToCategory = (cat) => {
  const el = document.getElementById(`cat-${cat}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
const startVote = () => {
  isBarVisible.value = true;
};

const selectedGenreCounts = computed(() =>
  selectedFilms.value.reduce((acc, film) => {
    const genre = film.genre || film.category || "Inconnu";
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {})
);
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
    current[newValue]
  );
  console.log("Updated interest stats:", interestStats.value[filmId]);
}
const handlePrint = async () => {
  layout.value = "row";

  // attendre que le DOM se mette à jour
  await nextTick();

  // lancer l'impression après une légère pause
  setTimeout(() => {
    window.print();
  }, 100);
};

function computeScore(film) {
  const votes = Number(film?.rating) || 0; // nb de voix pour ce film (slider / select)
  console.log("computeScore for film", film.title, film.id, "votes:", votes);
  const counts = interestStats.value?.[film.id] || {};
  const interestScore = getInterestScore(counts);
  console.log(
    "computeScore for film, votes:",
    votes,
    "interest:",
    interestScore,
    "total:",
    votes * 2 + interestScore
  );
  return votes * 2 + interestScore;
}

const onVoteChange = async ({ filmId, vote }) => {
  const film = selection.value?.films.find((x) => x.id === filmId);
  if (!film) return;

  film.rating = Number(vote?.value) || 0; // ← le vote unique
  film.score = computeScore(film); // ← recalcul unifié

  if (sortByInterest.value) {
    selection.value.films.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }
};

async function handleInterestChange({ filmId, oldValue, newValue }) {
  console.log("handleInterestChange:", filmId, oldValue, "→", newValue);
  // 1) MAJ backend (RLS, etc.)
  await updateInterest(filmId, newValue);

  // 2) MAJ locale des compteurs d’intérêts
  const current = interestStats.value[filmId] || {
    SANS_OPINION: 0,
    NOT_INTERESTED: 0,
    VERY_INTERESTED: 0,
    CURIOUS: 0,
    MUST_SEE: 0,
  };
  if (oldValue !== newValue) {
    interestStats.value[filmId] = {
      ...current,
      [oldValue]: Math.max((current[oldValue] || 1) - 1, 0),
      [newValue]: (current[newValue] || 0) + 1,
    };
  }
  if (newValue === "SANS_OPINION") {
    const { [filmId]: _removed, ...rest } = interestMap.value;
    interestMap.value = rest;
  } else {
    interestMap.value = { ...interestMap.value, [filmId]: newValue };
  }
  console.log("Updated interest stats:", interestStats.value[filmId]);
  // 3) Recalcul du score unifié
  const film = selection.value?.films.find((x) => x.id === filmId);
  if (film) {
    film.score = computeScore(film);
    if (sortByInterest.value) {
      selection.value.films.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    }
  }
}

const submitSelection = async () => {
  if (!selectedSelectionId.value || selectedFilms.value.length === 0) {
    alert("Aucune sélection à approuver.");
    return;
  }
  if (!confirm("Approuver cette sélection comme programmation ?")) return;

  try {
    const filmsPayload = selectedFilms.value.map((f) => ({
      id: f.id,
      localScore: Number(f.score) || 0, // ← optionnel (traçabilité)
    }));

    await apiFetch(`/selections/${selectedSelectionId.value}/approve`, {
      method: "POST",
      body: {
        films: filmsPayload,
      },
    });

    alert("Sélection approuvée !");
    await loadSelection(); // rechargera les scores stockés en pivot
    selectedFilms.value = [];
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'approbation.");
  }
};
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
  .screen-only {
    display: none !important;
  }
  .print-only {
    display: block !important;
  }
  body {
    background: white;
    color: black;
    font-family: Georgia, serif;
    padding: 1cm;
  }
  body * {
    visibility: hidden;
  }

  #print-area,
  #print-area * {
    visibility: visible;
  }

  #print-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .film-card.printable {
    width: 100%;
    border: 1px solid #000;
    padding: 1rem;
    margin-bottom: 1cm;
    page-break-inside: avoid;
  }

  .film-card.printable h2 {
    font-size: 1.5em;
    margin-bottom: 0.5em;
  }

  .film-card.printable .synopsis {
    font-style: italic;
  }

  /* Si tu veux une mise en page en deux colonnes */
  @page {
    size: A4 portrait;
    margin: 1cm;
  }

  #print-area {
    column-count: 2;
    column-gap: 2cm;
    display: flex;
    flex-wrap: wrap;
    gap: 1cm;
  }

  .print-button,
  .navigation-bar,
  .filters,
  .menu-flottant {
    display: none !important;
  }

  .film-card {
    page-break-inside: avoid;
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
