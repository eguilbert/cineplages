<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-xl font-bold mb-4">Connexion</h1>

    <form @submit.prevent="handleLogin">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="border p-2 w-full mb-2"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Mot de passe"
        class="border p-2 w-full mb-2"
        required
      />

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Se connecter
      </button>
    </form>

    <div class="text-sm mt-4 text-right">
      <button class="text-blue-600 hover:underline" @click="showReset = true">
        Mot de passe oublié ?
      </button>
    </div>

    <!-- Bloc de reset password -->
    <div v-if="showReset" class="mt-4 border-t pt-4">
      <p class="mb-2">
        Entrez votre adresse email pour recevoir un lien de réinitialisation.
      </p>

      <input
        v-model="resetEmail"
        type="email"
        placeholder="Email"
        class="border p-2 w-full mb-2"
      />

      <button
        @click="sendCustomReset"
        class="bg-gray-800 text-white px-4 py-2 rounded w-full"
      >
        Envoyer le lien de réinitialisation
      </button>

      <p v-if="resetMessage" class="text-green-600 mt-2">{{ resetMessage }}</p>
      <p v-if="resetError" class="text-red-600 mt-2">{{ resetError }}</p>
    </div>
  </div>
</template>

<script setup>
import { navigateTo } from "nuxt/app";

const email = ref("");
const password = ref("");
const showReset = ref(false);
const resetEmail = ref("");
const resetMessage = ref("");
const resetError = ref("");
const route = useRoute();
const { login, getUser } = useAuth();

const handleLogin = async () => {
  try {
    await login(email.value, password.value); // ← appelle Railway via apiBase
    await getUser();
    await navigateTo(route.query.next || "/films/selections");
  } catch (error) {
    const msg =
      error?.response?._data?.error ||
      error?.data?.error ||
      error?.message ||
      "Erreur inconnue";
    alert("Connexion échouée : " + msg);
  }
};

// ⚠️ Ton sendCustomReset utilise `res` sans le définir (fetch commenté). Soit tu retires le bloc,
// soit tu réactives le fetch et tu utilises sa réponse dans `res`.
const sendCustomReset = async () => {
  resetError.value = "Fonction de reset à finaliser (fetch commenté).";
};
</script>
