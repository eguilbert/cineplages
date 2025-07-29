<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-xl font-bold mb-4">Réinitialisation du mot de passe</h1>

    <div v-if="loading">
      <p>Connexion en cours...</p>
    </div>

    <div v-else-if="!user">
      <p class="text-red-600">
        Impossible de récupérer la session. Le lien est peut-être expiré.
      </p>
    </div>

    <div v-else>
      <form @submit.prevent="handleReset">
        <input
          v-model="newPassword"
          type="password"
          placeholder="Nouveau mot de passe"
          class="border p-2 w-full mb-4"
          required
        />
        <button class="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Réinitialiser le mot de passe
        </button>
      </form>

      <p v-if="success" class="text-green-600 mt-4">
        ✅ Mot de passe modifié. Redirection dans 2 secondes...
      </p>
      <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "#app";

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const newPassword = ref("");
const success = ref(false);
const error = ref("");
const loading = ref(true);

onMounted(async () => {
  try {
    console.log("➡️ Tentative de récupérer la session via l'URL...");

    const { data, error: sessionError } =
      await supabase.auth.exchangeCodeForSession();

    console.log("🔐 Résultat exchangeCodeForSession", { data, sessionError });

    if (sessionError) {
      error.value = "Lien invalide ou expiré.";
    }
  } catch (e) {
    error.value = "Erreur inattendue.";
  } finally {
    loading.value = false;
  }
});

const router = useRouter();

const handleReset = async () => {
  error.value = "";
  success.value = false;

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword.value,
  });

  if (updateError) {
    error.value = updateError.message;
  } else {
    success.value = true;
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }
};
</script>
