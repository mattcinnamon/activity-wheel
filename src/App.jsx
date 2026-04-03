import { useState, useCallback } from "react";
import Wheel from "./components/Wheel";
import Envelope from "./components/Envelope";
import MissionCard from "./components/MissionCard";
import Celebration from "./components/Celebration";
import StarCounter from "./components/StarCounter";
import missions from "./data/missions";
import {
  getCompletedMissions,
  markMissionComplete,
  isMissionComplete,
  getStarCount,
  addStar,
} from "./data/storage";
import "./App.css";

const PHASE_WHEEL = "wheel";
const PHASE_ENVELOPE = "envelope";
const PHASE_CARD = "card";
const PHASE_CELEBRATION = "celebration";

function pickMission(categoryId) {
  const pool = missions[categoryId];
  if (!pool) return null;

  const available = pool.filter((m) => !isMissionComplete(categoryId, m.title));
  const choices = available.length > 0 ? available : pool;
  return choices[Math.floor(Math.random() * choices.length)];
}

export default function App() {
  const [phase, setPhase] = useState(PHASE_WHEEL);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentMission, setCurrentMission] = useState(null);
  const [starCount, setStarCount] = useState(getStarCount);

  const handleWheelResult = useCallback((category) => {
    setSelectedCategory(category);

    if (category.id === "star") {
      const newCount = addStar();
      setStarCount(newCount);
      setPhase(PHASE_CELEBRATION);
    } else {
      const mission = pickMission(category.id);
      setCurrentMission(mission);
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
    resetToWheel();
  }, [selectedCategory, currentMission]);

  const resetToWheel = () => {
    setPhase(PHASE_WHEEL);
    setSelectedCategory(null);
    setCurrentMission(null);
  };

  const completedCount = getCompletedMissions().length;

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">🎯 Activity Wheel</h1>
        {completedCount > 0 && (
          <span className="app__completed">
            {completedCount} mission{completedCount !== 1 ? "s" : ""} done!
          </span>
        )}
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
            onBack={resetToWheel}
          />
        )}

        {phase === PHASE_CELEBRATION && (
          <Celebration starCount={starCount} onDone={resetToWheel} />
        )}
      </main>
    </div>
  );
}
