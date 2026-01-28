type FilmTagDTO = {
  id: number;
  label: string;
  category: string;
  validated: boolean;
};

export const useFilmTagging = () => {
  const { apiFetch } = useApi();

  const getFilmTags = async (filmId: number) => {
    const data = await apiFetch(`/films/${filmId}/tags`);
    return Array.isArray(data) ? (data as FilmTagDTO[]) : [];
  };

  const addTagsToFilm = async (filmId: number, tagIds: number[]) => {
    const data = await apiFetch(`/films/${filmId}/tags`, {
      method: "POST",
      body: { tagIds },
    });
    // après patch backend: renvoie FilmTag[]
    return Array.isArray(data) ? (data as FilmTagDTO[]) : [];
  };

  const removeTagFromFilm = async (filmId: number, tagId: number) => {
    await apiFetch(`/films/${filmId}/tags/${tagId}`, { method: "DELETE" });
    return true;
  };

  return { getFilmTags, addTagsToFilm, removeTagFromFilm };
};
