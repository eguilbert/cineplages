// composables/usePermissions.ts
import { useSupabaseUser } from "#imports";
import { computed } from "vue";

export function usePermissions() {
  const user = useSupabaseUser();
  const profile = useUserProfile(); // ton profil enrichi (role, cinemaId, etc.)

  const isAdmin = computed(() => profile.value?.role === "ADMIN");
  const isProgrammer = computed(() => profile.value?.role === "PROGRAMMEUR");
  const isInvite = computed(() => profile.value?.role === "INVITE");

  const userCinemaId = computed(() => profile.value?.cinemaId ?? null);

  function can(action: string, resource: any): boolean {
    if (!profile.value) return false;

    switch (action) {
      case "edit-film":
        return (
          isAdmin.value ||
          (isProgrammer.value && resource?.cinemaId === userCinemaId.value)
        );

      case "vote":
        return (
          !profile.value?.banned &&
          resource?.cinemaIds?.includes(userCinemaId.value)
        );

      case "comment":
        return !!user.value;

      case "manage-users":
        return isAdmin.value;

      case "view-selection":
        return (
          isAdmin.value || resource?.cinemaIds?.includes(userCinemaId.value)
        );

      default:
        return false;
    }
  }

  return {
    can,
    isAdmin,
    isProgrammer,
    isInvite,
    userCinemaId,
  };
}

/* UTILISATION
<script setup lang="ts">
import { usePermissions } from "@/composables/usePermissions";

const { can } = usePermissions();

const canEdit = computed(() => can("edit-film", film));
</script>

<template>
  <div v-if="can('edit-film', film)">
    <button class="btn">Modifier</button>
  </div>
</template> */
