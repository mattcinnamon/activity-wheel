import "./MissionCard.css";

export default function MissionCard({
  category,
  mission,
  onComplete,
  onBack,
  onShuffle,
}) {
  return (
    <div className="mission-card-overlay">
      <div
        className="mission-card"
        style={{ borderColor: category.color }}
      >
        <div
          className="mission-card__header"
          style={{ backgroundColor: category.color }}
        >
          <span className="mission-card__emoji">{category.emoji}</span>
          <h2 className="mission-card__category">{category.label}</h2>
        </div>

        <div className="mission-card__body">
          <h3 className="mission-card__title">
            {mission.title}
            {mission.isCustom && <span className="mission-card__custom-badge">Custom</span>}
          </h3>
          <p className="mission-card__description">{mission.description}</p>
        </div>

        <div className="mission-card__actions">
          <button
            className="mission-card__btn mission-card__btn--complete"
            onClick={onComplete}
          >
            ✅ Done!
          </button>
          {onShuffle && (
            <button
              className="mission-card__btn mission-card__btn--shuffle"
              onClick={onShuffle}
            >
              🔀 Shuffle Activity
            </button>
          )}
          <button
            className="mission-card__btn mission-card__btn--back"
            onClick={onBack}
          >
            🔄 Spin Again
          </button>
        </div>
      </div>
    </div>
  );
}
