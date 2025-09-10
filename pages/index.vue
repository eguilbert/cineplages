<template>
  <div
    class="grid gap-6 px-4 py-8 max-w-screen-xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-min"
  >
    <component
      v-for="(block, i) in layout"
      :key="i"
      :is="componentMap[block.component]"
      v-bind="block.props || {}"
    />
  </div>
</template>

<script setup>
import Toast from "primevue/toast";
import HomeNextProgram from "@/components/home/HomeNextProgram.vue";
import HomeNewsList from "@/components/home/HomeNewsList.vue";
import HomeFilmHighlight from "@/components/home/HomeFilmHighlight.vue";
import HomeStats from "@/components/home/HomeStats.vue";
import layout from "@/config/homeLayout.json";

const componentMap = {
  HomeNextProgram: defineAsyncComponent(() =>
    import("@/components/home/HomeNextProgram.vue")
  ),
  HomeFilmHighlight: defineAsyncComponent(() =>
    import("@/components/home/HomeFilmHighlight.vue")
  ),
  HomeNewsList: defineAsyncComponent(() =>
    import("@/components/home/HomeNewsList.vue")
  ),
  HomeStats: defineAsyncComponent(() =>
    import("@/components/home/HomeStats.vue")
  ),
};

const highlightedFilmId = 179; // temporaire, ou à récupérer via API éditoriale
</script>

<style scoped>
/* Optionnel : légère animation à l’apparition */
section {
  animation: fadeInUp 0.3s ease-in-out;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
