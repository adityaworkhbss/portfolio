"use client";

import { Link as LinkIcon, Check } from "lucide-react";
import { TwitterIcon as Twitter, LinkedinIcon as Linkedin } from "@/components/ui/Icons";
import { useState, useEffect } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/blog/${slug}`);
  }, [slug]);

  const shareLinks = [
    {
      icon: Twitter,
      label: "Twitter",
      href: url ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` : "#",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: url ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` : "#",
    },
  ];

  const copyLink = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 mr-1">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={url ? "_blank" : "_self"}
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
          className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
        >
          <link.icon size={16} />
        </a>
      ))}
      <button
        onClick={copyLink}
        className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer"
        aria-label="Copy link"
      >
        {copied ? <Check size={16} className="text-emerald-400" /> : <LinkIcon size={16} />}
      </button>
    </div>
  );
}
