
import ExtensionKit from "@/components/editor/extensions/extension-kit";
import { useEditor } from "@tiptap/react";

interface UseEditorProps {
  content?: string;
  placeholder?: string;
}
export function useThreadEditor({ content, placeholder }: UseEditorProps = {}) {
  const editor = useEditor({
    content,

    extensions: [
      ...ExtensionKit({
        placeholder: placeholder || "What's happening?",
      }),
    ],
    editorProps: {
      attributes: {
        // autofocus: true,
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class:
          "outline-0 max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-4xl BlockEditor",
      },
    },
  });

  return editor;
}
