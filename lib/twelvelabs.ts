import { Highlight, SearchResult } from "@/lib/types";

const API_BASE = "https://api.twelvelabs.io/v1.3";

function hasApiKey() {
  return Boolean(process.env.TWELVE_LABS_API_KEY);
}

function toSeconds(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function mockSearch(query: string): SearchResult[] {
  return [
    {
      id: "mock-1",
      timestamp: 42,
      explanation: `Found a likely explanation related to "${query}".`,
      confidence: 0.92,
    },
    {
      id: "mock-2",
      timestamp: 188,
      explanation: "This part looks like a concrete example from the lecture.",
      confidence: 0.86,
    },
    {
      id: "mock-3",
      timestamp: 402,
      explanation: "Potential recap moment that reinforces the main point.",
      confidence: 0.79,
    },
  ];
}

export async function indexLectureVideo(input: {
  youtubeUrl?: string;
  fileName?: string;
}) {
  if (!hasApiKey()) {
    return {
      indexId: `mock-index-${Date.now()}`,
      title: input.youtubeUrl ?? input.fileName ?? "Mock Lecture",
      mocked: true,
    };
  }

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.TWELVE_LABS_API_KEY ?? "",
  };

  const response = await fetch(`${API_BASE}/indexes`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      index_name: "summed-up-lecture-index",
      models: [{ model_name: "pegasus1.2", model_options: ["visual", "conversation"] }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Twelve Labs index creation failed: ${response.statusText}`);
  }

  const data = (await response.json()) as { _id?: string };
  const indexId = data._id;
  if (!indexId) {
    throw new Error("Twelve Labs index_id missing from response.");
  }

  return {
    indexId,
    title: input.youtubeUrl ?? input.fileName ?? "Lecture",
    mocked: false,
  };
}

export async function semanticSearchLecture(input: {
  indexId: string;
  query: string;
}): Promise<SearchResult[]> {
  if (!hasApiKey()) {
    return mockSearch(input.query);
  }

  const response = await fetch(`${API_BASE}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.TWELVE_LABS_API_KEY ?? "",
    },
    body: JSON.stringify({
      index_id: input.indexId,
      query_text: input.query,
      search_options: ["visual", "conversation"],
      group_by: "clip",
    }),
  });

  if (!response.ok) {
    throw new Error(`Twelve Labs search failed: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    data?: Array<{
      id?: string;
      score?: number;
      start?: number;
      end?: number;
      confidence?: number;
      text?: string;
      transcription?: string;
    }>;
  };

  return (data.data ?? []).slice(0, 8).map((item, idx) => ({
    id: item.id ?? `result-${idx}`,
    timestamp: toSeconds(item.start),
    explanation:
      item.text ??
      item.transcription ??
      `Relevant lecture segment for "${input.query}".`,
    confidence: Number(item.confidence ?? item.score ?? 0.7),
  }));
}

export async function generateLectureHighlights(indexId: string): Promise<Highlight[]> {
  if (!hasApiKey()) {
    return [
      {
        id: "h-1",
        title: "Core Definition",
        start: 55,
        end: 110,
        summary: "Introduces the foundational concept used throughout the lecture.",
      },
      {
        id: "h-2",
        title: "Worked Example",
        start: 190,
        end: 265,
        summary: "Shows a practical example and step-by-step reasoning.",
      },
      {
        id: "h-3",
        title: "Final Recap",
        start: 510,
        end: 590,
        summary: "Wraps up key takeaways and how to apply them.",
      },
    ];
  }

  const queries = ["important concept", "definition", "example explanation"];
  const results = await Promise.all(
    queries.map((query) => semanticSearchLecture({ indexId, query })),
  );

  return results
    .map((items, idx) => {
      const first = items[0];
      if (!first) {
        return null;
      }
      return {
        id: `highlight-${idx}`,
        title: queries[idx],
        start: Math.max(0, first.timestamp),
        end: Math.max(first.timestamp + 45, first.timestamp),
        summary: first.explanation,
      } satisfies Highlight;
    })
    .filter((item): item is Highlight => Boolean(item));
}
