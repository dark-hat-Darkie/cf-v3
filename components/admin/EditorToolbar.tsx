"use client";

import type { Editor } from "@tiptap/react";

export function EditorToolbar({
  editor,
  onPickImage,
}: {
  editor: Editor | null;
  onPickImage: () => void;
}) {
  if (!editor) return <div className="adm-toolbar" />;

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    attrs ? editor.isActive(name, attrs) : editor.isActive(name);

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Enter URL", previous ?? "https://");
    if (href === null) return;
    if (href === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  return (
    <div className="adm-toolbar">
      <button title="Undo" className="adm-toolbar-btn" onClick={() => editor.chain().focus().undo().run()}>↶</button>
      <button title="Redo" className="adm-toolbar-btn" onClick={() => editor.chain().focus().redo().run()}>↷</button>
      <span className="adm-toolbar-sep" />
      <button title="Heading 2" className={`adm-toolbar-btn ${isActive("heading", { level: 2 }) ? "active" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button title="Heading 3" className={`adm-toolbar-btn ${isActive("heading", { level: 3 }) ? "active" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <button title="Heading 4" className={`adm-toolbar-btn ${isActive("heading", { level: 4 }) ? "active" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>H4</button>
      <span className="adm-toolbar-sep" />
      <button title="Bold" className={`adm-toolbar-btn ${isActive("bold") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
      <button title="Italic" className={`adm-toolbar-btn ${isActive("italic") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
      <button title="Underline" className={`adm-toolbar-btn ${isActive("underline") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
      <button title="Strike" className={`adm-toolbar-btn ${isActive("strike") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>
      <button title="Inline code" className={`adm-toolbar-btn ${isActive("code") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleCode().run()}>{"</>"}</button>
      <span className="adm-toolbar-sep" />
      <button title="Bullet list" className={`adm-toolbar-btn ${isActive("bulletList") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleBulletList().run()}>•</button>
      <button title="Numbered list" className={`adm-toolbar-btn ${isActive("orderedList") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
      <button title="Task list" className={`adm-toolbar-btn ${isActive("taskList") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleTaskList().run()}>☐</button>
      <button title="Quote" className={`adm-toolbar-btn ${isActive("blockquote") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleBlockquote().run()}>“</button>
      <button title="Code block" className={`adm-toolbar-btn ${isActive("codeBlock") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{ }</button>
      <span className="adm-toolbar-sep" />
      <button title="Link" className={`adm-toolbar-btn ${isActive("link") ? "active" : ""}`} onClick={setLink}>↗</button>
      <button title="Image" className="adm-toolbar-btn" onClick={onPickImage}>▦</button>
      <button title="Horizontal rule" className="adm-toolbar-btn" onClick={() => editor.chain().focus().setHorizontalRule().run()}>―</button>
      <span className="adm-toolbar-sep" />
      <button title="Highlight" className={`adm-toolbar-btn ${isActive("highlight") ? "active" : ""}`} onClick={() => editor.chain().focus().toggleHighlight().run()}>✎</button>
    </div>
  );
}
