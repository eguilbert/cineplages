import { reactive, ref, onMounted } from "vue";

export function useFilms() {
  const films = reactive([]);
  const newFilm = ref({
    title: "",
    director: "",
    genre: "",
    duration: null,
    synopsis: "",
  });

  const loadFilms = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/films");
      const data = await res.json();
      data.forEach((film, i) => {
        films.push({ ...film, remaining: film.remaining ?? 3, id: i + 100 });
      });
    } catch (e) {
      console.error("Erreur de chargement des films :", e);
    }
  };

  const submitFilm = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/films", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newFilm.value }),
      });
      if (res.ok) {
        const id = Date.now();
        films.push({ ...newFilm.value, id, remaining: 3 });
        newFilm.value = {
          title: "",
          director: "",
          genre: "",
          duration: null,
          synopsis: "",
        };
      } else {
        console.error("Erreur ajout film");
      }
    } catch (e) {
      console.error("Erreur réseau", e);
    }
  };

  onMounted(loadFilms);

  return { films, newFilm, submitFilm, loadFilms };
}
