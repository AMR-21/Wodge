import { Icon } from '../../ui/Icon'
import { Toolbar } from '../../ui/Toolbar'
import { useTextmenuCommands } from './hooks/useTextmenuCommands'
import { useTextmenuStates } from './hooks/useTextmenuStates'
import { BubbleMenu, Editor } from '@tiptap/react'
import { memo } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Surface } from '../../ui/Surface'
import { ColorPicker } from '../../panels'
import { FontFamilyPicker } from './components/FontFamilyPicker'
import { FontSizePicker } from './components/FontSizePicker'
import { useTextmenuContentTypes } from './hooks/useTextmenuContentTypes'
import { ContentTypePicker } from './components/ContentTypePicker'
import { AIDropdown } from './components/AIDropdown'
import { EditLinkPopover } from './components/EditLinkPopover'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Highlighter,
  Italic,
  MoreVertical,
  Palette,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from 'lucide-react'

// We memorize the button so each button is not rerendered
// on every editor state change
const MemoButton = memo(Toolbar.Button)
const MemoColorPicker = memo(ColorPicker)
const MemoFontFamilyPicker = memo(FontFamilyPicker)
const MemoFontSizePicker = memo(FontSizePicker)
const MemoContentTypePicker = memo(ContentTypePicker)

export type TextMenuProps = {
  editor: Editor
}

export const TextMenu = ({ editor }: TextMenuProps) => {
  const commands = useTextmenuCommands(editor)
  const states = useTextmenuStates(editor)
  const blockOptions = useTextmenuContentTypes(editor)

  return (
    <BubbleMenu
      tippyOptions={{ popperOptions: { placement: 'auto-start' } }}
      editor={editor}
      pluginKey="textMenu"
      shouldShow={states.shouldShow}
      updateDelay={100}
      className="z-50"
    >
      <Toolbar.Wrapper>
        <AIDropdown
        // onCompleteSentence={commands.onCompleteSentence}
        // onEmojify={commands.onEmojify}
        // onFixSpelling={commands.onFixSpelling}
        // onMakeLonger={commands.onMakeLonger}
        // onMakeShorter={commands.onMakeShorter}
        // onSimplify={commands.onSimplify}
        // onTldr={commands.onTldr}
        // onTone={commands.onTone}
        // onTranslate={commands.onTranslate}
        />
        <Toolbar.Divider />
        <MemoContentTypePicker options={blockOptions} />
        <MemoFontFamilyPicker onChange={commands.onSetFont} value={states.currentFont || ''} />
        <MemoFontSizePicker onChange={commands.onSetFontSize} value={states.currentSize || ''} />
        <Toolbar.Divider />
        <MemoButton tooltip="Bold" tooltipShortcut={['Mod', 'B']} onClick={commands.onBold} active={states.isBold}>
          <Icon Icon={Bold} />
        </MemoButton>
        <MemoButton
          tooltip="Italic"
          tooltipShortcut={['Mod', 'I']}
          onClick={commands.onItalic}
          active={states.isItalic}
        >
          <Icon Icon={Italic} />
        </MemoButton>
        <MemoButton
          tooltip="Underline"
          tooltipShortcut={['Mod', 'U']}
          onClick={commands.onUnderline}
          active={states.isUnderline}
        >
          <Icon Icon={Underline} />
        </MemoButton>
        <MemoButton
          tooltip="Strikehrough"
          tooltipShortcut={['Mod', 'X']}
          onClick={commands.onStrike}
          active={states.isStrike}
        >
          <Icon Icon={Strikethrough} />
        </MemoButton>
        <MemoButton tooltip="Code" tooltipShortcut={['Mod', 'E']} onClick={commands.onCode} active={states.isCode}>
          <Icon Icon={Code} />
        </MemoButton>
        <MemoButton tooltip="Code block" onClick={commands.onCodeBlock}>
          <Icon Icon={Code2} />
        </MemoButton>
        <EditLinkPopover onSetLink={commands.onLink} />
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton active={!!states.currentHighlight} tooltip="Highlight text">
              <Icon Icon={Highlighter} />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="top" sideOffset={8} asChild>
            <Surface className="p-1">
              <MemoColorPicker
                color={states.currentHighlight}
                onChange={commands.onChangeHighlight}
                onClear={commands.onClearHighlight}
              />
            </Surface>
          </Popover.Content>
        </Popover.Root>
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton active={!!states.currentColor} tooltip="Text color">
              <Icon Icon={Palette} />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="top" sideOffset={8} asChild>
            <Surface className="p-1">
              <MemoColorPicker
                color={states.currentColor}
                onChange={commands.onChangeColor}
                onClear={commands.onClearColor}
              />
            </Surface>
          </Popover.Content>
        </Popover.Root>
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton tooltip="More options">
              <Icon Icon={MoreVertical} />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="top" asChild>
            <Toolbar.Wrapper>
              <MemoButton
                tooltip="Subscript"
                tooltipShortcut={['Mod', '.']}
                onClick={commands.onSubscript}
                active={states.isSubscript}
              >
                <Icon Icon={Subscript} />
              </MemoButton>
              <MemoButton
                tooltip="Superscript"
                tooltipShortcut={['Mod', ',']}
                onClick={commands.onSuperscript}
                active={states.isSuperscript}
              >
                <Icon Icon={Superscript} />
              </MemoButton>
              <Toolbar.Divider />
              <MemoButton
                tooltip="Align left"
                tooltipShortcut={['Shift', 'Mod', 'L']}
                onClick={commands.onAlignLeft}
                active={states.isAlignLeft}
              >
                <Icon Icon={AlignLeft} />
              </MemoButton>
              <MemoButton
                tooltip="Align center"
                tooltipShortcut={['Shift', 'Mod', 'E']}
                onClick={commands.onAlignCenter}
                active={states.isAlignCenter}
              >
                <Icon Icon={AlignCenter} />
              </MemoButton>
              <MemoButton
                tooltip="Align right"
                tooltipShortcut={['Shift', 'Mod', 'R']}
                onClick={commands.onAlignRight}
                active={states.isAlignRight}
              >
                <Icon Icon={AlignRight} />
              </MemoButton>
              <MemoButton
                tooltip="Justify"
                tooltipShortcut={['Shift', 'Mod', 'J']}
                onClick={commands.onAlignJustify}
                active={states.isAlignJustify}
              >
                <Icon Icon={AlignJustify} />
              </MemoButton>
            </Toolbar.Wrapper>
          </Popover.Content>
        </Popover.Root>
      </Toolbar.Wrapper>
    </BubbleMenu>
  )
}
