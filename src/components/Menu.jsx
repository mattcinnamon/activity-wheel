import { useState } from "react";
import {
  getNames,
  saveNames,
  getUserCriteria,
  saveUserCriteria,
  getCustomActivities,
  saveCustomActivities,
  getCustomOnly,
  saveCustomOnly,
  resetAll,
} from "../data/storage";
import { generateActivities } from "../data/api";
import "./Menu.css";

export default function Menu({ onClose, onReset }) {
  const [page, setPage] = useState("main"); // main, names, activities, clear-confirm
  const [customOnly, setCustomOnly] = useState(getCustomOnly);

  const handleToggleCustomOnly = () => {
    const next = !customOnly;
    setCustomOnly(next);
    saveCustomOnly(next);
  };

  if (page === "names") return <NamesPage onBack={() => setPage("main")} />;
  if (page === "activities") return <ActivitiesPage onBack={() => setPage("main")} />;
  if (page === "clear-confirm") {
    return (
      <ClearConfirmPage
        onBack={() => setPage("main")}
        onConfirm={() => { resetAll(); onReset(); }}
      />
    );
  }

  return (
    <div className="menu">
      <div className="menu__header">
        <h2 className="menu__title">Settings</h2>
        <button className="menu__close" onClick={onClose}>✕</button>
      </div>

      <div className="menu__items">
        <button className="menu__item" onClick={() => setPage("names")}>
          <span className="menu__item-icon">👤</span>
          <span className="menu__item-label">Names</span>
          <span className="menu__item-desc">Set names for personalisation</span>
        </button>

        <button className="menu__item" onClick={() => setPage("activities")}>
          <span className="menu__item-icon">✏️</span>
          <span className="menu__item-label">Edit Activities</span>
          <span className="menu__item-desc">AI-powered custom activities</span>
        </button>

        <div className="menu__toggle-row" onClick={handleToggleCustomOnly}>
          <div className="menu__toggle-text">
            <span className="menu__toggle-label">Custom Activities Only</span>
            <span className="menu__toggle-desc">Only show AI-generated activities on the wheel</span>
          </div>
          <div className={`menu__toggle ${customOnly ? "menu__toggle--on" : ""}`}>
            <div className="menu__toggle-knob" />
          </div>
        </div>

        <button className="menu__item menu__item--danger" onClick={() => setPage("clear-confirm")}>
          <span className="menu__item-icon">🗑️</span>
          <span className="menu__item-label">Clear History</span>
          <span className="menu__item-desc">Reset all progress and data</span>
        </button>
      </div>
    </div>
  );
}

function NamesPage({ onBack }) {
  const existing = getNames();
  const [littlePerson, setLittlePerson] = useState(existing.littlePerson);
  const [bigPerson1, setBigPerson1] = useState(existing.bigPerson1);
  const [bigPerson2, setBigPerson2] = useState(existing.bigPerson2);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveNames({ littlePerson, bigPerson1, bigPerson2 });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="menu">
      <div className="menu__header">
        <button className="menu__back" onClick={onBack}>←</button>
        <h2 className="menu__title">Names</h2>
        <div className="menu__spacer" />
      </div>

      <p className="menu__hint">These names can be used to personalise activities.</p>

      <div className="menu__form">
        <label className="menu__label">
          <span>Little Person</span>
          <input
            className="menu__input"
            value={littlePerson}
            onChange={(e) => setLittlePerson(e.target.value)}
            placeholder="Child's name"
          />
        </label>
        <label className="menu__label">
          <span>Big Person 1</span>
          <input
            className="menu__input"
            value={bigPerson1}
            onChange={(e) => setBigPerson1(e.target.value)}
            placeholder="Parent/carer name"
          />
        </label>
        <label className="menu__label">
          <span>Big Person 2</span>
          <input
            className="menu__input"
            value={bigPerson2}
            onChange={(e) => setBigPerson2(e.target.value)}
            placeholder="Parent/carer name"
          />
        </label>

        <button className="menu__save-btn" onClick={handleSave}>
          {saved ? "✓ Saved!" : "Save Names"}
        </button>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { id: "explore", label: "Explore", emoji: "🔍", color: "#4CAF50" },
  { id: "experiment", label: "Experiment", emoji: "🧪", color: "#2196F3" },
  { id: "dance", label: "Dance", emoji: "💃", color: "#E91E63" },
  { id: "puzzle", label: "Puzzle", emoji: "🧩", color: "#FF9800" },
  { id: "build", label: "Build", emoji: "🧱", color: "#795548" },
  { id: "paint", label: "Paint", emoji: "🎨", color: "#9C27B0" },
];

function ActivitiesPage({ onBack }) {
  const criteria = getUserCriteria() || {
    age: "",
    likes: "",
    dislikes: "",
    location: "",
    nearby: "",
  };
  const [form, setForm] = useState(criteria);
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [genSuccess, setGenSuccess] = useState(false);
  const [custom, setCustom] = useState(getCustomActivities);
  const [editing, setEditing] = useState(null); // "catId::index" key
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const customCount = Object.values(custom).reduce((sum, arr) => sum + arr.length, 0);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveUserCriteria(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleGenerate = async () => {
    // Save criteria first
    saveUserCriteria(form);
    setGenerating(true);
    setGenError(null);
    setGenSuccess(false);

    try {
      const names = getNames();
      const activities = await generateActivities(form, names);
      saveCustomActivities(activities);
      setCustom(activities);
      setGenSuccess(true);
      setTimeout(() => setGenSuccess(false), 3000);
    } catch (err) {
      setGenError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const startEdit = (catId, index) => {
    const activity = custom[catId][index];
    setEditing(`${catId}::${index}`);
    setEditForm({ title: activity.title, description: activity.description });
  };

  const saveEdit = () => {
    const [catId, indexStr] = editing.split("::");
    const index = parseInt(indexStr);
    const updated = { ...custom };
    updated[catId] = [...updated[catId]];
    updated[catId][index] = { ...updated[catId][index], ...editForm };
    saveCustomActivities(updated);
    setCustom(updated);
    setEditing(null);
  };

  const deleteActivity = (catId, index) => {
    const updated = { ...custom };
    updated[catId] = updated[catId].filter((_, i) => i !== index);
    if (updated[catId].length === 0) delete updated[catId];
    saveCustomActivities(updated);
    setCustom(updated);
  };

  const hasAnyCriteria = form.age || form.likes || form.location;

  return (
    <div className="menu">
      <div className="menu__header">
        <button className="menu__back" onClick={onBack}>←</button>
        <h2 className="menu__title">Edit Activities</h2>
        <div className="menu__spacer" />
      </div>

      <p className="menu__hint">
        Tell us about your little person and we'll use AI to generate custom activities
        tailored to them. These will be added alongside the default set.
      </p>

      <div className="menu__form">
        <label className="menu__label">
          <span>Age</span>
          <input
            className="menu__input"
            value={form.age}
            onChange={(e) => updateField("age", e.target.value)}
            placeholder="e.g. 3 years old"
          />
        </label>
        <label className="menu__label">
          <span>Likes & Interests</span>
          <textarea
            className="menu__textarea"
            value={form.likes}
            onChange={(e) => updateField("likes", e.target.value)}
            placeholder="e.g. dinosaurs, water play, animals, cooking"
            rows={2}
          />
        </label>
        <label className="menu__label">
          <span>Dislikes or Sensitivities</span>
          <textarea
            className="menu__textarea"
            value={form.dislikes}
            onChange={(e) => updateField("dislikes", e.target.value)}
            placeholder="e.g. loud noises, messy textures"
            rows={2}
          />
        </label>
        <label className="menu__label">
          <span>Location</span>
          <input
            className="menu__input"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="e.g. Bristol, UK"
          />
        </label>
        <label className="menu__label">
          <span>Nearby Places</span>
          <textarea
            className="menu__textarea"
            value={form.nearby}
            onChange={(e) => updateField("nearby", e.target.value)}
            placeholder="e.g. parks, farms, beach, city playground, woods"
            rows={2}
          />
        </label>

        <button className="menu__save-btn" onClick={handleSave}>
          {saved ? "✓ Saved!" : "Save Criteria"}
        </button>

        <button
          className="menu__generate-btn"
          disabled={generating || !hasAnyCriteria}
          onClick={handleGenerate}
        >
          {generating ? "Please stand by, busy creating new activities..." : genSuccess ? "✓ Activities Generated!" : "✨ Generate Custom Activities"}
        </button>

        {!hasAnyCriteria && (
          <p className="menu__coming-soon">
            Fill in at least age, likes, or location to generate activities.
          </p>
        )}

        {genError && (
          <p className="menu__gen-error">{genError}</p>
        )}

        {customCount > 0 && (
          <div className="menu__activities-list">
            <h3 className="menu__activities-heading">
              Custom Activities ({customCount})
            </h3>
            {CATEGORIES.map((cat) => {
              const items = custom[cat.id];
              if (!items || items.length === 0) return null;
              return (
                <div key={cat.id} className="menu__act-group">
                  <div className="menu__act-group-header" style={{ borderLeftColor: cat.color }}>
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </div>
                  {items.map((activity, i) => {
                    const editKey = `${cat.id}::${i}`;
                    const isEditing = editing === editKey;

                    if (isEditing) {
                      return (
                        <div key={i} className="menu__act-item menu__act-item--editing">
                          <input
                            className="menu__input"
                            value={editForm.title}
                            onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                          />
                          <textarea
                            className="menu__textarea"
                            value={editForm.description}
                            onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                            rows={3}
                          />
                          <div className="menu__act-edit-actions">
                            <button className="menu__act-btn menu__act-btn--save" onClick={saveEdit}>Save</button>
                            <button className="menu__act-btn menu__act-btn--cancel" onClick={() => setEditing(null)}>Cancel</button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={i} className="menu__act-item">
                        <div className="menu__act-content">
                          <span className="menu__act-title">{activity.title}</span>
                          <p className="menu__act-desc">{activity.description}</p>
                        </div>
                        <div className="menu__act-actions">
                          <button className="menu__act-btn menu__act-btn--edit" onClick={() => startEdit(cat.id, i)}>Edit</button>
                          <button className="menu__act-btn menu__act-btn--delete" onClick={() => deleteActivity(cat.id, i)}>Delete</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ClearConfirmPage({ onBack, onConfirm }) {
  return (
    <div className="menu">
      <div className="menu__header">
        <button className="menu__back" onClick={onBack}>←</button>
        <h2 className="menu__title">Clear History</h2>
        <div className="menu__spacer" />
      </div>

      <div className="menu__confirm">
        <span className="menu__confirm-icon">⚠️</span>
        <h3 className="menu__confirm-title">Are you sure?</h3>
        <p className="menu__confirm-text">
          This will permanently reset:
        </p>
        <ul className="menu__confirm-list">
          <li>All completed missions</li>
          <li>Star count progress</li>
          <li>Active mission</li>
          <li>Saved names</li>
          <li>Custom activities & criteria</li>
        </ul>
        <p className="menu__confirm-text">This cannot be undone.</p>

        <div className="menu__confirm-actions">
          <button className="menu__confirm-btn menu__confirm-btn--danger" onClick={onConfirm}>
            Yes, Clear Everything
          </button>
          <button className="menu__confirm-btn menu__confirm-btn--cancel" onClick={onBack}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
