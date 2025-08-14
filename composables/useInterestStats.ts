// composables/useInterestStats.ts
import { EMPTY_COUNTS, type InterestValue } from "@/lib/interests";

type Counts = Record<InterestValue, number>;

/**
 * Stats d'intérêts (agrégats). Supporte:
 *  - fetchStatsForFilms(ids[]) -> { [filmId]: Counts }
 *  - fetchStatsForFilm(id)     -> Counts
 */
export const useInterestStats = () => {
  const config = useRuntimeConfig();
  const stats = useState<Record<number, Counts>>("interest:stats", () => ({}));
  const loading = useState("interest:loading", () => false);
  const error = useState<string | null>("interest:error", () => null);

  async function fetchStatsForFilms(filmIds: number[]) {
    if (!Array.isArray(filmIds) || filmIds.length === 0) return {};
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch<Record<number, Partial<Counts>>>(
        `${config.public.apiBase}/interests/films`,
        { method: "POST", body: { ids: filmIds } }
      );
      // normalise + complète avec EMPTY_COUNTS
      const result: Record<number, Counts> = {};
      for (const id of filmIds) {
        result[id] = { ...EMPTY_COUNTS, ...(data?.[id] ?? {}) } as Counts;
      }
      stats.value = { ...stats.value, ...result };
      return result;
    } catch (e: any) {
      error.value =
        e?.response?._data?.error || e?.data?.error || e?.message || "Erreur";
      return {};
    } finally {
      loading.value = false;
    }
  }

  async function fetchStatsForFilm(filmId: number) {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch<{ filmId: number; interests: Partial<Counts> }>(
        `${config.public.apiBase}/interests/film/${filmId}`
      );
      const c = { ...EMPTY_COUNTS, ...(data?.interests ?? {}) } as Counts;
      stats.value[filmId] = c;
      console.log("fetchStatsForFilm", filmId, stats.value[filmId]);
      return c;
    } catch (e: any) {
      error.value =
        e?.response?._data?.error || e?.data?.error || e?.message || "Erreur";
      return { ...EMPTY_COUNTS } as Counts;
    } finally {
      loading.value = false;
    }
  }

  return { stats, loading, error, fetchStatsForFilms, fetchStatsForFilm };
};
