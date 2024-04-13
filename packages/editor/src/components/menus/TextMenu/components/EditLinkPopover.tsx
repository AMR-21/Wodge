import { LinkEditorPanel } from '../../../../components/panels'
import { Icon } from '../../../../components/ui/Icon'
import { Toolbar } from '../../../../components/ui/Toolbar'
import * as Popover from '@radix-ui/react-popover'
import { Link } from 'lucide-react'

export type EditLinkPopoverProps = {
  onSetLink: (link: string, openInNewTab?: boolean) => void
}

export const EditLinkPopover = ({ onSetLink }: EditLinkPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Toolbar.Button tooltip="Set Link">
          <Icon Icon={Link} />
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Content>
        <LinkEditorPanel onSetLink={onSetLink} />
      </Popover.Content>
    </Popover.Root>
  )
}
