// composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig();
  const base = (config.public.apiBase || "").replace(/\/+$/, "");

  const apiFetch = <T = any>(path: string, opts: any = {}) => {
    // garantit que path commence par /api/ (même si on donne '/selections')
    const normalized = path.startsWith("/api/")
      ? path
      : path.startsWith("/")
      ? `/api${path}`
      : `/api/${path}`;

    const headers = process.server
      ? useRequestHeaders(["cookie", "authorization"])
      : undefined;

    return $fetch<T>(`${base}${normalized}`, {
      credentials: "include",
      headers,
      ...opts,
    });
  };

  return { apiFetch };
};
