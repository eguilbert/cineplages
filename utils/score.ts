export const interestWeights = {
  SANS_OPINION: 0,
  NOT_INTERESTED: -1,
  CURIOUS: 1,
  VERY_INTERESTED: 2,
  MUST_SEE: 3,
};

const toNum = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Normalise: nombres + clés manquantes = 0 */
export function normalizeInterestStats(stats: Record<string, any> = {}) {
  const base = {
    SANS_OPINION: 0,
    NOT_INTERESTED: 0,
    CURIOUS: 0,
    VERY_INTERESTED: 0,
    MUST_SEE: 0,
  };
  const out: Record<string, number> = { ...base };
  for (const [k, v] of Object.entries(stats)) out[k] = toNum(v);
  return out;
}

// ⭐️ Popularité (somme)
export function computePopularityScore(stats?: Record<string, any>): number {
  const s = normalizeInterestStats(stats);
  return Object.entries(s).reduce(
    (sum, [k, c]) => sum + (interestWeights as any)[k] * toNum(c),
    0
  );
}
export function getInterestCount(stats?: Record<string, any>): number {
  const s = normalizeInterestStats(stats);
  return Object.values(s).reduce((sum, n) => sum + toNum(n), 0);
}

/** FACTEURS: intérêt = 1 (=> 1/2/3), note = 0.3 (optionnel) */
const INTEREST_FACTOR = 1; // ← clé : 1,2,3 exactement
const RATING_FACTOR = 0.3; // mets 0 si tu ne veux pas de note

export function computeAggregateScore(
  interestStats?: Record<string, any>,
  avgRating: number | null = 0
): number {
  const s = normalizeInterestStats(interestStats);

  const total = Object.entries(s).reduce((sum, [key, count]) => {
    const w = (interestWeights as Record<string, number>)[key] ?? 0;
    return sum + w * toNum(count);
  }, 0);

  const count = getInterestCount(s);
  const avgInterest = count > 0 ? total / count : 0; // → attendu: 1 / 2 / 3

  const final =
    avgInterest * INTEREST_FACTOR + (avgRating ?? 0) * RATING_FACTOR;
  return Math.round(final);
}
