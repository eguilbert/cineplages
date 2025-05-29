export const genreColorMap: Record<string, string> = {
  Drame: "#a78bfa",
  Comédie: "#facc15",
  Action: "#f87171",
  Animation: "#60a5fa",
  Documentaire: "#34d399",
  Horreur: "#f43f5e",
  "Comédie romantique": "#fb7185",
  Musical: "#38bdf8",
  Historique: "#a3e635",
  Fantasy: "#f472b6",
  Thriller: "#f97316",
  // valeurs par défaut
  default: "#d1d5db",
};
export const genreList: string[] = Object.keys(genreColorMap).filter(
  (g) => g !== "default"
);

export const getGenreColor = (genre: string): string =>
  genreColorMap[genre] || genreColorMap.default;
