<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Mon profil</h1>

    <div v-if="isAuthenticated">
      <p>Email : {{ user.email }}</p>
      <p>Rôle : {{ user.role }}</p>
      <p>Username : {{ user.username }}</p>
      <button
        @click="user.logout"
        class="mt-4 bg-red-500 text-white px-3 py-1 rounded"
      >
        Se déconnecter
      </button>
    </div>
    <div v-else>
      <p>Non connecté.</p>
    </div>
  </div>
</template>

<script setup>
const { user, isAuthenticated, isAdmin } = useAuth();
</script>
