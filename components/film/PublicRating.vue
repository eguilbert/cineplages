<template>
  <div class="bg-white border rounded-lg p-4 shadow space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">Votre avis</h3>
      <small v-if="saving" class="text-gray-500">Enregistrement…</small>
    </div>

    <div class="flex gap-2">
      <button
        v-for="opt in options"
        :key="opt.value"
        class="px-3 py-2 rounded border text-sm"
        :class="
          opt.value === myRating
            ? 'bg-blue-50 border-blue-400'
            : 'bg-white hover:bg-gray-50'
        "
        @click="setRating(opt.value)"
      >
        <span class="mr-1">{{ opt.icon }}</span
        >{{ opt.label }}
      </button>
    </div>

    <div class="text-xs text-gray-600">
      <div
        class="flex items-center justify-between"
        v-for="opt in options"
        :key="opt.value"
      >
        <span class="flex items-center gap-1"
          ><span>{{ opt.icon }}</span
          >{{ opt.label }}</span
        >
        <span>{{ breakdown[opt.value] || 0 }}</span>
      </div>
    </div>

    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useApi } from "@/composables/useApi";

const props = defineProps({ filmId: { type: Number, required: true } });
const { apiFetch } = useApi();

const options = [
  { value: "DISLIKE", label: "Je n'ai pas aimé", icon: "👎" },
  { value: "NEUTRAL", label: "Bof", icon: "😐" },
  { value: "LIKE", label: "Bien", icon: "👍" },
  { value: "LOVE", label: "Coup de cœur", icon: "❤️" },
];

const myRating = ref(null);
const breakdown = ref({});
const saving = ref(false);
const error = ref("");

onMounted(load);

async function load() {
  error.value = "";
  try {
    const res = await apiFetch(`/films/${props.filmId}/public`);
    myRating.value = res.myRating || null;
    breakdown.value = res.ratingBreakdown || {};
  } catch (e) {
    error.value = e?.data?.error || e?.message || "Erreur chargement";
  }
}

async function setRating(value) {
  saving.value = true;
  error.value = "";
  try {
    // Optimisme : maj breakdown localement
    const prev = myRating.value;
    if (prev && breakdown.value[prev] > 0) breakdown.value[prev] -= 1;
    myRating.value = value;
    breakdown.value[value] = (breakdown.value[value] || 0) + 1;

    await apiFetch(`/films/${props.filmId}/rating`, {
      method: "POST",
      body: { value },
    });
  } catch (e) {
    error.value = e?.data?.error || e?.message || "Erreur enregistrement";
    // rollback
    await load();
  } finally {
    saving.value = false;
  }
}
</script>
