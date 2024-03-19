import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { SidebarItemBtn } from "../sidebar-item-btn";
import { Plus } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { useState } from "react";
import { AddChannelForm } from "./add-channel-form";

export function AddToTeamForm() {
  const [value, setValue] = useState("channel");

  return (
    <Dialog>
      <DialogTrigger className="mt-6 w-full" asChild>
        <SidebarItemBtn
          Icon={Plus}
          className="z-10 -my-1 hover:bg-transparent"
        />
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <Tabs
          value={value}
          onValueChange={setValue}
          defaultValue="channel"
          className="w-full"
        >
          <DialogHeader>
            <TabsList className="grid w-full grid-cols-2 transition-all">
              <TabsTrigger value="channel">Add a channel</TabsTrigger>
              <TabsTrigger value="folder">Add a folder</TabsTrigger>
            </TabsList>
          </DialogHeader>
          <TabsContent value="channel">
            <AddChannelForm />
          </TabsContent>
          <TabsContent value="folder">fd</TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
