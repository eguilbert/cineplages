export const useUserRole = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const role = ref<string | null>(null);

  const fetchRole = async () => {
    if (!user.value?.id) {
      role.value = null;
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.value.id)
      .single();

    role.value = data?.role ?? null;
    if (error) console.warn("Erreur récupération rôle :", error.message);
  };

  const isLoggedIn = computed(() => !!user.value);

  return {
    user,
    role,
    isLoggedIn,
    fetchRole,
  };
};
