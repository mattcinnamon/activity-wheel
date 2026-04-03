import { getCompletedMissions, getStarCount } from "../data/storage";
import "./Homepage.css";

const CATEGORIES = [
  { id: "explore", emoji: "🔍", color: "#4CAF50" },
  { id: "experiment", emoji: "🧪", color: "#2196F3" },
  { id: "dance", emoji: "💃", color: "#E91E63" },
  { id: "puzzle", emoji: "🧩", color: "#FF9800" },
  { id: "build", emoji: "🧱", color: "#795548" },
  { id: "paint", emoji: "🎨", color: "#9C27B0" },
];

export default function Homepage({ onGoToWheel, onGoToCompleted }) {
  const completed = getCompletedMissions();
  const starCount = getStarCount();

  const categoryCounts = {};
  for (const cat of CATEGORIES) categoryCounts[cat.id] = 0;
  for (const m of completed) {
    const [cat] = m.key.split("::");
    if (categoryCounts[cat] !== undefined) categoryCounts[cat]++;
  }

  return (
    <div className="homepage">
      <h1 className="homepage__title">🎯 Activity Wheel</h1>
      <p className="homepage__subtitle">What shall we do today?</p>

      <div className="homepage__tiles">
        <button className="homepage__tile homepage__tile--wheel" onClick={onGoToWheel}>
          <span className="homepage__tile-emoji">🎡</span>
          <span className="homepage__tile-label">Spin the Wheel</span>
          <span className="homepage__tile-sub">Pick a new activity!</span>
        </button>

        <button className="homepage__tile homepage__tile--completed" onClick={onGoToCompleted}>
          <span className="homepage__tile-emoji">🏆</span>
          <span className="homepage__tile-label">Completed</span>
          <span className="homepage__tile-sub">
            {completed.length} mission{completed.length !== 1 ? "s" : ""} done
          </span>
        </button>
      </div>

      {completed.length > 0 && (
        <div className="homepage__summary">
          <h2 className="homepage__summary-title">Progress</h2>
          <div className="homepage__categories">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="homepage__cat" style={{ borderColor: cat.color }}>
                <span className="homepage__cat-emoji">{cat.emoji}</span>
                <span className="homepage__cat-count" style={{ color: cat.color }}>
                  {categoryCounts[cat.id]}
                </span>
              </div>
            ))}
          </div>
          {starCount > 0 && (
            <p className="homepage__stars">⭐ {starCount} star{starCount !== 1 ? "s" : ""} collected</p>
          )}
        </div>
      )}
    </div>
  );
}
