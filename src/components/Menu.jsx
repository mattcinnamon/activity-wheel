import { useState } from "react";
import {
  getNames,
  saveNames,
  getUserCriteria,
  saveUserCriteria,
  getCustomActivities,
  saveCustomActivities,
  resetAll,
} from "../data/storage";
import "./Menu.css";

export default function Menu({ onClose, onReset }) {
  const [page, setPage] = useState("main"); // main, names, activities, clear-confirm

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
  const customActivities = getCustomActivities();
  const customCount = Object.values(customActivities).reduce((sum, arr) => sum + arr.length, 0);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveUserCriteria(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

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

        <button className="menu__generate-btn" disabled>
          ✨ Generate Custom Activities
        </button>
        <p className="menu__coming-soon">
          AI generation coming soon! Save your criteria now and we'll generate
          personalised activities once the feature is live.
        </p>

        {customCount > 0 && (
          <p className="menu__custom-count">
            {customCount} custom activit{customCount !== 1 ? "ies" : "y"} saved
          </p>
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
