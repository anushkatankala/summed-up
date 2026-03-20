import type { NextApiRequest, NextApiResponse } from "next";
import { setIndexData } from "@/lib/store";
import { indexLectureVideo } from "@/lib/twelvelabs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { youtubeUrl, fileName } = req.body as {
      youtubeUrl?: string;
      fileName?: string;
    };

    if (!youtubeUrl && !fileName) {
      return res.status(400).json({ error: "Provide a YouTube URL or file name." });
    }

    const indexed = await indexLectureVideo({ youtubeUrl, fileName });
    setIndexData({
      indexId: indexed.indexId,
      lectureTitle: indexed.title,
      lectureUrl: youtubeUrl ?? "",
    });

    return res.status(200).json({
      ok: true,
      index_id: indexed.indexId,
      title: indexed.title,
      mocked: indexed.mocked,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to index lecture.";
    return res.status(500).json({ error: message });
  }
}
