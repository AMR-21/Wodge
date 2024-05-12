import { Camera, MonitorUp, PhoneCall, PhoneOff } from "lucide-react";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { useAtom, useAtomValue } from "jotai";
import { isCallWindowOpenAtom, isSidebarOpenAtom } from "@/store/global-atoms";
import { useAppStore } from "@/store/app-store-provider";
import { cn } from "@/lib/utils";

export function CallCard() {
  const [isCallWindowOpen, setCallWindow] = useAtom(isCallWindowOpenAtom);
  const {
    micStatus,
    camStatus,
    screenStatus,
    actions: { toggleCam, toggleMic, toggleScreen },
    room,
  } = useAppStore((s) => s);
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);

  return (
    <div
      className={cn(
        "flex w-60 flex-col overflow-hidden border-r border-t border-border/50 bg-background px-2 py-2.5 transition-all",
        !isSidebarOpen && "w-0 px-0",
      )}
    >
      <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
        <PhoneCall className="size-4" />
        <p className="">Connected</p>
      </div>

      <Button
        size="fit"
        variant="link"
        className="mb-2 w-full justify-start truncate rounded-none p-0 px-0.5 text-muted-foreground hover:text-foreground"
        onClick={() => {
          setCallWindow((c) => !c);
        }}
      >
        <span className="truncate">
          {isCallWindowOpen
            ? "Close call window"
            : `${room?.workspaceName} / ${room?.teamName} / ${room?.channelName}`}
        </span>
      </Button>
      <div className="flex gap-1">
        <Toggle
          variant="outline"
          className="group basis-1/3"
          pressed={camStatus}
          onPressedChange={() => {
            toggleCam();
          }}
        >
          <Camera className="size-5 group-data-[state=on]:text-green-600 dark:group-data-[state=on]:text-green-500" />
        </Toggle>

        <Toggle
          variant="outline"
          className="group basis-1/3"
          pressed={screenStatus}
          onPressedChange={() => {
            toggleScreen();
          }}
        >
          <MonitorUp className="size-5 group-data-[state=on]:text-green-600 dark:group-data-[state=on]:text-green-500" />
        </Toggle>

        <SidebarItemBtn
          Icon={PhoneOff}
          className="group/close basis-1/3"
          iconClassName="size-5 group-hover/close:text-red-600 dark:group-hover/close:text-red-500"
          variant="outline"
          onClick={async () => {
            await room?.room.disconnect();
          }}
        />
      </div>
    </div>
  );
}
