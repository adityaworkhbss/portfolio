"use client";

import { useEffect, useState } from "react";
import { FileText, FolderOpen, Briefcase, MessageSquare } from "lucide-react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Link from "next/link";

interface StatCard {
  label: string;
  count: number;
  icon: React.ElementType;
  href: string;
  color: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const collections = [
          { name: "blogs", label: "Blog Posts", icon: FileText, href: "/admin/blogs", color: "blue" },
          { name: "projects", label: "Projects", icon: FolderOpen, href: "/admin/projects", color: "violet" },
          { name: "experiences", label: "Experiences", icon: Briefcase, href: "/admin/experience", color: "emerald" },
          { name: "messages", label: "Messages", icon: MessageSquare, href: "/admin", color: "amber" },
        ];

        const results = await Promise.all(
          collections.map(async (col) => {
            try {
              const snapshot = await getCountFromServer(collection(db, col.name));
              return { ...col, count: snapshot.data().count };
            } catch {
              return { ...col, count: 0 };
            }
          })
        );

        setStats(results);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const colorMap: Record<string, string> = {
    blue: "from-blue-500/10 to-blue-500/5 border-blue-500/10 text-blue-400",
    violet: "from-violet-500/10 to-violet-500/5 border-violet-500/10 text-violet-400",
    emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/10 text-emerald-400",
    amber: "from-amber-500/10 to-amber-500/5 border-amber-500/10 text-amber-400",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
            ))
          : stats.map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <div
                  className={`p-5 rounded-2xl bg-gradient-to-br ${colorMap[stat.color]} border hover:scale-[1.02] transition-transform duration-200`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon size={20} />
                    <span className="text-2xl font-bold text-white">{stat.count}</span>
                  </div>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
