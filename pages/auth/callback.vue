<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50"
  >
    <div class="bg-white shadow-md rounded p-6 w-full max-w-md text-center">
      <div v-if="loading" class="text-gray-600">🔄 Connexion en cours...</div>

      <div v-else-if="user">
        <h1 class="text-xl font-bold text-green-700 mb-2">
          Bienvenue {{ user.email }} !
        </h1>
        <p class="text-gray-700">Vous êtes connecté avec succès.</p>
        <NuxtLink
          to="/"
          class="mt-4 inline-block text-blue-600 hover:underline"
        >
          Aller à l'accueil
        </NuxtLink>
      </div>

      <div v-else class="text-red-600">
        ❌ Une erreur est survenue lors de la connexion.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSupabaseClient, useSupabaseUser } from "#imports";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const loading = ref(true);

onMounted(async () => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");

  if (accessToken && refreshToken) {
    // Rétablir la session manuellement
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      console.error("❌ Erreur de session Supabase:", error);
    }
  }

  // Attendre que useSupabaseUser se mette à jour
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>
