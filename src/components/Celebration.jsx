import { useEffect, useState } from "react";
import "./Celebration.css";

function randomBetween(a, b) {
  return Math.random() * (b - a) + a;
}

function createParticle(id) {
  const colors = [
    "#FFD700",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#FF69B4",
    "#00CED1",
  ];
  return {
    id,
    x: randomBetween(5, 95),
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: randomBetween(0, 2),
    duration: randomBetween(2, 4),
    size: randomBetween(6, 14),
    type: Math.random() > 0.5 ? "confetti" : "circle",
    rotation: randomBetween(0, 360),
    drift: randomBetween(-30, 30),
  };
}

export default function Celebration({ starCount, onDone }) {
  const [particles] = useState(() =>
    Array.from({ length: 60 }, (_, i) => createParticle(i))
  );

  useEffect(() => {
    const timer = setTimeout(onDone, 5000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="celebration" onClick={onDone}>
      {/* Confetti particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`particle particle--${p.type}`}
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: p.type === "confetti" ? `${p.size}px` : `${p.size}px`,
            height:
              p.type === "confetti" ? `${p.size * 0.4}px` : `${p.size}px`,
            transform: `rotate(${p.rotation}deg)`,
            "--drift": `${p.drift}px`,
          }}
        />
      ))}

      {/* Central star */}
      <div className="celebration__content">
        <div className="celebration__star">⭐</div>
        <h1 className="celebration__title">STAR!</h1>
        <p className="celebration__subtitle">You hit the jackpot!</p>
        <div className="celebration__count">
          {"⭐".repeat(Math.min(starCount, 5))}
          <p className="celebration__total">
            {starCount} Star{starCount !== 1 ? "s" : ""} collected!
          </p>
          {starCount >= 5 && (
            <p className="celebration__reward">🎁 Time for a new toy! 🎁</p>
          )}
        </div>
        <p className="celebration__tap">Tap anywhere to continue</p>
      </div>
    </div>
  );
}
