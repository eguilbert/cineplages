<template>
  <div class="p-6 space-y-8">
    <!-- Filtres -->
    <div class="flex flex-wrap items-end gap-4">
      <div class="flex flex-col">
        <label class="text-sm mb-1">Début</label>
        <Calendar v-model="startDate" showIcon dateFormat="yy-mm-dd" />
      </div>
      <div class="flex flex-col">
        <label class="text-sm mb-1">Fin</label>
        <Calendar v-model="endDate" showIcon dateFormat="yy-mm-dd" />
      </div>
    </div>

    <!-- 1) Fréquentation par jour de la semaine -->
    <section>
      <h2 class="text-xl font-bold mb-2">
        Fréquentation par jour de la semaine
      </h2>
      <Chart type="bar" :data="attendanceByWeekday" :options="barOptions" />
    </section>

    <!-- 2) Évolution quotidienne -->
    <section>
      <h2 class="text-xl font-bold mb-2">Évolution quotidienne</h2>
      <Chart type="line" :data="attendanceByDay" :options="lineOptions" />
    </section>

    <!-- 3) Jour × créneau horaire (barres empilées) -->
    <section>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold mb-2">Jour × créneau horaire</h2>
        <div class="text-sm opacity-75">
          🔥 Meilleur :
          <strong v-if="bestTimeslot">{{ bestTimeslot.label }}</strong>
          <span v-if="bestTimeslot"> ({{ bestTimeslot.value }} spect.)</span>
          <span class="mx-2">•</span>
          😬 Pire :
          <strong v-if="worstTimeslot">{{ worstTimeslot.label }}</strong>
          <span v-if="worstTimeslot"> ({{ worstTimeslot.value }} spect.)</span>
        </div>
      </div>
      <Chart
        type="bar"
        :data="attendanceByDayTimeslot"
        :options="stackedBarOptions"
      />
    </section>

    <!-- 4) Par Catégorie / Nationalité / Genre (via projection.film.*) -->
    <section>
      <h2 class="text-xl font-bold mb-2">
        Fréquentation par
        <span class="capitalize">{{ currentDimensionLabel }}</span>
      </h2>
      <!-- <Chart
        :type="dimensionChartType"
        :data="attendanceByDimension"
        :options="barOptions"
      /> -->
      <div class="flex flex-col">
        <label class="text-sm mb-1">Dimension</label>
        <Dropdown
          v-model="analysisDimension"
          :options="dimensionOptions"
          optionLabel="label"
          optionValue="value"
          class="min-w-[220px]"
          style="max-width: 300px"
        />
      </div>
      <Chart
        type="pie"
        :data="attendanceByDimension"
        class="w-full md:w-[30rem]"
      />
    </section>
    End Proj stats
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Chart from "primevue/chart";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";

/**
 * Props attendue :
 * projections: Array<{
 *   id: number,
 *   date: string | Date,            // inclut l'heure si possible
 *   audienceCount: number | null,
 *   film?: { category?: string, origin?: string, genre?: string }
 * }>
 */
const props = defineProps({
  projections: { type: Array, default: () => [] },
});

/* ---------- Utilitaires ---------- */

// Dernier mois complet (ex: si on est en sept, retourne 1er→31 août)
function getLastFullMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  // normaliser à 00:00 et 23:59 pour la comparaison
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// Créneaux horaires
function getTimeslot(dateInput) {
  const d = new Date(dateInput);
  const h = d.getHours();
  const m = d.getMinutes();
  const hm = h + m / 60;

  if (hm >= 14 && hm < 16) return "Début PM (14–16)";
  // “Fin PM (16h30–18h)” → on démarre à 16.5
  if (hm >= 16.5 && hm < 19) return "Fin PM (16h30–18h)";
  if (hm >= 19) return "Soirée (≥19h)";
  return "Autres";
}

const WEEKDAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
function weekdayIndexFromDate(d) {
  // JS: 0 = Dimanche…6 = Samedi → on veut 0 = Lundi…6 = Dimanche
  const js = d.getDay(); // 0..6
  return js === 0 ? 6 : js - 1;
}

/* ---------- Filtres dates (défaut = dernier mois complet) ---------- */

const { start, end } = getLastFullMonthRange();
const startDate = ref(start);
const endDate = ref(end);

/* ---------- Données filtrées ---------- */

const filteredProjections = computed(() => {
  const s = startDate.value ? new Date(startDate.value) : null;
  const e = endDate.value ? new Date(endDate.value) : null;
  return (props.projections || []).filter((p) => {
    const d = new Date(p.date);
    if (s && d < s) return false;
    if (e && d > e) return false;
    return true;
  });
});

/* ---------- 1) Fréquentation par jour de la semaine ---------- */

const attendanceByWeekday = computed(() => {
  const totals = Array(7).fill(0);
  filteredProjections.value.forEach((p) => {
    if (p.audienceCount != null) {
      const idx = weekdayIndexFromDate(new Date(p.date));
      totals[idx] += p.audienceCount;
    }
  });
  return {
    labels: WEEKDAYS,
    datasets: [
      {
        label: "Spectateurs",
        data: totals,
      },
    ],
  };
});

/* ---------- 2) Évolution quotidienne ---------- */

const attendanceByDay = computed(() => {
  const map = {};
  filteredProjections.value.forEach((p) => {
    if (p.audienceCount != null) {
      const day = new Date(p.date).toISOString().slice(0, 10); // yyyy-mm-dd
      map[day] = (map[day] || 0) + p.audienceCount;
    }
  });
  const labels = Object.keys(map).sort();
  const data = labels.map((d) => map[d]);
  return {
    labels,
    datasets: [
      {
        label: "Spectateurs par jour",
        data,
        fill: true,
        tension: 0.3,
      },
    ],
  };
});

/* ---------- 3) Jour × créneau horaire (barres empilées) ---------- */

const TIMESLOTS = ["Début PM (14–16)", "Fin PM (16h30–18h)", "Soirée (≥19h)"];

const attendanceByDayTimeslot = computed(() => {
  const matrix = Array(7)
    .fill(0)
    .map(() => Object.fromEntries(TIMESLOTS.map((s) => [s, 0])));

  filteredProjections.value.forEach((p) => {
    if (p.audienceCount != null) {
      const wd = weekdayIndexFromDate(new Date(p.date));
      const slot = getTimeslot(p.date);
      if (TIMESLOTS.includes(slot)) {
        matrix[wd][slot] += p.audienceCount;
      }
    }
  });

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981"]; // 1 couleur par slot
  const datasets = TIMESLOTS.map((slot, i) => ({
    label: slot,
    data: matrix.map((row) => row[slot]),
    backgroundColor: COLORS[i],
  }));

  return { labels: WEEKDAYS, datasets };
});

// Meilleur / pire créneau (toutes journées confondues)
const bestTimeslot = computed(() => {
  const totals = Object.fromEntries(TIMESLOTS.map((s) => [s, 0]));
  filteredProjections.value.forEach((p) => {
    if (p.audienceCount != null) {
      const slot = getTimeslot(p.date);
      if (TIMESLOTS.includes(slot)) totals[slot] += p.audienceCount;
    }
  });
  const entries = Object.entries(totals);
  if (!entries.length) return null;
  const [label, value] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  return { label, value };
});

const worstTimeslot = computed(() => {
  const totals = Object.fromEntries(TIMESLOTS.map((s) => [s, 0]));
  filteredProjections.value.forEach((p) => {
    if (p.audienceCount != null) {
      const slot = getTimeslot(p.date);
      if (TIMESLOTS.includes(slot)) totals[slot] += p.audienceCount;
    }
  });
  const entries = Object.entries(totals);
  if (!entries.length) return null;
  const [label, value] = entries.reduce((a, b) => (b[1] < a[1] ? b : a));
  return { label, value };
});

/* ---------- 4) Par Catégorie / Nationalité / Genre (via projection.film.*) ---------- */

const dimensionOptions = [
  { label: "Catégorie", value: "category" },
  { label: "Nationalité", value: "origin" },
  { label: "Genre", value: "genre" },
];
const analysisDimension = ref("category");

const currentDimensionLabel = computed(
  () =>
    dimensionOptions.find((o) => o.value === analysisDimension.value)?.label ||
    ""
);

// Barres par défaut (tu peux passer à "pie" si tu préfères)
const dimensionChartType = "bar";
function getColorPalette(n) {
  const COLORS = [
    "#3b82f6", // bleu
    "#f59e0b", // orange
    "#10b981", // vert
    "#ef4444", // rouge
    "#8b5cf6", // violet
    "#6366f1", // indigo
    "#ec4899", // rose
    "#14b8a6", // turquoise
    "#84cc16", // lime
    "#f97316", // orange foncé
  ];
  return Array.from({ length: n }, (_, i) => COLORS[i % COLORS.length]);
}
const attendanceByDimension = computed(() => {
  const map = {};
  filteredProjections.value.forEach((p) => {
    if (p.audienceCount != null) {
      const dim = p.film?.[analysisDimension.value] || "Inconnu"; // p.film.category / origin / genre
      map[dim] = (map[dim] || 0) + p.audienceCount;
    }
  });
  const labels = Object.keys(map);
  const data = labels.map((k) => map[k]);
  const colors = getColorPalette(labels.length);

  return {
    labels,
    datasets: [
      {
        label: "Spectateurs",
        data,
        backgroundColor: colors,
      },
    ],
  };
});

/* ---------- Options Chart.js simples ---------- */

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { stacked: false, ticks: { autoSkip: false } },
    y: { beginAtZero: true },
  },
};

const stackedBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "top" } },
  scales: {
    x: { stacked: true, ticks: { autoSkip: false } },
    y: { stacked: true, beginAtZero: true },
  },
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { autoSkip: true, maxTicksLimit: 12 } },
    y: { beginAtZero: true },
  },
};

/* ---------- Réactivité pratique ---------- */

// Si l'utilisateur inverse les dates par erreur, on corrige gentiment
watch([startDate, endDate], ([s, e]) => {
  if (s && e && new Date(s) > new Date(e)) {
    // échange
    const tmp = new Date(s);
    startDate.value = new Date(e);
    endDate.value = tmp;
  }
});
</script>

<style scoped>
/* Donne un peu de hauteur aux charts pour l'affichage */
section :deep(canvas) {
  max-height: 360px;
}
</style>
