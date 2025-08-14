/* import { useFetch, useRuntimeConfig } from "nuxt/app";

export const useSession = async () => {
  const config = useRuntimeConfig();
  const { data, error } = await useFetch("/auth/me", {
    baseURL: config.public.apiBase,
    credentials: "include",
  });

  return {
    user: data.value?.user || null,
    error,
  };
};
 */

import { useFetch } from "nuxt/app";

export const useSession = async () => {
  const headers = process.server
    ? useRequestHeaders(["cookie", "authorization"])
    : undefined;

  const { data, error } = await useFetch("/api/auth/me", {
    headers, // cookies/Authorization forward en SSR
    credentials: "include", // inoffensif; ok de l’enlever aussi
  });

  return {
    user: data.value?.user || null,
    error,
  };
};
