import { cn } from "@/lib/utils";
import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const fieldBase = [
  "w-full bg-transparent text-[15px] text-[var(--fg)]",
  "placeholder:text-[var(--fg-faint)]",
  "border-0 border-b border-white/10 rounded-none px-0 py-2.5",
  "transition-colors duration-200",
  "focus:outline-none focus:border-[var(--accent)]",
];

const labelBase =
  "block mono text-[12px] tracking-[0.1em] uppercase text-zinc-400";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className={labelBase}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            fieldBase,
            error && "border-red-500/60 focus:border-red-400",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mono">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className={labelBase}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            fieldBase,
            "resize-none leading-relaxed",
            error && "border-red-500/60 focus:border-red-400",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mono">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
