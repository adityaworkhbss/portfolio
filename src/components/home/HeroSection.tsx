"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, FileText, Coffee, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  GithubIcon as Github,
  LinkedinIcon as Linkedin,
  TwitterIcon as Twitter,
} from "@/components/ui/Icons";
import type { About } from "@/lib/types";

import { cn } from "@/lib/utils";

interface HeroSectionProps {
  about: About | null;
}

const defaultMarquee = [
  "React Native",
  "Flutter",
  "TypeScript",
  "Next.js",
  "Swift",
  "Kotlin",
  "Firebase",
  "GraphQL",
  "Tailwind",
  "Node.js",
  "PostgreSQL",
  "Figma",
];

export default function HeroSection({ about }: HeroSectionProps) {
  const fullName = about?.name || "";
  const [first, ...rest] = fullName.split(" ");
  const last = rest.join(" ");
  const role = about?.role || "";
  const tagline = about?.tagline || "";
  const location = about?.location || "";

  const socialMap: Record<string, typeof Github> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    x: Twitter,
  };

  const socials = (about?.socialLinks ?? []).filter((s) =>
    socialMap[s.platform.toLowerCase()],
  );

  const dbSkills = about?.skills?.flatMap((s) => s.items) || [];
  const marqueeItems = dbSkills.length > 0 ? dbSkills : defaultMarquee;

  const codeSnippets = [
    [
      'const dev = new Human();',
      'while (dev.isAwake()) {',
      '  dev.drink("coffee");',
      '  dev.code();',
      '}'
    ],
    [
      'const portfolio = {',
      '  speed: "fast",',
      '  design: "premium",',
      '  status: "done"',
      '};',
      'deploy(portfolio);'
    ],
    [
      'function createArt() {',
      '  return pixels.map(p => {',
      '    return grayScale(p);',
      '  });',
      '}'
    ],
    [
      'export function Button() {',
      '  return (',
      '    <button className="btn">',
      '      Click Me',
      '    </button>',
      '  );',
      '}'
    ],
    [
      'async function fetchData() {',
      '  const res = await api.get();',
      '  if (res.ok) {',
      '    setData(res.json());',
      '  }',
      '}'
    ],
    [
      'interface User {',
      '  id: string;',
      '  name: string;',
      '  role: "admin";',
      '}',
      'let me: User;'
    ],
    [
      'const theme = {',
      '  primary: "#bef264",',
      '  surface: "#0c0d0f",',
      '  radius: "1rem"',
      '};',
      'applyTheme(theme);'
    ],
    [
      'const animate = (el) => {',
      '  gsap.to(el, {',
      '    opacity: 1,',
      '    y: 0,',
      '    duration: 0.8',
      '  });',
      '};'
    ],
    [
      'firebase.onAuth((user) => {',
      '  if (user) {',
      '    setProfile(user.uid);',
      '    router.push("/app");',
      '  }',
      '});'
    ],
    [
      '/* Global Styles */',
      '@media (width > 1024px) {',
      '  .hero {',
      '    grid-template-columns: 1fr;',
      '  }',
      '}'
    ]
  ];

  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const currentSnippet = codeSnippets[snippetIndex];
    if (currentLine < currentSnippet.length) {
      if (currentChar < currentSnippet[currentLine].length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => {
            const next = [...prev];
            if (!next[currentLine]) next[currentLine] = '';
            next[currentLine] += currentSnippet[currentLine][currentChar];
            return next;
          });
          setCurrentChar(prev => prev + 1);
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLine(prev => prev + 1);
          setCurrentChar(0);
        }, 200);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLine, currentChar, snippetIndex]);

  const handleCoffeeClick = () => {
    if (buildStatus !== 'idle') return;
    const isSuccess = Math.random() > 0.3;
    setBuildStatus(isSuccess ? 'success' : 'error');

    // After build status, clear and move to next snippet
    setTimeout(() => {
      setBuildStatus('idle');
      setDisplayText([]);
      setCurrentLine(0);
      setCurrentChar(0);
      setSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 2500);
  };

  return (
    <section className="relative pt-24 sm:pt-32 pb-24 sm:pb-32 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-[20px] lg:px-[56px]">
        {/* Top meta row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between gap-4 mb-20 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
            {about?.availabilityStatus && (
              <span className="relative flex w-2 h-2">
                <span className={cn(
                  "absolute inset-0 rounded-full animate-ping opacity-50",
                  about.availabilityStatus === 'green' ? "bg-emerald-400" :
                    about.availabilityStatus === 'orange' ? "bg-amber-400" : "bg-rose-400"
                )} />
                <span className={cn(
                  "relative inline-flex w-2 h-2 rounded-full",
                  about.availabilityStatus === 'green' ? "bg-emerald-400" :
                    about.availabilityStatus === 'orange' ? "bg-amber-400" : "bg-rose-400"
                )} />
              </span>
            )}
            <span className="mono text-[11.5px] tracking-wide text-zinc-300">
              {about?.availabilityText || "Available for new projects"}
            </span>
          </div>
          {location && (
            <div className="hidden sm:flex items-center gap-2 mono text-[11.5px] text-zinc-500 tracking-wide">
              <span>{location}</span>
            </div>
          )}
        </motion.div>

        {/* Display headline */}
        <div className="grid grid-cols-12 gap-y-12 lg:gap-6 items-center">
          <h1 className="col-span-12 lg:col-span-7 xl:col-span-8 display text-[14vw] sm:text-[11vw] md:text-[9vw] lg:text-[7.5rem] xl:text-[9.5rem]">
            <motion.span
              initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              className="block brand-text"
            >
              {first}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="block"
            >
              <span className="serif-italic text-[var(--accent)]">{last}</span>
              <span className="text-[var(--accent)]">.</span>
            </motion.span>
          </h1>

          {/* Coffee & Code Floating Animation */}
          <div className="hidden lg:flex col-span-5 xl:col-span-4 justify-end relative h-full items-center mr-[-20px] xl:mr-0 xl:pr-4">
            <motion.div
              initial={{ opacity: 0, rotate: 2, scale: 0.95 }}
              animate={{ opacity: 1, rotate: -3, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[340px] h-80 rounded-2xl bg-[#0c0c0e]/80 backdrop-blur-2xl border border-white/10 shadow-[var(--shadow-lg),inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col group/terminal"
            >
              {/* Terminal Header */}
              <div className="h-9 border-b border-white/[0.08] flex items-center px-4 gap-1.5 bg-black/40">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 mt-0.5 mono text-[10px] text-zinc-500">zsh</span>
              </div>

              {/* Typewriter Code Lines */}
              <div className="p-5 flex-1 font-mono text-[12px] flex flex-col gap-1.5 overflow-hidden relative">
                <AnimatePresence>
                  {buildStatus !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-md ${buildStatus === 'success' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                        }`}
                    >
                      {buildStatus === 'success' ? (
                        <>
                          <CheckCircle2 className="text-emerald-400 mb-2" size={32} />
                          <p className="text-emerald-400 font-bold tracking-tight">BUILD SUCCESS</p>
                          <p className="text-emerald-400/60 text-[10px] mt-1">Finished in 1.4s</p>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-red-400 mb-2" size={32} />
                          <p className="text-red-400 font-bold tracking-tight">BUILD FAILED</p>
                          <p className="text-red-400/60 text-[10px] mt-1">ReferenceError: sleep is not defined</p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {displayText.map((line, i) => (
                  <div key={`${snippetIndex}-${i}`} className="flex">
                    <span className="text-zinc-600 mr-3 select-none w-4">{i + 1}</span>
                    <pre className="text-zinc-300 whitespace-pre">
                      {line.split(' ').map((word, wi) => {
                        if (['const', 'while', 'function', 'return'].includes(word.replace(/[(){}]/g, ''))) return <span key={wi} className="text-pink-400">{word} </span>;
                        if (word.startsWith('"') || word.startsWith("'")) return <span key={wi} className="text-emerald-300">{word} </span>;
                        if (word.includes('(')) {
                          const [fn, rest] = word.split('(');
                          return (
                            <span key={wi}>
                              <span className="text-yellow-200">{fn}</span>
                              <span className="text-zinc-400">(</span>
                              {rest && <span className="text-zinc-400">{rest} </span>}
                            </span>
                          );
                        }
                        return <span key={wi}>{word} </span>;
                      })}
                      {i === currentLine && currentLine < codeSnippets[snippetIndex].length && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="inline-block w-[7px] h-[14px] bg-[var(--accent)] ml-0.5 align-middle"
                        />
                      )}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Coffee Widget Interaction */}
              <motion.button
                onClick={handleCoffeeClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute -right-8 -bottom-8 w-24 h-24 bg-[#161618] border border-white/[0.08] rounded-2xl flex items-center justify-center shadow-2xl rotate-12 backdrop-blur-md cursor-pointer hover:border-[var(--accent)]/30 transition-colors z-30"
              >
                <div className="relative">
                  <Coffee className="text-[var(--accent)]" size={32} />
                  {/* Steam Particles */}
                  <motion.div
                    animate={{ y: [0, -20], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-white/20 blur-[1px] rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -25], opacity: [0, 1, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    className="absolute -top-6 left-1/3 -translate-x-1/2 w-1.5 h-6 bg-white/20 blur-[2.5px] rounded-full"
                  />
                </div>
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[var(--accent)] text-zinc-950 text-[9px] font-bold tracking-tighter opacity-0 group-hover/terminal:opacity-100 transition-opacity">
                  CLICK ME
                </div>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Sub-row */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="md:col-span-6 lg:col-span-5"
          >
            {role && (
              <p className="mono text-[12px] tracking-[0.16em] uppercase text-[var(--fg-subtle)]">
                <span className="text-[var(--accent)]">→</span>{"  "}
                {role}
              </p>
            )}
            {tagline && (
              <p className="mt-5 text-[17px] sm:text-[18px] text-zinc-300 leading-relaxed max-w-xl">
                {tagline}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="md:col-span-6 lg:col-span-7 flex flex-col gap-6 md:items-end justify-end"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="min-w-[min(100%,12.5rem)] justify-center sm:min-w-[13.5rem]"
              >
                <Link href="#projects">
                  See selected work
                  <ArrowRight
                    size={16}
                    className="shrink-0 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </Button>
              {about?.resumeUrl && (
                <Button 
                  asChild
                  variant="muted"
                  size="lg" 
                  className="w-[1/2] px-4"
                >
                  <a
                    href={about.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={18} />
                    Resume
                  </a>
                </Button>
              )}
            </div>

            {socials.length > 0 && (
              <div className="flex items-center gap-1">
                {socials.map((s) => {
                  const Icon = socialMap[s.platform.toLowerCase()];
                  return (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative mt-24 sm:mt-32 border-y border-white/[0.06] py-5 overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--bg)] to-transparent z-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--bg)] to-transparent z-10"
        />
        <div className="flex w-max animate-marquee gap-12">
          {[...marqueeItems, ...marqueeItems].map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="mono text-[13px] tracking-tight text-zinc-500 whitespace-nowrap inline-flex items-center gap-3"
            >
              {tech}
              <span className="text-zinc-700">•</span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
