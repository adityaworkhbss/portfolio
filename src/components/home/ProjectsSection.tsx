"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon as Github } from "@/components/ui/Icons";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

interface ProjectsSectionProps {
  projects: Project[];
}



// Bento span definitions — first card large, then alternating
const bentoSpans = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-12",
];

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const list = projects.slice(0, 5);

  if (list.length === 0) return null;

  return (
    <section
      id="projects"
      className="relative py-28 sm:py-36 border-t border-white/[0.05]"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <ScrollReveal>
          <div className="flex items-baseline justify-between mb-14 sm:mb-20">
            <p className="eyebrow">03 — Selected Work</p>
            <Button asChild variant="muted" size="sm" className="mono font-normal tracking-wide">
              <Link href="/#contact">
                /work-with-me
                <span className="opacity-70 transition group-hover:translate-x-0.5 inline-block">
                  →
                </span>
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.04}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14 sm:mb-20 max-w-4xl">
            <h2 className="display text-3xl sm:text-4xl md:text-5xl text-white leading-[1.05]">
              Things I&apos;ve built{" "}
              <span className="serif-italic text-zinc-500">recently</span>.
            </h2>
            <p className="text-[15.5px] text-zinc-400 leading-relaxed self-end">
              A small selection of projects I&apos;m proud of — from polished
              consumer apps to internal tools that quietly do their job.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 auto-rows-[minmax(320px,auto)] gap-6 sm:gap-8">
          {list.map((project, idx) => {
            const span = bentoSpans[idx] ?? "lg:col-span-6";
            const isLarge = span.includes("row-span-2");
            return (
              <ScrollReveal
                key={project.id}
                delay={idx * 0.05}
                className={cn(span)}
              >
                <ProjectCard project={project} large={isLarge} index={idx} />
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  large,
  index,
}: {
  project: Project;
  large?: boolean;
  index: number;
}) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative block h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0d0f] transition-colors duration-300 hover:border-white/[0.14]"
    >
      {/* Cover */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950",
          large ? "aspect-[16/11]" : "aspect-[16/10]",
        )}
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <PlaceholderArt index={index} title={project.title} />
        )}
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* External actions */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          {project.githubUrl && (
            <span
              role="button"
              onClick={(e) => {
                e.preventDefault();
                window.open(project.githubUrl, "_blank", "noopener");
              }}
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/10 bg-black/55 backdrop-blur-md text-white/90 opacity-0 shadow-md transition-all hover:border-white/20 hover:bg-black/75 group-hover:opacity-100"
              aria-label="GitHub"
            >
              <Github size={15} />
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className={cn("p-7 sm:p-9", large && "lg:p-10")}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="mono text-[10.5px] text-zinc-600 tracking-wide mb-2">
              0{index + 1} ·{" "}
              {project.techStack[0] ?? "Project"}
            </p>
            <h3
              className={cn(
                "font-medium text-white tracking-tight leading-tight",
                large
                  ? "text-2xl sm:text-3xl"
                  : "text-lg sm:text-xl",
              )}
            >
              {project.title}
            </h3>
            <p
              className={cn(
                "mt-3 text-zinc-400 leading-relaxed",
                large
                  ? "text-[16px] max-w-xl"
                  : "text-[14px] line-clamp-2",
              )}
            >
              {project.description}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 inline-flex items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] text-zinc-200 shadow-sm transition-all duration-300",
              "group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-zinc-950 group-hover:shadow-[0_8px_24px_-6px_var(--accent-glow)] group-hover:rotate-0 -rotate-6",
              large ? "h-14 w-14" : "h-12 w-12",
            )}
          >
            <ArrowUpRight size={large ? 22 : 18} strokeWidth={1.75} />
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.techStack.slice(0, large ? 6 : 3).map((tech) => (
            <span
              key={tech}
              className="mono text-[11px] text-zinc-300 px-3 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] shadow-sm transition-colors group-hover:border-white/15"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > (large ? 6 : 3) && (
            <span className="mono text-[11px] text-zinc-400 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02]">
              +{project.techStack.length - (large ? 6 : 3)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

const palettes = [
  ["#1e293b", "#0f172a"],
  ["#1f2937", "#0a0a0a"],
  ["#3f3f46", "#18181b"],
  ["#27272a", "#09090b"],
  ["#1c1917", "#0c0a09"],
];

function PlaceholderArt({ index, title }: { index: number; title: string }) {
  const [a, b] = palettes[index % palettes.length];
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: `radial-gradient(at 30% 20%, ${a}, ${b} 70%)`,
      }}
    >
      <span className="display text-[18vw] sm:text-[10vw] text-white/[0.05] tracking-tighter">
        {title.charAt(0)}
      </span>
    </div>
  );
}
