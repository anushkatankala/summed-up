import type { NextApiRequest, NextApiResponse } from "next";
import { getStore, setHighlights } from "@/lib/store";
import { generateLectureHighlights } from "@/lib/twelvelabs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { indexId } = req.body as { indexId?: string };
    const activeIndex = indexId || getStore().indexId;
    if (!activeIndex) {
      return res.status(400).json({ error: "No index_id found. Upload lecture first." });
    }

    const highlights = await generateLectureHighlights(activeIndex);
    setHighlights(highlights);
    return res.status(200).json({ highlights });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate highlights.";
    return res.status(500).json({ error: message });
  }
}
