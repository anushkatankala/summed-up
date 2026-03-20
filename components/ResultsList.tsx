"use client";

import { SearchResult } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type ResultsListProps = {
  results: SearchResult[];
  onJump: (seconds: number) => void;
  loading?: boolean;
  error?: string | null;
};

export default function ResultsList({ results, onJump, loading, error }: ResultsListProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Search Results</CardTitle>
      </CardHeader>
      <CardContent className="h-[420px]">
        {loading && <p className="text-sm text-muted-foreground">Searching lecture moments...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading && results.length === 0 && !error && (
          <p className="text-sm text-muted-foreground">
            No results yet. Try asking about a concept from the lecture.
          </p>
        )}
        <ScrollArea className="h-full pr-2">
          <div className="space-y-3">
            {results.map((result) => (
              <button
                type="button"
                key={result.id}
                onClick={() => onJump(result.timestamp)}
                className="w-full rounded-md border p-3 text-left transition-colors hover:bg-muted/40"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{formatTimestamp(result.timestamp)}</span>
                  <span className="text-xs text-muted-foreground">
                    {(result.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{result.explanation}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
        {results.length > 0 && (
          <Button
            variant="secondary"
            className="mt-3 w-full"
            onClick={() => onJump(results[0]?.timestamp ?? 0)}
          >
            Jump to best match
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
