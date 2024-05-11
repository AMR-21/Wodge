import { memo } from 'react'
import { EditorUser } from './types'
import { TooltipWrapper } from '@/components/tooltip-wrapper'
import { SafeAvatar } from '@/components/safe-avatar'

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
                 <SafeAvatar 
                 
                 src={user.avatar}
                 fallback={user.name}
                  
                 />
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
