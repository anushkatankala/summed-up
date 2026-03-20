"use client";

import { Highlight } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type HighlightsPanelProps = {
  highlights: Highlight[];
  onGenerate: () => Promise<void> | void;
  onJump: (seconds: number) => void;
  loading?: boolean;
  error?: string | null;
};

export default function HighlightsPanel({
  highlights,
  onGenerate,
  onJump,
  loading,
  error,
}: HighlightsPanelProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Key Moments</h3>
        <Button
          size="sm"
          onClick={onGenerate}
          disabled={loading}
          variant="outline"
          className="h-7 border-[#1e1e2e] bg-transparent text-xs text-[#9898a8] hover:border-[#00d4aa40] hover:text-white"
        >
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>
      {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
      {!loading && highlights.length === 0 && !error && (
        <p className="text-xs text-[#52525e]">Generate key moments to quickly review important parts.</p>
      )}
      <ScrollArea className="flex-1 pr-1">
        {highlights.map((highlight) => (
          <button
            type="button"
            key={highlight.id}
            onClick={() => onJump(highlight.start)}
            className="hover-lift group mb-2 w-full cursor-pointer rounded-lg border border-[#1e1e2e] bg-[#111118] p-3 text-left transition-all hover:border-[#00d4aa40]"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="font-mono text-xs text-[#00d4aa]">{formatTimestamp(highlight.start)}</span>
              <span className="text-xs text-[#52525e]">→</span>
              <span className="font-mono text-xs text-[#52525e]">{formatTimestamp(highlight.end)}</span>
            </div>
            <p className="mb-0.5 text-xs font-medium text-white">{highlight.title}</p>
            <p className="text-xs leading-relaxed text-[#9898a8]">{highlight.summary}</p>
          </button>
        ))}
      </ScrollArea>
    </div>
  );
}
