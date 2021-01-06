<template>
  <div class="container mx-auto flex flex-col items-center text-blue-800">
    <nav class="grid grid-cols-3 w-full">
      <div class="col-start-2">
        <h1 class="text-3xl font-medium text-blue-700 my-6 col-start-2">
          Judge of Character 👨‍⚖️
        </h1>
      </div>
      <Profile class="justify-self-end self-center" />
    </nav>
    <Nuxt />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import Profile from "@/components/Profile.vue";

export default defineComponent({ components: { Profile } });
</script>
