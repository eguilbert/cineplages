// plugins/primevue.client.ts
import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import AutoComplete from "primevue/autocomplete";

// ✅ NO CSS import like 'primevue/resources/...'
// ✅ Use the new theme system instead:
import Aura from "@primevue/themes/aura";
import Lara from "@primevue/themes/lara";
import Nora from "@primevue/themes/nora";
import Material from "@primevue/themes/material";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    inputStyle: "outlined",
    theme: {
      preset: Lara,
    },
  });
  nuxtApp.vueApp.use(ToastService);
  nuxtApp.vueApp.use(ConfirmationService);
  nuxtApp.vueApp.component("AutoComplete", AutoComplete);
});
