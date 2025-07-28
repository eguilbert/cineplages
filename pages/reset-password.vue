<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-xl font-bold mb-4">Nouveau mot de passe</h1>

    <div v-if="!user">
      <p>Connexion en cours...</p>
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
        <button class="bg-blue-600 text-white px-4 py-2 rounded">
          Réinitialiser
        </button>
      </form>

      <p v-if="message" class="text-green-600 mt-4">{{ message }}</p>
      <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();

const newPassword = ref("");
const message = ref("");
const error = ref("");

onMounted(async () => {
  const hash = route.fullPath.split("#")[1];
  if (!user.value && hash) {
    await supabase.auth.getSessionFromUrl({ storeSession: true });
  }
});

const handleReset = async () => {
  const { error: pwError } = await supabase.auth.updateUser({
    password: newPassword.value,
  });

  if (pwError) {
    error.value = pwError.message;
  } else {
    message.value = "Mot de passe mis à jour.";
  }
};
</script>
