<template>
  <div class="space-y-2">
    <div
      v-for="p in projections"
      :key="p.id"
      class="p-3 bg-white shadow rounded"
    >
      <div class="font-bold text-sm">{{ p.date }} à {{ p.hour }}</div>
      <div class="text-sm text-gray-700">
        {{ p.film.title }} – {{ p.cinema.name }}
        {{ p.salle ? " (" + p.salle + ")" : "" }}
      </div>
      <div v-if="p.audienceCount" class="text-xs text-gray-500">
        {{ p.audienceCount }} spectateurs
      </div>
      <div v-if="p.commentaire" class="text-xs italic text-gray-600">
        {{ p.commentaire }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const projections = ref([]);

onMounted(async () => {
  projections.value = await apiFetch(`/projections`);
});
</script>
