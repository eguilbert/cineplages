<template>
  <div>
    <header class="bg-gray-800 text-white p-4 flex gap-4">
      <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
      <NuxtLink to="/films/import">🎬 Importer des films</NuxtLink>
      <NuxtLink to="/films/preparer">Préparer une sélection</NuxtLink>
      <NuxtLink to="/films/sauver">Sauvegarder une sélection</NuxtLink>
      <NuxtLink to="/films/selections">Voir mes sélections</NuxtLink>

      <NuxtLink to="/programmation" class="hover:underline"
        >Programmation</NuxtLink
      >
      <NuxtLink to="/films/" class="hover:underline">Films</NuxtLink>
    </header>

    <main class="p-4">
      <slot />
    </main>
  </div>
</template>

<script setup>
// Layout Nuxt par défaut
</script>

<style scoped>
header a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
