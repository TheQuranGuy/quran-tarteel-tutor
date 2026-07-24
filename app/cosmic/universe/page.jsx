"use client";

import GalaxiesPage from "../../galaxies/page";
import StarParticles from "../../../components/cosmic/StarParticles";
import GalaxyOverlay from "./components/GalaxyOverlay";

export default function CosmicUniversePage() {
  return <div style={{ position: "relative", minHeight: "100vh", background: "radial-gradient(circle at 80% 14%,rgba(124,74,187,.35),transparent 30%),radial-gradient(circle at 18% 82%,rgba(33,116,180,.3),transparent 35%),#05091d" }}><StarParticles color="#bcb2ff" /><div style={{ position: "relative" }}><GalaxiesPage /></div><GalaxyOverlay /></div>;
}
