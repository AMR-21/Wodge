import { SafeDiv } from "@/components/safe-div";
import { SidebarItemBtn } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/_components/sidebar-item-btn";
import { Thread, ThreadMessage } from "@repo/data";
import { OfflineEditor, useThreadEditor } from "@repo/editor";
import { Button } from "@repo/ui/components/ui/button";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useEffect } from "react";

export function EditEditor({
  isQA = false,
  content,
  onSuccessEdit,
  onCancelEdit,
}: {
  isQA?: boolean;
  content: Thread | ThreadMessage;
  onSuccessEdit?: (text: string) => void;

  onCancelEdit?: () => void;
}) {
  const { user } = useCurrentUser();

  const editor = useThreadEditor({
    content: content.content,
    placeholder: isQA ? "What's your question?" : "What's happening?",
  });

  async function editThread() {
    const text = editor?.getHTML();
    if (!text || !user) return;

    onSuccessEdit?.(text);
  }

  useEffect(() => {
    if (editor && !editor.isFocused) editor.chain().focus("end").run();
  }, [editor]);

  return (
    <div className="flex w-full flex-1 flex-col bg-transparent p-0">
      <div
        className="flex h-full w-full items-start"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) {
            editThread();
          }
        }}
      >
        {!editor && <SafeDiv className="BlockEditor" html={content.content} />}
        <OfflineEditor editor={editor} isThread />
      </div>
      <div className="ml-0.5 flex items-center pl-8">
        <Button
          size="fit"
          variant="secondary"
          className="ml-auto mr-1.5 w-20"
          onClick={() => onCancelEdit?.()}
        >
          Cancel
        </Button>
        <Button
          size="fit"
          className="w-20"
          disabled={editor?.isEmpty}
          onClick={editThread}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
