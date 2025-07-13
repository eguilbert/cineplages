/* export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === "/maintenance") return;

  try {
    const res = await $fetch("/api/health");
    if (!res || res.status !== "ok") {
      return navigateTo("/maintenance");
    }
  } catch (e) {
    return navigateTo("/maintenance");
  }
}); */
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === "/maintenance") return;

  try {
    const config = useRuntimeConfig();
    const res = await $fetch(`${config.public.apiBase}/health`);
    if (!res || res.status !== "ok") {
      return navigateTo("/maintenance");
    }
  } catch (e) {
    return navigateTo("/maintenance");
  }
});
