<template>
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
</template>

<script setup>
const props = defineProps({
  genreColors: Object,
  genreCategories: Object,
});
</script>
