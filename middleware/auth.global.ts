/* // middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = new Set([
    "/login",
    "/welcome",
    "/auth/callback",
    "/reset-password",
    "/register",
    "/me",
  ]);

  // 1) Laisser passer d'abord les routes publiques (évite les boucles)
  if (publicRoutes.has(to.path)) return;

  const { ensureUserLoaded, isAuthenticated, isAdmin } = useAuth();
  await ensureUserLoaded();

  // 2) Pas connecté -> rediriger vers /login
  if (!isAuthenticated.value) {
    return navigateTo("/login");
  }

  // 3) Exemple d'accès admin (optionnel)
  if (to.meta?.requiresAdmin && !isAdmin.value) {
    navigateTo("/");
    //return abortNavigation(); // ou navigateTo('/')
  }
});
 */
// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = [
    "/login",
    "/welcome",
    "/reset-password",
    "/auth/callback",
  ];
  if (publicRoutes.includes(to.path)) return;

  const me = useState("me", () => null);
  if (me.value !== null) return;

  try {
    const headers = process.server
      ? useRequestHeaders(["cookie", "authorization"])
      : undefined;
    const data = await $fetch("/api/auth/me", { headers }); // ← proxy relatif
    me.value = data?.user || null;
    if (!me.value) throw new Error("no user");
  } catch {
    return navigateTo("/login?next=" + encodeURIComponent(to.fullPath));
  }
});
