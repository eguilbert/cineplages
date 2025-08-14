/* // server/api/__auth/me.get.js (NUXT)
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const {
    public: { apiBase },
  } = useRuntimeConfig(); // ✅ apiBase (camelCase)
  if (!apiBase) {
    throw createError({ statusCode: 500, statusMessage: "apiBase manquant" });
  }
  const upstream = apiBase.replace(/\/+$/, "") + "/auth/me";

  const headers = {
    cookie: getRequestHeader(event, "cookie") || "",
    authorization: getRequestHeader(event, "authorization") || "",
  };

  const resp = await fetch(upstream, { headers });

  // Propage Set-Cookie (clé pour la session Lucia)
  const setCookie = resp.headers.raw?.()["set-cookie"];
  if (setCookie) setResponseHeader(event, "set-cookie", setCookie);

  setResponseStatus(event, resp.status);
  return await resp.json();
});
 */
