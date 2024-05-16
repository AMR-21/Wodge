import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const boardsViews = atomWithStorage<Record<string, "table" | "kanban">>(
  "boardsViews",
  {},
);
export const openDatePicker = atom(false);
