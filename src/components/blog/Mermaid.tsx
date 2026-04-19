"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Loader2 } from "lucide-react";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "var(--font-sans, system-ui)",
    });

    const renderChart = async () => {
      try {
        setIsLoading(true);
        // unique id for mermaid to render
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvgContent(svg);
        setError(false);
      } catch (error) {
        console.error("Failed to render mermaid diagram", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="my-8 p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 font-mono text-sm overflow-x-auto">
        <p className="mb-2 font-bold">Failed to render Mermaid diagram:</p>
        <pre>{chart}</pre>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center my-8 h-40 bg-[#0c0d0f] rounded-xl border border-white/5 shadow-lg">
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
          <span className="text-sm font-medium">Loading Diagram...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="mermaid-wrapper flex justify-center my-8 overflow-x-auto bg-[#0c0d0f] p-6 rounded-xl border border-white/10 shadow-lg"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
