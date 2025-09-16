// middleware/auth.js
export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, ensureUserLoaded } = useAuth();

  await ensureUserLoaded();

  if (!isAuthenticated.value) {
    return navigateTo("/login");
  }
});
