<template>
  <div class="p-2 rounded-md text-sm">
    <!--     <small> Commentaires </small>
 -->
    <div class="flex justify-between items-center mb-2">
      <!--       <strong>Commentaires</strong>
 -->
      <!-- Liste des commentaires -->

      <TransitionGroup name="fade-slide" tag="div" class="space-y-2 mb-2">
        <div
          v-for="c in localComments"
          :key="c.userId"
          class="pb-1 border-l-2 border-green-500 pl-2"
        >
          <span class="font-semibold">{{ c.username }} :</span>
          <span class="italic">{{ c.commentaire }}</span>
        </div>
      </TransitionGroup>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mt-2 space-y-2">
      <textarea
        v-model="commentaire"
        rows="3"
        class="w-full border p-2 text-sm"
        placeholder="Votre commentaire..."
      />
      <div class="flex gap-2">
        <Button
          variant="outlined"
          @click="handleSubmit"
          class="px-3 py-1 bg-blue-600 text-white text-sm rounded"
          :disabled="loading"
          icon="pi pi-comment"
          label="Mettre à jour"
          size="small"
          v-if="myComment"
        />
        <!-- </Button> -->
        <Button
          variant="outlined"
          @click="handleSubmit"
          class="px-3 py-1 bg-blue-600 text-white text-sm rounded"
          :disabled="loading"
          icon="pi pi-comment"
          label="Ajouter"
          size="small"
          v-else
        />
        <Button
          v-if="myComment"
          @click="handleDelete"
          class="text-red-500 text-sm"
          size="small"
          icon="pi pi-trash"
          label="Supprimer"
        />
      </div>
    </div>
    <!-- Bouton discret en rond -->
    <div v-if="!showForm" class="relative group inline-block">
      <Button
        severity="success"
        variant="text"
        raised
        size="small"
        class="text-sm font-light color-blue-500"
        @click="showForm = true"
      >
        <span v-if="!myComment">
          <i class="pi pi-plus"></i> Ajouter un commentaire
        </span>
        <span v-else>
          <i class="pi pi-pencil"></i> Modifier votre commentaire
        </span>
      </Button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
const config = useRuntimeConfig();

const props = defineProps({
  filmId: Number,
  userId: String,
  username: String,
  comments: Array, // Array of { user_id, username, commentaire, createdAt }
});
//const toast = useToast();

const emit = defineEmits(["update-comments-number"]);

const localComments = ref([...props.comments]);

const myComment = computed(() =>
  localComments.value.find((c) => c.user_id === props.userId)
);

const showForm = ref(false);
const commentaire = ref("");
const loading = ref(false);
const toast = useToast();

watch(myComment, (newVal) => {
  if (newVal) {
    commentaire.value = newVal.commentaire;
  } else {
    commentaire.value = "";
  }
});
watchEffect(() => {
  // synchroniser si props changent
  localComments.value = [...props.comments];
});

// Initialiser si commentaire existant
if (myComment.value) {
  commentaire.value = myComment.value.commentaire;
}

const handleSubmit = async () => {
  if (!commentaire.value.trim()) return;
  loading.value = true;
  try {
    const updated = await $fetch(
      `${config.public.apiBase}/films/${props.filmId}/comment`,
      {
        method: "POST",
        body: {
          user_id: props.userId,
          commentaire: commentaire.value,
        },
      }
    );

    const index = localComments.value.findIndex(
      (c) => c.user_id === props.userId
    );
    if (index !== -1) {
      localComments.value[index].commentaire = updated.commentaire;
    } else {
      localComments.value.push({
        user_id: props.userId,
        username: props.username || "Moi",
        commentaire: updated.commentaire,
        createdAt: updated.createdAt,
      });
    }

    showForm.value = false;
    toast.add({
      severity: "success", // "info", "warn", "error"
      summary: "Commentaire enregistré",
      detail: "Merci pour votre commentaire !",
      life: 3000,
    });
    console.log("nombre de commentaires", localComments.value.length);
    emit("update-comments-number", localComments.value.length);
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Impossible d’enregistrer le commentaire",
      life: 3000,
    });
    console.error("Erreur lors de l'envoi :", e); // 🔍 utile pour débug
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm("Supprimer votre commentaire ?")) return;
  console.log("filmId", props.filmId);
  try {
    await $fetch(
      `${config.public.apiBase}/films/${props.filmId}/comment/${props.userId}`,
      {
        method: "DELETE",
      }
    );

    // ⚡️ Retirer le commentaire localement
    localComments.value = localComments.value.filter(
      (c) => c.user_id !== props.userId
    );
    emit("update-comments-number", localComments.value.length);

    commentaire.value = "";
    showForm.value = false;
    emit("update-comments", localComments.value);
    toast.add({
      severity: "success", // "info", "warn", "error"
      summary: "Commentaire effacé",
      detail: "",
      life: 3000,
    });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Impossible d'effacer le commentaire",
      life: 3000,
    });
  }
};
</script>
<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-leave-active {
  position: absolute;
}
</style>
