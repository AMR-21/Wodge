'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import React, { useRef } from 'react'

import { LinkMenu } from '../menus'

import { useBlockEditor } from '../../hooks/useBlockEditor'

// import '../../styles/index.css'

import ImageBlockMenu from '../../extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '../../extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '../../extensions/Table/menus'
import { TiptapProps } from './types'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { EditorInfo } from './components/EditorInfo'
import { EditorCounts } from './components/EditorCounts'
import { useCurrentUser } from '@repo/ui/hooks/use-current-user'
import { ScrollArea } from '@repo/ui/components/ui/scroll-area'
import { PublicUserType } from '../../../../data'
import ExtensionKit from '@/extensions/extension-kit'
import StarterKit from '@tiptap/starter-kit'

export const SimpleEditor = () => {
  const menuContainerRef = useRef(null)
  const editorRef = useRef<HTMLDivElement | null>(null)

  const editor = useEditor({
    autofocus: true,

    extensions: [StarterKit],
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        class: '',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    // <ScrollArea className="max-h-16">
    <div className="flex flex-col" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-fit ">
        <EditorContent
          editor={editor}
          ref={editorRef}
          className="px-6 py-2 z-0 bg-secondary/20 overflow-y-auto rounded-md text-sm"
        />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
    // </ScrollArea>
  )
}

export default SimpleEditor
