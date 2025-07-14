<script setup>
import { ref, watch } from "vue";
import Dropdown from "primevue/dropdown";

const props = defineProps({
  modelValue: String, // pour v-model
  filmId: Number, // film concerné
});

const emit = defineEmits(["update:modelValue"]);

const options = ref([
  { label: "🕳 Sans opinion", value: "SANS_OPINION" },
  { label: "❌ Pas intéressé", value: "NOT_INTERESTED" },
  { label: "🤔 Curieux", value: "CURIOUS" },
  { label: "✅ Très envie", value: "MUST_SEE" },
]);

// 🧠 Crée une copie locale modifiable
const selected = ref(props.modelValue);

// 🔁 Mets à jour la copie locale si la prop change
watch(
  () => props.modelValue,
  (newVal) => {
    selected.value = newVal;
  }
);
// 📤 Émet la nouvelle valeur vers le parent
watch(selected, (newVal) => {
  emit("update:modelValue", newVal);
});
</script>

<template>
  <div class="interest-select">
    <!-- <label class="block mb-1 font-bold mr-2">Mon avis sur le film :</label> -->
    <Dropdown
      v-model="selected"
      :options="options"
      optionLabel="label"
      optionValue="value"
      class="w-full"
      placeholder="Donnez votre avis"
    />
  </div>
</template>
