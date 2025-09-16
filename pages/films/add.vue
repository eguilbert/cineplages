<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">Ajouter un film</h1>

    <!-- Recherche -->
    <div class="flex gap-2">
      <InputText
        v-model="query"
        placeholder="Rechercher un film..."
        class="w-full md:w-1/2"
        @keyup.enter="searchFilm"
      />
      <Button label="Rechercher" icon="pi pi-search" @click="searchFilm" />
    </div>

    <div v-if="loading" class="text-gray-500">Recherche en cours…</div>

    <!-- Résultats (DB + TMDB) -->
    <div v-else-if="results.length" class="space-y-3">
      <div
        v-for="r in results"
        :key="keyFor(r)"
        class="flex items-center justify-between border p-2 rounded"
      >
        <div class="flex items-center gap-2">
          <img
            v-if="r.poster"
            :src="r.poster"
            alt=""
            class="w-12 h-18 object-cover rounded"
          />
          <div>
            <div class="font-medium">
              {{ r.title }}
              <span class="text-xs text-gray-500 ml-2">
                {{ yearOf(r.releaseDate) }}
              </span>
            </div>
            <div
              class="text-xs"
              :class="r.id ? 'text-emerald-600' : 'text-sky-600'"
            >
              {{ r.id ? "Dans la base" : "TMDB" }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <select
            v-model="selectedCategories[keyFor(r)]"
            class="border rounded p-1 text-sm"
          >
            <option disabled value="">Catégorie</option>
            <option>Art et Essai</option>
            <option>Grand Public</option>
            <option>Jeunesse</option>
            <option>Documentaire</option>
          </select>
          <Button size="small" label="Choisir" @click="onChoose(r)" />
        </div>
      </div>
    </div>

    <div v-else-if="hasSearched" class="text-gray-500">Aucun film trouvé.</div>

    <!-- Fiche (optionnel) -->
    <div v-if="film" class="mt-6">
      <FilmVignette :film="film" />
    </div>

    <!-- Dialog destination quand autonome -->
    <Dialog
      v-model:visible="showDialog"
      modal
      header="Ajouter le film"
      :style="{ width: '420px' }"
    >
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-medium">Destination :</label>
          <div class="flex gap-2">
            <Button
              label="Sélection"
              :outlined="destination !== 'selection'"
              @click="destination = 'selection'"
            />
            <Button
              label="Liste"
              :outlined="destination !== 'list'"
              @click="destination = 'list'"
            />
          </div>
        </div>

        <div v-if="destination === 'selection'">
          <Dropdown
            v-model="selectionId"
            :options="selections"
            optionLabel="name"
            optionValue="id"
            placeholder="Choisir une sélection"
            class="w-full"
          />
        </div>

        <div v-else-if="destination === 'list'">
          <Dropdown
            v-model="listId"
            :options="lists"
            optionLabel="name"
            optionValue="id"
            placeholder="Choisir une liste"
            class="w-full"
          />
        </div>

        <div class="flex justify-end gap-2">
          <Button
            label="Annuler"
            severity="secondary"
            @click="showDialog = false"
          />
          <Button label="Valider" @click="confirmAdd" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Dialog from "primevue/dialog";
import FilmVignette from "~/components/FilmVignette.vue";

const { apiFetch } = useApi();
const { isAdmin } = useAuth();

const props = defineProps({
  selectionId: Number, // optionnel (mode intégré)
  listId: Number, // optionnel (mode intégré)
});

const query = ref("");
const loading = ref(false);
const hasSearched = ref(false);
const results = ref([]);
const film = ref(null); // film choisi (toujours DB après import)
const selectedCategories = ref({}); // clé = id (DB) ou tmdbId (TMDB) avant import

// Mode autonome
const showDialog = ref(false);
const destination = ref(null);
const selectionId = ref(props.selectionId || null);
const listId = ref(props.listId || null);
const selections = ref([]);
const lists = ref([]);
const pendingFilm = ref(null); // film choisi (avant/pendant import)

onMounted(async () => {
  // On peut précharger selections/lists pour le Dialog autonome
  if (isAdmin.value) {
    try {
      selections.value = await apiFetch("/selections");
      lists.value = await apiFetch("/lists");
    } catch (e) {
      console.warn("Chargement selections/lists:", e.message);
    }
  }
});

function keyFor(r) {
  return r.id ?? r.tmdbId;
}

function yearOf(d) {
  if (!d) return "";
  const s = typeof d === "string" ? d : new Date(d).toISOString();
  return s?.slice(0, 4) || "";
}

async function searchFilm() {
  if (!query.value.trim()) return;
  loading.value = true;
  hasSearched.value = true;
  results.value = [];
  film.value = null;

  try {
    // 1) DB
    let localRes = [];
    let tmdb = [];
    localRes = await apiFetch(
      `/films/search?q=${encodeURIComponent(query.value)}`
    );
    const local = localRes?.items || [];
    console.log("local", local?.length);
    // 2) TMDB (résultats simples, sans import)
    tmdb = await apiFetch(`/tmdb/search?q=${encodeURIComponent(query.value)}`);

    // On concatène (DB d’abord)
    results.value = [...(local || []), ...(tmdb || [])];
    console.log("résultats", results.value.length);
  } catch (err) {
    console.error("Erreur recherche:", err);
  } finally {
    loading.value = false;
  }
}

async function onChoose(r) {
  // r peut venir de DB (r.id défini) ou de TMDB (r.tmdbId seul)
  pendingFilm.value = r;

  try {
    // Si le film n’existe pas encore → importer maintenant
    if (!r.id && r.tmdbId) {
      const created = await apiFetch(`/import-one/${r.tmdbId}`);
      // created est le film DB complet (avec id)
      film.value = created;
      pendingFilm.value = created;
    } else {
      film.value = r;
    }

    // Si on a reçu une destination via props → ajout direct
    if (props.selectionId) {
      destination.value = "selection";
      selectionId.value = props.selectionId;
      return confirmAdd();
    }
    if (props.listId) {
      destination.value = "list";
      listId.value = props.listId;
      return confirmAdd();
    }

    // Sinon → mode autonome : demander destination
    destination.value = null;
    showDialog.value = true;
  } catch (e) {
    console.error("Choix/Import:", e);
    alert("Impossible d’importer ce film depuis TMDB.");
  }
}

async function confirmAdd() {
  const chosen = pendingFilm.value;
  if (!chosen) return;

  // Catégorie nécessaire pour une sélection
  const catKey = keyFor(chosen);
  const category = selectedCategories.value[catKey];
  if (destination.value === "selection" && !category) {
    alert("Merci de sélectionner une catégorie.");
    return;
  }

  try {
    const filmId = chosen.id; // garanti après import éventuel

    if (destination.value === "selection" && selectionId.value) {
      await apiFetch(`/selections/${selectionId.value}/add-film`, {
        method: "POST",
        body: { filmId, category },
      });
      alert(`Film "${chosen.title}" ajouté à la sélection.`);
    } else if (destination.value === "list" && listId.value) {
      await apiFetch(`/lists/${listId.value}/add-film`, {
        method: "POST",
        body: { filmId },
      });
      alert(`Film "${chosen.title}" ajouté à la liste.`);
    } else {
      alert("Destination invalide.");
      return;
    }
  } catch (err) {
    console.error("Erreur ajout film:", err);
    alert("Erreur lors de l'ajout.");
  } finally {
    showDialog.value = false;
    pendingFilm.value = null;
  }
}
</script>
