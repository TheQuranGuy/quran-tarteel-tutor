"use client";

import CosmicButton from "../../../components/cosmic/CosmicButton";
export default function IntroCTA({ onStart }) { return <div className="cd-intro-cta" style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}><CosmicButton onClick={onStart}>Get Started <span aria-hidden="true">→</span></CosmicButton><CosmicButton variant="outline" onClick={onStart}>Log In</CosmicButton></div>; }
