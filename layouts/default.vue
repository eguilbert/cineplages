<template>
  <div>
    <header class="bg-gray-800 text-white p-4 flex gap-4">
      <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
      <NuxtLink to="/programmation" class="hover:underline"
        >Programmation</NuxtLink
      >
      <NuxtLink to="/films" class="hover:underline">Films</NuxtLink>
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
