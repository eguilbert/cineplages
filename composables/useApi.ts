// composables/useApi.ts
export const useApi = () => {
  const {
    public: { apiBase },
  } = useRuntimeConfig();
  const base = (apiBase || "").replace(/\/+$/, "");

  const apiFetch = <T = any>(path: string, opts: any = {}) => {
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
