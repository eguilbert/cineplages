// composables/useAdminApi.ts

export const useAdminApi = () => {
  const message = ref("");
  const error = ref("");

  const createUser = async (email: string, password: string, role: string) => {
    message.value = "";
    error.value = "";

    try {
      const res = await $fetch("/api/createUser", {
        method: "POST",
        body: { email, password, role },
      });

      if (res?.error) {
        error.value = res.error;
      } else {
        message.value = "Utilisateur créé avec succès.";
      }
    } catch (err: any) {
      error.value = err.message || "Erreur inconnue";
    }
  };
  const updateUserRole = async (user_id: string, role: string) => {
    const res = await $fetch("/api/updateUserRole", {
      method: "POST",
      body: { user_id, role },
    });
    if (res.error) console.error("Erreur MAJ rôle :", res.error);
  };

  return {
    createUser,
    message,
    error,
  };
};
