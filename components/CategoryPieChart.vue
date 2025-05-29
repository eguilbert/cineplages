<template>
  <div class="mt-8">
    <h2 class="text-lg font-bold mb-2">Répartition par catégorie</h2>
    <PieChart :data="data" />
  </div>
</template>

<script setup>
import { PieChart } from "vue-chart-3";
const props = defineProps({
  data: Object,
});
</script>
