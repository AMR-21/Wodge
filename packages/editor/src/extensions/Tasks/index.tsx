import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import KanbanBoard from './kanban-board'
import { Column, Task } from './task-card'
import { nanoid } from 'nanoid'

import { atom } from 'jotai'
import * as Y from 'yjs'

export const yDocAtom = atom<Y.Doc | undefined>(undefined)

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    'kanban-board': {
      addCol: () => ReturnType
    }
  }
}

export default Node.create({
  name: 'kanban-board',
  group: 'block',

  addStorage() {
    return {
      columns: [] as Column[],
      tasks: [] as Task[],
    }
  },

  parseHTML() {
    return [
      {
        tag: 'kanban-board',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['kanban-board', mergeAttributes(HTMLAttributes)]
  },
  addNodeView() {
    return ReactNodeViewRenderer(KanbanBoard)
  },

  addAttributes() {
    return {
      'data-id': {
        default: nanoid(6),
      },
    }
  },

  addCommands() {
    return {
      addCol:
        () =>
        ({ chain }) => {
          this.storage.columns.push({
            id: nanoid(6),
            title: 'New Column',
          })
          return chain().focus().run()
        },
    }
  },
})
