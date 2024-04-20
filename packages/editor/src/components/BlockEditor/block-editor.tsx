'use client'

import { EditorContent } from '@tiptap/react'
import React, { useRef } from 'react'

import { LinkMenu } from '../menus'

import { useBlockEditor } from '../../hooks/use-block-editor'

import ImageBlockMenu from '../../extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '../../extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '../../extensions/Table/menus'
import { TiptapProps } from './types'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { EditorInfo } from './components/EditorInfo'
import { EditorCounts } from './components/EditorCounts'
import { useCurrentUser } from '@repo/ui/hooks/use-current-user'
import { PublicUserType } from '../../../../data'
import { ScrollArea } from '@repo/ui/components/ui/scroll-area'

export const BlockEditor = ({
  ydoc,
  provider,
  user,
}: TiptapProps & {
  user: PublicUserType
}) => {
  const menuContainerRef = useRef(null)
  const editorRef = useRef<HTMLDivElement | null>(null)

  console.log({ user })

  const { editor, users, characterCount } = useBlockEditor({
    ydoc,
    provider,
    user,
  })

  const displayedUsers = users.slice(0, 5)

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col h-full w-full" ref={menuContainerRef}>
      <ScrollArea className="flex-1">
        <div className="relative flex flex-col flex-1 h-full  ">
          <EditorContent editor={editor} ref={editorRef} className="flex-1 overflow-y-auto" />
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
