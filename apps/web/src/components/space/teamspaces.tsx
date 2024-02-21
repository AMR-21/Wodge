import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../packages/ui";
import { SidebarItem } from "./sidebar-item";
import { ChevronRight, Component, MoreHorizontal } from "lucide-react";
import { SidebarItemBtn } from "./sidebar-item-btn";

export function Teamspaces() {
  return (
    <div>
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger className="mb-1" asChild>
            <SidebarItem label="UX Team" Icon={Component}>
              <ChevronRight className="ml-1.5 h-3.5 w-3.5 min-w-3.5 max-w-3.5 transition-transform group-data-[state=open]:rotate-90" />
              <SidebarItemBtn Icon={MoreHorizontal} className="-my-1 ml-auto" />
            </SidebarItem>
          </AccordionTrigger>
          <AccordionContent>
            <SidebarItem label="channel" className="pl-5" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// Teamspace
