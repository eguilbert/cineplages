<template>
  <div>
    <h3 class="font-bold mb-2">Récompenses</h3>

    <div
      v-for="(award, i) in awards"
      :key="i"
      class="flex flex-col gap-1 items-center mb-2"
    >
      <input v-model="award.prize" placeholder="Prix" class="input" />
      <input v-model="award.festival" placeholder="Festival" class="input" />

      <input
        v-model.number="award.year"
        placeholder="Année"
        class="input"
        type="number"
      />
      <button @click="removeAward(i)">❌</button>
    </div>

    <button @click="addAward" class="mt-2 text-sm text-blue-600 underline">
      + Ajouter un prix
    </button>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["update:modelValue"]);

const awards = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const addAward = () => {
  awards.value.push({ prize: "", festival: "", year: null });
};

const removeAward = (index) => {
  awards.value.splice(index, 1);
};

onMounted(() => {
  if (!awards.value.length) addAward();
});
</script>

<style scoped>
.input {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  flex: 1;
}
</style>
