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
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon_cinesplages.ico" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=family=TikTok+Sans:opsz,wght@12..36,300..900&display=swap",
        },
      ],
    },
  },
  modules: ["@primevue/nuxt-module", "@pinia/nuxt", "@nuxtjs/supabase"],
  supabase: {
    redirect: {
      login: "/login",
      callback: "/auth/callback", // à adapter
    },
  },
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
});
