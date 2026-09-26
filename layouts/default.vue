<template>
  <div class="min-h-screen bg-[#fff7f0] text-[#333]">
    <header
      class="sticky top-0 z-40 bg-[#26474e] text-white backdrop-blur border-b border-white/10"
    >
      <div class="max-w-6xl mx-auto px-4">
        <!-- Header admin avec menus -->
        <div
          v-if="isAdmin"
          class="flex items-center justify-between py-3 gap-6"
        >
          <div class="flex items-center gap-6">
            <NuxtLink
              to="/"
              class="flex items-center gap-2 py-2 text-white hover:text-gray-200"
            >
              <span class="font-semibold">Cineplages</span>
            </NuxtLink>

            <div class="hidden md:flex items-center gap-2">
              <div
                v-for="group in navGroups"
                :key="group.label"
                class="relative pb-2"
                @mouseenter="openMenu = group.label"
                @mouseleave="openMenu = null"
              >
                <button
                  type="button"
                  class="px-3 py-2 rounded-md text-white hover:bg-white/10 transition-colors"
                >
                  {{ group.label }}
                </button>

                <div
                  v-if="openMenu === group.label"
                  class="absolute left-0 top-full w-56 rounded-lg bg-[#26474e] border border-white/10 shadow-xl py-2 z-50"
                >
                  <NuxtLink
                    v-for="item in group.items"
                    :key="item.to"
                    :to="item.to"
                    class="block px-4 py-2 text-sm text-white hover:bg-white/10"
                  >
                    {{ item.label }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <div class="hidden md:flex items-center gap-3">
            <slot name="header-actions" />

            <NuxtLink
              v-if="!isAuthenticated"
              to="/login"
              class="text-sm text-white hover:underline"
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
              class="!py-2 !text-white hover:!bg-white/10"
            />
          </div>

          <!-- Version mobile -->
          <div class="md:hidden flex items-center gap-2">
            <button
              type="button"
              class="px-3 py-2 rounded-md text-white hover:bg-white/10"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              ☰
            </button>
          </div>
        </div>

        <!-- Header non-admin -->
        <div
          v-else
          class="flex justify-between items-center py-3 gap-4 flex-wrap"
        >
          <div class="flex items-center gap-4 flex-wrap">
            <NuxtLink to="/" class="text-xl font-bold text-[#fefae0]">
              🎬 Cineplages
            </NuxtLink>

            <slot name="header-actions" />

            <NuxtLink
              to="/films/selections"
              class="text-[#f5f5f5] hover:text-white"
            >
              Présélections
            </NuxtLink>

            <NuxtLink
              to="/programmation"
              class="text-[#f5f5f5] hover:text-white"
            >
              Programmation
            </NuxtLink>

            <NuxtLink to="/films/films" class="text-[#f5f5f5] hover:text-white">
              Films
            </NuxtLink>

            <NuxtLink to="/projections" class="text-[#f5f5f5] hover:text-white">
              Projections
            </NuxtLink>
          </div>

          <div class="flex items-center gap-3">
            <NuxtLink
              v-if="!isAuthenticated"
              to="/login"
              class="text-sm text-white hover:underline"
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
              class="!py-2 !text-white hover:!bg-white/10"
            />
          </div>
        </div>

        <!-- Menu mobile admin -->
        <div v-if="isAdmin && mobileMenuOpen" class="md:hidden pb-4 space-y-3">
          <div
            v-for="group in navGroups"
            :key="group.label"
            class="rounded-lg border border-white/10 bg-white/5"
          >
            <button
              type="button"
              class="w-full text-left px-4 py-3 text-white font-medium hover:bg-white/10 rounded-t-lg"
              @click="toggleMobileGroup(group.label)"
            >
              {{ group.label }}
            </button>

            <div v-if="openMobileGroups.includes(group.label)" class="pb-2">
              <NuxtLink
                v-for="item in group.items"
                :key="item.to"
                :to="item.to"
                class="block px-4 py-2 text-sm text-white hover:bg-white/10"
                @click="mobileMenuOpen = false"
              >
                {{ item.label }}
              </NuxtLink>
            </div>
          </div>

          <div class="pt-2 flex flex-col gap-2">
            <NuxtLink
              v-if="!isAuthenticated"
              to="/login"
              class="text-sm text-white hover:underline px-1"
              @click="mobileMenuOpen = false"
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
              class="justify-start !px-1 !text-white hover:!bg-white/10"
            />
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <!--
      <div
        class="bg-red-600 text-white p-2 text-center"
        v-if="config.public.apiBase.includes('localhost')"
      >
        ⚠️ Mode LOCAL connecté à {{ config.public.apiBase }}
      </div>
      -->
      <slot />
    </main>

    <Toast position="top-left" />

    <footer class="bg-[#08C5D1] text-white py-4 text-center mt-8">
      <p class="text-sm">© Emmanuel Guilbert {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Toast from "primevue/toast";
import Button from "primevue/button";

const config = useRuntimeConfig();
const route = useRoute();
const auth = useAuth();

const { logout, isAuthenticated, isAdmin } = auth;

const loading = ref(true);
const openMenu = ref(null);
const mobileMenuOpen = ref(false);
const openMobileGroups = ref([]);

await auth.getUser();

const doLogout = async () => {
  await logout();
  navigateTo("/login");
};

const toggleMobileGroup = (label) => {
  if (openMobileGroups.value.includes(label)) {
    openMobileGroups.value = openMobileGroups.value.filter((l) => l !== label);
  } else {
    openMobileGroups.value.push(label);
  }
};

const navGroups = computed(() => [
  {
    label: "Films",
    items: [
      { label: "Films", to: "/films/films" },
      { label: "Imports", to: "/films/import" },
      { label: "Présélections", to: "/films/selections" },
      { label: "Listes", to: "/lists/create" },
    ],
  },
  {
    label: "Programmation",
    items: [
      { label: "Programmation", to: "/programmation" },
      { label: "Projections", to: "/projections" },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Logs", to: "/activity" },
      { label: "Tags", to: "/films/TagValidation" },
      { label: "Film Tags", to: "/films/tags" },
      { label: "Admin", to: "/admin" },
    ],
  },
]);

onMounted(() => {
  console.log("🎯 ROUTE", route.fullPath);
  loading.value = false;
});

console.log("API Base =", config.public.apiBase);
console.log("process.env.NODE_ENV =", process.env.NODE_ENV);
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
