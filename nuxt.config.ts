export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
  vite: {
    //  cacheDir: ".vite-cache",
    server: {
      watch: {
        usePolling: true, // 👉 contourne les erreurs de socket sur certains FS
        interval: 100,
      },
    },
  },
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
      apiBase:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/api"
          : process.env.NUXT_PUBLIC_API_BASE,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
    ADMIN_SECRET_TOKEN: process.env.ADMIN_SECRET_TOKEN, // secret privé
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
  modules: [
    "@pinia/nuxt",
    [
      "@nuxtjs/supabase",
      {
        redirect: false, // ❌ Désactive les redirections auto (vers /login)
        clientOptions: {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
          },
        },
      },
    ],
  ],
});
