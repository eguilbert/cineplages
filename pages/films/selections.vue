<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Mes Sélections</h1>

    <div v-if="selections.length === 0" class="text-gray-500 italic">
      Aucune sélection enregistrée.
    </div>

    <div v-else>
      <div v-for="selection in selections" :key="selection.id" class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-xl font-semibold">🎞️ {{ selection.name }}</h2>
          <Button
            icon="pi pi-trash"
            label="Effacer"
            severity="warn"
            text
            @click="deleteSelection(selection.id)"
          />
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="film in selection.films"
            :key="film.id"
            class="border rounded p-3 bg-white shadow-sm"
          >
            <div class="flex justify-between items-center">
              <!--               <OverlayBadge :value="film.genre" severity="danger">
 -->
              <img
                :src="film.poster_url"
                alt=""
                width="80"
                style="margin-right: 10px"
              />
              <!--               </OverlayBadge>
 -->
              <strong
                ><a
                  :href="`https://www.themoviedb.org/movie/${film.tmdb_id}`"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >
                  {{ film.title }} </a
                ><br />
                <small>{{ film.director }}</small></strong
              >
              <span
                class="text-xs rounded px-2 py-0.5"
                :class="badgeClass(film.category)"
              >
                {{ film.category || "Non classé" }}
              </span>
            </div>
            <div class="text-sm text-gray-600">
              {{ film.release_date }} <br />
              <span v-if="film.production_countries">
                {{ film.production_countries.join(", ") }}</span
              >
              <span v-if="film.genre"> | {{ film.genre }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Button from "primevue/button";

const selections = ref([]);
const config = useRuntimeConfig();

onMounted(async () => {
  const res = await fetch(`${config.public.apiBase}/selections`);
  selections.value = await res.json();
});

const deleteSelection = async (id) => {
  if (!confirm("Supprimer cette sélection ?")) return;
  await fetch(`${config.public.apiBase}/selections/${id}`, {
    method: "DELETE",
  });
  selections.value = selections.value.filter((sel) => sel.id !== id);
};

const badgeClass = (category) => {
  const map = {
    "Art et Essai": "bg-purple-100 text-purple-800",
    Documentaire: "bg-green-100 text-green-800",
    Jeunesse: "bg-yellow-100 text-yellow-800",
    "Grand Public": "bg-blue-100 text-blue-800",
    "": "bg-gray-100 text-gray-800",
  };
  return map[category] || "bg-gray-100 text-gray-800";
};
</script>
