<template>
  <div>
    <h3 class="font-bold mb-2">Liens externes</h3>

    <div
      v-for="(link, i) in links"
      :key="i"
      class="flex gap-2 items-center mb-2"
    >
      <input v-model="link.label" placeholder="Label" class="input" />
      <input v-model="link.url" placeholder="URL" class="input" />
      <button @click="removeLink(i)">❌</button>
    </div>

    <button @click="addLink" class="mt-2 text-sm text-blue-600 underline">
      + Ajouter un lien
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

const links = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const addLink = () => {
  links.value.push({ label: "", url: "" });
};

const removeLink = (index) => {
  links.value.splice(index, 1);
};

onMounted(() => {
  if (!links.value.length) addLink();
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
