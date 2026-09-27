<template>
  <section class="mt-4 border-t pt-3 text-sm screen-only" @click.stop>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h4 class="font-semibold">Regard cinéphile</h4>
      <button class="rounded border border-[#26474e] px-2 py-1 text-[#26474e] disabled:opacity-50" :disabled="loading || !available" @click="$emit('analyze')">
        {{ availabilityError ? 'Vérification impossible' : !available ? 'Analyse à activer' : loading ? 'Recherche en cours…' : analysis ? 'Actualiser cette analyse' : 'Analyser ce film' }}
      </button>
    </div>
    <p v-if="availabilityError" role="alert" class="mt-2 text-red-700">Vérification de la recherche impossible : {{ availabilityError }}</p>
    <p v-else-if="!available" class="mt-2 text-gray-600">Clé API absente sur l'API appelée{{ environment ? ` (${environment})` : '' }}. Vérifier le service et l’environnement Railway.</p>
    <p v-if="error" role="alert" class="mt-2 text-red-700">{{ error }}</p>
    <p v-if="loading" role="status" class="mt-2 text-gray-600">Recherche dans la presse et les revues de cinéma. Vous pouvez continuer à consulter la sélection.</p>
    <details v-if="analysis" class="mt-3">
      <summary class="cursor-pointer font-medium text-[#26474e]">Lire l’analyse et ses sources</summary>
      <div class="mt-3 whitespace-pre-wrap leading-relaxed text-gray-800">
        <template v-for="(segment, index) in segments" :key="index"><a v-if="segment.url" :href="segment.url" target="_blank" rel="noopener noreferrer" class="text-blue-700 underline">{{ segment.text }}</a><span v-else>{{ segment.text }}</span></template>
      </div>
      <div v-if="analysis.sources?.length" class="mt-3 border-t pt-2">
        <strong>Articles consultés</strong>
        <ul class="list-disc pl-5"><li v-for="source in analysis.sources" :key="source.url"><a :href="source.url" target="_blank" rel="noopener noreferrer" class="text-blue-700 underline">{{ source.title }}</a></li></ul>
      </div>
      <p class="mt-2 text-xs text-gray-500">Analyse générée le {{ new Date(analysis.generatedAt).toLocaleDateString('fr-FR') }} ; vérifier les articles avant décision.</p>
    </details>
  </section>
</template>

<script setup>
const props = defineProps({ analysis: { type: Object, default: null }, loading: Boolean, available: { type: Boolean, default: true }, environment: { type: String, default: '' }, availabilityError: { type: String, default: '' }, error: { type: String, default: '' } });
defineEmits(['analyze']);
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
