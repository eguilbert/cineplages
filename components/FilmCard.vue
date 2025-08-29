<template>
  <div
    class="border rounded p-3 bg-white shadow-sm relative"
    :class="
      displayMode === 'grid'
        ? 'flex flex-col'
        : 'flex flex-row gap-4 w-full items-start'
    "
  >
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
            <span v-if="isAdmin" style="font-size: 10px"> [{{ film.id }}]</span>
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
      <div
        v-for="(award, i) in film.awards"
        :key="i"
        class="flex flex-col gap-1 items-center mb-2"
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
      <div
        class="text-sm text-gray-600 space-y-2"
        v-if="mode !== 'programmation'"
      >
        <!-- BONUS INFO -->
        <Accordion multiple :value="['1', '2']">
          <AccordionPanel value="0" class="screen-only">
            <AccordionHeader
              style="
                background-color: rgba(151, 234, 118, 0.8);
                color: rgba(30, 80, 10, 0.8);
                font-weight: 300;
              "
              class="screen-only"
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
              class="screen-only"
              ><i class="pi pi-comment mr-2"></i> commentaires
              <Badge
                :value="film.comments.length"
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
          <AccordionPanel value="2" class="screen-only">
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
                class="ml-auto mr-2"
                :value="totalInterests"
                style="background-color: rgba(230, 55, 12, 0.91)"
              />
            </AccordionHeader>
            <AccordionContent>
              <div class="interest-select mt-3">
                <PickInterest
                  v-model="myInterest"
                  :film-id="filmId"
                  :mode="mode"
                />
                <!-- @user-change="onChangeInterest" -->
              </div>
              <!-- <div v-else>Le vote est terminé.</div> -->
              <div class="interest-bar screen-only">
                <div class="text-xs font-bold mb-1 mt-2">
                  Avis des programmateurs :
                </div>
                <p v-if="counts">
                  <span
                    v-for="(n, key) in counts"
                    :key="key"
                    v-show="n > 0"
                    class="mr-2"
                  >
                    {{ INTEREST_LABEL[key] }} : {{ n }}<br />
                  </span>
                </p>
                <p v-else>Pas d'avis partagé pour l'instant</p>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
        <div v-if="voteOpen" class="mt-2">
          VOTES
          <label for="vote-count" class="block text-xs text-gray-500 mb-1">
            Nombre de voix (max {{ nbVotants }}) note:{{ note }}
          </label>
          <InputNumber
            v-model="vote"
            :max="nbVotants"
            :min="0"
            class="w-full"
            @input="handleVoteChange"
          />
        </div>

        <div class="absolute bottom-4 right-2 screen-only" v-if="isAdmin">
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
          v-if="isAdmin && mode !== 'programmation'"
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

      <ProgrammingPanel
        v-if="mode === 'programmation'"
        :selection-id="selectionId"
        :film="film"
        :cinemas="[
          { id: 5, name: 'Agon' },
          { id: 2, name: 'Hauteville' },
        ]"
        :cycles="cycles"
        :programming-comments="film.programmingComments || []"
        @saved="() => loadSelection()"
        @updated="
          ({ filmId, programming }) => {
            const f = selection.films.find((x) => x.id === filmId);
            if (f) f.programming = programming;
          }
        "
      />
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

const props = defineProps({
  film: { type: Object, required: true },
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
  nbVotants: { type: Number, default: 0 },

  initialInterestCounts: { type: Object, default: null },
  voteOpen: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  interestCounts: { type: Object },
  mode: { type: String, default: "none" },
  selectionId: { type: [Number, String], default: null },
});

// Intérêts (moi + agrégats)
const { fetchInterests, myInterestFor, updateInterest } = useMyInterests();
const { fetchStatsForFilm } = useInterestStats();

// 1) computed en v-model direct (pas de ref local)
const optimisticInterest = ref(null); // <-- nouveau

const myInterest = computed({
  get() {
    // si on vient de choisir une valeur, on l'affiche tout de suite
    console.log(
      "myInterest computed get:",
      optimisticInterest.value,
      myInterestFor(filmId.value)
    );
    return (
      (optimisticInterest.value ?? myInterestFor(filmId.value)) ||
      "SANS_OPINION"
    );
  },

  async set(newValue) {
    console.log("myInterest computed set NEW VALUE:", newValue);
    const prev = myInterestFor(filmId.value) || "SANS_OPINION";
    if (newValue === prev) return;

    optimisticInterest.value = newValue;

    const toNum = (v) => (Number.isFinite(+v) ? +v : 0);
    const before = { ...counts.value };
    const next = {
      SANS_OPINION: 0,
      NOT_INTERESTED: 0,
      CURIOUS: 0,
      VERY_INTERESTED: 0,
      MUST_SEE: 0,
      ...Object.fromEntries(
        Object.entries(before).map(([k, v]) => [k, toNum(v)])
      ),
    };

    if (next[prev] > 0) next[prev] -= 1;
    next[newValue] = toNum(next[newValue]) + 1;
    counts.value = next;
    console.log("Updated counts:", counts.value);
    const localScore = computePopularityScore(next);
    console.log("Optimistic score:", localScore);
    emit("score-changed", { filmId: filmId.value, score: localScore });

    try {
      await updateInterest(filmId.value, newValue);
      /*       const { score } = await apiFetch(`/films/${filmId.value}/score`);
       */ emit("score-changed", {
        filmId: filmId.value,
        score: localScore ?? score,
      });
    } catch (e) {
      counts.value = before;
      const rolledBack = computeAggregateScore(before, props.film.rating ?? 0);
      emit("score-changed", { filmId: filmId.value, score: rolledBack });
      optimisticInterest.value = prev;
      console.error("update interest failed", e);
    } finally {
      optimisticInterest.value = null;
    }
  },
});
function handleVoteChange(value) {
  emit("vote-change", { filmId: props.film.id, vote: value });
}
const counts = ref(
  props.initialInterestCounts || {
    SANS_OPINION: 0,
    NOT_INTERESTED: 0,
    CURIOUS: 0,
    VERY_INTERESTED: 0,
    MUST_SEE: 0,
  }
);
const saving = ref(false);

function initCounts(obj) {
  counts.value = {
    SANS_OPINION: 0,
    NOT_INTERESTED: 0,
    CURIOUS: 0,
    VERY_INTERESTED: 0,
    MUST_SEE: 0,
    ...(obj || {}),
  };
}

onMounted(async () => {
  // Mes intérêts (chargés une fois au global par le 1er appel)
  await fetchInterests({ force: false }); // force:true si tu veux forcer le refresh

  // 2) init des agrégats
  if (props.initialInterestCounts) {
    initCounts(props.initialInterestCounts);
  } else {
    const one = await fetchStatsForFilm(filmId.value);
    initCounts(one);
  }
});

function getScoreColor(score) {
  if (score >= 10) return "#ff3b3b"; // très chaud
  if (score >= 7) return "#ff884d";
  if (score >= 4) return "#ffd966";
  if (score >= 1) return "#b0e57c";
  return "#a0c4ff"; // froid
}
const totalInterests = computed(() => {
  return Object.values(counts.value).reduce((sum, n) => sum + (n || 0), 0);
});

async function updateCommentCounts(commentsCounts) {
  totalComments.value = commentsCounts;
}

const awards = ref([]);
const externalLinks = ref([]);
const vote = ref([]);

const myScore = computed(() => {
  const avgRating = props.film.avgRating ?? props.film.rating ?? 0;
  return computeAggregateScore(counts.value, avgRating);
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
  console.log("myScore changed:", val);
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
