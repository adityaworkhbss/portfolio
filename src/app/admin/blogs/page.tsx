"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { getBlogs, deleteBlog, updateBlog } from "@/lib/firebase/firestore";
import { formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { Blog } from "@/lib/types";
import toast from "react-hot-toast";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    const data = await getBlogs(false);
    setBlogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      await deleteBlog(id);
      toast.success("Blog deleted");
      fetchBlogs();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const togglePublish = async (blog: Blog) => {
    try {
      await updateBlog(blog.id, { published: !blog.published });
      toast.success(blog.published ? "Unpublished" : "Published");
      fetchBlogs();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
        <Link href="/admin/blogs/new">
          <Button variant="primary" size="sm">
            <Plus size={16} />
            New Post
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p>No blog posts yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-white truncate">{blog.title}</h3>
                  <Badge variant={blog.published ? "active" : "default"}>
                    {blog.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>{blog.createdAt ? formatDate(blog.createdAt) : ""}</span>
                  <span>{blog.readingTime} min read</span>
                  {blog.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-zinc-600">#{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => togglePublish(blog)}
                  className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  title={blog.published ? "Unpublish" : "Publish"}
                >
                  {blog.published ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <Link
                  href={`/admin/blogs/${blog.id}`}
                  className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Edit size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
