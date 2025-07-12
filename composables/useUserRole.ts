export const useUserRole = () => {
  const user = useSupabaseUser(); // ref<User|null>
  const client = useSupabaseClient();

  const role = ref<string | null>(null);
  const cinemaId = ref<number | null>(null);

  const isLoggedIn = computed(() => !!user.value); // ✅ ici

  const fetchRole = async () => {
    if (!user.value?.id) {
      role.value = null;
      cinemaId.value = null;
      return;
    }

    const { data, error } = await client
      .from("UserProfile")
      .select("role, cinemaId")
      .eq("user_id", user.value.id)
      .single();

    if (error) {
      console.warn("Erreur lors de la récupération du rôle :", error.message);
      role.value = null;
      cinemaId.value = null;
    } else {
      role.value = data?.role ?? null;
      cinemaId.value = data?.cinemaId ?? null;
    }
  };

  return {
    role,
    cinemaId,
    isLoggedIn, // ✅ n'oublie pas de le retourner
    fetchRole,
  };
};

/* export const useUserRole = () => {
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
 */
