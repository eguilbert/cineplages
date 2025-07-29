<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Créer un utilisateur</h1>

    <form
      @submit.prevent="createUser"
      class="space-y-4 border p-4 rounded shadow"
    >
      <div>
        <label class="block font-medium">Email</label>
        <input v-model="form.email" type="email" class="input" required />
      </div>

      <!--       <div>
        <label class="block font-medium">Mot de passe</label>
        <input v-model="form.password" type="password" class="input" required />
      </div> -->

      <div>
        <label class="block font-medium">Nom d’usage</label>
        <input v-model="form.username" type="text" class="input" required />
      </div>

      <div>
        <label class="block font-medium">Cinéma (ID)</label>
        <input
          v-model.number="form.cinemaId"
          type="number"
          class="input"
          required
        />
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

    <div class="mt-12 border-t pt-6">
      <h2 class="text-xl font-semibold mb-4">Journal des activités</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Utilisateur</label>
          <select v-model="filters.userId" class="input">
            <option value="">Tous</option>
            <option
              v-for="user in users"
              :key="user.user_id"
              :value="user.user_id"
            >
              {{ user.username || user.user_id }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Type d’action</label>
          <select v-model="filters.action" class="input">
            <option value="">Toutes</option>
            <option value="login">Connexion</option>
            <option value="vote">Vote</option>
            <option value="interest">Intérêt</option>
            <option value="comment">Commentaire</option>
          </select>
        </div>

        <div class="flex gap-2">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Depuis</label>
            <input v-model="filters.startDate" type="date" class="input" />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Jusqu’au</label>
            <input v-model="filters.endDate" type="date" class="input" />
          </div>
        </div>
      </div>

      <div class="overflow-x-auto border rounded">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100 text-left">
            <tr>
              <th class="px-4 py-2">Date</th>
              <th class="px-4 py-2">Utilisateur</th>
              <th class="px-4 py-2">Action</th>
              <th class="px-4 py-2">Contexte</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in filteredLogs" :key="log.id" class="border-t">
              <td class="px-4 py-2">{{ formatDate(log.createdAt) }}</td>
              <td class="px-4 py-2">{{ log.user?.username || log.userId }}</td>
              <td class="px-4 py-2">{{ log.action }}</td>
              <td class="px-4 py-2">{{ log.context || "-" }}</td>
            </tr>
            <tr v-if="filteredLogs.length === 0">
              <td class="px-4 py-2 text-center text-gray-500" colspan="4">
                Aucun résultat
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  requiredRole: "ADMIN",
});
import { format } from "date-fns";
const config = useRuntimeConfig();
const token = config.public.adminToken;
/* const { data: authData } = await supabase.auth.getSession();
const accessToken = authData?.session?.access_token;
 */
console.log("🔗 API Base URL utilisée :", config.public.apiBase);
const form = reactive({
  email: "",
  role: "INVITE",
  username: "",
  cinemaId: null,
});
const message = ref("");
const error = ref("");

const createUser = async () => {
  console.log("🔐 Admin token (Nuxt)", token);
  message.value = "";
  error.value = "";
  try {
    const res = await $fetch(`${config.public.apiBase}/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        /*         Authorization: `Bearer ${accessToken}`,
         */
      },
      body: { ...form },
    });

    if (res?.error) {
      error.value = res.error;
    } else {
      message.value = "Utilisateur créé avec succès.";
      Object.assign(form, {
        email: "",
        role: "INVITE",
        username: "",
        cinemaId: null,
      });
    }
  } catch (err) {
    error.value = err.message || "Erreur inconnue";
  }
};

// 🔍 Journal d'activité
const logs = ref([]);
const users = ref([]);
const filters = reactive({
  userId: "",
  action: "",
  startDate: "",
  endDate: "",
});

const loadLogs = async () => {
  logs.value = await $fetch(`${config.public.apiBase}/activity`);
};
const loadUsers = async () => {
  users.value = await $fetch(`${config.public.apiBase}/users`);
};

const filteredLogs = computed(() => {
  return logs.value.filter((log) => {
    const matchUser = !filters.userId || log.userId === filters.userId;
    const matchAction = !filters.action || log.action === filters.action;
    const date = new Date(log.createdAt);
    const matchStart =
      !filters.startDate || date >= new Date(filters.startDate);
    const matchEnd =
      !filters.endDate || date <= new Date(filters.endDate + "T23:59:59");

    return matchUser && matchAction && matchStart && matchEnd;
  });
});

const formatDate = (dateStr) => format(new Date(dateStr), "dd/MM/yyyy HH:mm");

onMounted(() => {
  loadLogs();
  loadUsers();
});
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
}
</style>
