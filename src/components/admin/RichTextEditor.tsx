import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Heading2, Heading3, Quote, List, ListOrdered, LinkIcon, Undo, Redo, RemoveFormatting } from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#07308D] underline',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert prose-slate focus:outline-none max-w-none min-h-[500px] w-full bg-transparent text-slate-900 dark:text-gray-300 px-2 py-4 text-base rounded-md placeholder-slate-400 dark:placeholder-white/20',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Handle external content updates (like on load)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const toggleLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-wrap gap-1 bg-white dark:bg-black border border-black/10 dark:border-white/10 p-2 rounded-lg sticky top-20 z-10 shadow-sm">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-[#07308D] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
          title="Heading"
        >
          <Heading3 size={16} />
        </button>
        <div className="w-px h-6 bg-black/10 dark:bg-white/10 my-auto mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-[#07308D] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-[#07308D] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('blockquote') ? 'bg-[#07308D] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
          title="Quote"
        >
          <Quote size={16} />
        </button>
        <div className="w-px h-6 bg-black/10 dark:bg-white/10 my-auto mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('bulletList') ? 'bg-[#07308D] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('orderedList') ? 'bg-[#07308D] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={toggleLink}
          className={`p-2 rounded-md transition-colors ${editor.isActive('link') ? 'bg-[#07308D] text-white' : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>
        <div className="w-px h-6 bg-black/10 dark:bg-white/10 my-auto mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors"
          title="Clear Formatting"
        >
          <RemoveFormatting size={16} />
        </button>
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            <Undo size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            <Redo size={16} />
          </button>
        </div>
      </div>
      
      {/* Editor Content Box */}
      <div className="rich-text-container w-full min-h-[500px] bg-transparent font-serif relative">
        <style dangerouslySetInnerHTML={{__html: `
          .rich-text-container .ProseMirror:focus {
            outline: none;
          }
          .rich-text-container .ProseMirror {
             min-height: 500px;
             font-size: 1.125rem;
             color: inherit;
          }
          .rich-text-container .ProseMirror p {
             margin-bottom: 1rem;
             line-height: 1.7;
          }
          .rich-text-container .ProseMirror h2 {
             font-size: 1.875rem;
             font-weight: bold;
             margin-top: 2rem;
             margin-bottom: 1rem;
             color: inherit;
          }
          .rich-text-container .ProseMirror h3 {
             font-size: 1.75rem;
             font-weight: 800;
             margin-top: 2.5rem;
             margin-bottom: 1.25rem;
             color: inherit;
             line-height: 1.2;
          }
          .rich-text-container .ProseMirror blockquote {
             border-left: 4px solid #07308D;
             padding-left: 1rem;
             margin-left: 0;
             font-style: italic;
             color: #94a3b8;
          }
        `}} />
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}
