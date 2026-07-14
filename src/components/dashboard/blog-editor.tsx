"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, type EditorConfig } from "ckeditor5";
import {
  Alignment,
  Autoformat,
  BlockQuote,
  Bold,
  CodeBlock,
  Essentials,
  FontFamily,
  FontSize,
  Heading,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  RemoveFormat,
  SourceEditing,
  SpecialCharacters,
  Strikethrough,
  Table,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  Underline,
  WordCount,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

export default function BlogEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const config: EditorConfig = {
    licenseKey: "GPL",
    plugins: [
      Essentials,
      Paragraph,
      Heading,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      RemoveFormat,
      Link,
      List,
      ListProperties,
      BlockQuote,
      CodeBlock,
      HorizontalLine,
      Alignment,
      Indent,
      IndentBlock,
      Image,
      ImageToolbar,
      ImageCaption,
      ImageStyle,
      ImageInsert,
      ImageResize,
      Table,
      TableToolbar,
      TableProperties,
      TableCellProperties,
      MediaEmbed,
      Autoformat,
      FontFamily,
      FontSize,
      SourceEditing,
      SpecialCharacters,
      WordCount,
    ],
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "fontFamily",
        "fontSize",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "removeFormat",
        "|",
        "link",
        "insertImage",
        "insertTable",
        "mediaEmbed",
        "codeBlock",
        "blockQuote",
        "horizontalLine",
        "|",
        "bulletedList",
        "numberedList",
        "outdent",
        "indent",
        "alignment",
        "|",
        "sourceEditing",
      ],
    },
    heading: {
      options: [
        { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
        { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
        { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
        { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
      ],
    },
    image: {
      toolbar: [
        "imageTextAlternative",
        "toggleImageCaption",
        "imageStyle:inline",
        "imageStyle:wrapText",
        "imageStyle:breakText",
        "resizeImage",
      ],
    },
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
    link: { addTargetToExternalLinks: true },
    placeholder: "Write your blog post…",
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={config}
      onChange={(_event, editor) => onChange(editor.getData())}
    />
  );
}
