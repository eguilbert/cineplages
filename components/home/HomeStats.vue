<template>
  <BaseBlock title="Statistiques">
    <div
      class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-gray-700"
    >
      <div>
        <div class="text-2xl font-bold">{{ stats.totalFilms }}</div>
        <div>films</div>
      </div>
      <div>
        <div class="text-2xl font-bold">{{ stats.totalProjections }}</div>
        <div>projections</div>
      </div>
      <div>
        <div class="text-2xl font-bold">{{ stats.totalSpectateurs }}</div>
        <div>spectateurs</div>
      </div>
      <div>
        <div class="text-2xl font-bold">{{ stats.totalCommentaires }}</div>
        <div>commentaires</div>
      </div>
    </div>
  </BaseBlock>
</template>

<script setup>
import BaseBlock from "@/components/BaseBlock.vue";
const stats = ref({
  totalFilms: 83,
  totalProjections: 41,
  totalSpectateurs: 812,
  totalCommentaires: 31,
});
// TODO: faire une vraie API /api/stats/home
</script>
