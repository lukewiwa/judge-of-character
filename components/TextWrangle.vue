<template>
  <div class="flex flex-col space-y-4 w-full items-center">
    <span
      class="bg-gray-100 border border-blue-300 rounded py-2 px-4 h-16 text-3xl w-full"
    >
      {{ judgedText }}</span
    >
    <div class="flex flex-row flex-wrap space-x-2 justify-end w-full">
      <button
        type="button"
        class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
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
import Vue from "vue";
import copy from "clipboard-copy";

export default Vue.extend({
  props: {
    judgedText: { type: String, default: "" },
  },
  methods: {
    textTransform(transform: string) {
      this.$emit("transform-text", transform);
    },
    copyToClipboard() {
      copy(this.judgedText);
    },
  },
});
</script>
