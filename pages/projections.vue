<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Programmation des films</h2>

    <!-- Dashboard synthétique -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <template #title>Total projections</template>
        <template #content>
          <p class="text-2xl font-bold">{{ stats.totalProjections }}</p>
        </template>
      </Card>
      <Card>
        <template #title>Total spectateurs</template>
        <template #content>
          <p class="text-2xl font-bold">{{ stats.totalSpectateurs }}</p>
        </template>
      </Card>
      <Card>
        <template #title>Spectateurs / projection</template>
        <template #content>
          <p class="text-2xl font-bold">{{ avgSpectateurs }}</p>
        </template>
      </Card>
    </div>
    <!-- <ProjectionStats class="block" /> -->
    <Panel header="Ajouter / Modifier une projection" toggleable>
      <ProjectionForm :model-value="selectedProjection" @saved="onSaved" />
    </Panel>

    <Panel header="Liste des projections existantes" toggleable>
      <DataTable
        :value="projections"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :sortField="'date'"
        :sortOrder="1"
      >
        <Column field="date" header="Date" sortable />
        <Column field="hour" header="Heure" sortable />
        <Column field="film.title" header="Film" sortable />
        <Column field="cinema.name" header="Cinéma" sortable />
        <Column field="salle" header="Salle" />
        <Column field="audienceCount" header="Spectateurs" />
        <Column field="commentaire" header="Commentaire" />
        <Column header="Actions">
          <template #body="{ data }">
            <Button
              icon="pi pi-pencil"
              class="p-button-text"
              @click="selectedProjection = data"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-danger"
              @click="deleteProjection(data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </Panel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ProjectionForm from "@/components/admin/ProjectionForm.vue";
import Panel from "primevue/panel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Card from "primevue/card";
import ProjectionStats from "@/components/admin/ProjectionStats.vue";
const { apiFetch } = useApi();
const projections = ref([]);
const selectedProjection = ref(null);

const stats = ref({
  totalProjections: 0,
  totalSpectateurs: 0,
});

const avgSpectateurs = computed(() => {
  if (stats.value.totalProjections === 0) return 0;
  return Math.round(
    stats.value.totalSpectateurs / stats.value.totalProjections
  );
});

async function loadProjections() {
  projections.value = await apiFetch("/projections");

  stats.value.totalProjections = projections.value.length;
  stats.value.totalSpectateurs = projections.value.reduce(
    (sum, p) => sum + (p.audienceCount || 0),
    0
  );
}

async function deleteProjection(id) {
  if (confirm("Supprimer cette projection ?")) {
    await apiFetch(`/projections/${id}`, { method: "DELETE" });
    loadProjections();
  }
}

function onSaved() {
  selectedProjection.value = null;
  loadProjections();
}

onMounted(loadProjections);
</script>

<style scoped>
.p-button-text {
  margin-right: 0.5rem;
}
</style>

<!-- ================================================== -->
<!-- Mise à jour ProjectionDashboard.vue pour le widget -->
<!-- ================================================== -->

<!-- Ajoute en haut du template, au-dessus du Panel formulaire: -->
<!-- <ProjectionStats class="block" /> -->

<!-- Et dans <script setup>: -->
<!-- import ProjectionStats from '@/components/admin/ProjectionStats.vue' -->
