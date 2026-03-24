"use client";

import { useEffect, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: RichTextEditorProps) {
  const [isReady, setIsReady] = useState(false);

  // Ініціалізуємо сучасний редактор
  const editor = useCreateBlockNote();

  // Завантажуємо старий HTML з бази і перетворюємо його на блоки (як у Notion)
  useEffect(() => {
    async function loadInitialHTML() {
      if (value) {
        // Парсимо HTML у структуру BlockNote
        const blocks = await editor.tryParseHTMLToBlocks(value);
        editor.replaceBlocks(editor.document, blocks);
      }
      setIsReady(true);
    }
    
    if (!isReady) {
      loadInitialHTML();
    }
  }, [editor, value, isReady]);

  return (
    // Фіксуємо мінімальну висоту, щоб було зручно писати
    <div className="border rounded-md bg-white min-h-125 py-4 cursor-text text-black">
      {!isReady ? (
        <div className="p-4 text-muted-foreground animate-pulse">
          Завантаження редактора...
        </div>
      ) : (
        <BlockNoteView
          editor={editor}
          theme="light"
          onChange={async () => {
            // Коли ти щось друкуєш, ми конвертуємо блоки назад у чистий HTML для нашої бази
            const html = await editor.blocksToHTMLLossy(editor.document);
            onChange(html);
          }}
        />
      )}
    </div>
  );
}