// composables/useAuth.js
export const useAuth = () => {
  const sessionCookie = useCookie("session", { path: "/", sameSite: "lax" });

  const user = useState("auth:user", () => null);
  const loading = useState("auth:loading", () => false);
  const error = useState("auth:error", () => null);
  const loadedOnce = useState("auth:loadedOnce", () => false);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "ADMIN");
  const hasRole = (role) => computed(() => user.value?.role === role);
  const hasAnyRole = (roles) =>
    computed(() =>
      user.value?.role ? roles.includes(user.value.role) : false
    );

  const getToken = () =>
    process.client ? localStorage.getItem("token") : null;

  // 👉 $fetch uniquement côté client (sinon pas de localStorage → pas de token)
  const apiFetch = async (path, opts = {}) => {
    // Passe par le proxy Nitro (/server/api/[...path].js). Le navigateur reste
    // sur cineplages.vercel.app et ne dépend donc pas de la configuration CORS
    // de l'API Railway.
    const url = path.startsWith("/api/") ? path : `/api${path}`;
    const token = getToken();

    return await $fetch(url, {
      server: false, // ⬅️ clé: n’exécute JAMAIS cette requête en SSR
      headers: {
        ...(opts.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...opts,
    });
  };

  const getUser = async () => {
    // Pas de token → pas d’appel API
    const token = getToken();
    if (!token) {
      user.value = null;
      loadedOnce.value = true;
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const res = await apiFetch("/api/auth/me");
      user.value = res?.user ?? null;
    } catch (e) {
      user.value = null;
      error.value =
        e?.data?.error || e?.message || "Impossible de récupérer l'utilisateur";
    } finally {
      loading.value = false;
      loadedOnce.value = true;
    }
  };

  const ensureUserLoaded = async () => {
    if (process.server) return; // ⬅️ jamais en SSR
    if (!loadedOnce.value && !loading.value) {
      await getUser();
    }
  };

  const login = async (email, password) => {
    error.value = null;
    loading.value = true;
    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (response.token) {
        localStorage.setItem("token", response.token);
        sessionCookie.value = response.token;
      }

      await getUser();
      return response;
    } catch (e) {
      error.value =
        e?.data?.error || e?.message || "Erreur lors de la connexion";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionCookie.value = null;
    user.value = null;
    loadedOnce.value = false;
  };

  // 🔥 Auto-init côté client après reload si un token existe
  if (process.client) {
    // on ne dépend PAS de loadedOnce ici, on relance au mount client
    queueMicrotask(() => {
      const token = getToken();
      if (token) {
        if (!sessionCookie.value) sessionCookie.value = token;
        getUser();
      } else loadedOnce.value = true;
    });
  }

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
