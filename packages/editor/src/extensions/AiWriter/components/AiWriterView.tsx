import { Extension, NodeViewWrapper, NodeViewWrapperProps } from '@tiptap/react'
import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuid } from 'uuid'

// import { Button } from '../../../components/ui/Button'
import { Loader } from '../../../components/ui/Loader'
import { Panel, PanelHeadline } from '../../../components/ui/Panel'
import { Textarea } from '../../../components/ui/Textarea'
import { Icon } from '../../../components/ui/Icon'

import { AiTone, AiToneOption } from '../../../components/BlockEditor/types'
import { tones } from '../../../lib/constants'

import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { Toolbar } from '../../../components/ui/Toolbar'
import { Surface } from '../../../components/ui/Surface'
import { DropdownButton } from '../../../components/ui/Dropdown'
import { Check, ChevronDown, Mic, Repeat, Sparkles, Trash, Undo2 } from 'lucide-react'
import { Prompt } from '../../../../../data'
import { env } from '@repo/env'
import { useParams } from 'next/navigation'
import { useCurrentWorkspace } from '@repo/ui/hooks/use-current-workspace'
import { Button } from '@repo/ui/components/ui/button'

export interface DataProps {
  text: string
  addHeading: boolean
  tone?: AiTone
  textUnit?: string
  textLength?: string
  language?: string
}

export const AiWriterView = ({ editor, node, getPos, deleteNode }: NodeViewWrapperProps) => {
  const aiOptions = editor.extensionManager.extensions.find((ext: Extension) => ext.name === 'ai')?.options

  const { channelId, folderId, teamId } = useParams<{ channelId: string; teamId: string; folderId: string }>()

  const { workspaceId } = useCurrentWorkspace()

  const [data, setData] = useState<DataProps>({
    text: '',
    tone: undefined,
    textLength: undefined,
    addHeading: false,
    language: undefined,
  })
  const currentTone = tones.find(t => t.value === data.tone)
  const [previewText, setPreviewText] = useState<string | undefined>(undefined)
  const [isFetching, setIsFetching] = useState(false)
  const textareaId = useMemo(() => uuid(), [])

  const generateText = useCallback(async () => {
    const { text: dataText, tone, textLength, textUnit, addHeading, language } = data

    if (!data.text) {
      toast.error('Please enter a description')

      return
    }

    if (!workspaceId) {
      return
    }

    setIsFetching(true)

    const payload: Prompt = {
      prompt: dataText,
    }

    try {
      // const { baseUrl, appId, token } = aiOptions
      const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/page/${channelId}/prompt`, {
        method: 'POST',
        headers: {
          'x-workspace-id': workspaceId,
          'x-team-id': teamId,
          'x-folder-id': folderId,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const json = await response.json<{ response: string }>()

      const text = json.response
      if (!text.length) {
        setIsFetching(false)

        return
      }

      setPreviewText(text)

      setIsFetching(false)
    } catch (errPayload: any) {
      const errorMessage = errPayload?.response?.data?.error
      const message = errorMessage !== 'An error occurred' ? `An error has occured: ${errorMessage}` : errorMessage

      setIsFetching(false)
      toast.error(message)
    }
  }, [data, workspaceId])

  const insert = useCallback(() => {
    const from = getPos()
    const to = from + node.nodeSize

    editor.chain().focus().insertContentAt({ from, to }, previewText).run()
  }, [editor, previewText, getPos, node.nodeSize])

  const discard = useCallback(() => {
    deleteNode()
  }, [deleteNode])

  const onTextAreaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(prevData => ({ ...prevData, text: e.target.value }))
  }, [])

  const onUndoClick = useCallback(() => {
    setData(prevData => ({ ...prevData, tone: undefined }))
  }, [])

  const createItemClickHandler = useCallback((tone: AiToneOption) => {
    return () => {
      setData(prevData => ({ ...prevData, tone: tone.value }))
    }
  }, [])

  return (
    <NodeViewWrapper data-drag-handle>
      <Panel noShadow className="w-full ">
        <div className="flex flex-col p-1 bg-dim">
          {previewText && (
            <>
              <PanelHeadline>Preview</PanelHeadline>
              <div
                className="bg-white dark:bg-black border-l-4 border-neutral-100 dark:border-neutral-700 text-black dark:text-white text-base max-h-[14rem] mb-4 ml-2.5 overflow-y-auto px-4 relative"
                dangerouslySetInnerHTML={{ __html: previewText }}
              />
            </>
          )}
          <div className="flex flex-row items-center justify-between gap-1">
            <PanelHeadline asChild>
              <label htmlFor={textareaId}>Prompt</label>
            </PanelHeadline>
          </div>
          <Textarea
            id={textareaId}
            value={data.text}
            onChange={onTextAreaChange}
            placeholder={'Tell me what you want me to write about.'}
            required
            className="mb-2"
          />
          <div className="flex flex-row items-center justify-between gap-1">
            <div className="flex justify-between w-auto gap-1">
              {/* <Dropdown.Root>
                <Dropdown.Trigger asChild>
                  <Button variant="tertiary">
                    <Icon Icon={Mic} />
                    {currentTone?.label || 'Change tone'}
                    <Icon Icon={ChevronDown} />
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Portal>
                  <Dropdown.Content side="bottom" align="start" asChild>
                    <Surface className="p-2 min-w-[12rem] ">
                      {!!data.tone && (
                        <>
                          <Dropdown.Item asChild>
                            <DropdownButton isActive={data.tone === undefined} onClick={onUndoClick}>
                              <Icon Icon={Undo2} />
                              Reset
                            </DropdownButton>
                          </Dropdown.Item>
                          <Toolbar.Divider horizontal />
                        </>
                      )}
                      {tones.map(tone => (
                        <Dropdown.Item asChild key={tone.value}>
                          <DropdownButton isActive={tone.value === data.tone} onClick={createItemClickHandler(tone)}>
                            {tone.label}
                          </DropdownButton>
                        </Dropdown.Item>
                      ))}
                    </Surface>
                  </Dropdown.Content>
                </Dropdown.Portal>
              </Dropdown.Root> */}
            </div>
            <div className="flex justify-between w-auto gap-1">
              {true && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  onClick={discard}
                >
                  <Icon Icon={Trash} className="shrink-0 mr-1" />
                  Discard
                </Button>
              )}
              {previewText && (
                <Button size="sm" variant="ghost" onClick={insert} disabled={!previewText}>
                  <Icon Icon={Check} className="shrink-0 mr-1" />
                  Insert
                </Button>
              )}
              <Button
                size="sm"
                variant="default"
                onClick={generateText}
                style={{ whiteSpace: 'nowrap' }}
                isPending={isFetching}
                className="w-36"
              >
                {previewText ? (
                  <Icon Icon={Repeat} className="shrink-0 mr-1" />
                ) : (
                  <Icon Icon={Sparkles} className="shrink-0 mr-1" />
                )}
                {previewText ? 'Regenerate' : 'Generate text'}
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </NodeViewWrapper>
  )
}
