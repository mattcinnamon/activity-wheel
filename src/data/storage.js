// localStorage helpers for tracking completed missions and stars

const STORAGE_KEY = "activity-wheel-state";

function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = JSON.parse(raw);
      // Migrate old format: string[] → {key, completedAt}[]
      if (state.completedMissions?.length > 0 && typeof state.completedMissions[0] === "string") {
        state.completedMissions = state.completedMissions.map((key) => ({
          key,
          completedAt: null,
        }));
        saveState(state);
      }
      return state;
    }
  } catch {
    // ignore
  }
  return { completedMissions: [], starCount: 0 };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getCompletedMissions() {
  return getState().completedMissions;
}

export function markMissionComplete(category, missionTitle) {
  const state = getState();
  const key = `${category}::${missionTitle}`;
  if (!state.completedMissions.some((m) => m.key === key)) {
    state.completedMissions.push({ key, completedAt: new Date().toISOString() });
  }
  saveState(state);
}

export function isMissionComplete(category, missionTitle) {
  const key = `${category}::${missionTitle}`;
  return getState().completedMissions.some((m) => m.key === key);
}

export function getStarCount() {
  return getState().starCount;
}

export function addStar() {
  const state = getState();
  state.starCount += 1;
  saveState(state);
  return state.starCount;
}

export function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
}
