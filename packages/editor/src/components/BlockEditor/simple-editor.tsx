'use client'

import { cn } from '../../lib/utils'
import { Editor, EditorContent } from '@tiptap/react'
import React, { memo, useRef } from 'react'

export const SimpleEditor = memo(({ editor, isThread = false }: { editor: Editor | null; isThread?: boolean }) => {
  const menuContainerRef = useRef(null)
  const editorRef = useRef<HTMLDivElement | null>(null)

  if (!editor) {
    return null
  }

  return (
    <div className={cn('flex flex-col w-full h-full', !isThread && 'max-h-16')} ref={menuContainerRef}>
      <div className="relative flex justify-center flex-col h-full">
        <EditorContent editor={editor} ref={editorRef} className="z-0 overflow-y-auto text-sm h-fit" />
      </div>
    </div>
  )
})

export default SimpleEditor
