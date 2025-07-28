<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-xl font-bold mb-4">Créer votre compte</h1>

    <div v-if="!user">
      <p>Connexion en cours...</p>
    </div>

    <div v-else>
      <form @submit.prevent="handleSubmit">
        <input
          v-model="form.username"
          type="text"
          placeholder="Nom d'utilisateur"
          class="border p-2 w-full mb-2"
          required
        />
        <p v-if="usernameTaken" class="text-red-500 text-sm mb-2">
          Ce nom d'utilisateur est déjà pris.
        </p>

        <input
          v-model="form.password"
          type="password"
          placeholder="Mot de passe"
          class="border p-2 w-full mb-4"
          required
        />

        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded w-full"
          :disabled="loading"
        >
          Créer le compte
        </button>
      </form>

      <p v-if="message" class="text-green-600 mt-4">{{ message }}</p>
      <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const config = useRuntimeConfig();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();
const router = useRouter();

const form = reactive({
  username: "",
  password: "",
});
const usernameTaken = ref(false);
const message = ref("");
const error = ref("");
const loading = ref(false);

onMounted(async () => {
  const hash = route.fullPath.split("#")[1];
  if (!user.value && hash) {
    await supabase.auth.getSessionFromUrl({ storeSession: true });
  }
});

watch(
  () => form.username,
  async (newUsername) => {
    if (!newUsername) return;
    const { exists } = await $fetch(
      `${config.public.apiBase}/profile/username-exists`,
      {
        method: "POST",
        body: { username: newUsername },
      }
    );
    usernameTaken.value = exists;
  }
);

const handleSubmit = async () => {
  error.value = "";
  message.value = "";
  loading.value = true;

  if (usernameTaken.value) {
    error.value = "Nom d'utilisateur déjà pris.";
    loading.value = false;
    return;
  }

  try {
    // 1. Crée le mot de passe
    const { error: pwError } = await supabase.auth.updateUser({
      password: form.password,
    });
    if (pwError) throw new Error(pwError.message);

    // 2. Crée le profil utilisateur (cinemaId = 1 par défaut)
    const { error: profileError } = await $fetch(
      `${config.public.apiBase}/profile`,
      {
        method: "POST",
        body: {
          user_id: user.value.id,
          username: form.username,
        },
      }
    );
    if (profileError) throw new Error(profileError.message);

    // 3. Redirige
    message.value = "Compte créé avec succès. Redirection...";
    setTimeout(() => router.push("/"), 1500);
  } catch (e) {
    error.value = e.message || "Erreur création compte.";
  } finally {
    loading.value = false;
  }
};
</script>
