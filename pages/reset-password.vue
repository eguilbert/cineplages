<!-- pages/reset-password.vue -->
<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-xl font-bold mb-4">Réinitialisation du mot de passe</h1>

    <div v-if="loading">
      <p>Chargement...</p>
    </div>

    <div v-else-if="!session">
      <p class="text-red-600">Lien invalide ou expiré.</p>
    </div>

    <div v-else>
      <form @submit.prevent="handleReset">
        <input
          v-model="newPassword"
          type="password"
          placeholder="Nouveau mot de passe"
          class="border p-2 w-full mb-4"
          required
        />
        <button class="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Réinitialiser le mot de passe
        </button>
      </form>

      <p v-if="success" class="text-green-600 mt-4">
        Mot de passe modifié. Redirection...
      </p>
      <p v-if="errorMsg" class="text-red-600 mt-4">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const password = ref("");
const success = ref(false);
const errorMsg = ref("");

const handleReset = async () => {
  const { error } = await supabase.auth.updateUser({
    password: password.value,
  });

  if (error) {
    errorMsg.value = error.message;
  } else {
    success.value = true;
    setTimeout(() => navigateTo("/login"), 2000);
  }
};
</script>
