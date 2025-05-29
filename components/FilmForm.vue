<template>
  <div class="mt-8">
    <h2 class="text-lg font-bold mb-2">Ajouter un film à la base</h2>
    <form @submit.prevent="submitFilm" class="space-y-2">
      <div class="flex gap-4">
        <input
          v-model="newFilm.title"
          type="text"
          placeholder="Titre"
          class="border p-1 rounded w-full"
          required
        />
        <input
          v-model="newFilm.director"
          type="text"
          placeholder="Réalisateur"
          class="border p-1 rounded w-full"
        />
      </div>
      <div class="flex gap-4">
        <input
          v-model="newFilm.genre"
          type="text"
          placeholder="Genre"
          class="border p-1 rounded w-full"
        />
        <input
          v-model="newFilm.duration"
          type="number"
          placeholder="Durée (min)"
          class="border p-1 rounded w-1/3"
        />
      </div>
      <div>
        <textarea
          v-model="newFilm.synopsis"
          placeholder="Synopsis"
          class="border p-1 rounded w-full"
        ></textarea>
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
        Ajouter
      </button>
    </form>
  </div>
</template>

<script setup>
import { useFilms } from "@/composables/useFilms";
const { newFilm, submitFilm } = useFilms();
</script>
