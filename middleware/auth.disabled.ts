export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  const { role, fetchRole } = useUserRole();

  const publicRoutes = ["/login", "/welcome", "/auth/callback"];

  // ✅ Laisser passer la page de reset-password si recovery token présent
  if (
    to.fullPath.includes("/reset-password") &&
    to.fullPath.includes("type=recovery")
  ) {
    return;
  }

  if (publicRoutes.includes(to.path)) {
    return;
  }

  if (!user.value) {
    return navigateTo("/login");
  }

  await fetchRole();

  const requiredRole = to.meta.requiredRole;
  if (requiredRole && role.value !== requiredRole) {
    return navigateTo("/unauthorized");
  }
});
