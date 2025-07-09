<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Sélections</h1>

    <!-- Sélecteur de sélection -->
    <Dropdown
      v-model="selectedSelectionId"
      :options="selections"
      optionLabel="name"
      optionValue="id"
      placeholder="Choisir une sélection"
      class="mb-4 w-full md:w-1/3"
      @change="loadSelection"
    />

    <!-- Menu flottant catégories -->
    <div
      class="fixed top-100 -left-2 bg-white shadow p-2 rounded z-10"
      v-if="selectedSelectionId"
    >
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
      <h2 class="text-xl font-light mb-2">
        {{ selection.name }}
        <small> ({{ selection.films.length }} films)</small>
      </h2>
      <!-- Changer affichage -->
      <div class="mb-4" v-if="selectedSelectionId">
        <Button
          icon="pi pi-th-large"
          text
          @click="layout = 'grid'"
          v-if="layout === 'row'"
        />
        <Button icon="pi pi-bars" text @click="layout = 'row'" v-else />
        <!-- Filtre par date -->
        <Dropdown
          v-if="selectedSelectionId"
          v-model="selectedDate"
          :options="availableDates"
          optionLabel="label"
          optionValue="value"
          placeholder="Filtrer par date de sortie"
          class="mb-4 w-full md:w-1/3"
        />
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
            :key="film.tmdbId"
            :film="film"
            :layout="layout"
            @update="handleFilmUpdate"
            @remove="handleFilmRemove"
          />
        </div>

        <div v-else class="flex flex-col gap-4">
          <FilmCard
            v-for="film in getFilteredFilms(categorie)"
            :key="film.tmdbId"
            :film="film"
            :layout="layout"
            @update="handleFilmUpdate"
            @remove="handleFilmRemove"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import FilmCard from "~/components/FilmCard.vue";
import { watch } from "vue";
import { getCategoryColor } from "@/utils/genreColors";

const config = useRuntimeConfig();
const selections = ref([]);
const selection = ref(null);
const selectedSelectionId = ref(null);
const selectedDate = ref(null);
const layout = ref("grid");
const categories = ["Art et Essai", "Documentaire", "Grand Public", "Jeunesse"];

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
  const res = await fetch(`${config.public.apiBase}/selections`);
  selections.value = await res.json();
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
};

const getFilteredFilms = (category) => {
  if (!selection.value) return [];
  return selection.value.films
    .filter((f) => f.category === category)
    .filter((f) => !selectedDate.value || f.releaseDate === selectedDate.value)
    .sort(
      (a, b) =>
        new Date(a.releaseDate || "1900-01-01") -
        new Date(b.releaseDate || "1900-01-01")
    );
};

const handleFilmUpdate = async (updatedFilm) => {
  try {
    await fetch(`${config.public.apiBase}/films/${updatedFilm.id}/tags`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commentaire: updatedFilm.commentaire,
        rating: updatedFilm.rating,
        tags: updatedFilm.tags,
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
};
const scrollToCategory = (cat) => {
  const el = document.getElementById(`cat-${cat}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
</script>

<style scoped></style>

<!-- <template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Mes Sélections</h1>

    <div v-if="selections.length === 0" class="text-gray-500 italic">
      Aucune sélection enregistrée.
    </div>
    <Button
      icon="pi pi-th-large"
      text
      @click="layout = 'grid'"
      v-if="layout === 'row'"
    />
    <Button icon="pi pi-bars" text @click="layout = 'row'" v-else />
    <div
      v-for="selection in selections"
      :key="selection.id"
      class="mb-4 border rounded"
    >
      <div
        @click="toggleSelection(selection.id)"
        class="cursor-pointer bg-gray-100 p-2 font-semibold flex justify-between"
      >
        {{ selection.name }} ({{ selection.films.length }} films)
        <Button
          icon="pi pi-trash"
          label="Effacer"
          severity="warn"
          text
          @click="deleteSelection(selection.id)"
        />
        <span>{{ openSelections.has(selection.id) ? "▲" : "▼" }}</span>
      </div>
      <div
        v-if="openSelections.has(selection.id)"
        class="flex justify-between items-center mb-2 flex-col"
      >
        <div
          v-for="categorie in categories"
          :key="categorie"
          class="mb-6 flex flex-col"
        >
          <h3 class="text-lg font-semibold mb-2 pb-1 p-1">
            {{ categorie }}
          </h3>
          <div
            class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            v-if="layout === 'grid'"
          >
            <FilmCard
              v-for="film in getFilteredFilms(selection).filter(
                (f) => f.category === categorie
              )"
              :key="film.tmdbId || index"
              :film="film"
              :layout="layout"
              @update="handleFilmUpdate"
              @remove="handleFilmRemove"
            />
          </div>

          <div class="flex flex-col gap-4" v-else>
            <FilmCard
              v-for="film in getFilteredFilms(selection).filter(
                (f) => f.category === categorie
              )"
              :key="film.tmdbId || index"
              :film="film"
              :layout="layout"
              @update="handleFilmUpdate"
              @remove="handleFilmRemove"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Button from "primevue/button";

const selections = ref([]);
const config = useRuntimeConfig();
const selection = ref({
  films: [],
});
const categories = ["Art et Essai", "Documentaire", "Grand Public", "Jeunesse"];
const layout = ref("grid");

onMounted(async () => {
  const res = await fetch(`${config.public.apiBase}/selections`);
  selections.value = await res.json();
});

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const openSelections = ref(new Set());

function toggleSelection(id) {
  if (openSelections.value.has(id)) {
    openSelections.value.delete(id);
  } else {
    openSelections.value.add(id);
  }
}

function getFilteredFilms(sel) {
  console.log(sel.films[0]);
  const filtre = "";

  const filmByDate = sel.films;
  filmByDate.sort((a, b) => {
    const dateA = new Date(a.releaseDate || "1900-01-01");
    const dateB = new Date(b.releaseDate || "1900-01-01");
    return dateA - dateB;
  });
  return filmByDate;
}
const deleteSelection = async (id) => {
  if (!confirm("Supprimer cette sélection ?")) return;
  await fetch(`${config.public.apiBase}/selections/${id}`, {
    method: "DELETE",
  });
  selections.value = selections.value.filter((sel) => sel.id !== id);
};

const badgeClass = (category) => {
  const map = {
    "Art et Essai": "bg-purple-100 text-purple-800",
    Documentaire: "bg-green-100 text-green-800",
    Jeunesse: "bg-yellow-100 text-yellow-800",
    "Grand Public": "bg-blue-100 text-blue-800",
    "": "bg-gray-100 text-gray-800",
  };
  return map[category] || "bg-gray-100 text-gray-800";
};

const handleFilmUpdate = async (updatedFilm) => {
  console.log(updatedFilm);
  try {
    await fetch(`${config.public.apiBase}/films/${updatedFilm.id}/tags`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commentaire: updatedFilm.commentaire,
        rating: updatedFilm.rating,
        tags: updatedFilm.tags,
      }),
    });
    console.log("✅ Film mis à jour:", updatedFilm.title);
  } catch (error) {
    console.error("❌ Erreur mise à jour film", error);
  }
};

const handleFilmRemove = (filmToRemove) => {
  const selectionIndex = selections.value.findIndex((sel) =>
    sel.films.some((f) => f.film.id === filmToRemove.id)
  );

  if (selectionIndex !== -1) {
    const selection = selections.value[selectionIndex];
    selection.films = selection.films.filter(
      (f) => f.film.id !== filmToRemove.id
    );
  }
};
</script> -->
