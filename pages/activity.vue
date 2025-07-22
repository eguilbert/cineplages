<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-xl font-bold mb-4">📋 Activité récente</h2>
    <div v-if="loading">Chargement...</div>
    <ul v-else class="space-y-2">
      <li
        v-for="log in activity"
        :key="log.id"
        class="border p-3 rounded bg-white shadow"
      >
        <div class="text-sm text-gray-600">
          {{ formatDate(log.createdAt) }}
        </div>
        <div>
          <strong>{{ log.user?.username || log.userId }}</strong> ·
          <span class="text-blue-600">{{ log.action }}</span>
          <span v-if="log.targetId"> → ID {{ log.targetId }}</span>
        </div>
        <div v-if="log.context" class="text-gray-700 text-sm italic mt-1">
          "{{ log.context }}"
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const config = useRuntimeConfig();
const activity = ref([]);
const loading = ref(true);

const fetchLogs = async () => {
  loading.value = true;
  activity.value = await $fetch(`${config.public.apiBase}/activity`);
  loading.value = false;
};

const formatDate = (d) =>
  new Date(d).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });

onMounted(fetchLogs);
</script>
