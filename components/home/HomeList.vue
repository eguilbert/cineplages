<!-- components/home/HomeList.vue -->
<template>
  <BaseBlock :title="title">
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <NuxtLink
        v-for="f in items"
        :key="f.id"
        :to="`/films/${f.id}`"
        class="group"
      >
        <div class="aspect-[2/3] bg-gray-100 rounded overflow-hidden shadow">
          <img
            v-if="f.posterUrl"
            :src="f.posterUrl"
            class="w-full h-full object-cover group-hover:scale-105 transition"
          />
        </div>
        <div class="mt-2 text-sm font-medium line-clamp-2">{{ f.title }}</div>
        <div class="text-xs text-gray-500">{{ formatDate(f.releaseDate) }}</div>
      </NuxtLink>
    </div>
  </BaseBlock>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BaseBlock from "@/components/BaseBlock.vue";
const { apiFetch } = useApi();

const props = defineProps({
  slug: { type: String, required: true },
  title: { type: String, default: "Liste" },
  pageSize: { type: Number, default: 10 },
});

const items = ref([]);

onMounted(async () => {
  const res = await apiFetch(`/api/lists/${props.slug}/items`, {
    query: { pageSize: props.pageSize },
  });
  items.value = res.items || [];
});

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString("fr-FR") : "";
}
</script>
