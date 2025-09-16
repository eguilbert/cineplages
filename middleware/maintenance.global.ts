// middleware/health.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Ne boucle pas sur la page maintenance
  if (to.path === "/maintenance") return;

  // ✅ Ne pas exécuter en SSR (inutile et peut bloquer le rendu)
  if (process.server) return;

  const config = useRuntimeConfig();
  const apiBase = (config.public?.apiBase || "").replace(/\/$/, "");

  // Petit cache mémoire pour éviter un appel par navigation
  const healthOk = useState<boolean>("health:ok", () => true);
  const lastCheck = useState<number>("health:last", () => 0);
  const TTL = 30_000; // 30s

  const now = Date.now();
  if (now - lastCheck.value < TTL && healthOk.value) {
    return; // encore frais → on ne refait pas l'appel
  }

  /* try {
    // ✅ Appelle la bonne URL de l’API Railway
    const res: any = await $fetch(`${apiBase}/api/health`, {
      retry: 0, // pas de retry en boucle
    });
    healthOk.value = res && res.status === "ok";
    lastCheck.value = now;

    if (!healthOk.value) {
      return navigateTo("/maintenance");
    }
  } catch {
    healthOk.value = false;
    lastCheck.value = now;
    return navigateTo("/maintenance");
  } */
});
