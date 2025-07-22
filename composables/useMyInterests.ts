export const useMyInterests = () => {
  const config = useRuntimeConfig();
  const supabase = useSupabaseClient();

  const fetchInterests = async () => {
    const token = (await supabase.auth.getSession()).data.session?.access_token;

    const interests = await $fetch(`${config.public.apiBase}/interests/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return interests;
  };

  const updateInterest = async (filmId: number, value: string) => {
    const token = (await supabase.auth.getSession()).data.session?.access_token;

    console.log("Updating interest for filmId:", filmId, "with value:", value);

    await $fetch(`${config.public.apiBase}/interests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        filmId,
        value,
      },
    });
  };

  return {
    fetchInterests,
    updateInterest,
  };
};
