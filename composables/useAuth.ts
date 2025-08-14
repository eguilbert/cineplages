// composables/useAuth.ts
export const useAuth = () => {
  const config = useRuntimeConfig();

  // état global partagé
  const user = useState<any | null>("auth:user", () => null);
  const loading = useState<boolean>("auth:loading", () => false);
  const error = useState<string | null>("auth:error", () => null);
  const loadedOnce = useState<boolean>("auth:loadedOnce", () => false);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "ADMIN");
  const hasRole = (role: string) => computed(() => user.value?.role === role);
  const hasAnyRole = (roles: string[]) =>
    computed(() => roles.includes(user.value?.role));

  const login = async (email: string, password: string) => {
    error.value = null;
    loading.value = true;
    try {
      await $fetch(`/api/auth/login`, {
        method: "POST",
        body: { email, password },
        credentials: "include", // cookie de session Lucia
      });
      await getUser(); // rafraîchit user
    } catch (err: any) {
      error.value =
        err?.data?.error || err?.message || "Erreur lors de la connexion";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await $fetch(`/api/auth/logout`, {
        // ← proxy relatif
        method: "POST",
        credentials: "include",
      });
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  const getUser = async () => {
    loading.value = true;
    error.value = null;
    try {
      const headers = process.server
        ? useRequestHeaders(["cookie", "authorization"])
        : undefined;
      const res = await $fetch<{ user: any }>(`/api/auth/me`, {
        // ← proxy relatif
        headers,
        credentials: "include",
      });
      user.value = res.user ?? null;
    } catch {
      user.value = null;
    } finally {
      loading.value = false;
      loadedOnce.value = true;
    }
  };

  // À utiliser dans les layouts/middlewares pour garantir que user est chargé 1x
  const ensureUserLoaded = async () => {
    if (!loadedOnce.value && !loading.value) {
      await getUser();
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
