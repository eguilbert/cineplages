import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const { user_id, role } = await readBody(event);
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey
  );

  const { error } = await supabase
    .from("user_roles")
    .update({ role })
    .eq("user_id", user_id);

  return { error };
});
