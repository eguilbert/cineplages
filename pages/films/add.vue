<script setup>
const { apiFetch } = useApi()
const { isAdmin, isAuthenticated, loading: authLoading, error: authError, ensureUserLoaded } = useAuth()
const ready = ref(false)
onMounted(async () => {
  try { await ensureUserLoaded() }
  finally { ready.value = true }
})
const query = ref('')
const results = ref([])
const searching = ref(false)
const searched = ref(false)
const importing = ref(null)
const error = ref('')
const imported = ref({})
const message = (e) => e?.data?.error || e?.data?.message || e?.message || 'Opération impossible. Vérifier la connexion et les droits administrateur.'
async function search() {
  if (!ready.value || authLoading.value || !isAdmin.value || !query.value.trim() || searching.value || importing.value !== null) return
  searching.value = true
  searched.value = false
  results.value = []
  error.value = ''
  try {
    const data = await apiFetch('/api/tmdb/search', { query: { q: query.value.trim() } })
    results.value = data
    searched.value = true
  } catch (e) { error.value = message(e) }
  finally { searching.value = false }
}
async function importMovie(movie) {
  if (!ready.value || authLoading.value || !isAdmin.value || importing.value !== null) return
  importing.value = movie.tmdbId
  error.value = ''
  try {
    const data = await apiFetch(`/api/import-one/${movie.tmdbId}`, { method: 'POST' })
    imported.value = { ...imported.value, [movie.tmdbId]: data }
  } catch (e) { error.value = message(e) }
  finally { importing.value = null }
}
</script>

<template>
  <main class="tmdb-add">
    <NuxtLink to="/films">← Films</NuxtLink>
    <h1>Ajouter un film depuis TMDB</h1>
    <p v-if="!ready || authLoading" role="status">Vérification de votre compte…</p>
    <p v-else-if="!isAuthenticated" role="alert">{{ authError || 'Connectez-vous avec un compte administrateur pour importer un film.' }}</p>
    <p v-else-if="!isAdmin" role="alert">L’import de films est réservé aux administrateurs.</p>
    <template v-else>
    <p>Recherchez un titre, puis vérifiez l’année et le résumé avant de l’importer.</p>
    <form class="search" @submit.prevent="search">
      <label for="film-title">Titre du film</label>
      <input id="film-title" v-model="query" required maxlength="200" placeholder="La Pie voleuse" :disabled="searching || importing !== null">
      <button :disabled="!query.trim() || searching || importing !== null">{{ searching ? 'Recherche…' : 'Rechercher' }}</button>
    </form>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="searched && !results.length" role="status">Aucun résultat. Essayez le titre original.</p>
    <p v-if="searching" role="status">Recherche en cours…</p>
    <article v-for="movie in results" :key="movie.tmdbId" class="movie">
      <img v-if="movie.poster" :src="movie.poster" :alt="`Affiche de ${movie.title}`" loading="lazy">
      <div>
        <h2>{{ movie.title }} <small>({{ movie.releaseDate?.slice(0, 4) || 'Année inconnue' }})</small></h2>
        <p v-if="movie.originalTitle !== movie.title">Titre original : {{ movie.originalTitle }}</p>
        <p>{{ movie.synopsis || 'Résumé indisponible.' }}</p>
        <template v-if="imported[movie.tmdbId]">
          <p role="status">Film disponible dans Cineplages.</p>
          <NuxtLink :to="`/films/${imported[movie.tmdbId].id}`">Voir la fiche</NuxtLink>
        </template>
        <button v-else type="button" :disabled="importing !== null || searching" @click="importMovie(movie)">{{ importing === movie.tmdbId ? 'Import en cours…' : 'Importer ce film' }}</button>
      </div>
    </article>
    </template>
    <p class="credit">Recherche fournie par TMDB. Ce service utilise l’API TMDB et n’est ni approuvé ni certifié par TMDB.</p>
  </main>
</template>

<style scoped>
.tmdb-add { max-width: 960px; margin: auto; padding: 24px; }
.search { display: flex; flex-wrap: wrap; gap: 12px; margin: 24px 0; }
.search label { width: 100%; }
input { flex: 1; min-width: 180px; padding: 12px; border: 1px solid #aaa; border-radius: 6px; }
button { padding: 12px 18px; border: 0; border-radius: 6px; background: #245b75; color: white; cursor: pointer; }
button:disabled { opacity: .6; cursor: wait; }
.movie { display: flex; align-items: flex-start; gap: 20px; border-top: 1px solid #ddd; padding: 24px 0; }
.movie img { width: 100px; height: auto; }
h2 { margin-top: 0; font-size: 1.3rem; }
small { font-size: .9rem; }
.error { color: #a52020; }
.credit { color: #666; font-size: .85rem; margin-top: 32px; }
@media (max-width: 500px) { .movie { gap: 12px; } .movie img { width: 70px; } }
</style>
