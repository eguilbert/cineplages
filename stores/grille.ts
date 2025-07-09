import { defineStore } from "pinia";
import {
  preferenceMap,
  horaires,
  jours,
  salles,
} from "@/utils/schedulePreferences";
import { getGenreColor } from "@/utils/genreColors";
console.log("pref", preferenceMap);

export const useGrilleStore = defineStore("grille", {
  state: () => ({
    programmation: [] as any[],
    preferences: {},
    selectionActive: null, // { id, name, films: [ { tmdb_id, title, ... } ] }
  }),
  actions: {
    async saveActiveSelection() {
      if (!this.selectionActive || !this.selectionActive.id) {
        console.warn("Aucune sélection active à sauvegarder.");
        return;
      }

      try {
        const response = await fetch(
          `/api/selections/${this.selectionActive.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.selectionActive),
          }
        );

        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.statusText}`);
        }

        console.log("Sélection mise à jour avec succès.");
      } catch (err) {
        console.error("Erreur lors de la sauvegarde de la sélection :", err);
        alert("Erreur lors de la sauvegarde de la sélection.");
      }
    },
    setPreferences(prefMap) {
      this.preferences = prefMap;
    },
    loadFromSelection(films) {
      if (!Array.isArray(films)) return;

      const filmsToInject = films.flatMap((film) =>
        Array.from({ length: film.seances }, () => ({ ...film }))
      );
      console.log("films + seaces:", filmsToInject);
      console.log("FROM STORE films:", films);
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

      // const filmsRestants = [...films]; // pour éviter de modifier l’original

      const occupationGenres = new Set(); // évite les doublons même genre / même plage horaire

      const programmation = [];

      for (const jour of jours) {
        for (const heure of heures) {
          for (const salle of salles) {
            const slotKey = `${jour}-${heure}-${salle}`;
            const preference = preferenceMap[slotKey];
            console.log("!!!!Preferences", preference);
            console.log("!!!!filmsRestants", slotKey, filmsToInject);

            // Trouver un film qui n’a pas encore été programmé, correspond à la catégorie,
            // et qui ne crée pas un doublon de genre au même créneau dans l’autre salle
            const filmIndex = filmsToInject.findIndex(
              (f) =>
                (!preference ||
                  f.category === preference ||
                  f.genre === preference) &&
                !occupationGenres.has(
                  `${jour}-${heure}-${f.category || f.genre}`
                )
            );
            console.log("filmIndex", filmIndex);
            if (filmIndex !== -1) {
              const film = filmsToInject.splice(filmIndex, 1)[0];
              console.log("film restant", film);
              console.log(
                "film restant couleur",
                getGenreColor(film.category || film.genre)
              );
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
