"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import type { About } from "@/lib/types";

export default function ContactSection({ about }: { about?: About | null }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Message sent — talk soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      toast.error("Couldn't send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-28 sm:py-36 border-t border-white/[0.05]"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <ScrollReveal>
          <div className="flex items-baseline justify-between mb-14 sm:mb-20">
            <p className="eyebrow">05 — Contact</p>
            <span className="mono text-[11px] text-zinc-600">/say-hi</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Pitch */}
          <ScrollReveal className="lg:col-span-6" delay={0.04}>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl text-white leading-[1.02]">
              Let&apos;s make{" "}
              <span className="serif-italic text-[var(--accent)]">
                something
              </span>{" "}
              <span className="text-zinc-500">
                people will love.
              </span>
            </h2>
            <p className="mt-6 text-[15.5px] text-zinc-400 max-w-md leading-relaxed">
              Have a project, role or wild idea? Drop a line — I read everything
              and respond within a day.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md">
              <ContactInfo 
                label="Email" 
                value={about?.email || "hello@adityasharma.dev"} 
                href={about?.email ? `mailto:${about.email}` : "mailto:hello@adityasharma.dev"} 
              />
              <ContactInfo 
                label="Location" 
                value={about?.location || "India · Remote-first"} 
              />
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal className="lg:col-span-6" delay={0.12}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 border-b border-white/[0.08] pb-8"
            >
              <Input
                id="contact-name"
                label="Your name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                id="contact-email"
                label="Email"
                type="email"
                placeholder="jane@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Textarea
                id="contact-message"
                label="What's on your mind?"
                placeholder="Tell me a little about the project, timeline and the vibe…"
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="mt-2 "
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowUpRight size={18} className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function ContactInfo({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const Wrapper: React.ElementType = href ? "a" : "div";
  return (
    <Wrapper
      href={href}
      className="block group"
    >
      <p className="mono text-[10.5px] tracking-[0.16em] uppercase text-zinc-500 mb-2">
        {label}
      </p>
      <p className="text-[15px] text-zinc-200 group-hover:text-white transition-colors">
        {value}
        {href && (
          <span className="inline-block ml-1 text-zinc-500 group-hover:text-[var(--accent)] transition-colors">
            ↗
          </span>
        )}
      </p>
    </Wrapper>
  );
}
