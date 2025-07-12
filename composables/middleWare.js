export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const { role, fetchRole } = useUserRole();

  if (!user.value) {
    return navigateTo("/login");
  }

  await fetchRole(); // charge le rôle et le cinemaId

  const requiredRole = to.meta.requiredRole as string;

  if (requiredRole && role.value !== requiredRole) {
    console.warn("⛔ Accès refusé : rôle requis =", requiredRole);
    return navigateTo("/unauthorized"); // ou page d’erreur personnalisée
  }
});
