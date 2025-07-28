<template>
  <div class="p-6 space-y-4">
    <input
      v-model="query"
      placeholder="Rechercher par titre ou réalisateur"
      class="border p-2 w-full"
    />

    <div
      v-for="film in films"
      :key="film.id"
      class="border p-4 rounded space-y-2"
    >
      <div class="flex justify-between items-center">
        <div>
          <h2 class="font-bold">{{ film.title }}</h2>
          <p class="text-sm text-gray-500">
            Réalisé par : {{ film.director?.name }}
          </p>
        </div>
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

      <!-- <textarea
        v-model="film.commentaire"
        class="w-full border p-2"
        placeholder="Commentaire"
      /> -->

      <TagEditor :film-id="film.id" :initial-tags="film.tags || []" />
      <AwardEditor v-model="film.awards" />
      <ExternalLinksEditor v-model="film.externalLinks" />

      <button
        @click="saveFilm(film)"
        class="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        💾 Sauvegarder
      </button>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  middleware: ["authenticated"],
});
import { ref } from "vue";
import TagEditor from "~/components/TagEditor.vue";
import AwardEditor from "@/components/AwardEditor.vue";
import ExternalLinksEditor from "@/components/ExternalLinksEditor.vue";
const films = ref([]);
const query = ref("");
const config = useRuntimeConfig();

const categoryOptions = [
  "Art et Essai",
  "Documentaire",
  "Jeunesse",
  "Grand Public",
];
const fetchFilms = async () => {
  films.value = await $fetch(`${config.public.apiBase}/films`, {
    params: { query: query.value },
  });
};
watch(query, async (val) => {
  if (val.length >= 2 || val.length === 0) {
    await fetchFilms();
  }
});
const saveFilm = async (film) => {
  const filmId = film.id;
  console.log(film, filmId);
  await $fetch(`${config.public.apiBase}/films/${filmId}/meta`, {
    method: "PUT",
    body: {
      awards: film.awards,
      externalLinks: film.externalLinks,
      category: film.category,
    },
  });
};

onMounted(fetchFilms);
</script>
