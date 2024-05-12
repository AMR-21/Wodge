import { memo } from "react";
import { EditorUser } from "./types";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { SafeAvatar } from "@/components/safe-avatar";

export type EditorInfoProps = {
  users: EditorUser[];
};

export const EditorInfo = memo(({ users }: EditorInfoProps) => {
  console.log(users);
  return (
    <div className="flex items-center py-2">
      <div className="flex flex-row items-center">
        <div className="relative ml-3 flex flex-row items-center">
          {users.map((user: EditorUser) => {
            return (
              <div key={user.clientId} className="-ml-3">
                <TooltipWrapper content={user.name}>
                  <SafeAvatar
                    className="h-8 w-8"
                    src={user.avatar}
                    fallback={user.name}
                    color={user.color}
                  />
                </TooltipWrapper>
              </div>
            );
          })}
          {users.length > 5 && (
            <div className="-ml-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-[#FFA2A2] text-xs font-bold leading-none dark:border-black">
                +{users.length - 3}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

EditorInfo.displayName = "EditorInfo";
