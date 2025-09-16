<template>
  <div class="min-h-screen bg-[#fff7f0] text-[#333]">
    <header
      class="sticky top-0 z-40 bg-[#26474e] text-white backdrop-blur border-b"
    >
      <div class="max-w-6xl mx-auto px-4">
        <MenuBar :model="menuItems" class="border-0 text-white" v-if="isAdmin">
          <!-- Zone gauche (logo / home) -->
          <template #start>
            <NuxtLink
              to="/"
              class="flex items-center gap-2 py-3 text-white hover:text-gray-200"
            >
              <!-- <span class="pi pi-play" /> -->
              <span class="font-semibold">Cineplages</span>
            </NuxtLink>
          </template>

          <!-- Rendu de chaque item (NuxtLink custom) -->
          <template #item="{ item, props }">
            <!-- Lien route (NuxtLink) -->
            <NuxtLink
              v-if="item.to"
              v-slot="{ href, navigate }"
              :to="item.to"
              custom
            >
              <a
                v-bind="props.action"
                :href="href"
                @click="navigate"
                class="flex items-center gap-2 px-2 py-1 text-white hover:bg-white/10 rounded"
              >
                <span v-if="item.icon" :class="item.icon" />
                <span>{{ item.label }}</span>
              </a>
            </NuxtLink>

            <!-- Action (command) -->
            <a
              v-else
              v-bind="props.action"
              @click="item.command?.()"
              class="flex items-center gap-2 px-2 py-1 text-white hover:bg-white/10 rounded"
              style="color: #f5f5f5"
            >
              <span
                v-if="item.icon"
                :class="item.icon"
                style="color: #f5f5f5"
              />
              <span>{{ item.label }}</span>
            </a>
          </template>

          <!-- Zone droite (compte / logout) -->
          <template #end>
            <div class="flex items-center gap-3">
              <NuxtLink
                v-if="!isAuthenticated"
                to="/login"
                class="text-sm text-white hover:underline"
                style="color: #fff"
              >
                Se connecter
              </NuxtLink>
              <Button
                v-if="isAuthenticated"
                label="Se déconnecter"
                icon="pi pi-sign-out"
                severity="secondary"
                text
                @click="doLogout"
                class="!py-2 text-white hover:!bg-white/10"
                style="color: #fff"
              />
            </div>
          </template>
        </MenuBar>
        <div
          class="container mx-auto flex justify-between items-center max-w-6xl mx-auto px-4 py-3"
          v-else
        >
          <h1 class="text-xl font-bold text-[#fefae0]">🎬 Cineplages</h1>
          <slot name="header-actions" />
          <!--         <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
 -->
          <NuxtLink v-if="isAdmin" to="/films/import">Imports</NuxtLink>
          <!-- <NuxtLink to="/films/preparer">Préparer une sélection</NuxtLink>
      <NuxtLink to="/films/sauver">Sauvegarder une sélection</NuxtLink> -->
          <NuxtLink to="/films/selections">Présélections</NuxtLink>

          <NuxtLink to="/programmation">Programmation</NuxtLink>
          <!-- <NuxtLink to="/selections/" class="hover:underline" v-if="isAdmin"
          >Séances</NuxtLink
        >
        <NuxtLink to="/films/TagValidation">Tags</NuxtLink>
 -->
          <!--   

        <NuxtLink to="/programmation" class="hover:underline" v-if="isAdmin"
          >Grille</NuxtLink
        >-->
          <NuxtLink to="/films/films" class="hover:underline">Films</NuxtLink>
          <NuxtLink to="/lists/create" class="hover:underline" v-if="isAdmin"
            >Listes</NuxtLink
          >
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
          <NuxtLink to="/projections" v-if="isAdmin" class="hover:underline"
            >Projections</NuxtLink
          >
          <NuxtLink
            v-if="!isAuthenticated"
            to="/login"
            class="text-sm text-white hover:underline"
            style="color: #fff"
          >
            Se connecter
          </NuxtLink>
          <Button
            v-if="isAuthenticated"
            label="Se déconnecter"
            icon="pi pi-sign-out"
            severity="secondary"
            text
            @click="doLogout"
            class="!py-2 text-white hover:!bg-white/10"
            style="color: #fff"
          />
        </div>
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <!-- Bonjour, {{ user.username }} -->
      <!--  <div
        class="bg-red-600 text-white p-2 text-center"
        v-if="config.public.apiBase.includes('localhost')"
      >
        ⚠️ Mode LOCAL connecté à {{ config.public.apiBase }}
      </div> -->
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
import Toast from "primevue/toast";
import MenuBar from "primevue/menubar";
import Button from "primevue/button";

const { login, logout, user, isAuthenticated, isAdmin, ensureUserLoaded } =
  useAuth();

const loading = ref(true);
const route = useRoute();
/* const props = defineProps({
  isAdmin: Boolean,
  isAuthenticated: Boolean,
  logout: Function,
}); */
const auth = useAuth();
await auth.getUser();
//const supabase = useSupabaseClient();
//const user = useSupabaseUser();
const doLogout = async () => {
  /* auth.logout; */
  logout();
  navigateTo("/login");
};
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

const menuItems = computed(() => {
  const items = [
    {
      label: "Films",
      icon: "pi pi-video",
      items: [
        { label: "Films", to: "/films/films" },
        isAdmin.value && { label: "Imports", to: "/films/import" },
        { label: "Présélections", to: "/films/selections" },
        isAdmin.value && { label: "Listes", to: "/lists/create" },
      ].filter(Boolean),
    },
    {
      label: "Programmation",
      icon: "pi pi-calendar",
      items: [
        { label: "Programmation", to: "/programmation" },
        isAdmin.value && { label: "Projections", to: "/projections" },
      ].filter(Boolean),
    },
    isAdmin.value && {
      label: "Administration",
      icon: "pi pi-cog",
      items: [
        { label: "Logs", to: "/activity" },
        { label: "Tags", to: "/films/TagValidation" },
        { label: "Admin", to: "/admin" },
      ],
    },
  ];

  return items.filter(Boolean);
});

console.log("API Base =", useRuntimeConfig().public.apiBase);
console.log("process.env.NODE_ENV =", process.env.NODE_ENV);
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
/* Optionnel : affiner l’apparence pour coller à ton header */
:deep(.p-menubar) {
  background: transparent !important;
  border: none !important;
  color: #f5f5f5 !important;
}
:deep(.p-menubar-root-list > .p-menuitem > .p-menuitem-content) {
  color: #f5f5f5 !important;
}
:deep(.p-submenu-list) {
  background: #26474e !important;
  color: #f5f5f5 !important;
}
:deep(.p-submenu-list .p-menuitem-link:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
}
:deep(.p-menubar a) {
  color: #f5f5f5;
}
:deep(
    .p-menubar a:hover,
    .p-menubar a:hover span.pi,
    .p-menubar .p-menubar-item-active a.p-menubar-item-link,
    .p-menubar .p-menubar-item-active a.p-menubar-item-link,

  ) {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #26474e !important;
}
:deep(.p-menubar .pi) {
  color: #f5f5f5 !important;
}
.p-menubar-submenu a.p-menubar-item-link {
  color: #26474e !important;
}
.p-menubar-item-content {
  color: #26474e !important;
}
</style>
