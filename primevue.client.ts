import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";

//import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue);

  nuxtApp.vueApp.component("Button", Button);
  nuxtApp.vueApp.component("InputText", InputText);
  nuxtApp.vueApp.component("Checkbox", Checkbox);
});
