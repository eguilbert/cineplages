// server/api/[...path].js
export default defineEventHandler(async (event) => {
  const {
    public: { apiBase },
  } = useRuntimeConfig();
  const params = event.context.params || {};
  const path = Array.isArray(params.path)
    ? params.path.join("/")
    : params.path || "";
  const upstream = apiBase.replace(/\/+$/, "") + "/" + path;

  const method = event.node.req.method || "GET";

  // Corps brut pour POST/PUT/PATCH/DELETE
  let body;
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    body = await readRawBody(event); // Buffer|string
  }

  // Transfert des en-têtes utiles
  const headers = {
    cookie: getRequestHeader(event, "cookie") || "",
    authorization: getRequestHeader(event, "authorization") || "",
    "content-type": getRequestHeader(event, "content-type") || undefined,
  };

  const resp = await fetch(upstream, { method, headers, body });

  // ✅ PROPAGE TOUS les Set-Cookie (undici ne fournit pas toujours .raw())
  const scOne = resp.headers.get("set-cookie"); // souvent suffisant (1 cookie)
  if (scOne) {
    // Plusieurs cookies potentiels, séparés par virgules *mais* sans casser les virgules internes
    // On découpe prudemment sur ", " suivi d'un début de cookie (clé=)
    const cookies = scOne.split(/,\s*(?=[^;=]+=[^;]+)/g);
    for (const c of cookies) {
      appendResponseHeader(event, "set-cookie", c);
    }
  }

  // Statut & corps
  setResponseStatus(event, resp.status);
  const ct = resp.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return await resp.json();
  } else {
    const buf = Buffer.from(await resp.arrayBuffer());
    return send(event, buf, ct || undefined);
  }
});
