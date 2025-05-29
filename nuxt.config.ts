import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  css: ["@/assets/css/tailwind.css"],
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
      apiBase: "http://localhost:4000/api", // ou le port réel de ton serveur Node.js
    },
  },
  app: {
    baseURL: "/",
  },
  modules: ["@primevue/nuxt-module"],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
});
