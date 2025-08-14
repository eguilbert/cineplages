<template>
  <div class="space-y-2">
    <!-- Autocomplete ajout libre -->
    <textarea
      v-model="commentaire"
      class="w-full border p-2"
      placeholder="Notes"
    />
    <AutoComplete
      v-model="newTag"
      :suggestions="suggestions"
      @complete="searchTags"
      placeholder="Ajouter un tag"
      @keydown.enter.prevent="addTagFromInput"
      class="w-full"
    >
      <template #footer>
        <div class="p-2 text-sm text-gray-400">
          Appuyez sur Entrée pour ajouter « {{ newTag }} »
        </div>
      </template>
    </AutoComplete>

    <!-- Tags existants -->
    <div class="flex flex-wrap gap-2">
      <Chip
        v-for="tag in selectedTags"
        :key="tag"
        :label="tag"
        removable
        @remove="removeTag(tag)"
        class="bg-blue-100 text-blue-800"
      />
    </div>

    <!-- Sauvegarde -->
    <Button label="💾 Sauvegarder" @click="saveTags" class="mt-2" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import AutoComplete from "primevue/autocomplete";
import Chip from "primevue/chip";
import Button from "primevue/button";
const { apiFetch } = useApi();
const props = defineProps({
  filmId: Number,
  initialTags: Array,
});

const newTag = ref("");
const commentaire = ref("");
const suggestions = ref([]);
const selectedTags = ref([...props.initialTags]);
const config = useRuntimeConfig();

const searchTags = async (e) => {
  if (!e.query || e.query.length < 2) return;
  const results = await apiFetch(`/tags/search`, {
    params: { q: e.query },
  });
  suggestions.value = results.map((t) => t.label);
};

const addTagFromInput = () => {
  const tag = newTag.value.trim();
  if (tag && !selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
  }
  newTag.value = "";
};

const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag);
};

const saveTags = async () => {
  await apiFetch(`/films/${props.filmId}/tags`, {
    method: "PUT",
    body: {
      tags: selectedTags.value,
      commentaire: commentaire.value,
      category: "thematics", // ou "styles", "genres", etc.
    },
  });
};
</script>
