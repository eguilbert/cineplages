<template>
  <div class="page">
    <h1>Gestion des tags films</h1>

    <div class="panel">
      <div class="row">
        <label>Mode</label>
        <select v-model="mode">
          <option value="selection">Sélection</option>
          <option value="single">Film solo</option>
        </select>
      </div>

      <div class="row" v-if="mode === 'selection'">
        <label>ID sélection</label>
        <div class="inline">
          <input
            v-model.number="selectionId"
            type="number"
            min="1"
            placeholder="ex: 12"
          />
          <button type="button" @click="loadSelection" :disabled="!selectionId">
            Charger
          </button>
        </div>
        <small class="muted"
          >Si tu as déjà un endpoint “liste des sélections”, on remplacera par
          un select.</small
        >
      </div>

      <div class="row" v-else>
        <label>Rechercher un film</label>
        <div class="inline">
          <input
            v-model="filmQuery"
            placeholder="Titre…"
            @input="debouncedSearch"
          />
          <select v-model.number="selectedFilmId">
            <option :value="0">—</option>
            <option v-for="f in filmResults" :key="f.id" :value="f.id">
              {{ f.title }}
            </option>
          </select>
          <button type="button" @click="loadSingle" :disabled="!selectedFilmId">
            Charger
          </button>
        </div>
      </div>

      <div class="mass" v-if="films.length">
        <h2>Appliquer un tag à tous les films affichés</h2>
        <TagPicker @pick="massAdd" />
        <div class="muted" v-if="massStatus">{{ massStatus }}</div>
      </div>
    </div>

    <div v-if="status" class="status">{{ status }}</div>

    <div v-if="films.length" class="grid">
      <FilmTagEditor
        v-for="f in films"
        :key="f.id"
        :film="f"
        :initial-tags="f.tags"
      />
    </div>

    <div v-else class="empty">Aucun film chargé.</div>
  </div>
</template>

<script setup lang="ts">
import FilmTagEditor from "~/components/Tagging/FilmTagEditor.vue";
import TagPicker from "~/components/Tagging/TagPicker.vue";

type FilmTagDTO = {
  id: number;
  label: string;
  category: string;
  validated: boolean;
};
type FilmLite = {
  id: number;
  title: string;
  posterUrl?: string | null;
  category?: string | null;
  tags?: FilmTagDTO[];
};

const { apiFetch } = useApi();
const { addTagsToFilm } = useFilmTagging();

const mode = ref<"selection" | "single">("selection");

const status = ref("");
const films = ref<FilmLite[]>([]);

// Mode selection
const selectionId = ref<number | null>(null);

// Mode single
const filmQuery = ref("");
const filmResults = ref<
  { id: number; title: string; posterUrl?: string | null }[]
>([]);
const selectedFilmId = ref<number>(0);
let searchTimer: any = null;

const debouncedSearch = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(searchFilms, 180);
};

const searchFilms = async () => {
  const q = filmQuery.value.trim();
  if (!q) {
    filmResults.value = [];
    selectedFilmId.value = 0;
    return;
  }

  const data = await apiFetch(
    `/films/search?q=${encodeURIComponent(q)}&page=1&pageSize=20`
  );
  const items = Array.isArray(data?.items) ? data.items : [];
  filmResults.value = items.map((f: any) => ({
    id: f.id,
    title: f.title,
    posterUrl: f.posterUrl,
  }));
};

const loadSelection = async () => {
  status.value = "Chargement sélection…";
  const data = await apiFetch(
    `/selections/${selectionId.value}/films?includeTags=1`
  );
  films.value = Array.isArray(data)
    ? data.map((x: any) => ({
        id: x.id,
        title: x.title,
        posterUrl: x.posterUrl,
        category: x.category,
        tags: x.tags || [],
      }))
    : [];
  status.value = "";
};

const loadSingle = async () => {
  status.value = "Chargement film…";
  // Si tu as déjà un endpoint film detail, utilise-le.
  // Ici on prend le film depuis la liste de résultats, puis on fetch les tags via FilmTagEditor.
  const film = filmResults.value.find((f) => f.id === selectedFilmId.value);
  films.value = film
    ? [{ id: film.id, title: film.title, posterUrl: film.posterUrl }]
    : [];
  status.value = "";
};

// Mass tagging
const massStatus = ref("");

const massAdd = async ({ tagId }: { tagId: number }) => {
  if (!tagId || !films.value.length) return;

  massStatus.value = `Ajout du tag #${tagId} sur ${films.value.length} films…`;

  // Simple et robuste (tu peux faire un endpoint bulk plus tard)
  for (const f of films.value) {
    try {
      await addTagsToFilm(f.id, [tagId]);
    } catch (e) {
      console.error(e);
    }
  }
  massStatus.value = "Terminé.";
};
</script>

<style scoped>
.page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.panel {
  border: 1px solid #ddd;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.inline {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 12px;
}
.status {
  opacity: 0.8;
}
.empty {
  opacity: 0.7;
  padding: 20px 0;
}
.mass {
  border-top: 1px solid #eee;
  padding-top: 12px;
  margin-top: 4px;
}
.muted {
  opacity: 0.7;
}
</style>
