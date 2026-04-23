"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Briefcase,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "About", href: "/admin/about", icon: User },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/admin/login");
  };

  return (
    <aside className="w-[260px] min-h-screen bg-zinc-950 border-r border-white/5 p-4 hidden md:flex flex-col">
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all duration-200",
              pathname === item.href
                ? "bg-white/5 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-200 cursor-pointer"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </aside>
  );
}
