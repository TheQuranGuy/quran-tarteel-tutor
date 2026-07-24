import MemorizeMode from "../../../components/MemorizeMode";
import { getLessonById } from "../../../lib/lessons";

export default async function MemorizePage({ params }) { const { id } = await params; const lesson = getLessonById(id); return lesson ? <main className="page narrow-page"><MemorizeMode lesson={lesson} /></main> : <main className="page">Lesson not found.</main>; }
