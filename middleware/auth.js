// middleware/auth.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth(); // récupérer ton composable
  const { isAuthenticated, ensureUserLoaded } = auth;

  // ⚙️ S'assurer que le user est bien chargé avant de décider
  await ensureUserLoaded();

  // 🔒 Si non connecté → redirection login
  if (!isAuthenticated.value) {
    return navigateTo(`/login?redirect=${to.fullPath}`);
  }
});
