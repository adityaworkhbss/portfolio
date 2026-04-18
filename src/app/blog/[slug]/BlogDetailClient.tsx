"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ShareButtons from "@/components/blog/ShareButtons";
import type { Blog } from "@/lib/types";

interface BlogDetailClientProps {
  blog: Blog;
}

export default function BlogDetailClient({ blog }: BlogDetailClientProps) {
  return (
    <>
      <ReadingProgress />

      <div className="mx-auto max-w-3xl px-6">
        <div className="prose-blog">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {blog.content}
          </ReactMarkdown>
        </div>

        <div className="mt-20 pt-8 border-t border-white/[0.06] flex items-center justify-between">
          <ShareButtons title={blog.title} slug={blog.slug} />
        </div>
      </div>
    </>
  );
}
