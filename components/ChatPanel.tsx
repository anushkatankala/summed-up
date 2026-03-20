"use client";

import { FormEvent, useState } from "react";
import { ChatMessage } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Chat with Lecture</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[680px] flex-col gap-3">
        <ScrollArea className="flex-1 rounded-md border p-3">
          <div className="space-y-3">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Ask questions like &quot;explain like I&apos;m 5&quot; or &quot;what was the key takeaway?&quot;
              </p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-md p-3 text-sm ${
                  message.role === "user" ? "bg-muted" : "border bg-background"
                }`}
              >
                <p className="mb-1 font-medium">{message.role === "user" ? "You" : "Tutor"}</p>
                <p>{message.content}</p>
                {message.references && message.references.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.references.map((ref, idx) => (
                      <Button
                        key={`${message.id}-${idx}`}
                        size="sm"
                        variant="secondary"
                        onClick={() => onJump(ref.timestamp)}
                      >
                        {ref.label || formatTimestamp(ref.timestamp)}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <form onSubmit={submit} className="flex gap-2">
          <Input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about this lecture..."
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
