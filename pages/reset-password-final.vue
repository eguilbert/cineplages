<script setup>
const route = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

onMounted(async () => {
  // Nécessaire pour que Supabase traite les tokens de l'URL
  const { error } = await supabase.auth.getSessionFromUrl();
  if (error) {
    console.error("Erreur récupération session:", error.message);
  }
});
</script>

<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-xl font-bold mb-4">Nouveau mot de passe</h1>

    <form @submit.prevent="submitNewPassword">
      <input
        v-model="password"
        type="password"
        placeholder="Nouveau mot de passe"
        class="border p-2 w-full mb-2"
      />
      <button class="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Mettre à jour
      </button>
    </form>
  </div>
</template>
