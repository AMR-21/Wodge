import { DropdownButton } from '../../../../components/ui/Dropdown'
import { Icon } from '../../../../components/ui/Icon'
import { Surface } from '../../../../components/ui/Surface'
import { Toolbar } from '../../../../components/ui/Toolbar'
import { languages, tones } from '../../../../lib/constants'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronDown,
  ChevronRight,
  CircleSlash,
  Eraser,
  Languages,
  Mic,
  MoreHorizontal,
  PenLine,
  SmilePlus,
  Sparkles,
} from 'lucide-react'
import { useCallback } from 'react'

export type AIDropdownProps = {
  onSimplify?: () => void
  onFixSpelling?: () => void
  onMakeShorter?: () => void
  onMakeLonger?: () => void
  onEmojify?: () => void
  onTldr?: () => void
  onTranslate?: (language: string) => void
  onTone?: (tone: string) => void
  onCompleteSentence?: () => void
}

export const AIDropdown = ({
  onCompleteSentence,
  onEmojify,
  onFixSpelling,
  onMakeLonger,
  onMakeShorter,
  onSimplify,
  onTldr,
  onTone,
  onTranslate,
}: AIDropdownProps) => {
  const handleTone = useCallback((tone: string) => () => onTone?.(tone), [onTone])
  const handleTranslate = useCallback((language: string) => () => onTranslate?.(language), [onTranslate])

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Toolbar.Button
          className="text-purple-500 hover:text-purple-600 active:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 dark:active:text-purple-400"
          activeClassname="text-purple-600 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-200"
        >
          <Icon Icon={Sparkles} className="mr-1" />
          AI Tools
          <Icon Icon={ChevronDown} className="w-2 h-2 ml-1" />
        </Toolbar.Button>
      </Dropdown.Trigger>
      <Dropdown.Content asChild>
        <Surface className="p-2 min-w-[10rem]">
          <Dropdown.Item onClick={onSimplify}>
            <DropdownButton>
              <Icon Icon={CircleSlash} />
              Simplify
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Item onClick={onFixSpelling}>
            <DropdownButton>
              <Icon Icon={Eraser} />
              Fix spelling & grammar
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Item onClick={onMakeShorter}>
            <DropdownButton>
              <Icon Icon={ArrowLeftToLine} />
              Make shorter
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Item onClick={onMakeLonger}>
            <DropdownButton>
              <Icon Icon={ArrowRightToLine} />
              Make longer
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>
              <DropdownButton>
                <Icon Icon={Mic} />
                Change tone
                <Icon Icon={ChevronRight} className="w-4 h-4 ml-auto" />
              </DropdownButton>
            </Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Surface className="flex flex-col min-w-[15rem] p-2 max-h-[20rem] overflow-auto">
                {tones.map(tone => (
                  <Dropdown.Item onClick={handleTone(tone.value)} key={tone.value}>
                    <DropdownButton>{tone.label}</DropdownButton>
                  </Dropdown.Item>
                ))}
              </Surface>
            </Dropdown.SubContent>
          </Dropdown.Sub>
          <Dropdown.Item onClick={onTldr}>
            <DropdownButton>
              <Icon Icon={MoreHorizontal} />
              Tl;dr:
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Item onClick={onEmojify}>
            <DropdownButton>
              <Icon Icon={SmilePlus} />
              Emojify
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>
              <DropdownButton>
                <Icon Icon={Languages} />
                Translate
                <Icon Icon={ChevronRight} className="w-4 h-4 ml-auto" />
              </DropdownButton>
            </Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Surface className="flex flex-col min-w-[15rem] p-2 max-h-[20rem] overflow-auto">
                {languages.map(lang => (
                  <Dropdown.Item onClick={handleTranslate(lang.value)} key={lang.value}>
                    <DropdownButton>{lang.label}</DropdownButton>
                  </Dropdown.Item>
                ))}
              </Surface>
            </Dropdown.SubContent>
          </Dropdown.Sub>
          <Dropdown.Item onClick={onCompleteSentence}>
            <DropdownButton>
              <Icon Icon={PenLine} />
              Complete sentence
            </DropdownButton>
          </Dropdown.Item>
        </Surface>
      </Dropdown.Content>
    </Dropdown.Root>
  )
}
