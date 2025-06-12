import React from 'react';
import { DraggableUIElement } from '../types';
import { IconPlusCircle, IconTrash, IconXMark, IconCopy } from './ui/Icons'; // Assuming IconCopy is added or use alternative

interface ToolbarProps {
  onAddElement: (type: DraggableUIElement['type']) => void;
  selectedElementId: string | null;
  onDeleteSelected: () => void;
  onClearAll: () => void;
  // onDuplicateSelected?: () => void; // Future
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddElement,
  selectedElementId,
  onDeleteSelected,
  onClearAll,
}) => {
  return (
    <div 
        className="bg-slate-800/70 backdrop-blur-md p-2 flex items-center justify-between gap-2 border-b border-slate-700 shadow-md"
        style={{ height: '60px', position: 'relative', zIndex: 990 }} // Define toolbar height and stacking
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => onAddElement('button')}
          title="Add Button"
          className="p-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors flex items-center"
        >
          <IconPlusCircle className="w-4 h-4 mr-1" /> Button
        </button>
        <button
          onClick={() => onAddElement('card')}
          title="Add Card"
          className="p-2 text-sm bg-teal-500 hover:bg-teal-600 text-white rounded transition-colors flex items-center"
        >
          <IconPlusCircle className="w-4 h-4 mr-1" /> Card
        </button>
        <button
          onClick={() => onAddElement('panel')}
          title="Add Panel"
          className="p-2 text-sm bg-sky-500 hover:bg-sky-600 text-white rounded transition-colors flex items-center"
        >
          <IconPlusCircle className="w-4 h-4 mr-1" /> Panel
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* <button
          onClick={onDuplicateSelected}
          disabled={!selectedElementId}
          title="Duplicate Selected"
          className="p-2 text-sm bg-slate-600 hover:bg-slate-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <IconCopy className="w-4 h-4 mr-1" /> Duplicate
        </button> */}
        <button
          onClick={onDeleteSelected}
          disabled={!selectedElementId}
          title="Delete Selected"
          className="p-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <IconTrash className="w-4 h-4 mr-1" /> Delete
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all elements?')) {
              onClearAll();
            }
          }}
          title="Clear All Elements"
          className="p-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors flex items-center"
        >
          <IconXMark className="w-4 h-4 mr-1" /> Clear All
        </button>
      </div>
    </div>
  );
};