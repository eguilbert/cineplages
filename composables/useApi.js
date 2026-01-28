// composables/useApi.js
export const useApi = () => {
  const {
    public: { apiBase },
  } = useRuntimeConfig();
  const base = (apiBase || "").replace(/\/+$/, "");

  const apiFetch = async (path, opts = {}) => {
    // Normaliser l'URL
    const normalized = path.startsWith("/api/")
      ? path
      : path.startsWith("/")
      ? `/api${path}`
      : `/api/${path}`;

    // Récupérer le token (côté client uniquement)
    const token = process.client ? localStorage.getItem("token") : null;

    // Construire les headers
    const headers = {
      ...(opts.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return await $fetch(`${base}${normalized}`, {
      server: false,
      headers,
      ...opts,
    });
  };

  return { apiFetch };
};
