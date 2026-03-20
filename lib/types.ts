export type SearchResult = {
  id: string;
  timestamp: number;
  explanation: string;
  confidence: number;
};

export type Highlight = {
  id: string;
  title: string;
  start: number;
  end: number;
  summary: string;
};

export type Note = {
  id: string;
  timestamp: number;
  text: string;
  createdAt: string;
};

export type ChatReference = {
  label: string;
  timestamp: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  references?: ChatReference[];
};
