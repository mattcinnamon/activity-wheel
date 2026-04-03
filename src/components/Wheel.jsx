import { useState, useRef, useCallback } from "react";
import "./Wheel.css";

const CATEGORIES = [
  { id: "explore", label: "Explore", emoji: "🔍", color: "#4CAF50" },
  { id: "experiment", label: "Experiment", emoji: "🧪", color: "#2196F3" },
  { id: "dance", label: "Dance", emoji: "💃", color: "#E91E63" },
  { id: "puzzle", label: "Puzzle", emoji: "🧩", color: "#FF9800" },
  { id: "build", label: "Build", emoji: "🧱", color: "#795548" },
  { id: "paint", label: "Paint", emoji: "🎨", color: "#9C27B0" },
  { id: "star", label: "Star!", emoji: "⭐", color: "#FFD700" },
];

// Star segment is half the size of others
// Others get equal weight, star gets half weight
// 6 normal + 0.5 star = 6.5 total "units"
// Normal segment angle: 360 / 6.5 ≈ 55.38°
// Star segment angle: 360 / 13 ≈ 27.69°
const NORMAL_ANGLE = 360 / 6.5;
const STAR_ANGLE = NORMAL_ANGLE / 2;

function getSegmentAngles() {
  const segments = [];
  let currentAngle = 0;
  for (const cat of CATEGORIES) {
    const angle = cat.id === "star" ? STAR_ANGLE : NORMAL_ANGLE;
    segments.push({ ...cat, startAngle: currentAngle, sweepAngle: angle });
    currentAngle += angle;
  }
  return segments;
}

const SEGMENTS = getSegmentAngles();

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, sweepAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, startAngle + sweepAngle);
  const largeArc = sweepAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export default function Wheel({ onResult, disabled }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const spinCountRef = useRef(0);

  const spin = useCallback(() => {
    if (spinning || disabled) return;
    setSpinning(true);

    // Pick a weighted random category
    // Star has ~half the chance of any other category
    const weights = CATEGORIES.map((c) => (c.id === "star" ? 1 : 2));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    let chosenIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      rand -= weights[i];
      if (rand <= 0) {
        chosenIndex = i;
        break;
      }
    }

    const chosen = SEGMENTS[chosenIndex];

    // Calculate target rotation so the pointer (at top, 0°) lands on the chosen segment
    // The pointer is at the top. The wheel rotates clockwise.
    // We need the segment's midpoint to align with the top (0°).
    const segmentMid = chosen.startAngle + chosen.sweepAngle / 2;
    // The wheel needs to rotate so that segmentMid is at the top (360 - segmentMid)
    const targetAngle = 360 - segmentMid;

    // Add multiple full rotations for visual spin effect
    const spins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const totalRotation = spins * 360 + targetAngle;

    // We accumulate rotation to keep spinning in one direction
    spinCountRef.current += totalRotation;
    setRotation(spinCountRef.current);

    // Wait for animation to finish
    setTimeout(() => {
      setSpinning(false);
      onResult(CATEGORIES[chosenIndex]);
    }, 4000);
  }, [spinning, disabled, onResult]);

  const cx = 200,
    cy = 200,
    r = 190;

  return (
    <div className="wheel-container">
      <div className="wheel-pointer">▼</div>
      <svg
        className="wheel-svg"
        viewBox="0 0 400 400"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
            : "none",
        }}
        onClick={spin}
      >
        {/* Segments */}
        {SEGMENTS.map((seg) => (
          <path
            key={seg.id}
            d={describeArc(cx, cy, r, seg.startAngle, seg.sweepAngle)}
            fill={seg.color}
            stroke="#fff"
            strokeWidth="2"
          />
        ))}

        {/* Labels */}
        {SEGMENTS.map((seg) => {
          const midAngle = seg.startAngle + seg.sweepAngle / 2;
          const labelR = r * 0.62;
          const pos = polarToCartesian(cx, cy, labelR, midAngle);
          const emojiPos = polarToCartesian(cx, cy, r * 0.38, midAngle);
          return (
            <g key={seg.id + "-label"}>
              <text
                x={emojiPos.x}
                y={emojiPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={seg.id === "star" ? "20" : "28"}
                className="wheel-emoji"
              >
                {seg.emoji}
              </text>
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={seg.id === "star" ? "11" : "15"}
                fontWeight="bold"
                fill="#fff"
                className="wheel-label"
              >
                {seg.label}
              </text>
            </g>
          );
        })}

        {/* Center button */}
        <circle cx={cx} cy={cy} r="35" fill="#fff" stroke="#ddd" strokeWidth="2" />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fontWeight="bold"
          fill="#333"
          className="wheel-spin-text"
        >
          {spinning ? "..." : "SPIN!"}
        </text>
      </svg>

      {!spinning && !disabled && (
        <p className="wheel-hint">Tap the wheel to spin!</p>
      )}
    </div>
  );
}
