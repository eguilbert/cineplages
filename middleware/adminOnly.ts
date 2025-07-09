export default defineNuxtRouteMiddleware(async () => {
  const { role, fetchRole } = useUserRole();
  await fetchRole();
  /*   if (role.value !== "ADMIN") return navigateTo("/unauthorized");
   */
});
