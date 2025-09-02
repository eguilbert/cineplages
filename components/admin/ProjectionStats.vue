<template>
  <div class="space-y-6">
    <!-- KPI Cards -->
    <div class="grid md:grid-cols-4 gap-4">
      <div class="p-4 rounded-2xl shadow bg-white">
        <div class="text-sm text-gray-500">Séances</div>
        <div class="text-2xl font-semibold">{{ kpis.totalSessions }}</div>
      </div>
      <div class="p-4 rounded-2xl shadow bg-white">
        <div class="text-sm text-gray-500">Spectateurs</div>
        <div class="text-2xl font-semibold">{{ kpis.totalSpectators }}</div>
      </div>
      <div class="p-4 rounded-2xl shadow bg-white">
        <div class="text-sm text-gray-500">Films projetés</div>
        <div class="text-2xl font-semibold">{{ kpis.distinctFilms }}</div>
      </div>
      <div class="p-4 rounded-2xl shadow bg-white">
        <div class="text-sm text-gray-500">Cinémas actifs</div>
        <div class="text-2xl font-semibold">{{ kpis.distinctCinemas }}</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid md:grid-cols-2 gap-6">
      <div class="p-4 rounded-2xl shadow bg-white">
        <div class="font-medium mb-3">Séances par mois</div>
        <Chart
          type="line"
          :data="monthlySessionsData"
          :options="chartOptions"
        />
      </div>

      <div class="p-4 rounded-2xl shadow bg-white">
        <div class="font-medium mb-3">Top 10 films (spectateurs)</div>
        <Chart type="bar" :data="topFilmsData" :options="chartOptions" />
      </div>

      <div class="p-4 rounded-2xl shadow bg-white md:col-span-2">
        <div class="font-medium mb-3">Répartition par cinéma (spectateurs)</div>
        <Chart type="doughnut" :data="byCinemaData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "primevue/chart";
const { apiFetch } = useApi();

const props = defineProps({
  start: String, // optionnel: YYYY-MM-DD
  end: String, // optionnel: YYYY-MM-DD
});

const kpis = ref({
  totalSessions: 0,
  totalSpectators: 0,
  distinctFilms: 0,
  distinctCinemas: 0,
});
const monthlySessionsData = ref({
  labels: [],
  datasets: [{ label: "Séances", data: [] }],
});
const topFilmsData = ref({
  labels: [],
  datasets: [{ label: "Spectateurs", data: [] }],
});
const byCinemaData = ref({ labels: [], datasets: [{ data: [] }] });

const chartOptions = ref({
  maintainAspectRatio: false,
  plugins: { legend: { display: true } },
  scales: { x: { ticks: { autoSkip: true } }, y: { beginAtZero: true } },
});

async function load() {
  const params = new URLSearchParams();
  if (props.start) params.set("start", props.start);
  if (props.end) params.set("end", props.end);

  const base = "/projections/stats";
  const stats = await apiFetch(`${base}?${params.toString()}`);

  kpis.value = {
    totalSessions: stats.kpis.totalSessions,
    totalSpectators: stats.kpis.totalSpectators,
    distinctFilms: stats.kpis.distinctFilms,
    distinctCinemas: stats.kpis.distinctCinemas,
  };

  monthlySessionsData.value = {
    labels: stats.monthly.map((m) => m.label),
    datasets: [
      { label: "Séances", data: stats.monthly.map((m) => m.sessions) },
    ],
  };

  topFilmsData.value = {
    labels: stats.topFilms.map((t) => t.title),
    datasets: [
      { label: "Spectateurs", data: stats.topFilms.map((t) => t.spectators) },
    ],
  };

  byCinemaData.value = {
    labels: stats.byCinema.map((c) => c.cinema),
    datasets: [{ data: stats.byCinema.map((c) => c.spectators) }],
  };
}

onMounted(load);
</script>

<style scoped>
/* hauteur raisonnable pour les charts */
:deep(canvas) {
  height: 280px !important;
}
</style>
