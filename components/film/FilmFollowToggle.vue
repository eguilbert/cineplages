<template>
  <button
    class="px-3 py-2 rounded border text-sm"
    :class="
      following ? 'bg-green-50 border-green-400' : 'bg-white hover:bg-gray-50'
    "
    @click="toggle"
  >
    <span class="mr-1">{{ following ? "🔔" : "➕" }}</span>
    {{ following ? "Suivi activé" : "Suivre ce film" }}
  </button>
  <p v-if="error" class="text-xs text-red-600 mt-1">{{ error }}</p>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useApi } from "@/composables/useApi";

const props = defineProps({
  filmId: { type: Number, required: true },
  // Optionnel : si le parent a déjà fetch /public
  initialFollowing: { type: Boolean, default: null },
});

const emit = defineEmits(["change"]);
const { apiFetch } = useApi();

const following = ref(false);
const error = ref("");

onMounted(async () => {
  if (props.initialFollowing !== null) {
    following.value = props.initialFollowing;
    return;
  }
  try {
    const res = await apiFetch(`/films/${props.filmId}/public`);
    following.value = !!res.amIFollowing;
  } catch (e) {
    // silencieux sur la page publique si non connecté
  }
});

async function toggle() {
  error.value = "";
  try {
    const next = !following.value;
    following.value = next; // optimiste
    await apiFetch(`/films/${props.filmId}/follow`, {
      method: "POST",
      body: { follow: next },
      credentials: "include",
    });
    emit("change", next);
  } catch (e) {
    following.value = !following.value;
    error.value = e?.data?.error || e?.message || "Action impossible";
  }
}
</script>
