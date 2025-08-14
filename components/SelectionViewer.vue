<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Consultation des sélections</h1>

    <div class="mb-4">
      <label class="block font-semibold mb-1">Sélection :</label>
      <select v-model="selectedId" class="p-2 border rounded">
        <option v-for="sel in selections" :key="sel.id" :value="sel.id">
          {{ sel.name }}
        </option>
      </select>
    </div>

    <div v-if="films.length" class="mb-6">
      <div class="flex flex-wrap gap-4 mb-4">
        <button @click="sortByNoteDesc" class="px-3 py-1 bg-gray-200 rounded">
          Note ↓
        </button>
        <button @click="sortByNoteAsc" class="px-3 py-1 bg-gray-200 rounded">
          Note ↑
        </button>
        <input
          v-model="commentaireFiltre"
          type="text"
          placeholder="Filtrer par commentaire"
          class="p-2 border rounded"
        />
      </div>

      <div
        v-for="(film, index) in filteredFilms"
        :key="film.tmdbId"
        class="border rounded p-3 mb-3"
      >
        <!--       <div v-for="(film, index) in films"></div>
 -->
        <div class="font-bold">
          {{ film.title
          }}<small>
            / {{ film.directorName }} <br />
            <small>{{ formatDate(film.releaseDate) }}</small>
          </small>
        </div>
        <div class="flex items-center gap-4">
          <div>
            <label class="text-sm block mt-1">Note :</label>
          </div>
          <div>
            <Rating v-model="film.rating" :stars="10" />
          </div>
          <div class="flex items-center flex-col gap-4">
            <span class="text-sm font-bold">Semaine :</span>
            <InputNumber
              v-model="film.week"
              :min="0"
              :max="10"
              showButtons
              buttonLayout="horizontal"
              class="w-10rem"
            />
          </div>
          <div class="flex items-center flex-col gap-4">
            <span class="text-sm font-bold">Séances prévues :</span>
            <InputNumber
              v-model="film.seances"
              :min="0"
              :max="10"
              showButtons
              buttonLayout="horizontal"
              class="w-10rem"
            />
          </div>

          <label class="text-sm block mt-2">Commentaire :</label>
          <textarea
            v-model="film.commentaire"
            rows="2"
            class="w-full p-2 border rounded"
          ></textarea>
        </div>
      </div>
      <button
        @click="saveSelection"
        class="px-4 py-2 bg-blue-500 text-white rounded mt-4"
      >
        Sauvegarder les commentaires et notes
      </button>
    </div>
  </div>
  <!--     <div v-else class="text-gray-500 italic">
      Aucun film dans cette sélection
    </div> -->
  <!--   </div>
 -->
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useGrilleStore } from "@/stores/grille";

const grilleStore = useGrilleStore();
const selections = ref([]);
const selectedId = ref(null);
const films = ref([]);
const commentaireFiltre = ref("");
const { apiFetch } = useApi();
onMounted(async () => {
  const res = await apiFetch(`/selections`);
  selections.value = await res.json();
});
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
watch(selectedId, async () => {
  if (!selectedId.value) return;
  const res = await apiFetch(`/selections/${selectedId.value}`);
  const selection = await res.json();
  console.log(selection);
  films.value = selection.films || [];
});

function sortByNoteDesc() {
  films.value.sort((a, b) => (b.rating || 0) - (a.rating || 0));
}
function sortByNoteAsc() {
  films.value.sort((a, b) => (a.rating || 0) - (b.rating || 0));
}

const filteredFilms = computed(() => {
  const result = !commentaireFiltre.value
    ? films.value
    : films.value.filter((film) =>
        (film.commentaire || "")
          .toLowerCase()
          .includes(commentaireFiltre.value.toLowerCase())
      );
  console.log(
    "→ Films affichés :",
    result.map((f) => f.title)
  );
  return result;
});

async function saveSelection() {
  if (!selectedId.value) return;
  try {
    await apiFetch(`/selections/${selectedId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedId.value, films: films.value }),
    });
    alert("Sélection mise à jour avec succès");
  } catch (e) {
    console.error("Erreur sauvegarde sélection", e);
    alert("Erreur lors de la sauvegarde");
  }
}
</script>

<style scoped>
select {
  background-color: white;
}
</style>
