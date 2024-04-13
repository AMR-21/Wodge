import { memo } from 'react'
import { EditorUser } from '../types'
import { TooltipWrapper } from '@repo/ui/components/tooltip-wrapper'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar'

export type EditorInfoProps = {
  users: EditorUser[]
}

export const EditorInfo = memo(({ users }: EditorInfoProps) => {
  return (
    <div className="flex items-center py-2">
      <div className="flex flex-row items-center">
        <div className="relative flex flex-row items-center ml-3">
          {users.map((user: EditorUser) => {
            return (
              <div key={user.clientId} className="-ml-3">
                <TooltipWrapper content={user.name}>
                  <Avatar className="cursor-pointer w-8 h-8 ring-offset-background border-2 border-background">
                    <AvatarImage src={user?.avatar || ''} />
                    <AvatarFallback>{user?.name?.at(0) || 'A'}</AvatarFallback>
                  </Avatar>
                </TooltipWrapper>
              </div>
            )
          })}
          {users.length > 5 && (
            <div className="-ml-3">
              <div className="flex items-center justify-center w-8 h-8 font-bold text-xs leading-none border border-white dark:border-black bg-[#FFA2A2] rounded-full">
                +{users.length - 3}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

EditorInfo.displayName = 'EditorInfo'
