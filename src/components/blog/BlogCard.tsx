"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Blog } from "@/lib/types";

interface BlogCardProps {
  blog: Blog;
  index?: number;
}

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group block animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <article className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0d0f] hover:border-white/[0.14] transition-colors duration-300">
        {blog.coverImage ? (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ) : (
          <div className="aspect-[16/10] bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center">
            <span className="display text-7xl text-white/[0.06]">
              {blog.title.charAt(0)}
            </span>
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 mono text-[10.5px] uppercase tracking-[0.12em] text-zinc-500 mb-3">
            {blog.tags.slice(0, 2).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
            {blog.tags.length > 0 && <span className="text-zinc-700">·</span>}
            <span className="inline-flex items-center gap-1.5">
              <Clock size={11} />
              {blog.readingTime} min
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-medium text-white tracking-tight leading-snug group-hover:text-[var(--accent-bright)] transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="mt-3 text-[14px] text-zinc-400 leading-relaxed line-clamp-2">
            {blog.excerpt}
          </p>

          <p className="mt-5 mono text-[11px] text-zinc-600">
            {blog.createdAt ? formatDate(blog.createdAt) : ""}
          </p>
        </div>
      </article>
    </Link>
  );
}
