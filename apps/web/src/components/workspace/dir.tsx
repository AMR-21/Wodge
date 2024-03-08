import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui";
import { SidebarItem } from "./sidebar-item";
import { ChevronRight, Component, MoreHorizontal } from "lucide-react";
import { SidebarItemBtn } from "./sidebar-item-btn";

export function Dir({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <AccordionItem value={id}>
        <AccordionTrigger className="mb-1" asChild>
          <SidebarItem label="UX Team" Icon={Component}>
            <ChevronRight className="ml-1.5 h-3.5 w-3.5 min-w-3.5 max-w-3.5 transition-transform group-data-[state=open]:rotate-90" />
            <SidebarItemBtn Icon={MoreHorizontal} className="-my-1 ml-auto" />
          </SidebarItem>
        </AccordionTrigger>
        <AccordionContent className="pl-4">{children}</AccordionContent>
      </AccordionItem>
    </div>
  );
}
