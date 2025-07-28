<template>
  <div class="p-6 max-w-7xl mx-auto">
    <Toast />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["authenticated"],
});
import Toast from "primevue/toast";
</script>

<style></style>
