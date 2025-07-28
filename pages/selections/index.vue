<!-- /pages/films/selections.vue -->
<template>
  <SelectionViewer />
</template>

<script setup>
definePageMeta({
  middleware: ["authenticated"],
});
import SelectionViewer from "@/components/SelectionViewer.vue";
</script>
