"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getAbout, updateAbout } from "@/lib/firebase/firestore";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import ImageUploader from "@/components/admin/ImageUploader";
import type { About } from "@/lib/types";
import toast from "react-hot-toast";

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    tagline: "",
    bio: "",
    avatarUrl: "",
    resumeUrl: "",
    email: "",
    location: "",
    skills: "",
    socialLinks: "",
    stats: "",
    availabilityStatus: "green" as "green" | "orange" | "red",
    availabilityText: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const about = await getAbout();
        if (about) {
          setFormData({
            name: about.name || "",
            role: about.role || "",
            tagline: about.tagline || "",
            bio: about.bio || "",
            avatarUrl: about.avatarUrl || "",
            resumeUrl: about.resumeUrl || "",
            email: about.email || "",
            location: about.location || "",
            skills: about.skills
              ? about.skills.map((s) => `${s.category}: ${s.items.join(", ")}`).join("\n")
              : "",
            socialLinks: about.socialLinks
              ? about.socialLinks.map((s) => `${s.platform}: ${s.url}`).join("\n")
              : "",
            stats: about.stats
              ? about.stats.map((s) => `${s.value}: ${s.label}`).join("\n")
              : "",
            availabilityStatus: about.availabilityStatus || "green",
            availabilityText: about.availabilityText || "",
          });
        }
      } catch (error) {
        console.error("Error loading about:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Parse skills: "Category: skill1, skill2\nCategory2: skill3"
      const skills = formData.skills
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [category, items] = line.split(":").map((s) => s.trim());
          return {
            category: category || "",
            items: items ? items.split(",").map((i) => i.trim()).filter(Boolean) : [],
          };
        })
        .filter((s) => s.category && s.items.length > 0);

      // Parse social links: "Platform: url\nPlatform2: url2"
      const socialLinks = formData.socialLinks
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const colonIdx = line.indexOf(":");
          if (colonIdx === -1) return null;
          const platform = line.substring(0, colonIdx).trim();
          const url = line.substring(colonIdx + 1).trim();
          return { platform, url };
        })
        .filter(Boolean) as { platform: string; url: string }[];

      // Parse stats: "Value: Label\nValue2: Label2"
      const stats = formData.stats
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const colonIdx = line.indexOf(":");
          if (colonIdx === -1) return null;
          const value = line.substring(0, colonIdx).trim();
          const label = line.substring(colonIdx + 1).trim();
          return { value, label };
        })
        .filter(Boolean) as { value: string; label: string }[];

      const data: Partial<About> = {
        name: formData.name,
        role: formData.role,
        tagline: formData.tagline,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        resumeUrl: formData.resumeUrl,
        email: formData.email,
        location: formData.location,
        skills,
        socialLinks,
        stats,
        availabilityStatus: formData.availabilityStatus,
        availabilityText: formData.availabilityText,
      };

      await updateAbout(data);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">About / Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="about-name" label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input id="about-role" label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
        </div>

        <Input id="about-tagline" label="Tagline" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} />

        <Textarea id="about-bio" label="Bio" rows={4} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">Avatar</label>
          <ImageUploader
            value={formData.avatarUrl}
            onUpload={(url) => setFormData({ ...formData, avatarUrl: url })}
            folder="avatars"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="about-email" label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input id="about-location" label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">Availability Status</label>
            <select
              title="Availability Status"
              value={formData.availabilityStatus}
              onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as any })}
              className="w-full px-4 h-10 rounded-xl bg-white/[0.03] border border-white/10 text-white text-[14px] focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
            >
              <option value="green">Green (Completely Available)</option>
              <option value="orange">Orange (Accepting projects but in work)</option>
              <option value="red">Red (Not accepting projects)</option>
            </select>
          </div>
          <Input id="about-availability-text" label="Availability Banner Text" value={formData.availabilityText} onChange={(e) => setFormData({ ...formData, availabilityText: e.target.value })} />
        </div>

        <Input 
          id="about-resume" 
          label="Resume Link (e.g. drive or cloudinary link)" 
          value={formData.resumeUrl} 
          onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })} 
        />

        <Textarea
          id="about-skills"
          label="Skills (format: Category: skill1, skill2 — one per line)"
          placeholder={"Mobile: React Native, Flutter, Swift\nFrontend: React, Next.js, TypeScript\nBackend: Node.js, Firebase, PostgreSQL"}
          rows={5}
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          className="font-mono text-xs"
        />

        <Textarea
          id="about-socials"
          label="Social Links (format: Platform: url — one per line)"
          placeholder={"GitHub: https://github.com/username\nLinkedIn: https://linkedin.com/in/username\nTwitter: https://twitter.com/username"}
          rows={4}
          value={formData.socialLinks}
          onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })}
          className="font-mono text-xs"
        />

        <Textarea
          id="about-stats"
          label="Stats (format: Value: Label — one per line)"
          placeholder={"5+: Years building\n30+: Apps shipped\n12: Happy clients"}
          rows={4}
          value={formData.stats}
          onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
          className="font-mono text-xs"
        />

        <Button type="submit" variant="primary" disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
