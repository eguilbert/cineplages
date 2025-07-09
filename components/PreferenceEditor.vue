<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Préférences par créneau</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="(slot, index) in slots"
        :key="index"
        class="p-3 border rounded"
      >
        <div class="font-semibold">
          {{ slot.jour }} - {{ slot.heure }} - {{ slot.salle }}
        </div>
        <select
          v-model="preferences[slot.key]"
          class="mt-2 w-full border rounded p-1"
        >
          <option disabled value="">Choisir une catégorie</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>
    <button
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      @click="savePreferences"
    >
      Sauvegarder les préférences
    </button>

    <!-- Ajout : édition des sélections avec commentaire et rating -->
    <div v-if="grilleStore.selectionActive" class="mt-10">
      <h3 class="text-lg font-semibold mb-2">
        Éditer les films de la sélection
      </h3>
      <div
        v-for="(film, index) in grilleStore.selectionActive.films"
        :key="film.tmdb_id"
        class="mb-4 p-3 border rounded"
      >
        <div class="font-bold">{{ film.title }}</div>
        <label class="block text-sm mt-2">Commentaire :</label>
        <textarea
          v-model="film.commentaire"
          rows="2"
          class="w-full border rounded p-1"
        ></textarea>

        <label class="block text-sm mt-2">Note :</label>
        <Rating type="number" v-model.number="film.rating" :stars="10" />
      </div>
      <button
        class="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        @click="saveSelectionDetails"
      >
        Sauvegarder la sélection
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useGrilleStore } from "@/stores/grille";
import Rating from "primevue/rating";

const grilleStore = useGrilleStore();

const jours = ["Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const heures = ["14:00", "17:00", "20:00"];
const salles = ["Salle 1", "Salle 2"];

const categories = ["Grand Public", "Jeunesse", "Documentaire", "Art et Essai"];
const preferences = ref({});

const slots = [];
for (const jour of jours) {
  for (const heure of heures) {
    for (const salle of salles) {
      const key = `${jour}-${heure}-${salle}`;
      slots.push({ jour, heure, salle, key });
      preferences.value[key] = "";
    }
  }
}

function savePreferences() {
  localStorage.setItem("preferencesGrille", JSON.stringify(preferences.value));
  grilleStore.setPreferences(preferences.value);
  alert("Préférences sauvegardées !");
}

function saveSelectionDetails() {
  grilleStore.saveActiveSelection(); // suppose que cette méthode existe dans ton store
  alert("Sélection mise à jour !");
}

onMounted(() => {
  const saved = localStorage.getItem("preferencesGrille");
  if (saved) {
    preferences.value = JSON.parse(saved);
    grilleStore.setPreferences(preferences.value);
  }
});

watch(
  preferences,
  (val) => {
    grilleStore.setPreferences(val);
  },
  { deep: true }
);
</script>

<style scoped>
select {
  background-color: white;
}
</style>
