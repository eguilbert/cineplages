<template>
  <div class="p-8 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Connexion</h1>

    <form @submit.prevent="onLogin" class="space-y-4">
      <div>
        <label class="block font-medium">Email</label>
        <input v-model="email" type="email" class="input" required />
      </div>

      <div>
        <label class="block font-medium">Mot de passe</label>
        <input v-model="password" type="password" class="input" required />
      </div>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        Se connecter
      </button>

      <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
      <p class="text-red-600 mt-4" @click="sendResetLink(email)">
        Mot de passe oublié?
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const error = ref("");

const onLogin = async () => {
  error.value = "";
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (loginError) {
    error.value = loginError.message;
    return;
  }

  return navigateTo("/");
};

const sendResetLink = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/reset-password",
  });
  if (error) console.error("Erreur reset password:", error.message);
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
}
</style>
