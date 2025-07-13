import { useUserRole } from "@/composables/useUserRole";
export default defineNuxtRouteMiddleware(async (to) => {
  const { role, fetchRole } = useUserRole();
  await fetchRole();

  const required = to.meta.requiredRole;
  if (required && role.value !== required) {
    return navigateTo("/unauthorized");
  }
});
