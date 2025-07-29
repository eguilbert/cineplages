export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  const publicRoutes = [
    "/login",
    "/welcome",
    "/auth/callback",
    "/reset-password",
  ];

  if (
    to.path === "/reset-password" &&
    to.hash?.includes("access_token") &&
    to.hash?.includes("type=recovery")
  ) {
    return; // ✅ Laisse passer
  }

  if (publicRoutes.includes(to.path)) return;

  if (!user.value) {
    return navigateTo("/login");
  }
});
