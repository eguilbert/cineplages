import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, role } = body;

  // Utiliser la clé service_role (jamais côté client !)
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Étape 1 : créer l'utilisateur
  const { data: user, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError) {
    return { error: createError.message };
  }

  // Étape 2 : insérer le rôle
  const { error: roleError } = await supabase
    .from("user_roles")
    .insert({ user_id: user.user.id, role });

  if (roleError) {
    return { error: roleError.message };
  }

  return { message: "Utilisateur créé avec succès" };
});
