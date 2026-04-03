import { useState } from "react";
import "./Envelope.css";

export default function Envelope({ category, mission, onReveal }) {
  const [opened, setOpened] = useState(false);

  const handleTap = () => {
    if (!opened) {
      setOpened(true);
      setTimeout(() => onReveal(), 600);
    }
  };

  return (
    <div className="envelope-scene" onClick={handleTap}>
      <div className={`envelope ${opened ? "envelope--opened" : ""}`}>
        <div className="envelope__flap" />
        <div className="envelope__body">
          <div className="envelope__front">
            <span className="envelope__emoji">{category.emoji}</span>
            <span className="envelope__tap-text">
              {opened ? "" : "Tap to open!"}
            </span>
          </div>
        </div>
        {opened && (
          <div className="envelope__card-peek">
            <span className="card-peek-emoji">{category.emoji}</span>
          </div>
        )}
      </div>
    </div>
  );
}
