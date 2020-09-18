<template>
  <div>
    <div>
      <span class="text-3xl text-red-600">You Failed</span>
    </div>
    <UserStats />
    <div class="py-4">
      <button
        type="button"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="resetAndHome"
      >
        Start Again
      </button>
    </div>
    <div class="py-4">
      <a
        href="/social/login/facebook/"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login via Facebook
      </a>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "@vue/composition-api";
import UserStats from "@/components/UserStats.vue";
import { resetAll, getAttempts } from "@/assets/js/state";

export default defineComponent({
  components: { UserStats },
  setup(_, { root }) {
    const resetAndHome = () => {
      resetAll();
      root.$router.push({ name: "index" });
    };

    onMounted(() => {
      if (getAttempts.value > 0) {
        root.$router.push({ name: "index" });
      }
    });

    return {
      resetAndHome,
    };
  },
});
</script>
