"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import HighlightsPanel from "@/components/HighlightsPanel";
import NotesPanel from "@/components/NotesPanel";
import ResultsList from "@/components/ResultsList";
import SearchBar from "@/components/SearchBar";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { ChatMessage, Highlight, Note, SearchResult } from "@/lib/types";

type SessionData = {
  indexId: string;
  lectureTitle: string;
  videoUrl: string;
};

export default function HomePage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [seekToSeconds, setSeekToSeconds] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [highlightsLoading, setHighlightsLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [highlightsError, setHighlightsError] = useState<string | null>(null);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("summed-up-session");
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as SessionData;
      if (parsed.indexId) {
        setSession(parsed);
      }
    } catch {
      localStorage.removeItem("summed-up-session");
    }
  }, []);

  useEffect(() => {
    const loadNotes = async () => {
      const response = await fetch("/api/notes");
      const data = (await response.json()) as { notes: Note[] };
      setNotes(data.notes || []);
    };
    loadNotes().catch(() => setNotes([]));
  }, []);

  const lectureTitle = useMemo(() => session?.lectureTitle || "No lecture loaded", [session]);

  const searchLecture = async (query: string) => {
    setSearchLoading(true);
    setSearchError(null);
    try {
      if (!session?.indexId) {
        throw new Error("No indexed lecture yet. Open Upload first.");
      }
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, indexId: session.indexId }),
      });
      const data = (await response.json()) as { error?: string; results?: SearchResult[] };
      if (!response.ok) {
        throw new Error(data.error || "Search failed.");
      }
      setSearchResults(data.results || []);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "Search failed.");
    } finally {
      setSearchLoading(false);
    }
  };

  const generateHighlights = async () => {
    setHighlightsLoading(true);
    setHighlightsError(null);
    try {
      if (!session?.indexId) {
        throw new Error("No indexed lecture yet.");
      }
      const response = await fetch("/api/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ indexId: session.indexId }),
      });
      const data = (await response.json()) as { error?: string; highlights?: Highlight[] };
      if (!response.ok) {
        throw new Error(data.error || "Could not generate highlights.");
      }
      setHighlights(data.highlights || []);
    } catch (error) {
      setHighlightsError(error instanceof Error ? error.message : "Could not generate highlights.");
    } finally {
      setHighlightsLoading(false);
    }
  };

  const askLecture = async (question: string) => {
    setChatLoading(true);
    setChatError(null);
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: question,
    };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      if (!session?.indexId) {
        throw new Error("No indexed lecture yet.");
      }
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          indexId: session.indexId,
          history: chatMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        answer?: string;
        references?: Array<{ label: string; timestamp: number }>;
      };
      if (!response.ok || !data.answer) {
        throw new Error(data.error || "Chat failed.");
      }
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.answer || "No answer received.",
          references: data.references || [],
        },
      ]);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Chat failed.");
    } finally {
      setChatLoading(false);
    }
  };

  const addTimestampNote = async (text: string) => {
    setNotesLoading(true);
    setNotesError(null);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp: currentTimestamp, text }),
      });
      const data = (await response.json()) as { error?: string; notes?: Note[] };
      if (!response.ok) {
        throw new Error(data.error || "Failed to save note.");
      }
      setNotes(data.notes || []);
    } catch (error) {
      setNotesError(error instanceof Error ? error.message : "Failed to save note.");
    } finally {
      setNotesLoading(false);
    }
  };

  const exportToNotion = async () => {
    setExportLoading(true);
    setToast(null);
    try {
      const response = await fetch("/api/notion", { method: "POST" });
      const data = (await response.json()) as { error?: string; url?: string; mocked?: boolean };
      if (!response.ok) {
        throw new Error(data.error || "Export failed.");
      }
      const mode = data.mocked ? "mock mode" : "live mode";
      setToast(`Notion export complete (${mode}). ${data.url ?? ""}`);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Export failed.");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <main className="min-h-screen space-y-4 p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Summed Up</h1>
          <p className="text-sm text-muted-foreground">{lectureTitle}</p>
        </div>
        <Link href="/upload">
          <Button>Upload / Link Lecture</Button>
        </Link>
      </header>

      {toast && <p className="rounded-md border px-3 py-2 text-sm text-muted-foreground">{toast}</p>}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <section className="space-y-4 xl:col-span-5">
          <VideoPlayer
            videoUrl={session?.videoUrl || ""}
            onProgress={setCurrentTimestamp}
            seekToSeconds={seekToSeconds}
            onSeekHandled={() => setSeekToSeconds(null)}
          />
          <HighlightsPanel
            highlights={highlights}
            onGenerate={generateHighlights}
            onJump={setSeekToSeconds}
            loading={highlightsLoading}
            error={highlightsError}
          />
        </section>

        <section className="space-y-4 xl:col-span-4">
          <SearchBar onSearch={searchLecture} loading={searchLoading} />
          <ResultsList
            results={searchResults}
            onJump={setSeekToSeconds}
            loading={searchLoading}
            error={searchError}
          />
        </section>

        <section className="xl:col-span-3">
          <ChatPanel
            messages={chatMessages}
            onAsk={askLecture}
            onJump={setSeekToSeconds}
            loading={chatLoading}
            error={chatError}
          />
        </section>
      </div>

      <NotesPanel
        currentTimestamp={currentTimestamp}
        notes={notes}
        onAddNote={addTimestampNote}
        onJump={setSeekToSeconds}
        loading={notesLoading}
        error={notesError}
        onExportNotion={exportToNotion}
        exportLoading={exportLoading}
      />
    </main>
  );
}
