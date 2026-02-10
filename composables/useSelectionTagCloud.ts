// ~/composables/useSelectionTagCloud.js

/**
 * buildTagCloud(films)
 * films: [{ tags: [{id,label,category}] }]
 *
 * Retourne: [{ id, label, category, count, weight }]
 * - count = nb de films qui contiennent ce tag (pas nb d'occurrences)
 * - weight = 1..5 (pour piloter la taille visuelle)
 */
export function buildTagCloud(films = []) {
  const map = new Map(); // id -> { id,label,category,count, _filmIds:Set }

  for (const film of films) {
    const tags = Array.isArray(film?.tags) ? film.tags : [];
    const filmId = film?.id ?? Symbol("film");

    for (const t of tags) {
      if (!t?.id) continue;
      const id = Number(t.id);
      const label = String(t.label ?? "").trim();
      if (!label) continue;

      const category = String(t.category ?? "Autres");
      const key = id;

      if (!map.has(key)) {
        map.set(key, {
          id,
          label,
          category,
          count: 0,
          _filmIds: new Set(),
        });
      }
      const rec = map.get(key);

      // 1 film ne compte qu’une fois par tag
      if (!rec._filmIds.has(filmId)) {
        rec._filmIds.add(filmId);
        rec.count += 1;
      }
    }
  }

  const items = [...map.values()].map((x) => {
    const { _filmIds, ...rest } = x;
    return rest;
  });

  // poids 1..5 basé sur min/max
  const counts = items.map((i) => i.count);
  const min = Math.min(...counts, 1);
  const max = Math.max(...counts, 1);

  const toWeight = (c) => {
    if (max === min) return 3;
    const t = (c - min) / (max - min); // 0..1
    return 1 + Math.round(t * 4); // 1..5
  };

  const withWeight = items.map((i) => ({ ...i, weight: toWeight(i.count) }));

  // tri sympa: gros tags d’abord, puis alpha
  withWeight.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.label.localeCompare(b.label, "fr");
  });

  return withWeight;
}
