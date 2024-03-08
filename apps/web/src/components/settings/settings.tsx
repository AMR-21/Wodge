"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  ButtonProps,
  cn,
  useIsDesktop,
} from "@repo/ui";
import { SidebarItem } from "../workspace/sidebar-item";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { ChevronRight, LucideIcon, PanelLeft, Plus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SidebarItemBtn } from "../workspace/sidebar-item-btn";
import { IconType } from "react-icons/lib";
import { produce } from "immer";

interface Settings {
  active: string;
  isSidebarOpen: boolean;
  activeItemId: string;
  accordionActive: string;
  dispatch: React.Dispatch<any>;
}

interface SettingsState {
  active: string;
  isSidebarOpen: boolean;
  activeItemId: string;
  accordionActive: string;
}

const SettingsContext = createContext<Settings>({
  active: "",
  isSidebarOpen: true,
  activeItemId: "",
  accordionActive: "",
  dispatch: () => {},
});

function reducer(state: SettingsState, action: any) {
  switch (action.type) {
    case "setSidebar":
      return produce(state, (draft) => {
        draft.isSidebarOpen = action.payload;
      });
    case "toggleSidebar":
      return produce(state, (draft) => {
        draft.isSidebarOpen = !draft.isSidebarOpen;
      });
    case "openNormalItem":
      return produce(state, (draft) => {
        draft.active = action.payload.value;
        draft.activeItemId = "";
        draft.accordionActive = "";
        draft.isSidebarOpen = action.payload.isSidebarOpen;
      });
    case "activateAccordion":
      return produce(state, (draft) => {
        draft.accordionActive = action.payload;
      });
    case "openAccordionItem":
      return produce(state, (draft) => {
        draft.activeItemId = action.payload.id;
        draft.active = action.payload.value;
        draft.accordionActive = action.payload.value;
        draft.isSidebarOpen = action.payload.isSidebarOpen;
      });

    case "openAdd":
      return produce(state, (draft) => {
        draft.activeItemId = "add";
        draft.active = action.payload.value;

        draft.isSidebarOpen = action.payload.isSidebarOpen;
      });

    case "closeAccordion":
      return produce(state, (draft) => {
        // draft.activeItemId = "";
        // draft.active = "";
        draft.accordionActive = "";
      });

    default:
      return state;
  }
}

function Settings({
  children,
  defaultActive = "",
}: {
  defaultActive?: string;
  children: React.ReactNode;
}) {
  const isDesktop = useIsDesktop();

  const [{ accordionActive, active, activeItemId, isSidebarOpen }, dispatch] =
    useReducer(reducer, {
      active: "teams",
      isSidebarOpen: isDesktop,
      activeItemId: "2",
      accordionActive: "teams",
    });

  useEffect(() => {
    dispatch({ type: "setSidebar", payload: isDesktop });
  }, [isDesktop]);

  return (
    <SettingsContext.Provider
      value={{
        active,
        isSidebarOpen,
        activeItemId,
        accordionActive,
        dispatch,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

function SettingsSidebar({ children }: { children: React.ReactNode }) {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isSidebarOpen, dispatch } = useContext(SettingsContext);

  return (
    <>
      <div
        className={cn(
          "flex h-dvh min-h-0  shrink-0 grow flex-col border-r border-border/50  py-10 transition-all ",
          isSidebarOpen && "w-56 max-w-56 px-6",

          !isSidebarOpen && "invisible w-0 max-w-0 border-0 px-0",
        )}
      >
        <div className="flex justify-between pb-6 text-muted-foreground">
          <h2 className={(!isSidebarOpen && "invisible") || ""}>Settings</h2>
          <SidebarItemBtn
            Icon={PanelLeft}
            onClick={() => dispatch({ type: "toggleSidebar" })}
            className={(!isSidebarOpen && "invisible") || ""}
          />
        </div>
        <div className="flex-1 overflow-y-scroll">{children}</div>
      </div>
    </>
  );
}

function SettingsSidebarList({ children }: { children: React.ReactNode }) {
  const { active } = useContext(SettingsContext);
  return (
    <Accordion type="single" collapsible>
      <ul className="flex flex-col gap-1 py-3">{children}</ul>
    </Accordion>
  );
}

function SettingsSidebarHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
      {children}
    </div>
  );
}

function SettingsSidebarItem({ value }: { value: string }) {
  const { active, activeItemId, dispatch } = useContext(SettingsContext);
  const isDesktop = useIsDesktop();

  return (
    <AccordionItem value={value}>
      <AccordionTrigger asChild>
        <SidebarItem
          noIcon
          label={value}
          className={cn(
            "justify-start py-1.5 pl-7 pr-1.5 capitalize",
            active === value && "bg-accent text-accent-foreground",
          )}
          onClick={() => {
            dispatch({
              type: "openNormalItem",
              payload: { value, isSidebarOpen: isDesktop },
            });
          }}
        />
      </AccordionTrigger>
    </AccordionItem>
  );
}

function SettingsSidebarAccordionItem({
  value,
  children,
  action,
  actionIcon,
}: {
  value: string;
  children?: React.ReactNode;
  action?: () => void;
  actionIcon?: LucideIcon | IconType;
}) {
  const { activeItemId, accordionActive, dispatch } =
    useContext(SettingsContext);
  const isDesktop = useIsDesktop();

  return (
    <AccordionItem value={value}>
      <AccordionTrigger asChild>
        <SidebarItem
          noIcon
          label={value}
          className={cn(
            "justify-start gap-1 py-1.5 pl-7 pr-1.5 capitalize",
            activeItemId && "bg-accent text-accent-foreground",
          )}
          onClick={() => {
            if (accordionActive === value)
              return dispatch({ type: "closeAccordion" });
            dispatch({ type: "activateAccordion", payload: value });
          }}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 rotate-0 transition-all",
              accordionActive === value && "rotate-90",
              // active === value && "rotate-90",
            )}
          />

          <SidebarItemBtn
            Icon={actionIcon || Plus}
            onClick={(e) => {
              e.stopPropagation();
              dispatch({
                type: "openAdd",
                payload: { value, isSidebarOpen: isDesktop },
              });
            }}
            className={cn(
              "invisible -my-1 ml-auto transition-all",
              accordionActive === value && "visible",
            )}
          />
        </SidebarItem>
      </AccordionTrigger>
      <AccordionContent className="py-1.5 pl-7">{children}</AccordionContent>
    </AccordionItem>
  );
}

function SettingsContent({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { isSidebarOpen, dispatch, active } = useContext(SettingsContext);

  if (active !== id) return null;

  return (
    <div className="flex w-full basis-full justify-center overflow-y-scroll bg-page px-4 py-10">
      <div
        className={cn(
          "flex w-full max-w-2xl shrink-0 grow flex-col items-center",
          className,
        )}
      >
        <div className="h-[2.75rem] w-full shrink-0 ">
          <div className="flex w-full items-start justify-between">
            <SidebarItemBtn
              Icon={PanelLeft}
              className={cn(
                "-ml-1 w-fit opacity-100  transition-all duration-300",
                isSidebarOpen && "invisible opacity-0",
              )}
              onClick={() => dispatch({ type: "toggleSidebar" })}
            />

            <SettingsClose />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

function SettingsContentHeader({
  label,
  description,
}: {
  label?: string;
  description: string;
}) {
  return (
    <div className="pb-6">
      <div className="space-y-1.5">
        <h2 className="text-xl">{label}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function SettingsContentSection({
  children,
  header,
  action,
  className,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  header?: string;
  className?: string;
}) {
  return (
    <div className="py-6">
      <div className="flex items-center justify-between pb-4">
        <h3 className=" text-base">{header}</h3>
        {action}
      </div>
      <div className={className}>{children}</div>
    </div>
  );
}

function SettingsContentDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function SettingsContentAction(props: ButtonProps) {
  return <Button {...props} size="sm" className="w-fit" />;
}

function SettingsClose() {
  const { workspaceId }: { workspaceId: string } = useParams();
  const router = useRouter();

  return (
    <Button
      className="-mr-1  items-start
       p-0 text-muted-foreground/70 transition-all hover:text-foreground"
      size="fit"
      variant="link"
      onClick={() => router.push("/workspaces/" + workspaceId)}
    >
      <X className="h-6 w-6" />
    </Button>
  );
}

export {
  SettingsContext,
  Settings,
  SettingsSidebar,
  SettingsSidebarList,
  SettingsSidebarHeader,
  SettingsSidebarItem,
  SettingsContent,
  SettingsClose,
  SettingsContentHeader,
  SettingsContentSection,
  SettingsContentDescription,
  SettingsContentAction,
  SettingsSidebarAccordionItem,
};
