<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Projections des films</h2>

    <!-- Dashboard synthétique -->
    <div class="flex flex-col gap-4">
      <!-- Choix période -->
      <div class="flex-row gap-4">
        <Calendar
          v-model="startDate"
          placeholder="Date de début"
          showIcon
          dateFormat="yy-mm-dd"
        />
        <Calendar
          v-model="endDate"
          placeholder="Date de fin"
          showIcon
          dateFormat="yy-mm-dd"
        />
      </div>

      <!-- Table triable -->
      <DataTable :value="filmStats" paginator :rows="10" sortMode="multiple">
        <Column field="title" header="Film" sortable />
        <Column field="seances" header="Séances" sortable />
        <Column field="spectateurs" header="Spectateurs" sortable />
        <Column field="ratio" header="Moyenne / séance" sortable />
      </DataTable>

      <!-- Graphique par jour de semaine -->
      <div class="flex flex-col md:flex-row gap-4">
        <div>
          <h2 class="text-xl font-bold mb-2">
            Fréquentation par jour de la semaine
          </h2>
          <Chart type="bar" :data="attendanceByWeekday" />
        </div>

        <!-- Graphique par catégorie -->
        <div>
          <h2 class="text-xl font-bold mb-2">Fréquentation par catégorie</h2>
          <Chart
            type="pie"
            :data="attendanceByCategory"
            class="w-full md:w-[30rem]"
          />
        </div>
      </div>

      <!-- Stats globales -->
      <!--  <div class="mb-4">
        <p>Total projections : {{ stats.totalProjections }}</p>
        <p>Total spectateurs : {{ stats.totalSpectateurs }}</p>
        <p>Moyenne spectateurs : {{ stats.avgSpectateurs }}</p>
      </div> -->
    </div>
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
import Calendar from "primevue/calendar";
import Chart from "primevue/chart";
import ProjectionStats from "@/components/admin/ProjectionStats.vue";
import { useToast } from "primevue/usetoast";
const { apiFetch } = useApi();
const projections = ref([]);
const selectedProjection = ref(null);
const toast = useToast();
/* const stats = ref({
  totalProjections: 0,
  totalSpectateurs: 0,
}); */

const avgSpectateurs = computed(() => {
  if (stats.value.totalProjections === 0) return 0;
  return Math.round(
    stats.value.totalSpectateurs / stats.value.totalProjections
  );
});

async function loadProjections() {
  projections.value = await apiFetch("/projections");

  stats.value.totalProjections = projections.value.filter(
    (p) => p.audienceCount != null
  ).length;
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
  toast.add({
    severity: "success", // "info", "warn", "error"
    summary: "Projection enregistrée",
    detail: "",
    life: 2000,
  });
  selectedProjection.value = null;
  loadProjections();
}
// Dates choisies
const startDate = ref(null);
const endDate = ref(null);

// Filtrer par période choisie
const filteredProjections = computed(() => {
  return projections.value.filter((p) => {
    const d = new Date(p.date);
    if (startDate.value && d < new Date(startDate.value)) return false;
    if (endDate.value && d > new Date(endDate.value)) return false;
    return true;
  });
});
// Projections filtrées

// Stats globales
const stats = computed(() => {
  const valid = filteredProjections.value.filter(
    (p) => p.audienceCount != null
  );
  const totalProjections = valid.length;
  const totalSpectateurs = valid.reduce(
    (sum, p) => sum + (p.audienceCount || 0),
    0
  );

  return {
    totalProjections,
    totalSpectateurs,
    avgSpectateurs:
      totalProjections > 0
        ? Math.round(totalSpectateurs / totalProjections)
        : 0,
  };
});

// Ratios par film
// Calculer stats par film
const filmStats = computed(() => {
  const map = {};
  for (const p of filteredProjections.value) {
    if (!map[p.filmId]) {
      map[p.filmId] = { title: p.film.title, seances: 0, spectateurs: 0 };
    }
    if (p.audienceCount != null) {
      map[p.filmId].seances += 1;
      map[p.filmId].spectateurs += p.audienceCount;
    }
  }
  return Object.values(map).map((f) => ({
    ...f,
    ratio: f.seances > 0 ? Math.round(f.spectateurs / f.seances) : 0,
  }));
});

// --- Fréquentation par jour de la semaine
const weekdays = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
const attendanceByWeekday = computed(() => {
  const totals = Array(7).fill(0);
  filteredProjections.value.forEach((p) => {
    if (p.audienceCount != null) {
      const day = new Date(p.date).getDay(); // 0=Dimanche, 1=Lundi...
      const idx = day === 0 ? 6 : day - 1; // convertir en Lundi=0
      totals[idx] += p.audienceCount;
    }
  });
  return {
    labels: weekdays,
    datasets: [
      {
        label: "Spectateurs",
        data: totals,
        backgroundColor: "#3b82f6", // bleu Tailwind
      },
    ],
  };
});

// --- Fréquentation par catégorie
const attendanceByCategory = computed(() => {
  const map = {};
  filteredProjections.value.forEach((p) => {
    if (p.audienceCount != null) {
      map[p.film.category] = (map[p.film.category] || 0) + p.audienceCount;
    }
  });
  return {
    labels: Object.keys(map),
    datasets: [
      {
        label: "Spectateurs",
        data: Object.values(map),
        backgroundColor: [
          "#ef4444",
          "#f59e0b",
          "#10b981",
          "#3b82f6",
          "#8b5cf6",
        ],
      },
    ],
  };
});

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
