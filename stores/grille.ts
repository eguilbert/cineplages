import { defineStore } from "pinia";
import {
  preferenceMap,
  horaires,
  jours,
  salles,
} from "@/utils/schedulePreferences";
import { getGenreColor } from "@/utils/genreColors";

export const useGrilleStore = defineStore("grille", {
  state: () => ({
    programmation: [] as any[],
    preferences: {},
  }),
  actions: {
    setPreferences(prefMap) {
      this.preferences = prefMap;
    },
    loadFromSelection(films) {
      if (!Array.isArray(films)) return;
      console.log("films:", films);
      const jours = [
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche",
      ];
      const heures = ["14:00", "17:00", "20:00"];
      const salles = ["Salle 1", "Salle 2"];

      const filmsRestants = [...films]; // pour éviter de modifier l’original
      const occupationGenres = new Set(); // évite les doublons même genre / même plage horaire

      const programmation = [];

      for (const jour of jours) {
        for (const heure of heures) {
          for (const salle of salles) {
            const slotKey = `${jour}-${heure}-${salle}`;
            const preference = this.preferences[slotKey];

            // Trouver un film qui n’a pas encore été programmé, correspond à la catégorie,
            // et qui ne crée pas un doublon de genre au même créneau dans l’autre salle
            const filmIndex = filmsRestants.findIndex(
              (f) =>
                (!preference ||
                  f.category === preference ||
                  f.genre === preference) &&
                !occupationGenres.has(
                  `${jour}-${heure}-${f.category || f.genre}`
                )
            );

            if (filmIndex !== -1) {
              const film = filmsRestants.splice(filmIndex, 1)[0];
              programmation.push({
                ...film,
                jour,
                heure,
                salle,
                color: getGenreColor(film.category || film.genre),
              });

              // Marquer ce genre comme déjà utilisé à ce moment-là
              occupationGenres.add(
                `${jour}-${heure}-${film.category || film.genre}`
              );
            }
          }
        }
      }

      this.programmation = programmation;
    },
  },
});
