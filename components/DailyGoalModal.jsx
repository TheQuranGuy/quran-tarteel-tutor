"use client";

import { useState } from "react";
import { setDailyGoal } from "../lib/user";

const goals = [5, 10, 20, 50];

export default function DailyGoalModal({ open, currentGoal = 10, onClose }) {
  const [selected, setSelected] = useState(currentGoal);

  if (!open) return null;

  function saveGoal() {
    const user = setDailyGoal(selected);
    onClose?.(user);
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Choose daily goal">
      <div className="goal-modal">
        <p className="eyebrow">Daily goal</p>
        <h2>Choose your XP target</h2>
        <div className="goal-options">
          {goals.map((goal) => (
            <button
              key={goal}
              className={`goal-option ${selected === goal ? "selected" : ""}`}
              onClick={() => setSelected(goal)}
              type="button"
            >
              <strong>{goal} XP</strong>
              <span>per day</span>
            </button>
          ))}
        </div>
        <div className="button-row">
          <button className="button primary" onClick={saveGoal} type="button">Save goal</button>
          <button className="button secondary" onClick={() => onClose?.()} type="button">Not now</button>
        </div>
      </div>
    </div>
  );
}
