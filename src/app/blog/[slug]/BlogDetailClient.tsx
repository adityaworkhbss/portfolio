"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ShareButtons from "@/components/blog/ShareButtons";
import Mermaid from "@/components/blog/Mermaid";
import { incrementBlogViews } from "@/lib/firebase/firestore";
import type { Blog } from "@/lib/types";

interface BlogDetailClientProps {
  blog: Blog;
}

export default function BlogDetailClient({ blog }: BlogDetailClientProps) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!hasIncremented.current) {
      incrementBlogViews(blog.id);
      hasIncremented.current = true;
    }
  }, [blog.id]);

  return (
    <>
      <ReadingProgress />

      <div className="mx-auto max-w-3xl px-6">
        <div className="prose-blog">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }], rehypeRaw]}
            components={{
              code(props: any) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : null;

                if (language === "mermaid") {
                  return <Mermaid chart={String(children).replace(/\n$/, "")} />;
                }

                return (
                  <code className={className} {...rest}>
                    {children}
                  </code>
                );
              },
            }}
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
