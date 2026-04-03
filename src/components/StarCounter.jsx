import "./StarCounter.css";

export default function StarCounter({ count }) {
  if (count === 0) return null;

  const starsNeeded = 10;
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
      <p className="star-counter__label">
        {count >= starsNeeded
          ? "🎁 New toy time!"
          : `${progress} / ${starsNeeded} stars to a new toy!`}
      </p>
    </div>
  );
}
