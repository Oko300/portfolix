import React, { useRef, useEffect } from 'react';

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...', className = '' }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const format = (command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current.focus();
    handleInput();
  };

  return (
    <div className={`border border-gray-300 rounded-lg shadow-sm ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <button type="button" className="px-2 py-1 rounded hover:bg-gray-200 font-bold" onClick={() => format('bold')}>B</button>
        <button type="button" className="px-2 py-1 rounded hover:bg-gray-200 italic" onClick={() => format('italic')}>I</button>
        <button type="button" className="px-2 py-1 rounded hover:bg-gray-200 underline" onClick={() => format('underline')}>U</button>
        <button type="button" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => format('insertOrderedList')}>1.</button>
        <button type="button" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => format('insertUnorderedList')}>•</button>
        <button type="button" className="px-2 py-1 rounded hover:bg-gray-200" onClick={() => format('createLink', prompt('Enter URL:'))}>🔗</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        dir="ltr"
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-[150px] p-3 outline-none text-gray-700 leading-relaxed text-left"
        style={{ unicodeBidi: 'plaintext' }}
      />
    </div>
  );
};

export default RichTextEditor;
