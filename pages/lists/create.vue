<template>
  <div
    class="grid gap-6 px-4 py-8 max-w-screen-xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-min"
  >
    <ListCreateForm />
  </div>
</template>

<script setup>
import Toast from "primevue/toast";
import ListCreateForm from "../../components/lists/ListCreateForm.vue";
</script>

<style scoped>
/* Optionnel : légère animation à l’apparition */
section {
  animation: fadeInUp 0.3s ease-in-out;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
