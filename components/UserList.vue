<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4">👥 Utilisateurs</h2>

    <div v-if="loading">Chargement...</div>
    <div v-else>
      <div
        v-for="user in users"
        :key="user.user_id"
        class="border p-2 mb-2 rounded flex justify-between items-center"
      >
        <div>
          <div class="font-semibold">{{ user.username }}</div>
          <div class="text-sm text-gray-500">{{ user.user_id }}</div>
        </div>
        <button
          @click="deleteUser(user.user_id)"
          class="text-red-600 hover:underline text-sm"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const config = useRuntimeConfig();
const users = ref([]);
const loading = ref(true);
const { apiFetch } = useApi();
const fetchUsers = async () => {
  loading.value = true;
  users.value = await apiFetch(`/users`);
  loading.value = false;
};

const deleteUser = async (userId) => {
  if (!confirm("Confirmer la suppression de cet utilisateur ?")) return;

  try {
    await apiFetch(`/users/${userId}`, {
      method: "DELETE",
    });
    users.value = users.value.filter((u) => u.user_id !== userId);
  } catch (e) {
    alert("Erreur lors de la suppression");
    console.error(e);
  }
};

onMounted(fetchUsers);
</script>
