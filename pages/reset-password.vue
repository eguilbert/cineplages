<script setup>
const supabase = useSupabaseClient();
const password = ref("");
const success = ref(false);
const errorMessage = ref("");
const loading = ref(true);
const session = useSupabaseUser(); // ✅ sera mis à jour automatiquement

onMounted(async () => {
  const { error } = await supabase.auth.getSessionFromUrl({
    storeSession: true,
  });

  if (error) {
    console.error("Erreur getSessionFromUrl:", error.message);
    errorMessage.value = "Lien invalide ou expiré.";
  }

  loading.value = false;
});

const resetPassword = async () => {
  const { error } = await supabase.auth.updateUser({
    password: password.value,
  });

  if (error) {
    errorMessage.value = error.message;
  } else {
    success.value = true;
    setTimeout(() => navigateTo("/login"), 3000);
  }
};
</script>

<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="text-xl font-bold mb-4">Réinitialisation du mot de passe</h1>

    <div v-if="loading">Chargement...</div>

    <div v-else-if="errorMessage">
      <p class="text-red-600">{{ errorMessage }}</p>
    </div>

    <div v-else>
      <form @submit.prevent="resetPassword" class="space-y-4">
        <input
          type="password"
          v-model="password"
          placeholder="Nouveau mot de passe"
          class="border px-4 py-2 w-full rounded"
          required
        />
        <button class="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Réinitialiser
        </button>

        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
        <p v-if="success" class="text-green-500">Mot de passe mis à jour !</p>
      </form>
    </div>
  </div>
</template>
