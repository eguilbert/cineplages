<template>
  <div>
    <Select
      v-if="!modeCompact"
      v-model="localValue"
      :options="options"
      optionLabel="label"
      optionValue="value"
      placeholder="Donnez votre avis"
      class="w-full md:w-48"
      size="small"
      :disabled="mode === 'programmation'"
      @change="emit('update:modelValue', $event.value)"
    />
    <Select
      v-else
      v-model="localValue"
      :options="options"
      optionLabel="label"
      optionValue="value"
      placeholder="Avis"
      class="w-full text-xs"
      size="small"
      :disabled="mode === 'programmation'"
      @change="emit('update:modelValue', $event.value)"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Select from "primevue/select";

const props = defineProps({
  modelValue: { type: String },
  mode: { type: String, default: "selection" },
  modeCompact: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);

const options = [
  { label: "Sans opinion", value: "SANS_OPINION" },
  { label: "Pas intéressé", value: "NOT_INTERESTED" },
  { label: "Pourquoi pas", value: "CURIOUS" },
  { label: "Intéressé", value: "VERY_INTERESTED" },
  { label: "Incontournable", value: "MUST_SEE" },
];

const localValue = ref(props.modelValue);
watch(
  () => props.modelValue,
  (v) => {
    localValue.value = v;
  }
);

function emitChange() {
  // pas d'async ici : le parent gère l’API (évite les boucles)
  if (localValue.value !== undefined && localValue.value !== null) {
    emit("update:modelValue", localValue.value);
  }
}
</script>
