"use client";

import { Highlight } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Highlights</CardTitle>
        <Button size="sm" onClick={onGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Highlights"}
        </Button>
      </CardHeader>
      <CardContent className="h-[220px]">
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading && highlights.length === 0 && !error && (
          <p className="text-sm text-muted-foreground">
            Generate key moments to quickly review important parts.
          </p>
        )}
        <ScrollArea className="h-full pr-2">
          <div className="space-y-3">
            {highlights.map((highlight) => (
              <button
                type="button"
                key={highlight.id}
                onClick={() => onJump(highlight.start)}
                className="w-full rounded-md border p-3 text-left hover:bg-muted/40"
              >
                <p className="font-medium">{highlight.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(highlight.start)} - {formatTimestamp(highlight.end)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{highlight.summary}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
