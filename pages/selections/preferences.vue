<!-- /pages/films/selections.vue -->
<template>
  <PreferenceEditor />
</template>

<script setup>
definePageMeta({
  requiredRole: "ADMIN",
});
import SelectionViewer from "@/components/PreferenceEditor";
</script>
