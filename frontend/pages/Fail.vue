<template>
  <div
    class="grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-1 grid-flow-row gap-3 w-full p-4"
  >
    <div>
      <h1 class="text-3xl text-red-600">You Failed</h1>
      <UserStats />
    </div>
    <Leaderboard />
    <div class="py-4 flex flex-col space-y-3">
      <span>
        <button
          type="button"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="resetAndHome"
        >
          Start Again
        </button>
      </span>
      <span>
        <a
          href="/social/login/facebook/"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login via Facebook
        </a>
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "@vue/composition-api";
import UserStats from "@/components/UserStats.vue";
import Leaderboard from "@/components/Leaderboard.vue";
import { resetAll, getAttempts, sendPoints } from "@/assets/js/state";

export default defineComponent({
  components: { UserStats, Leaderboard },
  setup(_, { root }) {
    const resetAndHome = () => {
      resetAll();
      root.$router.push({ name: "index" });
    };

    onMounted(() => {
      if (getAttempts.value > 0) {
        root.$router.push({ name: "index" });
      } else {
        sendPoints();
      }
    });

    return {
      resetAndHome,
    };
  },
});
</script>
