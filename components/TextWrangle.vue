<template>
  <div class="flex flex-col space-y-4 w-full items-start">
    <span class="text-blue-700">This is what you wrote</span>
    <span
      class="bg-gray-100 border border-blue-300 rounded py-2 px-4 h-16 text-3xl w-full"
    >
      {{ judgedText }}</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    judgedText: { type: String, default: "" },
  },
});
</script>
