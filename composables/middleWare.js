const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { data, error } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", user.value?.id)
  .single();

const role = data?.role;
