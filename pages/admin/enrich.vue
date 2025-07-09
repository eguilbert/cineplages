<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      Enrichissement automatique des films
    </h1>
    <p class="mb-4 text-gray-600">
      Ce bouton va chercher automatiquement les récompenses et liens Wikipédia
      des films manquants.
    </p>

    <Button
      label="🔍 Lancer enrichissement"
      @click="enrichFilms"
      :loading="loading"
    />
    <p v-if="log" class="mt-4 text-sm font-mono whitespace-pre">{{ log }}</p>
  </div>
</template>

<script setup>
import Button from "primevue/button";
const loading = ref(false);
const log = ref("");
const config = useRuntimeConfig();

const enrichFilms = async () => {
  loading.value = true;
  log.value = "Lancement...\n";

  const res = await $fetch(`${config.public.apiBase}/tools/enrich`, {
    method: "POST",
  });

  log.value += res.log.join("\n");
  loading.value = false;
};
</script>
