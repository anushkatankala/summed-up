"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const localPreviewUrl = useMemo(() => {
    if (!file) {
      return "";
    }
    return URL.createObjectURL(file);
  }, [file]);

  const submit = async () => {
    setError(null);
    setSuccess(null);

    if (!youtubeUrl.trim() && !file) {
      setError("Please provide either a YouTube URL or upload a local video file.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeUrl: youtubeUrl.trim() || undefined,
          fileName: file?.name,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        index_id?: string;
        title?: string;
      };
      if (!response.ok || !data.index_id) {
        throw new Error(data.error || "Indexing failed");
      }

      localStorage.setItem(
        "summed-up-session",
        JSON.stringify({
          indexId: data.index_id,
          lectureTitle: data.title || file?.name || "Lecture",
          videoUrl: youtubeUrl.trim() || localPreviewUrl,
        }),
      );

      setSuccess("Lecture indexed. Open dashboard to search and chat.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload or Link Lecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">YouTube URL</p>
            <Input
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Or upload file (MVP stores local preview URL)</p>
            <Input
              type="file"
              accept="video/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">{success}</p>}
          <div className="flex gap-2">
            <Button onClick={submit} disabled={loading}>
              {loading ? "Indexing..." : "Index Lecture"}
            </Button>
            <Link href="/">
              <Button variant="secondary">Go to Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
