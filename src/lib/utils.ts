
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDateTime(timestamp: string | undefined) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString();
}

// Only date, no time
export function convertOnlyDate(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

// Convert json nested structure to flat dot notation
export const flattenMessages = (nestedMessages: any, prefix = ''): Record<string, string> => {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {} as Record<string, string>);
};
