import { env } from '@repo/env'
import useYProvider from 'y-partykit/react'

import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { useAtom, useSetAtom } from 'jotai'
import { yDocAtom } from '../extensions/Tasks'

interface YDocProps {
  channelId: string
  folderId: string
  teamId: string
  workspaceId: string
}

export function useYDoc({ channelId, folderId, teamId, workspaceId }: YDocProps) {
  const setYDoc = useSetAtom(yDocAtom)
  const yDoc = new Y.Doc()
  const idbProvider = new IndexeddbPersistence(channelId, yDoc)

  const provider = useYProvider({
    room: channelId,
    host: env.NEXT_PUBLIC_BACKEND_DOMAIN,
    party: 'page',
    doc: yDoc,
    options: {
      params: () => ({
        folderId,
        teamId,
        workspaceId,
      }),
    },
  })

  setYDoc(provider.doc)

  return { provider, idbProvider }
}
