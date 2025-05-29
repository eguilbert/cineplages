<template>
  <div class="mt-6">
    <h2 class="text-lg font-bold mb-2">Synthèse des programmations</h2>
    <ul>
      <li v-for="(count, title) in summary" :key="title">
        {{ title }} — {{ count }} séance(s) programmées
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  summary: Object,
});
</script>
