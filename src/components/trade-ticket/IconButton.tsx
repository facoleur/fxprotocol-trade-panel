import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function IconButton({
  label,
  children,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        "inline-flex size-9 items-center justify-center rounded-md text-base-600 transition",
        "hover:bg-base-300 hover:text-base-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
