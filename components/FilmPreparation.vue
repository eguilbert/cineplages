<template>
  <div class="p-4 bg-white rounded shadow">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Préparer la sélection</h2>
      <div class="flex gap-2">
        <span
          class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800"
          title="Étape 2 sur 3 : Préparation"
        >
          Étape 2/3 : Préparation
        </span>
      </div>
    </div>
    <div v-if="preparedFilms">
      Nombre de films trouvés: {{ preparedFilms.length }}
    </div>
    <div class="mb-4 flex gap-2 items-center">
      <Button
        label="Définir catégorie automatiquement"
        icon="pi pi-tags"
        @click="autoCategorize"
      />
      <Button
        label="Tout sélectionner"
        icon="pi pi-times"
        severity="secondary"
        @click="selectAll"
      />
      <Button
        label="Tout désélectionner"
        icon="pi pi-times"
        severity="secondary"
        @click="clearSelection"
      />
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto"
    >
      <div
        v-for="film in preparedFilms"
        :key="film.id"
        class="border p-3 rounded relative"
        :class="{ 'bg-red-50': film.include }"
        :style="{ borderColor: getCategoryColor(film.category) }"
      >
        <div class="flex justify-between">
          <img
            :src="film.posterUrl"
            alt=""
            width="80"
            style="margin-right: 10px"
          />
          <div>
            <strong
              ><a
                :href="`https://www.themoviedb.org/movie/${film.tmdbId}`"
                target="_blank"
                class="text-blue-600 hover:underline"
              >
                {{ film.title }} ({{ film.origin }})</a
              ></strong
            >
            - <small> Réal : </small>{{ film.directorName }}
            <small> ({{ film.origin }}) </small>
          </div>
          <Checkbox v-model="film.include" :binary="true" class="mt-1" />
        </div>
        <small class="block text-gray-500"
          >{{ film.duration }} min. — {{ film.genre }} <br />
          Avec: {{ film.actors }}
        </small>
        <div v-if="film.synopsis">
          <small
            class="line-clamp-2"
            style="border: 1px solid lightblue; padding: 4px; margin: 8px"
          >
            {{ film.synopsis }}
          </small>
        </div>

        <div class="mt-2">
          <label class="text-sm text-gray-700">Catégorie :</label>
          <Dropdown
            v-model="film.category"
            :options="categoryOptions"
            placeholder="Choisir..."
            class="w-full mt-1"
            @change="() => updateCategory(film)"
          />
        </div>
      </div>
    </div>

    <Button
      class="mt-4"
      label="Valider et passer à la sauvegarde"
      icon="pi pi-check"
      @click="
        $emit(
          'validate',
          preparedFilms.filter((f) => f.include)
        )
      "
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import { getCategoryColor } from "@/utils/genreColors";
const config = useRuntimeConfig();
const { apiFetch } = useApi();

const props = defineProps({
  films: Array,
});

const categoryOptions = [
  "Art et Essai",
  "Documentaire",
  "Jeunesse",
  "Grand Public",
];

const preparedFilms = ref([]);

const updateCategory = async (film) => {
  // alert("change category", film.id);
  try {
    await apiFetch(`/films/${film.id}/category`, {
      method: "PUT",
      body: { category: film.category },
    });
  } catch (e) {
    console.error("Erreur de mise à jour de la catégorie", e);
  }
};

watch(
  () => props.films,
  (newFilms) => {
    if (Array.isArray(newFilms)) {
      preparedFilms.value = newFilms.map((f) => ({
        ...f,
        category: f.category || "",
        include: false,
      }));
    } else {
      preparedFilms.value = [];
    }
  },
  { immediate: true }
);

const clearSelection = () => {
  preparedFilms.value.forEach((f) => (f.include = false));
};

const selectAll = () => {
  preparedFilms.value.forEach((f) => (f.include = true));
};

const autoCategorize = () => {
  for (const film of preparedFilms.value) {
    const genre = (film.genre || "").toLowerCase();
    if (genre.includes("animation") || genre.includes("famille"))
      film.category = "Jeunesse";
    else if (genre.includes("documentaire")) film.category = "Documentaire";
    else if (genre.includes("drame") || genre.includes("festival"))
      film.category = "Art et Essai";
    else film.category = "Grand Public";
  }
};
</script>
