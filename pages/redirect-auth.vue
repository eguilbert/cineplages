<script setup>
const route = useRoute();
const router = useRouter();

onMounted(() => {
  if (!route.hash) return router.replace("/login?error=no_hash");

  const params = new URLSearchParams(route.hash.slice(1)); // enlève le #
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  if (!access_token || !refresh_token) {
    return router.replace("/login?error=missing_tokens");
  }

  // Redirige vers l'endpoint API avec les tokens dans l'URL
  window.location.href = `/api/auth/callback?access_token=${access_token}&refresh_token=${refresh_token}`;
});
</script>

<template>
  <div class="text-center p-6">Redirection en cours...</div>
</template>
