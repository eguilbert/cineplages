<template>
  <div class="rounded-xl border bg-white p-4 shadow-sm">
    <div class="flex items-center justify-between gap-3 mb-3">
      <div class="flex items-baseline gap-2">
        <div class="text-sm font-semibold">🏷️ Nuage de tags</div>
        <div class="text-xs text-gray-500">
          {{ items.length }} tag(s)
          <span v-if="hasActive">• {{ activeIds.size }} actif(s)</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="hasActive"
          type="button"
          class="text-xs px-2 py-1 rounded-lg border bg-gray-50 hover:bg-gray-100"
          @click="$emit('clear')"
        >
          Effacer
        </button>

        <label
          class="text-xs text-gray-600 flex items-center gap-2 select-none"
        >
          <input type="checkbox" v-model="showCounts" />
          afficher compte
        </label>
      </div>
    </div>

    <!-- zone nuage -->
    <div class="cloud-zone">
      <button
        v-for="t in items"
        :key="t.id"
        type="button"
        class="bubble"
        :class="[isActive(t.id) ? 'is-active' : 'is-idle']"
        :style="bubbleStyle(t)"
        :title="`${t.label} • ${t.count} film(s)`"
        @click="$emit('toggle', t.id)"
      >
        <span class="bubble-label">{{ t.label }}</span>
        <span v-if="showCounts" class="bubble-count">{{ t.count }}</span>
      </button>
    </div>

    <div class="mt-3 text-[11px] text-gray-500">
      Filtrage : un film est gardé s’il correspond à
      <strong>au moins un</strong> tag actif.
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  items: { type: Array, default: () => [] }, // [{id,label,count,weight}]
  activeIds: { type: Object, default: () => new Set() }, // Set
});

defineEmits(["toggle", "clear"]);

const showCounts = ref(false);
const hasActive = computed(() => (props.activeIds?.size || 0) > 0);

const isActive = (id) => props.activeIds?.has?.(id);

/**
 * Style "graphique" :
 * - taille via weight (1..5)
 * - léger “jitter” sur rotation/scale pour un aspect vivant (mais stable)
 * - opacité / bordure différentes si actif
 */
function bubbleStyle(t) {
  const w = Number(t.weight ?? 3); // 1..5
  const size = [28, 34, 42, 52, 64][Math.max(0, Math.min(4, w - 1))];
  const padX = [10, 12, 14, 16, 18][Math.max(0, Math.min(4, w - 1))];
  const padY = [6, 7, 8, 10, 12][Math.max(0, Math.min(4, w - 1))];

  // jitter stable basé sur id
  const seed = Number(t.id) || 1;
  const rot = ((seed % 9) - 4) * 0.6; // -2.4..+2.4 deg
  const scale = 1 + ((seed % 11) - 5) * 0.004; // ~0.98..1.02

  // font-size lié à weight
  const font = [12, 13, 14, 16, 18][Math.max(0, Math.min(4, w - 1))];

  return {
    padding: `${padY}px ${padX}px`,
    borderRadius: `${size}px`,
    fontSize: `${font}px`,
    transform: `rotate(${rot}deg) scale(${scale})`,
  };
}
</script>

<style scoped>
.cloud-zone {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.bubble {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition:
    transform 0.08s ease,
    box-shadow 0.12s ease,
    background-color 0.12s ease,
    border-color 0.12s ease;
  user-select: none;
  max-width: 320px;
}

.bubble:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px) scale(1.02);
}

.bubble-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bubble-count {
  font-size: 11px;
  opacity: 0.7;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 2px 7px;
  border-radius: 999px;
}

.is-idle {
  background: linear-gradient(180deg, #ffffff, #fafafa);
  color: #111827;
}

.is-active {
  background: linear-gradient(180deg, #111827, #0b1220);
  color: white;
  border-color: #111827;
}

.is-active .bubble-count {
  border-color: rgba(255, 255, 255, 0.25);
  opacity: 0.85;
}
</style>
