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
  const [chosenSeg, setChosenSeg] = useState(null);
  const [showCaterpillar, setShowCaterpillar] = useState(false);
  const [biteStage, setBiteStage] = useState(0);
  const spinCountRef = useRef(0);
  const chosenIndexRef = useRef(0);

  const spin = useCallback(() => {
    if (spinning || disabled) return;
    setShowCaterpillar(false);
    setChosenSeg(null);
    setBiteStage(0);
    setSpinning(true);

    // Weighted random: star has half chance
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

    // Capture chosen category in closure to prevent race conditions
    const chosenCategory = CATEGORIES[chosenIndex];
    const chosen = SEGMENTS[chosenIndex];
    const segmentMid = chosen.startAngle + chosen.sweepAngle / 2;
    const targetAngle = 360 - segmentMid;
    const spins = 5 + Math.floor(Math.random() * 3);
    const totalRotation = spins * 360 + targetAngle;

    spinCountRef.current += totalRotation;
    setRotation(spinCountRef.current);

    setTimeout(() => {
      // Keep spinning=true to lock taps during caterpillar animation
      setChosenSeg(chosen);
      setShowCaterpillar(true);

      // Animate bites: small → medium → big chomp
      setTimeout(() => setBiteStage(1), 300);
      setTimeout(() => setBiteStage(2), 600);
      setTimeout(() => setBiteStage(3), 900);

      // Transition to envelope/result after eating
      setTimeout(() => {
        setSpinning(false);
        onResult(chosenCategory);
      }, 2000);
    }, 4000);
  }, [spinning, disabled, onResult]);

  const cx = 200,
    cy = 200,
    r = 180;

  // Bite position: at the OUTER EDGE of the SELECTED SEGMENT (in SVG space, pre-rotation)
  // The bite should appear at the midpoint angle of the chosen segment, at the apple's edge
  const biteRadii = [0, 18, 28, 42];
  const currentBiteR = biteRadii[biteStage] || 0;

  let bitePos = { x: cx, y: 10 }; // default fallback
  if (chosenSeg) {
    const segMidAngle = chosenSeg.startAngle + chosenSeg.sweepAngle / 2;
    bitePos = polarToCartesian(cx, cy, r - currentBiteR * 0.2, segMidAngle);
  }

  // Caterpillar position in the HTML overlay needs to match the segment's visual position
  // After the wheel stops, the chosen segment's midpoint is at the top (pointer)
  // So caterpillar always goes at the top edge
  // But we need to compute exact pixel position from the SVG viewBox
  let caterpillarStyle = { top: "-12px", left: "50%" };
  if (chosenSeg) {
    // The segment mid is rotated to the top, so caterpillar always at top-center
    caterpillarStyle = { top: "-12px", left: "50%" };
  }

  return (
    <div className="wheel-container">
      <div className="wheel-pointer">▼</div>
      <div className="wheel-wrap">
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
          <defs>
            {/* Apple-shaped clip path */}
            <clipPath id="apple-clip">
              <path d={`
                M 200 385
                C 90 385, 15 290, 15 195
                C 15 100, 75 25, 150 25
                C 175 25, 195 40, 200 55
                C 205 40, 225 25, 250 25
                C 325 25, 385 100, 385 195
                C 385 290, 310 385, 200 385
                Z
              `} />
            </clipPath>
            {/* Bite mask at the selected segment's edge */}
            {biteStage > 0 && (
              <mask id="bite-mask">
                <rect width="400" height="400" fill="white" />
                <circle
                  cx={bitePos.x}
                  cy={bitePos.y}
                  r={currentBiteR}
                  fill="black"
                />
              </mask>
            )}
          </defs>

          {/* Apple background shape */}
          <path
            d={`
              M 200 385
              C 90 385, 15 290, 15 195
              C 15 100, 75 25, 150 25
              C 175 25, 195 40, 200 55
              C 205 40, 225 25, 250 25
              C 325 25, 385 100, 385 195
              C 385 290, 310 385, 200 385
              Z
            `}
            fill="#c0392b"
            stroke="#a93226"
            strokeWidth="3"
            mask={biteStage > 0 ? "url(#bite-mask)" : undefined}
          />

          {/* Segments clipped to apple shape */}
          <g
            clipPath="url(#apple-clip)"
            mask={biteStage > 0 ? "url(#bite-mask)" : undefined}
          >
            {SEGMENTS.map((seg) => (
              <path
                key={seg.id}
                d={describeArc(cx, cy, r + 40, seg.startAngle, seg.sweepAngle)}
                fill={seg.color}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
            ))}
          </g>

          {/* Bite interior (apple flesh) */}
          {biteStage > 0 && (
            <circle
              cx={bitePos.x}
              cy={bitePos.y}
              r={currentBiteR - 2}
              fill="#f5deb3"
              clipPath="url(#apple-clip)"
              opacity="0.9"
            />
          )}

          {/* Labels - text radiating outward from centre along segment axis */}
          <g clipPath="url(#apple-clip)">
            {SEGMENTS.map((seg) => {
              const midAngle = seg.startAngle + seg.sweepAngle / 2;
              const isStar = seg.id === "star";

              // Emoji at far outer edge
              const emojiR = r * 0.82;
              const emojiPos = polarToCartesian(cx, cy, emojiR, midAngle);

              // SVG rotate() uses 0° = 3 o'clock (right), CW
              // Our angle system uses 0° = 12 o'clock (top), CW
              // So SVG rotation = midAngle - 90
              const svgRotation = midAngle - 90;

              return (
                <g key={seg.id + "-label"}>
                  <text
                    x={emojiPos.x}
                    y={emojiPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={isStar ? "20" : "28"}
                    className="wheel-emoji"
                  >
                    {seg.emoji}
                  </text>
                  {/* Radial text: rotated group so text reads centre → edge */}
                  <g transform={`translate(${cx}, ${cy}) rotate(${svgRotation})`}>
                    <text
                      x="38"
                      y="0"
                      textAnchor="start"
                      dominantBaseline="central"
                      fontSize="14"
                      fontWeight="800"
                      fill="#fff"
                      className="wheel-label"
                    >
                      {seg.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Stem */}
          <path
            d="M 196 55 Q 190 20, 200 5 Q 210 20, 204 55"
            fill="#5D4037"
            stroke="#4E342E"
            strokeWidth="1"
          />
          {/* Leaf */}
          <path
            d="M 204 30 Q 230 10, 245 20 Q 230 35, 204 30"
            fill="#4CAF50"
            stroke="#388E3C"
            strokeWidth="1"
          />

          {/* Center button */}
          <circle cx={cx} cy={cy} r="32" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="12"
            fontWeight="800"
            fill="#333"
            className="wheel-spin-text"
          >
            {spinning ? "..." : "SPIN!"}
          </text>
        </svg>

        {/* Caterpillar - positioned at the top where the selected segment sits */}
        {showCaterpillar && (
          <div
            className="caterpillar"
            style={caterpillarStyle}
            aria-label="Caterpillar eating the apple"
          >
            <div className={`caterpillar__head caterpillar__head--stage${biteStage}`}>
              🐛
            </div>
          </div>
        )}
      </div>

      {!spinning && !disabled && !showCaterpillar && (
        <p className="wheel-hint">Tap the apple to spin!</p>
      )}
    </div>
  );
}
