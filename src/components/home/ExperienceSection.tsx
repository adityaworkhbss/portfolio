"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import { formatDateShort } from "@/lib/utils";
import type { Experience } from "@/lib/types";

interface ExperienceSectionProps {
  experiences: Experience[];
}

const placeholderExperiences: Experience[] = [
  {
    id: "1",
    company: "TechCorp Inc.",
    role: "Senior Mobile Developer",
    description:
      "Lead mobile engineering for a cross-platform suite serving 500K+ users. Architected the design system and shipping pipeline.",
    startDate: "2023-01",
    current: true,
    techStack: ["React Native", "TypeScript", "Firebase"],
    order: 1,
  },
  {
    id: "2",
    company: "StartupXYZ",
    role: "Full Stack Developer",
    description:
      "Built and shipped 3 products from zero. Worked across the stack from React frontends to Node services and infra.",
    startDate: "2021-06",
    endDate: "2022-12",
    current: false,
    techStack: ["React", "Node.js", "PostgreSQL"],
    order: 2,
  },
  {
    id: "3",
    company: "DigitalAgency",
    role: "Junior Developer",
    description:
      "Developed responsive web apps and contributed to mobile app features for a roster of agency clients.",
    startDate: "2020-01",
    endDate: "2021-05",
    current: false,
    techStack: ["JavaScript", "Flutter", "Firebase"],
    order: 3,
  },
];

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const list = experiences.length > 0 ? experiences : placeholderExperiences;

  return (
    <section
      id="experience"
      className="relative py-28 sm:py-36 border-t border-white/[0.05]"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <ScrollReveal>
          <div className="flex items-baseline justify-between mb-14 sm:mb-20">
            <p className="eyebrow">04 — Experience</p>
            <span className="mono text-[11px] text-zinc-600">/timeline</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.04}>
          <h2 className="display text-3xl sm:text-4xl md:text-5xl text-white max-w-3xl mb-14 sm:mb-20 leading-[1.05]">
            Where I&apos;ve been{" "}
            <span className="serif-italic text-zinc-500">building</span>.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-0">
          {list.map((exp, idx) => (
            <ScrollReveal key={exp.id} delay={idx * 0.06}>
              <div className="group grid grid-cols-12 gap-6 py-8 border-t border-white/[0.06] last:border-b last:border-b-white/[0.06] hover:bg-white/[0.015] transition-colors duration-300 -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-lg">
                <div className="col-span-12 sm:col-span-3 flex items-center justify-between sm:block">
                  <p className="mono text-[11.5px] tracking-wide text-zinc-500">
                    {formatDateShort(exp.startDate).toUpperCase()}{" "}
                    <span className="text-zinc-700">—</span>{" "}
                    {exp.current
                      ? "PRESENT"
                      : exp.endDate
                        ? formatDateShort(exp.endDate).toUpperCase()
                        : ""}
                  </p>
                  {exp.current && (
                    <span className="sm:mt-2 inline-flex items-center gap-1.5 mono text-[10.5px] tracking-wide text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="col-span-12 sm:col-span-9">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                      {exp.role}
                    </h3>
                    <span className="mono text-[11px] text-zinc-600 hidden sm:inline">
                      0{idx + 1}
                    </span>
                  </div>
                  <p className="text-[14px] text-[var(--accent)] mb-3 mono tracking-tight">
                    @ {exp.company}
                  </p>
                  <p className="text-[14.5px] text-zinc-400 leading-relaxed max-w-2xl mb-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="mono text-[11px] text-zinc-300 px-3 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
