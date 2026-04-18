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
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "About", href: "/admin/about", icon: User },
];

export default function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950 border-b border-white/10 px-4 sm:px-6">
      <div className="flex h-16 items-center justify-between">
        <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar mask-gradient-right pb-1 sm:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 sm:py-2 text-[13.5px] font-medium rounded-xl sm:rounded-lg transition-all duration-200 whitespace-nowrap",
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="flex flex-shrink-0 items-center justify-center gap-2 px-3 py-2 text-[13.5px] font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 cursor-pointer ml-4"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
