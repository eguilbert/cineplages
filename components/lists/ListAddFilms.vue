<template>
  <div class="bg-white border rounded-lg p-4 shadow space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">Ajouter des films à la liste</h3>
      <Button
        label="Ajouter la sélection"
        size="small"
        :disabled="!selectedIds.length"
        @click="bulkAdd"
      />
    </div>

    <div class="flex gap-2">
      <InputText
        v-model.trim="q"
        placeholder="Titre, réalisateur..."
        class="w-full"
        @input="debouncedSearch"
      />
      <Button icon="pi pi-search" @click="search" />
    </div>

    <DataTable :value="results" :loading="loading" class="rounded">
      <Column header="" style="width: 60px">
        <template #body="{ data }">
          <img
            v-if="data.posterUrl"
            :src="data.posterUrl"
            class="w-10 h-14 object-cover rounded"
          />
        </template>
      </Column>
      <Column header="Titre">
        <template #body="{ data }">
          <div class="font-medium">{{ data.title }}</div>
          <div class="text-xs text-gray-500">{{ data.director?.name }}</div>
        </template>
      </Column>
      <Column header="Sortie" style="width: 120px">
        <template #body="{ data }">
          {{ formatDate(data.releaseDate) }}
        </template>
      </Column>
      <Column header="" style="width: 160px">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button label="Ajouter" size="small" @click="addOne(data.id)" />
            <Checkbox v-model="selected[data.id]" :binary="true" />
          </div>
        </template>
      </Column>
    </DataTable>

    <div v-if="selectedIds.length" class="text-xs text-gray-600">
      Sélection multiple: {{ selectedIds.length }} film(s) prêt(s) à ajouter.
    </div>

    <small v-if="error" class="text-red-600">{{ error }}</small>
    <small v-if="info" class="text-green-600">{{ info }}</small>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useApi } from "@/composables/useApi";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
const props = defineProps({
  slug: { type: String, required: true },
});

const { apiFetch } = useApi();
const q = ref("");
const results = ref([]);
const loading = ref(false);
const error = ref("");
const info = ref("");
const selected = ref({}); // map { filmId: true }

const selectedIds = computed(() =>
  Object.keys(selected.value)
    .filter((k) => selected.value[k])
    .map(Number)
);

const debouncedSearch = (() => {
  let t;
  return () => {
    clearTimeout(t);
    t = setTimeout(search, 300);
  };
})();

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString("fr-FR") : "";
}

async function search() {
  loading.value = true;
  error.value = "";
  info.value = "";
  try {
    const res = await apiFetch("/films/search", {
      query: { q: q.value, pageSize: 20 },
    });
    results.value = res.items || [];
  } catch (e) {
    error.value = e?.data?.error || e?.message || "Erreur recherche";
  } finally {
    loading.value = false;
  }
}

async function addOne(filmId) {
  error.value = "";
  info.value = "";
  try {
    await apiFetch(`/lists/${props.slug}/add`, {
      method: "POST",
      body: { filmId },
    });
    info.value = "Film ajouté à la liste.";
  } catch (e) {
    error.value = e?.data?.error || e?.message || "Impossible d’ajouter";
  }
}

async function bulkAdd() {
  error.value = "";
  info.value = "";
  try {
    await apiFetch(`/lists/${props.slug}/bulk-add`, {
      method: "POST",
      body: { filmIds: selectedIds.value },
    });
    info.value = `${selectedIds.value.length} film(s) ajouté(s).`;
    selected.value = {};
  } catch (e) {
    error.value =
      e?.data?.error || e?.message || "Impossible d’ajouter en masse";
  }
}
</script>
