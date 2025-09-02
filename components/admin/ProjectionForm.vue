<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <AutoComplete
      v-model="selectedFilm"
      :suggestions="filmOptions"
      @complete="searchFilms"
      field="title"
      :minLength="2"
      optionLabel="title"
      :dropdown="true"
      :forceSelection="true"
      placeholder="Rechercher un film..."
      class="w-full"
    />
    <small v-if="selectedFilm" class="text-gray-500">
      Sélectionné : {{ selectedFilm.title }}
    </small>

    <Dropdown
      v-model="form.cinemaId"
      :options="cinemas"
      optionLabel="name"
      optionValue="id"
      placeholder="Sélectionner un cinéma"
      class="w-full"
    />

    <div class="flex gap-4">
      <InputText v-model="form.date" type="date" class="w-full" />
      <InputText v-model="form.hour" type="time" class="w-full" />
    </div>

    <InputText
      v-model="form.salle"
      placeholder="Salle (ex: Salle 1)"
      class="w-full"
    />

    <InputNumber
      v-model="form.audienceCount"
      placeholder="Nombre de spectateurs"
      class="w-full"
    />

    <Textarea
      v-model="form.commentaire"
      placeholder="Commentaire"
      rows="3"
      class="w-full"
    />

    <Button label="Enregistrer" icon="pi pi-check" type="submit" />
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import AutoComplete from "primevue/autocomplete";
import { useFetch } from "#imports";

const { apiFetch } = useApi();
const props = defineProps({
  modelValue: Object, // si on veut éditer
});

const emit = defineEmits(["saved"]);

const form = ref({
  filmId: null,
  cinemaId: null,
  date: null,
  hour: null,
  salle: "",
  audienceCount: null,
  commentaire: "",
  ...props.modelValue,
});

const films = ref([]);
const selectedFilm = ref(null); // objet { id, title, ... }
const filmOptions = ref([]); // suggestions de l'autocomplete

const cinemas = ref([]);

onMounted(async () => {
  // charger cinémas
  cinemas.value = await apiFetch("/cinemas");

  // si édition et filmId présent, récupérer l'objet pour préremplir l'autocomplete
  if (form.value.filmId) {
    selectedFilm.value = await apiFetch(`/films/${form.value.filmId}`);
  }
});
watch(selectedFilm, (val) => {
  console.log("selectedFilm", selectedFilm.value);
  form.value.filmId = val?.id ?? null;
});
async function searchFilms({ query }) {
  console.log("searchFilms", query);
  const q = String(query || "").trim();
  if (q.length < 2) {
    filmOptions.value = [];
    return;
  }
  filmOptions.value = await apiFetch(
    `/projections/films/search?q=${encodeURIComponent(q)}&limit=12`
  );
  console.log("filmOptions", filmOptions.value);
}

async function onSubmit() {
  const url = props.modelValue?.id
    ? `/projections/${props.modelValue.id}`
    : "/projections";

  const method = props.modelValue?.id ? "PUT" : "POST";

  const saved = await apiFetch(url, {
    method,
    body: form.value,
  });

  emit("saved", saved);
}
</script>
