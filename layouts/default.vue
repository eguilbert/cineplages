<template>
  <div class="min-h-screen bg-[#fff7f0] text-[#333]">
    <header class="bg-[#26474E] text-[#fefae0] p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold text-[#fefae0]">🎬 Cineplages</h1>
        <slot name="header-actions" />
        <!--         <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
 -->
        <NuxtLink to="/films/import">Présélection</NuxtLink>
        <!-- <NuxtLink to="/films/preparer">Préparer une sélection</NuxtLink>
      <NuxtLink to="/films/sauver">Sauvegarder une sélection</NuxtLink> -->
        <NuxtLink to="/films/selections">Programmation</NuxtLink>
        <!--         <NuxtLink to="/films/TagValidation">Tags</NuxtLink>
 -->
        <NuxtLink to="/selections/" class="hover:underline">Séances</NuxtLink>
        <NuxtLink to="/programmation" class="hover:underline">Grille</NuxtLink>
        <NuxtLink to="/films/films" class="hover:underline">Films</NuxtLink>
        <NuxtLink to="/selections/preferences" class="hover:underline"
          >Preferences</NuxtLink
        >
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <slot />
    </main>

    <footer class="bg-[#08C5D1] text-white py-4 text-center mt-8">
      <p class="text-sm">© Cineplages {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<script setup>
// Layout de base allégé + palette douce (inspirée sable/vert nature)
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
