<template>
  <div class="flex flex-col space-y-4 w-full items-start">
    <span class="text-blue-700">This is what you wrote</span>
    <span
      class="bg-gray-100 border border-blue-300 rounded py-2 px-4 h-16 text-3xl w-full"
    >
      {{ judgedText }}</span
    >
    <div class="flex flex-row flex-wrap space-x-2 justify-end w-full">
      <button
        type="button"
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2"
        @click="textTransform('clear')"
      >
        clear
      </button>
      <button
        type="button"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
        @click="textTransform('upper')"
      >
        UPPER
      </button>
      <button
        type="button"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
        @click="textTransform('lower')"
      >
        lower
      </button>
      <button
        type="button"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
        @click="copyToClipboard"
      >
        Copy to clipboard
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import copy from "clipboard-copy";

export default defineComponent({
  props: {
    judgedText: { type: String, default: "" },
  },

  setup(props, context) {
    const copyToClipboard = () => copy(props.judgedText);
    const textTransform = (transform: string) =>
      context.emit("transform-text", transform);

    return { copyToClipboard, textTransform };
  },
});
</script>
