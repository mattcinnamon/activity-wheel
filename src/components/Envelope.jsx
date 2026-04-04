import { useState } from "react";
import "./Envelope.css";

export default function Envelope({ category, mission, onReveal }) {
  const [phase, setPhase] = useState("front"); // front → flipped → opening → revealed

  const handleTap = () => {
    if (phase === "front") {
      setPhase("flipped");
      // After flip completes, open the flap
      setTimeout(() => setPhase("opening"), 600);
      // After flap opens, slide card out
      setTimeout(() => setPhase("revealed"), 1200);
      // Transition to mission card
      setTimeout(() => onReveal(), 1800);
    }
  };

  return (
    <div className="envelope-scene" onClick={handleTap}>
      <div className={`envelope-3d ${phase !== "front" ? "envelope-3d--flipped" : ""}`}>
        {/* Front face - shows category icon */}
        <div className="envelope-face envelope-face--front">
          <div className="envelope-front-body">
            <span className="envelope-front-emoji">{category.emoji}</span>
            <span className="envelope-front-tap">Tap to open!</span>
          </div>
        </div>

        {/* Back face - envelope with flap and card */}
        <div className="envelope-face envelope-face--back">
          <div className="envelope-back-body">
            {/* Card that slides out */}
            <div className={`envelope-card-slide ${phase === "revealed" ? "envelope-card-slide--out" : ""}`}>
              <span className="envelope-card-slide__emoji">{category.emoji}</span>
              <span className="envelope-card-slide__title">{mission.title}</span>
            </div>
          </div>
          {/* Flap - opens upward */}
          <div className={`envelope-flap ${phase === "opening" || phase === "revealed" ? "envelope-flap--open" : ""}`} />
        </div>
      </div>
    </div>
  );
}
