<template>
  <div>
    <p>Level: {{ getLevel }}</p>
    <p>Points: {{ getPoints }}</p>
    <p>Attempts: {{ getAttempts }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { getLevel, getPoints, getAttempts } from "@/assets/js/state";

export default defineComponent({
  setup() {
    return {
      getLevel,
      getPoints,
      getAttempts,
    };
  },
});
</script>
