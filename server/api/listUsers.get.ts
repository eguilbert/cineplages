import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  // 1. Liste des rôles
  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("user_id, role");

  if (rolesError) {
    return { error: rolesError.message };
  }

  // 2. Liste des utilisateurs (nécessite service_role)
  const { data: userData, error: usersError } =
    await supabase.auth.admin.listUsers();

  if (usersError) {
    return { error: usersError.message };
  }

  // 3. Fusion des deux listes
  const users = userData.users.map((u: any) => {
    const userRole = roles.find((r: any) => r.user_id === u.id);
    return {
      id: u.id,
      email: u.email,
      role: userRole?.role ?? "AUCUN",
      newRole: userRole?.role ?? "AUCUN",
    };
  });

  return { users };
});
