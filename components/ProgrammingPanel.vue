<template>
  <!--   <div class="border rounded-md p-3 bg-white"> -->
  <div class="">
    <div class="flex items-start gap-3">
      <div class="grow">
        <!--<h4 class="text-sm font-semibold mb-2">
          Programmation – {{ film.title }}
        </h4> -->
        <!--  <p class="text-xs text-gray-500 mb-3">
          Coche un cinéma, puis configure le nombre de séances (0..9), le cap
          indicatif et les notes.
        </p> -->
      </div>
      <!--<br />
      <Button
        size="small"
        label="Enregistrer"
        @click="save"
        :loading="saving"
      /> -->
    </div>

    <!--     <div class="grid md:grid-cols-2 gap-4">
      <div
        v-for="c in displayedCinemas"
        :key="c.id"
        class="border rounded p-3"
        :class="classesFor(c).box"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <template v-if="isAdmin">
              {{ c.name }}
              <Checkbox :binary="true" v-model="state[c.id].checked" />
            </template>
            <template v-else>
              {{ programmingByCinema[c.id] }}
              <span
                class="text-[10px] px-2 py-0.5 rounded"
                :class="classesFor(c).chip"
              >
                {{ c.name }}
              </span>
            </template>
          </div>
          <br />
          <span
            v-if="isAdmin ? state[c.id].checked : programmingByCinema[c.id]"
            class="text-xs px-2 py-0.5 rounded"
            :class="
              (isAdmin
                ? state[c.id].suggested
                : programmingByCinema[c.id]?.suggested) > 6
                ? classesFor(c).badgeHigh
                : classesFor(c).badgeLow
            "
          >
            {{
              isAdmin
                ? state[c.id].suggested
                : programmingByCinema[c.id]?.suggested
            }}
            séance(s)
          </span> 
        </div>

        <div
          v-if="isAdmin ? state[c.id].checked : programmingByCinema[c.id]"
          class="mt-3 space-y-2"
        >
          <template v-if="isAdmin">
            <div class="flex-col items-center gap-3">
              <label class="text-xs w-28">Séances (0..9)</label>
              <br />
              <InputNumber
                v-model="state[c.id].suggested"
                :min="0"
                :max="9"
                :step="1"
                inputClass="w-8"
                buttonLayout="horizontal"
                showButtons
                :useGrouping="false"
                size="small"
              />
            </div>

            <div class="flex-col items-center gap-3">
              <label class="text-xs w-28">Max indicatif</label>
              <br />
              <Select
                v-model="state[c.id].capLabel"
                :options="capOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Max"
                class="w-full md:w-24"
                panelClass="text-sm"
                size="small"
              />
            </div>

           

            <div>
              <label class="text-xs block mb-1">Notes</label>
              <Textarea
                v-model="state[c.id].notes"
                rows="3"
                autoResize
                class="w-full"
              />
            </div>
          </template>

          <template v-else>
            
            <div class="text-sm text-gray-700" v-if="programmingByCinema[c.id]">
              <p v-if="programmingByCinema[c.id].suggested > 0">
                Séances suggérées :
                <strong>{{ programmingByCinema[c.id].suggested }}</strong>
              </p>
              <p v-if="programmingByCinema[c.id].capLabel">
                Max : {{ programmingByCinema[c.id].capLabel }}
              </p>
              <p v-if="programmingByCinema[c.id].notes">
                Notes :
                <span class="italic">{{
                  programmingByCinema[c.id].notes
                }}</span>
              </p>
            </div>
            <div v-else class="text-sm text-gray-400 italic">Non programmé</div>
          </template>
        </div>
      </div>
    </div> -->
    <!-- ===== ADMIN ===== -->
    <div v-if="isAdmin" class="grid md:grid-cols-2 gap-4">
      <div
        v-for="c in adminCinemas"
        :key="c.id"
        class="border rounded p-3"
        :class="classesFor(c).box"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            {{ c.name }}
            <Checkbox :binary="true" v-model="state[c.id].checked" />
          </div>
        </div>

        <div v-if="state[c.id].checked" class="mt-3 space-y-2">
          <!-- Séances -->
          <div class="flex-col items-center gap-3">
            <label class="text-xs w-28">Séances (0..9)</label>
            <br />
            <InputNumber
              v-model="state[c.id].suggested"
              :min="0"
              :max="9"
              :step="1"
              inputClass="w-8"
              buttonLayout="horizontal"
              showButtons
              :useGrouping="false"
              size="small"
            />
          </div>

          <!-- Cap -->
          <div class="flex-col items-center gap-3">
            <label class="text-xs w-28">Max indicatif</label>
            <br />
            <Select
              v-model="state[c.id].capLabel"
              :options="capOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Max"
              class="w-full md:w-24"
              panelClass="text-sm"
              size="small"
            />
          </div>

          <!-- Notes -->
          <div>
            <label class="text-xs block mb-1">Notes</label>
            <Textarea
              v-model="state[c.id].notes"
              rows="3"
              autoResize
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ===== NON-ADMIN ===== -->
    <div v-else class="grid md:grid-cols-2 gap-4">
      <div
        v-for="c in nonAdminCinemas"
        :key="c.id"
        class="border rounded p-3"
        :class="classesFor(c).box"
      >
        <!-- Seulement le nom (chip) si juste coché -->
        <div class="flex items-center gap-2">
          <span
            class="text-[10px] px-2 py-0.5 rounded"
            :class="classesFor(c).chip"
          >
            {{ c.name }}
          </span>
        </div>

        <!-- Si des infos existent, on les montre dessous -->
        <div
          v-if="hasDetails(c.id)"
          class="mt-3 text-sm text-gray-700 space-y-1"
        >
          <p v-if="programmingByCinema[c.id]?.suggested > 0">
            Séances suggérées :
            <strong>{{ programmingByCinema[c.id].suggested }}</strong>
          </p>
          <p v-if="programmingByCinema[c.id]?.capLabel">
            Max : {{ programmingByCinema[c.id].capLabel }}
          </p>
          <p v-if="programmingByCinema[c.id]?.notes">
            Notes :
            <span class="italic">{{ programmingByCinema[c.id].notes }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between" v-if="isAdmin">
      <div class="flex items-center gap-3 text-xs">
        <Button
          text
          size="small"
          icon="pi pi-copy"
          label="Dupliquer sur l'autre cinéma"
          @click="duplicateToOther"
        />
        <!-- <span class="text-gray-500"
          >Astuce : tu peux cocher les deux cinémas pour une diffusion
          simultanée.</span
        > -->
      </div>
      <Button
        size="small"
        label="Enregistrer"
        @click="save"
        :loading="saving"
      />
    </div>

    <!-- <Divider class="my-4" /> -->

    <!-- Commentaires de programmation -->
    <!--     <div>
      <h5 class="text-sm font-semibold mb-2">Commentaires de programmation</h5>

      <div class="flex-col items-start gap-3">
        <Select
          v-model="commentCinemaId"
          :options="[{ id: null, name: 'Général' }, ...cinemas]"
          optionLabel="name"
          optionValue="id"
          class="w-44"
          panelClass="text-sm"
        />
        <Textarea
          v-model="newComment"
          rows="2"
          autoResize
          class="w-full"
          placeholder="Ajouter un commentaire..."
        />
        <Button
          v-if="isAdmin"
          size="small"
          label="Ajouter"
          @click="addComment"
          :disabled="!newComment.trim()"
        />
      </div>

      <div v-if="commentsLocal.length" class="mt-3 space-y-2">
        <div
          v-for="c in commentsLocal"
          :key="c.id"
          class="text-sm bg-gray-50 p-2 rounded"
        >
          <div class="flex items-center justify-between">
            <div class="text-xs text-gray-600">
              <span class="font-medium">{{ c.username || "—" }}</span>
              <span> • </span>
              <span>{{ formatDate(c.createdAt) }}</span>
              <span v-if="c.cinemaId"> • {{ cinemaName(c.cinemaId) }}</span>
            </div>
          </div>
          <div class="mt-1 whitespace-pre-wrap">{{ c.commentaire }}</div>
        </div>
      </div>
      <div v-else class="text-xs text-gray-500 mt-2">
        Pas encore de commentaires.
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { reactive, ref, watch, computed } from "vue";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import Divider from "primevue/divider";
import { useApi } from "@/composables/useApi";
import { useToast } from "primevue/usetoast";
const { user, isAuthenticated, isAdmin, getUser } = useAuth();
const props = defineProps({
  selectionId: { type: Number, required: true },
  film: { type: Object, required: true }, // { id, title, programming?: [{cinemaId, suggested, capLabel, notes, cycle:{id,name}}], ... }
  cinemas: {
    type: Array,
    default: () => [
      { id: 5, name: "Agon" },
      { id: 2, name: "Hauteville" },
    ],
  },
  cycles: {
    type: Array,
    default: () => [], // [{id, name}]
  },
  // commentaires déjà chargés (optionnel), sinon on garde local
  programmingComments: {
    type: Array,
    default: () => [], // [{id, cinemaId?, username?, createdAt, commentaire}]
  },
});
const classesFor = (c) => {
  // par id (ou c.name.toLowerCase().includes('agon'))
  const isAgon = c.id === 5; // Agon
  const isHauteville = c.id === 2; // Hauteville

  if (isAgon) {
    return {
      box: "bg-red-50 border-red-200",
      badgeLow: "bg-red-100 text-red-700",
      badgeHigh: "bg-red-200 text-red-800",
      chip: "bg-red-100 text-red-700",
    };
  }
  if (isHauteville) {
    return {
      box: "bg-blue-50 border-blue-200",
      badgeLow: "bg-blue-100 text-blue-700",
      badgeHigh: "bg-blue-200 text-blue-800",
      chip: "bg-blue-100 text-blue-700",
    };
  }
  // défaut (si d'autres cinémas existent un jour)
  return {
    box: "bg-gray-50 border-gray-200",
    badgeLow: "bg-gray-100 text-gray-700",
    badgeHigh: "bg-gray-200 text-gray-800",
    chip: "bg-gray-100 text-gray-700",
  };
};
const displayCinemas = computed(() => {
  return props.cinemas.filter(
    (c) => isAdmin || programmingByCinema.value[c.id]
  );
});

const emit = defineEmits(["saved", "error", "updated"]);
function shouldDisplayCinema(c) {
  if (isAdmin) return true;
  const p = programmingByCinema.value[c.id];
  return !!p && (p.suggested > 0 || p.capLabel || p.notes);
}
const { apiFetch } = useApi();
const toast = useToast();
const saving = ref(false);

// options "cap" pré-remplies
const capOptions = [
  { label: "≤ 3 séances", value: "≤3 séances" },
  { label: "≤ 6 séances", value: "≤6 séances" },
  { label: "≤ 9 séances", value: "≤9 séances" },
  { label: "Max 3", value: "max 3" },
  { label: "Max 6", value: "max 6" },
  { label: "Max 9", value: "max 9" },
];
const programmingByCinema = computed(() => {
  const map = {};
  for (const p of props.film?.programming || []) {
    if (!p.cinemaId) continue;
    map[p.cinemaId] = {
      suggested: Number(p.suggested ?? 0),
      capLabel: p.capLabel ?? null,
      notes: p.notes ?? "",
      cycle: p.cycle ?? null,
    };
  }
  return map;
});
// état par cinéma
const makeEmpty = () => ({
  checked: false,
  suggested: 0,
  capLabel: null,
  notes: "",
  cycleId: null,
});
const displayedCinemas = computed(() => {
  return props.cinemas.filter((c) => {
    return isAdmin || !!programmingByCinema.value[c.id];
  });
});
const state = reactive({});
for (const c of props.cinemas) state[c.id] = makeEmpty();

// init à partir de film.programming (si présent)
const hydrateFromFilm = () => {
  if (!props.film?.programming) return;
  for (const p of props.film.programming) {
    if (!state[p.cinemaId]) continue;
    state[p.cinemaId].checked = true;
    state[p.cinemaId].suggested = Number(p.suggested || 0);
    state[p.cinemaId].capLabel = p.capLabel || null;
    state[p.cinemaId].notes = p.notes || "";
    state[p.cinemaId].cycleId = p.cycle?.id ?? null;
  }
};
hydrateFromFilm();
console.log(props.film.programming);

watch(
  () => props.film?.programming,
  () => hydrateFromFilm(),
  { deep: true }
);

// duplication simple : copie la première salle cochée vers l'autre
function duplicateToOther() {
  const checked = props.cinemas.filter((c) => state[c.id].checked);
  if (checked.length !== 1) {
    toast.add({
      severity: "info",
      summary: "Duplication",
      detail: "Coche exactement 1 cinéma pour dupliquer vers l'autre.",
      life: 3000,
    });
    return;
  }
  const from = checked[0];
  const to = props.cinemas.find((c) => c.id !== from.id);
  if (!to) return;
  state[to.id].checked = true;
  state[to.id].suggested = state[from.id].suggested;
  state[to.id].capLabel = state[from.id].capLabel;
  state[to.id].notes = state[from.id].notes;
  state[to.id].cycleId = state[from.id].cycleId;
}

const payload = computed(() => {
  const cinemasChecked = props.cinemas
    .filter((c) => state[c.id].checked)
    .map((c) => c.id);
  const perCinema = {};
  for (const c of props.cinemas) {
    if (!state[c.id].checked) continue;
    perCinema[c.id] = {
      suggested: clamp09(state[c.id].suggested),
      capLabel: state[c.id].capLabel || null,
      notes: (state[c.id].notes || "").trim() || null,
      cycleId: state[c.id].cycleId || null,
    };
  }
  return {
    items: [
      {
        filmId: props.film.id,
        cinemas: cinemasChecked,
        perCinema,
      },
    ],
  };
});

function clamp09(v) {
  const n = Number(v) || 0;
  return Math.max(0, Math.min(9, Math.round(n)));
}

async function save() {
  // validation
  const anyChecked = props.cinemas.some((c) => state[c.id].checked);
  if (!anyChecked) {
    toast.add({
      severity: "warn",
      summary: "Aucun cinéma",
      detail: "Coche au moins un cinéma.",
      life: 2500,
    });
    return;
  }
  for (const c of props.cinemas) {
    if (!state[c.id].checked) continue;
    const s = clamp09(state[c.id].suggested);
    if (s < 0 || s > 9) {
      toast.add({
        severity: "error",
        summary: "Séances invalides",
        detail: `Le nombre doit être entre 0 et 9 pour ${c.name}.`,
        life: 3000,
      });
      return;
    }
  }

  saving.value = true;
  try {
    await apiFetch(`/selections/${props.selectionId}/programming`, {
      method: "POST",
      body: payload.value,
    });

    toast.add({
      severity: "success",
      summary: "Programmation enregistrée",
      life: 2000,
    });
    emit("saved", { filmId: props.film.id });
    // Option : émettre "updated" avec un snapshot local
    const snapshot = buildLocalProgrammingSnapshot();
    emit("updated", { filmId: props.film.id, programming: snapshot });
  } catch (e) {
    console.error(e);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Échec de l'enregistrement.",
      life: 3000,
    });
    emit("error", e);
  } finally {
    saving.value = false;
  }
}

function buildLocalProgrammingSnapshot() {
  const out = [];
  for (const c of props.cinemas) {
    if (!state[c.id].checked) continue;
    out.push({
      cinemaId: c.id,
      cinemaName: c.name,
      suggested: clamp09(state[c.id].suggested),
      capLabel: state[c.id].capLabel || null,
      notes: (state[c.id].notes || "").trim() || null,
      cycle: props.cycles.find((x) => x.id === state[c.id].cycleId) || null,
    });
  }
  return out;
}

// commentaires de programmation
const commentsLocal = ref([...props.programmingComments]);
const newComment = ref("");
const commentCinemaId = ref(null);

function cinemaName(id) {
  return props.cinemas.find((c) => c.id === id)?.name || `Cinéma ${id}`;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("fr-FR");
  } catch {
    return iso || "";
  }
}

async function addComment() {
  const txt = (newComment.value || "").trim();
  if (!txt) return;

  try {
    const created = await apiFetch(
      `/selections/${props.selectionId}/programming/${props.film.id}/comments`,
      {
        method: "POST",
        body: {
          cinemaId: commentCinemaId.value ?? null,
          commentaire: txt,
        },
        credentials: "include",
      }
    );
    commentsLocal.value.unshift(created);
    newComment.value = "";
    toast.add({
      severity: "success",
      summary: "Commentaire ajouté",
      life: 1500,
    });
  } catch (e) {
    console.error(e);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Impossible d'ajouter le commentaire.",
      life: 2500,
    });
  }
}
//NEW
const isChosen = (cinemaId) => !!programmingByCinema.value[cinemaId];

const hasDetails = (cinemaId) => {
  const p = programmingByCinema.value[cinemaId];
  if (!p) return false;
  return (
    Number(p.suggested) > 0 || !!p.capLabel || !!(p.notes && p.notes.trim())
  );
};

const adminCinemas = computed(() => props.cinemas); // tout pour admin
const nonAdminCinemas = computed(() =>
  props.cinemas.filter((c) => isChosen(c.id))
); // seulement cochés
</script>

<style scoped>
/* petits ajustements visuels */
</style>
