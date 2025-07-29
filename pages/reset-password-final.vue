<script setup>
const supabase = useSupabaseClient();
const router = useRouter();
const route = useRoute();
const error = ref("");

onMounted(async () => {
  const access_token = route.query.access_token;
  const refresh_token = route.query.refresh_token;

  if (!access_token || !refresh_token) {
    error.value = "Lien invalide.";
    return;
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (sessionError) {
    error.value = "Échec de la connexion.";
    return;
  }

  // 🔐 L’utilisateur est maintenant authentifié, tu peux rediriger
  return navigateTo("/reset-password", { replace: true });
});
</script>

<template>
  <div class="max-w-md mx-auto p-6 text-center">
    <h1 class="text-xl font-bold mb-4">Connexion en cours...</h1>
    <p v-if="error" class="text-red-600">{{ error }}</p>
    <p v-else>Merci de patienter...</p>
  </div>
</template>
