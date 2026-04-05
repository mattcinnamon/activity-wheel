import { useState, useCallback } from "react";
import Homepage from "./components/Homepage";
import CompletedActivities from "./components/CompletedActivities";
import Menu from "./components/Menu";
import Wheel from "./components/Wheel";
import Envelope from "./components/Envelope";
import MissionCard from "./components/MissionCard";
import Celebration from "./components/Celebration";
import StarCounter from "./components/StarCounter";
import missions from "./data/missions";
import {
  markMissionComplete,
  isMissionComplete,
  getStarCount,
  addStar,
  getActiveMission,
  setActiveMission,
  clearActiveMission,
} from "./data/storage";
import "./App.css";

const PHASE_HOME = "home";
const PHASE_MENU = "menu";
const PHASE_COMPLETED = "completed";
const PHASE_WHEEL = "wheel";
const PHASE_ENVELOPE = "envelope";
const PHASE_CARD = "card";
const PHASE_CELEBRATION = "celebration";

const CATEGORIES = [
  { id: "explore", label: "Explore", emoji: "🔍", color: "#4CAF50" },
  { id: "experiment", label: "Experiment", emoji: "🧪", color: "#2196F3" },
  { id: "dance", label: "Dance", emoji: "💃", color: "#E91E63" },
  { id: "puzzle", label: "Puzzle", emoji: "🧩", color: "#FF9800" },
  { id: "build", label: "Build", emoji: "🧱", color: "#795548" },
  { id: "paint", label: "Paint", emoji: "🎨", color: "#9C27B0" },
];

function pickMission(categoryId, excludeTitle) {
  const pool = missions[categoryId];
  if (!pool) return null;

  let available = pool.filter((m) => !isMissionComplete(categoryId, m.title));
  if (available.length === 0) available = pool;

  // When shuffling, try to exclude the current mission
  if (excludeTitle && available.length > 1) {
    available = available.filter((m) => m.title !== excludeTitle);
  }
  return available[Math.floor(Math.random() * available.length)];
}

export default function App() {
  const [phase, setPhase] = useState(PHASE_HOME);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentMission, setCurrentMission] = useState(null);
  const [starCount, setStarCount] = useState(getStarCount);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleWheelResult = useCallback((category) => {
    setSelectedCategory(category);

    if (category.id === "star") {
      const newCount = addStar();
      setStarCount(newCount);
      setPhase(PHASE_CELEBRATION);
    } else {
      const mission = pickMission(category.id);
      setCurrentMission(mission);
      setActiveMission(category, mission);
      setPhase(PHASE_ENVELOPE);
    }
  }, []);

  const handleEnvelopeReveal = useCallback(() => {
    setPhase(PHASE_CARD);
  }, []);

  const handleComplete = useCallback(() => {
    if (selectedCategory && currentMission) {
      markMissionComplete(selectedCategory.id, currentMission.title);
    }
    clearActiveMission();
    resetToWheel();
  }, [selectedCategory, currentMission]);

  const handleShuffle = useCallback(() => {
    if (!selectedCategory) return;
    const newMission = pickMission(selectedCategory.id, currentMission?.title);
    if (newMission) {
      setCurrentMission(newMission);
      setActiveMission(selectedCategory, newMission);
    }
  }, [selectedCategory, currentMission]);

  const handleCompleteActiveMission = useCallback(() => {
    const active = getActiveMission();
    if (active) {
      markMissionComplete(active.categoryId, active.title);
      clearActiveMission();
    }
    setRefreshKey((k) => k + 1);
  }, []);

  const handleResumeActiveMission = useCallback(() => {
    const active = getActiveMission();
    if (active) {
      const cat = CATEGORIES.find((c) => c.id === active.categoryId) || {
        id: active.categoryId,
        label: active.categoryLabel,
        emoji: active.categoryEmoji,
        color: active.categoryColor,
      };
      setSelectedCategory(cat);
      setCurrentMission({ title: active.title, description: active.description });
      setPhase(PHASE_CARD);
    }
  }, []);

  const resetToWheel = () => {
    setPhase(PHASE_WHEEL);
    setSelectedCategory(null);
    setCurrentMission(null);
  };

  const handleSpinAgain = () => {
    clearActiveMission();
    resetToWheel();
  };

  const goHome = () => {
    setPhase(PHASE_HOME);
    setSelectedCategory(null);
    setCurrentMission(null);
  };

  const handleReset = () => {
    setStarCount(0);
    setRefreshKey((k) => k + 1);
    setPhase(PHASE_HOME);
  };

  if (phase === PHASE_HOME) {
    return (
      <Homepage
        key={refreshKey}
        onGoToWheel={() => setPhase(PHASE_WHEEL)}
        onGoToCompleted={() => setPhase(PHASE_COMPLETED)}
        onGoToMenu={() => setPhase(PHASE_MENU)}
        onCompleteActive={handleCompleteActiveMission}
        onResumeActive={handleResumeActiveMission}
      />
    );
  }

  if (phase === PHASE_MENU) {
    return <Menu onClose={goHome} onReset={handleReset} />;
  }

  if (phase === PHASE_COMPLETED) {
    return <CompletedActivities onBack={goHome} />;
  }

  return (
    <div className="app">
      <header className="app__header">
        <button className="app__home-btn" onClick={goHome}>← Home</button>
        <h1 className="app__title">🎯 Activity Wheel</h1>
      </header>

      <StarCounter count={starCount} />

      <main className="app__main">
        {phase === PHASE_WHEEL && (
          <Wheel onResult={handleWheelResult} disabled={false} />
        )}

        {phase === PHASE_ENVELOPE && selectedCategory && currentMission && (
          <Envelope
            category={selectedCategory}
            mission={currentMission}
            onReveal={handleEnvelopeReveal}
          />
        )}

        {phase === PHASE_CARD && selectedCategory && currentMission && (
          <MissionCard
            category={selectedCategory}
            mission={currentMission}
            onComplete={handleComplete}
            onShuffle={handleShuffle}
            onBack={handleSpinAgain}
          />
        )}

        {phase === PHASE_CELEBRATION && (
          <Celebration starCount={starCount} onDone={resetToWheel} />
        )}
      </main>
    </div>
  );
}
