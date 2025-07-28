<template>
  <div class="p-6 max-w-md mx-auto mt-10 space-y-4">
    <h1 class="text-2xl font-bold mb-4">🔑 Réinitialiser votre mot de passe</h1>

    <div v-if="!isComplete" class="space-y-4">
      <input
        type="password"
        v-model="newPassword"
        placeholder="Nouveau mot de passe"
        class="input"
      />
      <button @click="updatePassword" class="btn">
        Changer le mot de passe
      </button>
    </div>

    <p v-if="message" class="text-green-600">{{ message }}</p>
    <p v-if="error" class="text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const route = useRoute();

const newPassword = ref("");
const message = ref("");
const error = ref("");
const isComplete = ref(false);

// Supabase gère automatiquement le token envoyé par l’email
// Tu n’as pas besoin de le récupérer manuellement dans l’URL
const updatePassword = async () => {
  message.value = "";
  error.value = "";

  const { error: err } = await client.auth.updateUser({
    password: newPassword.value,
  });

  if (err) {
    error.value = err.message;
  } else {
    message.value = "✅ Mot de passe mis à jour. Vous pouvez vous reconnecter.";
    isComplete.value = true;
  }
};
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded px-3 py-2;
}
.btn {
  @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700;
}
</style>
