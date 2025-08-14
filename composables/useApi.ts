// composables/useApi.ts (JS/TS)
export const useApi = () => {
  const config = useRuntimeConfig();
  const base = (config.public.apiBase || "").replace(/\/+$/, "");

  const apiFetch = (path, opts = {}) => {
    const normalized = path.startsWith("/api/")
      ? path
      : path.startsWith("/")
      ? `/api${path}`
      : `/api/${path}`;

    const headers = process.server
      ? useRequestHeaders(["cookie", "authorization"])
      : undefined;

    // ⬇️ retourne directement les données
    return $fetch(`${base}${normalized}`, {
      credentials: "include",
      headers,
      ...opts,
    });
  };

  // Option si tu as parfois besoin du statut:
  const apiFetchRaw = (path, opts = {}) =>
    $fetch.raw(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
      credentials: "include",
      ...opts,
    });

  return { apiFetch, apiFetchRaw };
};
