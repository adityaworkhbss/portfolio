"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface BlogSearchProps {
  onSearch: (query: string) => void;
}

export default function BlogSearch({ onSearch }: BlogSearchProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 250);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles…"
        className="w-full pl-7 pr-4 py-3 text-[15px] text-white bg-transparent border-0 border-b border-white/10 placeholder:text-zinc-500 focus:outline-none focus:border-[var(--accent)] transition-colors"
      />
    </div>
  );
}
