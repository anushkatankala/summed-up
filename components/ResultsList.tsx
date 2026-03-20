"use client";

import { SearchResult } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type ResultsListProps = {
  results: SearchResult[];
  onJump: (seconds: number) => void;
  loading?: boolean;
  error?: string | null;
};

export default function ResultsList({ results, onJump, loading, error }: ResultsListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="h-full">
        {loading && <p className="text-sm text-[#9898a8]">Searching lecture moments...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading && results.length === 0 && !error && (
          <div className="py-12 text-center">
            <p className="text-sm text-[#52525e]">Search for a concept to find relevant moments</p>
          </div>
        )}
        {results.map((result) => (
          <button
            type="button"
            key={result.id}
            onClick={() => onJump(result.timestamp)}
            className="animate-fade-in hover-lift mb-2 w-full cursor-pointer rounded-lg border border-[#1e1e2e] bg-[#111118] p-3 text-left transition-all hover:border-[#00d4aa40]"
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs font-medium text-[#00d4aa]">
                {formatTimestamp(result.timestamp)}
              </span>
              <span className="text-xs text-[#52525e]">{Math.round(result.confidence * 100)}% match</span>
            </div>
            <p className="text-xs leading-relaxed text-white">{result.explanation}</p>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
