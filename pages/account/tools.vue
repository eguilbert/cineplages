<template>
  <div class="p-6 max-w-xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">🔐 Outils de sécurité</h1>

    <div class="space-y-4">
      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold">Changer d'email</h2>
        <input
          v-model="newEmail"
          type="email"
          placeholder="Nouvel email"
          class="input"
        />
        <button @click="changeEmail" class="btn">Valider</button>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold">Recevoir un Magic Link</h2>
        <input
          v-model="magicEmail"
          type="email"
          placeholder="Email"
          class="input"
        />
        <button @click="sendMagicLink" class="btn">Envoyer le lien</button>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="font-semibold">Réinitialiser mot de passe</h2>
        <input
          v-model="resetEmail"
          type="email"
          placeholder="Email"
          class="input"
        />
        <button @click="resetPassword" class="btn">Envoyer le lien</button>
      </div>
    </div>

    <p v-if="message" class="text-green-600 mt-4">{{ message }}</p>
    <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const user = useSupabaseUser();

const newEmail = ref("");
const magicEmail = ref("");
const resetEmail = ref("");
const message = ref("");
const error = ref("");

const changeEmail = async () => {
  message.value = "";
  error.value = "";
  const { error: err } = await client.auth.updateUser({
    email: newEmail.value,
  });
  if (err) error.value = err.message;
  else message.value = "Un email de confirmation a été envoyé.";
};

const sendMagicLink = async () => {
  message.value = "";
  error.value = "";
  const { error: err } = await client.auth.signInWithOtp({
    email: magicEmail.value,
  });
  if (err) error.value = err.message;
  else message.value = "Un Magic Link a été envoyé.";
};

const resetPassword = async () => {
  message.value = "";
  error.value = "";
  const { error: err } = await client.auth.resetPasswordForEmail(
    resetEmail.value,
    {
      redirectTo: "http://localhost:3001/reset-password",
    }
  );
  if (err) error.value = err.message;
  else message.value = "Un email de réinitialisation a été envoyé.";
};
</script>

<style scoped>
.input {
  @apply mt-2 w-full border border-gray-300 rounded px-3 py-2;
}
.btn {
  @apply mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700;
}
</style>
