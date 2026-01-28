type FilmTagDTO = {
  id: number;
  label: string;
  category: string;
  validated: boolean;
  alreadyExisted?: boolean;
};

export const useFilmTagCatalog = () => {
  const { apiFetch } = useApi();

  const categories = useState<string[]>("filmtag_categories", () => []);
  const tagsByCategory = useState<Record<string, FilmTagDTO[]>>(
    "filmtag_tagsByCat",
    () => ({})
  );

  const fetchCategories = async () => {
    if (categories.value.length) return categories.value;
    const data = await apiFetch("/tags/categories");
    categories.value = Array.isArray(data) ? data : [];
    return categories.value;
  };

  const fetchTags = async (category: string, search = "") => {
    if (!category) return [];
    // cache seulement si pas de search
    if (!search && tagsByCategory.value[category])
      return tagsByCategory.value[category];

    const qs = new URLSearchParams();
    qs.set("category", category);
    if (search) qs.set("search", search);

    const data = await apiFetch(`/tags?${qs.toString()}`);
    const list = Array.isArray(data) ? (data as FilmTagDTO[]) : [];

    if (!search) tagsByCategory.value[category] = list;
    return list;
  };

  const createTag = async (label: string, category: string) => {
    const tag = (await apiFetch("/tags", {
      method: "POST",
      body: { label, category },
    })) as FilmTagDTO;

    // Invalide / refresh cache catégorie
    if (category) {
      const existing = tagsByCategory.value[category] || [];
      // Si tag unique global déjà existant mais autre catégorie, il peut ne pas être dans cette liste.
      // On l'ajoute quand même au cache de la catégorie choisie pour que l'UI puisse le sélectionner,
      // mais côté DB il restera avec sa vraie category.
      const already = existing.find((t) => t.id === tag.id);
      tagsByCategory.value[category] = already
        ? existing
        : [tag, ...existing].sort((a, b) => a.label.localeCompare(b.label));
    }

    // Met à jour categories si nouvelle catégorie (cas rare)
    if (tag?.category && !categories.value.includes(tag.category)) {
      categories.value = [...categories.value, tag.category].sort((a, b) =>
        a.localeCompare(b)
      );
    }

    return tag;
  };

  return { categories, tagsByCategory, fetchCategories, fetchTags, createTag };
};
