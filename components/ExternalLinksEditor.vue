<template>
  <div>
    <h3 class="font-bold">Liens externes</h3>
    <div v-for="(link, i) in links" :key="i" class="flex gap-2 mb-2">
      <InputText v-model="link.label" placeholder="Label" />
      <InputText v-model="link.url" placeholder="URL" class="w-full" />
      <Button icon="pi pi-trash" severity="danger" text @click="remove(i)" />
    </div>
    <Button
      label="Ajouter un lien"
      @click="add"
      icon="pi pi-plus"
      size="small"
    />
  </div>
</template>

<script setup>
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const props = defineProps({ modelValue: Array });
const emit = defineEmits(["update:modelValue"]);

const links = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const add = () => links.value.push({ label: "", url: "" });
const remove = (i) => links.value.splice(i, 1);
</script>
