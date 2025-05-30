<template>
  <div class="p-4">
    <h2 class="text-xl mb-4">Importer une sélection existante</h2>
    <Button
      label="Importer dans la grille"
      icon="pi pi-upload"
      :disabled="!selectedId"
      @click="importerSelection"
    />
    <Dropdown
      v-model="selectedId"
      :options="selections"
      optionLabel="name"
      optionValue="id"
      placeholder="Choisir une sélection"
      class="w-full mb-4"
    />
    <!--  <button
      @click="autoFillGrid"
      class="mb-4 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
    >
      Remplissage automatique
    </button>
    <button
      @click="importToGrille"
      class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Importer les films OMDb dans la grille
    </button>
 -->
    <FilmGrid
      :days="days"
      :hours="hours"
      :rooms="rooms"
      :genreColors="genreColorMap"
      :suggestionColor="suggestionColor"
      :getFilmsAt="getFilmsAt"
      :onDrop="onDrop"
      :onDragStart="onDragStart"
      :removeFilm="removeFilm"
      :gridStyle="gridStyle"
    />

    <!--  <FilmForm />

   <FilmPalette
      :films="unplacedFilms"
      :genreColors="genreColors"
      :onDragStart="onDragStart"
    />

    <FilmSummary :summary="summary" /> -->

    <GenreCategories
      :genreColors="genreColorMap"
      :genreCategories="genreCategories"
    />

    <!--     <CategoryPieChart :data="categoryDistribution" />
 -->
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useGrilleStore } from "@/stores/grille";

import FilmGrid from "@/components/FilmGrid.vue";
import FilmForm from "@/components/FilmForm.vue";
import FilmPalette from "@/components/FilmPalette.vue";
import FilmSummary from "@/components/FilmSummary.vue";
import GenreCategories from "@/components/GenreCategories.vue";
import CategoryPieChart from "@/components/CategoryPieChart.vue";
import { useFilms } from "@/composables/useFilms";
import { getGenreColor, genreList } from "@/utils/genreColors";
const config = useRuntimeConfig();

const days = ["Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const hours = ["14:00", "17:00", "20:00"];
const rooms = ["Salle 1", "Salle 2"];

const grilleStore = useGrilleStore();
const selections = ref([]);
const selectedId = ref(null);

const gridStyle = `grid-template-columns: repeat(${
  hours.length + 1
}, minmax(120px, 1fr));`;

/* const { films } = useFilms();
 */ const placements = reactive([]);
const genreCategories = reactive({
  SF: "Grand Public",
  Drame: "Art et Essai",
  Animation: "Jeunesse",
  Thriller: "Grand Public",
});

const genreColors = getGenreColor();

onMounted(async () => {
  const res = await $fetch(`${config.public.apiBase}/selections`);
  selections.value = res;
});

async function importerSelection() {
  if (!selectedId.value) return;
  const selection = await $fetch(
    `${config.public.apiBase}/selections/${selectedId.value}`
  );
  console.log("selection", selection);
  console.log("films", selection[0]["films"]);
  grilleStore.loadFromSelection(selection[0]["films"]);
  console.log("Films chargés :", selection[0]["films"]);
  console.log("Programmation générée :", grilleStore.programmation);
}

function suggestionColor(day, hour, room) {
  if (hour === 14) return "#dbeafe";
  if (hour === 22) return "#d1fae5";
  if (hour === 20) return "#e5e7eb";
  if (hour === 18) return "#fee2e2";
  return "#ffffff";
}

function onDragStart(event, film) {
  event.dataTransfer.setData("filmId", film.id);
}

function onDrop(event, day, hour, room) {
  const filmId = parseInt(event.dataTransfer.getData("filmId"));
  const film = films.find((f) => f.id === filmId);
  if (!film || film.remaining <= 0) return;
  const currentCategory = genreCategories[film.genre] || "Inconnu";
  const conflict = placements.find(
    (p) =>
      p.day === day &&
      p.hour === hour &&
      p.room !== room &&
      genreCategories[p.genre] === currentCategory
  );
  if (conflict) return;
  placements.push({ ...film, day, hour, room });
  film.remaining--;
}

function removeFilm(day, hour, room, index) {
  const found = placements.findIndex(
    (f, i) =>
      i ===
      placements.findIndex(
        (x, j) =>
          j === index && x.day === day && x.hour === hour && x.room === room
      )
  );
  if (found !== -1) {
    const film = placements[found];
    placements.splice(found, 1);
    const inPalette = films.find((f) => f.id === film.id);
    if (inPalette) inPalette.remaining++;
    else
      films.push({
        id: film.id,
        title: film.title,
        genre: film.genre,
        remaining: 1,
      });
  }
}

function getFilmsAt(jour, heure, salle) {
  console.log("Cherche :", jour, heure, salle);
  console.log(
    "Dans programmation :",
    grilleStore.programmation.map((f) => [f.title, f.jour, f.heure, f.salle])
  );

  const matches = grilleStore.programmation.filter(
    (f) => f.jour === jour && f.heure === heure && f.salle === salle
  );
  console.log(
    `[${jour} ${heure} ${salle}] =>`,
    matches.map((f) => f.title)
  );
  return matches;
}

/* function autoFillGrid() {
  const slots = [];
  for (const room of rooms) {
    for (const day of days) {
      for (const hour of hours) {
        if (!getFilmsAt(day, hour, room).length) {
          slots.push({ day, hour, room });
        }
      }
    }
  }
  for (const film of films.slice()) {
    let count = film.remaining;
    for (const slot of slots.slice()) {
      if (count <= 0) break;
      const genre = film.genre;
      const suggested = suggestionColor(slot.day, slot.hour, slot.room);
      const matches =
        suggested === suggestionColor(slot.day, slot.hour, slot.room);
      const cat = genreCategories[film.genre] || "Autre";
      const conflict = placements.find(
        (p) =>
          p.day === slot.day &&
          p.hour === slot.hour &&
          p.room !== slot.room &&
          genreCategories[p.genre] === cat
      );
      if (matches && !conflict) {
        placements.push({
          ...film,
          day: slot.day,
          hour: slot.hour,
          room: slot.room,
        });
        film.remaining--;
        count--;
        slots.splice(slots.indexOf(slot), 1);
      }
    }
  }
} */

const summary = computed(() => {
  const map = {};
  placements.forEach((f) => {
    map[f.title] = (map[f.title] || 0) + 1;
  });
  return map;
});

const categoryDistribution = computed(() => {
  const categoryCounts = {};
  placements.forEach((film) => {
    const cat = genreCategories[film.genre] || "Autre";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  return {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#4ade80",
          "#60a5fa",
          "#facc15",
          "#fb923c",
          "#e879f9",
        ],
      },
    ],
  };
});

const unplacedFilms = computed(() => films.filter((f) => f.remaining > 0));

/* const importToGrille = async () => {
  const res = await fetch("http://localhost:4000/api/import/premiere");
  const imported = await res.json();

  for (const film of imported) {
    await fetch("http://localhost:3000/api/films", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...film,
        remaining: 3, // par défaut 3 séances disponibles
      }),
    });
  }

  // recharge les films visibles
  const r = await fetch("http://localhost:4000/api/films");
  films.value = await r.json();

  alert("Importation réussie ! Les films ont été ajoutés.");
}; */
</script>
