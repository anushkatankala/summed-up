import { Client } from "@notionhq/client";
import { Highlight, Note } from "@/lib/types";

function hasNotionConfig() {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);
}

export async function exportLectureToNotion(input: {
  title: string;
  highlights: Highlight[];
  notes: Note[];
}) {
  if (!hasNotionConfig()) {
    return {
      mocked: true,
      notionPageId: `mock-notion-page-${Date.now()}`,
      url: "https://www.notion.so/mock-summed-up-export",
    };
  }

  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  const children: any[] = [
    {
      object: "block" as const,
      type: "heading_2" as const,
      heading_2: {
        rich_text: [{ type: "text" as const, text: { content: "Highlights" } }],
      },
    },
    ...input.highlights.map((highlight) => ({
      object: "block" as const,
      type: "bulleted_list_item" as const,
      bulleted_list_item: {
        rich_text: [
          {
            type: "text" as const,
            text: {
              content: `${highlight.title} (${Math.floor(highlight.start)}s - ${Math.floor(highlight.end)}s): ${highlight.summary}`,
            },
          },
        ],
      },
    })),
    {
      object: "block" as const,
      type: "heading_2" as const,
      heading_2: {
        rich_text: [{ type: "text" as const, text: { content: "Notes" } }],
      },
    },
    ...input.notes.map((note) => ({
      object: "block" as const,
      type: "bulleted_list_item" as const,
      bulleted_list_item: {
        rich_text: [
          {
            type: "text" as const,
            text: {
              content: `[${Math.floor(note.timestamp)}s] ${note.text}`,
            },
          },
        ],
      },
    })),
  ];

  const page = await notion.pages.create({
    parent: { database_id: process.env.NOTION_DATABASE_ID ?? "" },
    properties: {
      Name: {
        title: [{ text: { content: input.title || "Summed Up Lecture Export" } }],
      },
    },
    children,
  });

  return {
    mocked: false,
    notionPageId: page.id,
    url: "url" in page ? page.url : "",
  };
}
