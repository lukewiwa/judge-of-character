<template>
  <div v-if="getUser">👤</div>
  <div v-else>👤</div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { getUser } from "@/assets/js/state";

export default defineComponent({
  setup() {
    return { getUser };
  },
});
</script>
