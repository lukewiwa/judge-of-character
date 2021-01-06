import { defineNuxtMiddleware } from "@nuxtjs/composition-api";
import { fetchUser } from "@/assets/js/state";

export default defineNuxtMiddleware(async () => {
  await fetchUser();
});
