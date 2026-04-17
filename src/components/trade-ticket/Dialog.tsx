"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog as ShadcnDialog,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  showTitle?: boolean;
}

export function Dialog({
  open,
  title,
  children,
  onClose,
  showTitle = true,
}: DialogProps) {
  return (
    <ShadcnDialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
    >
      <DialogContent className="border-base-400 bg-base-200 text-base-700 ring-base-400 min-w-150">
        {title ? (
          <DialogHeader className={showTitle ? undefined : "sr-only"}>
            <DialogTitle className="text-base font-semibold text-base-700">
              {title}
            </DialogTitle>
          </DialogHeader>
        ) : null}
        {children}
      </DialogContent>
    </ShadcnDialog>
  );
}
