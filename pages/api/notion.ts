import type { NextApiRequest, NextApiResponse } from "next";
import { exportLectureToNotion } from "@/lib/notion";
import { getStore } from "@/lib/store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const store = getStore();
    const payload = await exportLectureToNotion({
      title: store.lectureTitle || "Summed Up Lecture",
      highlights: store.highlights,
      notes: store.notes,
    });

    return res.status(200).json({
      ok: true,
      mocked: payload.mocked,
      notionPageId: payload.notionPageId,
      url: payload.url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Notion export failed.";
    return res.status(500).json({ error: message });
  }
}
