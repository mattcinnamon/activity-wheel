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

export function getActiveMission() {
  return getState().activeMission || null;
}

export function setActiveMission(category, mission) {
  const state = getState();
  state.activeMission = {
    categoryId: category.id,
    categoryLabel: category.label,
    categoryEmoji: category.emoji,
    categoryColor: category.color,
    title: mission.title,
    description: mission.description,
    startedAt: new Date().toISOString(),
  };
  saveState(state);
}

export function clearActiveMission() {
  const state = getState();
  state.activeMission = null;
  saveState(state);
}

// Names (little person + up to 2 big people)
export function getNames() {
  return getState().names || { littlePerson: "", bigPerson1: "", bigPerson2: "" };
}

export function saveNames(names) {
  const state = getState();
  state.names = names;
  saveState(state);
}

// Custom AI-generated activities
export function getCustomActivities() {
  return getState().customActivities || {};
}

export function saveCustomActivities(activities) {
  const state = getState();
  state.customActivities = activities;
  saveState(state);
}

export function getUserCriteria() {
  return getState().userCriteria || null;
}

export function saveUserCriteria(criteria) {
  const state = getState();
  state.userCriteria = criteria;
  saveState(state);
}

export function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
}
