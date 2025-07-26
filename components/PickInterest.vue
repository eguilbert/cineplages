<script setup>
import { ref, watch } from "vue";
import Select from "primevue/select";
import { onMounted } from "vue";

const props = defineProps({
  modelValue: String, // pour v-model
  filmId: Number, // film concerné
});

const emit = defineEmits(["update:modelValue", "user-change"]);

const options = ref([
  { label: "🕳 Sans opinion", value: "SANS_OPINION" },
  { label: "❌ Pas intéressé", value: "NOT_INTERESTED" },
  { label: "🤔 À discuter", value: "CURIOUS" },
  { label: "✅ Très envie", value: "MUST_SEE" },
]);

// 🧠 Crée une copie locale modifiable
const selected = ref(props.modelValue);

// 🔁 Mets à jour la copie locale si la prop change
watch(
  () => props.modelValue,
  (newVal) => {
    console.log("watch from PickI: newVal", newVal);
    selected.value = newVal;
  }
);
onMounted(() => {
  selected.value = props.modelValue;
});
/* watch(selected, (newVal, oldVal) => {
  console.log("PickInterest: selected changed:", newVal, oldVal);
  if (newVal !== oldVal) {
    emit("update:modelValue", newVal);
  }
}); */

// Lors d’un vrai changement utilisateur (depuis l'UI)
function onUserChange(newVal) {
  emit("update:modelValue", newVal); // ← pour mettre à jour le modèle
  console.log("onUserChange(newVal)", newVal);
  emit("user-change", newVal); // ← déclenche explicitement l’intérêt modifié
}
</script>

<template>
  <div class="interest-select">
    <!-- <label class="block mb-1 font-bold mr-2">Mon avis sur le film :</label> -->
    <Select
      v-model="selected"
      :options="options"
      optionLabel="label"
      optionValue="value"
      class="w-full"
      placeholder="Donnez votre avis"
      @change="onUserChange($event.value)"
    />
  </div>
</template>
