import { Extension } from '@tiptap/core'
import { Prompt } from '../../../../data'
import { env } from '@repo/env'

interface PromptOpts {
  action: Prompt['action']
  toneOrLang?: string
  channelId: string
  workspaceId?: string
  teamId: string
  folderId: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    aiPrompts: {
      prompt: (opts: PromptOpts) => ReturnType
    }
  }
}

export const AiPrompts = Extension.create({
  name: 'aiPrompts',
  //@ts-ignore
  addCommands() {
    return {
      prompt:
        ({ action, toneOrLang, channelId, teamId, workspaceId, folderId }) =>
        async ({ chain, view, state }) => {
          if (!workspaceId) return chain().focus().run()
          const prompt = state.doc.textBetween(view.state.selection.from, view.state.selection.to, ' ')

          const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/page/${channelId}/prompt`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-workspace-id': workspaceId,
              'x-team-id': teamId,
              'x-folder-id': folderId,
            },
            credentials: 'include',
            body: JSON.stringify({ action, toneOrLang, prompt } as Prompt & {
              toneOrLang?: string
            }),
          })

          console.log('res', await res.json())
          return chain().focus().run()
        },
    }
  },
})
