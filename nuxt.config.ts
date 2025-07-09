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
    public: {
      apiBase: "https://cineapi-production.up.railway.app/api", // ou le port réel de ton serveur Node.js
    },
  },
  app: {
    baseURL: "/",
  },
  modules: ["@primevue/nuxt-module", "@pinia/nuxt"],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
});
