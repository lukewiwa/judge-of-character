import { ref, computed } from "@nuxtjs/composition-api";
import { UserDetail } from "@/assets/.codegen";
import api from "@/assets/js/api";

const baseState = {
  level: 1,
  points: 0,
  attempts: 1,
  user: null as UserDetail | null,
};

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
const sendPoints = async () => {
  const { points, level } = state.value;
  try {
    await api.createStat({ stat: { level, points } });
  } catch {}
};

const getUser = computed(() => state.value.user);
const setUser = (user: UserDetail | null) => {
  state.value.user = user;
};
const fetchUser = async () => {
  let user;
  try {
    user = await api.currentUser();
  } catch {
    user = null;
  }
  setUser(user);
};

export {
  getLevel,
  getUser,
  fetchUser,
  setLevel,
  getPoints,
  getAttempts,
  setPoints,
  sendPoints,
  decrementAttempts,
  resetAttempts,
};
