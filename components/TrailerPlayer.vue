<template>
  <div class="relative">
    <div
      v-if="!visible && youtubeId"
      @click="visible = true"
      class="cursor-pointer flex items-center gap-2 text-gray-500 w-full bg-slate-200 rounded justify-center p-2 shadow hover:shadow-md transition-shadow"
    >
      <i class="pi pi-play-circle text-l"></i>
      <span>Voir la bande-annonce</span>
    </div>

    <div
      v-if="visible && youtubeId"
      class="aspect-video w-full rounded overflow-hidden shadow"
    >
      <iframe
        :src="`https://www.youtube.com/embed/${youtubeId}`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="w-full h-full"
      ></iframe>
    </div>

    <p v-if="!youtubeId" class="text-sm text-gray-500">
      Aucune bande-annonce disponible
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  youtubeUrl: String,
});

const visible = ref(false);

const youtubeId = computed(() => {
  const match = props.youtubeUrl?.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
  );
  return match?.[1] || null;
});
</script>
