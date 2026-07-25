import { NextResponse } from "next/server";
import { getSheikhReply } from "../../../lib/ai";
import { surahList } from "../../../lib/quran";

export const runtime = "nodejs";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.6-sol";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1";
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";

function timeoutSignal(ms) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timeout) };
}

function compactHistory(messages = []) {
  return messages
    .slice(-10)
    .map((message) => {
      const role = message.role === "user" ? "Student" : "Tutor";
      return `${role}: ${String(message.text || "").slice(0, 900)}`;
    })
    .join("\n");
}

function buildQuranContext() {
  return surahList
    .map((surah) => `${surah.number}. ${surah.name} - ${surah.translation}; ${surah.ayahCount} ayahs; ${surah.summary}`)
    .join("\n");
}

function buildTutorPrompt({ question, messages, user }) {
  return `
You are Quran Tarteel's AI tutor: a warm, careful, beginner-friendly Quran learning guide.

Core rules:
- Answer the student's actual question, not only preset topics.
- Be conversational, responsive, and useful.
- Ground Quran facts in the provided app data when available.
- If the student asks for tafsir, give a short educational summary and avoid claiming specialist authority.
- If the student asks for a ruling/fatwa, say you can explain general learning points but they should ask a qualified scholar.
- If the student asks about recitation, give practical listening/pronunciation steps.
- If the student sounds confused, make the next step smaller.
- Keep answers concise unless the student asks for depth.
- Use references like "Surah Al-Mulk (67)" or "2:255" when relevant.
- Do not invent Arabic text. If exact Arabic text is not in context, say you can explain the meaning or ask them to open the ayah page.

Student profile:
- XP: ${user?.xp || 0}
- Streak: ${user?.streak || 0}
- Daily goal: ${user?.dailyGoal || 10}
- Preferred reciter: ${user?.preferredReciter || "not set"}

Available surah data:
${buildQuranContext()}

Recent conversation:
${compactHistory(messages) || "No previous messages."}

Student question:
${question}

Respond as the tutor now.`;
}

function readOpenAIText(payload) {
  if (payload?.output_text) return payload.output_text;

  const textParts = [];
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") textParts.push(content.text);
    }
  }
  return textParts.join("\n").trim();
}

async function answerWithOllama({ question, messages, user }) {
  const timer = timeoutSignal(12000);
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: timer.signal,
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      options: {
        temperature: 0.45,
        num_predict: 650,
      },
      messages: [
        {
          role: "system",
          content: buildTutorPrompt({ question: "Use these rules for the next student message.", messages: [], user }),
        },
        ...messages.slice(-8).map((message) => ({
          role: message.role === "user" ? "user" : "assistant",
          content: String(message.text || ""),
        })),
        { role: "user", content: question },
      ],
    }),
  }).finally(timer.clear);

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || `Ollama failed with status ${response.status}`);

  const text = payload?.message?.content?.trim();
  if (!text) throw new Error("Ollama returned an empty response.");
  return { text, source: "ollama", context: {} };
}

async function answerWithOpenAI({ question, messages, user }) {
  const timer = timeoutSignal(25000);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    signal: timer.signal,
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: buildTutorPrompt({ question, messages, user }),
      reasoning: { effort: "low" },
      text: { verbosity: "medium" },
      max_output_tokens: 900,
      safety_identifier: `quran-tarteel-${String(user?.id || "local-user").slice(0, 64)}`,
    }),
  }).finally(timer.clear);

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || `OpenAI failed with status ${response.status}`);

  const text = readOpenAIText(payload);
  if (!text) throw new Error("OpenAI returned an empty response.");
  return { text, source: "openai", context: {} };
}

async function answerWithLocalFallback({ question, messages, user, context = {}, apiError }) {
  const fallback = await getSheikhReply(question, { messages, user, ...context });
  return { ...fallback, source: "local-fallback", apiError };
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const question = String(body.question || "").trim();
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const user = body.user || {};
  const { question: _question, messages: _messages, user: _user, ...context } = body;

  if (!question) {
    return NextResponse.json({ text: "Ask me a Quran learning question and I'll help step by step.", source: "empty" });
  }

  const provider = String(process.env.AI_PROVIDER || "").toLowerCase();

  try {
    if (provider === "ollama") {
      return NextResponse.json(await answerWithOllama({ question, messages, user }));
    }

    if (process.env.OPENAI_API_KEY) {
      return NextResponse.json(await answerWithOpenAI({ question, messages, user }));
    }

    if (provider === "auto-ollama") {
      return NextResponse.json(await answerWithOllama({ question, messages, user }));
    }
  } catch (error) {
    return NextResponse.json(
      await answerWithLocalFallback({
        question,
        messages,
        user,
        context,
        apiError: error instanceof Error ? error.message : "AI provider failed.",
      }),
    );
  }

  return NextResponse.json(await answerWithLocalFallback({ question, messages, user, context }));
}
