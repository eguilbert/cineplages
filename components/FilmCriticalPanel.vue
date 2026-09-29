<template>
  <section v-if="isAdmin || analysis" class="mt-4 border-t pt-3 text-sm screen-only" @click.stop>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h4 class="font-semibold">Regard cinéphile · Cinéma de la plage</h4>
      <button v-if="isAdmin" class="rounded border border-[#26474e] px-2 py-1 text-[#26474e] disabled:opacity-50" :disabled="loading || !available" @click="$emit('analyze')">
        {{ availabilityError ? 'Vérification impossible' : !available ? 'Analyse à activer' : loading ? 'Recherche en cours…' : analysis ? 'Actualiser cette analyse' : 'Analyser ce film' }}
      </button>
    </div>
    <p v-if="isAdmin && availabilityError" role="alert" class="mt-2 text-red-700">Vérification de la recherche impossible : {{ availabilityError }}</p>
    <p v-else-if="isAdmin && !available" class="mt-2 text-gray-600">Clé API absente sur l'API appelée{{ environment ? ` (${environment})` : '' }}. Vérifier le service et l’environnement Railway.</p>
    <p v-if="isAdmin && !available && runtimeIds" class="mt-1 break-all text-xs text-gray-500">Identifiants de l’API appelée : {{ runtimeIds }}</p>
    <p v-if="isAdmin && error" role="alert" class="mt-2 text-red-700">{{ error }}</p>
    <p v-if="isAdmin && loading" role="status" class="mt-2 text-gray-600">Recherche dans la presse et les revues de cinéma. Vous pouvez continuer à consulter la sélection.</p>
    <details v-if="analysis" class="mt-3">
      <summary class="cursor-pointer font-medium text-[#26474e]">Lire l’analyse et ses sources</summary>
      <div class="mt-3 whitespace-pre-wrap leading-relaxed text-gray-800">
        <template v-for="(segment, index) in segments" :key="index"><a v-if="segment.url" :href="segment.url" target="_blank" rel="noopener noreferrer" class="text-blue-700 underline">{{ segment.text }}</a><span v-else>{{ segment.text }}</span></template>
      </div>
      <div v-if="analysis.sources?.length" class="mt-3 border-t pt-2">
        <strong>Articles consultés</strong>
        <ul class="list-disc pl-5"><li v-for="source in analysis.sources" :key="source.url"><a :href="source.url" target="_blank" rel="noopener noreferrer" class="text-blue-700 underline">{{ source.title }}</a></li></ul>
      </div>
      <div class="mt-3 border-t pt-2">
        <strong>Tags proposés</strong>
        <div v-if="analysis.tags?.length" class="mt-2 flex flex-wrap gap-2">
          <label v-for="tag in analysis.tags" :key="`${tag.category}:${tag.label}`" class="rounded bg-blue-50 px-2 py-1 text-xs text-blue-900">
            <input v-if="isAdmin && !analysis.tagsAppliedAt" v-model="selectedLabels" type="checkbox" :value="tag.label" class="mr-1" />{{ tag.category }} · {{ tag.label }}
          </label>
        </div>
        <p v-else class="mt-1 text-xs text-gray-500">Aucun tag proposé pour cette analyse.</p>
        <div v-if="isAdmin" class="mt-2 flex flex-wrap gap-2">
          <button v-if="!analysis.tags?.length" class="rounded border px-2 py-1 disabled:opacity-50" :disabled="tagging" @click="$emit('suggest-tags')">Proposer des tags</button>
          <button v-else-if="!analysis.tagsAppliedAt" class="rounded border px-2 py-1 disabled:opacity-50" :disabled="tagging || !selectedLabels.length" @click="$emit('apply-tags', selectedLabels)">Ajouter les tags cochés au film</button>
          <span v-else class="text-xs text-green-700">Tags ajoutés au film</span>
          <span v-if="tagging" role="status" class="text-xs">Traitement en cours…</span>
          <span v-if="tagError" role="alert" class="text-xs text-red-700">{{ tagError }}</span>
        </div>
      </div>
      <div v-if="canCompare" class="mt-3 border-t pt-2">
        <button class="rounded border px-2 py-1 text-[#26474e] disabled:opacity-50" :disabled="comparablesLoading" @click="$emit('load-comparables')">Voir les films déjà projetés avec des tags communs</button>
        <span v-if="comparablesLoading" role="status" class="ml-2 text-xs">Chargement…</span>
        <p v-if="comparablesError" role="alert" class="mt-2 text-red-700">{{ comparablesError }}</p>
        <div v-if="comparables" class="mt-2">
          <p v-if="!comparables.films?.length" class="text-gray-600">Pas encore de film avec au moins deux tags communs et des entrées renseignées dans ce cinéma.</p>
          <ul v-else class="space-y-2">
            <li v-for="film in comparables.films" :key="film.filmId" class="rounded bg-slate-50 p-2">
              <strong>{{ film.title }}</strong> · {{ film.sharedTags.length }} tags communs : {{ film.sharedTags.join(', ') }}<br />
              {{ film.projectionCount }} séance{{ film.projectionCount > 1 ? 's' : '' }} · {{ film.totalAdmissions }} entrées · {{ film.averagePerShow }} par séance
            </li>
          </ul>
          <p class="mt-2 text-xs text-gray-500">Ces entrées décrivent des séances passées, elles ne prédisent pas la fréquentation du film analysé.</p>
        </div>
      </div>
      <p class="mt-2 text-xs text-gray-500">Analyse générée le {{ new Date(analysis.generatedAt).toLocaleDateString('fr-FR') }} ; vérifier les articles avant décision.</p>
    </details>
  </section>
</template>

<script setup>
const props = defineProps({ analysis: { type: Object, default: null }, isAdmin: { type: Boolean, default: false }, canCompare: Boolean, tagging: Boolean, tagError: { type: String, default: '' }, comparables: { type: Object, default: null }, comparablesLoading: Boolean, comparablesError: { type: String, default: '' }, loading: Boolean, available: { type: Boolean, default: true }, environment: { type: String, default: '' }, runtimeIds: { type: String, default: '' }, availabilityError: { type: String, default: '' }, error: { type: String, default: '' } });
defineEmits(['analyze', 'suggest-tags', 'apply-tags', 'load-comparables']);
const selectedLabels = ref([]);
watch(() => props.analysis?.tags, (tags) => { selectedLabels.value = (tags || []).map(({ label }) => label); }, { immediate: true });
const segments = computed(() => {
  const text = props.analysis?.text || '';
  const citations = [...(props.analysis?.citations || [])].sort((a, b) => a.start - b.start);
  const result = [];
  let cursor = 0;
  for (const citation of citations) {
    if (citation.start < cursor || citation.end > text.length || citation.end <= citation.start) continue;
    if (citation.start > cursor) result.push({ text: text.slice(cursor, citation.start) });
    result.push({ text: text.slice(citation.start, citation.end), url: citation.url });
    cursor = citation.end;
  }
  if (cursor < text.length) result.push({ text: text.slice(cursor) });
  return result;
});
</script>
