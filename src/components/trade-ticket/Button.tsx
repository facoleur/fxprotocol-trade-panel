import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center rounded-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-16 px-5 text-lg",
        variant === "primary" &&
          "bg-primary text-base-700 hover:bg-primary-strong",
        variant === "secondary" &&
          "bg-base-300 text-base-700 hover:bg-base-400",
        variant === "ghost" && "text-base-500 hover:bg-base-300 hover:text-base-700",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
