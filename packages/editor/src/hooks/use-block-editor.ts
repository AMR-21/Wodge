import { useMemo } from 'react'

import { useEditor } from '@tiptap/react'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'

import { ExtensionKit } from '../extensions/extension-kit'
import { userColors, userNames } from '../lib/constants'
import { randomElement } from '../lib/utils'
import { EditorUser } from '../components/BlockEditor/types'
import YPartyKitProvider from 'y-partykit/provider'
import { useCurrentUser } from '@repo/ui/hooks/use-current-user'
import { PublicUserType } from '../../../data'

// TODO AI
export const useBlockEditor = ({
  ydoc,
  provider,
  user,
}: {
  ydoc: Y.Doc
  provider: YPartyKitProvider
  user: PublicUserType
}) => {
  const editor = useEditor(
    {
      autofocus: true,
      // onCreate: ({ editor }) => {
      //   provider?.on('synced', () => {
      //     if (editor.isEmpty) {
      //       editor.commands.setContent(initialContent)
      //     }
      //   })
      // },
      extensions: [
        ...ExtensionKit({
          provider,
        }),
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider,
          user: {
            name: user?.username,
            color: randomElement(userColors),
            avatar: user?.avatar,
          },
        }),
        // Ai.configure({
        //   appId: TIPTAP_AI_APP_ID,
        //   token: aiToken,
        //   baseUrl: TIPTAP_AI_BASE_URL,
        //   autocompletion: true,
        //   onLoading: () => {
        //     setIsAiLoading(true)
        //     setAiError(null)
        //   },
        //   onSuccess: () => {
        //     setIsAiLoading(false)
        //     setAiError(null)
        //   },
        //   onError: error => {
        //     setIsAiLoading(false)
        //     setAiError(error.message)
        //   },
        // }),
      ],
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full pr-8 pl-20 py-16 z-0 lg:pl-8 lg:pr-8 ',
        },
      },
    },
    [ydoc, provider],
  )

  const users = useMemo(() => {
    if (!editor?.storage.collaborationCursor?.users) {
      return []
    }

    return editor.storage.collaborationCursor?.users.map((user: EditorUser) => {
      const names = user.name?.split(' ')
      const firstName = names?.[0]
      const lastName = names?.[names.length - 1]
      const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`

      return { ...user, initials: initials.length ? initials : '?' }
    })
  }, [editor?.storage.collaborationCursor?.users])

  const characterCount = editor?.storage.characterCount || { characters: () => 0, words: () => 0 }

  // useEffect(() => {
  //   provider?.on('status', (event: { status: WebSocketStatus }) => {
  //     console.log({ event })
  //     // setCollabState(event.status)
  //   })
  // }, [provider])

  // window.editor = editor

  return {
    editor,
    users,
    characterCount,
  }
}
