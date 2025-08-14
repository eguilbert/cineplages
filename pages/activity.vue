<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-xl font-bold mb-4">📋 Activité récente</h2>

    <!-- 🔍 Filtres -->
    <div class="mb-4 flex flex-wrap gap-4 items-end">
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Utilisateur</label
        >
        <select v-model="selectedUser" class="input">
          <option value="">Tous</option>
          <option v-for="user in uniqueUsers" :key="user" :value="user">
            {{ user }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Action</label>
        <select v-model="selectedAction" class="input">
          <option value="">Toutes</option>
          <option v-for="action in uniqueActions" :key="action" :value="action">
            {{ action }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Depuis</label>
        <input type="date" v-model="selectedDate" class="input" />
      </div>
    </div>

    <!-- 📄 Liste des logs -->
    <div v-if="loading">Chargement...</div>
    <ul v-else class="space-y-2">
      <li
        v-for="log in paginatedActivity"
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
    <!-- 🔢 Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex justify-between items-center mt-6 text-sm"
    >
      <button
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        @click="prevPage"
        :disabled="currentPage === 1"
      >
        ◀ Précédent
      </button>
      <span> Page {{ currentPage }} / {{ totalPages }} </span>
      <button
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        @click="nextPage"
        :disabled="currentPage === totalPages"
      >
        Suivant ▶
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const config = useRuntimeConfig();
const activity = ref([]);
const loading = ref(true);

// Filtres
const selectedUser = ref("");
const selectedAction = ref("");
const selectedDate = ref("");
const perPage = ref(10);
const currentPage = ref(1);
const { apiFetch } = useApi();
const paginatedActivity = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredActivity.value.slice(start, start + perPage.value);
});

const totalPages = computed(() =>
  Math.ceil(filteredActivity.value.length / perPage.value)
);

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

// 🧠 Filtres uniques
const uniqueUsers = computed(() =>
  [...new Set(activity.value.map((a) => a.user?.username || a.userId))].sort()
);
const uniqueActions = computed(() =>
  [...new Set(activity.value.map((a) => a.action))].sort()
);

// 💡 Liste filtrée dynamiquement
const filteredActivity = computed(() =>
  activity.value.filter((a) => {
    const userMatch =
      !selectedUser.value ||
      (a.user?.username || a.userId) === selectedUser.value;
    const actionMatch =
      !selectedAction.value || a.action === selectedAction.value;
    const dateMatch =
      !selectedDate.value ||
      new Date(a.createdAt) >= new Date(selectedDate.value);
    return userMatch && actionMatch && dateMatch;
  })
);

const fetchLogs = async () => {
  loading.value = true;
  activity.value = await apiFetch(`/activity`);
  loading.value = false;
};

const formatDate = (d) =>
  new Date(d).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });

onMounted(fetchLogs);
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
}
</style>
