"use client";

import { FormEvent, useState } from "react";
import { Note } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type NotesPanelProps = {
  currentTimestamp: number;
  notes: Note[];
  onAddNote: (text: string) => Promise<void> | void;
  onJump: (seconds: number) => void;
  loading?: boolean;
  error?: string | null;
  onExportNotion: () => Promise<void> | void;
  exportLoading?: boolean;
};

export default function NotesPanel({
  currentTimestamp,
  notes,
  onAddNote,
  onJump,
  loading,
  error,
  onExportNotion,
  exportLoading,
}: NotesPanelProps) {
  const [text, setText] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) {
      return;
    }
    const next = text.trim();
    setText("");
    await onAddNote(next);
  };

  return (
    <div className="flex h-[200px] flex-col border-t border-[#1e1e2e] bg-[#0a0a0f]">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-[#1e1e2e] px-4 py-2">
        <h3 className="text-sm font-medium text-white">Notes</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#52525e]">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 border-[#1e1e2e] bg-transparent text-[11px] text-[#9898a8] hover:border-[#00d4aa40] hover:text-white"
            onClick={onExportNotion}
            disabled={exportLoading}
          >
            {exportLoading ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 flex-shrink-0 border-r border-[#1e1e2e] p-3">
          <p className="mb-2 text-xs text-[#52525e]">
            Current time:{" "}
            <span className="font-mono text-[#00d4aa]">{formatTimestamp(currentTimestamp)}</span>
          </p>
          <form onSubmit={submit}>
            <textarea
              className="h-16 w-full resize-none rounded-lg border border-[#1e1e2e] bg-[#111118] p-2 text-xs text-white placeholder:text-[#52525e] outline-none transition-colors focus:border-[#00d4aa40]"
              placeholder="Type a note at this timestamp..."
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <Button
              type="submit"
              size="sm"
              className="mt-2 h-7 w-full bg-[#00d4aa] text-xs font-semibold text-black hover:bg-[#00c49a]"
              disabled={loading}
            >
              Save Note
            </Button>
          </form>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </div>

        <ScrollArea className="flex-1" orientation="horizontal">
          <div className="flex h-full gap-2 p-3">
            {notes.length === 0 && (
              <p className="self-center text-xs text-[#52525e]">No notes yet. Save your first insight.</p>
            )}
            {notes.map((note) => (
              <button
                type="button"
                key={note.id}
                onClick={() => onJump(note.timestamp)}
                className="hover-lift h-fit w-52 flex-shrink-0 rounded-lg border border-[#1e1e2e] bg-[#111118] p-2.5 text-left transition-all hover:border-[#00d4aa40]"
              >
                <span className="mb-1 block font-mono text-xs font-medium text-[#00d4aa]">
                  {formatTimestamp(note.timestamp)}
                </span>
                <p className="line-clamp-3 text-xs leading-relaxed text-[#9898a8]">{note.text}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
