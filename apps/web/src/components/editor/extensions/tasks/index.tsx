import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { nanoid } from "nanoid";

import { atom } from "jotai";
import * as Y from "yjs";
import { Tasks as TasksComp } from "./tasks";

export const yDocAtom = atom<Y.Doc | undefined>(undefined);

export const Tasks = Node.create({
  name: "tasks",
  group: "block",
  isolating: true,
  selectable: false,

  parseHTML() {
    return [
      {
        tag: "tasks",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["tasks", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(TasksComp);
  },

  addAttributes() {
    return {
      "data-id": {
        default: nanoid(6),
      },
    };
  },
});
