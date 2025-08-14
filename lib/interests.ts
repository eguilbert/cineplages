// lib/interests.ts
export type InterestValue =
  | "SANS_OPINION"
  | "NOT_INTERESTED"
  | "CURIOUS"
  | "VERY_INTERESTED"
  | "MUST_SEE";

export type InterestInfo = {
  value: InterestValue;
  label: string;
  icon: string; // simple emoji ici (utilisable en UI)
  weight: number; // pour calcul de score local si tu veux
};

export const INTERESTS: InterestInfo[] = [
  { value: "SANS_OPINION", label: "Sans opinion", icon: "🕳", weight: 0 },
  { value: "NOT_INTERESTED", label: "Pas intéressé", icon: "❌", weight: -1 },
  { value: "CURIOUS", label: "Pourquoi pas", icon: "🤔", weight: 1 },
  { value: "VERY_INTERESTED", label: "Intéressé", icon: "✅", weight: 2 },
  { value: "MUST_SEE", label: "Incontournable", icon: "🌟", weight: 3 },
];

export const INTEREST_VALUES = INTERESTS.map((i) => i.value);
export const INTEREST_SET = new Set<InterestValue>(INTEREST_VALUES);

export const INTEREST_LABEL: Record<InterestValue, string> = Object.fromEntries(
  INTERESTS.map((i) => [i.value, `${i.icon} ${i.label}`])
) as any;

export const EMPTY_COUNTS: Record<InterestValue, number> = {
  SANS_OPINION: 0,
  NOT_INTERESTED: 0,
  CURIOUS: 0,
  VERY_INTERESTED: 0,
  MUST_SEE: 0,
};

// Utilitaire (optionnel) pour score local si besoin
export function interestScore(
  counts: Partial<Record<InterestValue, number>> = {}
) {
  const by = (v: InterestValue) => counts[v] ?? 0;
  return (
    by("MUST_SEE") * 3 +
    by("VERY_INTERESTED") * 2 +
    by("CURIOUS") * 1 +
    by("NOT_INTERESTED") * -1 +
    by("SANS_OPINION") * 0
  );
}
