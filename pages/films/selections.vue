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
      class="fixed top-100 -left-2 bg-white shadow p-2 rounded z-10 shadow-lg"
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
      <p v-if="selection.id == 11" class="text-sm mb-4">
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
        <Dropdown
          v-if="selectedSelectionId"
          v-model="selectedDate"
          :options="availableDates"
          optionLabel="label"
          optionValue="value"
          placeholder="Filtrer par date de sortie"
          class="w-full md:w-1/3 small"
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
              :key="film.tmdbId"
              :film="film"
              :displayMode="layout"
              @update="handleFilmUpdate"
              @remove="handleFilmRemove"
            />
          </div>

          <div v-else class="flex flex-col gap-4">
            <FilmCard
              v-for="film in getFilteredFilms(categorie)"
              :key="film.tmdbId"
              :film="film"
              :displayMode="layout"
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
  selection.value.films = selection.value.films.map((film) => ({
    ...film,
    layout: undefined, // ou ne pas l'inclure
  }));
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
};
const scrollToCategory = (cat) => {
  const el = document.getElementById(`cat-${cat}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
const handlePrint = async () => {
  layout.value = "row";

  // attendre que le DOM se mette à jour
  await nextTick();

  // lancer l'impression après une légère pause
  setTimeout(() => {
    window.print();
  }, 100);
};
</script>

<style>
.print-only {
  display: none;
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
</style>

<!-- Pour impression

4. Style @media print personnalisé dans le <style> de la page

@media print {
  body {
    background: white;
    color: black;
    font-family: Georgia, serif;
    padding: 1cm;
  }

  .no-print {
    display: none !important;
  }

  #print-area {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1cm;
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
  }

  .film-card.printable {
    break-inside: avoid-column;
  }
}
🔄 Astuce : Version alternative des FilmCard uniquement à l'impression
Si tes FilmCard sont très graphiques à l’écran mais tu veux une version texte pour l'impression, fais ceci :

vue
Copy
Edit
<div class="film-card screen-only">…</div>
<div class="film-card printable print-only">…</div>
Et dans le CSS :

css
Copy
Edit
.print-only { display: none; }
@media print {
  .screen-only { display: none !important; }
  .print-only { display: block !important; }
}
-->
