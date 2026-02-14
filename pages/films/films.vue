<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Films</h1>

    <!-- Filtres -->
    <div class="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
      <div class="md:col-span-2">
        <label class="block text-xs text-gray-600 mb-1">Titre</label>
        <InputText v-model="filters.q" placeholder="Rechercher un titre..." class="w-full" />
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
        <InputText v-model="filters.director" placeholder="Nom du réalisateur" class="w-full" />
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
        <Button label="Rechercher" icon="pi pi-search" @click="performSearch(1)" />
      </div>

      <div class="flex gap-2">
        <Button label="Réinitialiser" severity="secondary" text @click="resetFilters" />
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
          <img v-if="data.posterUrl" :src="data.posterUrl" class="w-12 h-16 object-cover rounded" />
          <div v-else class="w-12 h-16 bg-gray-100 rounded"></div>
        </template>
      </Column>

      <Column header="Titre">
        <template #body="{ data }">
          <div class="font-medium">{{ data.title }}</div>
          <div v-if="data.director?.name" class="text-xs text-gray-500">— {{ data.director.name }}</div>
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

    <!-- Sidebar fiche film -->
    <Sidebar v-model:visible="showDetails" position="right" class="w-full md:w-[740px]">
      <template #header>
        <div class="flex items-center gap-3 w-full">
          <img v-if="detailsPoster" :src="detailsPoster" class="w-10 h-14 object-cover rounded" />
          <div class="min-w-0 flex-1">
            <div class="font-semibold truncate">
              {{ details?.title || selected?.title || "Film" }}
            </div>
            <div class="text-xs text-gray-500 truncate">
              {{ details?.director?.name || selected?.director?.name || "—" }}
            </div>
          </div>

          <div class="flex gap-2">
            <Button
              v-if="!editMode"
              icon="pi pi-pencil"
              label="Modifier"
              size="small"
              @click="enterEdit()"
              :disabled="detailsLoading"
            />
            <Button
              v-else
              icon="pi pi-times"
              label="Annuler"
              severity="secondary"
              size="small"
              @click="cancelEdit()"
              :disabled="saving"
            />
            <Button
              v-if="editMode"
              icon="pi pi-check"
              label="Enregistrer"
              size="small"
              @click="saveFilm()"
              :loading="saving"
            />
          </div>
        </div>
      </template>

      <div v-if="detailsLoading" class="p-4 text-sm text-gray-500">
        Chargement…
      </div>

      <div v-else-if="details" class="p-2">
        <TabView>
          <!-- ONGLET INFOS -->
          <TabPanel header="Infos">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Titre</label>
                  <InputText v-model="form.title" class="w-full" :disabled="!editMode" />
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1">Catégorie</label>
                  <Dropdown
                    v-model="form.category"
                    :options="categoryOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Choisir..."
                    class="w-full"
                    :disabled="!editMode"
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1">Date de sortie</label>
                  <Calendar
                    v-model="form.releaseDate"
                    dateFormat="yy-mm-dd"
                    :manualInput="true"
                    class="w-full"
                    :disabled="!editMode"
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1">Réalisateur</label>
                  <InputText
                    v-model="form.directorName"
                    placeholder="Nom du réalisateur"
                    class="w-full"
                    :disabled="!editMode"
                  />
                  <div class="text-[11px] text-gray-500 mt-1">
                    Astuce : si tu gères un directorId côté backend, remplace par un select.
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs text-gray-600 mb-1">Synopsis</label>
                  <Textarea v-model="form.synopsis" autoResize rows="4" class="w-full" :disabled="!editMode" />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs text-gray-600 mb-1">Poster URL</label>
                  <InputText v-model="form.posterUrl" class="w-full" :disabled="!editMode" />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs text-gray-600 mb-1">Trailer URL</label>
                  <InputText v-model="form.trailerUrl" class="w-full" :disabled="!editMode" />
                </div>
              </div>

              <div class="flex gap-3 flex-wrap items-start">
                <img
                  v-if="form.posterUrl"
                  :src="form.posterUrl"
                  class="w-28 h-40 object-cover rounded border"
                />
                <div v-else class="w-28 h-40 bg-gray-100 rounded border"></div>

                <div class="text-sm text-gray-600">
                  <div>
                    <span class="font-medium">Sortie:</span>
                    {{ formatDate(details.releaseDate) }}
                  </div>
                  <div>
                    <span class="font-medium">Sélections:</span>
                    {{ details._count?.selections ?? details.selections?.length ?? 0 }}
                  </div>
                  <div>
                    <span class="font-medium">Projections:</span>
                    {{ details._count?.filmProjections ?? details.filmProjections?.length ?? 0 }}
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- ONGLET AJOUT -->
          <TabPanel header="Ajouter">
            <div class="space-y-4">
              <div class="bg-gray-50 border rounded-lg p-4 space-y-3">
                <div class="text-sm font-semibold">Ajouter ce film à une sélection</div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div class="md:col-span-2">
                    <label class="block text-xs text-gray-600 mb-1">Sélection</label>
                    <Dropdown
                      v-model="addTo.selectionId"
                      :options="selectionsOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Choisir..."
                      class="w-full"
                      :loading="selectionsLoading"
                    />
                  </div>

                  <div class="flex gap-2">
                    <Button
                      label="Ajouter"
                      icon="pi pi-plus"
                      @click="addFilmToSelection()"
                      :disabled="!addTo.selectionId || addTo.loading"
                      :loading="addTo.loading"
                    />
                  </div>
                </div>

                <div class="text-xs text-gray-500">
                  Si ta “Programmation” est une sélection avec <code>status=PROGRAMMATION</code>, tu peux filtrer dans la
                  liste via le toggle ci-dessous.
                </div>

                <div class="flex items-center gap-2">
                  <Checkbox v-model="addTo.onlyProgrammations" binary inputId="onlyProg" />
                  <label for="onlyProg" class="text-sm">Afficher seulement les programmations</label>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- ONGLET SÉLECTIONS / LISTES / PROJECTIONS -->
          <TabPanel header="Liens">
            <div class="space-y-5">
              <div>
                <h3 class="font-semibold mb-2">Sélections</h3>
                <div v-if="!details.selections?.length" class="text-sm text-gray-500">Aucune sélection.</div>
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
                <div v-if="!details.lists?.length" class="text-sm text-gray-500">Aucune liste.</div>
                <ul class="space-y-2">
                  <li v-for="fl in details.lists" :key="fl.id" class="text-sm">
                    {{ fl.list?.name }}
                  </li>
                </ul>
              </div>

              <Divider />

              <div>
                <h3 class="font-semibold mb-2">Projections</h3>
                <div v-if="!details.filmProjections?.length" class="text-sm text-gray-500">
                  Aucune projection.
                </div>
                <ul class="space-y-2">
                  <li v-for="p in details.filmProjections" :key="p.id" class="text-sm">
                    <span class="font-medium">{{ formatDate(p.date) }} {{ p.hour }}</span>
                    <span class="text-gray-500"> — {{ p.cinema?.name || "Cinéma" }}</span>
                    <span v-if="p.salle" class="text-gray-500">, salle {{ p.salle }}</span>
                    <span v-if="p.audienceCount != null" class="text-gray-500"> — {{ p.audienceCount }} spect.</span>
                    <div v-if="p.commentaire" class="text-xs text-gray-500">{{ p.commentaire }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>

      <div v-else class="p-4 text-sm text-gray-500">Aucun détail.</div>
    </Sidebar>
  </div>
</template>

<script setup>
// Pas de TypeScript
import { ref, watch, computed, onMounted } from "vue";
import { useDebounceFn } from "@vueuse/core";

// PrimeVue
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Calendar from "primevue/calendar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Sidebar from "primevue/sidebar";
import Divider from "primevue/divider";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";

const { apiFetch } = useApi();

/**
 * -----------------------
 * Filtres / Search
 * -----------------------
 */
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
];

const items = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const loading = ref(false);

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
    const q = { page: page.value, pageSize: pageSize.value };
    if (filters.value.q) q.q = filters.value.q;
    if (filters.value.id) q.id = filters.value.id;
    if (filters.value.categories?.length) q.category = filters.value.categories.join(",");
    if (filters.value.director) q.director = filters.value.director;
    if (filters.value.dateRange?.[0]) q.dateFrom = toYMD(filters.value.dateRange[0]);
    if (filters.value.dateRange?.[1]) q.dateTo = toYMD(filters.value.dateRange[1]);

    const res = await apiFetch("/films/search", { query: q });
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

const debouncedSearch = useDebounceFn(() => performSearch(1), 350);
watch(() => [filters.value.q, filters.value.director], debouncedSearch);
watch(
  () => [filters.value.id, filters.value.categories, filters.value.dateRange],
  () => performSearch(1)
);

function onPage(e) {
  page.value = e.page + 1;
  pageSize.value = e.rows;
  fetchSearch();
}

function resetFilters() {
  filters.value = { q: "", id: "", categories: [], director: "", dateRange: null };
  performSearch(1);
}

/**
 * -----------------------
 * Sidebar / Details / Edit
 * -----------------------
 */
const showDetails = ref(false);
const selected = ref(null);
const details = ref(null);
const detailsLoading = ref(false);

const editMode = ref(false);
const saving = ref(false);

// Form éditable (copie de details)
const form = ref({
  title: "",
  category: "",
  releaseDate: null, // Date
  directorName: "",
  synopsis: "",
  posterUrl: "",
  trailerUrl: "",
});

// Poster (compat champs)
const detailsPoster = computed(() => {
  return (
    form.value.posterUrl ||
    details.value?.posterUrl ||
    details.value?.poster ||
    selected.value?.posterUrl ||
    null
  );
});

function hydrateFormFromDetails(d) {
  form.value = {
    title: d?.title || "",
    category: d?.category || "",
    releaseDate: d?.releaseDate ? new Date(d.releaseDate) : null,
    directorName: d?.director?.name || "",
    synopsis: d?.synopsis || "",
    posterUrl: d?.posterUrl || d?.poster || "",
    trailerUrl: d?.trailerUrl || "",
  };
}

async function openDetails(row) {
  selected.value = row;
  showDetails.value = true;
  detailsLoading.value = true;
  editMode.value = false;

  try {
    const d = await apiFetch(`/films/${row.id}/full`);
    details.value = d;
    hydrateFormFromDetails(d);
  } catch (e) {
    console.error("details error", e);
    details.value = null;
  } finally {
    detailsLoading.value = false;
  }
}

function enterEdit() {
  if (!details.value) return;
  editMode.value = true;
  // on repart de la source (au cas où)
  hydrateFormFromDetails(details.value);
}

function cancelEdit() {
  editMode.value = false;
  if (details.value) hydrateFormFromDetails(details.value);
}

async function saveFilm() {
  if (!selected.value?.id) return;
  saving.value = true;

  try {
    const payload = {
      title: form.value.title,
      category: form.value.category,
      releaseDate: form.value.releaseDate ? form.value.releaseDate.toISOString() : null,
      directorName: form.value.directorName || "",
      synopsis: form.value.synopsis || "",
      posterUrl: form.value.posterUrl || "",
      trailerUrl: form.value.trailerUrl || "",
    };

    // endpoint: PUT /films/:id
    const updated = await apiFetch(`/films/${selected.value.id}`, {
      method: "PUT",
      body: payload,
    });

    // 1) met à jour le panneau
    details.value = updated;
    // 2) met à jour le form (propre)
    hydrateFormFromDetails(updated);
    // 3) rafraîchit la liste (pour voir titre/cat/date changer)
    await fetchSearch();

    editMode.value = false;
  } catch (e) {
    console.error("save error", e);
  } finally {
    saving.value = false;
  }
}

// reset mode quand on ferme
watch(showDetails, (v) => {
  if (!v) {
    editMode.value = false;
    saving.value = false;
    selected.value = null;
    details.value = null;
  }
});

/**
 * -----------------------
 * Ajouter à une sélection / programmation
 * -----------------------
 * Hypothèses API :
 * - GET /selections -> [{id,name,status}]
 * - POST /selections/:selectionId/films { filmId }
 */
const selections = ref([]);
const selectionsLoading = ref(false);

const addTo = ref({
  selectionId: null,
  onlyProgrammations: false,
  loading: false,
});

const selectionsOptions = computed(() => {
  const src = Array.isArray(selections.value) ? selections.value : [];
  const filtered = addTo.value.onlyProgrammations
    ? src.filter((s) => String(s.status || "").toUpperCase().includes("PROGRAM"))
    : src;

  return filtered.map((s) => ({
    label: `${s.name}${s.status ? " — " + s.status : ""}`,
    value: s.id,
  }));
});

async function loadSelections() {
  selectionsLoading.value = true;
  try {
    selections.value = await apiFetch("/selections");
  } catch (e) {
    console.error("load selections error", e);
    selections.value = [];
  } finally {
    selectionsLoading.value = false;
  }
}

async function addFilmToSelection() {
  if (!addTo.value.selectionId || !selected.value?.id) return;
  addTo.value.loading = true;

  try {
    await apiFetch(`/selections/${addTo.value.selectionId}/films`, {
      method: "POST",
      body: { filmId: selected.value.id },
    });

    // refresh détails pour voir apparaître la sélection dans l’onglet Liens
    const d = await apiFetch(`/films/${selected.value.id}/full`);
    details.value = d;
    hydrateFormFromDetails(d);
  } catch (e) {
    console.error("add to selection error", e);
  } finally {
    addTo.value.loading = false;
  }
}

/**
 * -----------------------
 * init
 * -----------------------
 */
onMounted(() => {
  performSearch(1);
  loadSelections();
});
</script>

<style scoped>
/* rien pour l’instant */
</style>
