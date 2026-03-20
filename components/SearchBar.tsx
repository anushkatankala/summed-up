"use client";

import { FormEvent, useState } from "react";
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
    <form onSubmit={submit} className="flex gap-2">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search lecture semantically (e.g. what is gradient descent?)"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
