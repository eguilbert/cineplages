<template>
  <div v-if="selection" class="border p-4 rounded shadow-sm bg-white mt-4">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-bold">{{ selection.name }}</h3>
      <Button
        icon="pi pi-trash"
        class="p-button-danger p-button-sm"
        @click="deleteSelection"
      />
    </div>

    <p class="text-sm text-gray-500 mb-4">
      Créée le {{ new Date(selection.date_created).toLocaleDateString() }} —
      {{ selection.films.length }} film(s)
    </p>

    <ul class="space-y-2 max-h-96 overflow-y-auto">
      <li
        v-for="(film, index) in selection.films"
        :key="index"
        class="border p-2 rounded"
      >
        <strong>{{ film.title }}</strong>
        <small class="block text-gray-500 text-sm">
          {{ film.genre }} — {{ film.release_date }}
        </small>
      </li>
    </ul>
  </div>
</template>

<script setup>
import Button from "primevue/button";
const emit = defineEmits(["deleted"]);
const props = defineProps({
  selection: Object,
});

const deleteSelection = async () => {
  if (!confirm(`Supprimer la sélection « ${props.selection.name} » ?`)) return;

  await fetch(`http://localhost:4000/api/selections/${props.selection.id}`, {
    method: "DELETE",
  });

  emit("deleted", props.selection.id);
};
</script>
