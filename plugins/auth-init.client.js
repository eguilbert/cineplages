export default defineNuxtPlugin(() => {
  const { ensureUserLoaded } = useAuth();
  ensureUserLoaded();
});
