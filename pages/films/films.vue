<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Films</h1>

    <!-- Filtres -->
    <div
      class="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
    >
      <div class="md:col-span-2">
        <label class="block text-xs text-gray-600 mb-1">Titre</label>
        <InputText
          v-model="filters.q"
          placeholder="Rechercher un titre..."
          class="w-full"
        />
      </div>

      <div>
        <label class="block text-xs text-gray-600 mb-1">ID</label>
        <InputText v-model="filters.id" placeholder="ex: 179" class="w-full" />
      </div>

      <div>
        <label class="block text-xs text-gray-600 mb-1">Catégories</label>
        <MultiSelect
          v-model="filters.categories"
          :options="categoryOptions"
          optionLabel="label"
          optionValue="value"
          display="chip"
          placeholder="Choisir..."
          class="w-full"
        />
      </div>

      <div>
        <label class="block text-xs text-gray-600 mb-1">Réalisateur</label>
        <InputText
          v-model="filters.director"
          placeholder="Nom du réalisateur"
          class="w-full"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-xs text-gray-600 mb-1">Dates de sortie</label>
        <Calendar
          v-model="filters.dateRange"
          selectionMode="range"
          :manualInput="true"
          dateFormat="yy-mm-dd"
          placeholder="Intervalle"
          class="w-full"
        />
      </div>

      <div class="flex gap-2">
        <Button
          label="Rechercher"
          icon="pi pi-search"
          @click="performSearch(1)"
        />
      </div>

      <div class="flex gap-2">
        <Button
          label="Réinitialiser"
          severity="secondary"
          text
          @click="resetFilters"
        />
      </div>
    </div>

    <!-- Résultats -->
    <DataTable
      :value="items"
      :loading="loading"
      paginator
      :rows="pageSize"
      :totalRecords="total"
      lazy
      :first="(page - 1) * pageSize"
      @page="onPage"
      class="bg-white rounded-lg"
    >
      <Column header="" style="width: 72px">
        <template #body="{ data }">
          <img
            v-if="data.posterUrl"
            :src="data.posterUrl"
            class="w-12 h-16 object-cover rounded"
          />
          <div v-else class="w-12 h-16 bg-gray-100 rounded"></div>
        </template>
      </Column>

      <Column header="Titre">
        <template #body="{ data }">
          <div class="font-medium">{{ data.title }}</div>
          <div v-if="data.director?.name" class="text-xs text-gray-500">
            — {{ data.director.name }}
          </div>
        </template>
      </Column>

      <Column field="category" header="Catégorie" style="width: 160px" />

      <Column header="Sortie" style="width: 140px">
        <template #body="{ data }">
          {{ formatDate(data.releaseDate) }}
        </template>
      </Column>

      <Column header="Sélections" style="width: 120px">
        <template #body="{ data }">
          {{ data._count?.selections ?? 0 }}
        </template>
      </Column>

      <Column header="Projections" style="width: 120px">
        <template #body="{ data }">
          {{ data._count?.filmProjections ?? 0 }}
        </template>
      </Column>

      <Column header="" style="width: 80px">
        <template #body="{ data }">
          <Button icon="pi pi-eye" text @click="openDetails(data)" />
        </template>
      </Column>
    </DataTable>

    <!-- Panneau fiche film -->
    <Sidebar
      v-model:visible="showDetails"
      position="right"
      class="w-full md:w-[640px]"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <img
            v-if="selected?.poster"
            :src="selected.poster"
            class="w-10 h-14 object-cover rounded"
          />
          <div>
            <div class="font-semibold">{{ selected?.title }}</div>
            <div class="text-xs text-gray-500">
              {{ selected?.director?.name }}
            </div>
          </div>
        </div>
      </template>

      <div v-if="detailsLoading" class="p-4 text-sm text-gray-500">
        Chargement…
      </div>

      <div v-else-if="details">
        <div class="space-y-2 text-sm">
          <div class="text-gray-600">
            <span class="font-medium">Catégorie:</span>
            {{ details.category || "—" }}
          </div>
          <div class="text-gray-600">
            <span class="font-medium">Sortie:</span>
            {{ formatDate(details.releaseDate) }}
          </div>
          <div class="text-gray-600">
            <span class="font-medium">Réalisateur:</span>
            {{ details.director?.name || "—" }}
          </div>
          <div class="flex gap-2 flex-wrap">
            <img
              v-if="details.poster"
              :src="details.poster"
              class="w-28 h-40 object-cover rounded"
            />
          </div>
        </div>

        <Divider />

        <div>
          <h3 class="font-semibold mb-2">Sélections</h3>
          <div v-if="!details.selections?.length" class="text-sm text-gray-500">
            Aucune sélection.
          </div>
          <ul class="space-y-2">
            <li v-for="sf in details.selections" :key="sf.id" class="text-sm">
              <span class="font-medium">{{ sf.selection?.name }}</span>
              <span class="text-gray-500"> — {{ sf.selection?.status }}</span>
            </li>
          </ul>
        </div>

        <Divider />

        <div>
          <h3 class="font-semibold mb-2">Listes</h3>
          <div v-if="!details.lists?.length" class="text-sm text-gray-500">
            Aucune liste.
          </div>
          <ul class="space-y-2">
            <li v-for="fl in details.lists" :key="fl.id" class="text-sm">
              {{ fl.list?.name }}
            </li>
          </ul>
        </div>

        <Divider />

        <div>
          <h3 class="font-semibold mb-2">Projections</h3>
          <div
            v-if="!details.filmProjections?.length"
            class="text-sm text-gray-500"
          >
            Aucune projection.
          </div>
          <ul class="space-y-2">
            <li
              v-for="p in details.filmProjections"
              :key="p.id"
              class="text-sm"
            >
              <span class="font-medium"
                >{{ formatDate(p.date) }} {{ p.hour }}</span
              >
              <span class="text-gray-500">
                — {{ p.cinema?.name || "Cinéma" }}</span
              >
              <span v-if="p.salle" class="text-gray-500"
                >, salle {{ p.salle }}</span
              >
              <span v-if="p.audienceCount != null" class="text-gray-500">
                — {{ p.audienceCount }} spect.</span
              >
              <div v-if="p.commentaire" class="text-xs text-gray-500">
                {{ p.commentaire }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Sidebar>
  </div>
</template>

<script setup>
// Pas de TypeScript
import { ref, watch, computed } from "vue";
import { useDebounceFn } from "@vueuse/core";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Calendar from "primevue/calendar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Sidebar from "primevue/sidebar";
import Divider from "primevue/divider";
const { apiFetch } = useApi();
// PrimeVue comps supposés déjà enregistrés globalement
// InputText, MultiSelect, Calendar, Button, DataTable, Column, Sidebar, Divider

const filters = ref({
  q: "",
  id: "",
  categories: [],
  director: "",
  dateRange: null, // [Date, Date]
});

const categoryOptions = [
  { label: "Art et Essai", value: "Art et Essai" },
  { label: "Documentaire", value: "Documentaire" },
  { label: "Grand Public", value: "Grand Public" },
  { label: "Jeunesse", value: "Jeunesse" },
  // … complétez selon votre enum
];

const items = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const loading = ref(false);

const showDetails = ref(false);
const selected = ref(null);
const details = ref(null);
const detailsLoading = ref(false);

function toYMD(d) {
  if (!d) return "";
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleDateString("fr-FR");
}

async function fetchSearch() {
  loading.value = true;
  try {
    const q = {
      page: page.value,
      pageSize: pageSize.value,
    };
    if (filters.value.q) q.q = filters.value.q;
    if (filters.value.id) q.id = filters.value.id;
    if (filters.value.categories?.length)
      q.category = filters.value.categories.join(",");
    if (filters.value.director) q.director = filters.value.director;
    if (filters.value.dateRange?.[0])
      q.dateFrom = toYMD(filters.value.dateRange[0]);
    if (filters.value.dateRange?.[1])
      q.dateTo = toYMD(filters.value.dateRange[1]);

    const res = await apiFetch("/films/search", { query: q });
    // Debug doux pour vérifier le format une fois :
    console.log("search res", res);

    items.value = res.items || [];
    total.value = res.total || 0;
  } catch (e) {
    console.error("search error", e);
    items.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

const performSearch = (toPage) => {
  if (toPage) page.value = toPage;
  fetchSearch();
};

// Debounce quand on tape
const debouncedSearch = useDebounceFn(() => performSearch(1), 350);
watch(() => [filters.value.q, filters.value.director], debouncedSearch);
watch(
  () => [filters.value.id, filters.value.categories, filters.value.dateRange],
  () => performSearch(1)
);

// pagination
function onPage(e) {
  page.value = e.page + 1;
  pageSize.value = e.rows;
  fetchSearch();
}

// reset
function resetFilters() {
  filters.value = {
    q: "",
    id: "",
    categories: [],
    director: "",
    dateRange: null,
  };
  performSearch(1);
}

// détails
async function openDetails(row) {
  selected.value = row;
  showDetails.value = true;
  detailsLoading.value = true;
  try {
    details.value = await apiFetch(`/films/${row.id}/full`);
  } catch (e) {
    console.error("details error", e);
  } finally {
    detailsLoading.value = false;
  }
}

// templates colonnes
function posterTpl(row) {
  return row.poster
    ? `<img src="${row.poster}" class="w-12 h-16 object-cover rounded" />`
    : `<div class="w-12 h-16 bg-gray-100 rounded"></div>`;
}
function titleTpl(row) {
  const dir = row.director?.name
    ? ` <span class="text-gray-500">— ${row.director.name}</span>`
    : "";
  return `<div class="font-medium">${row.title}</div><div class="text-xs text-gray-500">${dir}</div>`;
}
function dateTpl(row) {
  return `<span>${formatDate(row.releaseDate)}</span>`;
}
function actionsTpl(row) {
  return `<button class="p-button p-button-text p-1" data-film="${row.id}"><i class="pi pi-eye"></i></button>`;
}

// délégation click pour bouton "voir"
onMounted(() => {
  const table = document.body;
  const handler = (e) => {
    const btn = e.target.closest("button[data-film]");
    if (btn) {
      const id = Number(btn.getAttribute("data-film"));
      const row = items.value.find((it) => it.id === id);
      if (row) openDetails(row);
    }
  };
  table.addEventListener("click", handler);
});

onMounted(() => performSearch(1));
</script>

<style scoped>
/* léger raffinement si nécessaire */
</style>
