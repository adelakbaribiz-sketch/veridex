import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const variantClasses: Record<Variant, string> = {
  // The one variant that gets tactile depth (shadow + hover lift + press-down) — every
  // other variant stays flat so the primary action is the one that visibly stands out.
  primary:
    "bg-brand-700 text-white shadow-[0_2px_8px_-2px_rgba(19,41,75,0.45)] hover:bg-brand-900 hover:-translate-y-px hover:shadow-[0_6px_14px_-4px_rgba(19,41,75,0.5)] active:translate-y-0 active:shadow-[0_1px_4px_-1px_rgba(19,41,75,0.4)] disabled:bg-ink-400 disabled:shadow-none disabled:translate-y-0",
  secondary:
    "bg-surface border border-border-strong text-ink-900 hover:bg-brand-100 disabled:text-ink-400",
  ghost: "text-ink-700 hover:bg-brand-100 disabled:text-ink-400",
  danger: "bg-danger-600 text-white hover:bg-danger-700 disabled:bg-ink-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[color,background-color,box-shadow,transform] duration-150 cursor-pointer disabled:cursor-not-allowed motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
