"use client";

import { Eye } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface ResumeSectionProps {
  resumeUrl?: string;
}

export default function ResumeSection({
  resumeUrl,
}: ResumeSectionProps) {
  if (!resumeUrl) return null;
  
  return (
    <section id="resume" className="relative py-24 sm:py-28 border-t border-white/[0.05]">
      <div className="mx-auto max-w-7xl px-[20px] lg:px-[56px]">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-[#0d0e10] to-[#0a0b0c] p-8 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(closest-side, var(--accent-glow), transparent 70%)",
              }}
            />
            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-8">
                <p className="eyebrow mb-5">05 — Resume</p>
                <h2 className="display text-3xl sm:text-4xl md:text-5xl text-white leading-[1.05]">
                  Want the{" "}
                  <span className="serif-italic text-[var(--accent)]">
                    long version
                  </span>
                  ?
                </h2>
                <p className="mt-4 text-zinc-400 max-w-lg text-[15px] leading-relaxed">
                  Download the full PDF for a deeper look at experience,
                  education and side projects.
                </p>
              </div>

              <div className="md:col-span-4 flex md:justify-end">
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 h-12 pl-6 pr-3 rounded-full bg-white text-zinc-950 font-bold text-[14.5px] hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  >
                    View Resume
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-zinc-950 text-white group-hover:bg-[var(--accent)] group-hover:text-zinc-900 transition-colors">
                      <Eye size={15} />
                    </span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white/[0.04] text-zinc-500 mono text-[12.5px] tracking-wide border border-white/[0.06]">
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
