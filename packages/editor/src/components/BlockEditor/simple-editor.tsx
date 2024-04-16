'use client'

import { Editor, EditorContent } from '@tiptap/react'
import React, { useRef } from 'react'

export const SimpleEditor = ({ editor }: { editor: Editor | null }) => {
  const menuContainerRef = useRef(null)
  const editorRef = useRef<HTMLDivElement | null>(null)

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col w-full h-full max-h-16" ref={menuContainerRef}>
      <div className="relative flex justify-center flex-col h-full">
        <EditorContent editor={editor} ref={editorRef} className="z-0 overflow-y-auto text-sm h-fit" />
      </div>
    </div>
  )
}

export default SimpleEditor
