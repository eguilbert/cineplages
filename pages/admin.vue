<template>
  <div class="p-8 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Créer un utilisateur</h1>

    <form
      @submit.prevent="createUser"
      class="space-y-4 border p-4 rounded shadow"
    >
      <div>
        <label class="block font-medium">Email</label>
        <input v-model="form.email" type="email" class="input" required />
      </div>

      <div>
        <label class="block font-medium">Mot de passe</label>
        <input v-model="form.password" type="password" class="input" required />
      </div>

      <div>
        <label class="block font-medium">Rôle</label>
        <select v-model="form.role" class="input">
          <option value="INVITE">INVITE</option>
          <option value="PROGRAMMEUR">PROGRAMMEUR</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        Créer
      </button>
    </form>

    <div v-if="message" class="mt-4 text-green-600">{{ message }}</div>
    <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
    <UserList />
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  email: "",
  password: "",
  role: "INVITE",
});

const message = ref("");
const error = ref("");

const createUser = async () => {
  message.value = "";
  error.value = "";

  try {
    const res = await $fetch("/api/createUser", {
      method: "POST",
      body: {
        email: form.email,
        password: form.password,
        role: form.role,
      },
    });

    if (res?.error) {
      error.value = res.error;
    } else {
      message.value = "Utilisateur créé avec succès.";
      form.email = "";
      form.password = "";
      form.role = "INVITE";
    }
  } catch (err: any) {
    error.value = err.message || "Erreur inconnue";
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
}
</style>
