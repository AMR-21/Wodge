import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { Extension, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'

const MessageNewLine = Extension.create({
  addKeyboardShortcuts() {
    return {
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

export function useSimpleEditor() {
  const editor = useEditor({
    autofocus: true,
    extensions: [
      // header
      StarterKit,
      Highlight,
      Placeholder.configure({
        placeholder: 'Type a message',
      }),
      Typography,
      Markdown,
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
