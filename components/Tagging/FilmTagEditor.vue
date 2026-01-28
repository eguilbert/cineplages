<template>
  <div class="film-editor">
    <div class="head">
      <div class="title">
        <strong>{{ film.title }}</strong>
        <span class="meta" v-if="film.category">· {{ film.category }}</span>
      </div>

      <button type="button" class="small" @click="reload">Rafraîchir</button>
    </div>

    <div v-if="groupedTagsKeys.length" class="tags">
      <div v-for="cat in groupedTagsKeys" :key="cat" class="tag-group">
        <div class="cat">{{ cat }}</div>
        <div class="chips">
          <span
            v-for="t in groupedTags[cat]"
            :key="t.id"
            class="chip"
            :title="t.validated ? '' : 'à valider'"
          >
            {{ t.label }}<span v-if="!t.validated"> *</span>
            <button type="button" class="x" @click="remove(t.id)">×</button>
          </span>
        </div>
      </div>
    </div>
    <div v-else class="empty">Aucun tag.</div>

    <TagPicker @pick="onPick" />

    <div class="status" v-if="status">{{ status }}</div>
  </div>
</template>

<script setup lang="ts">
import TagPicker from "./TagPicker.vue";

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
};

const props = defineProps<{
  film: FilmLite;
  initialTags?: FilmTagDTO[];
}>();

const { getFilmTags, addTagsToFilm, removeTagFromFilm } = useFilmTagging();

const tags = ref<FilmTagDTO[]>(props.initialTags || []);
const status = ref("");

const groupedTags = computed<Record<string, FilmTagDTO[]>>(() => {
  const map: Record<string, FilmTagDTO[]> = {};
  for (const t of tags.value) {
    const cat = t.category || "Autres";
    map[cat] = map[cat] || [];
    map[cat].push(t);
  }
  for (const k of Object.keys(map)) {
    map[k] = map[k].slice().sort((a, b) => a.label.localeCompare(b.label));
  }
  return map;
});

const groupedTagsKeys = computed(() =>
  Object.keys(groupedTags.value).sort((a, b) => a.localeCompare(b))
);

const reload = async () => {
  status.value = "Chargement…";
  tags.value = await getFilmTags(props.film.id);
  status.value = "";
};

const onPick = async ({ tagId }: { tagId: number }) => {
  status.value = "Ajout…";
  tags.value = await addTagsToFilm(props.film.id, [tagId]);
  status.value = "";
};

const remove = async (tagId: number) => {
  status.value = "Suppression…";
  await removeTagFromFilm(props.film.id, tagId);
  tags.value = tags.value.filter((t) => t.id !== tagId);
  status.value = "";
};

onMounted(async () => {
  if (!tags.value.length) await reload();
});
</script>

<style scoped>
.film-editor {
  border: 1px solid #ddd;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.title {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.meta {
  opacity: 0.7;
  font-size: 0.9em;
}
.tags {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tag-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cat {
  font-weight: 600;
  opacity: 0.9;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  background: #f3f3f3;
  border-radius: 999px;
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.x {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  opacity: 0.6;
}
.x:hover {
  opacity: 1;
}
.small {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}
.empty {
  opacity: 0.7;
}
.status {
  opacity: 0.7;
  font-size: 0.9em;
}
</style>
