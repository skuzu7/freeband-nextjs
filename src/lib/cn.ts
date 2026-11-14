import { clsx, type ClassValue } from 'clsx';

/** Compose conditional classes; choose conflicting utility variants explicitly at the call site. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
