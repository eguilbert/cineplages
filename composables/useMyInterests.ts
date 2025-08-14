// composables/useMyInterests.js
export const useMyInterests = () => {
  // utilise le helper centralisé (gère apiBase, credentials, headers SSR)
  const { apiFetch } = useApi();

  // état global partagé entre composants
  const interests = useState("myInterests:list", () => []); // [{id,user_id,film_id,value,createdAt}]
  const loading = useState("myInterests:loading", () => false);
  const error = useState("myInterests:error", () => null);
  const loaded = useState("myInterests:loaded", () => false); // évite les refetchs inutiles

  // charge "mes intérêts" (idempotent par défaut)
  const fetchInterests = async (opts = { force: false }) => {
    if (loading.value) return interests.value;
    if (loaded.value && !opts.force) return interests.value;

    loading.value = true;
    error.value = null;

    try {
      // ✅ appelle l'API Railway, route correcte `/api/interests/my`
      const data = await apiFetch("/interests/my");
      interests.value = Array.isArray(data) ? data : [];
      loaded.value = true;
      // console.log("fetchInterests:", interests.value);
    } catch (e) {
      interests.value = [];
      loaded.value = false;

      // message lisible
      error.value = e?.data?.error || e?.message || "Erreur";

      // ✅ redirection login uniquement côté client (sinon SSR bloque)
      if (
        process.client &&
        (e?.status === 401 || e?.response?.status === 401)
      ) {
        const route = useRoute();
        navigateTo("/login?next=" + encodeURIComponent(route.fullPath));
      }
    } finally {
      loading.value = false;
    }

    return interests.value;
  };

  // renvoie la valeur de mon intérêt pour un film
  const myInterestFor = (filmId) => {
    const it = interests.value.find((i) => i.film_id === filmId);
    return it ? it.value : null;
  };

  // mise à jour (optimiste) de mon intérêt
  const updateInterest = async (filmId, value) => {
    // snapshot pour rollback
    const prev = [...interests.value];

    // MAJ optimiste locale
    const idx = interests.value.findIndex((i) => i.film_id === filmId);
    const optimistic =
      idx >= 0
        ? { ...interests.value[idx], value }
        : {
            id: crypto.randomUUID(),
            user_id: "me", // remplacé au resync
            film_id: filmId,
            value,
            createdAt: new Date().toISOString(),
          };

    if (idx >= 0) interests.value.splice(idx, 1, optimistic);
    else interests.value.unshift(optimistic);

    try {
      // ✅ POST direct (pas de JSON.stringify, $fetch sérialise)
      await apiFetch("/interests", {
        method: "POST",
        body: { filmId, value },
      });

      // resync depuis l’API (source de vérité)
      await fetchInterests({ force: true });
    } catch (e) {
      // rollback si échec
      interests.value = prev;
      const msg = e?.data?.error || e?.message || "Erreur";
      throw new Error(msg);
    }
  };

  // pratique: renvoie une map { [film_id]: value }
  const interestMap = computed(() =>
    Object.fromEntries(interests.value.map((i) => [i.film_id, i.value]))
  );

  return {
    interests,
    loading,
    error,
    loaded,
    fetchInterests,
    updateInterest,
    myInterestFor,
    interestMap,
  };
};
