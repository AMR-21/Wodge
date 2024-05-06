'use client'

import { cn } from '../../lib/utils'
import { Editor, EditorContent } from '@tiptap/react'
import React, { memo, useRef } from 'react'
import { LinkMenu, TextMenu } from '../menus'
import { ColumnsMenu } from '../../extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '../../extensions/Table/menus'
import ImageBlockMenu from '../../extensions/ImageBlock/components/ImageBlockMenu'

export const OfflineEditor = memo(({ editor, isThread = false }: { editor: Editor | null; isThread?: boolean }) => {
  const menuContainerRef = useRef(null)
  const editorRef = useRef<HTMLDivElement | null>(null)

  if (!editor) {
    return null
  }

  return (
    <div className={cn('flex flex-col w-full h-full', !isThread && 'max-h-16')} ref={menuContainerRef}>
      <div className="relative flex justify-center flex-col h-full">
        <EditorContent editor={editor} ref={editorRef} className="z-0 overflow-y-auto text-sm h-fit" />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  )
})

export default OfflineEditor
