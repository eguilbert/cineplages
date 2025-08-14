// composables/useInterestStats.ts
import { EMPTY_COUNTS, type InterestValue } from "@/lib/interests";

type Counts = Record<InterestValue, number>;

export const useInterestStats = () => {
  const { apiFetch } = useApi();

  const stats = useState<Record<number, Counts>>("interest:stats", () => ({}));
  const loading = useState<boolean>("interest:loading", () => false);
  const error = useState<string | null>("interest:error", () => null);

  const normalize = (partial?: Partial<Counts>): Counts =>
    ({ ...EMPTY_COUNTS, ...(partial || {}) } as Counts);

  /**
   * Charge les stats pour plusieurs films.
   * Accepte: [1,2,3] | ["1","2"] | "1,2,3"
   */
  async function fetchStatsForFilms(ids: number[] | string[] | string) {
    // → normalise en tableau de nombres valides
    const arr = Array.isArray(ids)
      ? ids
      : String(ids)
          .split(",")
          .map((s) => s.trim());
    const filmIds = arr
      .map((n) => Number(n))
      .filter((n) => Number.isFinite(n) && n >= 0);

    if (filmIds.length === 0) return {};

    loading.value = true;
    error.value = null;

    try {
      // API doit renvoyer un objet { [filmId]: Partial<Counts> }
      const data = await apiFetch<Record<number, Partial<Counts>>>(
        "/interests/films",
        { method: "POST", body: { ids: filmIds } }
      );

      const result: Record<number, Counts> = {};
      for (const id of filmIds) {
        result[id] = normalize(data?.[id]);
      }

      // merge réactif
      stats.value = { ...stats.value, ...result };
      return result;
    } catch (e: any) {
      error.value = e?.data?.error || e?.message || "Erreur";
      return {};
    } finally {
      loading.value = false;
    }
  }

  /**
   * Charge les stats pour un seul film.
   * Supporte payload { counts } ou { interests } côté API.
   */
  async function fetchStatsForFilm(filmId: number | string) {
    const id = Number(filmId);
    if (!Number.isFinite(id)) return normalize();

    loading.value = true;
    error.value = null;

    try {
      const data = await apiFetch<{
        filmId: number;
        counts?: Partial<Counts>;
        interests?: Partial<Counts>;
      }>(`/interests/film/${id}`);

      const payload = (data as any).counts ?? (data as any).interests;
      const c = normalize(payload);

      // écriture réactive clé par clé
      stats.value = { ...stats.value, [id]: c };
      return c;
    } catch (e: any) {
      error.value = e?.data?.error || e?.message || "Erreur";
      return normalize();
    } finally {
      loading.value = false;
    }
  }

  return { stats, loading, error, fetchStatsForFilms, fetchStatsForFilm };
};
