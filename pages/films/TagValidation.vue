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

onMounted(async () => {
  const [all, existing] = await Promise.all([
    fetch(`${config.public.apiBase}/tags?validated=true`).then((res) =>
      res.json()
    ),
    /*     fetch(`http://localhost:4000/api/films/${props.filmId}/tags`).then((res) =>
      res.json()
    ), */
    fetch(`${config.public.apiBase}/films/49/tags`).then((res) => res.json()),
  ]);

  allTags.value = all;
  console.log(allTags.value);
  existingTags.value = existing;
  selectedTagIds.value = existing.map((tag) => tag.id);
});

async function saveTags() {
  await fetch(`${config.public.apiBase}/api/films/${props.filmId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tagIds: selectedTagIds.value }),
  });
  alert("Tags mis à jour");
}
</script>

<style scoped></style>

<!-- <template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-xl font-bold mb-4">Validation des tags suggérés</h2>

    <div
      v-for="(tag, index) in suggestedTags"
      :key="index"
      class="flex items-center gap-4 mb-2"
    >
      <InputText v-model="tag.label" class="flex-1" />
      <Dropdown
        v-model="tag.category"
        :options="categories"
        optionLabel="label"
        optionValue="value"
        placeholder="Catégorie"
      />
      <Button
        icon="pi pi-check"
        class="p-button-success"
        @click="validateTag(tag)"
      />
      <Button
        icon="pi pi-times"
        class="p-button-danger"
        @click="rejectTag(index)"
      />
    </div>

    <h3 class="mt-6 font-semibold">Tags validés :</h3>
    <ul class="list-disc pl-6">
      <li v-for="tag in validatedTags" :key="tag.label">
        {{ tag.label }} ({{ tag.category }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { InputText } from "primevue/inputtext";
import { Dropdown } from "primevue/dropdown";
import { Button } from "primevue/button";

const suggestedTags = ref([
  { label: "violence envers les femmes", category: "thematics" },
  { label: "thriller psychologique", category: "genres" },
  { label: "poétique", category: "styles" },
]);

const validatedTags = ref([]);

const categories = [
  { label: "Genres", value: "genres" },
  { label: "Thématiques", value: "thematics" },
  { label: "Styles", value: "styles" },
];

async function validateTag(tag) {
  await fetch(`/api/tags/${tag.id}/validate`, { method: "PATCH" });
  validatedTags.value.push(tag);
  suggestedTags.value = suggestedTags.value.filter((t) => t.id !== tag.id);
}

function rejectTag(index) {
  suggestedTags.value.splice(index, 1);
}
</script>

<style scoped></style>
 -->
