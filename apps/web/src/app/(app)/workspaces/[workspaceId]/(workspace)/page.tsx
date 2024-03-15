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
  Active,
  Over,
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
import { Channel, Dir, Team } from "@repo/data";
import { RiDraggable } from "react-icons/ri";
import { clear } from "console";
import { Teamspaces } from "@/components/workspace/teamspaces";
import { useAppState } from "@repo/ui/store/store";
import { produce } from "immer";
import {
  isDraggingFolderAtom,
  isDraggingTeamAtom,
  tempOpenDirsAtom,
  tempOpenTeamsAtom,
} from "./atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { set } from "lodash";

const teams: Team[] = [
  {
    id: "t1",
    name: "Team 1",
    dirs: [
      {
        id: "root-t1",
        name: "root",
        channels: [
          {
            id: "1c1",
            name: "Amr 1",
            roles: [],
            avatar: "https://i.imgur.com/7V9b0e3.jpg",
            type: "text",
          },
          {
            id: "1c11",
            name: "Maro 2",
            roles: [],
            avatar: "https://i.imgur.com/7V9b0e3.jpg",
            type: "text",
          },
        ],
      },
      {
        id: "1d1",
        name: "Dir 1",
        channels: [
          {
            id: "1c2",
            name: "Ali 1",
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
            id: "1c3",
            name: "Begz 2",
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
            name: "Omar 1",
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
            name: "Masry 2",
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
  {
    id: "t3",
    name: "Team 3",
    dirs: [
      {
        id: "3d1",
        name: "Dir 1",
        channels: [
          {
            id: "3c1",
            name: "Channel 1",
            roles: [],
            avatar: "https://i.imgur.com/7V9b0e3.jpg",
            type: "text",
          },
        ],
      },
      {
        id: "3d2",
        name: "Dir 2",
        channels: [
          {
            id: "3c2",
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
  const [items, setItems] = useState(teams);
  const [activeId, setActiveId] = useState<UniqueIdentifier>();
  const [activeChannel, setActiveChannel] = useState<Channel>();
  const openDirs = useAtomValue(tempOpenDirsAtom);
  const openTeams = useAtomValue(tempOpenTeamsAtom);
  const setIsDraggingFolder = useSetAtom(isDraggingFolderAtom);
  const setIsDraggingTeam = useSetAtom(isDraggingTeamAtom);

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

    if (e.active.data.current?.type === "team") {
      setIsDraggingTeam(true);
    }

    if (e.active.data.current?.type === "folder") {
      setIsDraggingFolder(true);
    }

    if (e.active.data.current?.type === "channel") {
      const team = items.find((t) => t.id === e.active.data.current?.teamId);
      const dir = team?.dirs.find(
        (d) => d.id === e.active.data.current?.folderId,
      );
      const channel = dir?.channels.find((c) => c.id === e.active.id);

      setActiveChannel(channel);
    }
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;
    const activeTeamId = active.data.current?.teamId as string;
    const overTeamId = over.data.current?.teamId as string;

    if (!activeType || !overType) return;

    // 1. Ordering channels within same folder
    if (activeType === "channel" && overType === "channel") {
      const activeFolderId = active.data.current?.folderId;
      const overFolderId = over.data.current?.folderId;

      const newItems = produce(items, (draft) => {
        if (activeFolderId === overFolderId) {
          const team = draft.find((t) => t.id === activeTeamId);
          if (team) {
            const dir = team.dirs.find((d) => d.id === overFolderId);
            if (dir) {
              const channels = dir.channels;
              const oldIndex = channels.findIndex((c) => c.id === active.id);
              const newIndex = channels.findIndex((c) => c.id === over.id);
              dir.channels = arrayMove(channels, oldIndex, newIndex);
            }
          }
        } else {
          const activeTeam = draft.find((t) => t.id === activeTeamId);
          const overTeam = draft.find((t) => t.id === overTeamId);

          if (activeTeam && overTeam) {
            const activeDir = activeTeam.dirs.find(
              (d) => d.id === activeFolderId,
            );
            const overDir = overTeam.dirs.find((d) => d.id === overFolderId);
            if (activeDir && overDir) {
              const channel = activeDir.channels.find(
                (c) => c.id === active.id,
              );
              if (channel) {
                activeDir.channels = activeDir.channels.filter(
                  (c) => c.id !== active.id,
                );
                overDir.channels.push(channel);
              }
            }
          }
        }

        return draft;
      });

      setItems(newItems);

      return;
    }

    if (activeType === "channel" && overType === "folder") {
      const activeFolderId = active.data.current?.folderId;

      // If the dir is not open remove it from its current dir
      if (!openDirs.includes(over.id as string)) {
        return;
      }

      const newItems = produce(items, (draft) => {
        const curTeam = draft.find((t) => t.id === activeTeamId);
        const overTeam = draft.find((t) => t.id === overTeamId);

        const curDir = curTeam?.dirs.find((d) => d.id === activeFolderId);
        const overDir = overTeam?.dirs.find((d) => d.id === over.id);

        if (curDir && overDir && activeChannel) {
          curDir.channels = curDir.channels.filter(
            (c) => c.id !== activeChannel.id,
          );

          overDir.channels.push(activeChannel);
        }

        return draft;
      });
      setItems(newItems);
    }

    if (activeType === "folder" && overType === "team") {
      if (!openTeams.includes(over.id as string)) {
        return;
      }
      const newItems = produce(items, (draft) => {
        const curTeam = draft.find((t) => t.id === activeTeamId);
        const overTeam = draft.find((t) => t.id === over.id);

        if (curTeam && overTeam) {
          const dir = curTeam.dirs.find((d) => d.id === active.id);
          if (dir) {
            curTeam.dirs = curTeam.dirs.filter((d) => d.id !== active.id);
            overTeam.dirs.push(dir);
          }
        }
      });

      setItems(newItems);
    }

    if (activeType === "folder" && overType === "folder") {
      if (activeTeamId === overTeamId) return;
      const newItems = produce(items, (draft) => {
        const activeTeam = draft.find((t) => t.id === activeTeamId);
        const overTeam = draft.find((t) => t.id === overTeamId);
        if (activeTeam && overTeam) {
          const dir = activeTeam.dirs.find((d) => d.id === active.id);
          if (dir) {
            activeTeam.dirs = activeTeam.dirs.filter((d) => d.id !== active.id);
            overTeam.dirs.push(dir);
          }
        }
      });

      setItems(newItems);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      setIsDraggingFolder(false);
      setIsDraggingTeam(false);
      return;
    }

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;
    const activeTeamId = active.data.current?.teamId as string;
    const overTeamId = over.data.current?.teamId as string;

    if (!activeType || !overType) {
      setIsDraggingFolder(false);
      setIsDraggingTeam(false);
      return;
    }

    // 1. Ordering channels within same folder
    if (activeType === "channel" && overType === "channel") {
      const activeFolderId = active.data.current?.folderId;
      const overFolderId = over.data.current?.folderId;

      const newItems = produce(items, (draft) => {
        if (activeFolderId === overFolderId) {
          const team = draft.find((t) => t.id === activeTeamId);
          if (team) {
            const dir = team.dirs.find((d) => d.id === overFolderId);
            if (dir) {
              const channels = dir.channels;
              const oldIndex = channels.findIndex((c) => c.id === active.id);
              const newIndex = channels.findIndex((c) => c.id === over.id);
              dir.channels = arrayMove(channels, oldIndex, newIndex);

              // TODO: CALL move channel -> to is folderId - NEW Index is position in new dir - use splice to insert a specific
              // console.log(
              //   "move channel",
              //   active.id,
              //   "from",
              //   activeDir,
              //   activeTeam,
              //   "to",
              //   activeFolderId,
              //   activeTeamId,
              //   newIndex,
              // );
            }
          }
        } else {
          const activeTeam = draft.find((t) => t.id === activeTeamId);
          const overTeam = draft.find((t) => t.id === overTeamId);

          if (activeTeam && overTeam) {
            const activeDir = activeTeam.dirs.find(
              (d) => d.id === activeFolderId,
            );
            const overDir = overTeam.dirs.find((d) => d.id === overFolderId);
            if (activeDir && overDir) {
              const channel = activeDir.channels.find(
                (c) => c.id === active.id,
              );
              if (channel) {
                activeDir.channels = activeDir.channels.filter(
                  (c) => c.id !== active.id,
                );
                overDir.channels.push(channel);
              }
            }
          }
        }

        return draft;
      });

      setItems(newItems);
    }

    if (activeType === "channel" && overType === "folder") {
      const activeFolderId = active.data.current?.folderId;

      const newItems = produce(items, (draft) => {
        const curTeam = draft.find((t) => t.id === activeTeamId);
        const overTeam = draft.find((t) => t.id === overTeamId);

        const curDir = curTeam?.dirs.find((d) => d.id === activeFolderId);
        const overDir = overTeam?.dirs.find((d) => d.id === over.id);

        if (curDir && overDir && activeChannel) {
          curDir.channels = curDir.channels.filter(
            (c) => c.id !== activeChannel.id,
          );

          overDir.channels.push(activeChannel);
        }

        return draft;
      });
      setItems(newItems);
    }

    if (activeType === "folder" && overType === "team") {
      const newItems = produce(items, (draft) => {
        const curTeam = draft.find((t) => t.id === activeTeamId);
        const overTeam = draft.find((t) => t.id === over.id);

        if (curTeam && overTeam) {
          const dir = curTeam.dirs.find((d) => d.id === active.id);
          if (dir) {
            curTeam.dirs = curTeam.dirs.filter((d) => d.id !== active.id);
            overTeam.dirs.push(dir);
          }
        }
      });

      setItems(newItems);
    }

    if (activeType === "folder" && overType === "folder") {
      // const oldIndex
      // setItems

      const newItems = produce(items, (draft) => {
        const team = draft.find((t) => t.id === activeTeamId);
        if (team) {
          const oldIndex = team.dirs.findIndex((d) => d.id === active.id);
          const newIndex = team.dirs.findIndex((d) => d.id === over.id);
          team.dirs = arrayMove(team.dirs, oldIndex, newIndex);
        }
      });

      setItems(newItems);
    }

    if (activeType === "team" && overType === "team") {
      const oldIndex = items.findIndex((t) => t.id === active.id);
      const newIndex = items.findIndex((t) => t.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }

    // Put channel in root directory for dropping in team
    if (activeType === "channel" && overType === "team") {
      const activeFolderId = active.data.current?.folderId;
      const newItems = produce(items, (draft) => {
        const curTeam = draft.find((t) => t.id === activeTeamId);
        const overTeam = draft.find((t) => t.id === over.id);

        const curDir = curTeam?.dirs.find((d) => d.id === activeFolderId);
        const overDir = overTeam?.dirs.find((d) => d.id === "root-" + over.id);

        if (curDir && overDir && activeChannel) {
          curDir.channels = curDir.channels.filter(
            (c) => c.id !== activeChannel.id,
          );

          overDir.channels.push(activeChannel);
        }

        return draft;
      });
      setItems(newItems);
    }

    setIsDraggingFolder(false);
    setIsDraggingTeam(false);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragCancel={() => setActiveId(undefined)}
      // onDragMove={(e) => console.log(e, "move")}
    >
      <div className="flex w-72 flex-col gap-2 bg-yellow-300 px-2 py-2">
        <Teamspaces teams={items} />
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
