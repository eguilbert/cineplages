export default defineNuxtPlugin(async () => {
  const { ensureUserLoaded } = useAuth();
  await ensureUserLoaded();
});
