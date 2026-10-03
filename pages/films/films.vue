<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Films</h1>
    <NuxtLink to="/films/add">+ Ajouter depuis TMDB</NuxtLink>
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
      <Column field="genre" header="Genre" style="width: 160px" />

      <Column header="Sortie" style="width: 140px">
        <template #body="{ data }">{{ formatDate(data.releaseDate) }}</template>
      </Column>

      <Column header="Sélections" style="width: 120px">
        <template #body="{ data }">{{ data._count?.selections ?? 0 }}</template>
      </Column>

      <Column header="Projections" style="width: 120px">
        <template #body="{ data }">{{
          data._count?.filmProjections ?? 0
        }}</template>
      </Column>

      <Column header="" style="width: 80px">
        <template #body="{ data }">
          <Button icon="pi pi-eye" text @click="openDetails(data)" />
        </template>
      </Column>
    </DataTable>

    <!-- Sidebar fiche film -->
    <Sidebar
      v-model:visible="showDetails"
      position="right"
      class="w-full md:w-[860px]"
    >
      <template #header>
        <div class="flex items-center gap-3 w-full">
          <img
            v-if="form.posterUrl"
            :src="form.posterUrl"
            class="w-10 h-14 object-cover rounded"
          />
          <div class="min-w-0 flex-1">
            <div class="font-semibold truncate">
              {{ details?.title || selected?.title || "Film" }}
            </div>
            <div class="text-xs text-gray-500 truncate">
              {{ details?.director?.name || "—" }}
            </div>
          </div>

          <div class="flex gap-2">
            <Button
              v-if="!editMode"
              icon="pi pi-pencil"
              label="Modifier"
              size="small"
              @click="enterEdit()"
            />
            <Button
              v-else
              icon="pi pi-times"
              label="Annuler"
              severity="secondary"
              size="small"
              @click="cancelEdit()"
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
          <TabPanel header="Infos">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Titre</label>
                  <InputText
                    v-model="form.title"
                    class="w-full"
                    :disabled="!editMode"
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1"
                    >Genre (obligatoire)</label
                  >
                  <InputText
                    v-model="form.genre"
                    class="w-full"
                    :disabled="!editMode"
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1"
                    >Catégorie</label
                  >
                  <Dropdown
                    v-model="form.category"
                    :options="categoryOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Choisir..."
                    class="w-full"
                    :disabled="!editMode"
                    showClear
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1"
                    >Date de sortie</label
                  >
                  <Calendar
                    v-model="form.releaseDate"
                    dateFormat="yy-mm-dd"
                    :manualInput="true"
                    class="w-full"
                    :disabled="!editMode"
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1"
                    >Réalisateur</label
                  >
                  <InputText
                    v-model="form.directorName"
                    placeholder="Nom"
                    class="w-full"
                    :disabled="!editMode"
                  />
                  <div class="text-[11px] text-gray-500 mt-1">
                    (Sauvé via Director.name + connectOrCreate)
                  </div>
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1"
                    >Origine</label
                  >
                  <InputText
                    v-model="form.origin"
                    class="w-full"
                    :disabled="!editMode"
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1"
                    >Durée (min)</label
                  >
                  <InputNumber
                    v-model="form.duration"
                    class="w-full"
                    :disabled="!editMode"
                    :min="0"
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1">Budget</label>
                  <InputNumber
                    v-model="form.budget"
                    class="w-full"
                    :disabled="!editMode"
                    :min="0"
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1"
                    >Seances (défaut)</label
                  >
                  <InputNumber
                    v-model="form.seances"
                    class="w-full"
                    :disabled="!editMode"
                    :min="1"
                  />
                </div>

                <div>
                  <label class="block text-xs text-gray-600 mb-1">Rating</label>
                  <InputNumber
                    v-model="form.rating"
                    class="w-full"
                    :disabled="!editMode"
                    :min="0"
                    :max="10"
                    :step="0.1"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs text-gray-600 mb-1"
                    >Synopsis</label
                  >
                  <Textarea
                    v-model="form.synopsis"
                    autoResize
                    rows="4"
                    class="w-full"
                    :disabled="!editMode"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs text-gray-600 mb-1"
                    >Acteurs (texte)</label
                  >
                  <Textarea
                    v-model="form.actors"
                    autoResize
                    rows="2"
                    class="w-full"
                    :disabled="!editMode"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs text-gray-600 mb-1"
                    >Keywords (texte)</label
                  >
                  <Textarea
                    v-model="form.keywords"
                    autoResize
                    rows="2"
                    class="w-full"
                    :disabled="!editMode"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs text-gray-600 mb-1"
                    >Commentaire interne</label
                  >
                  <Textarea
                    v-model="form.commentaire"
                    autoResize
                    rows="2"
                    class="w-full"
                    :disabled="!editMode"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs text-gray-600 mb-1"
                    >Poster URL</label
                  >
                  <InputText
                    v-model="form.posterUrl"
                    class="w-full"
                    :disabled="!editMode"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs text-gray-600 mb-1"
                    >Trailer URL</label
                  >
                  <InputText
                    v-model="form.trailerUrl"
                    class="w-full"
                    :disabled="!editMode"
                  />
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Ajouter à une sélection">
            <div class="space-y-3">
              <div class="bg-gray-50 border rounded-lg p-4 space-y-3">
                <div class="text-sm font-semibold">
                  Ajouter ce film à une sélection
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div class="md:col-span-2">
                    <label class="block text-xs text-gray-600 mb-1"
                      >Sélection</label
                    >
                    <Dropdown
                      v-model="addTo.selectionId"
                      :options="selectionsOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Choisir..."
                      class="w-full"
                      :loading="selectionsLoading"
                      showClear
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

                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="addTo.onlyProgrammations"
                    binary
                    inputId="onlyProg"
                  />
                  <label for="onlyProg" class="text-sm"
                    >Afficher seulement les programmations</label
                  >
                </div>

                <div class="text-xs text-gray-500">
                  (Une “programmation” = une sélection avec
                  <code>status</code> contenant PROGRAMMATION)
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Liens">
            <div class="space-y-5">
              <div>
                <h3 class="font-semibold mb-2">Sélections</h3>
                <div
                  v-if="!details.selections?.length"
                  class="text-sm text-gray-500"
                >
                  Aucune sélection.
                </div>
                <ul class="space-y-2">
                  <li
                    v-for="sf in details.selections"
                    :key="sf.id"
                    class="text-sm"
                  >
                    <span class="font-medium">{{ sf.selection?.name }}</span>
                    <span class="text-gray-500">
                      — {{ sf.selection?.status }}</span
                    >
                  </li>
                </ul>
              </div>

              <Divider />

              <div>
                <h3 class="font-semibold mb-2">Listes</h3>
                <div
                  v-if="!details.lists?.length"
                  class="text-sm text-gray-500"
                >
                  Aucune liste.
                </div>
                <ul class="space-y-2">
                  <li
                    v-for="fl in details.lists"
                    :key="`${fl.listId}-${fl.filmId}`"
                    class="text-sm"
                  >
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
          </TabPanel>
        </TabView>
      </div>

      <div v-else class="p-4 text-sm text-gray-500">Aucun détail.</div>
    </Sidebar>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useDebounceFn } from "@vueuse/core";

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
import InputNumber from "primevue/inputnumber";

const { apiFetch } = useApi();

/* ----------------- Search ----------------- */
const filters = ref({
  q: "",
  id: "",
  categories: [],
  director: "",
  dateRange: null,
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
  return new Date(d).toLocaleDateString("fr-FR");
}

async function fetchSearch() {
  loading.value = true;
  try {
    const q = { page: page.value, pageSize: pageSize.value };
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
  () => performSearch(1),
);

function onPage(e) {
  page.value = e.page + 1;
  pageSize.value = e.rows;
  fetchSearch();
}
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

/* ----------------- Details/Edit ----------------- */
const showDetails = ref(false);
const selected = ref(null);
const details = ref(null);
const detailsLoading = ref(false);

const editMode = ref(false);
const saving = ref(false);

const form = ref({
  title: "",
  genre: "", // REQUIRED
  category: null,
  synopsis: "",
  releaseDate: null,
  duration: null,
  budget: null,
  origin: "",
  posterUrl: "",
  trailerUrl: "",
  actors: "",
  keywords: "",
  commentaire: "",
  rating: null,
  seances: 1,
  directorName: "",
});

function hydrateForm(d) {
  form.value = {
    title: d?.title || "",
    genre: d?.genre || "",
    category: d?.category || null,
    synopsis: d?.synopsis || "",
    releaseDate: d?.releaseDate ? new Date(d.releaseDate) : null,
    duration: d?.duration ?? null,
    budget: d?.budget ?? null,
    origin: d?.origin ?? "",
    posterUrl: d?.posterUrl ?? "",
    trailerUrl: d?.trailerUrl ?? "",
    actors: d?.actors ?? "",
    keywords: d?.keywords ?? "",
    commentaire: d?.commentaire ?? "",
    rating: d?.rating ?? null,
    seances: d?.seances ?? 1,
    directorName: d?.director?.name ?? "",
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
    hydrateForm(d);
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
  hydrateForm(details.value);
}
function cancelEdit() {
  editMode.value = false;
  if (details.value) hydrateForm(details.value);
}

async function saveFilm() {
  if (!selected.value?.id) return;
  saving.value = true;

  try {
    const payload = {
      title: form.value.title,
      genre: form.value.genre, // REQUIRED
      category: form.value.category,
      synopsis: form.value.synopsis,
      releaseDate: form.value.releaseDate
        ? form.value.releaseDate.toISOString()
        : null,
      duration: form.value.duration,
      budget: form.value.budget,
      origin: form.value.origin,
      posterUrl: form.value.posterUrl,
      trailerUrl: form.value.trailerUrl,
      actors: form.value.actors,
      keywords: form.value.keywords,
      commentaire: form.value.commentaire,
      rating: form.value.rating,
      seances: form.value.seances,
      directorName: form.value.directorName, // ✅ backend le mappe vers Director
    };

    const updated = await apiFetch(`/films/${selected.value.id}`, {
      method: "PUT",
      body: payload,
    });

    details.value = updated;
    hydrateForm(updated);
    await fetchSearch();
    editMode.value = false;
  } catch (e) {
    console.error("save error", e);
  } finally {
    saving.value = false;
  }
}

watch(showDetails, (v) => {
  if (!v) {
    editMode.value = false;
    saving.value = false;
    selected.value = null;
    details.value = null;
  }
});

/* ----------------- Add to Selection ----------------- */
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
    ? src.filter((s) =>
        String(s.status || "")
          .toUpperCase()
          .includes("PROGRAM"),
      )
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

    const d = await apiFetch(`/films/${selected.value.id}/full`);
    details.value = d;
    hydrateForm(d);
  } catch (e) {
    console.error("add to selection error", e);
  } finally {
    addTo.value.loading = false;
  }
}

/* ----------------- init ----------------- */
onMounted(() => {
  performSearch(1);
  loadSelections();
});
</script>

<style scoped>
/* nothing */
</style>
