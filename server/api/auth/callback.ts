// server/api/auth/callback.ts
import { createClient } from "@supabase/supabase-js";
import { defineEventHandler, getQuery, sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const { access_token, refresh_token } = query;

  if (!access_token || !refresh_token) {
    return sendRedirect(event, "/login?error=missing_tokens", 302);
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRole,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  // Optionnel : on vérifie que les tokens sont valides
  try {
    const { data, error } = await supabase.auth.setSession({
      access_token: String(access_token),
      refresh_token: String(refresh_token),
    });

    if (error) {
      console.error("Erreur setSession:", error.message);
      return sendRedirect(event, "/login?error=session_failed", 302);
    }

    // Redirige vers la page finale avec les tokens pour créer une session côté client
    return sendRedirect(
      event,
      `/reset-password-final?access_token=${access_token}&refresh_token=${refresh_token}`,
      302
    );
  } catch (e) {
    console.error("Erreur serveur:", e);
    return sendRedirect(event, "/login?error=exception", 302);
  }
});
