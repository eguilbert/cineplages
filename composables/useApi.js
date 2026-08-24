// composables/useApi.js
export const useApi = () => {
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

    // Utilise le proxy Nitro plutôt que l'URL Railway depuis le navigateur.
    // Cela évite les prérequis CORS et conserve le jeton Authorization.
    return await $fetch(normalized, {
      server: false,
      headers,
      ...opts,
    });
  };

  return { apiFetch };
};
