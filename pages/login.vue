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

<!-- <script setup>
import { navigateTo } from "nuxt/app";

/* const supabase = useSupabaseClient(); */

const email = ref("");
const password = ref("");
const config = useRuntimeConfig();
const showReset = ref(false);
const resetEmail = ref("");
const resetMessage = ref("");
const resetError = ref("");
const route = useRoute();
const router = useRouter();
const { getUser } = useAuth();
onMounted(async () => {
  const hash = route.hash;

  if (hash.includes("error=access_denied")) {
    const params = new URLSearchParams(hash.replace("#", ""));
    const code = params.get("error_code");
    if (code === "otp_expired") {
      resetError.value =
        "Le lien est expiré. Merci de redemander un nouveau lien.";
    } else {
      resetError.value = "Erreur : lien invalide ou déjà utilisé.";
    }
  }
  /*   await $fetch("/auth/register", {
    baseURL: config.public.apiBase,
    method: "POST",
    body: {
      email: "tt@example.com",
      password: "nosecret",
      username: "tt",
    },
    credentials: "include", // indispensable pour les cookies
  }); */
});
const handleLogin = async () => {
  try {
    await $fetch(`api/auth/login`, {
      method: "POST",
      body: { email: email.value, password: password.value },
      credentials: "include", // indispensable
    });

    // 1) recharge l'état utilisateur
    await getUser();

    // 2) redirige (navigateTo marche SSR/CSR)
    await navigateTo(route.query.redirect || "/films/selections");
  } catch (error) {
    const msg =
      error?.response?._data?.error ||
      error?.data?.error ||
      error?.message ||
      "Erreur inconnue";
    alert("Connexion échouée : " + msg);
  }
};

const sendCustomReset = async () => {
  /*   const res = await fetch(
    "https://ylyugnwmbodngbjuiwff.functions.supabase.co/send-link",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: resetEmail.value,
        type: "recovery", // ou "recovery" ou "invite"
      }),
    }
  ); */

  const data = await res.json();
  if (res.ok) {
    resetMessage.value = "Lien envoyé ! Vérifiez votre boîte mail.";
  } else {
    resetError.value = data.error || "Une erreur est survenue.";
  }
};
// const sendResetLink = async () => {
//   resetMessage.value = "";
//   resetError.value = "";

//   if (!resetEmail.value) {
//     resetError.value = "Veuillez entrer une adresse email.";
//     return;
//   }

//   const { error } = await supabase.auth.resetPasswordForEmail(
//     resetEmail.value,
//     {
//       redirectTo: "https://cineplages.vercel.app/reset-password", // ou localhost en dev
//     }
//   );

//   if (error) {
//     resetError.value = error.message;
//   } else {
//     resetMessage.value =
//       "Lien de réinitialisation envoyé. Vérifiez votre boîte mail.";
//     resetEmail.value = "";
//   }
// };
</script> -->

<script setup>
import { navigateTo } from "nuxt/app";

const email = ref("");
const password = ref("");
const showReset = ref(false);
const resetEmail = ref("");
const resetMessage = ref("");
const resetError = ref("");
const route = useRoute();
const { getUser } = useAuth();

const handleLogin = async () => {
  try {
    await $fetch(`/api/auth/login`, {
      // ← SLASH ajouté + proxy
      method: "POST",
      body: { email: email.value, password: password.value },
      credentials: "include",
    });

    // 1) recharge l'état utilisateur (va appeler /api/auth/me)
    await getUser();

    // 2) redirige vers la page demandée ou défaut
    const next =
      typeof route.query.next === "string"
        ? route.query.next
        : "/films/selections";
    await navigateTo(next);
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
