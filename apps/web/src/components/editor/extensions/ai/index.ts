import { Extension } from "@tiptap/core";
import { env } from "@repo/env";
import { Prompt } from "@repo/data";
import { toast } from "sonner";

interface PromptOpts {
  action: Prompt["action"];
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
        ({ action, toneOrLang, channelId, teamId, workspaceId, folderId }) =>
        async ({ chain, view, state, editor }) => {
          if (!workspaceId) return chain().focus().run();

          const { from, to } = view.state.selection;
          const prompt = state.doc.textBetween(from, to, " ");

          console.log(toneOrLang);
          const res = await fetch(
            `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/page/${channelId}/prompt/${btoa(prompt)}/${btoa(action!)}${toneOrLang ? "/" + btoa(toneOrLang) : ""} `,
            {
              headers: {
                "Content-Type": "application/json",
                "x-workspace-id": workspaceId,
                "x-team-id": teamId,
                "x-folder-id": folderId,
              },
              // body: JSON.stringify({ action, toneOrLang, prompt } as Prompt & {
              //   toneOrLang?: string;
              // }),
            },
          );

          if (!res.ok) {
            toast.error("Failed to fetch prompt");
            return editor.chain().focus().run();
          }
          const { response } = await res.json<{ response: string }>();

          return editor
            .chain()
            .focus()
            .insertContentAt(
              { from, to },
              response.trim().replace(/"/g, "") || "",
            )
            .run();
        },
    };
  },
});
