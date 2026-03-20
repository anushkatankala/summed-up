import type { NextApiRequest, NextApiResponse } from "next";
import { answerLectureQuestion } from "@/lib/openai";
import { getStore } from "@/lib/store";
import { semanticSearchLecture } from "@/lib/twelvelabs";

type IncomingHistory = Array<{ role: "user" | "assistant"; content: string }>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question, indexId, history } = req.body as {
      question?: string;
      indexId?: string;
      history?: IncomingHistory;
    };

    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    const activeIndex = indexId || getStore().indexId;
    if (!activeIndex) {
      return res.status(400).json({ error: "No index_id found. Upload lecture first." });
    }

    const searchResults = await semanticSearchLecture({ indexId: activeIndex, query: question });
    const response = await answerLectureQuestion({
      question,
      searchResults,
      history: history ?? [],
    });

    return res.status(200).json({
      answer: response.answer,
      references: response.references,
      mocked: response.mocked,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chat request failed.";
    return res.status(500).json({ error: message });
  }
}
