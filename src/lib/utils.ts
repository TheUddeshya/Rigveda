import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for conditionally merging Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500', 'text-white')
 * cn('px-2', 'px-4') // Returns 'px-4' (tailwind-merge handles the conflict)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
