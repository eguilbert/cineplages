<template>
  <div
    class="border rounded p-3 bg-white shadow-sm relative"
    :class="
      displayMode === 'grid'
        ? 'flex flex-col'
        : 'flex flex-row gap-4 w-full items-start'
    "
  >
    <!--   :value="localFilm.myScore"
 -->
    <Badge
      :value="film.score"
      class="ml-auto mr-2"
      size="xlarge"
      style="
        position: absolute;
        background-color: #2b7fff;
        opacity: 0.8;
        right: 0;
        width: 70px;
        height: 70px;
        font-size: 22px;
      "
      :style="{ backgroundColor: getScoreColor(film.score) }"
    />
    <div>
      <small class="center">
        {{ formatDate(film.releaseDate) }}
        <!-- 🇨🇦 {{ formatDate(film.releaseCanDate) }} -->
      </small>

      <img
        v-if="film.poster"
        :src="film.poster"
        alt="Poster"
        class="rounded screen-only"
        :class="
          displayMode === 'grid' ? 'w-full mb-2' : 'w-40 h-auto object-cover'
        "
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
          </a>
          <br />
          <small class="bg-blue-500/10 px-2 py-0.5 rounded">{{
            film.directorName
          }}</small>
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
      <div class="text-sm text-gray-600 space-y-2">
        <div v-if="film.actors">Avec: {{ film.actors }}</div>
      </div>
      <small class="block border border-blue-100 p-2 mb-2">
        {{ film.synopsis }}
      </small>
      <div class="screen-only py-3">
        <TrailerPlayer :youtubeUrl="film.trailerUrl" class="screen-only mb-2" />
      </div>
      <div class="text-sm text-gray-600 space-y-2">
        <!-- BONUS INFO -->
        <Accordion multiple :value="['1', '2']">
          <AccordionPanel value="0">
            <AccordionHeader
              style="
                background-color: rgba(151, 234, 118, 0.8);
                color: rgba(30, 80, 10, 0.8);
                font-weight: 300;
              "
            >
              <i class="pi pi-link mr-2"></i> articles
              <Badge
                :value="film.externalLinks.length"
                class="ml-auto mr-2"
                style="background-color: rgba(30, 80, 10, 0.8)"
            /></AccordionHeader>
            <AccordionContent>
              <div
                v-if="film.externalLinks && film.externalLinks.length"
                class="screen-only"
              >
                <ul class="mt-2 text-sm text-blue-400">
                  <li v-for="(link, index) in film.externalLinks" :key="index">
                    <a
                      :href="link.url"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i class="pi pi-link" v-if="link.label"></i>
                      {{ link.label }}</a
                    >
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="1">
            <AccordionHeader
              style="
                background-color: rgba(151, 221, 243, 0.8);
                color: rgba(0, 108, 143, 0.8);
                font-weight: 300;
              "
              ><i class="pi pi-comment mr-2"></i> commentaires
              <Badge
                :value="totalComments"
                class="ml-auto mr-2"
                style="background-color: rgba(0, 108, 143, 0.8)"
            /></AccordionHeader>
            <AccordionContent>
              <FilmCommentBox
                :film-id="film.id"
                :comments="film.comments"
                :user-id="userId"
                :username="username"
                @update-comments-number="updateCommentCounts"
              />
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="2">
            <AccordionHeader
              style="
                background-color: rgba(255, 237, 141, 0.91);
                color: rgba(230, 55, 12, 0.91);
                font-weight: 300;
                text-align: left;
              "
            >
              <i class="pi pi-user-edit mr-2"></i>vos avis
              <Badge
                :value="totalInterest"
                class="ml-auto mr-2"
                style="background-color: rgba(230, 55, 12, 0.91)"
              />
            </AccordionHeader>
            <AccordionContent>
              <div class="interest-select mt-3" v-if="!voteOpen">
                <PickInterest
                  v-model="interest"
                  :film-id="filmId"
                  @user-change="onUserInterestChange"
                />
              </div>
              <div v-else>Le vote est terminé.</div>
              <div class="interest-bar screen-only">
                <div class="text-xs font-bold mb-1 mt-2">
                  Ce qu'en pensent les programmateurs :
                </div>

                <p v-if="interestCounts">
                  <span v-if="interestCounts.SANS_OPINION > 0">
                    Sans opinion : {{ interestCounts.SANS_OPINION || 0 }}
                  </span>
                  <span v-if="interestCounts.CURIOUS > 0">
                    A discuter : {{ interestCounts.CURIOUS || 0 }}
                  </span>
                  <span v-if="interestCounts.NOT_INTERESTED > 0">
                    Pas intéressé : {{ interestCounts.NOT_INTERESTED || 0 }}
                  </span>
                  <span v-if="interestCounts.MUST_SEE > 0">
                    Très envie : {{ interestCounts.MUST_SEE || 0 }}
                  </span>
                </p>
                <p v-else>Pas d'avis partagé pour l'instant</p>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>

        <div class="mt-2 screen-only" v-if="role === 'ADMIN'">
          <label class="block text-xs mb-1">Votes :</label>
          <Rating
            v-model.number="localFilm.rating"
            :stars="10"
            @change="alert($event.value)"
          />
        </div>
        <!-- Bouton "+" -->
        <div
          class="absolute bottom-4 right-2 screen-only"
          v-if="role === 'ADMIN'"
        >
          <button
            @click="toggleMenu"
            class="bg-gray-200 rounded-full p-1 hover:bg-gray-300"
          >
            +
          </button>

          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 bg-white border shadow z-10 p-2 space-y-2"
            style="width: 200px"
          >
            <button @click="selectForm('commentaire')">
              Ajouter un commentaire
            </button>
            <button @click="selectForm('tag')">Ajouter des tags</button>
            <button @click="selectForm('award')">Ajouter un prix</button>
            <button @click="selectForm('link')">Ajouter un lien externe</button>
          </div>
        </div>

        <div v-if="formToShow === 'tag'" class="mt-4">
          <input
            v-model="newTag"
            class="border p-1"
            placeholder="Tags séparés par des virgules"
          />
          <button @click="addTags">OK</button>
        </div>
        <AwardEditor v-model="localFilm.awards" v-if="formToShow === 'award'" />
        <ExternalLinksEditor
          v-model="localFilm.externalLinks"
          v-if="formToShow === 'link'"
        />

        <!-- Actions rapides -->
        <div
          class="mt-3 flex gap-2 text-xs flex-wrap screen-only"
          v-if="role === 'ADMIN'"
        >
          <Button
            icon="pi pi-save"
            label="Sauvegarder"
            text
            severity="success"
            @click="emitUpdate"
          />
          <Button
            icon="pi pi-times"
            label="Retirer"
            text
            severity="danger"
            @click="removeFilm"
          />
          <Button
            size="small"
            label="🎯 Ajouter à la sélection"
            @click="$emit('toggle-selection', film)"
            class="mt-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, vModelText, watch } from "vue";
import { computeAggregateScore } from "@/utils/score";

import Rating from "primevue/rating";
import Button from "primevue/button";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import TrailerPlayer from "./TrailerPlayer.vue";
import Badge from "primevue/badge";
import { useMyInterests } from "@/composables/useMyInterests";
const config = useRuntimeConfig();
const ready = ref(false);
const { updateInterest } = useMyInterests();
const totalComments = ref(0);
const emit = defineEmits([
  "update",
  "remove",
  "toggle-selection",
  "interest-change",
  "update-interest-counts",
]);
const emitUpdate = () => {
  alert("Film mis à jour !");
  emit("update", toRaw(localFilm));
};
const myComment = ref("");

const props = defineProps({
  film: Object,
  score: Number,
  role: {
    type: String,
    default: "USER",
  },
  username: {
    type: String,
    default: "anonyme",
  },
  userId: {
    type: String,
  },
  displayMode: {
    type: String,
    default: "grid",
  },
  filmId: Number,
  initialInterest: String,
  interestCounts: Object,
  voteOpen: {
    type: Boolean,
    default: true,
  },
});

const totalInterest = computed(() => {
  const counts = props.interestCounts;
  const myVal = interest.value;

  if (!counts || typeof counts !== "object") return myVal ? 1 : 0;

  const baseTotal = ["CURIOUS", "MUST_SEE", "NOT_INTERESTED", "SANS_OPINION"]
    .map((key) => counts[key] ?? 0)
    .reduce((a, b) => a + b, 0);

  return myVal ? baseTotal : baseTotal;
});

const interest = ref(props.initialInterest);
const formerInterest = ref(null);
const initialized = ref(false);
watch(
  () => props.initialInterest,
  (newVal) => {
    console.log("FilmCard: initial interest set to", newVal);
    interest.value = newVal;
    formerInterest.value = newVal; // ✅ on initialise ici une seule fois

    // 💡 Ne pas initialiser si null (pas encore d'intérêt connu)
    if (newVal !== null && newVal !== undefined) {
      initialized.value = true;
      console.log("✅ Initialisation complétée");
    }
  },
  { immediate: true }
);
function onUserInterestChange(newValue) {
  console.log("🎯 Intérêt modifié :", formerInterest.value, "→", newValue);

  if (newValue === formerInterest.value) {
    console.log("⏳ Ignoré : pas de changement d'intérêt");
    return;
  }

  console.log("formerInterest before change", formerInterest.value);
  emit("interest-change", {
    filmId: props.film.id,
    oldValue: formerInterest.value,
    newValue,
  });

  // ✅ Met à jour l'ancien intérêt maintenant qu'on l'a utilisé
  formerInterest.value = newValue;
  console.log("formerInterest changed", formerInterest.value);
}

function getScoreColor(score) {
  if (score >= 10) return "#ff3b3b"; // très chaud
  if (score >= 7) return "#ff884d";
  if (score >= 4) return "#ffd966";
  if (score >= 1) return "#b0e57c";
  return "#a0c4ff"; // froid
}
/* watch(interest, (newValue, oldValue) => {
  console.log(initialized.value);

  if (!initialized.value) {
    // 💡 Premier vrai changement utilisateur
    if (newValue !== null && newValue !== undefined) {
      initialized.value = true;
      console.log("✅ Initialisation retardée activée au premier vrai choix");
    } else {
      console.log("⏳ Ignoré : modification avant initialisation", {
        oldValue,
        newValue,
      });
      return;
    }
  }

  if (newValue !== oldValue) {
    console.log("💡 Emitting interest-change", { oldValue, newValue });
    emit("interest-change", {
      filmId: props.film.id,
      oldValue,
      newValue,
    });
    emit("update-interest-counts", {
      filmId: props.film.id,
      oldValue,
      newValue,
    });
  }
}); */

async function updateCommentCounts(commentsCounts) {
  totalComments.value = commentsCounts;
}
const awards = ref([]);
const externalLinks = ref([]);
const myScore = computed(() => {
  const interestCounts = props.interestCounts || {};
  const avgRating = props.film.avgRating ?? props.film.rating ?? 0;
  console.log("avgRating", props.film.title, avgRating);
  return computeAggregateScore(interestCounts, avgRating);
});
const localFilm = reactive({
  id: props.film.id,
  commentaire: props.film.commentaire || "",
  rating: props.film.rating ?? null,
  tags: props.film.tags || [],
  myScore: 0,
  awards: JSON.parse(JSON.stringify(props.film.awards || [])),
  externalLinks: JSON.parse(JSON.stringify(props.film.externalLinks || [])),
});
const note = computed(() => localFilm.rating); // ← ta note

watch(myScore, (val) => {
  localFilm.myScore = val;
});

watch(
  () => props.film,
  (newFilm) => {
    localFilm.commentaire = newFilm.commentaire || "";
    localFilm.rating = newFilm.rating || 0;
    localFilm.tags = newFilm.tags || [];
  }
);

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
</style>
