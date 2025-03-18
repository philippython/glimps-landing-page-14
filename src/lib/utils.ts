
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDateTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

// Only date, no time
export function convertOnlyDate(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}