import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { Extension, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Emoji, { gitHubEmojis } from '@tiptap-pro/extension-emoji'

const MessageNewLine = Extension.create({
  addKeyboardShortcuts() {
    return {
      Enter: () => true,
      'Shift-Enter': () =>
        this.editor.commands.insertContent({
          type: 'paragraph',
        }),
      'Mod-Enter': () =>
        this.editor.commands.insertContent({
          type: 'paragraph',
        }),
    }
  },
})

export function useMessageEditor() {
  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit.configure({
        code: {
          HTMLAttributes: {
            class: 'bg-secondary',
          },
        },
        codeBlock: false,
      }),
      Highlight,
      Placeholder.configure({
        placeholder: 'Type a message',
      }),
      Typography,
      Link.extend({ inclusive: false }).configure({
        autolink: true,
        HTMLAttributes: {
          class: 'msg-link',
        },
      }),
      Emoji.configure({
        enableEmoticons: true,
        emojis: gitHubEmojis,
        // suggestion: emojiSuggestion,
      }),
      MessageNewLine,
    ],
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        class: 'outline-0 max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-4xl MessageEditor',
      },
    },
  })

  return editor
}
