import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  css: ["@/assets/css/tailwind.css", "primeicons/primeicons.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile: ["primevue"],
  },
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      apiBase: "https://cineapi-production.up.railway.app/api",
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    },
  },
  app: {
    baseURL: "/",
  },
  modules: ["@primevue/nuxt-module", "@pinia/nuxt", "@nuxtjs/supabase"],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
});
