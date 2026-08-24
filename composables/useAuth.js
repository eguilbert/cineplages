// composables/useAuth.js
import { getApiErrorMessage } from "@/utils/apiError";

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
      const status = e?.statusCode || e?.status || e?.response?.status;
      if (status === 401 || status === 403) {
        // Un jeton expiré/invalide ne doit pas déclencher un appel /me à chaque
        // navigation. On le supprime et on invite l'utilisateur à se reconnecter.
        if (process.client) localStorage.removeItem("token");
        sessionCookie.value = null;
        error.value = "Votre session a expiré. Veuillez vous reconnecter.";
      } else {
        error.value = getApiErrorMessage(
          e,
          "Impossible de récupérer les informations de votre compte."
        );
      }
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
      error.value = getApiErrorMessage(e, "La connexion a échoué.");
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
