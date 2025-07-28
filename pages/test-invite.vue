<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="text-xl font-bold mb-4">Inviter un utilisateur</h1>
    <input
      v-model="email"
      type="email"
      placeholder="Adresse email"
      class="border p-2 w-full mb-4"
    />
    <button
      @click="sendInvitation"
      class="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Envoyer l'invitation
    </button>
    <p v-if="message" class="text-green-600 mt-4">{{ message }}</p>
    <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
  </div>
</template>

<script setup>
const email = ref("");
const message = ref("");
const error = ref("");

const sendInvitation = async () => {
  message.value = "";
  error.value = "";

  try {
    const res = await fetch(
      "https://ylyugnwmbodngbjuiwff.functions.supabase.co/send-invitation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.value }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      message.value = "Invitation envoyée avec succès.";
    } else {
      error.value = data.error || "Erreur lors de l'envoi.";
    }
  } catch (err) {
    error.value = "Erreur réseau ou serveur.";
    console.error(err);
  }
};
</script>
