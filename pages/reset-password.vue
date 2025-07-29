<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-xl font-bold mb-4">Nouveau mot de passe</h1>

    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>
    <div v-if="success" class="text-green-600 mb-4">
      Mot de passe mis à jour. <NuxtLink to="/login">Se connecter</NuxtLink>
    </div>

    <form v-if="!success" @submit.prevent="handleReset">
      <input
        v-model="password"
        type="password"
        placeholder="Nouveau mot de passe"
        class="border p-2 w-full mb-2"
        required
      />
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 w-full rounded"
      >
        Mettre à jour
      </button>
    </form>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const password = ref("");
const success = ref(false);
const error = ref("");

onMounted(async () => {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth event:", event, session);
    if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
      // Laisse passer l'utilisateur ici
    }
  });
  const { error: urlError } = await supabase.auth.getSessionFromUrl(); // ✅ très important !
  if (urlError) {
    error.value = "Lien invalide ou expiré.";
  }
});

const handleReset = async () => {
  const { error: updateError } = await supabase.auth.updateUser({
    password: password.value,
  });

  if (updateError) {
    error.value = updateError.message;
  } else {
    success.value = true;
  }
};
</script>
