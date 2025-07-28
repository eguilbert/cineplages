<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50"
  >
    <div class="bg-white shadow-md rounded p-6 w-full max-w-md text-center">
      <div v-if="loading" class="text-gray-600">
        ⏳ Validation de votre compte...
      </div>

      <div v-else-if="user">
        <h1 class="text-2xl font-bold text-green-700 mb-2">
          ✅ Bienvenue {{ user.user_metadata?.email || user.email }} !
        </h1>
        <p class="text-gray-700">Votre compte a été confirmé avec succès.</p>
        <NuxtLink to="/" class="mt-4 inline-block text-blue-600 hover:underline"
          >Retour à l'accueil</NuxtLink
        >
      </div>

      <div v-else class="text-red-600">
        ❌ Une erreur est survenue lors de la confirmation.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSupabaseUser, useSupabaseClient } from "#imports";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const loading = ref(true);
const router = useRouter();

onMounted(async () => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get("access_token");

  if (!accessToken) {
    loading.value = false;
    return;
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (!error && data?.user) {
    // Authentifier localement l’utilisateur (optionnel si déjà géré par Nuxt)
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: hashParams.get("refresh_token"),
    });
  }

  // Attendre que useSupabaseUser se mette à jour
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>
