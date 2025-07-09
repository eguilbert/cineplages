<template>
  <div>
    <h3 class="font-bold">Récompenses</h3>
    <div v-for="(award, i) in awards" :key="i" class="flex gap-2 mb-2">
      <InputText v-model="award.prize" placeholder="Prix" />
      <InputText v-model="award.festival" placeholder="Festival" />
      <InputNumber
        v-model="award.year"
        placeholder="Année"
        :useGrouping="false"
      />
      <Button icon="pi pi-trash" severity="danger" text @click="remove(i)" />
    </div>
    <Button
      label="Ajouter une récompense"
      @click="add"
      icon="pi pi-plus"
      size="small"
    />
  </div>
</template>

<script setup>
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";

const props = defineProps({ modelValue: Array });
const emit = defineEmits(["update:modelValue"]);

const awards = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const add = () => awards.value.push({ prize: "", festival: "", year: null });
const remove = (i) => awards.value.splice(i, 1);
</script>
