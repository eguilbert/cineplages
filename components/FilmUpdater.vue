<template>
  <button
    @click="refreshFilm"
    :title="`Mettre à jour : ${film.title}`"
    class="text-gray-500 hover:text-blue-600 transition"
  >
    <i v-if="loading" class="pi pi-spin pi-refresh"></i>
    <i v-else class="pi pi-refresh"></i>
  </button>
</template>

<script setup>
import { ref } from "vue";
const config = useRuntimeConfig();
const { apiFetch } = useApi();
const props = defineProps({
  film: Object,
  onUpdated: Function, // callback pour mettre à jour l'affichage
});

const loading = ref(false);

const refreshFilm = async () => {
  console.log(props.film.tmdbId);
  loading.value = true;
  try {
    const updated = await apiFetch(`/films/${props.film.tmdbId}/refresh`, {
      method: "POST",
    });

    if (props.onUpdated) {
      props.onUpdated(updated);
    }
  } catch (e) {
    console.error("Erreur lors de la mise à jour TMDB:", e);
    alert("Erreur lors de la mise à jour du film");
  } finally {
    loading.value = false;
  }
};
</script>
