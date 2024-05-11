import { Editor } from "@tiptap/react";
import { HorizontalRule } from "../../components/editor/extensions/horizontal-rule";
import { ImageBlock } from "../../components/editor/extensions/image-block";
import { ImageUpload } from "../../components/editor/extensions/image-upload";
import CodeBlock from "@tiptap/extension-code-block";
import { Link } from "../../components/editor/extensions/link";
import { AiWriter } from "../../components/editor/extensions/ai-writer";
import { Figcaption } from "../../components/editor/extensions/fig-caption";
import { TableOfContentsNode } from "../../components/editor/extensions/table-of-contents";

export const isTableGripSelected = (node: HTMLElement) => {
  let container = node;

  while (container && !["TD", "TH"].includes(container.tagName)) {
    container = container.parentElement!;
  }

  const gripColumn =
    container &&
    container.querySelector &&
    container.querySelector("a.grip-column.selected");
  const gripRow =
    container &&
    container.querySelector &&
    container.querySelector("a.grip-row.selected");

  if (gripColumn || gripRow) {
    return true;
  }

  return false;
};

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [
    HorizontalRule.name,
    ImageBlock.name,
    ImageUpload.name,
    CodeBlock.name,
    ImageBlock.name,
    Link.name,
    AiWriter.name,
    // AiImage.name,
    Figcaption.name,
    TableOfContentsNode.name,
  ];

  return (
    customNodes.some((type) => editor.isActive(type)) ||
    isTableGripSelected(node)
  );
};
