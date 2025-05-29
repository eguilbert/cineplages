const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const OMDB_API = "http://www.omdbapi.com/";

async function fetchFromOMDB(title) {
  const res = await axios.get(OMDB_API, {
    params: { t: title, apikey: process.env.OMDB_API_KEY },
  });
  return res.data;
}

async function fetchFromPremiere() {
  const { data } = await axios.get("https://www.premiere.fr/Cinema/Sorties");
  const $ = cheerio.load(data);
  const films = [];

  $(".m-block--content .m-title").each((i, el) => {
    const title = $(el).text().trim();
    if (title) films.push({ title });
  });

  for (const film of films) {
    const details = await fetchFromOMDB(film.title);
    Object.assign(film, {
      director: details.Director,
      cast: details.Actors,
      synopsis: details.Plot,
      genre: details.Genre,
      poster: details.Poster,
      year: details.Year,
      runtime: details.Runtime,
    });
  }

  return films;
}

fetchFromPremiere().then((data) => {
  console.log(JSON.stringify(data, null, 2));
});
