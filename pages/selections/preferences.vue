<!-- /pages/films/selections.vue -->
<template>
  <PreferenceEditor />
</template>

<script setup>
definePageMeta({
  middleware: ["authenticated"],
});
import SelectionViewer from "@/components/PreferenceEditor";
</script>
