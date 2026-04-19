"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Briefcase, User, History, Send, BookOpen, FileText } from "lucide-react";
import {
  GithubIcon as Github,
  LinkedinIcon as Linkedin,
  TwitterIcon as Twitter,
} from "@/components/ui/Icons";
import type { About } from "@/lib/types";

const socialLinks = [
  { Icon: Github, href: "https://github.com", label: "GitHub" },
  { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { Icon: Twitter, href: "https://twitter.com", label: "Twitter / X" },
  { Icon: Mail, href: "mailto:hello@adityasharma.dev", label: "Email" },
];

const navColumns = [
  {
    title: "Index",
    links: [
      { label: "Work", href: "/#projects", icon: Briefcase },
      { label: "About", href: "/#about", icon: User },
      { label: "Experience", href: "/#experience", icon: History },
      { label: "Contact", href: "/#contact", icon: Send },
    ],
  },
  {
    title: "Pages",
    links: [
      { label: "Journal", href: "/blog", icon: BookOpen },
      { label: "Resume", href: "/#resume", icon: FileText },
    ],
  },
];

export default function Footer({ about }: { about?: About | null }) {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  const socialMap: Record<string, typeof Github> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    x: Twitter,
  };

  const dynamicSocials = about?.socialLinks?.length
    ? about.socialLinks
      .filter((s) => socialMap[s.platform.toLowerCase()])
      .map((s) => ({
        Icon: socialMap[s.platform.toLowerCase()],
        href: s.url,
        label: s.platform,
      }))
    : socialLinks;

  const email = about?.email || "hello@adityasharma.dev";

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative mt-24 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20 pt-20 pb-12">
        {/* Editorial top */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-6">
            <p className="eyebrow mb-6">Let&apos;s build</p>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl text-white">
              Have an idea?{" "}
              <span className="serif-italic text-[var(--accent)]">
                Let&apos;s ship it.
              </span>
            </h2>
            <a
              href={`mailto:${email}`}
              className="mt-6 inline-flex items-center gap-2 text-[15px] text-zinc-300 hover:text-white border-b border-white/20 hover:border-white pb-0.5 transition-colors"
            >
              {email}
              <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="md:col-span-6 grid grid-cols-2 gap-8">
            {navColumns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow mb-5">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-2 w-fit text-[14.5px] text-zinc-400 hover:text-white transition-colors"
                        >
                          <LinkIcon className="w-3.5 h-3.5 text-zinc-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]" />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 hairline" />

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] text-zinc-500">
              © {year} Aditya Gupta. All rights reserved.
            </p>
            <p className="mono text-[11px] text-zinc-600 tracking-wide flex items-center gap-1.5">
              Designed & built with love{" "}
              <span className="inline-block animate-heartbeat text-[13px] filter drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">
                💛
              </span>{" "}
              · Crafted in India
            </p>
          </div>

          <div className="flex items-center gap-2">
            {dynamicSocials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group relative inline-flex items-center justify-center w-9 h-9 rounded-full text-zinc-400 hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all duration-300 hover:-translate-y-1 hover:scale-110"
              >
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse-soft shadow-[0_0_15px_var(--accent-glow)] transition-opacity duration-300" />
                <Icon size={16} className="relative z-10 transition-transform duration-300 group-hover:rotate-[8deg]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
