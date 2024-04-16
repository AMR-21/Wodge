import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'

export function useSimpleEditor() {
  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit,
      Highlight,
      Placeholder.configure({
        placeholder: 'Type a message',
      }),
    ],
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        class: 'outline-0 max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-4xl',
      },
    },
  })

  return editor
}
