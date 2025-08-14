export default defineEventHandler(async (event) => {
  const reqUrl = event.node.req.url || "";
  if (!reqUrl.startsWith("/api/")) return; // on ne proxy que /api/**

  const config = useRuntimeConfig();
  const upstream = config.public.API_BASE + reqUrl; // conserve /api/xxx
  const method = event.node.req.method || "GET";

  // Récupérer le body brut si nécessaire
  let body;
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    body = await readRawBody(event); // Buffer | string
  }

  // Construire les en-têtes à forwarder
  const headers = {
    // important pour l’auth cookie + bearer
    cookie: getRequestHeader(event, "cookie") || "",
    authorization: getRequestHeader(event, "authorization") || "",
    // content-type si présent
    "content-type": getRequestHeader(event, "content-type") || undefined,
  };

  const resp = await fetch(upstream, { method, headers, body });

  // Recopier les Set-Cookie (clé pour persister la session côté 3000)
  const setCookie = resp.headers.raw()["set-cookie"];
  if (setCookie) {
    // peut être un tableau
    setResponseHeader(event, "set-cookie", setCookie);
  }

  // Statut et corps
  setResponseStatus(event, resp.status);
  const ct = resp.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return await resp.json();
  } else {
    const buf = Buffer.from(await resp.arrayBuffer());
    return send(event, buf, ct || undefined);
  }
});
