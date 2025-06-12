
import React from 'react';

interface ColorInputProps {
  label: string;
  value: string; // hex color
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={onChange}
          className="w-10 h-10 p-0 border-none rounded cursor-pointer bg-gray-600 appearance-none focus:ring-0 focus:outline-none"
          style={{backgroundColor: value}} // Show current color for non-supporting browsers
        />
        <input
            type="text"
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-200"
            />
      </div>
    </div>
  );
};
