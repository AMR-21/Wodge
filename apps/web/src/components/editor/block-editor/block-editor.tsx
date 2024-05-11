'use client'

import { EditorContent } from '@tiptap/react'
import React, { useEffect, useRef } from 'react'
import { TiptapProps } from './types'
import { UserType } from '@repo/data'
import { useBlockEditor } from '@/hooks/use-block-editor'
import { useCanEdit } from '@/hooks/use-can-edit'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ContentItemMenu } from '../content-item-menu'
import { LinkMenu } from '../link-menu'
import { TextMenu } from '../text-menu'
import ColumnsMenu from '../extensions/multi-column/columns-menu'
import TableRowMenu from '../extensions/table/table-row'
import TableColumnMenu from '../extensions/table/table-column'
import ImageBlockMenu from '../extensions/image-block/image-block-menu'
import { EditorInfo } from './editor-info'
import { EditorCounts } from './editor-counts'


export const BlockEditor = ({
  ydoc,
  provider,
  user,
}: TiptapProps & {
  user: UserType
}) => {
  const menuContainerRef = useRef(null)
  const editorRef = useRef<HTMLDivElement | null>(null)

  const { editor, users, characterCount } = useBlockEditor({
    ydoc,
    provider,
    user,
  })

  const canEdit = useCanEdit({ type: 'page' })

  useEffect(() => {
    if (editor) {
      editor.setEditable(canEdit)
    }
  }, [canEdit, editor])

  const displayedUsers = users.slice(0, 5)

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col h-full w-full" ref={menuContainerRef}>
      <ScrollArea className="flex-1">
        <div className="relative flex flex-col flex-1 h-full  ">
          <EditorContent editor={editor} ref={editorRef} className="flex-1 w-full" />
          <ContentItemMenu editor={editor} />
          <LinkMenu editor={editor} appendTo={menuContainerRef} />
          <TextMenu editor={editor} />
          <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
          <TableRowMenu editor={editor} appendTo={menuContainerRef} />
          <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
          <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        </div>
      </ScrollArea>
      <div className="flex  justify-between p-3">
        <EditorInfo users={displayedUsers} />
        <EditorCounts characters={characterCount.characters()} words={characterCount.words()} />
      </div>
    </div>
  )
}

export default BlockEditor
