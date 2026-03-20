import type { NextApiRequest, NextApiResponse } from "next";
import { getStore } from "@/lib/store";
import { semanticSearchLecture } from "@/lib/twelvelabs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query, indexId } = req.body as { query?: string; indexId?: string };
    if (!query) {
      return res.status(400).json({ error: "Query is required." });
    }

    const activeIndex = indexId || getStore().indexId;
    if (!activeIndex) {
      return res.status(400).json({ error: "No index_id found. Upload lecture first." });
    }

    const results = await semanticSearchLecture({ indexId: activeIndex, query });
    return res.status(200).json({ query, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed.";
    return res.status(500).json({ error: message });
  }
}
