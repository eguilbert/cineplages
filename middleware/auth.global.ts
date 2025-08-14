export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = [
    "/login",
    "/welcome",
    "/reset-password",
    "/auth/callback",
  ];
  if (publicRoutes.includes(to.path)) return;

  const me = useState("me", () => null);
  if (me.value !== null) return;

  const config = useRuntimeConfig();
  const headers = process.server
    ? useRequestHeaders(["cookie", "authorization"])
    : undefined;

  try {
    const data = await $fetch(`${config.public.apiBase}/api/auth/me`, {
      headers,
      credentials: "include",
    });

    me.value = data?.user || null;

    if (!me.value) throw new Error("no user");
  } catch {
    return navigateTo("/login?next=" + encodeURIComponent(to.fullPath));
  }
});
