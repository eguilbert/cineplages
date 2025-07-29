export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  const { role, fetchRole } = useUserRole();

  const publicRoutes = [
    "/login",
    "/welcome",
    "/auth/callback",
    "/reset-password", // ✅ autorise l'accès sans session
  ];

  // 🔥 Autorise les liens avec access_token
  if (
    to.path === "/reset-password" &&
    to.fullPath.includes("access_token") &&
    to.fullPath.includes("type=recovery")
  ) {
    console.log(
      "⏳ Lien de récupération détecté, accès autorisé à /reset-password"
    );
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
