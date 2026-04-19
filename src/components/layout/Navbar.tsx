"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import Button from "@/components/ui/Button";

const sectionLinks = [
  { label: "Work", href: "#projects", id: "projects" },
  { label: "About", href: "#about", id: "about" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
];

const pageLinks = [{ label: "Journal", href: "/blog" }];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Active section observer for in-page anchors
  useEffect(() => {
    if (!isHome) return;
    const ids = sectionLinks.map((l) => l.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.1, 0.4, 0.7] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  const handleAnchor = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (isHome && href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-10 pt-4"
      >
        <nav
          className={cn(
            "mx-auto max-w-7xl flex items-center justify-between gap-3 px-4 sm:px-6 py-3 rounded-full border transition-all duration-300",
            scrolled
              ? "bg-[#0c0d0f]/80 backdrop-blur-xl border-white/[0.08] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]"
              : "bg-transparent border-transparent",
          )}
        >
          <Link
            href="/"
            className="group relative flex items-center transition-all duration-300"
          >
            <div className="relative flex items-center gap-1.5">
              <motion.div className="flex overflow-hidden">
                {"Aditya".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: i * 0.03 + 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[20px] sm:text-[22px] brand-text font-bold"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
              <div className="flex">
                {"Gupta".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: i * 0.03 + 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="serif-italic text-[22px] sm:text-[24px] text-[var(--accent)]"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6 bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-full px-3 py-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
            {isHome &&
                sectionLinks.map((link) => {
                  const active = activeSection === link.id;

                  return (
                      <a
                          key={link.href}
                          href={link.href}
                          onClick={(e) => handleAnchor(e, link.href)}
                          className={cn(
                              "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 group",
                              active
                                  ? "text-white"
                                  : "text-zinc-400 hover:text-white"
                          )}
                      >

                        {/* Glow effect */}
                        <span className="relative z-10 flex items-center gap-1">
                          {link.label}
                          <span className="w-3 h-1 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition" />
                          </span>
                      </a>
                  );
                })}
          </div>

          <Button
              asChild
              variant="secondary"
              size="sm"
              className="group hidden md:inline-flex bg-white text-zinc-950 hover:bg-[var(--accent)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-full px-10 min-w-[180px] justify-center font-bold shadow-[0_8px_20px_-8px_rgba(255,255,255,0.3)] hover:shadow-[0_8px_30px_-5px_var(--accent-glow)] border-none"
          >
            <a href="#contact" onClick={(e) => handleAnchor(e, "#contact")}>
              Get in touch
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute top-20 left-4 right-4 bg-[#0c0d0f] border border-white/[0.08] rounded-3xl p-3 shadow-2xl"
            >
              <div className="flex flex-col">
                {isHome &&
                  sectionLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleAnchor(e, link.href)}
                      className="px-4 py-3 text-[15px] text-zinc-200 hover:text-white hover:bg-white/[0.04] rounded-2xl transition-colors flex items-center justify-between"
                    >
                      <span>{link.label}</span>
                      <span className="mono text-[11px] text-zinc-500">
                        0{sectionLinks.indexOf(link) + 1}
                      </span>
                    </a>
                  ))}
                {pageLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 text-[15px] text-zinc-200 hover:text-white hover:bg-white/[0.04] rounded-2xl transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 hairline" />
                <Button
                  asChild
                  variant="secondary"
                  size="md"
                  className="mx-1 mt-1 mb-1 w-full justify-center rounded-xl"
                >
                  <a href="#contact" onClick={(e) => handleAnchor(e, "#contact")}>
                    Get in touch
                    <span className="ml-0.5 opacity-70">→</span>
                  </a>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
