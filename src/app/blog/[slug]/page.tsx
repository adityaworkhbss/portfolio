import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getBlogBySlug, getBlogs } from "@/lib/firebase/firestore";
import { formatDate } from "@/lib/utils";
import BlogDetailClient from "./BlogDetailClient";
import type { Metadata } from "next";

export const revalidate = 3600;

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Blog Not Found" };

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.createdAt,
      tags: blog.tags,
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const blogs = await getBlogs();
    return blogs.map((blog) => ({ slug: blog.slug }));
  } catch {
    return [];
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  return (
    <div className="min-h-screen pt-32 sm:pt-36 pb-24">
      <BlogDetailClient blog={blog} />

      <article className="mx-auto max-w-3xl px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 mono text-[11.5px] tracking-wide uppercase text-zinc-500 hover:text-white mb-12 transition-colors"
        >
          <ArrowLeft size={13} />
          Back to journal
        </Link>

        <header className="mb-12">
          <div className="flex flex-wrap gap-1.5 mb-6">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="mono text-[10.5px] uppercase tracking-[0.12em] text-zinc-500 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="display text-4xl sm:text-5xl md:text-6xl text-white leading-[1.05]">
            {blog.title}
          </h1>

          <div className="mt-8 flex items-center gap-5 mono text-[11.5px] uppercase tracking-wide text-zinc-500">
            <span className="inline-flex items-center gap-2">
              <Calendar size={12} />
              {blog.createdAt ? formatDate(blog.createdAt) : ""}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock size={12} />
              {blog.readingTime} min read
            </span>
          </div>

          {blog.coverImage && (
            <div className="relative aspect-[2/1] rounded-2xl overflow-hidden border border-white/[0.06] mt-10 bg-[#0c0d0f]">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                priority
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </header>

        <div className="hairline mb-12" />
      </article>
    </div>
  );
}
