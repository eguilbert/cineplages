// composables/useAuth.ts
export const useAuth = () => {
  const config = useRuntimeConfig();
  const apiBase = (config.public?.apiBase || "").replace(/\/$/, "");

  // --- shared state
  const user = useState<any | null>("auth:user", () => null);
  const loading = useState<boolean>("auth:loading", () => false);
  const error = useState<string | null>("auth:error", () => null);
  const loadedOnce = useState<boolean>("auth:loadedOnce", () => false);

  // --- derived
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "ADMIN");
  const hasRole = (role: string) => computed(() => user.value?.role === role);
  const hasAnyRole = (roles: string[]) =>
    computed(() =>
      user.value?.role ? roles.includes(user.value.role) : false
    );

  // --- small helper to always call the Railway API (SSR-safe, cookies propagated)
  const apiFetch = async <T = any>(path: string, opts: any = {}) => {
    const url = `${apiBase}${path}`;
    const headers = process.server
      ? useRequestHeaders(["cookie", "authorization"])
      : undefined;

    return await $fetch<T>(url, {
      credentials: "include",
      server: false,
      headers,
      ...opts,
    });
  };

  const getUser = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await apiFetch<{ user: any }>("/api/auth/me");
      user.value = res?.user ?? null;
    } catch (e: any) {
      user.value = null;
      error.value =
        e?.data?.error || e?.message || "Impossible de récupérer l'utilisateur";
    } finally {
      loading.value = false;
      loadedOnce.value = true;
    }
  };

  const ensureUserLoaded = async () => {
    if (!loadedOnce.value && !loading.value) {
      await getUser();
    }
  };

  const login = async (email: string, password: string) => {
    error.value = null;
    loading.value = true;
    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      await getUser();
    } catch (e: any) {
      error.value =
        e?.data?.error || e?.message || "Erreur lors de la connexion";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } finally {
      user.value = null;
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    hasRole,
    hasAnyRole,
    login,
    logout,
    getUser,
    ensureUserLoaded,
  };
};
