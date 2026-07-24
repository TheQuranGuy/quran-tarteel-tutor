import { redirect } from "next/navigation";

export default async function LessonPage({ params }) {
  const { id } = await params;
  const [surah, ayah] = String(id).split("-");
  redirect(`/cosmic/lessons/${surah || 1}/${ayah || 1}`);
}
