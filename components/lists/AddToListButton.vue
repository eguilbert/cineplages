<template>
  <div class="flex gap-2 items-center">
    <Dropdown
      v-model="selectedSlug"
      :options="listOptions"
      optionLabel="name"
      optionValue="slug"
      placeholder="Choisir une liste"
      class="w-64"
    />
    <Button
      :disabled="!selectedSlug"
      label="Ajouter"
      size="small"
      @click="add"
    />
    <small v-if="msg" class="text-green-600">{{ msg }}</small>
    <small v-if="err" class="text-red-600">{{ err }}</small>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useApi } from "@/composables/useApi";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
const props = defineProps({ filmId: { type: Number, required: true } });
const { apiFetch } = useApi();

const listOptions = ref([]);
const selectedSlug = ref(null);
const msg = ref("");
const err = ref("");

onMounted(loadLists);

async function loadLists() {
  try {
    // On ne propose que CURATED et FAVORITES
    const all = await apiFetch("/lists", { query: {} });
    listOptions.value = all.filter((l) =>
      ["CURATED", "FAVORITES"].includes(l.type)
    );
  } catch (_) {}
}

async function add() {
  msg.value = "";
  err.value = "";
  try {
    await apiFetch(`/lists/${selectedSlug.value}/add`, {
      method: "POST",
      body: { filmId: props.filmId },
    });
    msg.value = "Ajouté à la liste.";
  } catch (e) {
    err.value = e?.data?.error || e?.message || "Erreur ajout";
  }
}
</script>
