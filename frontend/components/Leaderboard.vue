<template>
  <div class="border border-blue-300 rounded p-5 min-w-full">
    <h2 class="text-xl text-blue-600 mb-3">Leaderboard 🏅</h2>
    <ul v-if="leaders">
      <li v-for="(leader, index) in leaders" :key="leader.username">
        <span class="font-bold mr-1">{{ index + 1 }}</span>
        <span class="">{{ leader.username }}:</span>
        <span>{{ leader.points }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "@vue/composition-api";
import { Leader } from "@/assets/.codegen";
import api from "@/assets/js/api";

export default defineComponent({
  setup() {
    const leaders: Ref<Leader[] | undefined> = ref([]);
    const error = ref(false);
    const fetchLeaders = async () => {
      try {
        const apiLeaders = await api.listLeaders({ page: 1, pageSize: 5 });
        leaders.value = apiLeaders.results;
      } catch {
        error.value = true;
      }
    };
    fetchLeaders();
    return { leaders };
  },
});
</script>
