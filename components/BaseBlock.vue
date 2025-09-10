<template>
  <section class="bg-white shadow-md rounded-lg p-4 md:p-6 border">
    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
      <span class="w-1 h-5 bg-blue-500 rounded"></span>
      <span>{{ title }}</span>
    </h2>
    <slot />
  </section>
</template>
