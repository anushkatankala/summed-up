import OpenAI from "openai";
import { ChatReference, SearchResult } from "@/lib/types";

function hasOpenAi() {
  return Boolean(process.env.OPENAI_API_KEY);
}

function buildContext(results: SearchResult[]) {
  return results
    .map(
      (result, idx) =>
        `Segment ${idx + 1} at ${Math.floor(result.timestamp)}s:\n${result.explanation}`,
    )
    .join("\n\n");
}

export async function answerLectureQuestion(input: {
  question: string;
  searchResults: SearchResult[];
  history: Array<{ role: "user" | "assistant"; content: string }>;
}) {
  const references: ChatReference[] = input.searchResults.slice(0, 3).map((result) => ({
    label: `~${Math.floor(result.timestamp)}s`,
    timestamp: result.timestamp,
  }));

  if (!hasOpenAi()) {
    return {
      answer:
        "Mock mode: based on the retrieved lecture segments, this topic is explained in simple terms with a practical example. Ask a follow-up for more detail.",
      references,
      mocked: true,
    };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `You are a helpful tutor. Answer based only on the lecture context below. If unsure, say you don't know. Explain simply.

Lecture context:
${buildContext(input.searchResults)}
`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: prompt },
      ...input.history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      { role: "user", content: input.question },
    ],
  });

  const answer = response.output_text?.trim() || "I don't know based on this lecture context.";

  return {
    answer,
    references,
    mocked: false,
  };
}
