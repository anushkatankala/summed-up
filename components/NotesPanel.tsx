"use client";

import { FormEvent, useState } from "react";
import { Note } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Timestamp Notes ({formatTimestamp(currentTimestamp)})</CardTitle>
        <Button variant="secondary" size="sm" onClick={onExportNotion} disabled={exportLoading}>
          {exportLoading ? "Exporting..." : "Export to Notion"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={submit} className="flex gap-2">
          <Input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Add a note at the current timestamp..."
          />
          <Button type="submit" disabled={loading}>
            Save
          </Button>
        </form>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <ScrollArea className="h-[180px] rounded-md border p-3">
          <div className="space-y-2">
            {notes.length === 0 && (
              <p className="text-sm text-muted-foreground">No notes yet. Add your first insight.</p>
            )}
            {notes.map((note) => (
              <button
                type="button"
                key={note.id}
                onClick={() => onJump(note.timestamp)}
                className="w-full rounded-md border p-2 text-left text-sm hover:bg-muted/40"
              >
                <span className="font-medium">{formatTimestamp(note.timestamp)} </span>
                <span className="text-muted-foreground">{note.text}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
