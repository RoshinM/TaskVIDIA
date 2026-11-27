"use client";

import { Check } from "lucide-react";

type ToastProps = {
  title: string;
  description?: string;
  onClose: () => void;
};

export function Toast({ title, description, onClose }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 right-5 z-50 w-[min(22rem,calc(100vw-2.5rem))] rounded-lg border border-border bg-card p-4 text-card-foreground shadow-lg"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
          <Check className="size-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium">{title}</p>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          ×
        </button>
      </div>
    </div>
  );
}
