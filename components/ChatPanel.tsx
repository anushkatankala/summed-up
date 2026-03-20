"use client";

import { FormEvent, useState } from "react";
import { ArrowUp } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTimestamp } from "@/lib/utils";

type ChatPanelProps = {
  messages: ChatMessage[];
  onAsk: (question: string) => Promise<void> | void;
  onJump: (seconds: number) => void;
  loading?: boolean;
  error?: string | null;
};

export default function ChatPanel({ messages, onAsk, onJump, loading, error }: ChatPanelProps) {
  const [question, setQuestion] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim()) {
      return;
    }
    const next = question.trim();
    setQuestion("");
    await onAsk(next);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#0d0d14]">
      <div className="flex items-center gap-2 border-b border-[#1e1e2e] px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-[#00d4aa]" />
        <h3 className="text-sm font-medium text-white">Chat</h3>
        <span className="ml-auto text-xs text-[#52525e]">Ask anything about the lecture</span>
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 && (
          <p className="text-xs leading-relaxed text-[#52525e]">
            Ask questions like &quot;explain like I&apos;m 5&quot; or &quot;what was the key takeaway?&quot;
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="mt-0.5 mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[#00d4aa30] bg-[#00d4aa1a]">
                <span className="text-[10px] text-[#00d4aa]">AI</span>
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                message.role === "user"
                  ? "bg-[#00d4aa] font-medium text-black"
                  : "border border-[#1e1e2e] bg-[#16161f] text-[#f0f0f5]"
              }`}
            >
              {message.content}
              {message.references && message.references.length > 0 && (
                <div className="mt-1.5 space-y-0.5">
                  {message.references.map((ref, idx) => (
                    <button
                      type="button"
                      key={`${message.id}-${idx}`}
                      onClick={() => onJump(ref.timestamp)}
                      className="block text-left text-xs text-[#00d4aa] hover:underline"
                    >
                      → {ref.label || formatTimestamp(ref.timestamp)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </ScrollArea>

      <div className="border-t border-[#1e1e2e] p-3">
        {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
        <form onSubmit={submit} className="flex gap-2">
          <Input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about this lecture..."
            className="h-9 flex-1 border-[#1e1e2e] bg-[#111118] text-xs text-white placeholder:text-[#52525e]"
          />
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="h-9 w-9 flex-shrink-0 bg-[#00d4aa] p-0 text-black hover:bg-[#00c49a]"
          >
            {loading ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#0a0a0f] border-t-transparent" />
            ) : (
              <ArrowUp className="h-3.5 w-3.5" />
            )}
          </Button>
        </form>
        <p className="mt-1.5 text-[10px] text-[#52525e]">Answers are grounded in lecture content</p>
      </div>
    </div>
  );
}
