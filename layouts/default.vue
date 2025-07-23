<template>
  <div class="min-h-screen bg-[#fff7f0] text-[#333]">
    <header class="bg-[#26474E] text-[#fefae0] p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold text-[#fefae0]">🎬 Cineplages</h1>
        <slot name="header-actions" />
        <!--         <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
 -->
        <NuxtLink v-if="role === 'ADMIN'" to="/films/import"
          >Présélection</NuxtLink
        >
        <!-- <NuxtLink to="/films/preparer">Préparer une sélection</NuxtLink>
      <NuxtLink to="/films/sauver">Sauvegarder une sélection</NuxtLink> -->
        <NuxtLink to="/films/selections">Programmation</NuxtLink>
        <!--         <NuxtLink to="/films/TagValidation">Tags</NuxtLink>
 -->
        <NuxtLink
          to="/selections/"
          class="hover:underline"
          v-if="role === 'ADMIN'"
          >Séances</NuxtLink
        >
        <NuxtLink
          to="/programmation"
          class="hover:underline"
          v-if="role === 'ADMIN'"
          >Grille</NuxtLink
        >
        <NuxtLink
          to="/films/films"
          class="hover:underline"
          v-if="role === 'ADMIN'"
          >Films</NuxtLink
        >
        <NuxtLink
          to="/selections/preferences"
          class="hover:underline"
          v-if="role === 'ADMIN'"
          >Preferences</NuxtLink
        >
        <NuxtLink to="/admin" v-if="role === 'ADMIN'" class="hover:underline"
          >Admin</NuxtLink
        >
        <NuxtLink to="/activity" v-if="role === 'ADMIN'" class="hover:underline"
          >Logs</NuxtLink
        >
        <button @click="logout" v-if="isLoggedIn">Se déconnecter</button>
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <slot />
    </main>
    <Toast position="top-left" />
    <footer class="bg-[#08C5D1] text-white py-4 text-center mt-8">
      <p class="text-sm">© Cineplages {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<script setup>
import { useUserRole } from "@/composables/useUserRole";
import Toast from "primevue/toast";

const { role, fetchRole, isLoggedIn } = useUserRole();
const loading = ref(true);

onMounted(async () => {
  console.log("logged", isLoggedIn.value);
  if (isLoggedIn.value) {
    await fetchRole();
    console.log("role", role.value);
  }
  loading.value = false;
});
const supabase = useSupabaseClient();
const logout = async () => {
  await supabase.auth.signOut();
  await navigateTo("/login");
};
console.log("API Base =", useRuntimeConfig().public.apiBase);
console.log("process.env.NODE_ENV =", process.env.NODE_ENV);
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
