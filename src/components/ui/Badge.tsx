import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "active";
  className?: string;
  onClick?: () => void;
}

export default function Badge({
  children,
  variant = "default",
  className,
  onClick,
}: BadgeProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[11.5px] tracking-tight rounded-full transition-colors duration-200",
        "mono",
        variant === "default" &&
          "bg-white/[0.04] text-zinc-300 border border-white/[0.06]",
        variant === "outline" &&
          "border border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200",
        variant === "active" &&
          "bg-[var(--accent)] text-zinc-950 border border-[var(--accent)]",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </span>
  );
}
