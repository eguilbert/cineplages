<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Sélections</h1>

    <FilmSearchAdd
      :selection-id="selectedSelectionId"
      v-if="role === 'ADMIN'"
    />

    <!-- Sélecteur de sélection -->
    <Select
      v-model="selectedSelectionId"
      :options="selections"
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
          v-if="role === 'ADMIN'"
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
            class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <FilmCard
              v-for="film in getFilteredFilms(categorie)"
              :key="film.id"
              :film="film"
              :role="role"
              :username="username"
              :userId="userId"
              :displayMode="layout"
              :interestCounts="interestStats?.[film.id] || null"
              :initialInterest="interestMap[film.id] || null"
              :voteOpen="voteMode"
              @interest-change="handleInterestChange"
              @update="handleFilmUpdate"
              @remove="handleFilmRemove"
              @toggle-selection="toggleFilmSelection"
              class="col-12 md:col-2 lg:col-3"
            />
          </div>

          <div v-else class="flex flex-col gap-4">
            <FilmCard
              v-for="film in getFilteredFilms(categorie)"
              :key="film.id"
              :film="film"
              :role="role"
              :username="username"
              :userId="userId"
              :displayMode="layout"
              :interestCounts="interestStats?.[film.id] || null"
              :initialInterest="interestMap[film.id] || null"
              :voteOpen="voteMode"
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
    <transition name="slide-up" v-if="role === 'ADMIN'">
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
      v-if="role === 'ADMIN'"
    >
      🎯 {{ selectedFilms.length }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["authenticated"],
});
import { ref, onMounted, computed } from "vue";
import Button from "primevue/button";
import Select from "primevue/select";
import FilmCard from "~/components/FilmCard.vue";
import { watch } from "vue";
import { getCategoryColor } from "@/utils/genreColors";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const config = useRuntimeConfig();
const selections = ref([]);
const selection = ref(null);
const selectedSelectionId = ref(15);
const selectedDate = ref(null);
const layout = ref("grid");
const categories = ["Art et Essai", "Documentaire", "Grand Public", "Jeunesse"];
const interestStats = ref({});
const { role, username, userId, fetchRole } = useUserRole();
const { fetchInterests } = useMyInterests();
const rawInterests = ref([]);
const interestMap = ref({}); // { [film_id]: "MUST_SEE" }
const sortByInterest = ref(false);
const voteMode = ref(false);
const selectedFilms = ref([]);
const { updateInterest } = useMyInterests();
const scoreFilm = ref(0);
const isBarVisible = ref(false);

const toggleFilmSelection = (film) => {
  const index = selectedFilms.value.findIndex((f) => f.id === film.id);
  if (index === -1) {
    selectedFilms.value.push(film);
  } else {
    selectedFilms.value.splice(index, 1);
  }
};
function openVote() {
  isBarVisible.value = true;
  voteMode.value = true;

  // Facultatif : calcul dynamique du rating moyen
  /*   selectedSelection.value.films.forEach((film) => {
    const votes = film.votes || [];
    if (votes.length > 0) {
      film.rating = votes.reduce((acc, v) => acc + v.note, 0) / votes.length;
    }
  });
 */
}

const availableDates = computed(() => {
  if (!selection.value) return [];

  const dates = [
    ...new Set(selection.value.films.map((f) => f.releaseDate).filter(Boolean)),
  ];

  const sortedDates = dates
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      label: new Date(date).toLocaleDateString("fr-FR"),
      value: date,
    }));

  // Ajoute l'option "Toutes les dates"
  return [{ label: "Toutes les dates", value: null }, ...sortedDates];
});

onMounted(async () => {
  await fetchRole();
  console.log("Rôle utilisateur :", role.value, username.value, userId.value);
  const res = await fetch(`${config.public.apiBase}/selections`);
  selections.value = await res.json();
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
  const res = await fetch(
    `${config.public.apiBase}/selections/${selectedSelectionId.value}`
  );
  selection.value = await res.json();
  selection.value.films = selection.value.films.map((film) => ({
    ...film,
    layout: undefined, // ou ne pas l'inclure
  }));
  const filmIds = selection.value.films.map((film) => film.id);
  const idsParam = filmIds.join(",");

  const data = await $fetch(`${config.public.apiBase}/interests/films`, {
    method: "POST",
    body: {
      ids: filmIds, // liste d’IDs internes
    },
  });
  interestStats.value = data || {};
  console.log("Intérêts films", interestStats.value);

  //Get MY interests
  const myInterests = await fetchInterests();
  rawInterests.value = data;

  // Transformer la liste en map par film_id (si != "SANS_OPINION")
  interestMap.value = Object.fromEntries(
    myInterests
      .filter((item) => item.value !== "SANS_OPINION")
      .map((item) => [item.film_id, item.value])
  );
  if (selectedSelectionId.value == 11) {
    voteMode.value = true;
  } else {
    voteMode.value = false;
  }
};

const INTEREST_WEIGHTS = {
  MUST_SEE: 2,
  CURIOUS: 1,
  SANS_OPINION: 0,
  NOT_INTERESTED: 0,
};

/* const getFilteredFilms = (category) => {
  if (!selection.value) return [];
  return selection.value.films
    .filter((f) => f.category === category)
    .filter((f) => !selectedDate.value || f.releaseDate === selectedDate.value)
    .sort(
      (a, b) =>
        new Date(a.releaseDate || "1900-01-01") -
        new Date(b.releaseDate || "1900-01-01")
    );
}; */
function getInterestScore(counts = {}) {
  return (
    (counts.MUST_SEE || 0) * 2 +
    (counts.CURIOUS || 0) * 1 +
    (counts.NOT_INTERESTED || 0) * -1 +
    (counts.SANS_OPINION || 0) * 0
  );
}
const getFilteredFilms = (category) => {
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
    // ✅ Tri par score d'intérêt
    /*  filtered = filtered.sort((a, b) => {
      const aScore = getInterestScore(interestStats.value[a.id] || {});
      const bScore = getInterestScore(interestStats.value[b.id] || {});
      return bScore - aScore; // tri décroissant
    }); */
    //ou par score computed
    filtered = filtered.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    //filtered = filtered.sort((a, b) => computeScore(b) - computeScore(a));
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
};

const handleFilmUpdate = async (updatedFilm) => {
  alert(JSON.stringify(updatedFilm, null, 2));
  console.log("Mise à jour film", updatedFilm, updatedFilm.externalLinks);
  try {
    await fetch(`${config.public.apiBase}/films/${updatedFilm.id}/details`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commentaire: updatedFilm.commentaire,
        rating: updatedFilm.rating,
        tags: updatedFilm.tags,
        awards: updatedFilm.awards,
        externalLinks: updatedFilm.externalLinks,
      }),
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
  console.log("computeScore for film", film.title, film.id);
  const votes = film.rating || 0; // ou autre metric
  const interestScore = getInterestScore(interestStats.value[film.id] || {});
  console.log("computeScore for film", votes * 2 + interestScore);
  return votes * 2 + interestScore;
}
const updateFilmScore = async (filmId) => {
  const res = await $fetch(`${config.public.apiBase}/films/${filmId}/score`);
  const newScore = res?.score ?? null;
  console.log("newScore", newScore);
  // 🎯 Mets à jour le film dans selection.value
  const film = selection.value.films.find((f) => f.id === filmId);
  if (film && newScore !== null) {
    film.score = newScore;
  }
};
/* const onInterestChange = async ({ filmId, formerInterest, newValue }) => {
  await $fetch(`${config.public.apiBase}/interests`, {
    method: "POST",
    body: { film_id: filmId, value: newValue },
  });
  await updateFilmScore(filmId); // 🔁 met à jour localement le score
}; */

const onVoteChange = async ({ filmId, note }) => {
  await $fetch(`${config.public.apiBase}/votes`, {
    method: "POST",
    body: { filmId, note },
  });
  await updateFilmScore(filmId); // 🔁 met à jour localement le score
};

async function handleInterestChange({ filmId, oldValue, newValue }) {
  console.log("handleInterestChange:", filmId, oldValue, "→", newValue);

  // Update backend
  await updateInterest(filmId, newValue);

  // Met à jour les compteurs localement
  const current = interestStats.value[filmId] || {
    SANS_OPINION: 0,
    NOT_INTERESTED: 0,
    CURIOUS: 0,
    MUST_SEE: 0,
  };
  await updateFilmScore(filmId); // 🔁 met à jour localement le score

  interestStats.value[filmId] = {
    ...current,
    [oldValue]: Math.max((current[oldValue] || 1) - 1, 0),
    [newValue]: (current[newValue] || 0) + 1,
  };
  /*   await $fetch(`${config.public.apiBase}/interests`, {
    method: "POST",
    body: { film_id: filmId, value: newValue },
  }); */
  await updateFilmScore(filmId); // 🔁 met à jour localement le score
}

const submitSelection = async () => {
  if (!selectedSelectionId.value || selectedFilms.value.length === 0) {
    alert("Aucune sélection à approuver.");
    return;
  }

  const confirmed = confirm("Approuver cette sélection comme programmation ?");
  if (!confirmed) return;

  try {
    const res = await fetch(
      `${config.public.apiBase}/selections/${selectedSelectionId.value}/approve`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filmIds: selectedFilms.value.map((f) => f.id),
        }),
      }
    );

    if (!res.ok) throw new Error("Échec de l'approbation");

    alert("Sélection approuvée !");
    await loadSelection(); // recharge la sélection depuis l'API
    selectedFilms.value = []; // reset
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
