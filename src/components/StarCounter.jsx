import "./StarCounter.css";

export default function StarCounter({ count }) {
  if (count === 0) return null;

  const starsNeeded = 5;
  const progress = Math.min(count, starsNeeded);

  return (
    <div className="star-counter">
      <div className="star-counter__bar">
        {Array.from({ length: starsNeeded }, (_, i) => (
          <span
            key={i}
            className={`star-counter__star ${i < progress ? "star-counter__star--filled" : ""}`}
          >
            {i < progress ? "⭐" : "☆"}
          </span>
        ))}
      </div>
      {count >= starsNeeded && (
        <p className="star-counter__label">🎁 New toy time!</p>
      )}
    </div>
  );
}
