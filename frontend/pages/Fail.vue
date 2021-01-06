<template>
  <div
    class="flex flex-row flex-wrap justify-around w-full p-4 space-x-2 space-y-2"
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
import { defineComponent, onMounted } from "@nuxtjs/composition-api";
import UserStats from "@/components/UserStats.vue";
import Leaderboard from "@/components/Leaderboard.vue";
import { resetAll, getAttempts, sendPoints, getUser } from "@/assets/js/state";

export default defineComponent({
  components: { UserStats, Leaderboard },
  setup(_, { root }) {
    const resetAndHome = () => {
      resetAll();
      root.$router.push({ name: "index" });
    };

    onMounted(async () => {
      if (getAttempts.value > 0) {
        root.$router.push({ name: "index" });
      } else if (getUser.value) {
        await sendPoints();
      }
    });

    return {
      resetAndHome,
    };
  },
});
</script>
