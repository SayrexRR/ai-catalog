"use client"

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; 

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: RichTextEditorProps) {
  // Розширена панель інструментів (майже як у Word)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }], // Заголовки H1, H2, H3
      [{ 'size': ['small', false, 'large', 'huge'] }], // Розмір тексту
      ['bold', 'italic', 'underline', 'strike'], // Форматування
      [{ 'color': [] }, { 'background': [] }], // Колір тексту та фону
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Списки
      [{ 'align': [] }], // Вирівнювання (по центру, справа, зліва)
      ['link', 'clean'] // Посилання та очищення стилів
    ]
  };

  return (
    // Додаємо клас [&_.ql-editor]:min-h-[400px], щоб мінімальна висота поля для вводу була 400px
    <div className="rounded-md overflow-hidden border bg-white text-black [&_.ql-editor]:min-h-100 [&_.ql-editor]:text-base">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules} 
      />
    </div>
  );
}