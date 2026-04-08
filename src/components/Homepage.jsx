import { getCompletedMissions, getStarCount, getActiveMission, getCustomActivities } from "../data/storage";
import missions from "../data/missions";
import "./Homepage.css";

const CATEGORIES = [
  { id: "explore", emoji: "🔍", color: "#4CAF50" },
  { id: "experiment", emoji: "🧪", color: "#2196F3" },
  { id: "dance", emoji: "💃", color: "#E91E63" },
  { id: "puzzle", emoji: "🧩", color: "#FF9800" },
  { id: "build", emoji: "🧱", color: "#795548" },
  { id: "paint", emoji: "🎨", color: "#9C27B0" },
];

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Homepage({ onGoToWheel, onGoToCompleted, onGoToMenu, onCompleteActive, onResumeActive }) {
  const completed = getCompletedMissions();
  const starCount = getStarCount();
  const activeMission = getActiveMission();
  const custom = getCustomActivities();

  const categoryCounts = {};
  for (const cat of CATEGORIES) categoryCounts[cat.id] = 0;
  for (const m of completed) {
    const [cat] = m.key.split("::");
    if (categoryCounts[cat] !== undefined) categoryCounts[cat]++;
  }

  return (
    <div className="homepage">
      <div className="homepage__top-bar">
        <div className="homepage__spacer" />
        <h1 className="homepage__title">🎯 Activity Wheel</h1>
        <button className="homepage__menu-btn" onClick={onGoToMenu}>🍔</button>
      </div>
      <p className="homepage__subtitle">What shall we do today?</p>

      {activeMission && (
        <div
          className="homepage__live-mission"
          style={{ borderColor: activeMission.categoryColor }}
        >
          <div className="homepage__live-badge">Live Mission</div>
          <div className="homepage__live-top">
            <span className="homepage__live-emoji">{activeMission.categoryEmoji}</span>
            <div className="homepage__live-info">
              <span className="homepage__live-title">
                {activeMission.title}
                {activeMission.isCustom && <span className="homepage__custom-badge">Custom</span>}
              </span>
              <span className="homepage__live-time">{timeAgo(activeMission.startedAt)}</span>
            </div>
          </div>
          <p className="homepage__live-desc">{activeMission.description}</p>
          <div className="homepage__live-actions">
            <button
              className="homepage__live-btn homepage__live-btn--done"
              onClick={onCompleteActive}
            >
              Mark Complete ✓
            </button>
            <button
              className="homepage__live-btn homepage__live-btn--view"
              onClick={onResumeActive}
            >
              View
            </button>
          </div>
        </div>
      )}

      <div className="homepage__tiles">
        <button className="homepage__tile homepage__tile--wheel" onClick={onGoToWheel}>
          <span className="homepage__tile-emoji">🍎</span>
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

      <div className="homepage__summary">
        <h2 className="homepage__summary-title">Progress</h2>
        <div className="homepage__categories">
          {CATEGORIES.map((cat) => {
            const total = (missions[cat.id]?.length || 0) + (custom[cat.id]?.length || 0);
            const count = categoryCounts[cat.id];
            return (
              <div
                key={cat.id}
                className="homepage__cat"
                style={{ backgroundColor: cat.color + "22", borderColor: cat.color }}
              >
                <span className="homepage__cat-emoji">{cat.emoji}</span>
                <span className="homepage__cat-label">{cat.id}</span>
                <span className="homepage__cat-count" style={{ color: cat.color }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
        {starCount > 0 && (
          <p className="homepage__stars">⭐ {starCount} star{starCount !== 1 ? "s" : ""} collected</p>
        )}
      </div>
    </div>
  );
}
