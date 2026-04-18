import { cn } from "@/lib/utils";
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "muted";
  size?: "sm" | "md" | "lg";
  /** Merge styles onto the single child element (e.g. Next.js `Link`). */
  asChild?: boolean;
}

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    });
  };
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      "group relative inline-flex shrink-0 items-center justify-center gap-2 font-medium tracking-tight cursor-pointer select-none whitespace-nowrap rounded-xl",
      "transition-[transform,background-color,color,border-color,box-shadow] duration-200 ease-out",
      "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",

      variant === "primary" && [
        "bg-[var(--accent)] text-zinc-950  shadow-[0_1px_0_rgba(255,255,255,0.25)_inset]",
        "hover:bg-[var(--accent-bright)] hover:shadow-[0_8px_28px_-6px_var(--accent-glow),0_1px_0_rgba(255,255,255,0.28)_inset]",
      ],
      variant === "secondary" && [
        "bg-white text-zinc-950 shadow-[0_1px_0_rgba(0,0,0,0.06)_inset]",
        "hover:bg-zinc-100 hover:shadow-[0_6px_24px_-8px_rgba(255,255,255,0.2)]",
      ],
      variant === "ghost" && [
        "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/[0.06]",
      ],
      variant === "outline" && [
        "border border-white/[0.14] bg-white/[0.02] text-[var(--fg)] shadow-sm",
        "hover:bg-white/[0.07] hover:border-white/20",
      ],
      variant === "muted" && [
        "bg-transparent text-zinc-300",
        "hover:text-white  ",
      ],

      size === "sm" && "h-10 px-5 text-[13px]",
      size === "md" && "h-12 px-7 text-[14.5px]",
      size === "lg" && "h-14 px-10 text-[16px] font-semibold",

      className,
    );

    if (asChild) {
      let child: ReturnType<typeof Children.only>;
      try {
        child = Children.only(children);
      } catch {
        throw new Error("Button with asChild expects a single React element child.");
      }
      if (!isValidElement(child)) {
        throw new Error("Button with asChild expects a single React element child.");
      }
      const el = child as ReactElement<{
        className?: string;
        ref?: React.Ref<HTMLElement>;
      }>;
      const { type: _t, disabled: _d, form: _f, formAction: _fa, ...passthrough } =
        props as ButtonHTMLAttributes<HTMLButtonElement>;
      return cloneElement(el, {
        ...el.props,
        ...passthrough,
        className: cn(classes, el.props.className),
        ref: mergeRefs(ref, el.props.ref),
      } as never);
    }

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
