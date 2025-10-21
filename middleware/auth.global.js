// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  const PUBLIC = new Set(["/login", "/signup", "/reset-password"]);
  if (PUBLIC.has(to.path)) return;

  // 🔐 Check cookie "session" côté SSR sans casser le build client
  if (process.server) {
    const event = useRequestEvent();
    if (event) {
      const { getCookie } = await import("h3"); // import dynamique = OK en .js
      const session = getCookie(event, "session");
      if (!session) {
        return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
      }
    }
  }

  // 👤 Puis on s'assure côté client/SSR que l'utilisateur est chargé
  const { ensureUserLoaded, isAuthenticated } = useAuth();
  try {
    await ensureUserLoaded();
  } catch (e) {
    // ne jamais casser la navigation
    if (process.server)
      console.error("ensureUserLoaded failed:", e && e.message ? e.message : e);
  }

  if (!isAuthenticated.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});
