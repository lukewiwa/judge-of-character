import { ref, computed } from "@vue/composition-api";

const baseState = { level: 1, points: 0, attempts: 5 };

const state = ref({ ...baseState });
export const resetAll = () => {
  state.value = { ...baseState };
};

const getLevel = computed(() => state.value.level);
const setLevel = (level: number) => {
  state.value.level = level;
};

const getAttempts = computed(() => state.value.attempts);
const decrementAttempts = () => {
  state.value.attempts -= 1;
};
const resetAttempts = () => {
  state.value.attempts = baseState.attempts;
};

const setPoints = () => {
  const points = state.value.level * state.value.attempts;
  state.value.points += points;
};
const getPoints = computed(() => state.value.points);

export {
  getLevel,
  setLevel,
  getPoints,
  getAttempts,
  setPoints,
  decrementAttempts,
  resetAttempts,
};
