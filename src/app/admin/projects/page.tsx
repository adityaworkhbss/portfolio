"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getProjects, deleteProject } from "@/lib/firebase/firestore";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { Project } from "@/lib/types";
import toast from "react-hot-toast";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      toast.success("Project deleted");
      fetchProjects();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <Link href="/admin/projects/new">
          <Button variant="primary" size="sm">
            <Plus size={16} />
            New Project
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p>No projects yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-white truncate">{project.title}</h3>
                  {project.featured && <Badge variant="active">Featured</Badge>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs text-zinc-600">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Edit size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
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
