<template>
  <main class="mx-auto max-w-6xl p-4 md:p-8 space-y-8">
    <header>
      <h1 class="text-3xl font-bold text-[#26474e]">Recommandations de programmation</h1>
      <p class="mt-2 text-gray-600">Définissez les préférences de la salle, puis analysez les films déjà importés.</p>
    </header>

    <p v-if="error" role="alert" class="rounded-lg bg-red-50 p-3 text-red-800">{{ error }}</p>
    <p v-if="notice" role="status" class="rounded-lg bg-emerald-50 p-3 text-emerald-800">{{ notice }}</p>

    <div v-if="!isAdmin" class="rounded-xl bg-white p-6 shadow-sm">Cette page est réservée aux administrateurs.</div>
    <template v-else>
      <label class="block max-w-md font-medium">
        Cinéma
        <select v-model.number="cinemaId" class="mt-1 w-full rounded-lg border p-2">
          <option v-for="cinema in cinemas" :key="cinema.id" :value="cinema.id">{{ cinema.name }}</option>
        </select>
      </label>

      <section v-if="cinemaId" class="rounded-xl bg-white p-5 shadow-sm space-y-4">
        <h2 class="text-xl font-semibold">Profil éditorial</h2>
        <label class="block">Ligne de programmation
          <textarea v-model="description" rows="4" maxlength="5000" class="mt-1 w-full rounded-lg border p-2" placeholder="Décrivez la salle et ses ambitions éditoriales…" />
        </label>
        <div class="grid gap-4 md:grid-cols-2">
          <label class="block">Termes privilégiés (séparés par des virgules)
            <input v-model="favoredText" class="mt-1 w-full rounded-lg border p-2" placeholder="documentaire, Art et Essai, Japon…" />
          </label>
          <label class="block">Termes à modérer (séparés par des virgules)
            <input v-model="avoidedText" class="mt-1 w-full rounded-lg border p-2" placeholder="horreur…" />
          </label>
        </div>
        <p class="text-sm text-gray-500">Le calcul V1 cherche ces termes dans le genre, la catégorie, l’origine et les mots-clés. La description sert de référence éditoriale ; elle n’entre pas encore dans le calcul.</p>
        <button :disabled="saving" class="rounded-lg bg-[#26474e] px-4 py-2 text-white disabled:opacity-50" @click="saveProfile">
          {{ saving ? 'Enregistrement…' : 'Enregistrer le profil' }}
        </button>
      </section>

      <section v-if="cinemaId" class="rounded-xl bg-white p-5 shadow-sm space-y-4">
        <h2 class="text-xl font-semibold">Analyser un film</h2>
        <div class="flex gap-2">
          <input v-model="query" class="min-w-0 flex-1 rounded-lg border p-2" placeholder="Titre d’un film présent dans la base" @keyup.enter="search" />
          <button class="rounded-lg border px-4 py-2" :disabled="searching || query.trim().length < 2" @click="search">Rechercher</button>
        </div>
        <ul v-if="results.length" class="divide-y">
          <li v-for="film in results" :key="film.id" class="flex items-center justify-between gap-4 py-3">
            <span>{{ film.title }}</span>
            <button class="rounded-lg bg-[#26474e] px-3 py-2 text-sm text-white disabled:opacity-50" :disabled="analyzingId === film.id" @click="analyze(film.id)">
              {{ analyzingId === film.id ? 'Analyse…' : 'Analyser' }}
            </button>
          </li>
        </ul>
      </section>

      <section v-if="cinemaId" class="space-y-4">
        <h2 class="text-xl font-semibold">Analyses enregistrées</h2>
        <p v-if="!recommendations.length" class="text-gray-600">Aucune analyse pour ce cinéma.</p>
        <article v-for="item in recommendations" :key="item.id" class="rounded-xl bg-white p-5 shadow-sm">
          <div class="flex gap-4">
            <img v-if="item.film.posterUrl" :src="item.film.posterUrl" alt="" class="h-24 w-16 rounded object-cover" />
            <div class="flex-1 space-y-2">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <h3 class="font-semibold">{{ item.film.title }}</h3>
                <strong>{{ item.editorialFit === null ? 'Affinité non évaluée' : `Affinité éditoriale ${item.editorialFit}/100` }}</strong>
              </div>
              <p class="text-sm text-gray-700">{{ item.reasoning }}</p>
              <p class="text-xs text-gray-500">Correspondances : {{ [...(item.evidence?.matchedFavoredTerms || []), ...(item.evidence?.matchedAvoidedTerms || [])].join(', ') || 'aucune' }}. Public, critique et calendrier : non évalués.</p>
              <p v-if="item.evidence?.attendanceHistory" class="text-sm text-gray-700">
                Historique {{ item.evidence.attendanceHistory.category }} : {{ item.evidence.attendanceHistory.averagePerShow }} entrées par séance en moyenne
                ({{ item.evidence.attendanceHistory.projectionCount }} séances, {{ item.evidence.attendanceHistory.filmCount }} films). Observation, pas une prévision.
              </p>
              <div class="flex flex-wrap items-center gap-2 pt-2">
                <select :value="item.feedback?.decision || 'PENDING'" class="rounded border p-2 text-sm" @change="saveFeedback(item, $event.target.value)">
                  <option value="PENDING">À décider</option>
                  <option value="RETAINED">Retenu</option>
                  <option value="DECLINED">Écarté</option>
                </select>
                <span v-if="item.feedback?.plannedShows != null" class="text-sm text-gray-600">{{ item.feedback.plannedShows }} séances prévues</span>
              </div>
            </div>
          </div>
        </article>
      </section>
    </template>
  </main>
</template>

<script setup>
import { getApiErrorMessage } from '@/utils/apiError';

const { apiFetch } = useApi();
const { isAdmin, ensureUserLoaded, user } = useAuth();
const cinemas = ref([]);
const cinemaId = ref(null);
const description = ref('');
const favoredText = ref('');
const avoidedText = ref('');
const query = ref('');
const results = ref([]);
const recommendations = ref([]);
const saving = ref(false);
const searching = ref(false);
const analyzingId = ref(null);
const error = ref('');
const notice = ref('');
const terms = (text) => [...new Set(text.split(',').map((term) => term.trim()).filter(Boolean))];
const showError = (e) => { error.value = getApiErrorMessage(e, 'La requête a échoué.'); notice.value = ''; };

async function loadCinema() {
  if (!cinemaId.value) return;
  error.value = '';
  try {
    const [profile, rows] = await Promise.all([
      apiFetch(`/cinemas/${cinemaId.value}/profile`),
      apiFetch(`/cinemas/${cinemaId.value}/recommendations`),
    ]);
    description.value = profile.description || '';
    favoredText.value = (profile.favoredTerms || []).join(', ');
    avoidedText.value = (profile.avoidedTerms || []).join(', ');
    recommendations.value = rows;
  } catch (e) { showError(e); }
}

async function saveProfile() {
  saving.value = true; error.value = ''; notice.value = '';
  try {
    await apiFetch(`/cinemas/${cinemaId.value}/profile`, {
      method: 'PUT', body: { description: description.value, favoredTerms: terms(favoredText.value), avoidedTerms: terms(avoidedText.value) },
    });
    notice.value = 'Profil enregistré. Relancez l’analyse des films pour appliquer ces préférences.';
  } catch (e) { showError(e); }
  finally { saving.value = false; }
}

async function search() {
  if (query.value.trim().length < 2) return;
  searching.value = true; error.value = '';
  try {
    const response = await apiFetch(`/films/search?q=${encodeURIComponent(query.value.trim())}&pageSize=20`);
    results.value = response.items || [];
  }
  catch (e) { showError(e); }
  finally { searching.value = false; }
}

async function analyze(filmId) {
  analyzingId.value = filmId; error.value = ''; notice.value = '';
  try {
    await apiFetch(`/cinemas/${cinemaId.value}/films/${filmId}/recommendation`, { method: 'POST' });
    recommendations.value = await apiFetch(`/cinemas/${cinemaId.value}/recommendations`);
    notice.value = 'Analyse enregistrée.';
  } catch (e) { showError(e); }
  finally { analyzingId.value = null; }
}

async function saveFeedback(item, decision) {
  error.value = '';
  try {
    item.feedback = await apiFetch(`/recommendations/${item.id}/feedback`, {
      method: 'PUT', body: { decision, plannedShows: item.feedback?.plannedShows ?? null, note: item.feedback?.note ?? null },
    });
  } catch (e) { showError(e); }
}

watch(cinemaId, () => { results.value = []; loadCinema(); });
onMounted(async () => {
  await ensureUserLoaded();
  if (!isAdmin.value) return;
  try {
    cinemas.value = await apiFetch('/cinemas');
    cinemaId.value = cinemas.value.find((cinema) => cinema.id === user.value?.cinemaId)?.id ?? cinemas.value[0]?.id ?? null;
  } catch (e) { showError(e); }
});
</script>
