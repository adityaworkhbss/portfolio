"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import type { About } from "@/lib/types";

interface SkillsSectionProps {
  about: About | null;
}

const defaultSkills = [
  { category: "Mobile", items: ["React Native", "Flutter", "Swift", "Kotlin", "Expo"] },
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "Express", "Firebase", "PostgreSQL", "GraphQL"] },
  { category: "Craft", items: ["Figma", "Git", "Docker", "Vercel", "Linear"] },
];

export default function SkillsSection({ about }: SkillsSectionProps) {
  const skills = about?.skills || [];
  if (skills.length === 0) return null;

  return (
    <section className="relative py-28 sm:py-36 border-t border-white/[0.05]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <ScrollReveal>
          <div className="flex items-baseline justify-between mb-14 sm:mb-20">
            <p className="eyebrow">02 — Stack</p>
            <span className="mono text-[11px] text-zinc-600">
              /toolbox
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <h2 className="display text-3xl sm:text-4xl md:text-5xl text-white max-w-3xl mb-14 sm:mb-20 leading-[1.05]">
            Tools I reach for{" "}
            <span className="serif-italic text-zinc-500">every day</span>.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map((category, idx) => (
            <ScrollReveal key={category.category} delay={idx * 0.06}>
              <div className="card card-hover group h-full p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-medium text-white tracking-tight">
                    {category.category}
                  </h3>
                  <span className="mono text-[10.5px] text-zinc-600 tabular-nums">
                    0{idx + 1}/{skills.length}
                  </span>
                </div>
                <ul className="flex-1 flex flex-col gap-1.5">
                  {category.items.map((skill) => (
                    <li key={skill}>
                      <span className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left text-[13.5px] text-zinc-300 shadow-sm transition-colors group-hover:border-white/[0.1] group-hover:bg-white/[0.05] group-hover:text-white">
                        <span className="font-medium tracking-tight">{skill}</span>
                        <span className="mono text-[11px] text-zinc-600 transition-colors group-hover:text-[var(--accent)]">
                          →
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
