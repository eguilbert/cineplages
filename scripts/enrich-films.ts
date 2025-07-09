import axios from "axios";
import cheerio from "cheerio";

// 1. Récupérer la liste de films depuis ton backend
async function fetchFilmsToEnrich() {
  const res = await axios.get("http://localhost:3000/api/films");
  return res.data.filter((f: any) => !f.awards?.length); // ou tout
}

// 2. Scraper Wikipédia
async function scrapeWikipedia(title: string) {
  const searchUrl = `https://fr.wikipedia.org/w/index.php?search=${encodeURIComponent(
    title
  )}`;
  const res = await axios.get(searchUrl);
  const $ = cheerio.load(res.data);
  const firstResultHref = $("ul.mw-search-results li a").first().attr("href");

  if (!firstResultHref) return null;

  const pageUrl = `https://fr.wikipedia.org${firstResultHref}`;
  const pageRes = await axios.get(pageUrl);
  const $$ = cheerio.load(pageRes.data);

  const awards = [];
  $$("h2, h3").each((i, el) => {
    const title = $$(el).text();
    if (/Distinctions|Récompenses|Prix/i.test(title)) {
      let section = "";
      $$(el)
        .nextUntil("h2,h3")
        .each((j, item) => {
          section += $$(item).text();
        });

      const matches = section.match(/Palme|Ours|Oscar|César|Lion|BAFTA.*/g);
      if (matches) {
        matches.forEach((m) => awards.push(m.trim()));
      }
    }
  });

  return {
    source: pageUrl,
    awards,
  };
}

// 3. Nettoyage + envoi API
function normalizeAwards(awards: string[]) {
  return awards.map((text) => ({
    prize: text,
    festival: extractFestival(text),
    year: extractYear(text),
  }));
}

function extractFestival(text: string) {
  if (/Cannes/i.test(text)) return "Cannes";
  if (/Berlin|Ours/i.test(text)) return "Berlin";
  if (/Venise|Lion/i.test(text)) return "Venise";
  if (/Oscar/i.test(text)) return "Oscars";
  return "Autre";
}

function extractYear(text: string) {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0]) : null;
}

// 4. Main loop
async function enrichAll() {
  const films = await fetchFilmsToEnrich();
  console.log(`🔍 ${films.length} films à enrichir`);

  for (const film of films) {
    console.log(`→ ${film.title}`);
    const scraped = await scrapeWikipedia(film.title);
    if (!scraped) {
      console.log(`   ❌ Wikipédia introuvable`);
      continue;
    }

    const awards = normalizeAwards(scraped.awards);

    await axios.put(`http://localhost:3000/api/films/${film.id}/details`, {
      awards,
      externalLinks: [{ label: "Wikipedia", url: scraped.source }],
    });

    console.log(`   ✅ ${awards.length} récompenses ajoutées`);
  }
}

enrichAll();
