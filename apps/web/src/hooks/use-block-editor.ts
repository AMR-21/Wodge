import { useMemo } from "react";

import { useEditor } from "@tiptap/react";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";

import YPartyKitProvider from "y-partykit/provider";
import { UserType } from "@repo/data";
import { randomElement, userColors } from "@/lib/utils";
import ExtensionKit from "@/components/editor/extensions/extension-kit";
import { EditorUser } from "@/components/editor/block-editor/types";

export const useBlockEditor = ({
  ydoc,
  provider,
  user,
}: {
  ydoc: Y.Doc;
  provider: YPartyKitProvider;
  user: UserType;
}) => {
  // console.log({ canEdit })
  const editor = useEditor(
    {
      // editable: canEdit,
      autofocus: true,
      extensions: [
        ...ExtensionKit({}),
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider,
          user: {
            username: user?.username,
            color: randomElement(userColors),
            avatar: user?.avatar,
            displayName: user?.displayName,
            userId: user?.id,
          } as Omit<EditorUser, "clientId">,
        }),
      ],
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full pr-8 pl-20 py-16 z-0 BlockEditor ",
        },
      },
    },
    [ydoc, provider],
  );

  const users = useMemo(() => {
    if (!editor?.storage.collaborationCursor?.users) {
      return [];
    }

    return editor.storage.collaborationCursor?.users.map((user: EditorUser) => {
      return { ...user };
    });
  }, [editor?.storage.collaborationCursor?.users]);

  const characterCount = editor?.storage.characterCount || {
    characters: () => 0,
    words: () => 0,
  };

  return {
    editor,
    users,
    characterCount,
  };
};
