<template>
  <div class="p-8 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Créer un compte</h1>

    <form @submit.prevent="onRegister" class="space-y-4">
      <div>
        <label class="block font-medium">Email</label>
        <input v-model="email" type="email" class="input" required />
      </div>

      <div>
        <label class="block font-medium">Mot de passe</label>
        <input v-model="password" type="password" class="input" required />
      </div>

      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">
        Créer mon compte
      </button>

      <p v-if="message" class="text-green-600 mt-4">{{ message }}</p>
      <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const error = ref("");
const message = ref("");

// remplace cette URL par celle de ton site en prod
const redirectUrl = "http://localhost:3000/confirmation";

const onRegister = async () => {
  error.value = "";
  message.value = "";

  const { error: signupError } = await supabase.auth.signUp(
    {
      email: email.value,
      password: password.value,
    },
    {
      redirectTo: redirectUrl,
    }
  );

  if (signupError) {
    error.value = signupError.message;
    return;
  }

  message.value =
    "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.";
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
