import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const tw = (...classes) =>
  classes
    .map((cls) =>
      cls
        .split(' ')
        .map((className) => `product-${className}`)
        .join(' ')
    )
    .join(' ');
