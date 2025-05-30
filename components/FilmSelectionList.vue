<template>
  <div class="border p-4 rounded shadow-sm bg-white">
    <h3 class="text-lg font-bold mb-3">Sélections enregistrées</h3>

    <div v-if="selections.length === 0" class="text-gray-500">
      Aucune sélection disponible.
    </div>

    <ul v-else class="space-y-2">
      <li
        v-for="selection in selections"
        :key="selection.id"
        class="border p-2 rounded hover:bg-gray-50"
      >
        <div class="flex justify-between items-center">
          <div>
            <strong>{{ selection.name }}</strong>
            <small class="block text-gray-500 text-sm">
              {{ new Date(selection.date_created).toLocaleDateString() }} —
              {{ selection.films.length }} film(s)
            </small>
          </div>
          <Button
            icon="pi pi-eye"
            label="Voir"
            @click="emit('select', selection)"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Button from "primevue/button";

const emit = defineEmits(["select"]);
const selections = ref([]);

const fetchSelections = async () => {
  const res = await fetch("http://localhost:4000/api/selections");
  selections.value = await res.json();
};

onMounted(fetchSelections);
</script>
