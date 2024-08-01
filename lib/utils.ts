import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeText = (text: string) => {
  let sanitizedText = text.replace(/(<([^>]+)>)/gi, "");

  // remove &quot;
  sanitizedText = sanitizedText.replace(/&quot;/g, "");

  return sanitizedText;
};
