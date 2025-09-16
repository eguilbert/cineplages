<template>
  <div
    class="border rounded p-3 shadow-sm relative"
    :class="[
      displayMode === 'grid'
        ? 'flex flex-col'
        : 'flex flex-row gap-4 w-full items-start',
    ]"
  >
    <small class="center">
      {{ formatDate(film.releaseDate) }}
    </small>
    <div
      class="flex"
      :class="compact ? 'items-center gap-3' : 'items-start gap-4'"
    >
      <img
        v-if="film.poster"
        :src="film.poster"
        alt="Poster"
        class="rounded screen-only w-40 h-auto object-cover"
      />
    </div>
    <div class="flex-1">
      <div class="flex justify-between items-start mb-1">
        <div>
          <a
            :href="`https://www.themoviedb.org/movie/${film.tmdbId}`"
            target="_blank"
            class="text-blue-600 font-semibold hover:underline"
          >
            {{ film.title }}
            <small> ({{ film.origin }})</small>
            <span v-if="isAdmin" style="font-size: 10px"> [{{ film.id }}]</span>
          </a>
          <br />
          <small class="bg-blue-500/10 px-2 py-0.5 rounded">{{
            film.directorName
          }}</small>

          <!-- Toggle individuel -->
        </div>
        <span
          class="text-xs rounded px-2 py-0.5"
          :class="badgeClass(film.category)"
        >
          {{ film.category || "Non classé" }}
        </span>
      </div>
      <div v-if="film.genre">
        {{ film.genre }}
        <span v-if="film.duration > 0">/ {{ film.duration }}m</span>
      </div>
      <div
        class="text-sm text-gray-600 space-y-2"
        :class="{ 'screen-only': mode === 'programmation' }"
      >
        <div v-if="film.actors">Avec: {{ film.actors }}</div>
      </div>
      <small class="block border border-blue-100 p-2 mb-2">
        {{ film.synopsis }}
      </small>
      <div
        v-for="(award, i) in film.awards"
        :key="i"
        class="flex flex-col gap-1 items-center mb-2"
        :class="{ 'screen-only': mode === 'programmation' }"
      >
        <small
          style="
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
              'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
          "
        >
          <i class="pi pi-trophy" style="color: chocolate"></i>

          {{ award.prize }} - {{ award.festival }}
        </small>
      </div>
      <div class="screen-only py-3">
        <TrailerPlayer :youtubeUrl="film.trailerUrl" class="screen-only mb-2" />
      </div>
      <div class="grid md:grid-cols-3 gap-6" v-if="isAdmin">
        <div class="md:col-span-3 space-y-3">
          <AddToListButton :film-id="filmId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch, toRaw } from "vue";
import InputNumber from "primevue/inputnumber";

import { getInterestCount, computeAggregateScore } from "@/utils/score";
import Rating from "primevue/rating";
import Button from "primevue/button";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import TrailerPlayer from "./TrailerPlayer.vue";
import AddToListButton from "./lists/AddToListButton.vue";
import PublicRating from "./film/PublicRating.vue";
import Badge from "primevue/badge";
const config = useRuntimeConfig();
const ready = ref(false);
const { apiFetch } = useApi();

import { useMyInterests } from "@/composables/useMyInterests";
import { useInterestStats } from "@/composables/useInterestStats";
import { EMPTY_COUNTS, INTEREST_LABEL } from "@/lib/interests";

const totalComments = ref(0);
const emit = defineEmits([
  "update",
  "remove",
  "toggle-selection",
  "interest-change",
  "score-changed",
  "vote-change",
]);
const localVote = ref(0);
const emitUpdate = () => {
  alert("Film mis à jour !");
  emit("update", toRaw(localFilm));
};
const countOfInterests = getInterestCount();
const myComment = ref("");
const filmId = computed(() => props.film.id);
const categoryCompact = {
  "Art et Essai": "A&E",
  Documentaire: "Doc",
  Jeunesse: "J",
  "Grand Public": "GP",
};
const displayMode = "grid";
const props = defineProps({
  film: { type: Object, required: true },
});
const localExpanded = ref(false);
watchEffect(() => {
  if (props.compact) localExpanded.value = false;
});

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

function removeFilm() {
  emit("remove", props.film);
}
const showMenu = ref(false);
const formToShow = ref(null);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
  formToShow.value = null;
};

const selectForm = (type) => {
  formToShow.value = type;
  showMenu.value = false;
};

// Formulaires
const newCommentaire = ref("");
const newTag = ref("");

// Ajout
const addCommentaire = () => {
  console.log("Adding commentaire:", newCommentaire.value);
  props.film.commentaire = newCommentaire.value;
  localFilm.commentaire = newCommentaire.value;
  newCommentaire.value = "";
  formToShow.value = null;
};

const addTags = () => {
  props.film.tags = newTag.value.split(",").map((t) => t.trim());
  newTag.value = "";
  formToShow.value = null;
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
