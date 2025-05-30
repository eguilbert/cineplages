<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">
      Étape 3/3 : Sauvegarder la sélection
    </h1>

    <div class="mb-4">
      <label
        for="selectionName"
        class="block text-sm font-medium text-gray-700 mb-1"
        >Nom de la sélection</label
      >
      <InputText
        id="selectionName"
        v-model="selectionName"
        class="w-full"
        placeholder="ex : Sélection Juin 2025"
      />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1"
        >Ou ajouter à une sélection existante :</label
      >
      <Dropdown
        v-model="existingSelection"
        :options="selections"
        optionLabel="name"
        placeholder="Choisir..."
        class="w-full"
      />
    </div>

    <div class="flex justify-end gap-2">
      <Button
        label="Annuler"
        severity="secondary"
        @click="navigateTo('/films')"
      />
      <Button
        label="Sauvegarder"
        icon="pi pi-save"
        :disabled="!canSave"
        @click="saveSelection"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import { useImportStore } from "~/stores/import";

const selectionName = ref("");
const existingSelection = ref(null);
const selections = ref([]);

const importStore = useImportStore();
const filmsToSave = importStore.importedFilms;
const config = useRuntimeConfig();

const canSave = computed(() => {
  return filmsToSave.length && (selectionName.value || existingSelection.value);
});

onMounted(async () => {
  const res = await fetch(`${config.public.apiBase}/selections`);
  selections.value = await res.json();
});

const saveSelection = async () => {
  const payload = {
    name: existingSelection.value?.name || selectionName.value,
    films: filmsToSave,
  };
  const res = await fetch(`${config.public.apiBase}/selections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    navigateTo("/films/selections");
  } else {
    alert("Erreur lors de la sauvegarde.");
  }
};
</script>
