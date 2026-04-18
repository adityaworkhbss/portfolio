"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import BlogCard from "@/components/blog/BlogCard";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogTagFilter from "@/components/blog/BlogTagFilter";
import { BlogCardSkeleton } from "@/components/ui/SkeletonLoader";
import PageTransition from "@/components/layout/PageTransition";
import { getBlogs } from "@/lib/firebase/firestore";
import type { Blog } from "@/lib/types";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filtered, setFiltered] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await getBlogs();
        setBlogs(data);
        setFiltered(data);
        // Extract unique tags
        const tags = Array.from(new Set(data.flatMap((b) => b.tags)));
        setAllTags(tags);
      } catch (error) {
        console.error("Error loading blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = blogs;

    if (searchQuery) {
      result = result.filter((b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTag) {
      result = result.filter((b) => b.tags.includes(activeTag));
    }

    setFiltered(result);
  }, [searchQuery, activeTag, blogs]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-36 pb-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-14 sm:mb-20"
          >
            <p className="eyebrow mb-6">Journal</p>
            <h1 className="display text-5xl sm:text-6xl md:text-7xl text-white max-w-3xl leading-[1.02]">
              Notes from the{" "}
              <span className="serif-italic text-[var(--accent)]">workshop</span>.
            </h1>
            <p className="mt-6 text-[16px] text-zinc-400 max-w-2xl leading-relaxed">
              Thoughts on mobile development, software engineering, and the craft
              of building great products.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4 mb-10"
          >
            <BlogSearch onSearch={handleSearch} />
            {allTags.length > 0 && (
              <BlogTagFilter
                tags={allTags}
                activeTag={activeTag}
                onTagSelect={setActiveTag}
              />
            )}
          </motion.div>

          {/* Blog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-zinc-500 text-lg">
                {searchQuery || activeTag
                  ? "No articles match your search."
                  : "No blog posts yet. Check back soon!"}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((blog, idx) => (
                <BlogCard key={blog.id} blog={blog} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
