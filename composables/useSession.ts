import { useFetch } from "nuxt/app";

export const useSession = async () => {
  const headers = process.server
    ? useRequestHeaders(["cookie", "authorization"])
    : undefined;

  const { data, error } = await useFetch("/api/auth/me", {
    headers, // cookies/Authorization forward en SSR
    credentials: "include", // inoffensif; ok de l’enlever aussi
    server: false,
  });

  return {
    user: data.value?.user || null,
    error,
  };
};
