<template>
  <div class="mt-8">
    <h2 class="text-xl font-bold mb-2">Utilisateurs</h2>

    <ul class="divide-y">
      <li
        v-for="user in users"
        :key="user.user_id"
        class="py-2 flex justify-between items-center"
      >
        <div>
          <strong>{{ user.username || "–" }}</strong>
          <br />
          <small
            >{{ user.role }} — Cinéma ID : {{ user.cinemaId ?? "—" }}</small
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const users = ref([]);
const config = useRuntimeConfig();

onMounted(async () => {
  const data = await $fetch(`${config.public.apiBase}/users`);
  users.value = data;
});
</script>
