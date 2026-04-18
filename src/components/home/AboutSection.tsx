"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { About } from "@/lib/types";

interface AboutSectionProps {
  about: About | null;
}

const defaultStats = [
  { value: "5+", label: "Years building" },
  { value: "30+", label: "Apps shipped" },
  { value: "12", label: "Happy clients" },
];

export default function AboutSection({ about }: AboutSectionProps) {
  const name = about?.name || "";
  const bio = about?.bio || "";
  const stats = about?.stats?.length ? about.stats : defaultStats;

  if (!name && !bio && !about?.avatarUrl) return null;

  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-[20px] lg:px-[56px]">
        <ScrollReveal>
          <div className="flex items-baseline justify-between mb-14 sm:mb-20">
            <p className="eyebrow">01 — About</p>
            <span className="mono text-[11px] text-zinc-600">/profile</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Avatar */}
          <ScrollReveal className="lg:col-span-5" delay={0.05}>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0d0f]">
                {about?.avatarUrl ? (
                  <Image
                    src={about.avatarUrl}
                    alt={name}
                    fill
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="object-cover"
                    priority={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="display text-[12rem] text-white/10">
                      {name ? name.charAt(0).toUpperCase() : "A"}
                    </span>
                  </div>
                )}
                {/* corner annotations */}
                <div className="absolute top-3 left-3 mono text-[10.5px] text-white/70 bg-black/40 backdrop-blur px-2 py-1 rounded">
                  IMG_0001 · {name ? name.split(" ")[0]?.toUpperCase() : ""}
                </div>
                <div className="absolute bottom-3 right-3 mono text-[10.5px] text-white/70 bg-black/40 backdrop-blur px-2 py-1 rounded">
                  ⌘ — {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Bio + stats */}
          <div className="lg:col-span-7 space-y-10">
            <ScrollReveal delay={0.12}>
              <h2 className="display text-4xl sm:text-5xl md:text-6xl text-white leading-[1.02]">
                {name ? `Hi, I'm ${name.split(" ")[0]}. ` : ""}
                <span className="text-zinc-500">
                  A developer who treats software like{" "}
                  <span className="serif-italic text-white">craft</span>.
                </span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.18}>
              <p className="text-[16.5px] text-zinc-400 leading-relaxed max-w-2xl">
                {bio}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.24}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 pt-2">
                {stats.slice(0, 6).map((s) => (
                  <div
                    key={s.label}
                    className="border-l border-white/[0.08] pl-4 py-1"
                  >
                    <p className="display text-3xl sm:text-4xl text-white">
                      {s.value}
                    </p>
                    <p className="mono text-[11px] tracking-wide uppercase text-zinc-500 mt-1.5 break-words">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
