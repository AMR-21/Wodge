"use client";

import { lowlight } from "lowlight";
import YPartyKitProvider from "y-partykit/provider";

import { StarterKit } from "@tiptap/starter-kit";
import { Highlight } from "@tiptap/extension-highlight";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Emoji, gitHubEmojis } from "@tiptap-pro/extension-emoji";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Typography } from "@tiptap/extension-typography";
import { Color } from "@tiptap/extension-color";
import { FocusClasses as Focus } from "@tiptap/extension-focus";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { FileHandler } from "@tiptap-pro/extension-file-handler";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";

import { Selection } from "./selection";
import { AiWriter } from "./ai-writer";
// import { AiImage } from './ai-Image'
import { Table, TableCell, TableHeader, TableRow } from "./table";
import { HorizontalRule } from "./horizontal-rule";
import { Heading } from "./heading";
import { Document } from "./document";
import { TrailingNode } from "./trailing-node";
import { SlashCommand } from "./slash-command";
import { FontSize } from "./font-size";
import { Figure } from "./figure";
import { Figcaption } from "./fig-caption";
import { BlockquoteFigure } from "./blockquote-figure";
import { Quote } from "./blockquote-figure/quote";
import { QuoteCaption } from "./blockquote-figure/quote-caption";
import { Link } from "./link";
import { ImageUpload } from "./image-upload";
import { ImageBlock } from "./image-block";
import { Columns, Column } from "./multi-column";
import { emojiSuggestion } from "./emoji-suggestions";
import { TasksDB } from "./tasks";
import { AiPrompts } from "./ai";
import { API } from "@/lib/utils";

interface ExtensionKitProps {
  userId?: string;
  userName?: string;
  userColor?: string;
  placeholder?: string;
}

export const ExtensionKit = ({
  userId,
  userName = "Maxi",
  placeholder,
}: ExtensionKitProps) => [
  Document,
  Columns,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  AiWriter.configure({
    authorId: userId,
    authorName: userName,
  }),
  // AiImage.configure({
  //   authorId: userId,
  //   authorName: userName,
  // }),
  AiPrompts,
  Column,
  // Selection,
  Heading,
  HorizontalRule,
  TasksDB,
  StarterKit.configure({
    document: false,
    dropcursor: false,
    heading: false,
    horizontalRule: false,
    blockquote: false,
    history: false,
    codeBlock: false,
  }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: null,
  }),
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  TrailingNode,
  Link.configure({
    openOnClick: false,
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  CharacterCount.configure({ limit: 50000 }),
  ImageUpload,
  ImageBlock,
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    // onDrop: (currentEditor, files, pos) => {
    //   files.forEach(async () => {
    //     const url = await API.uploadImage();

    //     currentEditor.chain().setImageBlockAt({ pos, src: url }).focus().run();
    //   });
    // },
    // onPaste: (currentEditor, files) => {
    //   files.forEach(async () => {
    //     const url = await API.uploadImage();

    //     return currentEditor
    //       .chain()
    //       .setImageBlockAt({
    //         pos: currentEditor.state.selection.anchor,
    //         src: url,
    //       })
    //       .focus()
    //       .run();
    //   });
    // },
  }),
  Emoji.configure({
    enableEmoticons: true,
    emojis: gitHubEmojis,
    suggestion: emojiSuggestion,
  }),
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {};
    },
  }).configure({
    types: ["heading", "paragraph"],
  }),
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Typography,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: placeholder || "Write something, or / for commands",
  }),
  SlashCommand,
  Focus,
  Figcaption,
  BlockquoteFigure,
  Dropcursor.configure({
    width: 2,
    class: "ProseMirror-dropcursor border-black",
  }),
];

export default ExtensionKit;
