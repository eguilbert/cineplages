<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();

const password = ref("");
const success = ref(false);
const error = ref("");
const loading = ref(true);

// ⏳ Attendre la récupération de session via l'URL
onMounted(async () => {
  const { data, error } = await supabase.auth.getSessionFromUrl({
    storeSession: true,
  });

  if (error) {
    errorMessage.value = "Lien invalide ou expiré.";
    return;
  }


const resetPassword = async () => {
  const { error: updateError } = await supabase.auth.updateUser({
    password: password.value,
  });

  if (updateError) {
    error.value = updateError.message;
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

    <div v-else-if="!user">
      <p class="text-red-600">Lien invalide ou expiré.</p>
    </div>

    <div v-else>
      <form @submit.prevent="resetPassword" class="space-y-4">
        <input
          type="password"
          v-model="password"
          placeholder="Nouveau mot de passe"
          class="border px-4 py-2 w-full rounded"
        />
        <button class="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Réinitialiser
        </button>

        <p v-if="error" class="text-red-500">{{ error }}</p>
        <p v-if="success" class="text-green-500">Mot de passe mis à jour !</p>
      </form>
    </div>
  </div>
</template>
