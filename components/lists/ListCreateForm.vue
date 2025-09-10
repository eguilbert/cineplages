<template>
  <form
    class="bg-white border rounded-lg shadow p-4 space-y-4"
    @submit.prevent="onSubmit"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Créer une liste</h2>
      <Button type="button" label="Réinitialiser" text @click="resetForm" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs text-gray-600 mb-1">Nom *</label>
        <InputText
          v-model.trim="form.name"
          class="w-full"
          @input="onNameInput"
        />
      </div>

      <div>
        <label class="block text-xs text-gray-600 mb-1">Slug *</label>
        <InputText
          v-model.trim="form.slug"
          class="w-full"
          @input="slugTouched = true"
        />
      </div>

      <div>
        <label class="block text-xs text-gray-600 mb-1">Type *</label>
        <Dropdown
          v-model="form.type"
          :options="typeOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
        />
      </div>

      <div>
        <label class="block text-xs text-gray-600 mb-1">Scope *</label>
        <Dropdown
          v-model="form.scope"
          :options="scopeOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
        />
      </div>

      <div v-if="form.scope === 'CINEMA'">
        <label class="block text-xs text-gray-600 mb-1">Cinema ID</label>
        <InputText v-model.number="form.cinemaId" class="w-full" />
      </div>

      <div v-if="form.type === 'FAVORITES' || form.scope === 'USER'">
        <label class="block text-xs text-gray-600 mb-1">Owner (userId)</label>
        <InputText v-model.number="form.ownerId" class="w-full" />
      </div>

      <div class="md:col-span-2">
        <label class="block text-xs text-gray-600 mb-1">Description</label>
        <Textarea
          v-model="form.description"
          rows="3"
          class="w-full"
          autoResize
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-xs text-gray-600 mb-1"
          >Image de couverture (URL)</label
        >
        <InputText v-model.trim="form.coverUrl" class="w-full" />
      </div>

      <div class="md:col-span-2 flex items-center gap-3">
        <Checkbox v-model="form.isPublic" :binary="true" inputId="isPublic" />
        <label for="isPublic" class="text-sm">Public</label>
      </div>

      <div
        v-if="form.type === 'DYNAMIC' || form.type === 'SYSTEM'"
        class="md:col-span-2"
      >
        <div class="flex items-center justify-between">
          <label class="block text-xs text-gray-600 mb-1"
            >Critères (JSON)</label
          >
          <small class="text-gray-500"
            >ex: {"type": "RELEASES_MONTH", "month": "2025-09"}</small
          >
        </div>
        <Textarea
          v-model="criteriaRaw"
          rows="6"
          class="w-full font-mono text-xs"
          autoResize
        />
        <p v-if="criteriaError" class="text-xs text-red-600 mt-1">
          {{ criteriaError }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <Button
        type="submit"
        :label="saving ? 'Enregistrement…' : 'Créer la liste'"
        :loading="saving"
      />
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <p v-if="success" class="text-sm text-green-600">Liste créée ✔</p>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";
import { useApi } from "@/composables/useApi";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";

const { apiFetch } = useApi();

const typeOptions = [
  { label: "CURATED (manuelle)", value: "CURATED" },
  { label: "DYNAMIC (critères)", value: "DYNAMIC" },
  { label: "FAVORITES (utilisateur)", value: "FAVORITES" },
  { label: "SYSTEM", value: "SYSTEM" },
];
const scopeOptions = [
  { label: "GLOBAL", value: "GLOBAL" },
  { label: "CINEMA", value: "CINEMA" },
  { label: "USER", value: "USER" },
];

const form = ref({
  name: "",
  slug: "",
  type: "CURATED",
  scope: "GLOBAL",
  description: "",
  coverUrl: "",
  isPublic: true,
  ownerId: null,
  cinemaId: null,
});
const slugTouched = ref(false);
const criteriaRaw = ref("");
const criteriaError = ref("");
const saving = ref(false);
const error = ref("");
const success = ref(false);

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function onNameInput() {
  if (!slugTouched.value) form.value.slug = slugify(form.value.name);
}

watch(
  () => form.value.type,
  (t) => {
    if (t === "DYNAMIC" && !criteriaRaw.value) {
      criteriaRaw.value = '{"type":"RELEASES_MONTH"}';
    }
  }
);

function resetForm() {
  form.value = {
    name: "",
    slug: "",
    type: "CURATED",
    scope: "GLOBAL",
    description: "",
    coverUrl: "",
    isPublic: true,
    ownerId: null,
    cinemaId: null,
  };
  criteriaRaw.value = "";
  criteriaError.value = "";
  error.value = "";
  success.value = false;
  slugTouched.value = false;
}

async function onSubmit() {
  error.value = "";
  success.value = false;
  criteriaError.value = "";

  if (
    !form.value.name ||
    !form.value.slug ||
    !form.value.type ||
    !form.value.scope
  ) {
    error.value = "Champs requis manquants.";
    return;
  }

  let criteria = undefined;
  if (form.value.type === "DYNAMIC" || form.value.type === "SYSTEM") {
    try {
      criteria = criteriaRaw.value ? JSON.parse(criteriaRaw.value) : {};
    } catch (e) {
      criteriaError.value = "JSON invalide.";
      return;
    }
  }

  saving.value = true;
  try {
    const payload = { ...form.value, criteria };
    const res = await apiFetch("/lists", { method: "POST", body: payload });
    success.value = true;
    // Émet un event si parent veut réagir
    // eslint-disable-next-line no-undef
    defineEmits?.(["created"])?.("created", res);
  } catch (e) {
    error.value = e?.data?.error || e?.message || "Erreur serveur";
  } finally {
    saving.value = false;
  }
}
</script>
