"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  onSearch: (query: string) => Promise<void> | void;
  loading?: boolean;
};

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }
    await onSearch(query.trim());
  };

  return (
    <form onSubmit={submit} className="relative">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search the lecture... e.g. 'what is backpropagation'"
        className="h-10 border-[#1e1e2e] bg-[#111118] pr-20 text-sm text-white placeholder:text-[#52525e]"
      />
      <Button
        type="submit"
        disabled={loading}
        variant="ghost"
        className="absolute top-1/2 right-1 h-8 -translate-y-1/2 px-2 text-[#00d4aa] hover:bg-transparent hover:text-white"
      >
        {loading ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#00d4aa] border-t-transparent" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
