<template>
  <BaseBlock title="Prochaine programmation">
    <ul class="divide-y text-sm">
      <li
        v-for="p in projections"
        :key="p.id"
        class="py-2 flex justify-between items-center"
      >
        <div>
          <div class="font-medium">{{ p.film.title }}</div>
          <div class="text-xs text-gray-500">
            {{ formatDate(p.date) }} à {{ p.hour }} — {{ p.cinema.name }}
          </div>
        </div>
        <NuxtLink
          :to="`/films/${p.film.id}`"
          class="text-blue-500 text-xs hover:underline"
          >Voir</NuxtLink
        >
      </li>
    </ul>
  </BaseBlock>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BaseBlock from "@/components/BaseBlock.vue";

const projections = ref([]);

async function load() {
  projections.value = await $fetch("/api/projections/next"); // à créer
}

onMounted(load);

function formatDate(d) {
  return new Date(d).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}
</script>
