"use client";

export default function LivesBar({ lives = 3 }) {
  return <div className="cd-lives" aria-label={`${lives} lives remaining`}>{Array.from({ length: 3 }, (_, index) => <span key={index} className={`cd-life${index < lives ? " cd-life--on" : ""}`}>{index < lives ? "♥" : "♡"}</span>)}</div>;
}
