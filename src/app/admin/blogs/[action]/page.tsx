"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/admin/ImageUploader";
import { createBlog, updateBlog, getBlogBySlug } from "@/lib/firebase/firestore";
import { generateSlug, calculateReadingTime } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Blog } from "@/lib/types";
import toast from "react-hot-toast";

interface BlogActionPageProps {
  params: Promise<{ action: string }>;
}

export default function BlogActionPage({ params: paramsPromise }: BlogActionPageProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const isNew = params.action === "new";
  const blogId = isNew ? null : params.action;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "",
    published: false,
  });

  useEffect(() => {
    if (!isNew && blogId) {
      loadBlog(blogId);
    }
  }, [isNew, blogId]);

  const loadBlog = async (id: string) => {
    try {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Blog;
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          coverImage: data.coverImage || "",
          tags: data.tags.join(", "),
          published: data.published,
        });
      }
    } catch (error) {
      console.error("Error loading blog:", error);
      toast.error("Failed to load blog");
    }
  };

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: isNew ? generateSlug(value) : formData.slug,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);
    try {
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const blogData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt || formData.content.substring(0, 160),
        content: formData.content,
        coverImage: formData.coverImage,
        tags,
        published: formData.published,
        readingTime: calculateReadingTime(formData.content),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (isNew) {
        await createBlog(blogData);
        toast.success("Blog created!");
      } else if (blogId) {
        await updateBlog(blogId, blogData);
        toast.success("Blog updated!");
      }

      router.push("/admin/blogs");
    } catch {
      toast.error("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/blogs"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Blogs
      </Link>

      <h1 className="text-2xl font-bold text-white mb-8">
        {isNew ? "New Blog Post" : "Edit Blog Post"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <Input
          id="blog-title"
          label="Title"
          placeholder="My Awesome Blog Post"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />

        <Input
          id="blog-slug"
          label="Slug"
          placeholder="my-awesome-blog-post"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        />

        <Textarea
          id="blog-excerpt"
          label="Excerpt"
          placeholder="A short summary of the post..."
          rows={2}
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">Cover Image</label>
          <ImageUploader
            value={formData.coverImage}
            onUpload={(url) => setFormData({ ...formData, coverImage: url })}
            folder="blog-covers"
          />
        </div>

        <Input
          id="blog-tags"
          label="Tags (comma separated)"
          placeholder="react, mobile, typescript"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />

        <Textarea
          id="blog-content"
          label="Content (Markdown)"
          placeholder="Write your blog post in Markdown..."
          rows={20}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="font-mono text-xs"
        />

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) =>
                setFormData({ ...formData, published: e.target.checked })
              }
              className="rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500/30"
            />
            <span className="text-sm text-zinc-300">Publish immediately</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" disabled={loading}>
            <Save size={16} />
            {loading ? "Saving..." : isNew ? "Create Post" : "Update Post"}
          </Button>
          <Link href="/admin/blogs">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
