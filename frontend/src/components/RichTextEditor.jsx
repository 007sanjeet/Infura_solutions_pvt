import React, { useState } from 'react';
import { Bold, Italic, List, Heading, Eye, Edit2 } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = 'Write description details...' }) => {
  const [activeTab, setActiveTab] = useState('edit'); // edit | preview

  const insertTag = (tagOpen, tagClose = '') => {
    const textarea = document.getElementById('rich-text-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    let replacement = '';
    if (tagOpen === 'ul') {
      replacement = `\n<ul>\n  <li>${selectedText || 'List item'}</li>\n</ul>\n`;
    } else if (tagOpen === 'li') {
      replacement = `<li>${selectedText || 'List item'}</li>`;
    } else {
      replacement = `${tagOpen}${selectedText || 'text'}${tagClose}`;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);
    
    // Reset focus and cursor position after input
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + tagOpen.length + (selectedText ? selectedText.length : 4);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  return (
    <div className="w-full border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm focus-within:border-gold transition-colors">
      {/* Editor Header / Toolbar */}
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => insertTag('<strong>', '</strong>')}
            className="p-1.5 rounded text-dark hover:bg-slate-200 transition-colors"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<em>', '</em>')}
            className="p-1.5 rounded text-dark hover:bg-slate-200 transition-colors"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h3>', '</h3>')}
            className="p-1.5 rounded text-dark hover:bg-slate-200 transition-colors"
            title="Heading"
          >
            <Heading size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertTag('ul')}
            className="p-1.5 rounded text-dark hover:bg-slate-200 transition-colors"
            title="Unordered List"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<li>', '</li>')}
            className="p-1.5 rounded text-dark hover:bg-slate-200 text-xs font-semibold transition-colors"
            title="List Item"
          >
            LI
          </button>
          <span className="h-4 w-px bg-slate-200 mx-1"></span>
          <button
            type="button"
            onClick={() => insertTag('<p>', '</p>')}
            className="p-1.5 rounded text-dark hover:bg-slate-200 text-xs font-semibold transition-colors"
            title="Paragraph"
          >
            P
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-200/60 p-0.5 rounded-md text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-sm font-medium transition-colors ${
              activeTab === 'edit'
                ? 'bg-white text-dark shadow-sm'
                : 'text-dark-muted hover:text-dark'
            }`}
          >
            <Edit2 size={12} />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-white text-dark shadow-sm'
                : 'text-dark-muted hover:text-dark'
            }`}
          >
            <Eye size={12} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="min-h-[220px]">
        {activeTab === 'edit' ? (
          <textarea
            id="rich-text-textarea"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[220px] p-4 text-sm font-mono text-slate-700 placeholder:text-slate-400 outline-none resize-y focus:ring-0 border-0"
          />
        ) : (
          <div
            className="prose prose-sm max-w-none p-6 min-h-[220px] overflow-y-auto text-sm text-dark-light"
            dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-400 italic">No description entered yet. Toggle Editor to type.</p>' }}
          />
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
