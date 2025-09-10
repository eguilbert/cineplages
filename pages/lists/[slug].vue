<!-- /pages/lists/[slug].vue -->
<template>
  <div class="px-4 py-6 max-w-screen-xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">{{ list?.name || "Liste" }}</h1>
        <p class="text-sm text-gray-500">
          <span class="mr-2"
            >Type: <b>{{ list?.type }}</b></span
          >
          <span class="mr-2"
            >Scope: <b>{{ list?.scope }}</b></span
          >
          <span v-if="list?.description" class="block">{{
            list.description
          }}</span>
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button
          label="Rafraîchir"
          icon="pi pi-refresh"
          @click="reload"
          :loading="loadingList || loadingItems"
        />
        <Button
          v-if="canReorder"
          severity="success"
          :disabled="savingOrder || items.length === 0"
          :loading="savingOrder"
          label="Enregistrer l’ordre"
          icon="pi pi-save"
          @click="saveOrder"
        />
      </div>
    </div>

    <!-- Ajout de films -->
    <div v-if="canAdd" class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Ajouter des films</h2>
        <Button
          text
          size="small"
          :label="showAdd ? 'Masquer' : 'Afficher'"
          @click="showAdd = !showAdd"
        />
      </div>
      <ListAddFilms v-if="showAdd" :slug="slug" @added="reloadItems" />
    </div>

    <!-- Tableau des items -->
    <section class="bg-white border rounded-lg shadow p-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold">Films de la liste</h2>
        <small v-if="info" class="text-green-600">{{ info }}</small>
        <small v-if="error" class="text-red-600">{{ error }}</small>
      </div>

      <DataTable :value="items" :loading="loadingItems" stripedRows>
        <Column header="#" style="width: 70px">
          <template #body="{ index }">
            <span class="text-xs text-gray-500">{{ index + 1 }}</span>
          </template>
        </Column>

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
            <div class="text-xs text-gray-500">
              {{ data.category || "—" }} · {{ formatDate(data.releaseDate) }}
            </div>
          </template>
        </Column>

        <Column header="Actions" style="width: 220px">
          <template #body="{ data, index }">
            <div class="flex gap-2">
              <Button
                v-if="canReorder"
                icon="pi pi-arrow-up"
                size="small"
                text
                :disabled="index === 0"
                @click="moveUp(index)"
              />
              <Button
                v-if="canReorder"
                icon="pi pi-arrow-down"
                size="small"
                text
                :disabled="index === items.length - 1"
                @click="moveDown(index)"
              />
              <Button
                icon="pi pi-trash"
                size="small"
                severity="danger"
                text
                @click="removeOne(data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <div
        v-if="!loadingItems && items.length === 0"
        class="text-sm text-gray-500 mt-3"
      >
        Aucun film dans cette liste.
      </div>
    </section>
  </div>
</template>

<script setup>
// Pas de TS
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "#imports";
import { useApi } from "@/composables/useApi";
import ListAddFilms from "@/components/lists/ListAddFilms.vue";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
const route = useRoute();
const slug = computed(() => String(route.params.slug));
const { apiFetch } = useApi();

const list = ref(null);
const items = ref([]);

const loadingList = ref(false);
const loadingItems = ref(false);
const savingOrder = ref(false);
const showAdd = ref(true);

const error = ref("");
const info = ref("");

// Seules les listes CURATED/FAVORITES acceptent ajout & réordonnancement
const canAdd = computed(() =>
  ["CURATED", "FAVORITES"].includes(list.value?.type)
);
const canReorder = canAdd; // même règle ici

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR");
}

async function loadList() {
  loadingList.value = true;
  error.value = "";
  try {
    list.value = await apiFetch(`/lists/${slug.value}`);
  } catch (e) {
    error.value = e?.data?.error || e?.message || "Erreur chargement liste";
  } finally {
    loadingList.value = false;
  }
}

async function loadItems() {
  loadingItems.value = true;
  error.value = "";
  try {
    // Retour attendu: { page, pageSize, items: Film[] } (déjà triés par rank si CURATED/FAVORITES)
    const res = await apiFetch(`/lists/${slug.value}/items`, {
      query: { pageSize: 200 },
    });
    items.value = res.items || [];
  } catch (e) {
    error.value = e?.data?.error || e?.message || "Erreur chargement items";
  } finally {
    loadingItems.value = false;
  }
}

function moveUp(i) {
  if (i <= 0) return;
  const arr = items.value;
  [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
}

function moveDown(i) {
  const arr = items.value;
  if (i >= arr.length - 1) return;
  [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
}

async function saveOrder() {
  if (!canReorder.value || items.value.length === 0) return;
  savingOrder.value = true;
  error.value = "";
  info.value = "";
  try {
    // On recalcule des rangs propres (10,20,30...) selon l’ordre affiché
    const payload = {
      items: items.value.map((f, idx) => ({
        filmId: f.id,
        rank: (idx + 1) * 10,
      })),
    };
    await apiFetch(`/lists/${slug.value}/reorder`, {
      method: "POST",
      body: payload,
    });
    info.value = "Ordre enregistré.";
  } catch (e) {
    error.value =
      e?.data?.error || e?.message || "Impossible d’enregistrer l’ordre";
  } finally {
    savingOrder.value = false;
  }
}

async function removeOne(filmId) {
  error.value = "";
  info.value = "";
  try {
    await apiFetch(`/lists/${slug.value}/remove`, {
      method: "POST",
      body: { filmId },
    });
    items.value = items.value.filter((f) => f.id !== filmId);
    info.value = "Film retiré.";
  } catch (e) {
    error.value = e?.data?.error || e?.message || "Impossible de retirer";
  }
}

async function reloadItems() {
  await loadItems();
}

async function reload() {
  await Promise.all([loadList(), loadItems()]);
}

watch(slug, reload, { immediate: true });
onMounted(reload);
</script>
