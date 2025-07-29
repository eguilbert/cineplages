export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const { role, fetchRole } = useUserRole();
  const publicRoutes = [
    "/login",
    "/welcome",
    "/reset-password",
    "/auth/callback",
  ];

  if (
    to.path === "/reset-password" &&
    to.hash?.includes("access_token") &&
    to.hash?.includes("type=recovery")
  ) {
    return;
  }

  if (publicRoutes.includes(to.path)) {
    return; // laisser passer
  }
  // Sinon, comportement normal
  if (!user.value) {
    return navigateTo("/login");
  }

  await fetchRole(); // charge le rôle et le cinemaId

  const requiredRole = to.meta.requiredRole;

  if (requiredRole && role.value !== requiredRole) {
    console.warn("⛔ Accès refusé : rôle requis =", requiredRole);
    return navigateTo("/unauthorized"); // ou page d’erreur personnalisée
  }
});
