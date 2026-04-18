"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getExperiences, deleteExperience, createExperience, updateExperience } from "@/lib/firebase/firestore";
import { formatDateShort } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import type { Experience } from "@/lib/types";
import toast from "react-hot-toast";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false,
    techStack: "",
    order: 0,
  });

  const fetchExperiences = async () => {
    setLoading(true);
    const data = await getExperiences();
    setExperiences(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const resetForm = () => {
    setFormData({ company: "", role: "", description: "", startDate: "", endDate: "", current: false, techStack: "", order: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (exp: Experience) => {
    setEditing(exp);
    setFormData({
      company: exp.company,
      role: exp.role,
      description: exp.description,
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      current: exp.current,
      techStack: exp.techStack.join(", "),
      order: exp.order,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.role) {
      toast.error("Company and role are required");
      return;
    }

    try {
      const techStack = formData.techStack.split(",").map((t) => t.trim()).filter(Boolean);
      const data = {
        company: formData.company,
        role: formData.role,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.current ? "" : formData.endDate,
        current: formData.current,
        techStack,
        order: formData.order,
      };

      if (editing) {
        await updateExperience(editing.id, data);
        toast.success("Experience updated!");
      } else {
        await createExperience(data as Omit<Experience, "id">);
        toast.success("Experience created!");
      }
      resetForm();
      fetchExperiences();
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await deleteExperience(id);
      toast.success("Deleted");
      fetchExperiences();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Experience</h1>
        <Button variant="primary" size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={16} />
          Add
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4 max-w-2xl">
          <h2 className="text-lg font-semibold text-white">{editing ? "Edit" : "New"} Experience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="exp-company" label="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            <Input id="exp-role" label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
          </div>
          <Textarea id="exp-desc" label="Description" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input id="exp-start" label="Start Date" placeholder="2023-01" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
            <Input id="exp-end" label="End Date" placeholder="2024-06" value={formData.endDate} disabled={formData.current} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.current} onChange={(e) => setFormData({ ...formData, current: e.target.checked })} className="rounded border-white/10 bg-white/5" />
                <span className="text-sm text-zinc-300">Current</span>
              </label>
            </div>
          </div>
          <Input id="exp-tech" label="Tech Stack (comma separated)" value={formData.techStack} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} />
          <Input id="exp-order" label="Order" type="number" value={String(formData.order)} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} />
          <div className="flex gap-3">
            <Button type="submit" variant="primary" size="sm">{editing ? "Update" : "Create"}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <p className="text-center py-20 text-zinc-500">No experiences yet.</p>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div key={exp.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="text-sm font-medium text-white">{exp.role}</h3>
                <p className="text-xs text-blue-400">{exp.company}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {formatDateShort(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDateShort(exp.endDate) : ""}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(exp)} className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"><Edit size={16} /></button>
                <button onClick={() => handleDelete(exp.id)} className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors cursor-pointer"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
