import React, { useRef, useState, useEffect } from 'react';

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...', className = '' }) => {
  const [content, setContent] = useState(value || '');
  const editorRef = useRef(null);

  useEffect(() => {
    setContent(value || '');
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange(newContent);
    }
  };

  // Basic rich text formatting functions
  const format = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleInput(); // Update state after formatting
  };

  return (
    <div className={`border border-gray-300 rounded-lg shadow-sm ${className}`}>
      <div className="toolbar flex flex-wrap gap-2 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <button type="button" className="p-1 rounded hover:bg-gray-200" onClick={() => format('bold')} title="Bold"><b>B</b></button>
        <button type="button" className="p-1 rounded hover:bg-gray-200" onClick={() => format('italic')} title="Italic"><i>I</i></button>
        <button type="button" className="p-1 rounded hover:bg-gray-200" onClick={() => format('underline')} title="Underline"><u>U</u></button>
        <button type="button" className="p-1 rounded hover:bg-gray-200" onClick={() => format('insertOrderedList')} title="Ordered List"><ol>1.</ol></button>
        <button type="button" className="p-1 rounded hover:bg-gray-200" onClick={() => format('insertUnorderedList')} title="Unordered List"><ul>•</ul></button>
        <button type="button" className="p-1 rounded hover:bg-gray-200" onClick={() => format('createLink', prompt('Enter URL:'))} title="Link">🔗</button>
      </div>
      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleInput}
        className="editor-content min-h-[150px] p-3 outline-none text-gray-700 leading-relaxed"
        style={{ userSelect: 'text' }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {!content && <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none">{placeholder}</div>}
    </div>
  );
};

export default RichTextEditor;