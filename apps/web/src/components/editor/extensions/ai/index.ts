import { Extension } from "@tiptap/core";
import { env } from "@repo/env";
import { AiAction } from "@repo/data";
import { toast } from "sonner";

interface PromptOpts {
  action: AiAction["action"];
  toneOrLang?: string;
  channelId: string;
  workspaceId?: string;
  teamId: string;
  folderId: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiPrompts: {
      prompt: (opts: PromptOpts) => ReturnType;
    };
  }
}

export const AiPrompts = Extension.create({
  name: "aiPrompts",
  //@ts-ignore
  addCommands() {
    return {
      prompt:
        ({ action, toneOrLang, workspaceId }) =>
        async ({ chain, view, state, editor }) => {
          if (!workspaceId) return chain().focus().run();

          const { from, to } = view.state.selection;
          const prompt = state.doc.textBetween(from, to, " ");

          const res = await fetch(`/api/workspaces/${workspaceId}/ai/action`, {
            method: "POST",
            body: JSON.stringify({
              action,
              text: prompt,
              lang: toneOrLang,
            } satisfies AiAction),
          });

          if (!res.ok) {
            toast.error("Failed to fetch prompt");
            return editor.chain().focus().run();
          }

          const { text } = await res.json<{ text: string }>();

          return editor
            .chain()
            .focus()
            .insertContentAt({ from, to }, text.trim().replace(/"/g, "") || "")
            .run();
        },
    };
  },
});
