"use client";
import {
  Home,
  Settings2,
  Moon,
  Mic,
  Headphones,
  Wifi,
  LogOut,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { SidebarItemBtn } from "./sidebar-item-btn";

function UserCard() {
  return (
    <footer className="flex  flex-col gap-2 border-t border-border/50 py-2 pl-5 pr-3.5">
      <div className="flex items-center justify-start gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>AY</AvatarFallback>
          <AvatarImage
            src="https://avatars.githubusercontent.com/u/69762132?v=4"
            alt="Amr Yasser"
          />
        </Avatar>
        <div className=" flex flex-col -space-y-1">
          <span className="text-sm">Amr Yasser</span>
          <span className="text-[10px]">Amr21-</span>
        </div>

        <div className="ml-auto">
          <SidebarItemBtn Icon={Home} className="inline-flex" />
          <SidebarItemBtn Icon={Settings2} className="inline-flex" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <SidebarItemBtn
            Icon={Moon}
            className="inline-flex"
            iconClassName="fill-yellow-500  opacity-100 stroke-yellow-500"
          >
            Idle
          </SidebarItemBtn>
        </div>

        <div className="flex">
          <SidebarItemBtn Icon={Mic} className="inline-flex" />
          <SidebarItemBtn Icon={Headphones} className="inline-flex" />
          <SidebarItemBtn Icon={Wifi} className="inline-flex" />
          <SidebarItemBtn Icon={LogOut} className="inline-flex" />
        </div>
      </div>
    </footer>
  );
}

export { UserCard };
