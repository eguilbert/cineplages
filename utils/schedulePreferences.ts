export const horaires = ["14:00", "17:00", "20:00"];
export const jours = [
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
export const salles = ["Salle 1", "Salle 2"];

// Préférences de catégorie pour chaque créneau (tu peux les ajuster plus tard dans un panel admin)
export const preferenceMap: Record<string, string> = {};

for (const jour of jours) {
  for (const heure of horaires) {
    preferenceMap[`${jour}-14:00-Salle 1`] = "Jeunesse";
    preferenceMap[`${jour}-17:00-Salle 1`] = "Art et Essai";
    preferenceMap[`${jour}-20:00-Salle 1`] = "Grand Public";

    preferenceMap[`${jour}-14:00-Salle 2`] = "Documentaire";
    preferenceMap[`${jour}-17:00-Salle 2`] = "Grand Public";
    preferenceMap[`${jour}-20:00-Salle 2`] = "Art et Essai";
  }
}
