<template>
  <div class="cloud">
    <div class="toolbar">
      <div class="title">
        <strong>Tags de la sélection</strong>
        <span class="muted" v-if="items.length">· {{ items.length }}</span>
      </div>

      <div class="controls">
        <label class="muted">Catégorie</label>
        <select v-model="category">
          <option value="">Toutes</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>

        <button
          type="button"
          class="small"
          @click="$emit('clear')"
          :disabled="!activeIds.size"
        >
          Effacer filtre
        </button>
      </div>
    </div>

    <div class="chips">
      <button
        v-for="t in filtered"
        :key="t.id"
        type="button"
        class="chip"
        :class="{ active: activeIds.has(t.id) }"
        :style="chipStyle(t.count)"
        @click="$emit('toggle', t.id)"
        :title="`${t.category} · ${t.count} film(s)`"
      >
        {{ t.label }}
        <span class="count">{{ t.count }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TagCloudItem } from "~/composables/useSelectionTagCloud";

const props = defineProps<{
  items: TagCloudItem[];
  activeIds: Set<number>;
}>();

defineEmits<{
  (e: "toggle", tagId: number): void;
  (e: "clear"): void;
}>();

const category = ref("");

const categories = computed(() => {
  const set = new Set(props.items.map((i) => i.category || "Autres"));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const filtered = computed(() => {
  return props.items.filter(
    (i) => !category.value || i.category === category.value
  );
});

const maxCount = computed(() =>
  Math.max(1, ...props.items.map((i) => i.count))
);
const minCount = computed(() =>
  Math.min(...props.items.map((i) => i.count), 1)
);

function chipStyle(count: number) {
  // taille 12px -> 18px selon fréquence, sans couleurs imposées
  const t = (count - minCount.value) / (maxCount.value - minCount.value || 1);
  const fontSize = 12 + t * 6;
  const opacity = 0.65 + t * 0.35;
  return { fontSize: `${fontSize}px`, opacity: String(opacity) };
}
</script>

<style scoped>
.cloud {
  border: 1px solid #ddd;
  border-radius: 14px;
  padding: 14px;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.chips {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  border: 1px solid #ccc;
  background: white;
  border-radius: 999px;
  padding: 6px 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
}
.chip.active {
  border-color: #111;
  font-weight: 600;
}
.count {
  opacity: 0.7;
  font-size: 0.9em;
}
.small {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: white;
}
.muted {
  opacity: 0.7;
}
</style>
