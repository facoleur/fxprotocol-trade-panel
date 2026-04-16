"use client";

import { useEffect, type ReactNode } from "react";
import { IconButton } from "./IconButton";

interface DialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Dialog({ open, title, children, onClose }: DialogProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="trade-dialog-title"
        className="w-full max-w-md rounded-lg border border-base-400 bg-base-200 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-base-400 px-5 py-4">
          <h2 id="trade-dialog-title" className="text-base font-semibold text-base-700">
            {title}
          </h2>
          <IconButton label="Close dialog" onClick={onClose}>
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </IconButton>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
