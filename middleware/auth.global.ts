// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = [
    "/login",
    "/welcome",
    "/reset-password",
    "/auth/callback",
  ];
  if (publicRoutes.includes(to.path)) return;

  // 🚫 Skip SSR: le cookie Railway n'est pas accessible côté serveur Vercel
  if (process.server) return;

  const { ensureUserLoaded, isAuthenticated } = useAuth();

  await ensureUserLoaded();

  if (!isAuthenticated.value) {
    return navigateTo("/login?next=" + encodeURIComponent(to.fullPath));
  }
});
