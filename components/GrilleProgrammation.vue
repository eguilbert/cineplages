<template>
  <div class="p-4">
    <button
      @click="autoFillGrid"
      class="mb-4 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
    >
      Remplissage automatique
    </button>

    <div class="overflow-x-auto">
      <div class="min-w-max">
        <div class="grid" :style="gridStyle">
          <!-- Header Row (Heures) -->
          <div
            class="font-bold text-center bg-gray-100 border border-gray-300"
          ></div>
          <div
            v-for="hour in hours"
            :key="hour"
            class="font-bold text-center bg-gray-100 border border-gray-300"
          >
            {{ hour }}h
          </div>

          <!-- Rows per Salle/Day -->
          <template v-for="(room, r) in rooms" :key="r">
            <template v-for="(day, d) in days" :key="day">
              <div
                class="font-bold text-sm text-right pr-2 pt-1 col-span-1 bg-gray-50 border border-gray-300"
              >
                {{ room }}<br />{{ day }}
              </div>
              <div
                v-for="hour in hours"
                :key="hour + day + room"
                class="border border-gray-300 h-20 relative"
                :style="{
                  backgroundColor: suggestionColor(day, hour, room),
                }"
                @dragover.prevent
                @drop="onDrop($event, day, hour, room)"
              >
                <div
                  v-for="(film, index) in getFilmsAt(day, hour, room)"
                  :key="film.id + '-' + index"
                  class="absolute top-0 left-0 right-0 bottom-0 m-1 rounded shadow text-white text-xs text-center p-1 cursor-move"
                  :style="{
                    backgroundColor: genreColors[film.genre] || '#666',
                  }"
                  draggable="true"
                  @dragstart="onDragStart($event, film)"
                  @dblclick="removeFilm(day, hour, room, index)"
                  :title="`Double-cliquez pour retirer`"
                >
                  {{ film.title }}
                </div>
              </div>
              <!-- Répartition visuelle par catégorie -->
            </template>
          </template>
          <div class="mt-8">
            <h2 class="text-lg font-bold mb-2">Répartition par catégorie</h2>
            <!--             <PieChart :data="categoryDistribution" />
 -->
          </div>
        </div>
        <div class="col-span-full h-2 bg-black/10"></div>
      </div>
    </div>
  </div>

  <!-- Film Palette -->
  <div class="mt-8">
    <h2 class="text-lg font-bold mb-2">Films à programmer</h2>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="film in unplacedFilms"
        :key="film.id"
        class="p-2 rounded shadow text-white cursor-move text-sm"
        :style="{
          backgroundColor: genreColors[film.genre] || '#666',
        }"
        draggable="true"
        @dragstart="onDragStart($event, film)"
      >
        {{ film.title }} ({{ film.genre }}) — {{ film.remaining }} séance(s)
      </div>
    </div>
  </div>

  <!-- Synthèse des films placés -->
  <div class="mt-6">
    <h2 class="text-lg font-bold mb-2">Synthèse des programmations</h2>
    <ul>
      <li v-for="(count, title) in summary" :key="title">
        {{ title }} — {{ count }} séance(s) programmées
      </li>
    </ul>
  </div>

  <!-- Gestion des catégories de genres -->
  <div class="mt-6">
    <h3 class="text-md font-semibold mb-2">Catégories par genre</h3>
    <div class="space-y-2">
      <div
        v-for="(genre, index) in Object.keys(genreColors)"
        :key="index"
        class="flex gap-4 items-center"
      >
        <span class="w-24 font-medium">{{ genre }}</span>
        <select v-model="genreCategories[genre]" class="border rounded p-1">
          <option>Grand Public</option>
          <option>Jeunesse</option>
          <option>Documentaire</option>
          <option>Art et Essai</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Légende -->
  <div class="mt-6">
    <h3 class="text-md font-semibold mb-2">Code couleur des genres</h3>
    <ul class="flex flex-wrap gap-4">
      <li
        v-for="(color, genre) in genreColors"
        :key="genre"
        class="flex items-center gap-2"
      >
        <span
          class="w-4 h-4 rounded inline-block"
          :style="{ backgroundColor: color }"
        ></span>
        <span>{{ genre }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { PieChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { reactive, ref, computed } from "vue";

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const hours = [14, 16, 18, 20, 22];
const rooms = ["Salle 1", "Salle 2"];

const gridStyle = `grid-template-columns: repeat(${
  hours.length + 1
}, minmax(120px, 1fr));`;

import { onMounted } from "vue";

const films = reactive([]);

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:4000/api/films");
    const data = await res.json();
    data.forEach((film, i) => {
      films.push({ ...film, remaining: film.remaining ?? 3, id: i + 100 });
    });
  } catch (e) {
    console.error("Erreur de chargement des films :", e);
  }
});

const genreColors = {
  SF: "#4b5563",
  Drame: "#b91c1c",
  Animation: "#2563eb",
  Thriller: "#047857",
};

const suggestionColors = {
  SF: "#e5e7eb",
  Drame: "#fee2e2",
  Animation: "#dbeafe",
  Thriller: "#d1fae5",
};

const placements = reactive([]);

const genreCategories = reactive({
  SF: "Grand Public",
  Drame: "Art et Essai",
  Animation: "Jeunesse",
  Thriller: "Grand Public",
});
const draggedFilm = ref(null);

function onDragStart(event, film) {
  draggedFilm.value = film;
}

function onDrop(event, day, hour, room) {
  if (!draggedFilm.value || draggedFilm.value.remaining <= 0) return;
  placements.push({ ...draggedFilm.value, day, hour, room });
  draggedFilm.value.remaining--;
  draggedFilm.value = null;
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

function getFilmsAt(day, hour, room) {
  return placements.filter(
    (f) => f.day === day && f.hour === hour && f.room === room
  );
}

function suggestionColor(day, hour, room) {
  if (hour === 14) return suggestionColors["Animation"];
  if (hour === 22) return suggestionColors["Thriller"];
  if (hour === 20) return suggestionColors["SF"];
  if (hour === 18) return suggestionColors["Drame"];
  return "#ffffff";
}

const unplacedFilms = films;

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

function autoFillGrid() {
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

      const currentCategory = genreCategories[film.genre] || "Inconnu";
      const sameHourOtherRoom = placements.find(
        (p) =>
          p.day === slot.day &&
          p.hour === slot.hour &&
          p.room !== slot.room &&
          genreCategories[p.genre] === currentCategory
      );
      if (sameHourOtherRoom) continue;

      const genre = film.genre;
      const suggested = suggestionColor(slot.day, slot.hour, slot.room);
      const matches = suggested === suggestionColors[genre];

      if (matches) {
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
}

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

    // vérifier si une autre salle à la même heure a déjà ce type de film
    const sameHourOtherRoom = placements.find(
      (p) =>
        p.day === slot.day &&
        p.hour === slot.hour &&
        p.room !== slot.room &&
        genreCategories[p.genre] === genreCategories[film.genre]
    );
    if (sameHourOtherRoom) continue;

    const genre = film.genre;
    const suggested = suggestionColor(slot.day, slot.hour, slot.room);
    const matches = suggested === suggestionColors[genre];

    if (matches) {
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

for (const film of films.slice()) {
  let count = film.remaining;
  for (const slot of slots) {
    if (count <= 0) break;
    const genre = film.genre;
    const suggested = suggestionColor(slot.day, slot.hour, slot.room);
    const matches = suggested === suggestionColors[genre];
    if (matches) {
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
</script>

<style scoped>
.grid {
  display: grid;
  border-top: 2px solid #ccc;
  border-left: 2px solid #ccc;
}
</style>
