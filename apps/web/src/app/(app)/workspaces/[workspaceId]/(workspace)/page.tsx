"use client";

import React, { forwardRef, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  UniqueIdentifier,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SidebarItem,
  SidebarItemProps,
} from "@/components/workspace/sidebar-item";
import { Channel, Team } from "@repo/data";
import { RiDraggable } from "react-icons/ri";
import { clear } from "console";
import { Teamspaces } from "@/components/workspace/teamspaces";
import { Dir } from "@/components/workspace/dir";
import { useAppState } from "@repo/ui/store/store";

const channels = [
  {
    id: "1",
  },
  {
    id: "2",
  },
  {
    id: "3",
  },
  {
    id: "4",
  },
];

const channels2 = [
  {
    id: "5",
  },
  {
    id: "6",
  },
  {
    id: "7",
  },
  {
    id: "8",
  },
];

const teams: Team[] = [
  {
    id: "t1",
    name: "Team 1",
    dirs: [
      {
        id: "1d1",
        name: "Dir 1",
        channels: [
          {
            id: "1c1",
            name: "Channel 1",
            roles: [],
            avatar: "https://i.imgur.com/7V9b0e3.jpg",
            type: "text",
          },
        ],
      },
      {
        id: "1d2",
        name: "Dir 2",
        channels: [
          {
            id: "1c2",
            name: "Channel 2",
            roles: [],
            avatar: "https://i.imgur.com/7V9b0e3.jpg",
            type: "text",
          },
        ],
      },
    ],
    members: [],
    createdBy: "xx",
    tags: [],
  },
  {
    id: "t2",
    name: "Team 2",
    dirs: [
      {
        id: "2d1",
        name: "Dir 1",
        channels: [
          {
            id: "2c1",
            name: "Channel 1",
            roles: [],
            avatar: "https://i.imgur.com/7V9b0e3.jpg",
            type: "text",
          },
        ],
      },
      {
        id: "2d2",
        name: "Dir 2",
        channels: [
          {
            id: "2c2",
            name: "Channel 2",
            roles: [],
            type: "text",
            avatar: "https://i.imgur.com/7V9b0e3.jpg",
          },
        ],
      },
    ],
    members: [],
    createdBy: "xx",
    tags: [],
  },
];

export default function App() {
  const [items, setItems] = useState(channels);
  const [items2, setItems2] = useState(channels2);
  const [activeId, setActiveId] = useState<UniqueIdentifier>();

  const teamsId = useMemo(() => teams.map((t) => t.id), [teams]);

  const openDirs = useAppState((s) => s.openDirs);
  const setOpenDirs = useAppState((s) => s.actions.setOpenDirs);
  const openTeams = useAppState((s) => s.openTeams);
  const setOpenTeams = useAppState((s) => s.actions.setOpenTeams);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        tolerance: 5,
        delay: 250,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function onDragStart(e: DragStartEvent) {
    setActiveId(e.active.id);
  }

  function onDragOver(e: DragOverEvent) {
    console.log(e);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    console.log(over);

    if (!over) return;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex w-72 flex-col gap-2 bg-yellow-300 px-2 py-2">
        <Teamspaces teams={teams} />

        {/* <Teamspaces teams={teams}>

          <Accordion
            type="multiple"
            value={openDirs}
            onValueChange={setOpenDirs}
          >
            <Dir id="1">
              <SortableContext
                items={items2}
                strategy={verticalListSortingStrategy}
                id="amr2"
              >
                <ul className="flex h-fit flex-col gap-2">
                  {items2.map((c) => (
                    <SortableItem key={c.id} id={c.id} />
                  ))}
                </ul>
              </SortableContext>
            </Dir>

            <Dir id="2">
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
                id="amr"
              >
                <ul className="flex h-fit flex-col gap-2">
                  {items.map((c) => (
                    <SortableItem key={c.id} id={c.id} />
                  ))}
                </ul>
              </SortableContext>
            </Dir>
          </Accordion>
        </Teamspaces> */}
      </div>

      <DragOverlay>
        {activeId ? (
          <SidebarItem label="Test" noIcon className="bg-accent opacity-50">
            {activeId}
          </SidebarItem>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SidebarItem
      label="Test"
      id={id}
      ref={setNodeRef}
      style={style}
      noIcon
      className="gap-10 bg-accent"
    >
      {id}

      <div {...attributes} {...listeners} className="h-4 w-4 cursor-grab">
        <RiDraggable />
      </div>
    </SidebarItem>
  );
}

// const Item = forwardRef<HTMLLIElement, { id: string } & SidebarItemProps>(
//   ({ id, ...props }, ref) => {
//     return (
//       <SidebarItem
//         {...props}
//         ref={ref}
//         noIcon
//         label="Test"
//         className="bg-accent"
//       >
//         {id}
//       </SidebarItem>
//     );
//   },
// );

// Team sortable context
// each dir sortable context
