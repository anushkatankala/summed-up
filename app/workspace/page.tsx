"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Upload } from "lucide-react";
import ChatPanel from "@/components/ChatPanel";
import HighlightsPanel from "@/components/HighlightsPanel";
import NotesPanel from "@/components/NotesPanel";
import ResultsList from "@/components/ResultsList";
import SearchBar from "@/components/SearchBar";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage, Highlight, Note, SearchResult } from "@/lib/types";

type SessionData = {
  indexId: string;
  lectureTitle: string;
  videoUrl: string;
};

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-lg bg-[#1e1e2e] ${className}`} />
);

export default function LectureWorkspacePage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [indexing, setIndexing] = useState(false);
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

  const indexLecture = async () => {
    setToast(null);
    if (!youtubeUrl.trim() && !file) {
      setToast("Add a YouTube URL or choose a file first.");
      return;
    }
    setIndexing(true);
    try {
      const previewUrl = file ? URL.createObjectURL(file) : "";
      const response = await fetch("/api/index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: youtubeUrl.trim() || undefined, fileName: file?.name }),
      });
      const data = (await response.json()) as {
        error?: string;
        index_id?: string;
        title?: string;
      };
      if (!response.ok || !data.index_id) {
        throw new Error(data.error || "Indexing failed.");
      }
      const nextSession: SessionData = {
        indexId: data.index_id,
        lectureTitle: data.title || file?.name || youtubeUrl || "Lecture",
        videoUrl: youtubeUrl.trim() || previewUrl,
      };
      localStorage.setItem("summed-up-session", JSON.stringify(nextSession));
      setSession(nextSession);
      setToast("Lecture indexed successfully.");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Indexing failed.");
    } finally {
      setIndexing(false);
    }
  };

  const searchLecture = async (query: string) => {
    setSearchLoading(true);
    setSearchError(null);
    try {
      if (!session?.indexId) {
        throw new Error("No indexed lecture yet.");
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
    <main className="h-screen overflow-hidden bg-[#0a0a0f] text-[#f0f0f5]">
      <nav className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#1e1e2e] bg-[#0a0a0f] px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-[#9898a8] transition-colors hover:text-white"
          >
            ← Back
          </Link>
          <span className="text-[#1e1e2e]">|</span>
          <span className="max-w-[300px] truncate text-sm font-medium text-white">{lectureTitle}</span>
        </div>
      </nav>

      {toast && (
        <div className="border-b border-[#1e1e2e] bg-[#111118] px-6 py-2 text-xs text-[#9898a8]">{toast}</div>
      )}

      <div className="h-[calc(100vh-3.5rem-200px)] grid-cols-1 overflow-hidden lg:grid lg:grid-cols-[1fr_1fr_380px]">
        <div className="flex flex-col overflow-hidden border-r border-[#1e1e2e]">
          <div className="border-b border-[#1e1e2e] p-4">
            {!session?.videoUrl ? (
              <div className="rounded-xl border-2 border-dashed border-[#1e1e2e] bg-[#111118] p-6 text-center transition-all hover:border-[#00d4aa40]">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#00d4aa30] bg-[#00d4aa1a]">
                  <Upload className="h-5 w-5 text-[#00d4aa]" />
                </div>
                <p className="mb-1 text-sm font-medium text-white">Drop a YouTube URL or upload a video</p>
                <p className="mb-4 text-xs text-[#52525e]">Supports YouTube links and MP4 files</p>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(event) => setYoutubeUrl(event.target.value)}
                  className="mb-2 border-[#1e1e2e] bg-[#0a0a0f] text-sm text-white placeholder:text-[#52525e]"
                />
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  className="mb-2 border-[#1e1e2e] bg-[#0a0a0f] text-xs text-[#9898a8]"
                />
                <Button
                  className="w-full bg-[#00d4aa] text-sm font-semibold text-black hover:bg-[#00c49a]"
                  onClick={indexLecture}
                  disabled={indexing}
                >
                  {indexing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#0a0a0f] border-t-transparent" />
                      Indexing...
                    </span>
                  ) : (
                    "Index Lecture"
                  )}
                </Button>
              </div>
            ) : (
              <VideoPlayer
                videoUrl={session.videoUrl}
                onProgress={setCurrentTimestamp}
                seekToSeconds={seekToSeconds}
                onSeekHandled={() => setSeekToSeconds(null)}
              />
            )}
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <HighlightsPanel
              highlights={highlights}
              onGenerate={generateHighlights}
              onJump={setSeekToSeconds}
              loading={highlightsLoading}
              error={highlightsError}
            />
          </div>
        </div>

        <div className="flex flex-col overflow-hidden border-r border-[#1e1e2e]">
          <div className="border-b border-[#1e1e2e] p-4">
            <SearchBar onSearch={searchLecture} loading={searchLoading} />
          </div>
          <div className="flex-1 overflow-hidden p-4">
            {searchLoading && searchResults.length === 0 ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <ResultsList
                results={searchResults}
                onJump={setSeekToSeconds}
                loading={searchLoading}
                error={searchError}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col overflow-hidden bg-[#0d0d14]">
          <ChatPanel
            messages={chatMessages}
            onAsk={askLecture}
            onJump={setSeekToSeconds}
            loading={chatLoading}
            error={chatError}
          />
        </div>
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
