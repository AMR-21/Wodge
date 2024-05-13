import { type ClassValue, clsx } from "clsx";
import { RefObject } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Mutable<Type> = {
  -readonly [Key in keyof Type]: Type[Key];
};

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  const rgb = [
    parseInt(result[1]!, 16),
    parseInt(result[2]!, 16),
    parseInt(result[3]!, 16),
  ].join(",");

  return rgb;
}

export function randomElement(array: Array<any>) {
  return array[Math.floor(Math.random() * array.length)];
}

export function focusElement(ref: RefObject<any>) {
  if (!ref.current) return;
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStart(ref.current, ref.current.childNodes.length);
  range.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export * from "./time-utils";
export * from "./cssVar";
export * from "./get-render-container";
export * from "./is-text-selected";
export * from "./is-custom-node-selected";
export * from "./api";
export * from "./constants";
export * from "./files-utils";
