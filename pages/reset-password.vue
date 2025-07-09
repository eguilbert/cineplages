<template>
  <div class="p-8 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Réinitialisation du mot de passe</h1>

    <form @submit.prevent="resetPassword" v-if="!done" class="space-y-4">
      <div>
        <label class="block font-medium">Nouveau mot de passe</label>
        <input v-model="password" type="password" class="input" required />
      </div>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        Mettre à jour le mot de passe
      </button>
    </form>

    <p v-if="done" class="text-green-600">
      Mot de passe mis à jour. <NuxtLink to="/login">Connectez-vous</NuxtLink>.
    </p>
    <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const password = ref("");
const error = ref("");
const done = ref(false);

const resetPassword = async () => {
  error.value = "";
  const { error: updateError } = await supabase.auth.updateUser({
    password: password.value,
  });
  if (updateError) {
    error.value = updateError.message;
  } else {
    done.value = true;
  }
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
