<script setup>
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  films: Array,
});

const counts = computed(() => {
  const categories = {};
  for (const film of props.films) {
    const cat = film.category || "Non catégorisé";
    categories[cat] = (categories[cat] || 0) + 1;
  }
  return categories;
});

const chartData = computed(() => ({
  labels: Object.keys(counts.value),
  datasets: [
    {
      data: Object.values(counts.value),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#a3e635", "#f87171"],
    },
  ],
}));

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};
</script>

<template>
  <Pie :data="chartData" :options="options" />
</template>
