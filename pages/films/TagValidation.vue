<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-xl font-bold mb-4">
      Éditer les tags du film : {{ filmTitle }}
    </h2>

    <div class="mb-4">
      <MultiSelect
        v-model="selectedTagIds"
        :options="allTags"
        optionLabel="label"
        optionValue="id"
        filter
        display="chip"
        placeholder="Choisir des tags valides..."
        class="w-full"
      />
    </div>

    <div class="flex justify-end gap-2">
      <Button
        label="Sauvegarder"
        icon="pi pi-save"
        class="p-button-success"
        @click="saveTags"
      />
    </div>

    <h3 class="mt-6 font-semibold">Tags déjà associés :</h3>
    <ul class="list-disc pl-6">
      <li v-for="tag in existingTags" :key="tag.id">
        {{ tag.label }} ({{ tag.category }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";

const props = defineProps({
  filmId: Number,
  filmTitle: String,
});

const allTags = ref([]);
const selectedTagIds = ref([]);
const existingTags = ref([]);
const { apiFetch } = useApi();
onMounted(async () => {
  const [all, existing] = await Promise.all([
    apiFetch(`/tags?validated=true`).then((res) => res.json()),

    apiFetch(`/films/49/tags`).then((res) => res.json()),
  ]);

  allTags.value = all;
  console.log(allTags.value);
  existingTags.value = existing;
  selectedTagIds.value = existing.map((tag) => tag.id);
});

async function saveTags() {
  await apiFetch(`/api/films/${props.filmId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tagIds: selectedTagIds.value }),
  });
  alert("Tags mis à jour");
}
</script>

<style scoped></style>
