// composables/useMyInterests.js
export const useMyInterests = () => {
  const config = useRuntimeConfig();

  // état global partagé entre composants
  const interests = useState("myInterests:list", () => []); // [{id, user_id, film_id, value, createdAt}]
  const loading = useState("myInterests:loading", () => false);
  const error = useState("myInterests:error", () => null);
  const loaded = useState("myInterests:loaded", () => false); // pour éviter les refetchs inutiles

  // charge "mes intérêts" (idempotent par défaut)
  const fetchInterests = async (opts = { force: false }) => {
    if (loading.value) return interests.value;
    if (loaded.value && !opts.force) return interests.value;

    loading.value = true;
    error.value = null;

    try {
      const data = await $fetch(`${config.public.apiBase}/interests/my`, {
        credentials: "include", // cookie de session Lucia
        server: false,
      });
      interests.value = Array.isArray(data) ? data : [];
      loaded.value = true;
      console.log("fetchInterests: loaded", interests.value);
    } catch (e) {
      interests.value = [];
      loaded.value = false;
      error.value =
        e?.response?._data?.error || e?.data?.error || e?.message || "Erreur";
      if (e?.response?.status === 401) {
        // non connecté → redirection optionnelle
        const route = useRoute();
        await navigateTo(
          "/login?redirect=" + encodeURIComponent(route.fullPath)
        );
      }
    } finally {
      loading.value = false;
    }

    return interests.value;
  };

  // renvoie la valeur de mon intérêt pour un film
  const myInterestFor = (filmId) => {
    /*     console.log("myInterestFor", filmId, interests);
     */ const it = interests.value.find((i) => i.film_id === filmId);
    /* console.log("myInterestFor result", it); */
    return it ? it.value : null;
  };

  // mise à jour (optimiste) de mon intérêt
  const updateInterest = async (filmId, value) => {
    // snapshot pour rollback si besoin
    const prev = [...interests.value];

    // MAJ optimiste locale
    const idx = interests.value.findIndex((i) => i.film_id === filmId);
    const optimistic =
      idx >= 0
        ? { ...interests.value[idx], value }
        : {
            id: crypto.randomUUID(),
            user_id: "me", // sera remplacé au resync
            film_id: filmId,
            value,
            createdAt: new Date().toISOString(),
          };

    if (idx >= 0) interests.value.splice(idx, 1, optimistic);
    else interests.value.unshift(optimistic);

    try {
      await $fetch(`${config.public.apiBase}/interests`, {
        method: "POST",
        credentials: "include",
        body: { filmId, value },
        server: false,
      });

      // resync pour récupérer l’enregistrement exact depuis l’API
      await fetchInterests({ force: true });
    } catch (e) {
      // rollback si échec
      interests.value = prev;
      const msg =
        e?.response?._data?.error || e?.data?.error || e?.message || "Erreur";
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
    fetchInterests,
    updateInterest,
    myInterestFor,
    interestMap,
  };
};
