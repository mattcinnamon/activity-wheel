import { getCompletedMissions, getCustomActivities } from "../data/storage";
import { personalize } from "../data/personalize";
import missions from "../data/missions";
import "./CompletedActivities.css";

const CATEGORIES = [
  { id: "explore", label: "Explore", emoji: "🔍", color: "#4CAF50" },
  { id: "experiment", label: "Experiment", emoji: "🧪", color: "#2196F3" },
  { id: "dance", label: "Dance", emoji: "💃", color: "#E91E63" },
  { id: "puzzle", label: "Puzzle", emoji: "🧩", color: "#FF9800" },
  { id: "build", label: "Build", emoji: "🧱", color: "#795548" },
  { id: "paint", label: "Paint", emoji: "🎨", color: "#9C27B0" },
];

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function CompletedActivities({ onBack }) {
  const completed = getCompletedMissions();
  const custom = getCustomActivities();

  // Group by category
  const grouped = {};
  for (const cat of CATEGORIES) grouped[cat.id] = [];

  for (const entry of completed) {
    const [catId, title] = entry.key.split("::");
    if (!grouped[catId]) continue;
    const allMissions = [...(missions[catId] || []), ...(custom[catId] || [])];
    const missionData = allMissions.find((m) => m.title === title);
    grouped[catId].push({
      title,
      description: missionData?.description || "",
      completedAt: entry.completedAt,
    });
  }

  // Sort each group by date (newest first)
  for (const catId of Object.keys(grouped)) {
    grouped[catId].sort((a, b) => {
      if (!a.completedAt) return 1;
      if (!b.completedAt) return -1;
      return new Date(b.completedAt) - new Date(a.completedAt);
    });
  }

  const hasAny = completed.length > 0;

  return (
    <div className="completed">
      <header className="completed__header">
        <button className="completed__back" onClick={onBack}>
          ← Back
        </button>
        <h1 className="completed__title">🏆 Completed</h1>
        <span className="completed__count">
          {completed.length} mission{completed.length !== 1 ? "s" : ""}
        </span>
      </header>

      {!hasAny && (
        <div className="completed__empty">
          <p className="completed__empty-emoji">🎯</p>
          <p>No missions completed yet!</p>
          <p>Spin the wheel to get started.</p>
        </div>
      )}

      <div className="completed__list">
        {CATEGORIES.map((cat) => {
          const items = grouped[cat.id];
          if (items.length === 0) return null;
          const total = (missions[cat.id]?.length || 0) + (custom[cat.id]?.length || 0);

          return (
            <div key={cat.id} className="completed__group">
              <div className="completed__group-header" style={{ borderLeftColor: cat.color }}>
                <span className="completed__group-emoji">{cat.emoji}</span>
                <span className="completed__group-label">{cat.label}</span>
                <span className="completed__group-count" style={{ color: cat.color }}>
                  {items.length}/{total}
                </span>
              </div>

              {items.map((item) => (
                <div key={item.title} className="completed__item">
                  <div className="completed__item-top">
                    <span className="completed__item-title">{item.title}</span>
                    {item.completedAt && (
                      <span className="completed__item-date">{formatDate(item.completedAt)}</span>
                    )}
                  </div>
                  <p className="completed__item-desc">{personalize(item.description)}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
