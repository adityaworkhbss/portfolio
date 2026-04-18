"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/admin/ImageUploader";
import { createProject, updateProject } from "@/lib/firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Project } from "@/lib/types";
import toast from "react-hot-toast";

interface ProjectActionPageProps {
  params: Promise<{ action: string }>;
}

export default function ProjectActionPage({ params: paramsPromise }: ProjectActionPageProps) {
  const params = use(paramsPromise);
  const router = useRouter();
  const isNew = params.action === "new";
  const projectId = isNew ? null : params.action;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    coverImage: "",
    techStack: "",
    liveUrl: "",
    githubUrl: "",
    order: 0,
    featured: false,
  });

  useEffect(() => {
    if (!isNew && projectId) {
      loadProject(projectId);
    }
  }, [isNew, projectId]);

  const loadProject = async (id: string) => {
    try {
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Project;
        setFormData({
          title: data.title,
          description: data.description,
          longDescription: data.longDescription || "",
          coverImage: data.coverImage || "",
          techStack: data.techStack.join(", "),
          liveUrl: data.liveUrl || "",
          githubUrl: data.githubUrl || "",
          order: data.order || 0,
          featured: data.featured || false,
        });
      }
    } catch (error) {
      console.error("Error loading project:", error);
      toast.error("Failed to load project");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      const techStack = formData.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const projectData = {
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription,
        coverImage: formData.coverImage,
        images: [],
        techStack,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        order: formData.order,
        featured: formData.featured,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (isNew) {
        await createProject(projectData);
        toast.success("Project created!");
      } else if (projectId) {
        await updateProject(projectId, projectData);
        toast.success("Project updated!");
      }

      router.push("/admin/projects");
    } catch {
      toast.error("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Projects
      </Link>

      <h1 className="text-2xl font-bold text-white mb-8">
        {isNew ? "New Project" : "Edit Project"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <Input
          id="project-title"
          label="Title"
          placeholder="My Awesome Project"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <Textarea
          id="project-description"
          label="Short Description"
          placeholder="A brief description of the project..."
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <Textarea
          id="project-long-description"
          label="Full Description"
          placeholder="Detailed description of the project..."
          rows={8}
          value={formData.longDescription}
          onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">Cover Image</label>
          <ImageUploader
            value={formData.coverImage}
            onUpload={(url) => setFormData({ ...formData, coverImage: url })}
            folder="project-covers"
          />
        </div>

        <Input
          id="project-tech"
          label="Tech Stack (comma separated)"
          placeholder="React Native, Firebase, TypeScript"
          value={formData.techStack}
          onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="project-live"
            label="Live URL"
            placeholder="https://..."
            value={formData.liveUrl}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
          />
          <Input
            id="project-github"
            label="GitHub URL"
            placeholder="https://github.com/..."
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
          />
        </div>

        <Input
          id="project-order"
          label="Display Order"
          type="number"
          value={String(formData.order)}
          onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500/30"
          />
          <span className="text-sm text-zinc-300">Featured project</span>
        </label>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" disabled={loading}>
            <Save size={16} />
            {loading ? "Saving..." : isNew ? "Create Project" : "Update Project"}
          </Button>
          <Link href="/admin/projects">
            <Button type="button" variant="ghost">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
