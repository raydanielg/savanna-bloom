import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Link as LinkIcon,
  Heading1,
  Heading2,
  Image as ImageIcon,
  MapPin,
  Calendar,
  X,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [showTools, setShowTools] = useState(false);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="relative group">
      {/* Floating Side Tools (Tripoto Style) */}
      <div className="absolute -left-14 top-0 flex flex-col gap-2 items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowTools(!showTools)}
          className={cn(
            "rounded-full w-10 h-10 border shadow-sm transition-all duration-300",
            showTools ? "bg-slate-900 text-white rotate-45" : "bg-white text-slate-400 hover:text-orange-500"
          )}
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        {showTools && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
             <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full bg-white shadow-sm hover:border-orange-500 hover:text-orange-500"
              title="Add Image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full bg-white shadow-sm hover:border-orange-500 hover:text-orange-500"
              title="Add Location"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 p-2 border-b bg-slate-50/50 backdrop-blur-sm sticky top-0 z-10 transition-all rounded-t-xl">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn("h-8 px-2 font-bold", editor.isActive('heading', { level: 1 }) && 'bg-slate-900 text-white')}
        >
          H1
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn("h-8 px-2 font-bold", editor.isActive('heading', { level: 2 }) && 'bg-slate-900 text-white')}
        >
          H2
        </Button>
        <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive('bold') && 'bg-slate-200 text-slate-900')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive('italic') && 'bg-slate-200 text-slate-900')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(editor.isActive('underline') && 'bg-slate-200 text-slate-900')}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(editor.isActive('bulletList') && 'bg-slate-200 text-slate-900')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(editor.isActive('orderedList') && 'bg-slate-200 text-slate-900')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(editor.isActive('blockquote') && 'bg-slate-200 text-slate-900')}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={cn(editor.isActive('link') && 'bg-slate-200 text-slate-900')}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            className="h-8 w-8 p-0"
          >
            <Undo className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            className="h-8 w-8 p-0"
          >
            <Redo className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-slate max-w-none min-h-[200px] p-4 focus:outline-none",
          className
        ),
      },
    },
  });

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
