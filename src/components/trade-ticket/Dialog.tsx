"use client";

import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Dialog({ open, title, children, onClose }: DialogProps) {
  return (
    <ShadcnDialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="border-base-400 bg-base-200 text-base-700 ring-base-400">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-base-700">
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </ShadcnDialog>
  );
}
