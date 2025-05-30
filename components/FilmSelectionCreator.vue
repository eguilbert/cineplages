<template>
  <div class="border p-4 rounded shadow-sm bg-white">
    <h3 class="text-lg font-bold mb-2">Créer une sélection nommée</h3>

    <div class="flex gap-2 items-center mb-4">
      <label for="groupName" class="font-semibold">Nom :</label>
      <input
        id="groupName"
        type="text"
        v-model="groupName"
        placeholder="ex : Sélection Juin"
        class="border px-2 py-1 rounded w-full"
      />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <Checkbox v-model="selectAll" :binary="true" @change="toggleAll" />
      <label>Tout sélectionner</label>
    </div>

    <div class="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
      <div
        v-for="(film, index) in films"
        :key="index"
        class="flex items-center gap-2 border-b pb-2"
      >
        <Checkbox v-model="film.selected" :binary="true" />
        <div>
          <strong>{{ film.title }}</strong>
          <small class="block text-gray-500 text-sm"
            >{{ film.genre }} — {{ film.release_date }}</small
          >
        </div>
      </div>
    </div>

    <Button
      label="Sauvegarder cette sélection"
      icon="pi pi-save"
      class="p-button-success mt-4"
      :disabled="!groupName || !films.some((f) => f.selected)"
      @click="saveSelection"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";

const props = defineProps({
  films: Array,
});

const groupName = ref("");
const selectAll = ref(false);

const toggleAll = () => {
  props.films.forEach((f) => (f.selected = selectAll.value));
};

const saveSelection = async () => {
  const selected = props.films.filter((f) => f.selected);
  const payload = {
    name: groupName.value,
    films: selected,
  };

  const res = await fetch("http://localhost:4000/api/selections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (data.success) {
    alert("Sélection enregistrée !");
    groupName.value = "";
    selectAll.value = false;
    props.films.forEach((f) => (f.selected = false));
  }
};
</script>
