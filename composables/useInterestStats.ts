export const useInterestStats = async (filmId: number) => {
  const config = useRuntimeConfig();
  const { data, error } = await $fetch(
    `${config.public.apiBase}/interests/film/${filmId}`
  );

  const labels = {
    SANS_OPINION: "🕳 Sans opinion",
    NOT_INTERESTED: "❌ Pas intéressé",
    CURIOUS: "🤔 Curieux",
    MUST_SEE: "✅ Très envie",
  };

  return {
    counts: data.value?.interests || {},
    labels,
    error,
  };
};
