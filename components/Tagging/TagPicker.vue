<template>
  <div class="tag-picker">
    <div class="row">
      <label>Catégorie</label>
      <select v-model="selectedCategory" @change="onCategoryChanged">
        <option value="">—</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div class="row" v-if="selectedCategory">
      <label>Tag existant</label>
      <input v-model="search" placeholder="Rechercher…" @input="onSearch" />
      <select v-model.number="selectedTagId">
        <option :value="0">—</option>
        <option v-for="t in tags" :key="t.id" :value="t.id">
          {{ t.label }} <span v-if="!t.validated"></span>
        </option>
      </select>
    </div>

    <div class="row" v-if="selectedCategory">
      <label>Ou créer</label>
      <div class="inline">
        <input v-model="newLabel" placeholder="Nouveau tag…" />
        <button type="button" @click="create" :disabled="!canCreate">
          Créer
        </button>
      </div>
      <small v-if="createInfo" class="muted">{{ createInfo }}</small>
    </div>

    <div class="row actions">
      <button type="button" @click="emitPick" :disabled="!selectedTagId">
        Ajouter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type FilmTagDTO = {
  id: number;
  label: string;
  category: string;
  validated: boolean;
  alreadyExisted?: boolean;
};

const emit = defineEmits<{
  (e: "pick", payload: { tagId: number; tag?: FilmTagDTO }): void;
}>();

const { categories, fetchCategories, fetchTags, createTag } =
  useFilmTagCatalog();

const selectedCategory = ref<string>("");
const tags = ref<FilmTagDTO[]>([]);
const selectedTagId = ref<number>(0);

const search = ref("");
let searchTimer: any = null;

const newLabel = ref("");
const createInfo = ref("");

const canCreate = computed(
  () => !!selectedCategory.value && !!newLabel.value.trim()
);

onMounted(async () => {
  await fetchCategories();
});

const onCategoryChanged = async () => {
  selectedTagId.value = 0;
  search.value = "";
  newLabel.value = "";
  createInfo.value = "";
  tags.value = await fetchTags(selectedCategory.value);
};

const onSearch = async () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    if (!selectedCategory.value) return;
    tags.value = await fetchTags(selectedCategory.value, search.value.trim());
  }, 150);
};

const create = async () => {
  createInfo.value = "";
  const label = newLabel.value.trim();
  if (!label || !selectedCategory.value) return;

  const tag = await createTag(label, selectedCategory.value);

  // si alreadyExisted, prévenir (label unique global)
  if (tag?.alreadyExisted) {
    createInfo.value = `Ce tag existait déjà (catégorie: ${tag.category}).`;
  } else {
    createInfo.value = "Tag créé (à valider).";
  }

  // recharge tags de la catégorie courante (ou garde cache)
  tags.value = await fetchTags(selectedCategory.value);
  selectedTagId.value = tag.id;
};

const emitPick = () => {
  const tag = tags.value.find((t) => t.id === selectedTagId.value);
  emit("pick", { tagId: selectedTagId.value, tag });
  // reset seulement la sélection, garde la catégorie pour tagger vite
  selectedTagId.value = 0;
  newLabel.value = "";
  createInfo.value = "";
};
</script>

<style scoped>
.tag-picker {
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 10px;
}
.row {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.inline {
  display: flex;
  gap: 8px;
}
.actions {
  margin-top: 8px;
}
.muted {
  opacity: 0.7;
}
</style>
