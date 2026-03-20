# Summed Up

AI-powered lecture exploration MVP.

Users can upload or link a lecture video, search semantically, chat with lecture context, add timestamped notes, generate highlights, and export learning notes to Notion.

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn-style UI components
- Next.js API routes (`pages/api`)
- Twelve Labs API (index/search/highlights)
- OpenAI API (chat answers)
- Notion API (export)
- `react-player` for playback

## Run Locally

1) Install dependencies:

```bash
npm install
```

2) Create env file:

```bash
copy .env.example .env.local
```

3) Set environment variables in `.env.local`:

```env
TWELVE_LABS_API_KEY=...
OPENAI_API_KEY=...
NOTION_API_KEY=...
NOTION_DATABASE_ID=...
```

4) Start dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Mock Fallback Behavior

If keys are missing, the app still works in mock mode:

- `/api/search` returns mocked semantic moments
- `/api/chat` returns mocked tutor response + references
- `/api/highlights` returns mocked key moments
- `/api/notion` returns a mock Notion URL

This keeps the MVP fully usable without external API setup.

## Project Structure

```text
app/
  page.tsx
  upload/page.tsx
components/
  VideoPlayer.tsx
  SearchBar.tsx
  ResultsList.tsx
  ChatPanel.tsx
  NotesPanel.tsx
  HighlightsPanel.tsx
  ui/
lib/
  twelvelabs.ts
  openai.ts
  notion.ts
  store.ts
pages/api/
  index.ts
  search.ts
  highlights.ts
  chat.ts
  notes.ts
  notion.ts
```

## Example API Responses

### `POST /api/index`

```json
{
  "ok": true,
  "index_id": "mock-index-1710958849000",
  "title": "https://www.youtube.com/watch?v=demo",
  "mocked": true
}
```

### `POST /api/search`

```json
{
  "query": "what is backpropagation?",
  "results": [
    {
      "id": "mock-1",
      "timestamp": 42,
      "explanation": "Found a likely explanation related to \"what is backpropagation?\".",
      "confidence": 0.92
    }
  ]
}
```

### `POST /api/highlights`

```json
{
  "highlights": [
    {
      "id": "h-1",
      "title": "Core Definition",
      "start": 55,
      "end": 110,
      "summary": "Introduces the foundational concept used throughout the lecture."
    }
  ]
}
```

### `POST /api/chat`

```json
{
  "answer": "Mock mode: based on the retrieved lecture segments, this topic is explained in simple terms with a practical example.",
  "references": [
    { "label": "~42s", "timestamp": 42 }
  ],
  "mocked": true
}
```

### `POST /api/notes`

```json
{
  "note": {
    "id": "note-1710959917000",
    "timestamp": 250.4,
    "text": "Great explanation of gradient descent intuition",
    "createdAt": "2026-03-20T18:24:00.000Z"
  }
}
```

### `POST /api/notion`

```json
{
  "ok": true,
  "mocked": true,
  "notionPageId": "mock-notion-page-1710959960000",
  "url": "https://www.notion.so/mock-summed-up-export"
}
```
