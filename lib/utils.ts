import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Parser } from "html-to-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeMarkup = (text: string) => {
  const htmlToReactParser = Parser();

  const reactElement = htmlToReactParser.parse(text);

  return reactElement;
};
