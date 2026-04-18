"use client";

import { cn } from "@/lib/utils";

interface BlogTagFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

const baseChip =
  "mono text-[11px] tracking-wide uppercase px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer";

export default function BlogTagFilter({
  tags,
  activeTag,
  onTagSelect,
}: BlogTagFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onTagSelect(null)}
        className={cn(
          baseChip,
          activeTag === null
            ? "bg-[var(--accent)] text-zinc-950"
            : "bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:text-white hover:border-white/15",
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag === activeTag ? null : tag)}
          className={cn(
            baseChip,
            tag === activeTag
              ? "bg-[var(--accent)] text-zinc-950"
              : "bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:text-white hover:border-white/15",
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
