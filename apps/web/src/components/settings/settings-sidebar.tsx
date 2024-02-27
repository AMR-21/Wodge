"use client";

import { Button, cn } from "@repo/ui";
import { SidebarItem } from "../workspace/sidebar-item";
import { createContext, useContext, useState } from "react";
import { X } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";

interface Settings {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

const SettingsContext = createContext<Settings>({
  active: "",
  setActive: () => {},
});

export function Settings({
  children,
  defaultActive = "",
}: {
  defaultActive?: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<string>(defaultActive);

  return (
    <SettingsContext.Provider value={{ active, setActive }}>
      <div className="flex h-full">{children}</div>
    </SettingsContext.Provider>
  );
}

function SettingsSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-56 max-w-56 shrink-0 grow space-y-2.5 border-r border-border/50 px-4 py-4">
      {children}
    </div>
  );
}

function SettingsSidebarList({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-1">{children}</ul>;
}

function SettingsSidebarHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function SettingsSidebarItem({ value }: { value: string }) {
  const { setActive, active } = useContext(SettingsContext);

  return (
    <SidebarItem
      noIcon
      label={value}
      className={cn(
        "justify-start py-1.5 pl-7 pr-1.5 capitalize",
        active === value && "bg-accent text-accent-foreground",
      )}
      onClick={() => {
        setActive(value);
      }}
    />
  );
}

function SettingsContent({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { active } = useContext(SettingsContext);

  if (active !== id) return null;

  return <div className="w-full bg-page px-4 py-4">{children}</div>;
}

function SettingsClose() {
  const { workspaceId }: { workspaceId: string } = useParams();
  const router = useRouter();

  return (
    <Button
      className="fixed right-4 top-4 rounded-full text-muted-foreground/70 transition-all
       hover:text-foreground"
      size="icon"
      variant="secondary"
      onClick={() => router.push("/" + workspaceId)}
    >
      <X />
    </Button>
  );
}

Settings.Sidebar = SettingsSidebar;
Settings.SidebarList = SettingsSidebarList;
Settings.SidebarHeader = SettingsSidebarHeader;
Settings.SidebarItem = SettingsSidebarItem;
Settings.Content = SettingsContent;
Settings.Close = SettingsClose;
