import { getLessonById } from "./lessons";
import { getSurahById, surahList } from "./quran";

const fatihaFacts = {
  meaning: "Al-Fatiha means “The Opening.” It opens the Qur'an and is recited in every unit of Salah.",
  purpose: "Surah Al-Fatiha is a prayer of praise, mercy, worship, and a request for guidance to the straight path.",
  bismillah: "Ayah 1 begins with Bismillah: “In the name of Allah, the Most Compassionate, Most Merciful.” Its tafsir reminds us to begin beneficial actions by remembering Allah and seeking His blessing.",
  praise: "Ayah 2 says that all praise belongs to Allah, Lord of all worlds. Its tafsir teaches that Allah alone creates, sustains, and cares for creation.",
};

function cite(surah, ayah, text) {
  return `${text}\n\nReference: Surah ${surah.name} (${surah.number}:${ayah}).`;
}

export async function getSheikhReply(question) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const query = question.toLowerCase().replace(/[?!.]/g, "").trim();
  const fatiha = getSurahById("1");

  if (/(what does|meaning of|mean).*(fatiha|al fatiha)/.test(query) || query === "fatiha") {
    return cite(fatiha, 1, fatihaFacts.meaning);
  }
  if (query.includes("bismillah") || query.includes("most merciful") || query.includes("ayah 1")) {
    return cite(fatiha, 1, fatihaFacts.bismillah);
  }
  if (query.includes("praise") || query.includes("lord of all worlds") || query.includes("ayah 2")) {
    return cite(fatiha, 2, fatihaFacts.praise);
  }
  if (query.includes("fatiha") || query.includes("guidance") || query.includes("straight path")) {
    return cite(fatiha, 1, fatihaFacts.purpose);
  }
  const mentionedSurah = surahList.find((surah) => query.includes(surah.name.toLowerCase().replace("al-", "")) || query.includes(surah.name.toLowerCase()));
  if (mentionedSurah) {
    return `Surah ${mentionedSurah.name} is surah ${mentionedSurah.number} of the Qur'an. Its short study summary is: ${mentionedSurah.summary} In this version, detailed lesson data is currently available for Al-Fatiha.`;
  }
  const lesson = getLessonById("1-1");
  return `I can currently give reliable, dataset-based guidance about Surah Al-Fatiha. ${lesson.tafsir} Try asking “What does Fatiha mean?”, “Explain Bismillah,” or “What does Lord of all worlds mean?”`;
}
