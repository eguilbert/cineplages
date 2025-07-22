export const useUserRole = () => {
  const user = useSupabaseUser(); //ref<User|null>
  const client = useSupabaseClient();

  const role = ref<string | null>(null);
  const cinemaId = ref<number | null>(null);
  const username = ref<string | null>(null);
  const userId = ref<string | null>(null);

  const isLoggedIn = computed(() => !!user.value); // ✅ ici

  const fetchRole = async () => {
    if (!user.value?.id) {
      role.value = null;
      cinemaId.value = null;
      username.value = null;
      userId.value = null;
      return;
    }

    const { data, error } = await client
      .from("UserProfile")
      .select("role, cinemaId, username")
      .eq("user_id", user.value.id)
      .single();

    if (error) {
      console.warn("Erreur lors de la récupération du rôle :", error.message);
      role.value = null;
      cinemaId.value = null;
      username.value = null;
    } else {
      role.value = data?.role ?? null;
      cinemaId.value = data?.cinemaId ?? null;
      username.value = data?.username ?? null;
      userId.value = user.value.id ?? null;
      console.log("Rôle récupéré :", role.value);
      console.log("ID du cinéma récupéré :", cinemaId.value);
      console.log("Nom d'utilisateur récupéré :", username.value);
    }
  };

  return {
    role,
    cinemaId,
    username,
    userId,
    user, // ✅ n'oublie pas de le retourner
    isLoggedIn, // ✅ n'oublie pas de le retourner
    fetchRole,
  };
};
