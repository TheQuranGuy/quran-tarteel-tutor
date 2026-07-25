import { getLessonById } from "./lessons";
import { getSurahById, surahList } from "./quran";

const STOP_WORDS = new Set([
  "a",
  "about",
  "after",
  "all",
  "am",
  "an",
  "and",
  "are",
  "ayah",
  "ayat",
  "be",
  "can",
  "chapter",
  "do",
  "does",
  "for",
  "from",
  "give",
  "help",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "quran",
  "should",
  "surah",
  "that",
  "the",
  "this",
  "to",
  "what",
  "when",
  "where",
  "why",
  "with",
  "you",
]);

const toneOpeners = [
  "Good question.",
  "Nice, let's make that clear.",
  "Yes, I can help with that.",
  "Let's take it step by step.",
  "Absolutely — here is the clean version.",
];

const beginnerPath = [
  "Al-Fatiha",
  "Al-Ikhlas",
  "Al-Falaq",
  "An-Nas",
  "Al-Kawthar",
  "Al-Asr",
  "An-Nasr",
  "Al-Qadr",
  "Ad-Duha",
  "Ash-Sharh",
  "At-Tin",
  "Al-Alaq",
];

const knowledgeBase = [
  {
    id: "tajweed-shaddah",
    title: "Shaddah",
    keywords: ["shaddah", "doubled", "double", "stress", "tight", "letter"],
    answer:
      "A shaddah means the letter is doubled. Practise it as two moments: first close/hold the sound, then release it with the vowel. Do not rush through it. Try saying the word slowly, then connect it back to the ayah.",
  },
  {
    id: "tajweed-ghunnah",
    title: "Ghunnah",
    keywords: ["ghunnah", "nasal", "nose", "noon", "meem", "mushaddad"],
    answer:
      "Ghunnah is a nasal sound. It is especially clear on noon or meem with shaddah. Keep it smooth for about two counts, from the nose, without making it harsh or adding an extra vowel.",
  },
  {
    id: "tajweed-madd",
    title: "Madd",
    keywords: ["madd", "mad", "long", "vowel", "stretch", "hold", "counts"],
    answer:
      "Madd means stretching a vowel sound. A simple beginner rule: do not clip long vowels short. Listen to the reciter, count gently, and keep the tone steady instead of wobbling or adding another letter.",
  },
  {
    id: "tajweed-qalqalah",
    title: "Qalqalah",
    keywords: ["qalqalah", "bounce", "echo", "qaf", "ta", "ba", "jim", "dal"],
    answer:
      "Qalqalah is a light bounce on certain letters when they are still: qaf, ta, ba, jim, and dal. The bounce should be crisp, not exaggerated. Think of it as a clean release, not a new vowel.",
  },
  {
    id: "tajweed-stopping",
    title: "Stopping and breathing",
    keywords: ["stop", "pause", "breath", "breathe", "waqf", "ending"],
    answer:
      "For stopping, finish the word cleanly before breathing. Do not cut in the middle of a word. If you run out of breath, slow down and choose a shorter phrase. Clean stops are better than fast recitation.",
  },
  {
    id: "memorisation-loop",
    title: "Memorisation loop",
    keywords: ["memorise", "memorize", "hifz", "remember", "forget", "forgot", "memory"],
    answer:
      "Use a four-step loop: listen once, read while listening, hide the text and recite, then reveal only to fix mistakes. Keep the chunk tiny. If you miss one word twice, practise only that word before repeating the full ayah.",
  },
  {
    id: "review-method",
    title: "Review method",
    keywords: ["review", "revise", "weak", "forgotten", "mistake", "retention"],
    answer:
      "Review weak ayahs before learning new ones. Start with the ayah you almost know, not the one you completely forgot. Recite it slowly, mark the slipping word, repeat that word three times, then recite the full ayah again.",
  },
  {
    id: "recitation-practice",
    title: "Recitation correction",
    keywords: ["recite", "recitation", "pronounce", "pronunciation", "wrong", "mistake", "voice", "audio"],
    answer:
      "For recitation correction, compare in this order: word order, vowel sounds, long vowels, doubled letters, then stopping points. Fix one repeated mistake at a time. Trying to fix everything at once makes the brain panic.",
  },
  {
    id: "arabic-roots",
    title: "Arabic roots",
    keywords: ["arabic", "root", "grammar", "word", "vocabulary", "vocab", "meaning"],
    answer:
      "Arabic words often connect through roots. For beginners, do not overcomplicate grammar first. Learn the word meaning in the ayah, then notice repeated words across surahs. Meaning first, grammar second.",
  },
  {
    id: "fatiha-purpose",
    title: "Al-Fatiha",
    keywords: ["fatiha", "opening", "guidance", "straight", "path", "salah", "prayer"],
    answer:
      "Al-Fatiha is the opening of the Qur'an and a daily prayer for guidance. It teaches praise, mercy, worship, reliance on Allah, and asking for the straight path.",
  },
  {
    id: "ikhlas-purpose",
    title: "Al-Ikhlas",
    keywords: ["ikhlas", "sincerity", "oneness", "tawhid", "allah one"],
    answer:
      "Al-Ikhlas teaches pure tawhid: Allah is One, absolutely independent, and nothing is comparable to Him. It is short, but its meaning is huge, so recite it slowly and clearly.",
  },
  {
    id: "muawwidhat",
    title: "Al-Falaq and An-Nas",
    keywords: ["falaq", "nas", "protection", "evil", "waswas", "whisper", "jinn"],
    answer:
      "Al-Falaq and An-Nas are protection surahs. Al-Falaq asks protection from external harms, while An-Nas asks protection from whispers that affect the heart and mind.",
  },
  {
    id: "juz-amma",
    title: "Juz Amma",
    keywords: ["juz amma", "short surah", "short", "easy", "beginner"],
    answer:
      "Juz Amma is great for beginners because many surahs are short, rhythmic, and often recited in salah. Start with meaning and pronunciation, not speed.",
  },
  {
    id: "motivation",
    title: "Motivation",
    keywords: ["lazy", "tired", "hard", "struggling", "stuck", "confused", "overwhelmed", "sad"],
    answer:
      "Make the task smaller. One ayah is good. One line is good. One word fixed properly is good. The goal is not to look impressive; the goal is to return to the Qur'an consistently.",
  },
  {
    id: "daily-routine",
    title: "Daily routine",
    keywords: ["routine", "schedule", "daily", "goal", "streak", "xp", "habit"],
    answer:
      "A strong daily routine is 10 minutes: 3 minutes listening, 4 minutes memorising, 2 minutes review, 1 minute reflection. Keep it so easy that you can do it even on a busy day.",
  },
  {
    id: "salah-learning",
    title: "Qur'an in salah",
    keywords: ["salah", "prayer", "pray", "rakah", "recite in prayer"],
    answer:
      "For salah, prioritise surahs you can recite clearly and calmly. Al-Fatiha matters most because it is recited in every rak'ah. Then build a small set of short surahs you understand.",
  },
  {
    id: "adab",
    title: "Adab with Qur'an",
    keywords: ["respect", "adab", "manners", "quran etiquette", "etiquette"],
    answer:
      "Good adab with Qur'an means approaching it with respect, patience, and honesty. Learn carefully, avoid pretending to know what you do not know, and ask qualified teachers for detailed rulings.",
  },
  {
    id: "fatwa-boundary",
    title: "Rulings boundary",
    keywords: ["halal", "haram", "fatwa", "ruling", "allowed", "permissible", "forbidden"],
    answer:
      "I can help with general learning and Qur'an study, but I should not act like a mufti. For a specific halal/haram ruling, ask a qualified scholar or trusted local teacher.",
  },
];

const quizBank = [
  {
    id: "q-fatiha",
    prompt: "What is the central du'a in Al-Fatiha?",
    answer: "Guidance to the straight path",
    options: ["Guidance to the straight path", "A command to fast", "The story of Musa", "Rules of inheritance"],
  },
  {
    id: "q-ikhlas",
    prompt: "What is the main theme of Al-Ikhlas?",
    answer: "The oneness of Allah",
    options: ["The oneness of Allah", "The Battle of Badr", "Trade rules", "The story of Yusuf"],
  },
  {
    id: "q-kawthar",
    prompt: "What does Al-Kawthar mean?",
    answer: "Abundance",
    options: ["Abundance", "The Elephant", "The Dawn", "The Night"],
  },
  {
    id: "q-mulk",
    prompt: "How many ayahs are in Surah Al-Mulk?",
    answer: "30",
    options: ["30", "7", "3", "286"],
  },
  {
    id: "q-ghunnah",
    prompt: "What kind of sound is ghunnah?",
    answer: "A nasal sound",
    options: ["A nasal sound", "A silent pause", "A throat bounce", "A written-only mark"],
  },
  {
    id: "q-shaddah",
    prompt: "What does shaddah show?",
    answer: "A doubled letter",
    options: ["A doubled letter", "A deleted word", "A long pause", "A question mark"],
  },
];

function wait(ms = 420) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[^a-z0-9\s:'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text) {
  return normalize(text)
    .split(" ")
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

function stem(word) {
  if (word.endsWith("ing") && word.length > 5) return word.slice(0, -3);
  if (word.endsWith("ed") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("s") && word.length > 3) return word.slice(0, -1);
  return word;
}

function similarity(a, b) {
  const left = stem(normalize(a));
  const right = stem(normalize(b));
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) return 0.72;

  let same = 0;
  const limit = Math.min(left.length, right.length);
  for (let index = 0; index < limit; index += 1) {
    if (left[index] === right[index]) same += 1;
  }
  return same / Math.max(left.length, right.length);
}

function scoreKeywords(queryTokens, keywords) {
  let score = 0;
  for (const queryToken of queryTokens) {
    for (const keyword of keywords) {
      const keywordTokens = tokens(keyword);
      if (keywordTokens.some((keywordToken) => similarity(queryToken, keywordToken) >= 0.72)) score += 4;
      else if (normalize(keyword).includes(queryToken)) score += 2;
    }
  }
  return score;
}

function detectIntent(query) {
  const q = normalize(query);
  const tests = [
    { name: "easier", card: null, test: /\b(easier|simpler|simple|explain like|eli5|confused)\b/ },
    { name: "harder", card: null, test: /\b(harder|advanced|deeper|more detail|technical)\b/ },
    { name: "quiz", card: null, test: /\b(quiz|test me|ask me|question me|practice questions)\b/ },
    { name: "answerQuiz", card: null, test: /^(a|b|c|d|1|2|3|4)\b|answer is|i think/ },
    { name: "ayahReference", card: "breakdown", test: /\b\d{1,3}\s*:\s*\d{1,3}\b|\b(ayah|verse)\s+\d{1,3}\b/ },
    { name: "meaning", card: "breakdown", test: /\b(mean|meaning|translate|translation|called|name)\b/ },
    { name: "summary", card: "breakdown", test: /\b(about|summary|theme|tafsir|lesson|teach|message|explain)\b/ },
    { name: "memorise", card: "breakdown", test: /\b(memorise|memorize|hifz|remember|forgot|forget|revise)\b/ },
    { name: "tajweed", card: "breakdown", test: /\b(tajweed|madd?|ghunnah|shaddah|ikhfa|idgham|qalqalah|noon|meem|waqf)\b/ },
    { name: "recitation", card: "recitation", test: /\b(recite|recitation|pronounce|pronunciation|voice|audio|mistake|wrong)\b/ },
    { name: "plan", card: "recommendation", test: /\b(start|beginner|next|plan|schedule|routine|path|level)\b/ },
    { name: "progress", card: "progress", test: /\b(progress|xp|streak|mastery|weak|goal)\b/ },
    { name: "ruling", card: null, test: /\b(halal|haram|fatwa|ruling|permissible|forbidden|allowed)\b/ },
  ];
  return tests.find((intent) => intent.test.test(q)) || { name: "general", card: null };
}

function surahAliases(surah) {
  const name = normalize(surah.name);
  return [
    name,
    name.replace(/^al\s+/, ""),
    name.replace(/-/g, " "),
    normalize(surah.translation),
    String(surah.number),
    `surah ${surah.number}`,
    `chapter ${surah.number}`,
  ];
}

function scoreSurah(surah, query) {
  const q = normalize(query);
  const queryTokens = tokens(query);
  const aliases = surahAliases(surah);
  if (aliases.some((alias) => alias && q.includes(alias))) return 100;

  let score = 0;
  for (const queryToken of queryTokens) {
    for (const alias of aliases) {
      if (tokens(alias).some((aliasToken) => similarity(queryToken, aliasToken) >= 0.72)) score += 6;
      if (normalize(surah.summary).includes(queryToken)) score += 1;
    }
  }
  return score;
}

function extractAyahReference(query, fallbackSurahId) {
  const q = normalize(query);
  const colon = q.match(/\b(\d{1,3})\s*:\s*(\d{1,3})\b/);
  if (colon) return { surahId: Number(colon[1]), ayahNumber: Number(colon[2]) };

  const explicit =
    q.match(/\bsurah\s+(\d{1,3})\s+(?:ayah|verse)\s+(\d{1,3})\b/) ||
    q.match(/\bchapter\s+(\d{1,3})\s+(?:ayah|verse)\s+(\d{1,3})\b/);
  if (explicit) return { surahId: Number(explicit[1]), ayahNumber: Number(explicit[2]) };

  const relative = q.match(/\b(?:ayah|verse)\s+(\d{1,3})\b/);
  if (relative && fallbackSurahId) return { surahId: Number(fallbackSurahId), ayahNumber: Number(relative[1]) };

  return null;
}

function findSurah(query, context = {}) {
  const ref = extractAyahReference(query, context.lastSurahId);
  if (ref) return getSurahById(ref.surahId);

  const q = normalize(query);
  const numberMatch = q.match(/\b(?:surah|chapter)\s+(\d{1,3})\b/);
  if (numberMatch) return getSurahById(numberMatch[1]);

  const ranked = surahList
    .map((surah) => ({ surah, score: scoreSurah(surah, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked[0]?.score >= 12 && ranked[0].score >= (ranked[1]?.score || 0) + 4) return ranked[0].surah;
  if (/\b(it|that|this|same surah|its)\b/.test(q) && context.lastSurahId) return getSurahById(context.lastSurahId);
  return null;
}

function findLastSurahFromMessages(messages = []) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const found = findSurah(messages[index]?.text || "");
    if (found) return found.number;
  }
  return null;
}

function findKnowledge(query) {
  const queryTokens = tokens(query);
  return knowledgeBase
    .map((entry) => ({
      entry,
      score: scoreKeywords(queryTokens, [...entry.keywords, entry.title]),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

async function fetchAyah(reference) {
  if (!reference?.surahId || !reference?.ayahNumber) return null;
  const surah = getSurahById(reference.surahId);
  if (!surah || reference.ayahNumber < 1 || reference.ayahNumber > surah.ayahCount) return null;

  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${reference.surahId}:${reference.ayahNumber}/editions/quran-uthmani,en.sahih`,
    );
    if (!response.ok) return null;
    const payload = await response.json();
    const arabic = payload?.data?.[0]?.text;
    const translation = payload?.data?.[1]?.text;
    if (!arabic && !translation) return null;
    return { surah, arabic, translation, number: reference.ayahNumber };
  } catch {
    return null;
  }
}

function opener(query) {
  const total = normalize(query).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return toneOpeners[total % toneOpeners.length];
}

function formatSurah(surah) {
  return `Surah ${surah.name} (${surah.number}) means "${surah.translation}" and has ${surah.ayahCount} ayahs.`;
}

function answerSurah(surah, intent, query) {
  if (intent.name === "meaning") {
    return `${opener(query)} ${formatSurah(surah)}\n\nSimple meaning: ${surah.summary}\n\nReference: Surah ${surah.name} (${surah.number}).`;
  }

  if (intent.name === "memorise") {
    const chunk = surah.ayahCount <= 7 ? 1 : surah.ayahCount <= 30 ? 3 : 5;
    return `${opener(query)} For ${surah.name}, use ${chunk}-ayah chunks.\n\n1. Listen once without reading.\n2. Read while listening.\n3. Hide the Arabic and recite.\n4. Reveal only to fix mistakes.\n5. Repeat the weak word three times.\n\nBecause this surah has ${surah.ayahCount} ayahs, do not rush. Small perfect chunks beat big messy chunks.`;
  }

  if (intent.name === "tajweed") {
    return `${opener(query)} For ${surah.name}, start with slow recitation.\n\nFocus on:\n- long vowels\n- shaddah/doubled letters\n- clean stops\n- not swallowing endings\n\nIf you give me an ayah number, I can make this more specific.`;
  }

  if (intent.name === "quiz") return makeQuiz(surah);

  return `${opener(query)} ${formatSurah(surah)}\n\nMain study focus: ${surah.summary}\n\nAsk me to make it easier, quiz you on it, help memorise it, or explain a specific ayah.`;
}

function answerPlan(user) {
  const xp = user?.xp || 0;
  const level = xp >= 500 ? "intermediate" : xp >= 150 ? "steady beginner" : "new beginner";
  return `I would treat you as a ${level} learner right now.\n\nBest path:\n${beginnerPath.map((name, index) => `${index + 1}. ${name}`).join("\n")}\n\nDaily routine:\n- 3 minutes listening\n- 4 minutes memorising\n- 2 minutes review\n- 1 minute meaning reflection\n\nWhen that feels easy, increase review before adding lots of new ayahs.`;
}

function shuffledOptions(options, seedText) {
  const copy = [...options];
  const seed = normalize(seedText).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = (seed + index * 7) % (index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function makeQuiz(surah) {
  const target = surah || getSurahById(112);
  const bankQuestion = quizBank[target.number % quizBank.length];
  const question =
    surah
      ? {
          id: `surah-${target.number}`,
          prompt: `What does Surah ${target.name} mean?`,
          answer: target.translation,
          options: [
            target.translation,
            ...surahList
              .filter((item) => item.number !== target.number)
              .slice(target.number % 30, target.number % 30 + 3)
              .map((item) => item.translation),
          ],
        }
      : bankQuestion;
  const options = shuffledOptions(question.options, question.prompt);
  const lines = options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join("\n");
  return {
    text: `Okay, quiz time.\n\n${question.prompt}\n\n${lines}\n\nReply with A, B, C, D, or the answer itself.`,
    card: null,
    context: { activeQuiz: { ...question, options }, lastSurahId: target.number },
  };
}

function checkQuizAnswer(query, quiz) {
  if (!quiz?.answer) return null;
  const q = normalize(query);
  const letter = q.match(/^(a|b|c|d|1|2|3|4)\b/)?.[1];
  const indexMap = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
  const chosen = letter ? quiz.options?.[indexMap[letter]] : query;
  const correct = normalize(chosen) === normalize(quiz.answer) || normalize(query).includes(normalize(quiz.answer));

  if (correct) {
    return {
      text: `Correct. The answer is "${quiz.answer}". Nice work.\n\nWant another one? Say "quiz me again" or ask for a harder question.`,
      card: null,
      context: { activeQuiz: null },
    };
  }

  return {
    text: `Not quite. The correct answer is "${quiz.answer}".\n\nQuick fix: say the correct answer once, then connect it to the surah or rule in your mind. If you want, say "quiz me again" and I'll give another one.`,
    card: null,
    context: { activeQuiz: null },
  };
}

function answerKnowledge(query, rankedKnowledge) {
  const top = rankedKnowledge[0]?.entry;
  const second = rankedKnowledge[1]?.score >= 4 ? rankedKnowledge[1].entry : null;
  if (!top) return null;

  if (second) {
    return `${opener(query)} This touches two things: ${top.title} and ${second.title}.\n\n${top.answer}\n\nAlso remember: ${second.answer}\n\nIf you want, give me the exact ayah and I’ll apply it there.`;
  }

  return `${opener(query)} ${top.answer}\n\nIf you want, I can make this easier, turn it into a quiz, or apply it to a specific surah.`;
}

function simplifyLast(context) {
  const topic = context.lastTopic;
  if (topic) {
    return `Simpler version: ${topic.answer}\n\nTiny action: practise one example slowly three times. Do not move on until it feels clean.`;
  }
  return "Simpler version: choose one small thing. Listen once, repeat slowly, fix one mistake, then move on. Tell me the surah or ayah and I’ll make it specific.";
}

function deepenLast(context, surah) {
  if (surah) {
    return `${formatSurah(surah)}\n\nDeeper study method:\n1. Name/theme: ${surah.translation}.\n2. Main focus: ${surah.summary}\n3. Memorisation: split into small phrases.\n4. Reflection: ask what this teaches about Allah, the Hereafter, and your actions.\n5. Review: recite the same section tomorrow before learning more.`;
  }
  const topic = context.lastTopic;
  if (topic) {
    return `Deeper version of ${topic.title}:\n\n${topic.answer}\n\nAdvanced practice: find it in one ayah, isolate the exact word, listen to a reciter, repeat slowly, then recite the whole phrase without breaking flow.`;
  }
  return "For a deeper answer, give me a surah, ayah reference, or tajweed topic. I can then break it into meaning, practice, mistakes, and review.";
}

function answerProgress(user) {
  return `Your profile shows ${user?.xp || 0} XP and a ${user?.streak || 0}-day streak.\n\nBest next move:\n- review one weak ayah\n- listen twice\n- recite once slowly\n- fix only the weakest word\n\nThat is the kind of practice that actually sticks.`;
}

function answerGeneral(query, surah, rankedKnowledge, context) {
  const q = normalize(query);

  if (/^(hi|hello|salam|assalamu|as-salamu|السلام)/.test(q)) {
    return "Wa alaikum assalam. Ask me anything about a surah, ayah reference, tajweed, memorisation, review, or what to learn next.";
  }

  if (/\b(thanks|thank you|jazak|jazakallah)\b/.test(q)) {
    return "Wa iyyak. Keep going gently — one careful ayah is real progress.";
  }

  const knowledgeAnswer = answerKnowledge(query, rankedKnowledge);
  if (knowledgeAnswer) return knowledgeAnswer;
  if (surah) return answerSurah(surah, { name: "summary" }, query);

  const lesson = getLessonById("1-1");
  return `I am not fully sure what you mean yet, but I can still help.\n\nTry asking in one of these forms:\n- "Explain Surah Al-Mulk"\n- "What does 2:255 mean?"\n- "Help me memorise Al-Ikhlas"\n- "How do I fix ghunnah?"\n- "Quiz me on tajweed"\n\nA useful lesson reminder: ${lesson?.tafsir || "Begin with Allah's name and seek His mercy."}`;
}

export async function getSheikhReply(question, context = {}) {
  await wait();

  const query = normalize(question);
  if (!query) {
    return { text: "Ask me a Quran learning question and I’ll help step by step.", card: null, context: {} };
  }

  const lastSurahId = context.lastSurahId || findLastSurahFromMessages(context.messages);
  const intent = detectIntent(query);
  const reference = extractAyahReference(query, lastSurahId);
  const surah = findSurah(query, { lastSurahId });
  const rankedKnowledge = findKnowledge(query);
  const topTopic = rankedKnowledge[0]?.entry;

  if (intent.name === "answerQuiz" && context.activeQuiz) {
    return checkQuizAnswer(question, context.activeQuiz);
  }

  if (intent.name === "easier") {
    return { text: simplifyLast(context), card: null, context: { lastSurahId, lastTopic: context.lastTopic } };
  }

  if (intent.name === "harder") {
    return {
      text: deepenLast(context, surah || (lastSurahId ? getSurahById(lastSurahId) : null)),
      card: surah ? "breakdown" : null,
      context: { lastSurahId: surah?.number || lastSurahId, lastTopic: context.lastTopic },
    };
  }

  if (reference) {
    const fetched = await fetchAyah(reference);
    if (fetched) {
      return {
        text: `${opener(question)} Here is Surah ${fetched.surah.name} ${fetched.surah.number}:${fetched.number}.\n\n${fetched.arabic || ""}\n\n${fetched.translation || ""}\n\nStudy focus: understand the meaning first, listen for phrase boundaries, then memorise in small pieces.`,
        card: "breakdown",
        context: { lastSurahId: fetched.surah.number },
      };
    }
  }

  if (intent.name === "quiz") {
    return makeQuiz(surah || (lastSurahId ? getSurahById(lastSurahId) : null));
  }

  if (intent.name === "ruling") {
    return {
      text: `${knowledgeBase.find((entry) => entry.id === "fatwa-boundary").answer}\n\nIf your question is about learning, recitation, memorisation, or general Qur'an study, I can help with that.`,
      card: null,
      context: { lastSurahId },
    };
  }

  if (intent.name === "plan" && !surah) {
    return { text: answerPlan(context.user), card: "recommendation", context: { lastSurahId, lastTopic: topTopic } };
  }

  if (intent.name === "progress") {
    return { text: answerProgress(context.user), card: "progress", context: { lastSurahId, lastTopic: topTopic } };
  }

  if (intent.name === "recitation") {
    const text = answerKnowledge(question, rankedKnowledge) || knowledgeBase.find((entry) => entry.id === "recitation-practice").answer;
    return { text, card: "recitation", context: { lastSurahId: surah?.number || lastSurahId, lastTopic: topTopic } };
  }

  if (surah) {
    return {
      text: answerSurah(surah, intent, question),
      card: intent.card,
      context: { lastSurahId: surah.number, lastTopic: topTopic },
    };
  }

  return {
    text: answerGeneral(question, surah, rankedKnowledge, context),
    card: topTopic?.id?.includes("recitation") ? "recitation" : null,
    context: { lastSurahId, lastTopic: topTopic },
  };
}
