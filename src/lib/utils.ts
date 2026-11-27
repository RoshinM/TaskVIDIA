import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0];
  if (!first) return "?";

  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : undefined;
  return `${first}${last ?? ""}`.toUpperCase();
}
