<template>
  <BaseBlock title="À l'affiche">
    <div v-if="film" class="flex flex-col md:flex-row gap-4 items-start">
      <img
        :src="film.posterUrl"
        class="w-28 h-40 object-cover rounded shadow"
      />
      <div>
        <h3 class="text-lg font-semibold mb-1">{{ film.title }}</h3>
        <p class="text-sm text-gray-600 line-clamp-5">{{ film.synopsis }}</p>
        <NuxtLink
          :to="`/films/${film.id}`"
          class="text-blue-600 text-sm underline mt-2 inline-block"
          >Voir la fiche</NuxtLink
        >
      </div>
    </div>
  </BaseBlock>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BaseBlock from "@/components/BaseBlock.vue";
const props = defineProps({ filmId: Number });

const film = ref(null);
onMounted(async () => {
  film.value = await $fetch(`/api/films/${props.filmId}`);
});
</script>
