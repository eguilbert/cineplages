export const useInterestStats = async (filmId: number) => {
  const config = useRuntimeConfig();
  const { user } = useSupabaseUser();

  const { data, error } = await $fetch(
    `${config.public.apiBase}/interests/film/${filmId}`
  );
  const others = data.value?.interests?.filter(
    (i) => i.user_id !== user.value.id
  );

  const counts = {
    SANS_OPINION: 0,
    NOT_INTERESTED: 0,
    CURIOUS: 0,
    MUST_SEE: 0,
  };
  const labels = {
    SANS_OPINION: "🕳 Sans opinion",
    NOT_INTERESTED: "❌ Pas intéressé",
    CURIOUS: "🤔 Curieux",
    MUST_SEE: "✅ Très envie",
  };
  for (const interest of others) {
    if (counts[interest.value] !== undefined) {
      counts[interest.value]++;
    }
  }
  return {
    counts,
    labels,
    error,
  };
};
