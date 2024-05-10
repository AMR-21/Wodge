import { SafeAvatar } from '@repo/ui/components/safe-avatar'
import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@repo/ui/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/ui/popover'
import { useCurrentWorkspace } from '@repo/ui/hooks/use-current-workspace'
import { useMember } from '@repo/ui/hooks/use-member'
import { cn } from '@repo/ui/lib/utils'
import { Check, ChevronDown, Users2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { canView, Member } from '@repo/data'

interface MemberMultiSelectProps {
  onChange?: (...event: any[]) => void
  preset?: string[]
  bigger?: boolean
}

export function MemberMultiSelect({ onChange, preset, bigger }: MemberMultiSelectProps) {
  const [value, setValue] = useState<string[]>(preset || [])

  const { channelId, teamId, folderId } = useParams<{
    channelId: string
    teamId: string
    folderId: string
  }>()
  const { structure, members: membersArr } = useCurrentWorkspace()

  const members = useMemo(
    () =>
      membersArr.members.filter(m =>
        canView({
          channelId,
          teamId,
          structure,
          members: membersArr,
          channelType: 'page',
          folderId,
          userId: m.id,
        }),
      ),
    [teamId, channelId, structure, membersArr],
  )

  useEffect(() => {
    onChange?.(value)
  }, [value])

  function onSelect(m: Member) {
    if (value.some(v => v === m.id)) {
      setValue(v => v.filter(mb => mb !== m.id))
    } else {
      setValue(v => [...new Set([...v, members.find(mb => mb.id === m.id)!.id])])
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            buttonVariants({ variant: 'ghost', size: bigger ? 'sm' : 'fit' }),
            'max-h-7 justify-start gap-2 overflow-hidden text-sm',
            bigger && 'max-h-20 text-sm',
          )}
        >
          {bigger && (
            <div className="flex w-36 items-center gap-2">
              <Users2 className="text h-4 w-4" />
              <p className="text-muted-foreground">Collaborators</p>
            </div>
          )}
          {value.length === 0 && (
            <>
              {!bigger && <Users2 className="text h-4 w-4" />}
              <p className="text-muted-foreground">{bigger ? 'Empty' : 'Add assignee'}</p>
            </>
          )}
          {value.length >= 1 && <MemberItem bigger memberObj={members.find(m => m.id === value[0])} />}
          {value.length > 1 && <p className={cn('text-xs text-muted-foreground')}>+{value.length - 1} more</p>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-transparent p-0">
        <Command>
          <CommandInput placeholder="Search members..." />
          <CommandEmpty>No members found.</CommandEmpty>
          <CommandGroup>
            {members.map(m => (
              <MemberItem isCommand value={value} key={m.id} memberObj={m} onSelect={onSelect} />
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function MemberItem({
  memberObj,
  isCommand,
  onSelect,
  value,
  bigger,
}: {
  memberObj?: Member
  isCommand?: boolean
  onSelect?: (m: Member) => void
  value?: string[]
  bigger?: boolean
}) {
  const { member } = useMember(memberObj?.id || '')

  if (!memberObj || !member) return null

  if (isCommand) {
    return (
      <CommandItem
        key={member.id}
        value={member?.displayName + ' ' + member?.email + ' ' + member?.username}
        onSelect={() => {
          console.log('onSelect')
          onSelect?.(memberObj)
        }}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <SafeAvatar src={member?.avatar} fallback={member?.displayName} className="h-6 w-6" />
            <p className="flex select-none items-center truncate">
              {member.displayName}
              <span className="ml-1 text-xs text-muted-foreground">@{member.username}</span>
            </p>
          </div>
          <Check className={cn('h-4 w-4', value?.some(v => v === memberObj.id) ? 'opacity-100' : 'opacity-0')} />
        </div>
      </CommandItem>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <SafeAvatar src={member?.avatar} fallback={member?.displayName} className={cn('h-4 w-4', bigger && 'h-5 w-5')} />
      <p className="flex select-none items-center truncate">
        {member.displayName}
        <span className="ml-1 text-xs text-muted-foreground">@{member.username}</span>
      </p>
    </div>
  )
}
