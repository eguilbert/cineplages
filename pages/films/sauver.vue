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

    <div class="mb-6 rounded-lg border bg-white p-4 space-y-3">
      <label class="flex items-center gap-2">
        <input v-model="analyzeAfterSave" type="checkbox" />
        Proposer des recommandations après la sauvegarde
      </label>
      <label v-if="analyzeAfterSave" class="block max-w-md">
        Cinéma concerné
        <select v-model.number="cinemaId" class="mt-1 w-full rounded border p-2">
          <option v-for="cinema in cinemas" :key="cinema.id" :value="cinema.id">{{ cinema.name }}</option>
        </select>
      </label>
      <p class="text-sm text-gray-600">Les analyses utilisent le profil éditorial du cinéma et les films enregistrés dans cette sélection.</p>
    </div>

    <p v-if="saveError" role="alert" class="mb-4 rounded bg-red-50 p-3 text-red-800">{{ saveError }}</p>

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
        :disabled="!canSave || saving || !!savedSelection"
        @click="saveSelection"
      />
    </div>

    <section v-if="savedSelection" class="mt-8 rounded-lg bg-white p-5 shadow-sm space-y-3">
      <h2 class="text-xl font-semibold">Sélection « {{ savedSelection.name }} » enregistrée</h2>
      <p v-if="analyzing">Analyse des films en cours…</p>
      <p v-else-if="analysisError" role="alert" class="text-amber-800">{{ analysisError }} La sélection reste enregistrée.</p>
      <template v-else-if="recommendations !== null">
        <p>{{ recommendations.length }} film(s) analysé(s) pour {{ selectedCinemaName }}.</p>
        <ul class="divide-y">
          <li v-for="item in recommendations" :key="item.id" class="py-2 flex justify-between gap-3">
            <span>{{ item.film.title }}</span>
            <span>{{ item.editorialFit === null ? 'Affinité non évaluée' : `${item.editorialFit}/100` }}</span>
          </li>
        </ul>
        <NuxtLink to="/admin/recommendations" class="inline-block text-[#26474e] underline">Voir les explications et décider</NuxtLink>
      </template>
      <NuxtLink to="/films/selections" class="inline-block text-[#26474e] underline">Voir les sélections</NuxtLink>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  requiredRole: "ADMIN",
});
import { ref, computed, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import { useImportStore } from "~/stores/import";
import { getApiErrorMessage } from "@/utils/apiError";

const selectionName = ref("");
const existingSelection = ref(null);
const selections = ref([]);
const cinemas = ref([]);
const cinemaId = ref(null);
const analyzeAfterSave = ref(true);
const saving = ref(false);
const analyzing = ref(false);
const saveError = ref("");
const analysisError = ref("");
const savedSelection = ref(null);
const recommendations = ref(null);
const { user, ensureUserLoaded } = useAuth();
const selectedCinemaName = computed(() => cinemas.value.find((c) => c.id === cinemaId.value)?.name || "ce cinéma");

const importStore = useImportStore();
const filmsToSave = importStore.importedFilms;
const config = useRuntimeConfig();

const canSave = computed(() => {
  return filmsToSave.length && (selectionName.value || existingSelection.value) &&
    (!analyzeAfterSave.value || cinemaId.value);
});
const { apiFetch } = useApi();
onMounted(async () => {
  await ensureUserLoaded();
  try {
    const [existing, available] = await Promise.all([apiFetch(`/selections`), apiFetch(`/cinemas`)]);
    selections.value = existing;
    cinemas.value = available;
    cinemaId.value = available.find((c) => c.id === user.value?.cinemaId)?.id ?? available[0]?.id ?? null;
  } catch (error) {
    saveError.value = getApiErrorMessage(error, "Impossible de charger les cinémas et les sélections.");
  }
});

const saveSelection = async () => {
  if (saving.value || savedSelection.value) return;
  saving.value = true;
  saveError.value = "";
  const selectionPath = existingSelection.value ? `/selections/${existingSelection.value.id}` : "/selections";
  try {
    savedSelection.value = await apiFetch(selectionPath, {
      method: existingSelection.value ? "PUT" : "POST",
      body: { name: existingSelection.value?.name || selectionName.value, films: filmsToSave },
    });
    importStore.clear();
  } catch (error) {
    saveError.value = getApiErrorMessage(error, "Erreur lors de la sauvegarde de la sélection.");
    saving.value = false;
    return;
  }
  saving.value = false;

  if (analyzeAfterSave.value) {
    analyzing.value = true;
    try {
      recommendations.value = await apiFetch(`/cinemas/${cinemaId.value}/selections/${savedSelection.value.id}/recommendations`, {
        method: "POST",
      });
    } catch (error) {
      analysisError.value = getApiErrorMessage(error, "Impossible d'analyser les films.");
    } finally {
      analyzing.value = false;
    }
  }
};
</script>
