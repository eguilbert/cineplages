<template>
  <div
    class="border rounded p-3 bg-white shadow-sm relative"
    :class="
      layout === 'grid'
        ? 'flex flex-col'
        : 'flex flex-row gap-4 w-full items-start'
    "
  >
    <div>
      <small class="center"> {{ formatDate(film.releaseDate) }} </small>

      <img
        :src="film.poster"
        alt="Poster"
        class="rounded"
        :class="layout === 'grid' ? 'w-full mb-2' : 'w-40 h-auto object-cover'"
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
            {{ film.title }} ({{ film.origin }})
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
        <!--       <small class="line-clamp-2 block border border-blue-100 p-2 mb-2">
 -->
        {{ film.synopsis }}
      </small>

      <div class="text-sm text-gray-600 space-y-2">
        <hr />
        <hr />

        <!--  <div class="mt-2">
          <label class="block text-xs mb-1">Notes :</label>
          <textarea
            v-model="local.commentaire"
            class="w-full text-sm border rounded p-1 italic"
            rows="2"
          />
        </div>

        <div class="mt-2">
          <label class="block text-xs mb-1">Votes :</label>
          <Rating v-model.number="local.rating" :stars="10" />
        </div>

        <div class="mt-2">
          <label class="block text-xs mb-1">Tags :</label>
          <Chips v-model="local.tags" separator="," class="w-full" />
        </div> -->
        <!-- Commentaire -->

        <div v-if="film.commentaire">
          <p class="text-gray-700 italic">« {{ film.commentaire }} »</p>
        </div>

        <!-- Tags -->
        <div v-if="film.tags && film.tags.length">
          <p class="mt-2 text-sm text-blue-700">#{{ film.tags.join(" #") }}</p>
        </div>

        <!-- Awards -->
        <div v-if="film.awards && film.awards.length">
          <p class="mt-2 text-sm text-yellow-700">
            🏆 {{ film.awards.join(", ") }}
          </p>
        </div>

        <!-- External Links -->
        <div v-if="film.externalLinks && film.externalLinks.length">
          <ul class="mt-2 text-sm text-green-600">
            <li v-for="(link, index) in film.externalLinks" :key="index">
              <a :href="link.url" target="_blank" rel="noopener noreferrer">{{
                link.label
              }}</a>
            </li>
          </ul>
        </div>

        <div class="mt-2">
          <label class="block text-xs mb-1">Votes :</label>
          <Rating v-model.number="local.rating" :stars="10" />
        </div>

        <!-- Bouton "+" -->
        <div class="absolute bottom-4 right-2" v-if="role === 'ADMIN'">
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
            <button @click="selectForm('commentaire')">Ajouter une note</button>
            <button @click="selectForm('tag')">Ajouter des tags</button>
            <button @click="selectForm('award')">Ajouter un prix</button>
            <button @click="selectForm('link')">Ajouter un lien externe</button>
          </div>
        </div>

        <!-- Formulaires d'ajout -->
        <div v-if="formToShow === 'commentaire'" class="mt-4">
          <input
            v-model="newCommentaire"
            class="border p-1"
            placeholder="Votre commentaire"
          />
          <button @click="addCommentaire">OK</button>
        </div>

        <div v-if="formToShow === 'tag'" class="mt-4">
          <input
            v-model="newTag"
            class="border p-1"
            placeholder="Tags séparés par des virgules"
          />
          <button @click="addTags">OK</button>
        </div>

        <div v-if="formToShow === 'award'" class="mt-4">
          <input
            v-model="newAward"
            class="border p-1"
            placeholder="Nom de la récompense"
          />
          <button @click="addAward">OK</button>
        </div>

        <div v-if="formToShow === 'link'" class="mt-4">
          <input
            v-model="newLinkLabel"
            class="border p-1"
            placeholder="Label"
          />
          <input v-model="newLinkUrl" class="border p-1" placeholder="URL" />
          <button @click="addExternalLink">OK</button>
        </div>

        <TrailerPlayer :youtubeUrl="film.trailerUrl" />

        <!-- Actions rapides -->
        <div class="mt-3 flex gap-2 text-xs flex-wrap" v-if="role === 'ADMIN'">
          <!--  <Button
            icon="pi pi-refresh"
            label="MAJ TMDB"
            text
            @click="refreshFilm"
          /> -->
          <Button
            icon="pi pi-save"
            label="Sauvegarder"
            text
            severity="success"
            @click="saveChanges"
          />
          <Button
            icon="pi pi-times"
            label="Retirer"
            text
            severity="danger"
            @click="removeFilm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

import Rating from "primevue/rating";
import Button from "primevue/button";
import Chips from "primevue/chips";
import TrailerPlayer from "./TrailerPlayer.vue";

const emit = defineEmits(["update", "remove"]);

const props = defineProps({
  film: Object,
  layout: {
    type: String,
    default: "grid",
  },
  id: {
    type: [String, Number],
    required: true,
  },
});

const local = reactive({
  commentaire: props.film.commentaire || "",
  rating: props.film.rating || 0,
  tags: props.film.tags || [],
});

watch(
  () => props.film,
  (newFilm) => {
    local.commentaire = newFilm.commentaire || "";
    local.rating = newFilm.rating || 0;
    local.tags = newFilm.tags || [];
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

function refreshFilm() {
  console.log("🔁 Demande de mise à jour TMDB pour", props.film.title);
  // TODO : appel API de refresh
}

function saveChanges() {
  emit("update", {
    ...props.film,
    commentaire: local.commentaire,
    rating: local.rating,
    tags: local.tags,
  });
}

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
const newAward = ref("");
const newLinkLabel = ref("");
const newLinkUrl = ref("");

// Ajout
const addCommentaire = () => {
  props.film.commentaire = newCommentaire.value;
  newCommentaire.value = "";
  formToShow.value = null;
};

const addTags = () => {
  props.film.tags = newTag.value.split(",").map((t) => t.trim());
  newTag.value = "";
  formToShow.value = null;
};

const addAward = () => {
  if (!props.film.awards) props.film.awards = [];
  props.film.awards.push(newAward.value);
  newAward.value = "";
  formToShow.value = null;
};

const addExternalLink = () => {
  if (!props.film.externalLinks) props.film.externalLinks = [];
  props.film.externalLinks.push({
    label: newLinkLabel.value,
    url: newLinkUrl.value,
  });
  newLinkLabel.value = "";
  newLinkUrl.value = "";
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
