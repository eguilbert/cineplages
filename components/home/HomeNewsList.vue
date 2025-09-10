<template>
  <BaseBlock title="Actualités">
    <ul class="space-y-2 text-sm">
      <li v-for="news in actualites" :key="news.id">
        <div class="font-medium">{{ news.title }}</div>
        <div class="text-gray-600 text-xs">
          {{ news.date }} — {{ news.summary }}
        </div>
      </li>
    </ul>
  </BaseBlock>
</template>

<script setup>
import BaseBlock from "@/components/BaseBlock.vue";
const actualites = ref([
  {
    id: 1,
    title: "Avant-première samedi",
    date: "02/09",
    summary: "Venez découvrir notre prochain film surprise...",
  },
  {
    id: 2,
    title: "Soirée débat",
    date: "05/09",
    summary: "Projection suivie d'une rencontre avec...",
  },
]);
</script>
