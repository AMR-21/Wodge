import { atom } from "jotai";
import { Task } from "./task-card";

export const tempMoveId = atom<string | null>(null);
export const tempMovesAtom = atom<Task[]>([]);
