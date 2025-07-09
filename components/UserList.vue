<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold mb-4">Utilisateurs enregistrés</h2>

    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 text-left">Email</th>
          <th class="p-2 text-left">Rôle</th>
          <th class="p-2 text-left">Modifier le rôle</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="border-b">
          <td class="p-2">{{ user.email }}</td>
          <td class="p-2">{{ user.role }}</td>
          <td class="p-2">
            <select
              v-model="user.newRole"
              @change="changeRole(user)"
              class="input"
            >
              <option value="INVITE">INVITE</option>
              <option value="PROGRAMMEUR">PROGRAMMEUR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="message" class="text-green-600">{{ message }}</p>
    <p v-if="error" class="text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const users = ref<any[]>([]);
const message = ref("");
const error = ref("");

onMounted(async () => {
  const { users: list, error: err }: any = await $fetch("/api/listUsers");

  if (err) {
    error.value = err;
  } else {
    users.value = list.sort((a: any, b: any) => a.email.localeCompare(b.email));
  }
});

const changeRole = async (user: any) => {
  error.value = "";
  message.value = "";

  const { error: updateError } = await $fetch("/api/updateUserRole", {
    method: "POST",
    body: {
      user_id: user.id,
      role: user.newRole,
    },
  });

  if (updateError) {
    error.value = updateError.message;
  } else {
    message.value = `Rôle mis à jour pour ${user.email}`;
    user.role = user.newRole;
  }
};
</script>

<style scoped>
.input {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
}
</style>
