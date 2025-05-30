<template>
  <div class="mt-8">
    <h2 class="text-lg font-bold mb-2">Films à programmer</h2>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="film in films"
        :key="film.id"
        class="p-2 rounded shadow text-white cursor-move text-sm"
        :style="{ backgroundColor: getGenreColor(film.genre) }"
        draggable="true"
        @dragstart="onDragStart($event, film)"
      >
        {{ film.title }} ({{ film.genre }}) — {{ film.remaining }} séance(s)
      </div>
    </div>
  </div>
</template>
<script setup>
import { getGenreColor } from "@/utils/genreColors";

const props = defineProps({
  films: Array,
  genreColors: String,
  onDragStart: Function,
});
</script>
