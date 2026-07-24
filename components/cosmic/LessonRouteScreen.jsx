"use client";

import { useRouter } from "next/navigation";
import { getUser } from "../../lib/user";
import LessonEngine from "./LessonEngine";

export default function LessonRouteScreen({ ayah }) {
  const router = useRouter();
  return <main style={{ minHeight: "100vh", padding: "42px 16px 85px", color: "#eefaff", background: "radial-gradient(circle at 80% 15%,#3f2879,transparent 32%),radial-gradient(circle at 15% 75%,#164d6c,transparent 34%),#05091d" }}><LessonEngine ayah={ayah} user={getUser()} onExit={() => router.push("/cosmic/path")} /></main>;
}
