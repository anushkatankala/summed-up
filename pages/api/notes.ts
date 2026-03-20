import type { NextApiRequest, NextApiResponse } from "next";
import { addNote, getStore } from "@/lib/store";
import { Note } from "@/lib/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ notes: getStore().notes });
  }

  if (req.method === "POST") {
    const { timestamp, text } = req.body as { timestamp?: number; text?: string };
    if (typeof timestamp !== "number" || !text?.trim()) {
      return res.status(400).json({ error: "timestamp and note text are required." });
    }

    const note: Note = {
      id: `note-${Date.now()}`,
      timestamp,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    addNote(note);
    return res.status(200).json({ note, notes: getStore().notes });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
