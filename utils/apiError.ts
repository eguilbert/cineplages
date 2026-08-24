/** Transforme les erreurs $fetch en messages adaptés aux utilisateurs. */
export const getApiErrorMessage = (error: any, fallback = "Une erreur est survenue.") => {
  const status = error?.statusCode || error?.status || error?.response?.status;
  const apiMessage = error?.data?.error || error?.data?.message;

  if (status === 401) return "Adresse email ou mot de passe incorrect.";
  if (status === 403) return "Vous n’avez pas l’autorisation d’effectuer cette action.";
  if (status === 409) return apiMessage || "Cette information est déjà utilisée.";
  if (status === 422) return apiMessage || "Certaines informations saisies sont invalides.";
  if (status === 429) return "Trop de tentatives. Veuillez patienter quelques instants.";
  if (status >= 500) return "Le service rencontre un problème. Réessayez dans quelques instants.";

  // $fetch ne fournit pas de statut lorsqu’il ne reçoit aucune réponse.
  if (!status || error?.name === "FetchError" || error?.message === "Failed to fetch") {
    return "Impossible de joindre le service. Vérifiez votre connexion puis réessayez.";
  }

  return apiMessage || fallback;
};
