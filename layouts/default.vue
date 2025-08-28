<template>
  <div class="min-h-screen bg-[#fff7f0] text-[#333]">
    <header class="bg-[#26474E] text-[#fefae0] p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold text-[#fefae0]">🎬 Cineplages</h1>
        <slot name="header-actions" />
        <!--         <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
 -->
        <NuxtLink v-if="isAdmin" to="/films/import">Imports</NuxtLink>
        <!-- <NuxtLink to="/films/preparer">Préparer une sélection</NuxtLink>
      <NuxtLink to="/films/sauver">Sauvegarder une sélection</NuxtLink> -->
        <NuxtLink to="/films/selections">Présélections</NuxtLink>

        <NuxtLink to="/programmation">Programmation</NuxtLink>
        <NuxtLink to="/selections/" class="hover:underline" v-if="isAdmin"
          >Séances</NuxtLink
        >
        <!--<NuxtLink to="/films/TagValidation">Tags</NuxtLink>
 -->
        <!--   

        <NuxtLink to="/programmation" class="hover:underline" v-if="isAdmin"
          >Grille</NuxtLink
        >
        <NuxtLink to="/films/films" class="hover:underline" v-if="isAdmin"
          >Films</NuxtLink
        > -->
        <!--  <NuxtLink
          to="/selections/preferences"
          class="hover:underline"
          v-if="isAdmin"
          >Preferences</NuxtLink
        >
        <NuxtLink to="/admin" v-if="isAdmin" class="hover:underline"
          >Admin</NuxtLink
        > -->
        <NuxtLink to="/activity" v-if="isAdmin" class="hover:underline"
          >Logs</NuxtLink
        >
        <button @click="logout" v-if="isAuthenticated">Se déconnecter</button>
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <div
        class="bg-red-600 text-white p-2 text-center"
        v-if="config.public.apiBase.includes('localhost')"
      >
        ⚠️ Mode LOCAL connecté à {{ config.public.apiBase }}
      </div>
      <slot />
    </main>
    <Toast position="top-left" />
    <footer class="bg-[#08C5D1] text-white py-4 text-center mt-8">
      <p class="text-sm">© Emmanuel Guilbert {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
import { useUserRole } from "@/composables/useUserRole";
import Toast from "primevue/toast";

const { user, isAuthenticated, isAdmin } = useAuth();
//const { role, fetchRole, isLoggedIn } = useUserRole();
const loading = ref(true);
const route = useRoute();

onMounted(async () => {
  console.log("🎯 ROUTE", route.fullPath);
  /*   console.log("logged", isLoggedIn.value);
   */ // if (isLoggedIn.value) {
  //   await fetchRole();
  //   console.log("role", role.value);
  // }
  //
  loading.value = false;
});

const auth = useAuth();
await auth.getUser();
//const supabase = useSupabaseClient();
//const user = useSupabaseUser();
const logout = async () => {
  auth.logout;
  navigateTo("/login");
};
console.log("API Base =", useRuntimeConfig().public.apiBase);
console.log("process.env.NODE_ENV =", process.env.NODE_ENV);
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
