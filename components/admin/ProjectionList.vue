<template>
  <DataTable :value="projections" dataKey="id" :paginator="true" :rows="10">
    <Column field="date" header="Date" />
    <Column field="hour" header="Heure" />
    <Column field="film.title" header="Film" />
    <Column field="cinema.name" header="Cinéma" />
    <Column field="salle" header="Salle" />
    <Column field="audienceCount" header="Spectateurs" />
    <Column field="commentaire" header="Commentaire" />
    <Column header="Actions">
      <template #body="{ data }">
        <Button
          icon="pi pi-pencil"
          class="p-button-text"
          @click="$emit('edit', data)"
        />
        <Button
          icon="pi pi-trash"
          class="p-button-text p-button-danger"
          @click="deleteProjection(data.id)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, onMounted } from "vue";

const projections = ref([]);

async function load() {
  projections.value = await $fetch("/api/projections");
}

async function deleteProjection(id) {
  if (confirm("Supprimer cette projection ?")) {
    await $fetch(`/api/projections/${id}`, { method: "DELETE" });
    load();
  }
}

onMounted(load);
</script>
