// computeScore.ts
export function computeAggregateScore(
  interestStats: Record<string, number>,
  avgRating: number | null = 0
): number {
  const weights = {
    SANS_OPINION: 0,
    NOT_INTERESTED: -1,
    CURIOUS: 1,
    MUST_SEE: 2,
  };

  const total = Object.entries(interestStats || {}).reduce(
    (sum, [key, count]) => sum + (weights[key] ?? 0) * count,
    0
  );

  const count = Object.values(interestStats || {}).reduce(
    (sum, n) => sum + n,
    0
  );

  const avgInterestScore = count > 0 ? total / count : 0;

  const ratingWeight = avgRating ?? 0;

  // pondération : 70% intérêt + 30% note sur 10
  return Math.round(avgInterestScore * 2 + ratingWeight * 1);
}
